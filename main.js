import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Create a scene
const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(ambientLight);

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1, 2);
scene.add(camera);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add event listener for mouse clicks on the renderer's DOM element
renderer.domElement.addEventListener('click', onMouseClick);

// Function to handle mouse clicks
function onMouseClick(event) {
	// Calculate mouse coordinates relative to the renderer's DOM element
	const mouse = {
		x: (event.clientX / window.innerWidth) * 2 - 1,
		y: -(event.clientY / window.innerHeight) * 2 + 1
	};

	// Create a raycaster and set it from the camera to the mouse coordinates
	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(mouse, camera);

	// Perform raycasting to find intersections with objects in the scene
	const intersects = raycaster.intersectObjects(scene.children, true);

	// Log the intersections to the console for debugging
	console.log("Intersects:", intersects);

	// If there are intersections, rotate the first intersected object
	if (intersects.length > 0) {
		const model = intersects[0].object;
		console.log("Clicked on model:", model);
		model.rotation.y += Math.PI / 4; // Rotate by 45 degrees
	}
}
// Define the model variable globally
let model;

// Function to change the color of the model
function changeModelColor(color) {
    // Check if the model variable is defined
    if (model) {
        // Check if the model's material is loaded
        if (model.material) {
            // Set the color of the model's material
            model.material.color.set(color);
            console.log('Model color set to:', model.material.color.getHex());
        } else {
            console.error('Model material is not loaded.');
        }
    } else {
        console.error('Model is not loaded.');
    }
}

// Add event listeners to color buttons
document.getElementById('red-button').addEventListener('click', function () {
    changeModelColor(0xff0000); // Red color
});

document.getElementById('green-button').addEventListener('click', function () {
    changeModelColor(0x00ff00); // Green color
});

document.getElementById('blue-button').addEventListener('click', function () {
    changeModelColor(0x0000ff); // Blue color
});

// WebGL initialization and model loading

// Configure renderer
renderer.shadowMap.enabled = true;
renderer.gammaOutput = true;
renderer.setPixelRatio(window.devicePixelRatio);

// Get the loading indicator element
const loadingIndicator = document.getElementById('loading-indicator');

// Create a loader
const loader = new GLTFLoader();

// Load the GLB model
loader.load('assets/VaseDemo.glb', function (gltf) {
    console.log("GLB Main Model loaded successfully:", gltf);
    // Assign the loaded model to the global model variable
    model = gltf.scene;
    scene.add(model);

    // Hide loading indicator after model has loaded
    loadingIndicator.style.display = 'none';

    // Enable color change functionality after model is loaded
    enableColorChange();
}, function (xhr) {
    console.log("Loading progress:", (xhr.loaded / xhr.total * 100) + "%");

    // Show loading indicator while model is loading
    loadingIndicator.style.display = 'block';
}, function (error) {
    console.error("Error occurred:", error);

    // Hide loading indicator in case of error
    loadingIndicator.style.display = 'none';
});

// Function to enable color change functionality
function enableColorChange() {
    // Add event listeners to color buttons
    document.getElementById('red-button').addEventListener('click', function () {
        changeModelColor(0xff0000); // Red color
    });

    document.getElementById('green-button').addEventListener('click', function () {
        changeModelColor(0x00ff00); // Green color
    });

    document.getElementById('blue-button').addEventListener('click', function () {
        changeModelColor(0x0000ff); // Blue color
    });
}

// Render the scene
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();
