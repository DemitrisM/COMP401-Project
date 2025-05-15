/* cartdrawer.js – slide-out drawer + live REST cart */
const cartBtn    = document.querySelector('.cart-btn');
const cartDrawer = document.querySelector('.cart');
const closeBtn   = document.querySelector('.close');
const listEl     = document.querySelector('.listCart');
const badgeEl    = document.querySelector('.totalQuantity');

/* ─── open / close ─────────────────────────────── */
cartBtn.addEventListener('click', async () => {
  cartDrawer.classList.toggle('open');
  if (cartDrawer.classList.contains('open')) await renderCart();
});
closeBtn.addEventListener('click', () => cartDrawer.classList.remove('open'));

/* ─── delegate clicks for + / – inside the drawer ─*/
listEl.addEventListener('click', async e => {
  const btn   = e.target.closest('button[data-action]');
  if (!btn) return;

  const delta   = btn.dataset.action === 'inc' ? 1 : -1;
  const skuId   = +btn.dataset.sku;
  const cartId  = localStorage.getItem('cartId');
  if (!cartId) return;

  await fetch(`/api/cart/${cartId}/items`, {
    method : 'POST',
    headers: { 'Content-Type':'application/json' },
    body   : JSON.stringify({ skuId, qty: delta })
  });

  renderCart();                       // refresh the UI
});

/* ─── render the drawer ───────────────────────────*/
async function renderCart () {
  listEl.innerHTML = '<p style="padding:1rem">Loading…</p>';

  const cartId = localStorage.getItem('cartId');
  if (!cartId) {
    listEl.innerHTML = '<p style="padding:1rem">Your cart is empty.</p>';
    badgeEl.textContent = '0';
    return;
  }

  try {
    const rows = await fetch(`/api/cart/${cartId}/items`).then(r => r.json());

    if (!rows.length) {
      listEl.innerHTML = '<p style="padding:1rem">Your cart is empty.</p>';
      badgeEl.textContent = '0';
      return;
    }

    let totalQty = 0;
    const html = rows.map(r => {
      totalQty += r.Qty;
      return `
        <div class="item">
          <img   src="${r.Picture}" alt="">
          <div class="content">
            <div class="name">${r.Name}</div>
            <div class="price">$${r.Price} × ${r.Qty}</div>
          </div>
          <div class="quantity">
            <button data-action="dec" data-sku="${r.SKUID}">−</button>
            <span>${r.Qty}</span>
            <button data-action="inc" data-sku="${r.SKUID}">+</button>
          </div>
        </div>`;
    }).join('');

    listEl.innerHTML   = html;
    badgeEl.textContent = totalQty;
  } catch (err) {
    console.error('Cart fetch error', err);
    listEl.innerHTML = '<p style="padding:1rem;color:red">Can’t load cart.</p>';
  }
}
