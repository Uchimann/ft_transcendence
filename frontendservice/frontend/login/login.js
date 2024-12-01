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
                console.log('Yanıt:', responseData); 
                localStorage.setItem('temp_token', responseData.temp_token); 

                loadPage('validate',true); 
            } else {
                console.log('Başarısız login');
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }
}

