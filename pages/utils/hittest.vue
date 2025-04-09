<template>
  <div ref="container" class="w-dvw h-dvh">
    <div class="fixed bottom-0 left-0 children:w-100px">
      <button
        @click="toggleStartStop"
        :class="{ 'bg-green-500': arStarted, 'bg-red-500': !arStarted }"
      >
        Toggle AR
      </button>
      <button
        @click="isReady = !isReady"
        :class="{ 'bg-green-500': isReady, 'bg-red-500': !isReady }"
      >
        Ready
      </button>
    </div>
  </div>
</template>

<script setup>
import * as THREE from "three";
import * as Tone from "tone";

const store = useProtoStore();
const { predictFromImage, startWorker } = await useInference();

const container = ref(null);

let camera, scene, renderer;
let controller;
let meshes = [];
let detectedPlane;

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

async function start() {
  arStarted.value = true;
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
  arStarted.value = false;
  isFirstPlane.value = true;
  isPredicting.value = false;
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
function intersectPrediction(prediction) {
  const raycaster = new THREE.Raycaster();
  const input = new THREE.Vector2();

  (input.x = (prediction.bbox.x / 2 / window.innerWidth) * 2 - 1),
    (input.y = -(prediction.bbox.y / 2 / window.innerHeight) * 2 + 1);

  raycaster.setFromCamera(input, camera);

  const intersects = raycaster.intersectObject(detectedPlane);

  if (intersects.length > 0) {
    const intersectPoint = intersects[0].point;
    const sphereGeometry = new THREE.SphereGeometry(0.05, 32, 32);
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
      sound.setBuffer(buffer);
      sound.setRefDistance(1.0); // 1 meter reference distance
      sound.setRolloffFactor(1.0); // Physically accurate rolloff
      sound.setMaxDistance(10000); // Maximum distance for sound
      sound.setDistanceModel("exponential"); // Most physically accurate model
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

async function animate(timestamp, frame) {
  if (frame) {
    frameCount++;
    const referenceSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();
    const pose = frame.getViewerPose(referenceSpace);

    // if (pose) {
    //   const view = pose.views[0];
    //   const orientation = view.transform.orientation;
    //   const euler = new THREE.Euler().setFromQuaternion(
    //     new THREE.Quaternion(
    //       orientation.x,
    //       orientation.y,
    //       orientation.z,
    //       orientation.w
    //     )
    //   );
    //   const alphaDegrees = THREE.MathUtils.radToDeg(euler.z);
    //   console.log("Phone orientation (alpha):", alphaDegrees);
    // }

    // update sound rate
    if (currentIntersectionMesh && frameCount % 5 === 0) {
      let distance = 0;
      const cameraPosition = new THREE.Vector3();
      camera.getWorldPosition(cameraPosition);

      const meshPosition = new THREE.Vector3();
      currentIntersectionMesh.getWorldPosition(meshPosition);

      distance = cameraPosition.distanceTo(meshPosition);
      let rate = map(distance, 0, 10, 4, 0.1);
      if (distance < 1) {
        rate = map(distance, 0, 1, 8, 4);
      }
      sound.setPlaybackRate(rate);
    }

    if (hitTestSource) {
      const hitTestResults = frame.getHitTestResults(hitTestSource);

      if (hitTestResults.length) {
        const hit = hitTestResults[0];

        if (isFirstPlane.value) {
          const synth = new Tone.Synth().toDestination();
          Tone.start();
          synth.triggerAttackRelease("C3", ".2s");
          isFirstPlane.value = false;
        }

        detectedPlane.visible = true;
        detectedPlane.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);

        if (
          pose &&
          frameCount % 10 === 0 &&
          isPredicting.value &&
          isReady.value
        ) {
          const gl = renderer.getContext();

          gl.bindFramebuffer(
            gl.FRAMEBUFFER,
            session.renderState.baseLayer.framebuffer
          );

          const view = pose.views[0];

          const binding = new XRWebGLBinding(session, gl);
          const cameraTexture = binding.getCameraImage(view.camera);
          framebuffer = gl.createFramebuffer();

          const bitmap = createImageFromTexture(
            gl,
            cameraTexture,
            view.camera.width,
            view.camera.height,
            framebuffer
          );

          const newPredictions = await predictFromImage(bitmap);

          newPredictions.forEach((prediction) => {
            if (prediction.confidence > 0.85) {
              let intersectPoint = intersectPrediction(prediction);
              console.log("intersectPoint", intersectPoint);
              isPredicting.value = false;
            }
          });
          gl.deleteFramebuffer(framebuffer);
        }
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
