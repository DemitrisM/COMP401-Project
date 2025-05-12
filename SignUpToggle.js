const container      = document.querySelector('.container');
const userRegBtn     = document.querySelector('.user-register-btn');   // BUYER
const adminRegBtn    = document.querySelector('.admin-register-btn');  // SELLER

userRegBtn.addEventListener('click', () => container.classList.add('active'));
adminRegBtn.addEventListener('click', () => container.classList.remove('active'));