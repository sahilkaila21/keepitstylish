const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const persistence = fs.readFileSync(path.join(root,'assets/storefront.js'),'utf8').split('function restoreRoute()')[0];
function setup(saved, blocked=false) {
  let stored = saved;
  const ctx = vm.createContext({document:{addEventListener(){}},localStorage:{
    getItem(){if(blocked) throw Error('Storage blocked'); return stored;},
    setItem(key,value){if(blocked) throw Error('Storage blocked'); stored=value;}
  }});
  vm.runInContext(script, ctx);
  vm.runInContext('updateBadge = function() {};',ctx);
  vm.runInContext(persistence, ctx);
  return {run:code=>vm.runInContext(code,ctx), stored:()=>stored};
}
const valid = {productId:'emerald-ruffle-midi',size:'M',color:'Emerald Green',quantity:2};
const saved = items=>JSON.stringify({savedAt:Date.now(),items});
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
  for(const match of html.matchAll(/assets\/[a-zA-Z0-9_./-]+\.(?:webp|svg|png|ico|css|js)/g))
    assert.ok(fs.existsSync(path.join(root,match[0])),match[0]);
});
