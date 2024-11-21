import { loadPage, startGameWithPlayer, playTournamentMatch} from '../router.js';
import { validateUser } from '../validate/validate.js';
import {User} from '../profile/profile.js'; 

export let pairs_global = [];

export function tournamentView(users, Name_1) {
    users.push(Name_1);
    shuffleArray(users);
    createPairs(users);
}

function shuffleArray(array) {
    // Shuffle function to randomize the array
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

function createPairs(users) {
    // Create pairs of users (assuming an even number of users)
    for (let i = 0; i < users.length; i += 1) {
            pairs_global.push(users[i]);
    }
}

function displayTournament() {
    // Get the container where you want to display the pairs
    const tournamentContainer = document.querySelector('.tournament-container');
    const startGameButtonContainer = document.querySelector('.startTournamentGame');

    // Ensure the container exists before trying to set innerHTML
    if (!tournamentContainer) {
        console.error('Tournament container element not found!');
        return;
    }

    if (!startGameButtonContainer) {
        console.error('Start game button container element not found!');
        return;
    }

    tournamentContainer.innerHTML = ''; // Clear the container
    startGameButtonContainer.innerHTML = ''; // Clear the button container
    for (let index = 0; index < pairs_global.length; index += 2) {
        const pairDiv = document.createElement('div');
        pairDiv.classList.add('pair');
        pairDiv.innerHTML = `
            <div class="pair">
                <div class="pair-item">${pairs_global[index]} vs ${pairs_global[index + 1]} </div>
            </div>
        `;
            if (index === 0) {
                pairDiv.classList.add('first-match');
            }
        tournamentContainer.appendChild(pairDiv);
    }
    // Iterate over the pairs and display them

    // Add the button dynamically
    const startButton = document.createElement('button');
    startButton.classList.add('startGame', 'playTournamentMatch', 'TournamentPlay');
    startButton.id = 'TournamentPlay';
    startButton.textContent = 'Start Tournament';
    tournamentContainer.appendChild(startButton);
    startButton.addEventListener('click',playTournamentMatch);
}


export async function isUsersValid(args) {
    const token = document.cookie.split('; ').find(cookie => cookie.startsWith('token=')).split('=')[1];
    const userId = JSON.parse(localStorage.getItem('user')).id;
    try {
        const usersResponse = await fetch('http://localhost:8007/users/list/', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'id': userId
            }
        });
        const usersData = await usersResponse.json();
        const users = usersData.map(user => new User(user));
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === args) {
                return true;
            }
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        return null;
    }
    return false
}

export async function game(againstAnotherPlayer = true, tournamentMode = false) {
    let oppositeName = "";
    let Name_1 = "";
    if(againstAnotherPlayer == true && tournamentMode == false) {
        // Kullanıcıdan input almak için prompt kullan
        oppositeName = prompt("Lütfen 'Opposite' için bir isim girin:");
        document.querySelector('.topLeft').innerHTML = "Self : <i class=\"self\"></i>";
        document.querySelector('.topRight').innerHTML = `${oppositeName} : <i class=\"opposite\"></i>`;
    }
    else if (tournamentMode == true && againstAnotherPlayer == false) {
        const user = JSON.parse(localStorage.getItem('user'));
        let usercount = prompt("Kaç kişi oynayacak?");
        Name_1 = user.username;
        let users = [];
        for (let i = 0; i < usercount; i++) {
            i = prompt("Lütfen kullanıcı adını girin:");
            if (!await isUsersValid(i)) {
                alert("Lütfen geçerli kullanıcılar girin.");
                return;
            }
            else
                users.push(i);
        }
        tournamentView(users, Name_1);
        displayTournament(pairs_global);
    }
    else if (tournamentMode == true && againstAnotherPlayer == true) {
        document.querySelector('.topLeft').innerHTML = `${pairs_global[0]} : <i class=\"self\"></i>`;
        document.querySelector('.topRight').innerHTML = `${pairs_global[1]} : <i class=\"opposite\"></i>`;
    }
    else if (tournamentMode == false && againstAnotherPlayer == false) {
        oppositeName = "Düşman AI";
        document.querySelector('.topLeft').innerHTML = "Self : <i class=\"self\"></i>";
        document.querySelector('.topRight').innerHTML = "Düşman AI : <i class=\"opposite\"></i>";
    }
    // 1. Sahne (Scene)
    const scene = new THREE.Scene();

    // 2. Kamera (PerspectiveCamera)
    const camera = new THREE.PerspectiveCamera(
        75, // Görüş alanı (FOV)
        window.innerWidth / window.innerHeight, // Görüntü oranı
        0.1, // Yakınlık mesafesi
        10000 // Uzaklık mesafesi
    );

    // 3. Renderer (WebGLRenderer)
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 4. Geometri ve Şeffaf Mavi Materyal (Platform)
    // İki ayrı platform geometrisi oluşturun
    const platformGeometryLeft = new THREE.BoxGeometry(40, 2, 40); // Sol taraf için
    const platformGeometryRight = new THREE.BoxGeometry(40, 2, 40); // Sağ taraf için

    // Malzemeleri oluşturun ve renklerini ayarlayın
    const platformMaterialLeft = new THREE.MeshStandardMaterial({
        color: 0x00FF00 , // Yeşil renk
        transparent: true, // Şeffaflık aktif
    });
    const platformMaterialRight = new THREE.MeshStandardMaterial({
        color: 0x00BFFF, // Mavi renk
        transparent: true, // Şeffaflık aktif
    });

    // İki ayrı mesh oluşturun
    const platformLeft = new THREE.Mesh(platformGeometryLeft, platformMaterialLeft);
    const platformRight = new THREE.Mesh(platformGeometryRight, platformMaterialRight);

    // Konumlandırma
    platformLeft.position.set(-20, -1, 0); // Sol taraf
    platformRight.position.set(20, -1, 0); // Sağ taraf

    // Platformları sahneye ekleyin
    scene.add(platformLeft);
    scene.add(platformRight);


    // 5. Kenarları Oluşturmak İçin TubeGeometry Kullanımı
    const createEdge = (start, end) => {
        const path = new THREE.LineCurve3(start, end);
        const tubeGeometry = new THREE.TubeGeometry(path, 8, 0.1, 8, false); // Çapı artırdık
        return tubeGeometry;
    };

    const edges = [
        { start: new THREE.Vector3(-40, -2, -20), end: new THREE.Vector3(40, -2, -20) }, // Alt kenar
        { start: new THREE.Vector3(40, -2, -20), end: new THREE.Vector3(40, -2, 20) },  // Sağ kenar
        { start: new THREE.Vector3(40, -2, 20), end: new THREE.Vector3(-40, -2, 20) },  // Üst kenar
        { start: new THREE.Vector3(-40, -2, 20), end: new THREE.Vector3(-40, -2, -20) }, // Sol kenar
        { start: new THREE.Vector3(-40, -2, -20), end: new THREE.Vector3(-40, 5, -20) }, // Sol dikey kenar
        { start: new THREE.Vector3(40, -2, -20), end: new THREE.Vector3(40, 5, -20) },  // Sağ dikey kenar
        { start: new THREE.Vector3(40, -2, 20), end: new THREE.Vector3(40, 5, 20) },   // Sağ dikey kenar
        { start: new THREE.Vector3(-40, -2, 20), end: new THREE.Vector3(-40, 5, 20) },  // Sol dikey kenar
        { start: new THREE.Vector3(-40, 5, -20), end: new THREE.Vector3(40, 2, -20) },  // Üst kenar
        { start: new THREE.Vector3(40, 5, -20), end: new THREE.Vector3(40, 2, 20) },   // Üst kenar
        { start: new THREE.Vector3(40, 5, 20), end: new THREE.Vector3(-40, 2, 20) },   // Üst kenar
        { start: new THREE.Vector3(-40, 5 , 20), end: new THREE.Vector3(-40, 2, -20) }  // Üst kenar
    ];

    const rainbowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 } // Zamanı kontrol eden uniform
        },
        vertexShader: `
            varying vec3 vPosition;
            void main() {
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            varying vec3 vPosition;
            void main() {
                float r = sin(time + vPosition.x * 10.0) * 0.5 + 0.5;
                float g = sin(time + vPosition.y * 10.0) * 0.5 + 0.5;
                float b = sin(time + vPosition.z * 10.0) * 0.5 + 0.5;
                gl_FragColor = vec4(r, g, b, 1.0);
            }
        `,
        side: THREE.DoubleSide // Çubuğun her iki yüzeyini render et
    });

    // Kenarları oluşturan Tube geometrileri
    edges.forEach(edge => {
        const edgeGeometry = createEdge(edge.start, edge.end);
        const edgeMesh = new THREE.Mesh(edgeGeometry, rainbowMaterial);
        scene.add(edgeMesh);
    });

    // 6. Kamera pozisyonu
    camera.position.set(50, 30, 50); // Kamera pozisyonunu güncelledik
    camera.lookAt(0, 0, 0);

    // 7. Ambient Işık
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // 8. Directional Işık
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // 9. OrbitControls
    const orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

    // 10. Pencere Boyutlarını Güncelleme
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 11. Küre
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32); // Küre çapını küçült
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.5, roughness: 0.5 }); // Metalik ve parlak bir malzeme
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereMesh.castShadow = true; // Gölge oluşturmayı sağla
    scene.add(sphereMesh);

    // Gölge efektlerini açma
    renderer.shadowMap.enabled = true;

    let angle = (Math.PI / 180) * (((THREE.Math.randFloatSpread(1) < 0) ? 90 : 270) + THREE.Math.randFloatSpread(45));

    let sphereVector = {
        x: Math.sin(angle),
        z: Math.cos(angle)
    };

    // 12. Kendimizi ekliyoruz
    const selfGeometry = new THREE.BoxGeometry(2, 2, 8); // Dikdörtgenler prizmasının boyutları
    const selfMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff }); // Mavi renk
    const selfMesh = new THREE.Mesh(selfGeometry, selfMaterial);

    // Dikdörtgenler prizmasını platformun üstüne yerleştir
    scene.add(selfMesh);

    // 13. Rakibi ekliyoruz
    const oppositeGeometry = new THREE.BoxGeometry(2, 2, 8); // Dikdörtgenler prizmasının boyutları
    const oppositeMaterial = new THREE.MeshStandardMaterial({ color: 0x006400 }); // Yeşil renk
    const oppositeMesh = new THREE.Mesh(oppositeGeometry, oppositeMaterial);

    // Dikdörtgenler prizmasını platformun üstüne yerleştir
    scene.add(oppositeMesh);

    // 14. Cam ekliyorum
    function MeshPhysicalMaterial() {
        return new THREE.MeshPhysicalMaterial({
            color: 0xffffff, // Camın rengi beyaz
            transparent: true, // Şeffaflık
            opacity: 0.5, // Şeffaflık yoğunluğu
            roughness: 0.0, // Pürüzsüz yüzey
            metalness: 0.0, // Metalik etki (camda metalik etki genellikle kullanılmaz)
            clearcoat: 1.0, // Camın parlaklığı (clearcoat cam yüzeyinin parlaklığını kontrol eder)
            clearcoatRoughness: 0.0, // Camın yüzeyindeki pürüzsüzlük (0 = pürüzsüz)
            envMapIntensity: 1.0, // Çevresel ışığın etkisi
            refractionRatio: 0.98 // Kırılma oranı
        });
    }

    const glassGeometry = new THREE.BoxGeometry(0.05, 2, 40);
    const glassMaterial = MeshPhysicalMaterial();
    const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);

    // Camı platformun üstüne yerleştir
    glassMesh.position.set(40, 1, 0);
    scene.add(glassMesh);

    // Üçgenin şeklini oluşturuyoruz
    const triangleShape = new THREE.Shape();
    triangleShape.moveTo(20, 2);       // A noktası (x, y)
    triangleShape.lineTo(-20, 2);      // B noktası (x, y)
    triangleShape.lineTo(-20, 5);      // C noktası (x, y)
    triangleShape.lineTo(20, 2);       // Üçgeni kapat

    // Kalınlık için ExtrudeGeometry oluşturuyoruz
    const extrudeSettings = {
        depth: 0.05, // Üçgenin kalınlığı
        bevelEnabled: false // Kenar yumuşatma kapalı
    };
    const triangleGeometry = new THREE.ExtrudeGeometry(triangleShape, extrudeSettings);

    // Üçgenin materyalini oluşturuyoruz
    const triangleMaterial = MeshPhysicalMaterial();

    // Üçgeni oluşturuyoruz
    const triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);
    triangleMesh.position.set(40, 0, 0);
    triangleMesh.rotation.y = -Math.PI / 2;
    // Üçgeni sahneye ekliyoruz
    scene.add(triangleMesh);

    const glassGeometry2 = new THREE.BoxGeometry(0.05, 2, 40);
    const glassMaterial2 = MeshPhysicalMaterial();
    const glassMesh2 = new THREE.Mesh(glassGeometry2, glassMaterial2);

    // Camı platformun üstüne yerleştir
    glassMesh2.position.set(-40, 1, 0);
    scene.add(glassMesh2);

    // Üçgenin şeklini oluşturuyoruz
    const triangleShape2 = new THREE.Shape();
    triangleShape2.moveTo(20, 5);       // A noktası (x, y)
    triangleShape2.lineTo(-20, 2);      // B noktası (x, y)
    triangleShape2.lineTo(-20, 2);      // C noktası (x, y)
    triangleShape2.lineTo(20, 2);       // Üçgeni kapat

    // Kalınlık için ExtrudeGeometry oluşturuyoruz
    const extrudeSettings2 = {
        depth: 0.05, // Üçgenin kalınlığı
        bevelEnabled: false // Kenar yumuşatma kapalı
    };
    const triangleGeometry2 = new THREE.ExtrudeGeometry(triangleShape2, extrudeSettings2);

    // Üçgenin materyalini oluşturuyoruz
    const triangleMaterial2 = MeshPhysicalMaterial();

    // Üçgeni oluşturuyoruz
    const triangleMesh2 = new THREE.Mesh(triangleGeometry2, triangleMaterial2);
    triangleMesh2.position.set(-40, 0, 0);
    triangleMesh2.rotation.y = -Math.PI / 2;
    // Üçgeni sahneye ekliyoruz
    scene.add(triangleMesh2);

    const glassGeometry3 = new THREE.BoxGeometry(80, 2, 0.05);
    const glassMaterial3 = MeshPhysicalMaterial();
    const glassMesh3 = new THREE.Mesh(glassGeometry3, glassMaterial3);

    // Camı platformun üstüne yerleştir
    glassMesh3.position.set(0, 1, 20);
    scene.add(glassMesh3);

    // Üçgenin şeklini oluşturuyoruz
    const triangleShape3 = new THREE.Shape();
    triangleShape3.moveTo(40, 5);       // A noktası (x, y)
    triangleShape3.lineTo(-40, 2);      // B noktası (x, y)
    triangleShape3.lineTo(-40, 2);      // C noktası (x, y)
    triangleShape3.lineTo(40, 2);       // Üçgeni kapat

    // Kalınlık için ExtrudeGeometry oluşturuyoruz
    const extrudeSettings3 = {
        depth: 0.05, // Üçgenin kalınlığı
        bevelEnabled: false // Kenar yumuşatma kapalı
    };
    const triangleGeometry3 = new THREE.ExtrudeGeometry(triangleShape3, extrudeSettings3);

    // Üçgenin materyalini oluşturuyoruz
    const triangleMaterial3 = MeshPhysicalMaterial();

    // Üçgeni oluşturuyoruz
    const triangleMesh3 = new THREE.Mesh(triangleGeometry3, triangleMaterial3);
    triangleMesh3.position.set(0, 0, 20);
    // Üçgeni sahneye ekliyoruz
    scene.add(triangleMesh3);

    const glassGeometry4 = new THREE.BoxGeometry(80, 2, 0.05);
    const glassMaterial4 = MeshPhysicalMaterial();
    const glassMesh4 = new THREE.Mesh(glassGeometry4, glassMaterial4);

    // Camı platformun üstüne yerleştir
    glassMesh4.position.set(0, 1, -20);
    scene.add(glassMesh4);

    // Üçgenin şeklini oluşturuyoruz
    const triangleShape4 = new THREE.Shape();
    triangleShape4.moveTo(40, 2);       // A noktası (x, y)
    triangleShape4.lineTo(-40, 2);      // B noktası (x, y)
    triangleShape4.lineTo(-40, 5);      // C noktası (x, y)
    triangleShape4.lineTo(40, 2);       // Üçgeni kapat

    // Kalınlık için ExtrudeGeometry oluşturuyoruz
    const extrudeSettings4 = {
        depth: 0.05, // Üçgenin kalınlığı
        bevelEnabled: false // Kenar yumuşatma kapalı
    };
    const triangleGeometry4 = new THREE.ExtrudeGeometry(triangleShape4, extrudeSettings4);

    // Üçgenin materyalini oluşturuyoruz
    const triangleMaterial4 = MeshPhysicalMaterial();

    // Üçgeni oluşturuyoruz
    const triangleMesh4 = new THREE.Mesh(triangleGeometry4, triangleMaterial4);
    triangleMesh4.position.set(0, 0, -20);
    // Üçgeni sahneye ekliyoruz
    scene.add(triangleMesh4);

    // 15. Klavye Kontrolleri
    const controls = {
        moveLeft: false,
        moveRight: false
    };

    const oppositeControls = {
        moveLeft: false,
        moveRight: false
    };

    let isStart;
    let scoreSelf;
    let scoreOpposite;

    console.log('Outside checkUsernameFunc:', scoreSelf, scoreOpposite, oppositeName);

    function returnStartStation() {
        sphereMesh.position.set(0, 1, 0);
        oppositeMesh.position.set(-38.95, 1, 0);
        selfMesh.position.set(38.95, 1, 0);
        isStart = false;
        scoreSelf = 0;
        scoreOpposite = 0;
        document.querySelector('.self').innerHTML = "score";
        document.querySelector('.opposite').innerHTML = "score";
        return;
        //const denemeuchiman = document.querySelector(".startAgaintsAnotherPlayerGame");
        //denemeuchiman.removeEventListener("click", startGameWithPlayer);
    }

    returnStartStation();

    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'a':
                controls.moveLeft = true;
                break;
            case 'd':
                controls.moveRight = true;
                break;
            case 'ArrowLeft':
                oppositeControls.moveLeft = true;
                break;
            case 'ArrowRight':
                oppositeControls.moveRight = true;
                break;
            case ' ':
                isStart = true;
                break;
            case 'Escape':
                returnStartStation();
                break;
        }
    });

    window.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'a':
                controls.moveLeft = false;
                break;
            case 'd':
                controls.moveRight = false;
                break;
            case 'ArrowLeft':
                oppositeControls.moveLeft = false;
                break;
            case 'ArrowRight':
                oppositeControls.moveRight = false;
                break;
        }
    });

    // 16. Yıldızlar
    const stars = [];
    for (let i = 0; i < 10000; i++) {
        let x = THREE.Math.randFloatSpread(2000);
        let y = THREE.Math.randFloatSpread(2000);
        let z = THREE.Math.randFloatSpread(2000);
        stars.push(x, y, z);
    }

    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute(
        "position", new THREE.Float32BufferAttribute(stars, 3)
    );

    // Yıldızların rengini rastgele ayarlamak için renkler
    const colors = [];
    for (let i = 0; i < 10000; i++) {
        const color = new THREE.Color();
        color.setHSL(Math.random(), 1, Math.random() > 0.7 ? 1 : 0.5); // Daha parlak renkler için
        colors.push(color.r, color.g, color.b);
    }

    starsGeometry.setAttribute(
        'color', new THREE.Float32BufferAttribute(colors, 3)
    );

    const starsMaterial = new THREE.PointsMaterial({
        size: 1.3, // Yıldız boyutu
        vertexColors: true // Renkleri kullan
    });

    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // 17. Animasyon Döngüsü
    const speed = 1.4;


    let animationFrameId;

    function animate() {
        animationFrameId=requestAnimationFrame(animate);

        // Küreyi hareket ettir

        if (isStart) {
            document.querySelector('.self').innerHTML = scoreSelf;
            document.querySelector('.opposite').innerHTML = scoreOpposite;
            sphereMesh.position.x += 2 * sphereVector.x * speed;
            sphereMesh.position.z += 2 * sphereVector.z * speed;
        }

        if (controls.moveRight) {
            selfMesh.position.z -= speed;
            if (selfMesh.position.z < -15.95)
                selfMesh.position.z = -15.95;
        }
        if (controls.moveLeft) {
            selfMesh.position.z += speed;
            if (selfMesh.position.z > 15.95)
                selfMesh.position.z = 15.95;
        }
        if (againstAnotherPlayer) {
            if (oppositeControls.moveRight) {
                oppositeMesh.position.z += speed;
                if (oppositeMesh.position.z > 15.95)
                    oppositeMesh.position.z = 15.95;
            }
            if (oppositeControls.moveLeft) {
                oppositeMesh.position.z -= speed;
                if (oppositeMesh.position.z < -15.95)
                    oppositeMesh.position.z = -15.95;
            }
        } else {
            if (oppositeMesh.position.z < sphereMesh.position.z) {
                oppositeMesh.position.z += 0.3 * speed;
                if (oppositeMesh.position.z > 15.95)
                    oppositeMesh.position.z = 15.95;
            } else {
                oppositeMesh.position.z -= 0.3 * speed;
                if (oppositeMesh.position.z < -15.95)
                    oppositeMesh.position.z = -15.95;
            }
        }

        if (sphereMesh.position.z > 18.95) {
            sphereVector.z *= -1;
            while (sphereMesh.position.z > 18.95) {
                sphereMesh.position.x += sphereVector.x * speed;
                sphereMesh.position.z += sphereVector.z * speed;
            }
        }
        if (sphereMesh.position.z < -18.95) {
            sphereVector.z *= -1;
            while (sphereMesh.position.z < -18.95) {
                sphereMesh.position.x += sphereVector.x * speed;
                sphereMesh.position.z += sphereVector.z * speed;
            }
        }
        if (sphereMesh.position.x > 37) {
            if (sphereMesh.position.x > 38.95) {
                sphereMesh.position.x = 0;
                sphereMesh.position.z = 0;
                angle = (Math.PI / 180) * (270 + THREE.Math.randFloatSpread(45));
                sphereVector.x = Math.sin(angle);
                sphereVector.z = Math.cos(angle);
                console.log('OIIIIFFFFFFF 111131111:', scoreSelf, scoreOpposite, oppositeName);
                if (++scoreOpposite == 10) {
                    console.log('IJ GUCLERIM:', scoreSelf, scoreOpposite, oppositeName);
                    document.querySelector(".topCenter").innerHTML = `${oppositeName} Won`;
                    handleGameResult(scoreSelf, scoreOpposite, oppositeName,againstAnotherPlayer);
                    returnStartStation();
                    cancelAnimationFrame(animationFrameId);
                }
            } else if (sphereMesh.position.z < selfMesh.position.z + 4 && sphereMesh.position.z > selfMesh.position.z - 4) {
                angle = Math.PI - angle;
                sphereVector.x *= -1;
                while (sphereMesh.position.x > 37) {
                    sphereMesh.position.x += sphereVector.x * speed;
                    sphereMesh.position.z += sphereVector.z * speed;
                }
            }
        }
        if (sphereMesh.position.x < -37) {
            if (sphereMesh.position.x < -38.95) {
                sphereMesh.position.x = 0;
                sphereMesh.position.z = 0;
                angle = (Math.PI / 180) * (90 + THREE.Math.randFloatSpread(45));
                sphereVector.x = Math.sin(angle);
                sphereVector.z = Math.cos(angle);
                console.log('OIIIIFFFFFFF 111131111:', scoreSelf, scoreOpposite, oppositeName);
                if (++scoreSelf == 10) {
                    console.log('IJ GUCLERIM:', scoreSelf, scoreOpposite, oppositeName);
                    document.querySelector(".topCenter").innerHTML = "Self Won";
                    handleGameResult(scoreSelf, scoreOpposite, oppositeName,againstAnotherPlayer);
                    returnStartStation();
                    cancelAnimationFrame(animationFrameId);
                }
            } else if (sphereMesh.position.z < oppositeMesh.position.z + 4 && sphereMesh.position.z > oppositeMesh.position.z - 4) {
                angle = Math.PI - angle;
                sphereVector.x *= -1;
                while (sphereMesh.position.x < -37) {
                    sphereMesh.position.x += sphereVector.x * speed;
                    sphereMesh.position.z += sphereVector.z * speed;
                }
            }
        }
        // Kamerayı kontrol etme
        orbitControls.update();

        // Sahneyi render etme
        renderer.render(scene, camera);
    }

    animate();
}

async function handleGameResult(scoreSelf, scoreOpposite, oppositeName,againstAnotherPlayer) {
    if (againstAnotherPlayer) {
        console.log('IJ GUCLERIM22222', scoreSelf, scoreOpposite, oppositeName);
        try {
            const isValid = await checkUsernameFunc(scoreSelf, scoreOpposite, oppositeName);
            console.log('IJJJ GUCLEERRR 333333:', scoreSelf, scoreOpposite, oppositeName);
            if (isValid === true) {
                console.log('Outside checkUsernameFunc:', scoreSelf, scoreOpposite, oppositeName);
                saveGameResult(scoreSelf, scoreOpposite, oppositeName);
            }
        } catch (error) {
            console.error('Error occurred:', error);
        }
    }

}

async function checkUsernameFunc(scoreSelf,scoreOpposite,oppositeName) {
    console.log('Inside checkUsernameFunc:', scoreSelf, scoreOpposite, oppositeName);
    const token = document.cookie.split('; ').find(cookie => cookie.startsWith('token=')).split('=')[1];
    const storedUserId = JSON.parse(localStorage.getItem('user'));

    try {
        const response = await fetch(`http://127.0.0.1:8007/users/check_username/?username=${oppositeName}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'id': storedUserId.id
            }
        });

        return response.ok;
    } catch (error) {
        console.error('Error occurred:', error);
        return false;
    }
}

async function saveGameResult(playerOneScore, playerTwoScore, userName) {
    console.log('Inside saveGameResult:', playerOneScore, playerTwoScore, userName);

    const token = document.cookie.split('; ').find(cookie => cookie.startsWith('token=')).split('=')[1];
    const storedUserId = JSON.parse(localStorage.getItem('user'));

    
    const data = {
        player_one_score: playerOneScore,
        player_two_score: playerTwoScore,
        user_name: storedUserId.username,
        user_two_name: userName
    };

    return fetch('http://127.0.0.1:8007/game/save/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'id': storedUserId.id,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.ok)
    .catch(error => {
        console.error('Error occurred:', error);
        return false;
    });
}

