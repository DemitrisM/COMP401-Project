/* ─────────────────────────────────────────────────────────────
   SignUp.js  –  register USER or ADMIN, show toast, auto-redirect
   ──────────────────────────────────────────────────────────── */

const container        = document.querySelector('.container');
const userToggleBtn    = document.querySelector('.user-register-btn');
const adminToggleBtn   = document.querySelector('.admin-register-btn');
const customerForm     = document.getElementById('customerForm');
const adminForm        = document.getElementById('adminForm');

/* ── panel switch ─────────────────────────────────────────── */
userToggleBtn.addEventListener('click', () => container.classList.add('active'));
adminToggleBtn.addEventListener('click', () => container.classList.remove('active'));

/* ── tiny helper (toast message) ──────────────────────────── */
function showToast (text, ok = true, time = 1500) {
  /* remove an old toast if one is still present */
  const old = document.querySelector('.toast');
  if (old) old.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = text;

  /* basic styles */
  Object.assign(toast.style, {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '12px 26px',
    borderRadius: '8px',
    fontFamily: 'Ubuntu, sans-serif',
    fontWeight: 600,
    color: '#fff',
    background: ok ? '#3aa35a' : '#e74d3c',
    zIndex: 10_000,
    boxShadow: '0 4px 12px rgba(0,0,0,.15)',
    opacity: '0',
    transition: 'opacity .4s'
  });

  document.body.appendChild(toast);
  /* fade-in */
  requestAnimationFrame(() => toast.style.opacity = '1');

  /* fade-out + remove */
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.addEventListener('transitionend', () => toast.remove());
  }, time);
}

/* ── send request & handle reply ──────────────────────────── */
async function register(form, role) {
  const data = Object.fromEntries(new FormData(form).entries());
  data.role = role;

  try {
    const res = await fetch('http://localhost:3000/auth/register', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      showToast(err.error || 'Registration failed', false, 3000);
      return;
    }

    /* success */
    showToast('Registration successful! Redirecting…');
    console.log('✅  API answered OK – will redirect in 1500 ms');

setTimeout(() => {
  console.log('➡️  Redirecting now …');
  window.location.href = 'LoginPage.html';
}, 1500);


    /* redirect after toast is visible ~1.5 s */
    setTimeout(() => window.location.href = 'LoginPage.html', 1500);

  } catch (err) {
    console.error(err);
    showToast('Network error, try again', false, 3000);
  }
}

/* ── form submits ─────────────────────────────────────────── */
customerForm.addEventListener('submit', e => {
  e.preventDefault();
  register(customerForm, 'CUSTOMER');
});

adminForm.addEventListener('submit', e => {
  e.preventDefault();
  register(adminForm, 'ADMIN');
});
