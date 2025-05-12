// login.js – verify credentials against back-end
const form    = document.getElementById('loginForm');
const errorEl = document.getElementById('errorMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.textContent = '';

  // Collect form data into an object
  const dto = Object.fromEntries(new FormData(form).entries()); // {email, password}

  try {
    const res = await fetch('/login', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(dto)
    });

    if (res.ok) {
      /* optionally store session info here:
         localStorage.setItem('role', (await res.json()).role); */
      window.location.href = 'HomePage.html';
    } else {
      errorEl.textContent = 'Invalid e-mail or password.';
    }
  } catch {
    errorEl.textContent = 'Network error – please try again.';
  }
});
