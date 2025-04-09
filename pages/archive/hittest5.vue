<template>
  <div id="container" class="w-dvw h-dvh text-white">
    <div class="fixed bottom-0 left-0">
      <div>
        <div>current Interval {{ intervalRef }}</div>
        <div class="flex items-center justify-between">
          <div>1</div>
          <input
            class="h-100px w-80dvw"
            type="range"
            min="3"
            max="50"
            step="1"
            v-model="intervalMock1"
          />
          <div>50</div>
        </div>
        <div class="flex items-center justify-between">
          <div>50</div>
          <input
            class="h-100px w-80dvw"
            type="range"
            min="50"
            max="1000"
            step="50"
            v-model="intervalMock2"
          />
          <div>1000</div>
        </div>
      </div>
      <div>
        <button @click="start" id="startButton">Start AR</button>
        <button @click="stop" id="stopButton">Stop AR</button>
        <button @click="addMesh()">Add mesh</button>
        <button @click="calculateMedianPosition()">Log meshes</button>
        <button @click="isReady = true">Ready</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as THREE from "three";
import * as Tone from "tone";

const store = useProtoStore();
const { predictFromImage, startWorker } = await useInference();

const intervalMock1 = ref(20);
const intervalMock2 = ref(500);
const intervalRef = ref(100);

watch(intervalMock1, () => {
  intervalRef.value = intervalMock1.value;
});

watch(intervalMock2, () => {
  intervalRef.value = intervalMock2.value;
});

let container;
let camera, scene, renderer;
let controller;

let meshes = [];
let reticle;
let plane;

let listener;
let sounds = [];

let hitTestSource = null;
let hitTestSourceRequested = false;

let currentSession = null;

onMounted(async () => {
  if (!store.modelLoaded && !store.modelWorkerId) {
    await startWorker();
  }
});

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
  const synth = new Tone.Synth().toDestination();
  Tone.start();
  synth.triggerAttackRelease("C4", ".2s");

  if (currentSession === null) {
    try {
      const session = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: [
          "local-floor",
          "hit-test",
          "camera-access",
          "dom-overlay",
        ],
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
    new THREE.PlaneGeometry(1.3, 5).rotateX(-Math.PI / 2),
    // new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.5,
    })
  );
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
  scene.add(reticle);

  const planeGeometry = new THREE.PlaneGeometry(50, 50);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffa500,
    transparent: true,
    opacity: 0.5,
  });
  plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.matrixAutoUpdate = false;
  plane.visible = false;
  scene.add(plane);
}

let distance;
const getDistance = () => {
  if (currentIntersectionMesh) {
    const cameraPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraPosition);

    const meshPosition = new THREE.Vector3();
    currentIntersectionMesh.getWorldPosition(meshPosition);

    distance = cameraPosition.distanceTo(meshPosition);
    console.log("Distance to intersection mesh:", distance);
  }
  return distance;
};

let sound;

const changeSound = () => {
  Tone.Offline(() => {
    getDistance();
    const freq = Math.floor(map(distance, 0, 10, 1000, 100));

    const oscillator = new Tone.Oscillator({
      frequency: freq,
      type: "sine",
    })
      .toDestination()
      .start(0);
  }, intervalRef.value).then((toneBuffer) => {
    const audioContext = listener.context;
    const audioBuffer = audioContext.createBuffer(
      1,
      toneBuffer.length,
      toneBuffer.sampleRate
    );
    const channelData = audioBuffer.getChannelData(0);
    channelData.set(toneBuffer.getChannelData(0));
    sound.stop();
    sound.setBuffer(audioBuffer);
    // sound.setRefDistance(1);
    // sound.setRolloffFactor(1);
    // sound.setDistanceModel("exponential");
    // sound.setMaxDistance(50);
    // sound.setLoop(false);
    // sound.setVolume(1);
    sound.play();
  });
};

let currentIntersectionMesh = null;
function intersectPrediction(prediction) {
  const raycaster = new THREE.Raycaster();
  const input = new THREE.Vector2();

  (input.x = (prediction.bbox.x / 2 / window.innerWidth) * 2 - 1),
    (input.y = -(prediction.bbox.y / 2 / window.innerHeight) * 2 + 1);

  raycaster.setFromCamera(input, camera);

  let thisPlane = plane;
  // const intersects = raycaster.intersectObject(plane);
  const intersects = raycaster.intersectObject(reticle);

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

    setInterval(() => {
        changeSound();
      }, intervalRef.value);
    Tone.Offline(() => {
      const oscillator = new Tone.Oscillator({
        frequency: 440,
        type: "sine",
        fadeIn: 0.2,
      })
        .toDestination()
        .start(0);
    }, intervalRef.value).then((toneBuffer) => {
      const audioContext = listener.context;
      const audioBuffer = audioContext.createBuffer(
        1,
        toneBuffer.length,
        toneBuffer.sampleRate
      );

      const channelData = audioBuffer.getChannelData(0);
      channelData.set(toneBuffer.getChannelData(0));
      sound.setBuffer(audioBuffer);
      sound.setRefDistance(1);
      sound.setRolloffFactor(1);
      sound.setDistanceModel("exponential");
      sound.setMaxDistance(50);
      sound.setLoop(false);
      sound.setVolume(1);
      sound.play();
      sounds.push(sound);
    });

    sphere.add(sound);

    if (currentIntersectionMesh) {
      scene.remove(currentIntersectionMesh);
    }
    currentIntersectionMesh = sphere;
    scene.add(currentIntersectionMesh);
    return intersectPoint;
  } else {
    return thisPlane;
  }
}

let isReady = false;
let isPredicting = true;
let prev_framebuffer;
let frameCount = 0;
let framebuffer;
async function animate(timestamp, frame) {
  if (frame) {
    frameCount++;
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

        // plane.position.set(
        //   reticle.position.x,
        //   reticle.position.y,
        //   reticle.position.z
        // );

        const pose = frame.getViewerPose(referenceSpace);
        if (pose && frameCount % 10 === 0 && isPredicting && isReady) {
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
              isPredicting = false;
            }
          });
          gl.deleteFramebuffer(framebuffer);
          // gl.bindFramebuffer(gl.FRAMEBUFFER, prev_framebuffer);
        }
        // plane.visible = true;
      } else {
        reticle.visible = false;
        plane.visible = false;
      }
    }

    // prev_framebuffer = framebuffer;
  }

  renderer.render(scene, camera);
}
</script>
