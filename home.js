// home.js  – navbar profile dropdown + logout
document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelector('.nav-buttons');
    const signupBtn  = document.getElementById('signupLink');
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
  
    if (!isLoggedIn) return;               // not logged in → nothing to do
  
    /* ---------- build the profile button --------- */
    if (signupBtn) signupBtn.remove();      // remove "Sign up"
  
    const profileWrapper = document.createElement('div');
    profileWrapper.className = 'profile-wrapper'; // for relative pos
  
    const profileBtn = document.createElement('button');
    profileBtn.className = 'btn profile-btn';
    profileBtn.innerHTML = '<i class="bi bi-person-circle"></i>';
    profileBtn.type = 'button';
  
    /* ---------- build the dropdown menu ---------- */
    const menu = document.createElement('div');
    menu.className = 'profile-menu';
    menu.innerHTML = `
        <div class="profile-item" id="accountSettings">Account settings</div>
        <div class="profile-item" id="logoutBtn">Sign out</div>
    `;
  
    profileWrapper.appendChild(profileBtn);
    profileWrapper.appendChild(menu);
    navButtons.appendChild(profileWrapper);
  
    /* ---------- toggle / hide logic --------------- */
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();                  // don’t bubble to body
      menu.classList.toggle('open');
    });
  
    // click outside closes the menu
    document.body.addEventListener('click', () => menu.classList.remove('open'));
  
    // stop clicks inside the menu from closing it immediately
    menu.addEventListener('click', (e) => e.stopPropagation());
  
    /* ---------- sign-out handler ------------------ */
    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('loggedIn');   // clear fake session
      location.reload();                     // reload → navbar resets
    });
  
    // (placeholder) account settings
    document.getElementById('accountSettings')
            .addEventListener('click', () => alert('Account page TBD'));
  });
  