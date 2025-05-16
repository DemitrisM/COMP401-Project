document.addEventListener('DOMContentLoaded', () => {
  const form      = document.querySelector('.search-wrapper');
  const input     = form.querySelector('input[name="query"]');
  const dropdown  = form.querySelector('.search-dropdown');
  let  timer      = null;

  input.addEventListener('input', () => {
    const q = input.value.trim();
    clearTimeout(timer);
    if (!q) {
      dropdown.style.display = 'none';
      return;
    }
    timer = setTimeout(async () => {
      try {
        const res   = await fetch(`/api/search?query=${encodeURIComponent(q)}`);
        const items = await res.json();
        if (!items.length) {
          dropdown.style.display = 'none';
          return;
        }
        // build dropdown
        dropdown.innerHTML = items.map(i => `
          <div class="search-item" data-sku="${i.SKUID}">
            <img src="${i.Picture}" alt="">
            <span>${i.Name}</span>
          </div>
        `).join('');
        dropdown.style.display = 'block';
      } catch {
        dropdown.style.display = 'none';
      }
    }, 300);
  });

  // click a suggestion → scroll to product or navigate
  dropdown.addEventListener('click', e => {
    const item = e.target.closest('.search-item');
    if (!item) return;
    const sku = item.dataset.sku;
    // for now we just reload homepage with hash
    window.location.href = `HomePage.html#sku=${sku}`;
  });

  // outside click hides dropdown
  document.addEventListener('click', e => {
    if (!form.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });
});
