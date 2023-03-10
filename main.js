import * as THREE from 'three'; 
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import gsap from 'gsap';
import { EffectComposer } from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "/node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";

import './style.css'
import javascriptLogo from './javascript.svg'

import sunTexture from '/img/sun.jpg';


// Scene
const scene = new THREE.Scene();

// Sizes
const sizes = {
  width: window.innerWidth,
  heigth: window.innerHeight
}

// Create our sphere 
const textureLoader = new THREE.TextureLoader();

const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture),
  })
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 0, 0);
scene.add(mesh);

// Load Cybertruck 
const loader = new GLTFLoader();
loader.load('/cybertruck/scene.gltf', (gltf) => {
  gltf.scene.position.set(8, 0, 0)
  gltf.scene.scale.set(1, 1, 1)
  
  gltf.scene.traverse(c => {
    c.castShadow = true;
  })
  scene.add(gltf.scene)
  const loop = () => {
    window.requestAnimationFrame(loop);
    gltf.scene.rotation.x += 0.002;
    gltf.scene.rotation.y += 0.002;
    gltf.scene.rotation.z += 0.002;
  }
  loop();
})

loader.load('/model3/scene.gltf', (gltf) => {
  gltf.scene.position.set(-8, 0, 0)
  gltf.scene.scale.set(0.2, 0.2, 0.2)
  
  gltf.scene.traverse(c => {
    c.castShadow = true;
  })
  scene.add(gltf.scene)
  const loop = () => {
    window.requestAnimationFrame(loop);
    gltf.scene.rotation.x += 0.001;
    gltf.scene.rotation.y += 0.003;
    gltf.scene.rotation.z += 0.002;
  }
  loop();
})

// Light 
const light = new THREE.PointLight(0xE6AF2E, 1, 100);
light.position.set(0, 0, 0);
light.intensity = 10
scene.add(light);

const ambientLight = new THREE.PointLight(0x404040);
ambientLight.position.set(100, 100, 100)
ambientLight.intensity = 5
scene.add(ambientLight);

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.heigth, 0.1);
camera.position.z = 25
scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.heigth);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;

// Resize
window.addEventListener('resize', () => {
  // Update Sizes
  sizes.width = window.innerWidth;
  sizes.heigth = window.innerHeight;
  // Update Camera 
  camera.aspect = sizes.width / sizes.heigth;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.heigth);
  bloomComposer.setSize(window.innerWidth, window.innerHeight);
})

// Bloom Renderer
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = 0;
bloomPass.strength = 0.3; // Intensity of glow
bloomPass.radius = 0;
const bloomComposer = new EffectComposer(renderer);
bloomComposer.setSize(window.innerWidth, window.innerHeight);
bloomComposer.renderToScreen = true;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
  bloomComposer.render();
}
loop();

// Timeline (using GSAP)
const tl = gsap.timeline({defaults: { duration: 1} });
tl.fromTo(mesh.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1});
tl.fromTo("nav", {y: "-100%"}, {y: "0%"})
tl.fromTo(".title", {opacity: "0"}, {opacity: "1"})

// Three JS end

// Frontpage filtering

let biler = [
    {
        bilmaerke: "Suzuki Swift",
        billede: "",
        billedtekst: "Billede af udlejningsbil",
        kategori: "Budget",
        personer: "4",
        kufferter: "0",
        tillaeg: "0"
    },
    {
        bilmaerke: "Mazda CX3",
        billede: "",
        billedtekst: "Billede af udlejningsbil",
        kategori: "Mellemklasse",
        personer: "5",
        kufferter: "3",
        tillaeg: "60"
    },
    {
        bilmaerke: "Citroën Grand C4 Picasso",
        billede: "",
        billedtekst: "Billede af udlejningsbil",
        kategori: "Minivan",
        personer: "7",
        kufferter: "4",
        tillaeg: "105"
    }
  ];
  
  const sektion = document.getElementById('bil_sektion');
  const skabelon = document.getElementById('skabelon_output');
  const personer = document.getElementById('personer');
  const kufferter = document.getElementById('kufferter');
  const formular = document.getElementById('formular');
  const afhentningsdato = document.getElementById('afhentning');
  const afleveringsdato = document.getElementById('aflevering');
  
  formular.addEventListener("submit", function (event) {
  event.preventDefault();
  sektion.innerHTML = ""; //Nulstiller output-sektion
    for (const bil of biler) {
        if (kufferter.value <= bil.kufferter && personer.value <= bil.personer) {
            const antaldage = beregnAntalLejedage(afhentningsdato.value, afleveringsdato.value);
            const klon = skabelon.content.cloneNode(true);
            const bilMM = klon.querySelector(".bilMM");
            const billedtag = klon.querySelector("img");
            const kategori = klon.querySelector(".kategori");
            const antalpersoner = klon.querySelector(".antalpersoner");
            const antalkufferter = klon.querySelector(".antalkufferter");
            const lejeudgift = klon.querySelector(".lejeudgift");
            const link = klon.querySelector("a");
  
            link.href = `udstyr.html?bil=${bil.bilmaerke}&afhentning=${afhentningsdato.value}&aflevering=${afleveringsdato.value}&lejedage=${antaldage}&lejeudgift=${beregnLejeudgift(antaldage, bil.tillaeg)}`;
            billedtag.src = bil.billede;
            billedtag.alt = bil.billedtekst;
            bilMM.textContent = bil.bilmaerke;
            kategori.textContent += bil.kategori;
            antalkufferter.textContent += bil.kufferter;
            antalpersoner.textContent += bil.personer;
            lejeudgift.textContent = "kr. " + beregnLejeudgift(antaldage, bil.tillaeg);
            sektion.appendChild(klon);
        }
    }
  })
  
  // instead of making it possible for the user to select an invalid date, we make it impossible to set the pickup date after the delivery date and vice verca,
  
  afhentningsdato.addEventListener('change', () =>  {
    afleveringsdato.setAttribute('min', afhentningsdato.value);
  })
  
  afleveringsdato.addEventListener('change', () =>  {
    afhentningsdato.setAttribute('max', afleveringsdato.value);
  })
  
  function beregnAntalLejedage(afhentningsdato, afleveringsdato) {
  const AFHENTNING = new Date(afhentningsdato);
  const AFLEVERING = new Date(afleveringsdato);
  const FORSKELITID = AFLEVERING.getTime() - AFHENTNING.getTime();
  const FORSKELIDAGE = FORSKELITID / (1000 * 3600 * 24) + 1;
  return FORSKELIDAGE;
  }
  
  function beregnLejeudgift(antaldage, biltillaeg) {
  const MOMS = 0.25;
  const GRUNDBELOEB = 495;
  const PRISPRDAG = 100;
  const LEJEUDGIFT = (GRUNDBELOEB + (antaldage * PRISPRDAG) + (antaldage * biltillaeg)) * (1 + MOMS);
  return LEJEUDGIFT.toFixed(2);
  }
  
  