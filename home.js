// home.js  – navbar profile dropdown + logout
document.addEventListener('DOMContentLoaded', () => {
  const navButtons = document.querySelector('.nav-buttons');
  if (!navButtons) return;                     // safety guard

  /* ---------- USE TOKEN, not loggedIn=true ---------- */
  const isLoggedIn = !!localStorage.getItem('token');
  if (!isLoggedIn) return;                     // show “Log in” when no token

  /* ----------- remove the Log-in button ------------- */
  navButtons
    .querySelectorAll('.signup-btn, #signupTrigger, #signupLink')
    .forEach(el => el.remove());

  /* ------------- build profile icon ----------------- */
  const profileWrapper = document.createElement('div');
  profileWrapper.className = 'profile-wrapper';

  const profileBtn = document.createElement('button');
  profileBtn.type  = 'button';
  profileBtn.className = 'btn profile-btn';
  profileBtn.innerHTML  = '<i class="bi bi-person-circle"></i>';

  const menu = document.createElement('div');
  menu.className = 'profile-menu';
  menu.innerHTML = `
      <div class="profile-item" id="accountSettings">Account settings</div>
      <div class="profile-item" id="logoutBtn">Sign out</div>
  `;

  profileWrapper.appendChild(profileBtn);
  profileWrapper.appendChild(menu);
  navButtons.appendChild(profileWrapper);

  /* toggle dropdown */
  profileBtn.addEventListener('click', e => {
    e.stopPropagation();
    menu.classList.toggle('open');
  });
  document.body.addEventListener('click', () => menu.classList.remove('open'));
  menu.addEventListener('click', e => e.stopPropagation());

  /* sign out */
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');          // remove JWT
    localStorage.removeItem('username');       // optional extras
    localStorage.removeItem('role');
    location.reload();                         // page reload → Log-in link shows
  });

  /* placeholder */
  document.getElementById('accountSettings')
          .addEventListener('click', () => alert('Account page – coming soon'));
});
