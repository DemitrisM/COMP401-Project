/* login.js – verify credentials, remember session, redirect home */

const form    = document.getElementById('loginForm');
const errorEl = document.getElementById('errorMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.textContent = '';

  // collect {email, password}
  const dto = Object.fromEntries(new FormData(form).entries());

  try {
    const res = await fetch('/login', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(dto)
    });

    if (!res.ok) {
      errorEl.textContent = 'Invalid e-mail or password.';
      return;
    }

    /* ───── success ─────────────────────────────────────────── */
    const { username, role } = await res.json();

    // very simple “session” – enough for navbar swapping
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('username',  username);   // optional, future use
    localStorage.setItem('role',      role);       // optional, future use

    window.location.href = 'HomePage.html';        // back to catalogue
  }
  catch {
    errorEl.textContent = 'Network error – please try again.';
  }
});
