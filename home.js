/* home.js
   ──────────────────────────────────────────────────────────
   • swaps Log-In ↔ user-icon
   • renders catalogue from   GET /api/products
   • adds items to the cart   POST /api/cart/:id/items
   • keeps the badge (.totalQuantity) in sync on page-load
   ────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  renderAuthUI();
  loadCatalogue();
  initCartHandler();
  syncCartCount();                 // ← NEW – show count on refresh
});

/* ─── 1.  NAVBAR AUTH ─────────────────────────────────────── */
function renderAuthUI () {
  const nav = document.querySelector('.nav-buttons');
  nav.innerHTML = '';

  if (localStorage.getItem('loggedIn') !== 'true') {
    nav.insertAdjacentHTML(
      'beforeend',
      `<a href="LoginPage.html" class="btn signup-btn" id="signupTrigger">Log In</a>`
    );
    return;
  }

  nav.insertAdjacentHTML('beforeend', `
    <div class="profile-wrapper">
      <button type="button" class="btn profile-btn" id="profileBtn">
        <i class="bi bi-person-circle"></i>
      </button>
      <div class="profile-menu" id="profileMenu">
        <div class="profile-item" id="accountSettings">Account settings</div>
        <div class="profile-item" id="logoutBtn">Log out</div>
      </div>
    </div>`);

  const btn  = nav.querySelector('#profileBtn');
  const menu = nav.querySelector('#profileMenu');

  btn.onclick           = e => { e.stopPropagation(); menu.classList.toggle('open'); };
  document.body.onclick = () => menu.classList.remove('open');
  menu.onclick          = e => e.stopPropagation();

  nav.querySelector('#logoutBtn').onclick = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('cartId');
    location.reload();
  };
}

/* ─── 2.  CATALOGUE  ──────────────────────────────────────── */
async function loadCatalogue () {
  const res   = await fetch('/api/products');
  const items = await res.json();

  const list  = document.getElementById('catalogue');
  const cardT = document.getElementById('productCard').content;

  list.innerHTML = '';

  items.forEach(p => {
    const node = cardT.cloneNode(true);
    node.querySelector('img').src                    = p.Picture;
    node.querySelector('img').alt                    = p.Name;
    node.querySelector('.product-link').textContent  = p.Name;
    node.querySelector('.price').textContent         = `$${p.Price}`;
    node.querySelector('button').dataset.sku         = p.SKUID;
    list.appendChild(node);
  });
}

/* ─── 3.  ADD-TO-CART  ────────────────────────────────────── */
function initCartHandler () {
  document.getElementById('catalogue')
          .addEventListener('click', async e => {
    if (!e.target.matches('button')) return;
    const skuId = +e.target.dataset.sku;

    let cartId = localStorage.getItem('cartId');
    if (!cartId) {                         // first item → create cart
      const { cartId: newId } = await fetch('/api/cart', { method:'POST' })
                                        .then(r => r.json());
      cartId = newId;
      localStorage.setItem('cartId', cartId);
    }

    // add / increment
    const { totalQty } = await fetch(`/api/cart/${cartId}/items`, {
      method : 'POST',
      headers: { 'Content-Type':'application/json' },
      body   : JSON.stringify({ skuId, qty: 1 })
    }).then(r => r.json());

    document.querySelector('.totalQuantity').textContent = totalQty;
  });
}

/* ─── 4.  BADGE ON PAGE-LOAD  ─────────────────────────────── */
async function syncCartCount () {
  const cartId = localStorage.getItem('cartId');
  if (!cartId) return;                         // nothing yet

  const items = await fetch(`/api/cart/${cartId}/items`).then(r => r.json());
  const total = items.reduce((s, it) => s + it.Qty, 0);
  document.querySelector('.totalQuantity').textContent = total;
}
