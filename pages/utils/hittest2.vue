<template>
  <div id="container">
    <button @click="start" id="startButton">Start AR</button>
    <button @click="stop" id="stopButton">Stop AR</button>
    <button @click="addMesh()">Add mesh</button>
    <button @click="calculateMedianPosition()">Log meshes</button>
  </div>
</template>

<script setup>
import * as THREE from "three";

let container;
let camera, scene, renderer;
let controller;
let meshes = [];
let reticle;
let listener;
let sounds = [];
let hitTestSource = null;
let hitTestSourceRequested = false;

let currentSession = null;

const cleanup = () => {
  renderer.dispose();
  scene = null;
  camera = null;
  renderer = null;
  controller = null;
  listener = null;
  sounds.forEach((sound) => {
    sound.stop();
  });
  sounds = [];
  meshes = [];
  currentSession = null;
};

onUnmounted(() => {
  cleanup();
});

function addMesh() {
  if (reticle.visible) {
    const geometry = new THREE.SphereGeometry(0.05, 32, 32).translate(
      0,
      0.1,
      0
    );
    const material = new THREE.MeshPhongMaterial({
      color: "red",
    });
    const mesh = new THREE.Mesh(geometry, material);
    reticle.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
    //   mesh.scale.y = Math.random() * 2 + 1;

    meshes.push(mesh);
    scene.add(mesh);
  }
}
// Calculate the median position of all meshes
const calculateMedianPosition = () => {
  console.log(meshes);

  if (meshes.length === 0) {
    console.log("No meshes to calculate median position");
    return null;
  }

  // Sum up all positions
  const sumPosition = new THREE.Vector3();
  meshes.forEach((mesh) => {
    sumPosition.add(mesh.position);
  });

  // Divide by number of meshes to get median
  const medianPosition = sumPosition.divideScalar(meshes.length);
  console.log("Median position:", medianPosition);

  // Create a blue ball at the median position
  const createBlueBallAtMedian = (position) => {
    if (!position) return;

    // Create a blue sphere geometry
    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      transparent: true,
      opacity: 0.5,
    });
    const blueBall = new THREE.Mesh(geometry, material);

    // Set the position to the median position
    blueBall.position.copy(position);

    // Create a positional audio source
    const sound = new THREE.PositionalAudio(listener);
    sounds.push(sound);

    // Load a sound and set it as the PositionalAudio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load("/sounds/waterBigger.m4a", function (buffer) {
      sound.setBuffer(buffer);
      sound.setRefDistance(1.0); // 1 meter reference distance
      sound.setRolloffFactor(1.0); // Physically accurate rolloff
      sound.setMaxDistance(10000); // Maximum distance for sound
      sound.setDistanceModel("exponential"); // Most physically accurate model
      sound.setLoop(true);
      sound.setVolume(1);
      sound.play();
    });

    // Add the sound to the mesh
    blueBall.add(sound);

    // Add the blue ball to the scene
    scene.add(blueBall);

    console.log("Blue ball added at median position:", position);

    // Add to meshes array to track it
    meshes.push(blueBall);
  };

  // Create and add the blue ball
  createBlueBallAtMedian(medianPosition);

  return medianPosition;
};

async function start() {
  init();
  if (currentSession === null) {
    try {
      const session = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test", "dom-overlay"],
        domOverlay: { root: document.getElementById("container") },
      });
      await onSessionStarted(session);
    } catch (err) {
      console.error("Error starting AR session:", err);
    }
  }
}

function stop() {
  if (currentSession !== null) {
    currentSession.end();
  }
}

async function onSessionStarted(session) {
  console.log("onSessionStarted");
  currentSession = session;
  session.addEventListener("end", onSessionEnded);

  // Set up the reference space
  renderer.xr.setReferenceSpaceType("local");
  await renderer.xr.setSession(session);
}

function onSessionEnded() {
  if (currentSession !== null) {
    console.log("onSessionEnded");
    currentSession.removeEventListener("end", onSessionEnded);
    currentSession = null;

    cleanup();
  }
}

function init() {
  container = document.getElementById("container");

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    20
  );

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 3);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);

  // Create a positional audio listener
  listener = new THREE.AudioListener();
  if (!camera.children.includes(listener)) {
    camera.add(listener);
  }

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  controller = renderer.xr.getController(0);
  scene.add(controller);

  reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial()
  );
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
  scene.add(reticle);
}

function animate(timestamp, frame) {
  if (frame) {
    const referenceSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();

    if (hitTestSourceRequested === false) {
      session.requestReferenceSpace("viewer").then(function (referenceSpace) {
        session
          .requestHitTestSource({ space: referenceSpace })
          .then(function (source) {
            hitTestSource = source;
          });
      });

      session.addEventListener("end", function () {
        hitTestSourceRequested = false;
        hitTestSource = null;
      });

      hitTestSourceRequested = true;
    }

    if (hitTestSource) {
      const hitTestResults = frame.getHitTestResults(hitTestSource);

      if (hitTestResults.length) {
        const hit = hitTestResults[0];

        reticle.visible = true;
        reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
      } else {
        reticle.visible = false;
      }
    }
  }

  renderer.render(scene, camera);
}
</script>
