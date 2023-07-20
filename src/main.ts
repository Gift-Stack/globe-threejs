import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
import { setupCounter } from "./counter";
import * as THREE from "three";
import vertexShader from "./shaders/globe/vertex.glsl";
import fragmentShader from "./shaders/globe/fragment.glsl";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);

// Create Three.js scene
let sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.01,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(sizes.width, sizes.height);

document.body.appendChild(renderer.domElement);

renderer.domElement.style.position = "absolute";

// Geometries
const globeGeometry = new THREE.SphereGeometry(15, 150, 150);
const starGeometry = new THREE.BufferGeometry();

// Materials
// const globeMaterial = new THREE.MeshBasicMaterial({
//   map: new THREE.TextureLoader().load("../public/globe.jpeg"),
//   wireframe: true,
// });
const globeMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    globeTexture: {
      value: new THREE.TextureLoader().load("../public/globe.jpeg"),
    },
  },
  wireframe: true,
});

let starColor = window.matchMedia?.("(prefers-color-scheme: dark)").matches
  ? 0xffffff
  : 0x000;

// Watch out for system theme changes
window
  .matchMedia?.("(prefers-color-scheme: dark)")
  ?.addEventListener("change", (event) => {
    starColor = event.matches ? 0xffffff : 0x000;
  });

// const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
const starMaterial = new THREE.PointsMaterial({ color: starColor });

const globe = new THREE.Mesh(globeGeometry, globeMaterial);
const star = new THREE.Points(starGeometry, starMaterial);

globe.position.x = 10;

scene.add(globe);
scene.add(star);

const starVertices = [];
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = -Math.random() * 2000;
  starVertices.push(x, y, z);
}

starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starVertices, 3)
);

camera.position.z = 15;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  globe.rotation.x += 0.01;
  globe.rotation.y += 0.01;
  star.rotation.x += 0.0005;
}

animate();
