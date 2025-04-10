<template>
  <TresPerspectiveCamera ref="camera" />
  <TresMesh ref="boxRef"       @click="isSelected = !isSelected"
  >
    <TresBoxGeometry />
    <TresMeshBasicMaterial color="yellow" />
    <TestAudio
      :parent="boxRef"
      :listener="listener"
      :isSelected="isSelected"
    />
  </TresMesh>
  <!-- <KeyboardControls /> -->
  <Grid :args="[30, 30]" />
  <TresAxesHelper :scale="5" />
</template>

<script setup>
import { TresCanvas, useTresContext, useLoop } from "@tresjs/core";
const { scene } = useTresContext();
import { KeyboardControls, Grid } from "@tresjs/cientos";
import * as THREE from "three";
import { animate } from "animejs";

const isSelected = ref(false);
const boxRef = ref(null);
const camera = ref(null);
onKeyStroke("e", () => {
  if (boxRef.value) {
    animate(boxRef.value.position, {
      y: boxRef.value.position.y + 1,
      duration: 1000,
      easing: "power2.out",
    });
  }
});

const handleClick = () => {
  if (globalVolume.value === 1) {
    animate(globalVolume, {
      value: 0,
      duration: 1000,
      easing: "power2.out",
      onUpdate: () => {
        sound.setVolume(globalVolume.value);
      },
    });
  } else {
    animate(globalVolume, {
      value: 1,
      duration: 1000,
      easing: "power2.out",
      onUpdate: () => {
        sound.setVolume(globalVolume.value);
      },
    });
  }
};

const globalVolume = ref(0);

let sound;
const listener = new THREE.AudioListener();
onMounted(() => {
  camera.value.add(listener); // Ensure listener is added to camera
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
    sound.setVolume(globalVolume.value);
    sound.setPlaybackRate(1);
    sound.play();
  });
});
</script>
