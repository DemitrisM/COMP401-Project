/* checkout.js – show current cart and totals on checkout.html */

const listEl   = document.querySelector('.returnCart .list');
const qtyEl    = document.querySelector('.totalQuantity');
const priceEl  = document.querySelector('.totalPrice');

loadCheckout();

/* ─────────────────────────────────────────────── */
async function loadCheckout () {
  const cartId = localStorage.getItem('cartId');
  if (!cartId) {
    listEl.innerHTML = '<p style="padding:1rem">Your cart is empty.</p>';
    qtyEl.textContent   = '0';
    priceEl.textContent = '$0';
    return;
  }

  try {
    const rows = await fetch(`/api/cart/${cartId}/items`).then(r => r.json());

    if (!rows.length) {
      listEl.innerHTML = '<p style="padding:1rem">Your cart is empty.</p>';
      qtyEl.textContent   = '0';
      priceEl.textContent = '$0';
      return;
    }

    let totalQty = 0;
    let totalPrice = 0;
    const html = rows.map(r => {
      totalQty   += r.Qty;
      totalPrice += r.lineTotal;
      return `
        <div class="item">
          <img src="${r.Picture}">
          <div class="info">
            <div class="name">${r.Name}</div>
            <div class="price">$${r.Price} / item</div>
          </div>
          <div class="quantity">${r.Qty}</div>
          <div class="returnPrice">$${r.lineTotal.toFixed(2)}</div>
        </div>`;
    }).join('');

    listEl.innerHTML   = html;
    qtyEl.textContent   = totalQty;
    priceEl.textContent = '$' + totalPrice.toFixed(2);

  } catch (err) {
    console.error('Checkout load error', err);
    listEl.innerHTML = '<p style="padding:1rem;color:red">Can’t load cart.</p>';
  }
}
