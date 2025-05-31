<template>
  <TresMesh ref="boxRef" :position="[0, 0, -4]">
    <TresBoxGeometry />
    <TresMeshBasicMaterial transparent :opacity="0" />
  </TresMesh>
</template>

<script setup lang="ts">
import { useTresContext } from "@tresjs/core";
import * as THREE from "three";

const { renderer, scene, camera } = useTresContext();

const bus = useEventBus("protoboules");
bus.on((message) => {
  if (message === "saveImages") saveImages();
  if (message === "startXR") startXR();
});

let blobs = [];
const saveImages = () => {
  function saveBlob(blob, filename) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  blobs.forEach((blob, index) => {
    const uuid = Math.random().toString(36).substring(2, 8);
    saveBlob(blob, `img_${uuid}_${index}.png`);
  });

  blobs = [];
};

const startXR = async () => {
  let controller;

  let hitTestSource = null;
  let hitTestSourceRequested = false;

  const supported = await navigator.xr?.isSessionSupported("immersive-ar");

  if (supported) {
    init();
    animate();
  } else {
    // console.log("AR not supported");
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

    window.addEventListener("touchstart", onClick);
  }

  async function onClick() {
    let canvas = document.getElementById("outputCanvas");

    const imageBlob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png", 1)
    );

    blobs.push(imageBlob);
    bus.emit("blobsCount", blobs.length);
  }

  function animate() {
    renderer.value.setAnimationLoop(render);
  }

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
        createImageFromTextureToCanvas(
          gl,
          cameraTexture,
          view.camera.width,
          view.camera.height
        );
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
        }
      }

      renderer.value.render(scene.value, camera.value);
    }
  }
};
</script>
