/* cartdrawer.js  ──────────────────────────────────────────────
   Shows cart drawer, pulls live items from /api/cart/:id/items
────────────────────────────────────────────────────────────────*/

const cartBtn     = document.querySelector('.cart-btn');  // icon in navbar
const cartDrawer  = document.querySelector('.cart');      // <div class="cart">
const closeBtn    = document.querySelector('.close');     // CLOSE button
const listEl      = document.querySelector('.listCart');  // container inside drawer
const badge       = document.querySelector('.totalQuantity');

/* ─── toggle drawer ───────────────────────────────────────── */
cartBtn.addEventListener('click', async () => {
  cartDrawer.classList.toggle('open');       // slide in/out
  if (cartDrawer.classList.contains('open')) await renderCart();
});
closeBtn.addEventListener('click', () => cartDrawer.classList.remove('open'));

/* ─── build drawer contents from DB ------------------------- */
async function renderCart () {
  listEl.innerHTML = '<p style="padding:1rem">Loading…</p>';

  const cartId = localStorage.getItem('cartId');
  if (!cartId) {
    listEl.innerHTML = '<p style="padding:1rem">Your cart is empty.</p>';
    badge.textContent = '0';
    return;
  }

  try {
    const rows = await fetch(`/api/cart/${cartId}/items`).then(r => r.json());

    if (!rows.length) {
      listEl.innerHTML = '<p style="padding:1rem">Your cart is empty.</p>';
      badge.textContent = '0';
      return;
    }

    /* build HTML */
    let html = '';
    let totalQty = 0;

    rows.forEach(r => {
      totalQty += r.Qty;
      html += `
        <div class="item">
          <img src="${r.Picture}" alt="">
          <div class="content">
            <div class="name">${r.Name}</div>
            <div class="price">$${r.Price} × ${r.Qty}</div>
          </div>
        </div>`;
    });

    listEl.innerHTML = html;
    badge.textContent = totalQty;

  } catch (err) {
    console.error('Cart fetch error', err);
    listEl.innerHTML = '<p style="padding:1rem;color:red">Can’t load cart.</p>';
  }
}
