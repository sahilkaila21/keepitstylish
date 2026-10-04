// Browser storage contains product selections only, never checkout personal data.
const CART_KEY = 'kis.cart.v1';
let restoringCart = false;
function saveCart() {
  if (restoringCart) return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify({savedAt: Date.now(), items: cart.map(item => ({
      productId: PRODUCTS.find(p => p.name === item.name)?.id,
      size: item.size, color: item.color, quantity: item.qty
    }))}));
  } catch (_) { /* Shopping still works if browser storage is unavailable. */ }
}
function restoreCart() {
  restoringCart = true;
  cart = [];
  let discarded = 0;
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || 'null');
    if (!saved || !Number.isFinite(saved.savedAt) || Date.now() - saved.savedAt > 30 * 86400000 || !Array.isArray(saved.items)) return;
    cart = [];
    for (const item of saved.items.slice(0, 100)) {
      const product = PRODUCTS.find(p => p.id === item?.productId);
      if (!product || !product.sizes.includes(item.size) || !product.colors.some(c => c.name === item.color) || !Number.isInteger(item.quantity) || item.quantity < 1) { discarded++; continue; }
      const id = `${product.id}-${item.size}-${item.color}`;
      const existing = cart.find(i => i.id === id);
      if (existing) existing.qty = Math.min(99, existing.qty + item.quantity);
      else cart.push({id, name: product.name, price: product.price, size: item.size, color: item.color, img: product.imgs[0], qty: Math.min(99, item.quantity)});
    }
  } catch (_) { cart = []; }
  finally { updateBadge(); restoringCart = false; }
  return discarded;
}
function parseStoreRoute(hash) {
  const [page, query = ''] = hash.replace(/^#/, '').split('?');
  const params = new URLSearchParams(query);
  return {page: page || 'home', query: (params.get('q') || '').trim().slice(0, 100), sort: ['asc','desc'].includes(params.get('sort')) ? params.get('sort') : 'newest'};
}
function collectionRoute(query = '', sort = 'newest') {
  const params = new URLSearchParams();
  if (query.trim()) params.set('q', query.trim().slice(0, 100));
  if (['asc','desc'].includes(sort)) params.set('sort', sort);
  return '#collections' + (params.size ? '?' + params.toString() : '');
}
function navigateCollection(query = '', sort = 'newest') {
  const route = collectionRoute(query, sort);
  if (location.hash !== route) history.pushState(null, '', route);
  restoreRoute();
}
function renderCollectionRoute() {
  const state = parseStoreRoute(location.hash);
  const query = state.query.toLowerCase();
  filteredProducts = PRODUCTS.filter(p => !query || [p.name,p.desc,p.cat,...p.colors.map(c=>c.name)].some(value=>value.toLowerCase().includes(query)));
  const list = [...filteredProducts];
  if (state.sort === 'asc') list.sort((a,b)=>a.price-b.price);
  if (state.sort === 'desc') list.sort((a,b)=>b.price-a.price);
  document.getElementById('coll-label').textContent = query ? 'Search Results' : 'Explore';
  document.getElementById('coll-heading').textContent = query ? 'Results for “'+state.query+'”' : 'Our Dresses';
  document.querySelector('.sort-select').value = state.sort;
  document.getElementById('clear-search').hidden = !query;
  renderCollections(list);
  document.title = (query ? 'Search: '+state.query : 'Our Dresses')+' | Keep It Stylish';
}
function restoreRoute() {
  if (location.hash === '#main-content') { document.getElementById('main-content').focus(); return; }
  restoringRoute = true;
  const requested = parseStoreRoute(location.hash).page;
  const route = requested === 'confirmation' ? 'home' : requested;
  const product = PRODUCTS.find(p => p.id === route);
  if (product) openProduct(product.id);
  else showPage(route !== 'product' && document.getElementById('page-' + route) ? route : 'not-found');
  restoringRoute = false;
}
window.addEventListener('hashchange', restoreRoute);
window.addEventListener('storage', event => {
  if (event.key !== CART_KEY && event.key !== null) return;
  const discarded = restoreCart();
  if (document.getElementById('page-checkout').classList.contains('active')) showPage('cart');
  else if (document.getElementById('page-cart').classList.contains('active')) renderCart();
  showToast(discarded ? 'Bag updated. Unavailable selections were removed.' : 'Bag updated from another tab using current catalog prices.');
});

function refreshCartWithFocus(label) {
  updateBadge(); renderCart();
  const target = [...document.querySelectorAll('#cart-items button')].find(button => button.getAttribute('aria-label') === label);
  if (target) target.focus();
  else { const heading=document.getElementById('cart-title'); heading.tabIndex=-1; heading.focus(); }
}

// Native links retain open-in-new-tab behavior for products and policy navigation.
document.querySelectorAll('.footer-link[onclick], .nav-link[onclick], .mobile-nav-link[onclick]').forEach(button => {
  const match = button.getAttribute('onclick').match(/showPage\('([^']+)'\)/);
  if (!match) return;
  if (match[1] === 'account') { button.remove(); return; }
  const link = document.createElement('a');
  link.className = button.className;
  link.href = '#' + match[1];
  link.innerHTML = button.innerHTML;
  if (match[1] === 'track-order') link.textContent = 'Order assistance';
  if (button.getAttribute('aria-label')) link.setAttribute('aria-label', button.getAttribute('aria-label'));
  button.replaceWith(link);
});

for (const [key, id] of Object.entries(FIELD_MAP)) {
  const input = document.getElementById(id);
  if (!input) continue;
  input.setAttribute('aria-describedby', ERR_MAP[key]);
  input.setAttribute('aria-required', String(key !== 'phone' && !['billingState','billingPostal'].includes(key)));
  const autocomplete = ({firstName:'shipping given-name',lastName:'shipping family-name',email:'email',phone:'tel',address:'shipping address-line1',city:'shipping address-level2',state:'shipping address-level1',pin:'shipping postal-code'})[key];
  if (autocomplete) input.autocomplete = autocomplete;
  if (key === 'phone') input.setAttribute('aria-describedby', 'phone-help '+ERR_MAP[key]);
  document.getElementById(ERR_MAP[key])?.setAttribute('aria-live', 'polite');
}
const originalFieldError = showFieldErr;
showFieldErr = function(field, message) {
  originalFieldError(field, message);
  document.getElementById(FIELD_MAP[field])?.setAttribute('aria-invalid', String(Boolean(message)));
};
const originalValidate = validateAll;
validateAll = function() {
  const valid = originalValidate();
  if (!valid) document.querySelector('#co-step1 [aria-invalid="true"]')?.focus();
  return valid;
};

// Dialog focus remains inside an open menu/search and returns to its trigger.
let dialogReturnFocus = null;
function focusDialog(id) {
  const dialog = document.getElementById(id);
  dialogReturnFocus = document.activeElement;
  setPageInert(id);
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-label', id === 'search-overlay' ? 'Search dresses' : 'Navigation');
  dialog.querySelector('input, button, a')?.focus();
}
const oldOpenSearch = openSearch, oldCloseSearch = closeSearch, oldMobileMenu = toggleMobileMenu;
function setPageInert(dialogId) {
  document.querySelectorAll('nav,main,footer,.preview-banner,.skip-link').forEach(el => { el.inert = Boolean(dialogId); });
}
openSearch = function() { oldOpenSearch(); focusDialog('search-overlay'); };
closeSearch = function() {
  const wasOpen = document.getElementById('search-overlay').style.display === 'flex';
  oldCloseSearch();
  if (wasOpen) setPageInert(null);
  if (wasOpen) dialogReturnFocus?.focus();
};
toggleMobileMenu = function(open) {
  const wasOpen = document.getElementById('mobile-menu').style.display === 'flex';
  oldMobileMenu(open);
  if (!open && wasOpen) setPageInert(null);
  document.getElementById('hamburger-btn')?.setAttribute('aria-expanded', String(open));
  if (open) focusDialog('mobile-menu');
  else if (wasOpen) dialogReturnFocus?.focus();
};
document.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const dialog = ['search-overlay','mobile-menu'].map(id => document.getElementById(id)).find(el => el.style.display === 'flex');
  if (!dialog) return;
  const targets = [...dialog.querySelectorAll('a,button,input,[tabindex="0"]')].filter(el => !el.disabled && el.getClientRects().length);
  const first = targets[0], last = targets[targets.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
});

document.querySelector('.shipping-note').innerHTML = '<strong>Before you choose</strong><p>Online ordering is not open yet. Shipping rates and delivery estimates are being finalized.</p><div class="product-help"><a href="#size-guide">Size guide</a><a href="#shipping">Shipping</a><a href="#returns">Returns</a><a href="#contact">Ask a question</a></div>';
document.getElementById('hamburger-btn')?.setAttribute('aria-expanded', 'false');
document.querySelectorAll('#mobile-menu .mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => toggleMobileMenu(false));
});
document.getElementById('size-grid').setAttribute('role', 'group');
document.getElementById('size-grid').setAttribute('aria-label', 'Choose a size');
document.getElementById('size-grid').setAttribute('aria-describedby', 'size-error size-availability');
updateBillingRequirements();
