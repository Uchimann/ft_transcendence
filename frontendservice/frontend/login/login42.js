
import { loadPage } from "../router.js";
import { setupEventListeners } from "../script.js";

export async function loginWith42() {
    console.log("Logging in with 42 OAuth...");

    const clientId = "u-s4t2ud-f0a16fd8008b548e10e481a206cb0700607774c18bb30aca8d7208d9f1a93bf5"; 
    const redirectUri = "https://localhost:8008/"; 
    const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;


    console.log("Redirecting to 42 OAuth...");
    window.location.replace(authUrl);

    console.log(redirectUri);
    console.log("REEEEEEEEEEEedirected to 42 OAuth.");
}


export async function handle42Callback() {
    console.log("Handling 42 OAuth callback...");


    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log("Received code:", code);

    if (!code) {
        console.error("Authorization code not found!");
        alert("Giriş başarısız oldu. Lütfen tekrar deneyin.");
        return;
    }

    await loadPage("loginWith42");
    const url = "http://localhost:8007/users/oauth_callback/";

    try {

        const response = await fetch(url, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ code }) 
        });

        if (!response.ok) {
            console.log("Failed to complete OAuth process.");
            throw new Error("Failed to complete OAuth process.");
        }

        confirm("Giriş başarılı. Profil sayfasına yönlendiriliyorsunuz.");
        const data = await response.json();
        const jwtToken = data.token;
        const user_id = data.user_id;
        console.log("Received JWT token:", jwtToken);
        console.log("Received user_id:", user_id);

        localStorage.setItem("token", jwtToken);
        localStorage.setItem("user_id", user_id);
        document.cookie = `token=${jwtToken}; path=/; max-age=1500`;


    } catch (error) {
        console.error("Login with 42 API failed:", error);
        alert("Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    }
}

