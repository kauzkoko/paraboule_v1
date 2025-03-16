<template>
  <TresMesh ref="boxRef" :position="[0, 0, -4]">
    <TresBoxGeometry />
    <TresMeshBasicMaterial transparent :opacity="0" color="transparent" />
  </TresMesh>
</template>

<script setup lang="ts">
import { useTresContext } from "@tresjs/core";
import * as THREE from "three";

const { predictFromImage } = await useInference();

const { renderer, scene, camera } = useTresContext();

const bus = useEventBus("tresjs");
bus.on((message) => {
  if (message === "startXR") {
    console.log("Starting XR in component");
    startXR()
  }
});

const startXR = async () => {
  console.log("Starting XR");
  let controller;

  let reticle;

  let plane;
  let intersectionBall;

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
      new THREE.RingGeometry(0.03, 0.05, 16).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0,
      })
    );

    intersectionBall = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 1,
      })
    );
    // scene.value.add(intersectionBall);

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

    reticle.matrixAutoUpdate = false;
    reticle.visible = false;

    scene.value.add(reticle);

    // window.addEventListener("touchstart", onClick);
    // window.addEventListener("click", onClick);
  }

  async function stopXR() {
    const session = renderer.value.xr.getSession();
    if (session) {
      await session.end();
      renderer.value.xr.enabled = false;
      console.log("XR session ended");
    }
  }

  bus.on((message) => {
    if (message === "stopXR") stopXR();
  });

  let bitmap;
  let counter = 0;
  let blobs = [];
  let clicked = false;
  // async function onClick(event) {
  //   clicked = true;
  //   counter++;
  //   console.log("Clicked", counter);
  //   const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  //   const clientY = event.touches ? event.touches[0].clientY : event.clientY;

  //   const intersectionBall = new THREE.Mesh(
  //     new THREE.SphereGeometry(0.05, 32, 32),
  //     new THREE.MeshBasicMaterial({
  //       color: 0x00ff00,
  //       transparent: true,
  //       opacity: 0.5,
  //     })
  //   );

  //   let testPrediction;
  //   const predictions = await predictFromImage(bitmap);
  //   if (predictions.length > 0) {
  //     bus.emit("predictions", predictions);
  //     testPrediction = predictions[0];
  //   }

  //   const raycaster = new THREE.Raycaster();
  //   const mouse = new THREE.Vector2();

  //   // mouse.x = (clientX / window.innerWidth) * 2 - 1;
  //   // mouse.y = -(clientY / window.innerHeight) * 2 + 1;

  //   (mouse.x = (testPrediction.bbox.x / 2 / window.innerWidth) * 2 - 1),
  //     (mouse.y = -(testPrediction.bbox.y / 2 / window.innerHeight) * 2 + 1);

  //   raycaster.setFromCamera(mouse, camera.value);

  //   const intersects = raycaster.intersectObject(plane);

  //   if (intersects.length > 0) {
  //     const intersectPoint = intersects[0].point;
  //     intersectionBall.position.copy(intersectPoint);
  //   }

  //   scene.value.add(intersectionBall);
  //   clicked = false;
  // }

  function intersectPrediction(prediction) {
    const raycaster = new THREE.Raycaster();
    const input = new THREE.Vector2();

    (input.x = (prediction.bbox.x / 2 / window.innerWidth) * 2 - 1),
      (input.y = -(prediction.bbox.y / 2 / window.innerHeight) * 2 + 1);

    raycaster.setFromCamera(input, camera.value);

    const intersects = raycaster.intersectObject(plane);

    if (intersects.length > 0) {
      const intersectPoint = intersects[0].point;
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

        if (frameCount % 10 === 0 && !clicked) {
          const predictions = await predictFromImage(bitmap);
          if (predictions.length > 0) {
            bus.emit("predictions", predictions);
            const hasCochonet = predictions.some(item => item.class === "cochonet");
            if (hasCochonet) {
              let intersections = [];
                predictions.forEach((prediction) => {
                let intersectPoint = intersectPrediction(prediction);
                intersections.push({
                  class: prediction.class,
                  ...intersectPoint
                });
              });
              bus.emit("intersections", intersections);
            }
            lastPredictions = predictions;
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

          reticle.visible = true;
          reticle.matrix.fromArray(
            hit.getPose(referenceSpace).transform.matrix
          );
          reticle.position.setFromMatrixPosition(reticle.matrix);

          plane.position.set(
            reticle.position.x,
            reticle.position.y,
            reticle.position.z
          );

          // Emit planeDetected event with true
          bus.emit("plane", {
            detected: true,
            // position: {
            //   x: plane.position.x,
            //   y: plane.position.y,
            //   z: plane.position.z
            // },
          });
        } else {
          reticle.visible = false;

          // Emit planeDetected event with false
          bus.emit("plane", { detected: false });
        }
      }

      gl.deleteFramebuffer(framebuffer);
    }
    renderer.value.render(scene.value, camera.value);
  }
};
</script>
