// router.js
import { fetchMatchHistory, loadUserInfo } from './profile/profile.js';
import { loadFriendList } from './profile/profile.js';
import { startGame } from './game/game.js';
import { setupEventListeners } from './script.js';
import { pairs_global } from './game/game.js';
import { showRandomQuote } from './profile/profile.js';


function updateHistory(page) {
    const state = { page };
    history.pushState(state, '', `#${page}`);
}


export async function loadPage(page, pushState = true) {
    const content = document.getElementById('content');
    const pageMap = new Map([
        ['login', 'login/login.html'],
        ['register', 'register/register.html'],
        ['validate', 'validate/validate.html'],
        ['registerlogin', 'login/login.html'],
        ['forgot', 'forgot/forgot.html'],
        ['profile', 'profile/profile.html'],
        ['about', 'about/about.html'],
        ['logout', 'login/login.html'],
        ['settings', 'settings/settings.html'],
        ['game', 'game/game.html'],
        ['send', 'forgot/forgot.html'],
        ['loginWith42', 'login/login42.html'],
    ]);


    if (pushState) {
        updateHistory(page);
    }

    let pageUrl = pageMap.get(page) || '404/404.html';
    console.log('Page:', page, 'URL:', pageUrl);

    try {
        const response = await fetch(pageUrl);
        if (!response.ok) {
            throw new Error(`Failed to load page: ${response.statusText}`);
        }

        if (page === 'profile') {
            const pageContent = await response.text();
            content.innerHTML = pageContent;
            await loadUserInfo();
            await loadFriendList();
            await fetchMatchHistory();
            showRandomQuote();
            const existingCanvas = document.querySelectorAll('canvas');
            existingCanvas.forEach(canvas => canvas.remove());
            console.log('setupEventListeners sonrası ( router.js )');

            return;
        }

        if (page === 'game') {
            const pageContent = await response.text();
            content.innerHTML = pageContent;

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = './game/game.css';
            document.head.appendChild(link);

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = () => {
                console.log('Three.js loaded');

                const script2 = document.createElement('script');
                script2.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
                script2.onload = () => {
                    console.log('OrbitControls.js loaded');
                };
                document.head.appendChild(script2);
            };
            document.head.appendChild(script);

            const button = document.querySelector(".startAgaintsAnotherPlayerGame");
            const button2 = document.querySelector(".startAgainstArtificalIntelligenceGame");
            const button3 = document.querySelector(".startTournamentGame");
            const button4 = document.querySelector(".playTournamentMatch");

            if (button4) button4.removeEventListener("click", playTournamentMatch);
            if (button3) button3.removeEventListener("click", startTournamentGame);
            if (button2) button2.removeEventListener("click", startGameWithArtificalIntellıgence);
            if (button) button.removeEventListener("click", startGameWithPlayer);
            
            if (button) button.addEventListener("click", startGameWithPlayer);
            if (button2) button2.addEventListener("click", startGameWithArtificalIntellıgence);
            if (button3) button3.addEventListener("click", startTournamentGame);
            if (button4) button4.addEventListener("click", playTournamentMatch);
            return;
        }

        content.innerHTML = await response.text();
    } catch (error) {
        content.innerHTML = `<p>Error loading page: ${error.message}</p>`;
    }
}


export function handleInitialLoad() {
    const hash = window.location.hash.slice(1) || 'login';
    loadPage(hash, false);
}

export function startGameWithPlayer() {
    const existingCanvas = document.querySelectorAll('canvas');
    existingCanvas.forEach(canvas => canvas.remove());
    startGame();
    document.querySelector(".startAgaintsAnotherPlayerGame").style.display = "none";;
    document.querySelector(".startAgainstArtificalIntelligenceGame").style.display = "none";
    document.querySelector(".startTournamentGame").style.display = "none";
}

export function startTournamentGame() {
    const existingCanvas = document.querySelectorAll('canvas');
    existingCanvas.forEach(canvas => canvas.remove());
    startGame(false,true);
    document.querySelector(".startAgaintsAnotherPlayerGame").style.display = "none";;
    document.querySelector(".startAgainstArtificalIntelligenceGame").style.display = "none";
    document.querySelector(".startTournamentGame").style.display = "none";
}

export function playTournamentMatch() 
{
    const existingCanvas = document.querySelectorAll('canvas');
    existingCanvas.forEach(canvas => canvas.remove());
    startGame(true,true,pairs_global);
    document.querySelector(".tournament-container").style.display = "none";
    document.querySelector(".startAgaintsAnotherPlayerGame").style.display = "none";
    document.querySelector(".startAgainstArtificalIntelligenceGame").style.display = "none";
    document.querySelector(".startTournamentGame").style.display = "none";
}

export function startGameWithArtificalIntellıgence() {
    const existingCanvas = document.querySelectorAll('canvas');
    existingCanvas.forEach(canvas => canvas.remove());
    startGame(false);
    document.querySelector(".startAgaintsAnotherPlayerGame").style.display = "none";;
    document.querySelector(".startAgainstArtificalIntelligenceGame").style.display = "none";
    document.querySelector(".startTournamentGame").style.display = "none";
}