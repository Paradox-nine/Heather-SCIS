
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

let object;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let autoRotate = true; 
let isMouseControlEnabled = false;

let objToRender = 'eye';
function scaleModel(model, scaleFactor) {
  model.scale.set(scaleFactor, scaleFactor, scaleFactor);
}

const loader = new GLTFLoader();
loader.load(
  `./models/${objToRender}/block.glb`,
  function (gltf) {
    object = gltf.scene;
    scaleModel(object, 22);
    scene.add(object);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error('Error loading model:', error);
  }
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.getElementById("container3D");
if (container) {
  container.appendChild(renderer.domElement);
} else {
  console.error('No element with id "container3D" found.');
}


camera.position.set(0, 2, 10);  
camera.lookAt(0, 0, 0);         

const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); 
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 0.8); 
topLight.position.set(0, 10, 10);
scene.add(topLight);

const sideLight = new THREE.DirectionalLight(0xffffff, 0.56); 
sideLight.position.set(10, 5, 0);
scene.add(sideLight);

const backLight = new THREE.DirectionalLight(0xffffff, 0.4); 
backLight.position.set(-10, 5, -10);
scene.add(backLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false;

function animate() {
  requestAnimationFrame(animate);

  if (object && autoRotate) {
    object.rotation.y += 0.005;
  }

  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

renderer.domElement.addEventListener('mousedown', (event) => {
  if (!autoRotate && isMouseControlEnabled) {
    isDragging = true;
    previousMousePosition.x = event.clientX;
  }
});

renderer.domElement.addEventListener('mouseup', () => {
  isDragging = false;
});

renderer.domElement.addEventListener('mousemove', (event) => {
  if (isDragging && object && !autoRotate && isMouseControlEnabled) {
    const deltaX = event.clientX - previousMousePosition.x;
    const rotationSpeed = 0.01;
    object.rotation.y += deltaX * rotationSpeed;
    previousMousePosition.x = event.clientX;
  }
});

renderer.domElement.addEventListener('click', () => {
  autoRotate = false;
  isMouseControlEnabled = true;
});

renderer.domElement.addEventListener('dblclick', () => {
  autoRotate = true;
  isMouseControlEnabled = false;
});
