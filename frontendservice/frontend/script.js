// Modülleri içe aktar
import { loadPage } from './router.js';
import { saveData } from './register/register.js';
import { authenticateUser } from './login/login.js';
import { validateUser } from './validate/validate.js';
import { updateUserInfo, updateProfilePicture } from './profile/updateProfile.js';
import { addFriend } from './profile/updateProfile.js';
import { startGame } from './game/game.js';
import { loginWith42, handle42Callback } from './login/login42.js';


export function setupEventListeners() {
    document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.page) {
            loadPage(event.state.page, false);
        } else {
            // Varsayılan sayfa
            loadPage('login', false);
        }
    });
}


async function onDOMContentLoaded() {
    
    if (window.location.search.includes("code=")) {
        console.log("42 callback geldi!");
        await handle42Callback();

        const urluchiman = new URL(window.location.href);

        urluchiman.searchParams.delete('code');

        window.location.href = urluchiman.toString();

    }
    

    const app = document.getElementById('app');
    if (app) {
        app.addEventListener('click', handleAppClick);
    }
    

    document.addEventListener('click', handleButtonClicks);

    checkTokenAndLoadPage();
}


async function checkTokenAndLoadPage() {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));

    if (tokenCookie) {
        await loadPage('profile');

        const user_id = JSON.parse(localStorage.getItem('user')).id;
        console.log('user_id:', user_id);
        if (!user_id) {
            alert('Kullanıcı bulunamadı, lütfen tekrar giriş yapın.');
            loadPage('login');
            return;
        }
        const token = tokenCookie.split('=')[1];
        if (!token) {
            alert('Token bulunamadı, lütfen tekrar giriş yapın.');
            loadPage('login');
            return;
        }
        fetch('http://localhost:8007/users/beonline/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'id': user_id
            },
            body: JSON.stringify({}),
        }).then(response => {
            if (response.ok) {
                console.log('Kullanıcı online yapıldı.');
            } else {
                console.error('Kullanıcı online yapılamadı:', response.statusText);
            }
        }
        ).catch(error => {
            console.error('Kullanıcı online yapılamadı:', error);
        });

    } else {
        console.log('Token bulunamadı, login sayfası yükleniyor.');
        loadPage('login'); 
    }
}


async function handleAppClick(event) {
    if (event.target.matches('.nav-link, #app[data-page]')) {
        event.preventDefault();
        const page = event.target.getAttribute('data-page');

        if (page === 'registerlogin') {
            handleRegisterForm();
        } else if (page === 'updateProfile') {
            updateUserInfo();
        } else if (page === 'game') {
            console.log('game ifi içerisinde page:', page);
            loadPage(page);
            return;
        }
        else {
            loadPage(page);
        }
    }
}


async function handleRegisterForm() {
    const form = document.getElementById('registerForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://localhost:8007/users/create/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            console.log('Kayıt başarılı');
            loadPage('login');
        } else {
            console.log('Kayıt başarısız');
            loadPage('register');
        }
    } catch (error) {
        console.error('Hata:', error);
    }
}


function handleButtonClicks(event)
{
    if (event.target.matches('.buttonLogin')) {
        event.preventDefault();
        authenticateUser();
    } 
    else if (event.target.matches('.buttonLogout')) {
        event.preventDefault();
        logoutUser();
    } 
    else if (event.target.matches('.validateButton')) {
        event.preventDefault();
        validateUserCode();
    }
    else if (event.target.matches('.updateProfileBtn')) {
        event.preventDefault();
        updateUserInfo();
    } 
    else if (event.target.matches('.img-fluid')) {
        updateProfilePicture();
    } 
    else if (event.target.matches('.buttonAddFriend')) {
        event.preventDefault();
        addFriend();
    } else if (event.target.matches('.login42')) {
        event.preventDefault();
        console.log('login42 butonuna tıklandı');
        loginWith42();
    } else if (event.target.matches('.buttonForgetPassword')) {
        event.preventDefault();
        alert('OH ! Soory.. If you have forgotten your password, please contact our support team.');
    }
}







async function logoutUser() {
    try {

        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user.id;
        if (!userId) {
            alert('Kullanıcı bulunamadı, lütfen tekrar giriş yapın.');
            loadPage('login');
            return;
        }
        console.log("User ID:", userId);

        const tokenCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('token='));
        if (!tokenCookie) {
            alert('Token bulunamadı, lütfen tekrar giriş yapın.');
            loadPage('login');
            return;
        }
        const token = tokenCookie.split('=')[1];
        console.log("Token:", token);

        const response = await fetch('http://localhost:8007/users/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'id': userId
            }
        });

        if (response.ok) {
            localStorage.removeItem('user'); 
            localStorage.removeItem('token'); 
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            loadPage('login');
        } else {
            const errorData = await response.json();
            console.error('Logout failed:', errorData.error);
            alert('Logout failed: ' + errorData.error);
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('An error occurred while logging out.');
    }
}


function validateUserCode() {
    const form = document.getElementById('validateForm');
    const formData = new FormData(form);
    const validateCode = formData.get('twofa_code');
    const token = localStorage.getItem('token');

    validateUser(validateCode, token);
}


setupEventListeners();

window.addEventListener('beforeunload', function(event) {

    console.log("onbeforeunload");

    const tokenCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('token='));
    if (tokenCookie) {
        const token = tokenCookie.split('=')[1];
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user.id;
        const url = 'http://localhost:8007/users/logout/';

        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'id': userId
            },
            body: JSON.stringify({})
        }).then(response => {
            if (response.ok) {
                console.log("Logout başarılı bir şekilde gönderildi.");
            } else {
                console.error("Logout isteği başarısız:", response.statusText);
            }
        }).catch(error => {
            console.error("Logout isteğinde hata oluştu:", error);
        });
    }


    const message = 'Sayfadan ayrılmak istediğinize emin misiniz?';
    event.returnValue = message;
    return message;
});