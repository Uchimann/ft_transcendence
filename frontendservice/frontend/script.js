// Modülleri içe aktar
import { loadPage } from './router.js';
import { saveData } from './register/register.js';
import { authenticateUser } from './login/login.js';
import { validateUser } from './validate/validate.js';
import { updateUserInfo, updateProfilePicture } from './profile/updateProfile.js';
import { addFriend } from './profile/updateProfile.js';
import { game } from './game/game.js';
import { loginWith42, handle42Callback } from './login/login42.js';

// Ana event listener kurma fonksiyonu
function setupEventListeners() {
    document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
}

// Sayfa yüklendiğinde yapılacak işlemler
async function onDOMContentLoaded() {
    // Token kontrolü yap
    checkTokenAndLoadPage();

    if (window.location.search.includes("code=")) {
        console.log("42 callback geldi!");
        await handle42Callback(); // Callback işleme
        // Mevcut URL'i al
        const urluchiman = new URL(window.location.href);
        // 'code' parametresini kaldır
        urluchiman.searchParams.delete('code');
        // urluchiman'i güncelle
        window.location.href = urluchiman.toString();
        loadPage('profile');
    }

    // Ana uygulama öğesini al
    const app = document.getElementById('app');
    if (app) {
        app.addEventListener('click', handleAppClick);
    }

    // Tıklama olaylarını dinle
    document.addEventListener('click', handleButtonClicks);

    

}

// Kullanıcı token'ını kontrol edip, uygun sayfayı yükler
function checkTokenAndLoadPage() {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));

    if (tokenCookie) {
        loadPage('profile'); // Token varsa profile sayfasını yükle
        //beonline endpointine istek atarak kullanıcıyı online yap
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
        loadPage('login'); // Token yoksa login sayfasını yükle
    }
}

// Uygulama içerisindeki yönlendirme ve form gönderim işlemlerini ele alır
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

// Kayıt formunu gönderme işlemini yapar
async function handleRegisterForm() {
    const form = document.getElementById('registerForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()); // Form verisini JSON formatına çevir

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

// Tıklanan butona göre ilgili işlemi yapar
function handleButtonClicks(event) 
{
    if (event.target.matches('.buttonLogin')) {
        event.preventDefault();
        authenticateUser(); // Login işlemi
    } 
    else if (event.target.matches('.buttonLogout')) {
        event.preventDefault();
        logoutUser(); // Çıkış işlemi
    } 
    else if (event.target.matches('.validateButton')) {
        event.preventDefault();
        validateUserCode(); // İki faktörlü doğrulama
    }
    else if (event.target.matches('.updateProfileBtn')) {
        event.preventDefault();
        updateUserInfo(); // Profil güncelleme
    } 
    else if (event.target.matches('.img-fluid')) {
        updateProfilePicture(); // Profil resmi güncelleme
    } 
    else if (event.target.matches('.buttonAddFriend')) {
        event.preventDefault();
        addFriend(); // Arkadaş ekleme
    } else if (event.target.matches('.login42')) {
        event.preventDefault();
        console.log('login42 butonuna tıklandı');
        loginWith42();
    } else if (event.target.matches('.buttonForgetPassword')) {
        event.preventDefault();
        alert('OH ! Soory.. If you have forgotten your password, please contact our support team.');
    }
   /* else if (event.target.matches('.playWithPlayer')) {
        document.querySelector('.playWithPlayer').addEventListener('click', function(event) {
            event.preventDefault();
            console.log('playWithPlayer butonuna tıklandı');
        
            var button = document.querySelector(".startAgaintsAnotherPlayerGame");
        
            // Olay dinleyicisini eklemeden önce kaldır
            button.removeEventListener("click", startGameWithPlayer);
        
            // Olay dinleyicisini ekle
            button.addEventListener("click", startGameWithPlayer);
        
            // Programlı olarak butona tıklama olayını tetikle
            button.click();
        });

        //game(false);
    } 
    else if (event.target.matches('.playWithAi')) {
        event.preventDefault();
        console.log('playWithAi butonuna tıklandı');
        
        var button = document.querySelector(".startAgainstArtificalIntelligenceGame");
        button.addEventListener("click", function() {
            const existingCanvas = document.querySelectorAll('canvas');
            existingCanvas.forEach(canvas => canvas.remove());
            game(false);
            button.style.display = "none";
            document.querySelector(".startAgaintsAnotherPlayerGame").style.display = "none";
        });
        button.click();
        //game(true);
    }*/
}






// Kullanıcıyı çıkış yaptırır
async function logoutUser() {
    try {
        // Localden userid yi al
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user.id;
        if (!userId) {
            alert('Kullanıcı bulunamadı, lütfen tekrar giriş yapın.');
            loadPage('login');
            return;
        }
        console.log("User ID:", userId);

        // Cookie'den token'ı güvenli bir şekilde al
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

// İki faktörlü doğrulama kodunu işler
function validateUserCode() {
    const form = document.getElementById('validateForm');
    const formData = new FormData(form);
    const validateCode = formData.get('twofa_code');
    const token = localStorage.getItem('token');

    validateUser(validateCode, token);
}

// Ana fonksiyonu çağırarak event listener'ları başlat
setupEventListeners();

window.addEventListener('beforeunload', function(event) {
    // onbeforeunload çağrısını kontrol etmek için konsola yazdır
    console.log("onbeforeunload");

    // Cookie'den token'ı güvenli bir şekilde al
    const tokenCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('token='));
    if (tokenCookie) {
        const token = tokenCookie.split('=')[1];
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user.id;
        // Logout isteği için URL ve yapılandırma
        const url = 'http://localhost:8007/users/logout/';

        // fetch ile çıkış isteği gönder
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

    // Kullanıcının sayfadan ayrılmasını engellemek için bir mesaj döndür
    const message = 'Sayfadan ayrılmak istediğinize emin misiniz?';
    event.returnValue = message; // Eski tarayıcılar için
    return message; // Modern tarayıcılar için
});
