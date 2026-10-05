const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
const catalog = fs.readFileSync(path.join(root,'assets/catalog.js'),'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const persistence = fs.readFileSync(path.join(root,'assets/storefront.js'),'utf8').split('function restoreRoute()')[0];
function setup(saved, blocked=false) {
  let stored = saved;
  const ctx = vm.createContext({URLSearchParams,document:{addEventListener(){}},localStorage:{
    getItem(){if(blocked) throw Error('Storage blocked'); return stored;},
    setItem(key,value){if(blocked) throw Error('Storage blocked'); stored=value;}
  }});
  vm.runInContext(catalog, ctx);
  vm.runInContext(script, ctx);
  vm.runInContext('updateBadge = function() {};',ctx);
  vm.runInContext(persistence, ctx);
  return {run:code=>vm.runInContext(code,ctx), stored:()=>stored};
}
const valid = {productId:'emerald-ruffle-midi',size:'M',color:'Emerald Green',quantity:2};
const saved = items=>JSON.stringify({savedAt:Date.now(),items});

test('catalog IDs, variants and responsive image descriptions are complete',()=>{
  const app=setup(null);
  const products=JSON.parse(app.run('JSON.stringify(PRODUCTS)'));
  assert.equal(new Set(products.map(p=>p.id)).size,products.length);
  for(const product of products){
    assert.match(product.id,/^[a-z0-9-]+$/);
    assert.ok(Number.isFinite(product.price)&&product.price>0,product.id);
    assert.equal(new Set(product.sizes).size,product.sizes.length);
    assert.equal(product.imgs.length,product.imageAlts.length);
    for(const image of product.imgs){
      assert.match(image,/^assets\/products\/[a-z0-9-]+-1280\.webp$/);
      assert.ok(fs.existsSync(path.join(root,image.replace('-1280.webp','-640.webp'))),image);
    }
  }
});

test('unknown routes recover visibly without displaying an order confirmation',()=>{
  const app=setup(null);
  const source=fs.readFileSync(path.join(root,'assets/storefront.js'),'utf8');
  app.run(source.slice(source.indexOf('function restoreRoute()'),source.indexOf("window.addEventListener('hashchange'")));
  app.run(`var destination=''; location={hash:''}; document.getElementById=id=>id==='page-home'?{}:null; showPage=page=>{destination=page};`);
  for(const [hash,page] of [['#missing-link','not-found'],['#product','not-found'],['#confirmation','home']]){
    app.run(`location.hash=${JSON.stringify(hash)};restoreRoute()`);
    assert.equal(app.run('destination'),page);
    assert.equal(app.run('restoringRoute'),false);
  }
});

test('failed gallery image offers recovery and successful load enables zoom again',()=>{
  const app=setup(null);
  app.run(fs.readFileSync(path.join(root,'assets/enhancements.js'),'utf8').split("document.addEventListener('error'")[0]);
  app.run(`
    var message=null, failed=false;
    var container={disabled:false,classList:{toggle(name,value){failed=value},contains(){return false}},querySelector(){return message},append(value){message=value}};
    document.createElement=()=>({setAttribute(){},remove(){message=null}});
    var image={id:'main-img',closest(){return container}};
    setPhotoFailure(image,true);
  `);
  assert.equal(app.run('failed'),true);
  assert.equal(app.run('container.disabled'),true);
  assert.match(app.run('message.textContent'),/Try another gallery view/);
  app.run('setPhotoFailure(image,false)');
  assert.equal(app.run('message'),null);
  assert.equal(app.run('container.disabled'),false);
});

test('gallery navigation wraps across added views and updates image descriptions',()=>{
  const app=setup(null);
  app.run(`
    var elements={}, thumbs=[];
    document.getElementById=id=>elements[id]||(elements[id]={});
    document.querySelectorAll=selector=>selector==='.gallery-thumb'?thumbs:[];
    currentProduct=PRODUCTS[0];
  `);
  app.run(fs.readFileSync(path.join(root,'assets/browsing.js'),'utf8').split('function restoreProductSelection')[0]);
  app.run('selectGalleryImage(-1)');
  assert.equal(app.run('galleryIndex'),app.run('currentProduct.imgs.length-1'));
  assert.equal(app.run('elements["main-img"].alt'),app.run('currentProduct.imageAlts.at(-1)'));
  app.run('selectGalleryImage(galleryIndex+1)');
  assert.equal(app.run('galleryIndex'),0);
  assert.equal(app.run('elements["gallery-counter"].textContent'),app.run('"Image 1 of "+currentProduct.imgs.length'));
  assert.ok(app.run('elements["main-img"].srcset').includes('-640.webp'));
});
test('restored cart uses catalog price and content, never stored HTML or price',()=>{
  const app=setup(saved([{...valid,price:0.01,name:'<img onerror=alert(1)>',img:'evil'}]));
  app.run('restoreCart()');
  assert.equal(app.run('cart[0].price'),54.99);
  assert.equal(app.run('cart[0].name'),'Emerald Ruffle Tier Midi Dress');
  assert.equal(app.run('cart[0].qty'),2);
});
test('unknown, upcoming, malformed, negative and fractional selections are discarded',()=>{
  const app=setup(saved([null,{...valid,productId:'unknown'},{...valid,size:'XS'},{...valid,color:'unknown'},{...valid,quantity:-1},{...valid,quantity:1.5},valid]));
  app.run('restoreCart()');
  assert.equal(app.run('cart.length'),1);
});
test('duplicates merge and restored quantities stay bounded',()=>{
  const app=setup(saved([valid,{...valid,quantity:999}])); app.run('restoreCart()');
  assert.equal(app.run('cart.length'),1); assert.equal(app.run('cart[0].qty'),99);
});
test('expired or corrupt storage does not prevent browsing',()=>{
  for(const value of ['{broken',JSON.stringify({savedAt:Date.now()-31*86400000,items:[valid]})]){
    const app=setup(value); assert.doesNotThrow(()=>app.run('restoreCart()')); assert.equal(app.run('cart.length'),0);
  }
});
test('blocked browser storage does not throw when reading or saving',()=>{
  const app=setup(null,true); assert.doesNotThrow(()=>app.run('restoreCart();saveCart()'));
});
test('saved selections omit payment and customer information',()=>{
  const app=setup(saved([valid])); app.run('restoreCart();saveCart()');
  const stored=JSON.parse(app.stored());
  assert.deepEqual(Object.keys(stored.items[0]).sort(),['color','productId','quantity','size']);
});
test('checkout accepts accented and short names and short valid street addresses',()=>{
  const app=setup(null);
  for(const code of ["VALIDATORS.firstName('É')","VALIDATORS.lastName('李')","VALIDATORS.address('1 A St')"])
    assert.equal(app.run(code),'');
  assert.notEqual(app.run("VALIDATORS.firstName(' ')") ,'');
});
test('displayed asset references exist',()=>{
  for(const match of (html+catalog).matchAll(/assets\/[a-zA-Z0-9_./-]+\.(?:webp|svg|png|ico|css|js)/g))
    assert.ok(fs.existsSync(path.join(root,match[0])),match[0]);
});

test('restoring an empty bag clears existing selections without writing back',()=>{
  const app=setup(null);
  app.run('cart=[{id:"stale",qty:1}]; updateBadge=function(){saveCart()}; restoreCart()');
  assert.equal(app.run('cart.length'),0);
  assert.equal(app.stored(),null);
  assert.equal(app.run('restoringCart'),false);
});
test('restoration reports invalid selections and does not extend saved expiry',()=>{
  const original=saved([valid,{...valid,size:'invalid'}]);
  const app=setup(original);
  app.run('updateBadge=function(){saveCart()}');
  assert.equal(app.run('restoreCart()'),1);
  assert.equal(app.stored(),original);
});
test('all inline and external storefront scripts parse',()=>{
  for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);
  for(const file of ['catalog.js','storefront.js','browsing.js','enhancements.js']) new vm.Script(fs.readFileSync(path.join(root,'assets',file),'utf8'));
});
test('static IDs are unique and labels reference actual controls',()=>{
  const markup=html.replace(/<script[\s\S]*?<\/script>/g,'');
  const ids=[...markup.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,'Duplicate element IDs');
  for(const match of markup.matchAll(/\bfor="([^"]+)"/g)) assert.ok(ids.includes(match[1]),match[1]);
});
test('static hash links and navigation targets resolve',()=>{
  const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
  const app=setup(null);
  const products=JSON.parse(app.run('JSON.stringify(PRODUCTS.map(p=>p.id))'));
  for(const match of html.matchAll(/href="#([a-z-]+)"/g)) assert.ok(ids.has(match[1])||ids.has('page-'+match[1])||products.includes(match[1]),match[1]);
  for(const match of html.matchAll(/showPage\('([a-z-]+)'\)/g)) assert.ok(ids.has('page-'+match[1]),match[1]);
});
test('responsive product images meet local transfer budgets',()=>{
  const dir=path.join(root,'assets/products');
  for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.webp'))){
    assert.ok(fs.statSync(path.join(dir,file)).size < (file.includes('-640')?110000:210000),file);
  }
});

test('collection routes safely round-trip searches and preserve sort',()=>{
  const app=setup(null);
  const query='coral & green <dress> #1';
  const route=app.run(`collectionRoute(${JSON.stringify(query)},'desc')`);
  const state=JSON.parse(app.run(`JSON.stringify(parseStoreRoute(${JSON.stringify(route)}))`));
  assert.deepEqual(state,{page:'collections',query,sort:'desc'});
});
test('route parsing normalizes empty and unsupported input',()=>{
  const app=setup(null);
  assert.equal(app.run("parseStoreRoute('').page"),'home');
  assert.equal(app.run("parseStoreRoute('#collections?sort=untrusted').sort"),'newest');
  assert.equal(app.run("collectionRoute('   ')") ,'#collections');
  assert.equal(app.run("parseStoreRoute('#collections?q='+ 'x'.repeat(200)).query.length"),100);
});

test('missing size focuses a selectable option and leaves bag unchanged',()=>{
  const app=setup(null);
  app.run(`
    currentProduct=PRODUCTS[0]; selColor=currentProduct.colors[0]; selSize='';
    var sizeError={style:{display:'none'}}, focusedSize=false;
    document.getElementById=()=>sizeError;
    document.querySelector=()=>({focus(){focusedSize=true}});
    addToCart();
  `);
  assert.equal(app.run('cart.length'),0);
  assert.equal(app.run('sizeError.style.display'),'block');
  assert.equal(app.run('focusedSize'),true);
});
test('empty bag cannot advance to payment validation',()=>{
  const app=setup(null);
  app.run(`var destination=''; showPage=page=>{destination=page}; validateAll=()=>{throw Error('Must not validate empty checkout')}; goToPayment();`);
  assert.equal(app.run('destination'),'cart');
});

test('phone is optional and ZIP+4 remains valid for US shipping',()=>{
  const app=setup(null);
  assert.equal(app.run("VALIDATORS.phone('')"),'');
  assert.equal(app.run("VALIDATORS.phone('+1 (202) 555-0100')"),'');
  assert.notEqual(app.run("VALIDATORS.phone('123')"),'');
  assert.equal(app.run("VALIDATORS.pin('10001-1234')"),'');
  assert.notEqual(app.run("VALIDATORS.pin('1000')"),'');
});

test('correcting a checkout field removes its stale error description',()=>{
  const app=setup(null);
  app.run(`
    var inputClasses=new Set(), errorClasses=new Set();
    var input={classList:{add:v=>inputClasses.add(v),remove:v=>inputClasses.delete(v)}};
    var error={textContent:'',classList:{add:v=>errorClasses.add(v),remove:v=>errorClasses.delete(v)}};
    document.getElementById=id=>id==='f-firstName'?input:id==='e-firstName'?error:null;
    showFieldErr('firstName','First name is required');
  `);
  assert.equal(app.run('error.textContent'),'First name is required');
  assert.equal(app.run("errorClasses.has('visible')"),true);
  app.run("showFieldErr('firstName','')");
  assert.equal(app.run('error.textContent'),'');
  assert.equal(app.run("errorClasses.has('visible') || inputClasses.has('err')"),false);
});
test('same-as-shipping skips hidden billing fields but separate billing requires them',()=>{
  const app=setup(null);
  app.run(`
    var same=true, errors={};
    var values={firstName:'É',lastName:'李',email:'preview@example.com',phone:'',address:'1 Test St',city:'A',state:'New York',pin:'10001'};
    document.getElementById=()=>({checked:same});
    getVal=field=>values[field]||'';
    showFieldErr=(field,message)=>{errors[field]=message};
  `);
  assert.equal(app.run('validateAll()'),true);
  assert.equal(app.run("Object.keys(errors).some(key=>key.startsWith('billing'))"),false);
  app.run('same=false');
  assert.equal(app.run('validateAll()'),false);
  assert.equal(app.run('errors.billingAddress'),'Billing street address is required');
});
test('US billing checks state and ZIP while other billing countries allow flexible region formats',()=>{
  const app=setup(null);
  app.run("getVal=()=> 'United States'");
  assert.equal(app.run("VALIDATORS.billingState('NY')"),'');
  assert.equal(app.run("VALIDATORS.billingState('New York')"),'');
  assert.notEqual(app.run("VALIDATORS.billingState('ZZ')"),'');
  assert.notEqual(app.run("VALIDATORS.billingPostal('')"),'');
  app.run("getVal=()=> 'Ireland'");
  assert.equal(app.run("VALIDATORS.billingState('')"),'');
  assert.equal(app.run("VALIDATORS.billingPostal('D02 X285')"),'');
});
