<template>
  <div id="container">
    <button @click="start" id="startButton">Start AR</button>
    <button @click="stop" id="stopButton">Stop AR</button>
  </div>
</template>

<script setup>
import * as THREE from "three";

let container;
let camera, scene, renderer;
let controller;

let reticle;

let hitTestSource = null;
let hitTestSourceRequested = false;

let currentSession = null;

onMounted(async () => {
  init();
});

onUnmounted(() => {
  renderer.dispose();
});

async function start() {
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
    // Clean up renderer
    renderer.dispose();
    // if (container && container.parentNode) {
    //   container.parentNode.removeChild(container);
    // }
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
  const listener = new THREE.AudioListener();
  if (!camera.children.includes(listener)) {
    camera.add(listener);
  }

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32).translate(
    0,
    0.1,
    0
  );

  function onSelect() {
    if (reticle.visible) {
      const material = new THREE.MeshPhongMaterial({
        color: 0xffffff * Math.random(),
      });
      const mesh = new THREE.Mesh(geometry, material);
      reticle.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
      mesh.scale.y = Math.random() * 2 + 1;

      // Create a positional audio source
      const sound = new THREE.PositionalAudio(listener);

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
      mesh.add(sound);
      scene.add(mesh);
    }
  }

  controller = renderer.xr.getController(0);
  controller.addEventListener("select", onSelect);
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
