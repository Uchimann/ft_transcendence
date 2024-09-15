export async function loadPage(page) {
    const content = document.getElementById('content');
    let pageUrl = '';
    //let scriptUrl = '';
    switch (page) {
        case 'login':
            pageUrl = 'login/login.html';
            //scriptUrl = 'login/login.js'; // Load the login script
            break;
        case 'register':
            pageUrl = 'register/register.html';
            //scriptUrl = 'register/register.js';
            break;
        case 'registerlogin':
            pageUrl = 'login/login.html';
            //scriptUrl = 'register/register.js';
            break;
        case 'forgot':
            pageUrl = 'forgot/forgot.html';
            break;
        case 'profile':
            pageUrl = 'profile/profile.html';
            break;
        case 'about':
            pageUrl = 'about/about.html';
            break;
        case 'logout':
            pageUrl = 'login/login.html';
            //scriptUrl = 'login/login.js';
            break;
        case 'settings':
            pageUrl = 'settings/settings.html';
            break;
        case 'game':
            pageUrl = 'game/game.html';
            break;
        case 'send':
            pageUrl = 'forgot/forgot.html';
            break;
        default:
            pageUrl = '404/404.html';
    }
    try {
        if (page == 'loginWith42') {

        } else {
            const response = await fetch(pageUrl);
            if (!response.ok) {
                throw new Error(`Failed to load page: ${response.statusText}`);
            }
            content.innerHTML = await response.text();
        }
        /*if (scriptUrl) {
            const script = document.createElement('script');
            script.src = scriptUrl;
            script.type = "module";
            document.body.appendChild(script);
        }*/
    } catch (error) {
        content.innerHTML = `<p>Error loading page: ${error.message}</p>`;
    }
}
