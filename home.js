// home.js  – navbar profile dropdown + logout
document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelector('.nav-buttons');
    if (!navButtons) return;          // safety guard
  
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    if (!isLoggedIn) return;          // not logged-in ➜ leave “Hi Sign up” visible
  
    /* ----------- remove ALL sign-up buttons ----------- */
    navButtons
      .querySelectorAll('.signup-btn, #signupTrigger, #signupLink')
      .forEach(el => el.remove());
  
    /* ----------- build profile button + dropdown ------- */
    const profileWrapper = document.createElement('div');
    profileWrapper.className = 'profile-wrapper'; // for relative pos
  
    const profileBtn = document.createElement('button');
    profileBtn.type = 'button';
    profileBtn.className = 'btn profile-btn';
    profileBtn.innerHTML = '<i class="bi bi-person-circle"></i>';
  
    const menu = document.createElement('div');
    menu.className = 'profile-menu';
    menu.innerHTML = `
        <div class="profile-item" id="accountSettings">Account settings</div>
        <div class="profile-item" id="logoutBtn">Sign out</div>
    `;
  
    profileWrapper.appendChild(profileBtn);
    profileWrapper.appendChild(menu);
    navButtons.appendChild(profileWrapper);
  
    /* ---- toggle menu on icon click ---- */
    profileBtn.addEventListener('click', e => {
      e.stopPropagation();
      menu.classList.toggle('open');
    });
  
    /* ---- click outside closes menu ---- */
    document.body.addEventListener('click', () => menu.classList.remove('open'));
    menu.addEventListener('click', e => e.stopPropagation()); // keep menu open
  
    /* ---- sign-out ---- */
    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('loggedIn');   // clear stub session
      location.reload();                     // reload -> “Hi Sign up” returns
    });
  
    /* ---- placeholder account link ---- */
    document.getElementById('accountSettings')
            .addEventListener('click', () => alert('Account page – coming soon'));
  });
  /* ─── 1. Fetch catalogue & render listProduct ───────────────────────── */
async function loadCatalogue() {
  const res  = await fetch('/api/products');
  const data = await res.json();          // [{SKUID,Name,Price,Picture,Description}, …]

  const list = document.querySelector('.listProduct');
  const tpl  = list.querySelector('.item');    // first hard-coded card as template
  list.innerHTML = '';                         // clear existing demo cards

  data.forEach(p => {
    const node  = tpl.cloneNode(true);
    node.querySelector('img').src  = p.Picture;
    node.querySelector('img').alt  = p.Name;
    node.querySelector('h2 a').textContent = p.Name;
    node.querySelector('.price').textContent = `$${p.Price}`;
    node.querySelector('button').dataset.sku = p.SKUID;
    list.appendChild(node);
  });
}

/* ─── 2. Add-to-Cart handler (localStorage cartId) ─────────────────── */
async function attachAddToCart() {
  const list = document.querySelector('.listProduct');
  list.addEventListener('click', async e => {
    if (!e.target.matches('button')) return;
    const skuId = +e.target.dataset.sku;

    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
      // first time ➜ create cart
      const newCart = await fetch('/api/cart', { method:'POST', headers:{'Content-Type':'application/json'}, body:'{}' })
                            .then(r => r.json());
      cartId = newCart.cartId;
      localStorage.setItem('cartId', cartId);
    }

    // add item
    const res = await fetch(`/api/cart/${cartId}/items`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ skuId, qty: 1 })
    }).then(r => r.json());

    // update badge
    document.querySelector('.totalQuantity').textContent = res.totalQty;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadCatalogue();
  attachAddToCart();
});
