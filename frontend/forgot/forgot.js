export default async function editForgot(content) {
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = content;
    } else {
        console.error('Element with id "page-content" not found.');
    }
}

