import { loadPage } from '../router.js';

export async function validateUser() {
    const form = document.getElementById('validateForm');

    if (form) {
        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        const token = localStorage.getItem('temp_token');
        const validateCode = data["twofa_code"];

        console.log('Token alınan:', token);

        try {
            const response = await fetch('http://localhost:8007/users/validate/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    twofa_code: validateCode,
                }),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Başarılı validate');
                document.cookie = `token=${token}; path=/; max-age=1500`;
                localStorage.removeItem('temp_token');
                console.log('Token local storage den silindi:', localStorage.getItem('temp_token'));
                const cookies = document.cookie.split('; ');
                const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
                localStorage.setItem('user_id', responseData.user_id);
                console.log('VALİDATEEEE');
                const user_id = localStorage.getItem('user_id');
                
                if (tokenCookie) {
                    loadPage('profile',true);
                } else {
                    loadPage('login',true);
        }
            } else {
                console.log('Başarısız validate');
                localStorage.removeItem('temp_token');
                loadPage('login',true);
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }
}
