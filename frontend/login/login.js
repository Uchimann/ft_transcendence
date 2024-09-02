export async function authenticateUser() {
    const form = document.querySelector('form');
    if (form) {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        try {
            const response = await fetch('http://localhost:5500/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                // Handle successful authentication
                console.log('Authentication successful!');
                // Optionally redirect to another page or show a success message
                alert('Login successful!');
            } else {
                // Handle failed authentication
                console.log('Authentication failed:', result.message);
                // Optionally show an error message
                alert('Login failed: ' + result.message);
            }
        } catch (error) {
            console.error('Error during authentication:', error);
            alert('An error occurred during authentication.');
        }
    }
}


export function handleRegisterData(savedData) {
    const data = JSON.parse(savedData);
    const forms = document.querySelectorAll('form');
    
    forms.forEach((form, index) => {
        const formId = form.id || `form-${index}`;
        if (data[formId]) {
            for (const [key, value] of Object.entries(data[formId])) {
                const input = form.elements[key];
                if (input) {
                    input.value = value;
                }
            }
        }
    });
}