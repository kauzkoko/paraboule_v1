<template>
  <TresCanvas window-size clear-color="#ff0000">
    <TresPerspectiveCamera ref="camera" />
    <TresMesh ref="boxRef" @click="start">
      <TresBoxGeometry />
      <TresMeshBasicMaterial color="teal" />
    </TresMesh>
    <KeyboardControls />
  </TresCanvas>
</template>

<script setup>
import { TresCanvas } from "@tresjs/core";
import { KeyboardControls } from "@tresjs/cientos";
import * as THREE from "three";

const boxRef = ref(null);
const camera = ref(null);

const start = () => {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    const listener = new THREE.AudioListener();
    camera.value.add(listener); // Attach listener to the camera
    const positionalAudio = new THREE.PositionalAudio(listener);
    const context = listener.context;
    const source = context.createMediaStreamSource(stream);
    positionalAudio.setNodeSource(source);
    positionalAudio.setRefDistance(1); // Optional: adjust spatial effect
    boxRef.value.add(positionalAudio); // Attach audio to an object
  });
};
</script>
