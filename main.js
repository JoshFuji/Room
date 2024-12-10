import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4, 5, 11);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 2;
controls.maxDistance = 10;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0,1,0);
controls.update();

//ground
// const groundGeometry = new THREE.PlaneGeometry(100, 100, 32, 32);
// groundGeometry.rotateX(-Math.PI / 2);
// const groundMaterial = new THREE.MeshStandardMaterial({
//     color: "#fae8ce",
//     side: THREE.DoubleSide
// });
// const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
// groundMesh.castShadow = false;
// groundMesh.receiveShadow = true;
// scene.add(groundMesh);

//stars
// Create a function to generate stars
function createStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1, // Size of each star
        sizeAttenuation: true, // Size decreases with distance
    });

    const starCount = 5000; // Number of stars
    const positions = new Float32Array(starCount * 3); // x, y, z for each star

    for (let i = 0; i < starCount * 3; i++) {
        // Random position in a large spherical volume
        positions[i] = (Math.random() - 0.5) * 100; // Spread stars over 100x100x100 space
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Create the Points object
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

// Call the function to add stars to the scene
createStars();

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const audio = new Audio('assets/gamecube.mp3');
const audio2 = new Audio('assets/pokeball.mp3');


// Add an event listener for mouse clicks
window.addEventListener('pointerdown', (event) => {
    // Calculate pointer position in normalized device coordinates
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Use raycaster to detect intersected objects
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;

        // Check if the clicked object is the specific one
        if (clickedObject.name === 'Gamecube') {
            console.log('Specific object clicked!');
            audio.play(); // Play the sound
            clickedObject.material.emissive.set(0x00ff00);  
            }
            setTimeout(() => {
                if (clickedObject.material) {
                    clickedObject.material.emissive = new THREE.Color(0x000000); // Reset emissive
                }
            }, 1000);   
        
         if (clickedObject.name === 'pokeball') {
            console.log('Specific object clicked!');
            audio2.play(); // Play the sound
            clickedObject.material.emissive.set(0x00ff00);  
            }
            setTimeout(() => {
                if (clickedObject.material) {
                clickedObject.material.emissive = new THREE.Color(0x000000); // Reset emissive
                }
            }, 1000);     
        }
    }
);

//axis guide
// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );

const spotLight = new THREE.SpotLight(0xffffff, 50, 100, 0.2, 0.5);
spotLight.position.set(0, 10, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

//Sunlight
const sunLight = new THREE.DirectionalLight("#ffffff", 3);
sunLight.castShadow = true;
sunLight.shadow.camera.far = 20;
sunLight.shadow.mapSize.set(1024,1024);
sunLight.shadow.normalBias = 0.05;
sunLight.position.set(1.5, 7, 3);
scene.add(sunLight);

const light = new THREE.AmbientLight( "0x404040", 1 ); 
scene.add( light );

//3D Model Loader
const loader = new GLTFLoader().setPath('assets/');
loader.load('room.gltf', (gltf) => {
    const mesh = gltf.scene;

    mesh.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    mesh.position.set(0, .2, 0);
    mesh.rotation.y = 4.3
    scene.add(mesh);
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene,camera);
}

animate();
