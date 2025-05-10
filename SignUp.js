const container= document.querySelector('.container');
const UserRegisterBtn= document.querySelector('.user-register-btn');
const AdminRegisterBtn= document.querySelector('.admin-register-btn');

UserRegisterBtn.addEventListener('click', () => {
    container.classList.add('active');
});

AdminRegisterBtn.addEventListener('click', () => {
    container.classList.remove('active');
});