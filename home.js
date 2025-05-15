/* ─────────────────────────────────────────────────────────────
   1.  Navbar - swap “Log In” with user icon when logged-in
   ────────────────────────────────────────────────────────────*/
document.addEventListener('DOMContentLoaded', () => {
  const navBtns   = document.querySelector('.nav-buttons');
  const loginLink = navBtns?.querySelector('.signup-btn');

  if (localStorage.getItem('loggedIn') === 'true') {
    loginLink?.remove();                               // hide Log In

    // build profile button and dropdown
    const wrapper = document.createElement('div');
    wrapper.className = 'profile-wrapper';
    wrapper.innerHTML = `
      <button type="button" class="btn profile-btn" id="profileBtn">
        <i class="bi bi-person-circle"></i>
      </button>
      <div class="profile-menu" id="profileMenu">
        <div class="profile-item" id="accountSettings">Account settings</div>
        <div class="profile-item" id="logoutBtn">Sign out</div>
      </div>`;
    navBtns.appendChild(wrapper);

    // toggle dropdown
    const btn  = wrapper.querySelector('#profileBtn');
    const menu = wrapper.querySelector('#profileMenu');
    btn.onclick = e => { e.stopPropagation(); menu.classList.toggle('open'); };
    document.body.onclick = () => menu.classList.remove('open');

    // logout
    wrapper.querySelector('#logoutBtn').onclick = () => {
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('cartId');
      location.reload();
    };
  }
});

/* ─────────────────────────────────────────────────────────────
   2.  Render catalogue from /api/products
   ────────────────────────────────────────────────────────────*/
async function loadCatalogue () {
  const res   = await fetch('/api/products');
  const items = await res.json();         // [{SKUID,Name,Price,Picture,Desc}]

  const list  = document.getElementById('catalogue');
  const cardT = document.getElementById('productCard').content;
  list.innerHTML = '';

  items.forEach(p => {
    const clone = cardT.cloneNode(true);
    clone.querySelector('img').src           = p.Picture;
    clone.querySelector('img').alt           = p.Name;
    clone.querySelector('.product-link').textContent = p.Name;
    clone.querySelector('.price').textContent        = `$${p.Price}`;
    clone.querySelector('button').dataset.sku        = p.SKUID;
    list.appendChild(clone);
  });
}

/* ─────────────────────────────────────────────────────────────
   3.  Add-to-Cart   (localStorage cartId + REST)
   ────────────────────────────────────────────────────────────*/
async function initCartHandler () {
  document.getElementById('catalogue')
          .addEventListener('click', async e => {
    if (!e.target.matches('button')) return;
    const skuId = +e.target.dataset.sku;

    // create cart if first time
    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
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

// kick it off
document.addEventListener('DOMContentLoaded', () => {
  loadCatalogue();
  initCartHandler();
});
  