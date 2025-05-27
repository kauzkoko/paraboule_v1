<style scoped>
.container-grid {
  @apply fixed w-full bottom-0 left-0 grid grid-cols-3 gap-2 items-center justify-center;
  div {
    @apply flexCenter w-full h-full;
  }
  button {
    @apply w-full h-full;
  }
}
</style>

<template>
  <div ref="container" class="w-dvw h-dvh">
    <div class="container-grid">
      <div class="bg-yellow py-1 rounded flex items-center gap-1">
        <div>
          <button
            @click="isReady = !isReady"
            :class="{ 'bg-green-500': isReady, 'bg-red-500': !isReady }"
          >
            isReady
          </button>
        </div>
        <div>
          <button
            @click="toggleMute"
            :class="{ 'bg-green-500': isMuted, 'bg-red-500': !isMuted }"
          >
            isMuted
          </button>
        </div>
      </div>
      <div>
        <button
          @click="toggleStartStop"
          :class="{ 'bg-green-500': arStarted, 'bg-red-500': !arStarted }"
        >
          Toggle AR
        </button>
      </div>
      <div>
        <button
          @click="setBoulesAroundYou"
          :class="{ 'bg-green-500': isReady, 'bg-red-500': !isReady }"
        >
          Set boules around you
        </button>
      </div>
      <div>
        <button
          @click="setStartPointByRay"
          :class="{ 'bg-green-500': isReady, 'bg-red-500': !isReady }"
        >
          Set startpoint by ray
        </button>
      </div>
      <div>
        <button
          @click="setNewStartpoint()"
          :class="{ 'bg-green-500': isReady, 'bg-red-500': !isReady }"
        >
          Set new startpoint at camera
        </button>
      </div>
      <div>
        <button
          @click="removeStartpoint()"
          :class="{ 'bg-green-500': isReady, 'bg-red-500': !isReady }"
        >
          Remove startpoint
        </button>
      </div>
      <div>
        <button
          @click="setFieldByRay"
          :class="{ 'bg-green-500': isReady, 'bg-red-500': !isReady }"
        >
          Set startpoint by ray
        </button>
      </div>
      <div>
        <button
          @click="setNewField()"
          :class="{ 'bg-green-500': isReady, 'bg-red-500': !isReady }"
        >
          Set new field at camera
        </button>
      </div>
      <div>
        <button
          @click="removeField()"
          :class="{ 'bg-green-500': isReady, 'bg-red-500': !isReady }"
        >
          Remove field
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as THREE from "three";
import * as Tone from "tone";
import type { Frequency } from "tone/build/esm/core/type/Units";

const store = useProtoStore();
const { predictFromImage, startWorker } = await useInference();

const { x, y } = useMouse();
const { width, height } = useWindowSize();

const container = ref(null);

let camera, scene, renderer;
let controller;
let meshes = [];
let detectedPlane;

let globalListener;
let listener;
let sounds = [];

let currentSession = null;

let frameCount = 0;
let framebuffer;
let hitTestSource = null;
let hitTestSourceRequested = false;

const isReady = ref(false);
const isFirstPlane = ref(true);
let isPredicting = ref(true);

const bouleCounter = ref(2);
const isMuted = ref(false);
const cleanup = () => {
  if (renderer) renderer.dispose();
  renderer;
  scene = null;
  camera = null;
  controller = null;
  listener = null;
  sounds.forEach((sound) => {
    sound.stop();
  });
  sounds = [];
  meshes = [];
  currentSession = null;

  isReady.value = false;
  isFirstPlane.value = true;
  isPredicting.value = false;
  isMuted.value = true;
};

onMounted(async () => {
  if (!store.modelLoaded && !store.modelWorkerId) {
    await startWorker();
  }
});

onUnmounted(() => {
  cleanup();
});

const arStarted = ref(false);
function toggleStartStop() {
  if (arStarted.value) {
    stop();
  } else {
    start();
  }
}

const toggleMute = () => {
  if (isMuted.value) {
    isMuted.value = false;
  } else {
    isMuted.value = true;
  }
};

async function start() {
  isPredicting.value = true;
  arStarted.value = true;
  isMuted.value = false;
  init();
  const synth = new Tone.Synth().toDestination();
  synth.triggerAttackRelease("C5", ".2s");

  if (currentSession === null) {
    try {
      const session = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: [
          "local-floor",
          "hit-test",
          "camera-access",
          "dom-overlay",
        ],
        domOverlay: { root: container.value },
      });
      await onSessionStarted(session);
    } catch (err) {
      console.error("Error starting AR session:", err);
    }
  }
}

function stop() {
  isReady.value = false;
  arStarted.value = false;
  isFirstPlane.value = true;
  isPredicting.value = false;
  isMuted.value = true;
  const synth = new Tone.Synth().toDestination();
  synth.triggerAttackRelease("C5", "0.1s");
  synth.triggerAttackRelease("B4", "0.1s", Tone.now() + 0.1);
  synth.triggerAttackRelease("A4", "0.1s", Tone.now() + 0.2);
  synth.triggerAttackRelease("G4", "0.1s", Tone.now() + 0.3);
  synth.triggerAttackRelease("F4", "0.1s", Tone.now() + 0.4);
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
  Tone.start();

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
  globalListener = listener;
  if (!camera.children.includes(listener)) {
    camera.add(listener);
  }

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  renderer.xr.enabled = true;
  container.value.appendChild(renderer.domElement);

  controller = renderer.xr.getController(0);
  scene.add(controller);

  detectedPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 8).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.2,
    })
  );
  detectedPlane.matrixAutoUpdate = false;
  detectedPlane.visible = false;
  scene.add(detectedPlane);
}

let sound;
let currentIntersectionMesh = null;
function intersectPrediction(prediction, type = "boule") {
  const raycaster = new THREE.Raycaster();
  const input = new THREE.Vector2();

  const intersects = intersectsWithPlane({
    x: prediction.bbox.x,
    y: prediction.bbox.y,
    camera,
    plane: detectedPlane,
  });

  if (intersects.length > 0) {
    const intersectPoint = intersects[0].point;
    const sphereGeometry =
      type === "boule"
        ? new THREE.SphereGeometry(0.05, 32, 32)
        : new THREE.BoxGeometry(0.05, 0.05, 0.05);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.7,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.copy(intersectPoint);

    sound = new THREE.PositionalAudio(listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load("/sounds/strudel/simplebeat.mp3", function (buffer) {
      const lowpass = sound.context.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(1000, sound.context.currentTime);
      sound.setFilters([lowpass]);
      sound.setBuffer(buffer);
      sound.setRefDistance(1.0);
      sound.setRolloffFactor(1.0);
      sound.setMaxDistance(10000);
      sound.setDistanceModel("exponential");
      sound.setLoop(true);
      sound.setVolume(1);
      sound.setPlaybackRate(1);
      sound.play();
    });
    sounds.push(sound);
    sphere.add(sound);

    if (currentIntersectionMesh) {
      scene.remove(currentIntersectionMesh);
    }
    currentIntersectionMesh = sphere;
    scene.add(currentIntersectionMesh);
    return intersectPoint;
  }
}

let startpoint;
let startpointSound;
function setNewStartpoint() {
  removeStartpoint();

  const cameraPosition = new THREE.Vector3();
  camera.getWorldPosition(cameraPosition);

  // Create marker at intersection point
  const markerGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32);
  const markerMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 0.5,
  });
  startpoint = new THREE.Mesh(markerGeometry, markerMaterial);
  startpoint.position.copy(cameraPosition);

  startpointSound = setPositionalAudioToObject({
    src: "/sounds/strudel/simplebeat.mp3",
    object: startpoint,
    listener,
    sounds,
    autoplay: true,
  });
  // Set the y position to the floor (y=0)
  startpoint.position.y = 0;
  scene.add(startpoint);
}

function removeStartpoint() {
  if (startpoint) {
    scene.remove(startpoint);
  }
  if (startpointSound) startpointSound.stop();
}

let marker;
function setStartPointByRay() {
  removeStartpoint();
  // Create a raycaster from the camera's position
  const raycaster = new THREE.Raycaster();
  const cameraPosition = new THREE.Vector3();
  const cameraDirection = new THREE.Vector3();
  camera.getWorldPosition(cameraPosition);
  camera.getWorldDirection(cameraDirection);

  raycaster.set(cameraPosition, cameraDirection);

  // Check intersection with the detected plane
  const intersects = raycaster.intersectObject(detectedPlane);

  if (intersects.length > 0) {
    const intersectPoint = intersects[0].point;
    console.log("Start point set at:", intersectPoint);

    const markerGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32);
    const markerMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.5,
    });
    startpoint = new THREE.Mesh(markerGeometry, markerMaterial);
    startpoint.position.copy(intersectPoint);

    startpointSound = setPositionalAudioToObject({
      src: "/sounds/strudel/simplebeat.mp3",
      object: startpoint,
      listener,
      sounds,
      autoplay: true,
    });
    scene.add(startpoint);
  } else {
    console.log("No intersection with plane found");
  }
}

let field;
let fieldSound;
function setNewField() {
  removeField();

  const cameraPosition = new THREE.Vector3();
  camera.getWorldPosition(cameraPosition);

  const sphereGeometry = new THREE.SphereGeometry(0.05, 32, 32);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.7,
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.copy(cameraPosition);
  sphere.position.y = 0;

  sound = new THREE.PositionalAudio(listener);
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load("/sounds/strudel/simplebeat.mp3", function (buffer) {
    const lowpass = sound.context.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(1000, sound.context.currentTime);
    sound.setFilters([lowpass]);
    sound.setBuffer(buffer);
    sound.setRefDistance(1.0);
    sound.setRolloffFactor(1.0);
    sound.setMaxDistance(10000);
    sound.setDistanceModel("exponential");
    sound.setLoop(true);
    sound.setVolume(1);
    sound.setPlaybackRate(1);
    sound.play();
  });
  sounds.push(sound);
  fieldSound = sound;
  sphere.add(sound);

  currentIntersectionMesh = sphere;
  scene.add(currentIntersectionMesh);

  console.log("intersectPoint", intersectPoint);
}

function removeField() {
  if (currentIntersectionMesh) {
    scene.remove(currentIntersectionMesh);
    currentIntersectionMesh = null;
  }
  if (fieldSound) {
    fieldSound.stop();
  }
}

function setFieldByRay() {
  removeField();
  // Create a raycaster from the camera's position
  const raycaster = new THREE.Raycaster();
  const cameraPosition = new THREE.Vector3();
  const cameraDirection = new THREE.Vector3();
  camera.getWorldPosition(cameraPosition);
  camera.getWorldDirection(cameraDirection);

  raycaster.set(cameraPosition, cameraDirection);

  // Check intersection with the detected plane
  const intersects = raycaster.intersectObject(detectedPlane);

  if (intersects.length > 0) {
    const intersectPoint = intersects[0].point;
    const sphere = createSphere({
      size: 0.05,
      color: "red",
      opacity: 0.7,
    });
    sphere.position.copy(intersectPoint);

    sound = new THREE.PositionalAudio(listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load("/sounds/strudel/simplebeat.mp3", function (buffer) {
      const lowpass = sound.context.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(1000, sound.context.currentTime);
      sound.setFilters([lowpass]);
      sound.setBuffer(buffer);
      sound.setRefDistance(1.0);
      sound.setRolloffFactor(1.0);
      sound.setMaxDistance(10000);
      sound.setDistanceModel("exponential");
      sound.setLoop(true);
      sound.setVolume(1);
      sound.setPlaybackRate(1);
      sound.play();
    });
    sounds.push(sound);
    fieldSound = sound;
    sphere.add(sound);

    currentIntersectionMesh = sphere;
    scene.add(currentIntersectionMesh);
  } else {
    console.log("No intersection with plane found");
  }
}

function getScreenPosition(object, camera) {
  const vector = object.position.clone().project(camera);
  const x = (vector.x * 0.5 + 0.5) * width.value;
  const y = (1 - (vector.y * 0.5 + 0.5)) * height.value;
  return { x, y };
}

const mockBoules = [
  {
    x: 0.15217870875827644,
    y: 0.11757755279540989,
    z: -2.14242094133827,
    class: "cochonnet",
  },
  {
    x: 0.3014103032020119,
    y: 0.11757755279540989,
    z: -2.3185530158534984,
    class: "dark",
  },
  {
    x: 0.019827494002689575,
    y: 0.13757755279540984,
    z: -1.873205403607142,
    class: "light",
  },
  {
    x: 0.35239538925638664,
    y: 0.050841178894042934,
    z: -2.040454871744344,
    class: "dark",
  },
  {
    x: 0.20640927469181287,
    y: 0.10841178894042956,
    z: -1.9825655394221926,
    class: "light",
  },
];
const setFromIntersections = (mockIntersections) => {
  let cochonnet = mockIntersections.find(
    (item) => item.class === "cochonnet" || item.class === "cochonnette"
  );
  let offsetX = 0;
  let offsetY = 0;
  let scaler = 23;
  if (cochonnet) {
    offsetX = cochonnet.x * scaler;
    offsetY = cochonnet.z * scaler;
  }
  let tempBoules = [];
  mockIntersections.forEach((item) => {
    let scaledX = item.x * scaler - offsetX;
    let scaledY = item.z * scaler - offsetY;
    let distance = Math.sqrt(scaledX * scaledX + scaledY * scaledY);
    let boule = {
      x: scaledX,
      y: scaledY,
      color: "yellow",
      size: 1,
      player: 3,
      class: item.class,
      distance: distance,
    };

    if (item.class === "cochonnet") {
      boule.color = "orange";
      boule.size = 0.4;
      boule.player = 0;
    } else if (item.class === "dark") {
      boule.color = "#111";
      boule.player = 1;
    } else if (item.class === "light") {
      boule.color = "#555";
      boule.player = 2;
    }

    tempBoules.push(boule);
  });
  return tempBoules;
};
let boules = setFromIntersections(mockBoules);
let boulesAroundYou = [];
function setBoulesAroundYou() {
  boules.forEach((boule) => {
    const tempBoule = new Boule({
      x: boule.x,
      y: boule.y,
      sound: {
        src:
          boule.player === 1
            ? "/sounds/waterBigger.m4a"
            : boule.player === 2
            ? "/sounds/shortdeep.mp3"
            : "/sounds/strudel/simplebeat.mp3",
        listener: listener,
        autoplay: false,
      },
      sounds,
      scene,
    });
    boulesAroundYou.push(tempBoule);
  });
}

function removeBoulesAroundYou() {
  boulesAroundYou.forEach((boule) => {
    boule.removeFromScene(scene);
  });
}

const playSynth = (note: Frequency, duration: Time) => {
  Tone.start();
  const synth = new Tone.Synth().toDestination();
  synth.triggerAttackRelease(note, duration);
};

async function animate(timestamp, frame) {
  if (frame) {
    frameCount++;
    const referenceSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();
    const pose = frame.getViewerPose(referenceSpace);

    if (currentIntersectionMesh && frameCount % 5 === 0 && !isMuted.value) {
      const cameraPosition = new THREE.Vector3();
      const cameraDirection = new THREE.Vector3();
      camera.getWorldPosition(cameraPosition);
      camera.getWorldDirection(cameraDirection);
      const meshPosition = new THREE.Vector3();
      currentIntersectionMesh.getWorldPosition(meshPosition);

      const screenPosition = getScreenPosition(currentIntersectionMesh, camera);
      const inXscreen = screenPosition.x > 0 && screenPosition.x < width.value;
      const inYscreen = screenPosition.y > 0 && screenPosition.y < height.value;
      const inScreen = inXscreen && inYscreen;

      if (inScreen) {
        useVibrate({ pattern: [20, 0] }).vibrate();
      }

      // pitch
      const directionToMesh = meshPosition
        .clone()
        .sub(cameraPosition)
        .normalize();
      const angle = THREE.MathUtils.radToDeg(
        cameraDirection.angleTo(directionToMesh)
      );

      let distance = cameraPosition.distanceTo(meshPosition);

      const directionXZ = new THREE.Vector2(
        directionToMesh.x,
        directionToMesh.z
      ).normalize();
      const cameraDirectionXZ = new THREE.Vector2(
        cameraDirection.x,
        cameraDirection.z
      ).normalize();
      const angleXZ = THREE.MathUtils.radToDeg(
        Math.acos(directionXZ.dot(cameraDirectionXZ))
      );
      console.log("Angle on XZ plane:", angleXZ);

      // Update playback rate
      sound.setVolume(1);
      let rate = map(distance, 0, 10, 2, 0.2);
      if (distance < 1) {
        rate = map(distance, 0, 1, 4, 2);
      }
      sound.setPlaybackRate(rate);

      let absoluteAngle = Math.abs(angle);
      let normalizedAngle =
        absoluteAngle <= 45 ? map(absoluteAngle, 0, 45, 1, 0) : 0;
      let normalizedAnglePow = Math.pow(normalizedAngle, 4);

      let freq = map(normalizedAnglePow, 0, 1, 200, 20000);
      sound
        .getFilters()[0]
        .frequency.setValueAtTime(freq, sound.context.currentTime);
    } else if (
      currentIntersectionMesh &&
      isMuted.value &&
      frameCount % 5 === 0
    ) {
      //TODO remove this and control all sounds over watcher
      sound.setVolume(0);
    }

    if (hitTestSource) {
      const hitTestResults = frame.getHitTestResults(hitTestSource);

      if (hitTestResults.length) {
        const hit = hitTestResults[0];

        if (isFirstPlane.value) {
          playSynth("C3", "2s");
          isReady.value = true;
          isFirstPlane.value = false;
        }

        detectedPlane.visible = true;
        detectedPlane.matrix.fromArray(
          hit.getPose(referenceSpace).transform.matrix
        );
      } else {
        detectedPlane.visible = false;
      }
    }

    // setup hit test source
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
  }

  renderer.render(scene, camera);
}
</script>
