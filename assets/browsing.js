const productSelections = new Map();
let galleryIndex = 0;
function rememberProductSelection() {
  if (currentProduct) productSelections.set(currentProduct.id, {size:selSize,color:selColor?.name,image:galleryIndex});
}
function selectGalleryImage(index) {
  if (!currentProduct) return;
  galleryIndex = (index + currentProduct.imgs.length) % currentProduct.imgs.length;
  const image = document.getElementById('main-img');
  image.src = currentProduct.imgs[galleryIndex];
  image.srcset = `${currentProduct.imgs[galleryIndex].replace('-1280.webp','-640.webp')} 640w, ${currentProduct.imgs[galleryIndex]} 1280w`;
  image.sizes = '(max-width: 900px) 100vw, 55vw';
  image.alt = currentProduct.imageAlts?.[galleryIndex] || `${currentProduct.name} — view ${galleryIndex+1}`;
  document.querySelectorAll('.gallery-thumb').forEach((button,i)=>{
    button.classList.toggle('active',i===galleryIndex);
    button.setAttribute('aria-pressed',String(i===galleryIndex));
  });
  document.getElementById('gallery-counter').textContent = `Image ${galleryIndex+1} of ${currentProduct.imgs.length}`;
  document.querySelectorAll('[data-gallery-direction]').forEach(button=>{button.hidden=currentProduct.imgs.length<2;});
  rememberProductSelection();
}
function restoreProductSelection(product) {
  const saved = productSelections.get(product.id);
  const sizes = [...product.sizes,...(product.upcomingSizes||[])];
  if (saved && sizes.includes(saved.size)) {
    const button=[...document.querySelectorAll('.size-btn')].find(el=>el.dataset.size===saved.size);
    if (button) pickSize(button,saved.size);
  }
  selectGalleryImage(saved?.image || 0);
  const back=document.getElementById('size-guide-return');
  back.hidden=false; back.href='#'+product.id; back.textContent='← Back to '+product.name;
  document.getElementById('zoom-open').setAttribute('aria-label','Enlarge image of '+product.name);
}
const basePickSize=pickSize;
pickSize=function(button,size){basePickSize(button,size);rememberProductSelection();};
switchImg=function(button,src){selectGalleryImage(currentProduct.imgs.indexOf(src));};

const zoomDialog=document.getElementById('image-zoom');
const zoomImage=document.getElementById('zoom-image');
function renderZoom(){
  zoomImage.src=currentProduct.imgs[galleryIndex];
  zoomImage.alt=currentProduct.imageAlts?.[galleryIndex] || `${currentProduct.name} — view ${galleryIndex+1}`;
  document.getElementById('zoom-title').textContent=currentProduct.name;
  document.getElementById('zoom-counter').textContent=`Image ${galleryIndex+1} of ${currentProduct.imgs.length}`;
}
function openImageZoom(){
  if(!currentProduct) return;
  renderZoom(); zoomImage.classList.remove('magnified');
  document.getElementById('zoom-toggle').textContent='Zoom in';
  document.getElementById('zoom-toggle').setAttribute('aria-pressed','false');
  zoomDialog.showModal(); document.body.style.overflow='hidden';
}
zoomDialog.addEventListener('close',()=>{
  document.body.style.overflow='';
  if(document.getElementById('page-product').classList.contains('active')) document.getElementById('zoom-open').focus();
});
zoomDialog.addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft'||event.key==='ArrowRight') {event.preventDefault();selectGalleryImage(galleryIndex+(event.key==='ArrowRight'?1:-1));renderZoom();}
});
document.getElementById('zoom-toggle').addEventListener('click',event=>{
  const enlarged=zoomImage.classList.toggle('magnified');
  event.currentTarget.textContent=enlarged?'Fit image':'Zoom in';
  event.currentTarget.setAttribute('aria-pressed',String(enlarged));
});
document.querySelectorAll('[data-gallery-direction]').forEach(button=>button.addEventListener('click',()=>{
  selectGalleryImage(galleryIndex+Number(button.dataset.galleryDirection));
  if(zoomDialog.open) renderZoom();
}));
