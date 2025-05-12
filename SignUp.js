// SignUp.js – sends whichever form is submitted
function hook(id) {
  const form = document.getElementById(id);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = JSON.stringify(Object.fromEntries(new FormData(form).entries()));

    try {
      const res = await fetch('/signup', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });
      if (res.ok) window.location.href = 'LoginPage.html';
      else        alert('Sign-up failed: ' + await res.text());
    } catch {
      alert('Network error');
    }
  });
}

hook('userForm');   // buyer
hook('sellerForm'); // seller
