import { loadPage } from '../router.js';

export async function validateUser() {
    const form = document.getElementById('validateForm');

    if (form) {
        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        const token = localStorage.getItem('temp_token'); // Token'ı localStorage'dan al
        const validateCode = data["twofa_code"]; // Formdan alınan iki faktörlü kod

        console.log('Token alınan:', token); // Token'ı kontrol et

        try {
            const response = await fetch('http://localhost:8007/users/validate/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Token'ı yetkilendirme başlığına ekle
                },
                body: JSON.stringify({
                    twofa_code: validateCode,
                }),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Başarılı validate');
                document.cookie = `token=${token}; path=/; max-age=1500`; // 1 saat geçerlilik süresi
                localStorage.removeItem('temp_token'); // Token'ı localStorage'dan sil
                console.log('Token local storage den silindi:', localStorage.getItem('temp_token'));
                //loadPage('profile'); 
                const cookies = document.cookie.split('; ');
                const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
                // user_id locale kaydet
                localStorage.setItem('user_id', responseData.user_id); // email'i localStorage'a kaydet
                console.log('VALİDATEEEE');
                const user_id = localStorage.getItem('user_id');
                
                if (tokenCookie) {
                    // Token mevcut, profile sayfasını yükle
                    loadPage('profile');
                } else {
                    // Token yok, login sayfasını yükle
                    loadPage('login');
        }
            } else {
                console.log('Başarısız validate');
                localStorage.removeItem('temp_token'); // Token'ı localStorage'dan sil
                loadPage('login');
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }
}
