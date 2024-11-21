import { loadPage } from '../router.js';

export async function authenticateUser() {
    const form = document.getElementById('loginForm');

    if (form) {
        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        const email = formData.get('username');

        console.log(data["username"] + " " + data["password"]);

        try {
            const response = await fetch('http://localhost:8007/users/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Başarılı login');
                console.log('Yanıt:', responseData); // Yanıtı kontrol et
                localStorage.setItem('temp_token', responseData.temp_token); // temp_token'ı localStorage'a kaydet
                //localStorage.setItem('user_id', responseData.user_id); // email'i localStorage'a kaydet
                loadPage('validate'); // validate sayfasını yükle
            } else {
                console.log('Başarısız login');
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }
}



/*
export function handleRegisterData(savedData) {
    if (!savedData)
        return;
    const data = JSON.parse(savedData);
    const form = document.querySelector('form');

    if (data[form.id]) {
        for (const [key, value] of Object.entries(data[form.id])) {
            const input = form.elements[key];
            if (input) {
                input.value = value;
            }
        }
    }
}
*/
