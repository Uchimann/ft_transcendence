import {loadPage, startGameWithPlayer, playTournamentMatch} from '../router.js';
import {validateUser} from '../validate/validate.js';
import {User} from '../profile/profile.js';

export let pairs_global = [];
export let finalArray = new Array();

export function tournamentView(users, Name_1) {
    users.push(Name_1);
    shuffleArray(users);
    createPairs(users);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createPairs(users) {
    for (let i = 0; i < users.length; i += 1) {
        pairs_global.push(users[i]);
    }
}

function displayTournament() {
    const tournamentContainer = document.querySelector('.tournament-container');
    const startGameButtonContainer = document.querySelector('.startTournamentGame');

    if (!tournamentContainer) {
        console.error('Tournament container element not found!');
        return;
    }

    if (!startGameButtonContainer) {
        console.error('Start game button container element not found!');
        return;
    }

    tournamentContainer.innerHTML = '';
    startGameButtonContainer.innerHTML = ''; 
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



    const startButton = document.createElement('button');
    startButton.classList.add('startGame', 'playTournamentMatch', 'TournamentPlay');
    startButton.id = 'TournamentPlay';
    startButton.textContent = 'Start Tournament';
    tournamentContainer.appendChild(startButton);
    startButton.addEventListener('click', playTournamentMatch);
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

export function startGame(againstAnotherPlayer = true, tournamentMode = false) {
    let oppositeName = "";
    let Name_1 = "";
    let a;
      if (againstAnotherPlayer == true && tournamentMode == false) {
        oppositeName = prompt("Lütfen 'Opposite' için bir isim girin:");
        if (oppositeName == null)
        {
            loadPage('profile');
            return;
        }
        while(oppositeName == "")
        {
            oppositeName = prompt("Lütfen 'Opposite' için bir isim girin:");
        }
        document.querySelector('.topLeft').innerHTML = "Self : <i class=\"self\"></i>";
        document.querySelector('.topRight').innerHTML = `${oppositeName} : <i class=\"opposite\"></i>`;
    } else if (tournamentMode == true && againstAnotherPlayer == true) {

        if (pairs_global.length >= 2) {
            document.querySelector('.topLeft').innerHTML = `${pairs_global[0]} : <i class="self"></i>`;
            document.querySelector('.topRight').innerHTML = `${pairs_global[1]} : <i class="opposite"></i>`;
        } else if (finalArray.length >= 2) {

            document.querySelector('.topLeft').innerHTML = `${finalArray[0]} : <i class="self"></i>`;
            document.querySelector('.topRight').innerHTML = `${finalArray[1]} : <i class="opposite"></i>`;
        } else {
            console.error('Oyuncu bilgileri bulunamadı');
            return;
        }
    } else if (tournamentMode == true && againstAnotherPlayer == false) {
        const user = JSON.parse(localStorage.getItem('user'));
        Name_1 = user.username;
        let users = [];
        for (let i = 0; i < 3; i++) {
            a = prompt("Lütfen kullanıcı adını girin:");
            if (a == null)
            {
                loadPage('profile');
                return;
            }
            if (a == "")
            {
                console.log("BURAYA GİRMEYEN OE");
                i--;
            }
            else if (a != null || a != "")
                users.push(a);
        }
        tournamentView(users, Name_1);
        displayTournament(pairs_global);
    } else if (tournamentMode == true && againstAnotherPlayer == true) {
        document.querySelector('.topLeft').innerHTML = `${pairs_global[0]} : <i class=\"self\"></i>`;
        document.querySelector('.topRight').innerHTML = `${pairs_global[1]} : <i class=\"opposite\"></i>`;
    } else if (tournamentMode == false && againstAnotherPlayer == false) {
        oppositeName = "Düşman AI";
        document.querySelector('.topLeft').innerHTML = "Self : <i class=\"self\"></i>";
        document.querySelector('.topRight').innerHTML = "Düşman AI : <i class=\"opposite\"></i>";
    }

    const scene = new THREE.Scene();


    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight, 
        0.1,
        10000
    );


    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    const platformGeometryLeft = new THREE.BoxGeometry(40, 2, 40); 
    const platformGeometryRight = new THREE.BoxGeometry(40, 2, 40); 


    const platformMaterialLeft = new THREE.MeshStandardMaterial({
        color: 0x00FF00,
    });
    const platformMaterialRight = new THREE.MeshStandardMaterial({
        color: 0x00BFFF,
    });


    const platformLeft = new THREE.Mesh(platformGeometryLeft, platformMaterialLeft);
    const platformRight = new THREE.Mesh(platformGeometryRight, platformMaterialRight);

    platformLeft.position.set(-20, -1, 0);
    platformRight.position.set(20, -1, 0);

  
    scene.add(platformLeft);
    scene.add(platformRight);



    const createEdge = (start, end) => {
        const path = new THREE.LineCurve3(start, end);
        const tubeGeometry = new THREE.TubeGeometry(path, 8, 0.1, 8, false); 
        return tubeGeometry;
    };

    const edges = [
        {start: new THREE.Vector3(-40, -2, -20), end: new THREE.Vector3(40, -2, -20)}, 
        {start: new THREE.Vector3(40, -2, -20), end: new THREE.Vector3(40, -2, 20)}, 
        {start: new THREE.Vector3(40, -2, 20), end: new THREE.Vector3(-40, -2, 20)}, 
        {start: new THREE.Vector3(-40, -2, 20), end: new THREE.Vector3(-40, -2, -20)},
        {start: new THREE.Vector3(-40, -2, -20), end: new THREE.Vector3(-40, 5, -20)},
        {start: new THREE.Vector3(40, -2, -20), end: new THREE.Vector3(40, 5, -20)}, 
        {start: new THREE.Vector3(40, -2, 20), end: new THREE.Vector3(40, 5, 20)}, 
        {start: new THREE.Vector3(-40, -2, 20), end: new THREE.Vector3(-40, 5, 20)},
        {start: new THREE.Vector3(-40, 5, -20), end: new THREE.Vector3(40, 2, -20)},
        {start: new THREE.Vector3(40, 5, -20), end: new THREE.Vector3(40, 2, 20)},
        {start: new THREE.Vector3(40, 5, 20), end: new THREE.Vector3(-40, 2, 20)},
        {start: new THREE.Vector3(-40, 5, 20), end: new THREE.Vector3(-40, 2, -20)} 
    ];

    const rainbowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: {value: 0.0}
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
        side: THREE.DoubleSide
    });


    edges.forEach(edge => {
        const edgeGeometry = createEdge(edge.start, edge.end);
        const edgeMesh = new THREE.Mesh(edgeGeometry, rainbowMaterial);
        scene.add(edgeMesh);
    });


    camera.position.set(50, 30, 50);
    camera.lookAt(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);


    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);


    const orbitControls = new THREE.OrbitControls(camera, renderer.domElement);


    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });


    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({color: 0xff0000, metalness: 0.5, roughness: 0.5});
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereMesh.castShadow = true; 
    scene.add(sphereMesh);

    renderer.shadowMap.enabled = true;

    let angle = (Math.PI / 180) * (((THREE.Math.randFloatSpread(1) < 0) ? 90 : 270) + THREE.Math.randFloatSpread(45));

    let sphereVector = {
        x: Math.sin(angle),
        z: Math.cos(angle)
    };


    const selfGeometry = new THREE.BoxGeometry(2, 2, 8); 
    const selfMaterial = new THREE.MeshStandardMaterial({color: 0x0000ff});
    const selfMesh = new THREE.Mesh(selfGeometry, selfMaterial);


    scene.add(selfMesh);


    const oppositeGeometry = new THREE.BoxGeometry(2, 2, 8);
    const oppositeMaterial = new THREE.MeshStandardMaterial({color: 0x006400});
    const oppositeMesh = new THREE.Mesh(oppositeGeometry, oppositeMaterial);


    scene.add(oppositeMesh);


    function MeshPhysicalMaterial() {
        return new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5,
            roughness: 0.0, 
            metalness: 0.0, 
            clearcoat: 1.0,
            clearcoatRoughness: 0.0, 
            envMapIntensity: 1.0,
            refractionRatio: 0.98
        });
    }

    const glassGeometry = new THREE.BoxGeometry(0.05, 2, 40);
    const glassMaterial = MeshPhysicalMaterial();
    const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);


    glassMesh.position.set(40, 1, 0);
    scene.add(glassMesh);

    const triangleShape = new THREE.Shape();
    triangleShape.moveTo(20, 2);      
    triangleShape.lineTo(-20, 2);     
    triangleShape.lineTo(-20, 5);     
    triangleShape.lineTo(20, 2);      


    const extrudeSettings = {
        depth: 0.05,
        bevelEnabled: false 
    };
    const triangleGeometry = new THREE.ExtrudeGeometry(triangleShape, extrudeSettings);


    const triangleMaterial = MeshPhysicalMaterial();


    const triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);
    triangleMesh.position.set(40, 0, 0);
    triangleMesh.rotation.y = -Math.PI / 2;

    scene.add(triangleMesh);

    const glassGeometry2 = new THREE.BoxGeometry(0.05, 2, 40);
    const glassMaterial2 = MeshPhysicalMaterial();
    const glassMesh2 = new THREE.Mesh(glassGeometry2, glassMaterial2);


    glassMesh2.position.set(-40, 1, 0);
    scene.add(glassMesh2);


    const triangleShape2 = new THREE.Shape();
    triangleShape2.moveTo(20, 5);       
    triangleShape2.lineTo(-20, 2);      
    triangleShape2.lineTo(-20, 2);     
    triangleShape2.lineTo(20, 2);      


    const extrudeSettings2 = {
        depth: 0.05,
        bevelEnabled: false 
    };
    const triangleGeometry2 = new THREE.ExtrudeGeometry(triangleShape2, extrudeSettings2);

    const triangleMaterial2 = MeshPhysicalMaterial();


    const triangleMesh2 = new THREE.Mesh(triangleGeometry2, triangleMaterial2);
    triangleMesh2.position.set(-40, 0, 0);
    triangleMesh2.rotation.y = -Math.PI / 2;

    scene.add(triangleMesh2);

    const glassGeometry3 = new THREE.BoxGeometry(80, 2, 0.05);
    const glassMaterial3 = MeshPhysicalMaterial();
    const glassMesh3 = new THREE.Mesh(glassGeometry3, glassMaterial3);

    glassMesh3.position.set(0, 1, 20);
    scene.add(glassMesh3);


    const triangleShape3 = new THREE.Shape();
    triangleShape3.moveTo(40, 5);    
    triangleShape3.lineTo(-40, 2);   
    triangleShape3.lineTo(-40, 2);  
    triangleShape3.lineTo(40, 2);  


    const extrudeSettings3 = {
        depth: 0.05, 
        bevelEnabled: false
    };
    const triangleGeometry3 = new THREE.ExtrudeGeometry(triangleShape3, extrudeSettings3);


    const triangleMaterial3 = MeshPhysicalMaterial();


    const triangleMesh3 = new THREE.Mesh(triangleGeometry3, triangleMaterial3);
    triangleMesh3.position.set(0, 0, 20);

    scene.add(triangleMesh3);

    const glassGeometry4 = new THREE.BoxGeometry(80, 2, 0.05);
    const glassMaterial4 = MeshPhysicalMaterial();
    const glassMesh4 = new THREE.Mesh(glassGeometry4, glassMaterial4);


    glassMesh4.position.set(0, 1, -20);
    scene.add(glassMesh4);


    const triangleShape4 = new THREE.Shape();
    triangleShape4.moveTo(40, 2);     
    triangleShape4.lineTo(-40, 2);   
    triangleShape4.lineTo(-40, 5);    
    triangleShape4.lineTo(40, 2);   


    const extrudeSettings4 = {
        depth: 0.05,
        bevelEnabled: false
    };
    const triangleGeometry4 = new THREE.ExtrudeGeometry(triangleShape4, extrudeSettings4);


    const triangleMaterial4 = MeshPhysicalMaterial();


    const triangleMesh4 = new THREE.Mesh(triangleGeometry4, triangleMaterial4);
    triangleMesh4.position.set(0, 0, -20);

    scene.add(triangleMesh4);


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


    const colors = [];
    for (let i = 0; i < 10000; i++) {
        const color = new THREE.Color();
        color.setHSL(Math.random(), 1, Math.random() > 0.7 ? 1 : 0.5);
        colors.push(color.r, color.g, color.b);
    }

    starsGeometry.setAttribute(
        'color', new THREE.Float32BufferAttribute(colors, 3)
    );

    const starsMaterial = new THREE.PointsMaterial({
        size: 1.3,
        vertexColors: true
    });

    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);


    const speed = 0.6;


    let animationFrameId;

    const clock = new THREE.Clock();

    function animate() {
        animationFrameId = requestAnimationFrame(animate);

        rainbowMaterial.uniforms.time.value = 5 * clock.getElapsedTime();
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


        async function startFirstGame(forWho) {
            console.log('1. MAÇ BİTTİ forwho:', forWho);
            if (forWho === 1) {
                document.querySelector(".topCenter").innerHTML = `${pairs_global[1]} Won`;
                console.log('1.MAÇ BİTTİ ve pairs_global1, paris_global0: bu bilgilerle kayıta gidiyoruz kaydediyoruz', pairs_global[1], pairs_global[0]);
                await validateAndSaveGameResultForTournament(scoreOpposite,scoreSelf);
                const existingCanvas = document.querySelectorAll('canvas');
                existingCanvas.forEach(canvas => canvas.remove());
                returnStartStation();
                locateFinalUsers(pairs_global[1]);
                startGame(true, true, pairs_global);
                cancelAnimationFrame(animationFrameId);
            } else {
                document.querySelector(".topCenter").innerHTML = `${pairs_global[0]} Won`;
                console.log('1.MAÇ BİTTİ ve pairs_global1, paris_global0: bu bilgilerle kayıta gidiyoruz kaydediyoruz', pairs_global[1], pairs_global[0]);
                await validateAndSaveGameResultForTournament(scoreOpposite,scoreSelf);
                const existingCanvas = document.querySelectorAll('canvas');
                existingCanvas.forEach(canvas => canvas.remove());
                returnStartStation();
                locateFinalUsers(pairs_global[0]);
                startGame(true, true, pairs_global);
                cancelAnimationFrame(animationFrameId);
            }
        }

        async function startSecondGame(forWho) {
            if (forWho == 1) {

                const newCanvas = document.createElement('canvas');
                await validateAndSaveGameResultForTournament(scoreOpposite,scoreSelf);
                const existingCanvas = document.querySelectorAll('canvas');
                existingCanvas.forEach(canvas => canvas.remove());

                document.querySelector(".topCenter").innerHTML = `${pairs_global[1]} Won`;
                returnStartStation();
                locateFinalUsers(pairs_global[1]);
                startGame(true, true, pairs_global);
                cancelAnimationFrame(animationFrameId);
                console.log('2.MAÇ BİTTİ ve finalArray:', finalArray);

            } else {

                const newCanvas = document.createElement('canvas');
                await validateAndSaveGameResultForTournament(scoreOpposite,scoreSelf);
                const existingCanvas = document.querySelectorAll('canvas');
                existingCanvas.forEach(canvas => canvas.remove());

                document.querySelector(".topCenter").innerHTML = `${pairs_global[0]} Won`;
                returnStartStation();
                locateFinalUsers(pairs_global[0]);
                startGame(true, true, pairs_global);
                cancelAnimationFrame(animationFrameId);
                console.log('2.MAÇ BİTTİ ve finalArray:', finalArray);

            }
        }

        async function startThirdGame(forWho) {
            if (forWho === 1) {
                const existingCanvas = document.querySelectorAll('canvas');
                existingCanvas.forEach(canvas => canvas.remove());


   
                await validateAndSaveGameResultForTournament(scoreOpposite,scoreSelf);

                console.log('3.maç sonrası pairs global:', pairs_global[0], pairs_global[1]);

                showAlert();
                cancelAnimationFrame(animationFrameId);
                alert('Turnuva bitti ŞAMPİYON: ' + finalArray[1]);
                finalArray = [];
                pairs_global = [];
                returnStartStation();

            } else {
                const existingCanvas = document.querySelectorAll('canvas');
                existingCanvas.forEach(canvas => canvas.remove());


                await validateAndSaveGameResultForTournament(scoreOpposite,scoreSelf);

                console.log('3.maç sonrası pairs global:', pairs_global[0], pairs_global[1]);

                showAlert();
                cancelAnimationFrame(animationFrameId);
                alert('Turnuva bitti ŞAMPİYON: ' + finalArray[0]);
                finalArray = [];
                pairs_global = [];
                returnStartStation();

            }
        }

        function startGameForNormal(forWho) {
            if (forWho === 1) {
                handleGameResult(scoreSelf, scoreOpposite, oppositeName, againstAnotherPlayer);
                returnStartStation();
                cancelAnimationFrame(animationFrameId);
            } else {
                handleGameResult(scoreSelf, scoreOpposite, oppositeName, againstAnotherPlayer);
                returnStartStation();
                cancelAnimationFrame(animationFrameId);
            }
            showAlert();
        }

        function showAlert() {
            let messageBox = document.createElement('div');
            messageBox.style.position = 'fixed';
            messageBox.style.top = '50%';
            messageBox.style.left = '50%';
            messageBox.style.transform = 'translate(-50%, -50%)';
            messageBox.style.padding = '20px';
            messageBox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            messageBox.style.color = 'white';
            messageBox.style.fontSize = '20px';
            messageBox.style.borderRadius = '10px';
            messageBox.style.textAlign = 'center';
            document.body.appendChild(messageBox);
        
            let countdown = 3;
        
            function updateMessage() {
                if (countdown > 0) {
                    messageBox.textContent = `Oyun bitti eve dönme vakti. ${countdown} saniye kaldı.`;
                    countdown--;
                    setTimeout(updateMessage, 1000);
                } else {
                    messageBox.textContent = 'Oyun bitti eve dönme vakti.';
                    setTimeout(() => {
                        document.body.removeChild(messageBox);
                        loadPage('profile');
                    }, 1000);
                }
            }
            returnStartStation();
            updateMessage();
        }

        if (sphereMesh.position.x > 37) {
            if (sphereMesh.position.x > 38.95) {
                sphereMesh.position.x = 0;
                sphereMesh.position.z = 0;
                angle = (Math.PI / 180) * (270 + THREE.Math.randFloatSpread(45));
                sphereVector.x = Math.sin(angle);
                sphereVector.z = Math.cos(angle);
                if (++scoreOpposite == 10) {
                    if (tournamentMode === true && againstAnotherPlayer === true && finalArray.length === 0) {
                        startFirstGame(1);
                        return;
                    } else if (tournamentMode == true && againstAnotherPlayer == true && finalArray.length == 1) {
                        startSecondGame(1);
                        return;
                    } else if (tournamentMode === true && againstAnotherPlayer === true && finalArray.length === 2) {
                        startThirdGame(1);
                        return;
                    } else {
                        document.querySelector(".topCenter").innerHTML = `${oppositeName} Won`;
                        startGameForNormal(1);
                    }
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
                if (++scoreSelf == 10) {
                    if (tournamentMode == true && againstAnotherPlayer == true && finalArray.length == 0) {
                        startFirstGame(2)
                        return;
                    } else if (tournamentMode == true && againstAnotherPlayer == true && finalArray.length == 1) {
                        startSecondGame(2)
                        return;
                    } else if (tournamentMode == true && againstAnotherPlayer == true && finalArray.length == 2) {
                        startThirdGame(2)
                        return;
                    } else {
                        document.querySelector(".topCenter").innerHTML = "Self Won";
                        startGameForNormal(2)
                    }
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

        orbitControls.update();


        renderer.render(scene, camera);
    }

    animate();
}

async function handleGameResult(scoreSelf, scoreOpposite, oppositeName, againstAnotherPlayer) {
    if (againstAnotherPlayer) {
        console.log('IJ GUCLERIM22222', scoreSelf, scoreOpposite, oppositeName);
        try {
            const isValid = await checkUsernameFunc(scoreSelf, scoreOpposite, oppositeName);
            console.log('IJJJ GUCLEERRR 333333:', scoreSelf, scoreOpposite, oppositeName);
            console.log('isValid:', isValid);
            if (isValid === true) {
                console.log('Outside checkUsernameFunc:', scoreSelf, scoreOpposite, oppositeName);
                saveGameResult(scoreSelf, scoreOpposite, oppositeName);
            }
        } catch (error) {
            console.error('Error occurred:', error);
        }
    }

}

async function checkUsernameFunc(scoreSelf, scoreOpposite, oppositeName) {
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
        if (response.status === 200) {
            return true;
        }
        else
            return false;
    } catch (error) {
        console.error('Error occurred:', error);
        return false;
    }
}


async function checkUsernameforTournament(username) {
    console.log('Inside checkUsername:forTournament', username);
    const token = document.cookie.split('; ').find(cookie => cookie.startsWith('token=')).split('=')[1];
    const storedUserId = JSON.parse(localStorage.getItem('user'));

    try {
        const response = await fetch(`http://127.0.0.1:8007/users/check_username/?username=${username}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'id': storedUserId.id
            }
        });

        if (response.status === 200) {
            return true;
        } else {
            console.log('Username check failed with status:', response.status);
            return false;
        }
    } catch (error) {
        console.error('Error occurred:', error);
        return false;
    }
}




async function validateAndSaveGameResultForTournament(scoreOpposite, scoreSelf) {
    


    if(finalArray.length != 2) {
        const isUsername1Valid = await checkUsernameforTournament(pairs_global[1]);
        const isUsername2Valid = await checkUsernameforTournament(pairs_global[0]);
    
        console.log('validataansdavegameresultfortournamentisUsername1 ve isUsername2', isUsername1Valid, isUsername2Valid);
        console.log('Validate\'e geldik Inside validateAndSaveGameResult: scoreopposite, scoreself, pairs1, pairs0 isvalidusername1(1), isvalidusername2(0)', scoreOpposite, scoreSelf, pairs_global[1], pairs_global[0], isUsername1Valid, isUsername2Valid);
    
        if (isUsername1Valid  === true && isUsername2Valid === true) {
            console.log('if e girdik kayıta gidiyoruz');
         saveGameResultforTournament(scoreOpposite, scoreSelf, pairs_global[1], pairs_global[0]);
        }
    } else {
        const isUsername1Valid = await checkUsernameforTournament(finalArray[1]);
        const isUsername2Valid = await checkUsernameforTournament(finalArray[0]);
    
        console.log('FİNAL validataansdavegameresultfortournamentisUsername1 ve isUsername2', isUsername1Valid, isUsername2Valid);
        console.log('FİNAL Validate\'e geldik Inside validateAndSaveGameResult: scoreopposite, scoreself, final1, final0 isvalidusername1(1), isvalidusername2(0)', scoreOpposite, scoreSelf, finalArray[1], finalArray[0], isUsername1Valid, isUsername2Valid);
    
        if (isUsername1Valid === true && isUsername2Valid === true) {
            console.log('FİNAL if e girdik kayıta gidiyoruz');
         saveGameResultforTournament(scoreOpposite, scoreSelf, finalArray[1], finalArray[0]);
        }
    }
}


function saveGameResult(playerOneScore, playerTwoScore, userName) {
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

function saveGameResultforTournament(playerOneScore, playerTwoScore, playerOneUsername, playerTwoUsername) {
    console.log('Inside saveMatchResult:', playerOneScore, playerTwoScore, playerOneUsername, playerTwoUsername);

    const token = document.cookie.split('; ').find(cookie => cookie.startsWith('token=')).split('=')[1];
    const storedUserId = JSON.parse(localStorage.getItem('user'));

    const data = {
        player_one_score: playerOneScore,
        player_two_score: playerTwoScore,
        user_name: playerOneUsername,
        user_two_name: playerTwoUsername
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
    .then(res => res.ok ? true : false)
    .catch(error => {
        console.error('Error occurred:', error);
        return false;
    });
}


export function locateFinalUsers(winner) {
    finalArray.push(winner);
    pairs_global.shift();
    pairs_global.shift();
    console.log('Final Array:', finalArray);

    console.log('pairs_global yeni hali yani diğer 2.maç:', pairs_global);
}