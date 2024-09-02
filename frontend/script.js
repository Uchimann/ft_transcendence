import { loadPage } from './router.js';
import { FormDataStorage } from './register/register.js';
import { handleRegisterData, authenticateUser } from './login/login.js';

function setupEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
        const buttons = document.querySelectorAll('.navbar-nav .button');

        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                const page = event.target.getAttribute('data-page');
                loadPage(page);
            });
        });
        loadPage('login');
    });

    document.addEventListener('DOMContentLoaded', () => {
        let i = 0;
        const app = document.getElementById('app');
        app.addEventListener('click', (event) => {
            if (event.target.matches('.nav-link, #app[data-page]')) {
                const page = event.target.getAttribute('data-page');
                if (page === 'registerlogin') {
                    const formDataStorage = new FormDataStorage('register-' + i++);
                    formDataStorage.saveData();
                }
                if (page === 'login') {
                    for (let a = 0; a < i; a++) {
                        const savedData = localStorage.getItem('register-' + a);
                        if (savedData) {
                            handleRegisterData(savedData);
                        }
                    }
                }
                loadPage(page);
            }
        });
    });
    document.addEventListener('click', (event) => {
        if (event.target.matches('form')) {
            event.preventDefault(); // Prevent default form submission
            if (event.target.getAttribute('data-page') === 'login') {
                authenticateUser();
            }
        }
    });
}
    
setupEventListeners();
