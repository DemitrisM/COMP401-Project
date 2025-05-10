// login.js  – front-end stub auth
const form      = document.getElementById('loginForm');
const emailEl   = document.getElementById('email');
const passEl    = document.getElementById('password');
const errorEl   = document.getElementById('errorMsg');

form.addEventListener('submit', e => {
  e.preventDefault();                       // stop real submit
  errorEl.textContent = '';                 // clear previous errors

  const email = emailEl.value.trim();
  const pass  = passEl.value;

  if (email === 'user' && pass === '1234') {
    // 👇 success → redirect
    window.location.href = 'HomePage.html';
  } else {
    errorEl.textContent = 'Invalid e-mail or password.';
  }
});
