// home.js  – navbar profile dropdown + logout
document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelector('.nav-buttons');
    if (!navButtons) return;          // safety guard
  
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    if (!isLoggedIn) return;          // not logged-in ➜ leave “Hi Sign up” visible
  
    /* ----------- remove ALL sign-up buttons ----------- */
    navButtons
      .querySelectorAll('.signup-btn, #signupTrigger, #signupLink')
      .forEach(el => el.remove());
  
    /* ----------- build profile button + dropdown ------- */
    const profileWrapper = document.createElement('div');
    profileWrapper.className = 'profile-wrapper'; // for relative pos
  
    const profileBtn = document.createElement('button');
    profileBtn.type = 'button';
    profileBtn.className = 'btn profile-btn';
    profileBtn.innerHTML = '<i class="bi bi-person-circle"></i>';
  
    const menu = document.createElement('div');
    menu.className = 'profile-menu';
    menu.innerHTML = `
        <div class="profile-item" id="accountSettings">Account settings</div>
        <div class="profile-item" id="logoutBtn">Sign out</div>
    `;
  
    profileWrapper.appendChild(profileBtn);
    profileWrapper.appendChild(menu);
    navButtons.appendChild(profileWrapper);
  
    /* ---- toggle menu on icon click ---- */
    profileBtn.addEventListener('click', e => {
      e.stopPropagation();
      menu.classList.toggle('open');
    });
  
    /* ---- click outside closes menu ---- */
    document.body.addEventListener('click', () => menu.classList.remove('open'));
    menu.addEventListener('click', e => e.stopPropagation()); // keep menu open
  
    /* ---- sign-out ---- */
    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('loggedIn');   // clear stub session
      location.reload();                     // reload -> “Hi Sign up” returns
    });
  
    /* ---- placeholder account link ---- */
    document.getElementById('accountSettings')
            .addEventListener('click', () => alert('Account page – coming soon'));
  });
  