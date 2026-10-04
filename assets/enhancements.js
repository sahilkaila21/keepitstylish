// A failed photo keeps its reserved layout space and offers a clear recovery path.
function setPhotoFailure(image, failed) {
  const container = image.closest('.gallery-main,.product-img-wrap,.zoom-canvas');
  if (!container) return;
  container.classList.toggle('media-failed', failed);
  let message = container.querySelector('.media-fallback');
  if (failed && !message) {
    message = document.createElement('span');
    message.className = 'media-fallback';
    message.setAttribute('role', 'status');
    message.textContent = container.classList.contains('product-img-wrap')
      ? 'Photo unavailable. Open the dress details to see other views.'
      : 'Photo unavailable. Try another gallery view or contact us for help.';
    container.append(message);
  }
  if (!failed) message?.remove();
  if (image.id === 'main-img') container.disabled = failed;
}
document.addEventListener('error', event => {
  if (event.target instanceof HTMLImageElement) setPhotoFailure(event.target, true);
}, true);
document.addEventListener('load', event => {
  if (event.target instanceof HTMLImageElement) setPhotoFailure(event.target, false);
}, true);

// Metadata helps browser descriptions; hash routes still need separate production URLs.
const previewDescription = document.querySelector('meta[name="description"]').content;
function updatePreviewDescription() {
  const route = parseStoreRoute(location.hash).page;
  const product = PRODUCTS.find(item => item.id === route);
  document.querySelector('meta[name="description"]').content = product
    ? `${product.name}. ${product.desc} Online ordering opens soon.`
    : previewDescription;
}
window.addEventListener('hashchange', updatePreviewDescription);
updatePreviewDescription();
