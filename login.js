// login.js  – real API call + JWT storage
// ---------------------------------------
const form    = document.getElementById('loginForm');
const emailEl = document.getElementById('email');
const passEl  = document.getElementById('password');
const errorEl = document.getElementById('errorMsg');

// ⬇ Adjust if your back-end runs on a different host/port
const API_BASE = 'http://localhost:3000';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.textContent = '';                 // clear previous errors

  /* build request body */
  const payload = {
    email:    emailEl.value.trim(),
    password: passEl.value
  };

  try {
    /* POST /auth/login */
    const res = await fetch(`${API_BASE}/auth/login`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(payload)
    });

    if (!res.ok) {
      // 401 or other error → show message, stay on page
      errorEl.textContent =
        res.status === 401 ? 'Invalid e-mail or password.'
                           : 'Login failed – try again';
      return;
    }

    /* success → parse JSON, store JWT & meta */
    const data = await res.json();          // { token, role, username }
    localStorage.setItem('token',    data.token);
    localStorage.setItem('role',     data.role);
    localStorage.setItem('username', data.username);

    /* navigate to home page */
    window.location.href = 'HomePage.html';
  }
  catch (err) {
    console.error(err);
    errorEl.textContent = 'Network error – please try later';
  }
});
