<template>
  <TresMesh ref="boxRef" :position="[0, 0, -4]">
    <TresBoxGeometry />
    <TresMeshBasicMaterial transparent :opacity="0" color="transparent" />
  </TresMesh>
</template>

<script setup lang="ts">
import { useTresContext } from "@tresjs/core";
import * as THREE from "three";

const store = useProtoStore();
const { rawIntersections, predictions, planeDetected, xrRunning } =
  storeToRefs(store);


const { sendRawIntersections } = useXrController();

const { predictFromImage } = await useInference();

const { renderer, scene, camera } = useTresContext();

const bus = useEventBus("protoboules");
bus.on((message) => {
  if (message === "startXR") {
    startXR();
  }
});

const startXR = async () => {
  console.log("Starting XR");
  xrRunning.value = true;

  let controller;
  let reticle;
  let plane;
  let hitTestSource = null;
  let hitTestSourceRequested = false;

  const supported = await navigator.xr?.isSessionSupported("immersive-ar");
  if (supported) {
    init();
    animate();
  } else {
    console.log("AR not supported");
    return false;
  }

  function init() {
    renderer.value.xr.enabled = true;

    navigator.xr
      .requestSession("immersive-ar", {
        requiredFeatures: [
          "local-floor",
          "hit-test",
          "camera-access",
          "dom-overlay",
        ],
        domOverlay: { root: document.getElementById("overlay") },
      })
      .then((session) => {
        renderer.value.xr.setSession(session);
      });

    controller = renderer.value.xr.getController(0);
    scene.value.add(controller);

    reticle = new THREE.Mesh(
      new THREE.RingGeometry(0.15, 0.2, 16).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        transparent: true,
        opacity: 1,
      })
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.value.add(reticle);

    const geometry = new THREE.PlaneGeometry(10, 10);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffa500,
      transparent: true,
      opacity: 0,
    });
    plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.05;
    scene.value.add(plane);
  }

  async function stopXR() {
    const session = renderer.value.xr.getSession();
    if (session) {
      await session.end();
      renderer.value.xr.enabled = false;
      console.log("XR session ended");
      xrRunning.value = false;
    }
  }

  bus.on((message) => {
    if (message === "stopXR") stopXR();
  });

  let bitmap;
  function intersectPrediction(prediction) {
    const raycaster = new THREE.Raycaster();
    const input = new THREE.Vector2();

    (input.x = (prediction.bbox.x / 2 / window.innerWidth) * 2 - 1),
      (input.y = -(prediction.bbox.y / 2 / window.innerHeight) * 2 + 1);

    raycaster.setFromCamera(input, camera.value);

    const intersects = raycaster.intersectObject(plane);

    if (intersects.length > 0) {
      const intersectPoint = intersects[0].point;
      // Create a sphere at the intersection point
      const sphereGeometry = new THREE.SphereGeometry(0.05, 32, 32);
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.7,
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.copy(intersectPoint);
      // Add positional audio to the sphere
      const listener = new THREE.AudioListener();
      camera.value.add(listener);
      
      const sound = new THREE.PositionalAudio(listener);
      const audioLoader = new THREE.AudioLoader();
      
      // Load a sound and set it as the PositionalAudio object's buffer
      audioLoader.load('/sounds/noz.mp3', function(buffer) {
        sound.setBuffer(buffer);
        sound.setRefDistance(1); // At what distance the volume reduction starts
        sound.setRolloffFactor(1); // How quickly the volume reduces with distance
        sound.setDistanceModel('exponential'); // Linear distance model
        sound.setMaxDistance(50); // Maximum distance at which the sound can be heard
        sound.setLoop(true);
        sound.setVolume(1);
        sound.play();
      });
      
      sphere.add(sound);
      scene.value.add(sphere);
      return intersectPoint;
    }
  }

  function animate() {
    renderer.value.setAnimationLoop(render);
  }

  let lastPredictions = [];
  let framebuffer;
  let frameCount = 0;
  async function render(timestamp, frame) {
    frameCount++;
    if (frame && renderer.value) {
      const referenceSpace = renderer.value.xr.getReferenceSpace();
      const session = renderer.value.xr.getSession();
      const gl = renderer.value.getContext();
      // const prev_framebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
      if (store.isSearching) {
        gl.bindFramebuffer(
          gl.FRAMEBUFFER,
          session.renderState.baseLayer.framebuffer
        );

        const pose = frame.getViewerPose(referenceSpace);
        if (pose) {
          const view = pose.views[0];

          const binding = new XRWebGLBinding(session, gl);
          const cameraTexture = binding.getCameraImage(view.camera);
          framebuffer = gl.createFramebuffer();

          bitmap = createImageFromTexture(
            gl,
            cameraTexture,
            view.camera.width,
            view.camera.height,
            framebuffer
          );

          // gl.deleteFramebuffer(framebuffer);
          // gl.bindFramebuffer(gl.FRAMEBUFFER, prev_framebuffer); // bind back the screen framebuffer

          if (frameCount % 10 === 0) {
            const newPredictions = await predictFromImage(bitmap);
            if (newPredictions.length > 0) {
              predictions.value = newPredictions;
              const hasBoules = newPredictions.some(
                (item) =>
                  item.class === "dark" ||
                  (item.class === "light" && item.confidence > 0.5)
              );
              const hasCochonet = newPredictions.some(
                (item) => item.class === "cochonette" && item.confidence > 0.5
              );
              if (hasCochonet) {
                let tempIntersections = [];
                newPredictions.forEach((newPrediction, index) => {
                  // console.log("confidence", newPrediction.confidence);
                  if (newPrediction.confidence > 0.5 && planeDetected.value) {
                    let intersectPoint = intersectPrediction(newPrediction);
                    // console.log("intersectPoint", intersectPoint);
                    tempIntersections.push({
                      class:
                        newPrediction.class === "cochonette"
                          ? "cochonet"
                          : newPrediction.class,
                      ...intersectPoint,
                    });
                  }
                });
                if (tempIntersections.length > 0) {
                  store.isSearching = false;
                  rawIntersections.value = tempIntersections;
                  sendRawIntersections();
                }
              }
              lastPredictions = newPredictions;
            }
          }
        }
      }

      if (hitTestSourceRequested === false) {
        const referenceSpace = await session.requestReferenceSpace("viewer");
        hitTestSource = await session.requestHitTestSource({
          space: referenceSpace,
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

          reticle.matrix.fromArray(
            hit.getPose(referenceSpace).transform.matrix
          );
          reticle.position.setFromMatrixPosition(reticle.matrix);

          plane.position.set(
            reticle.position.x,
            reticle.position.y,
            reticle.position.z
          );
          reticle.visible = true;


          planeDetected.value = true;
        } else {
          reticle.visible = false;
          planeDetected.value = false;
        }
      }

      if (store.isSearching) gl.deleteFramebuffer(framebuffer);
    }
    renderer.value.render(scene.value, camera.value);
  }
};
</script>
