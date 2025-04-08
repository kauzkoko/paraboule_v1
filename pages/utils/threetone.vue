<template>
  <TresCanvas window-size clear-color="white">
    <TresPerspectiveCamera ref="camera" />
    <TresMesh ref="boxRef" @click="start">
      <TresBoxGeometry />
      <TresMeshBasicMaterial color="yellow" />
    </TresMesh>
    <KeyboardControls />
    <Grid
      :args="[10.5, 10.5]"
      cell-color="ff0000"
      :cell-size="1"
      :cell-thickness="0.5"
      section-color="#ff0000"
      :section-size="1"
      :section-thickness="2"
      :infinite-grid="true"
      :fade-from="0"
      :fade-distance="30"
      :fade-strength="1"
    />
  </TresCanvas>
</template>

<script setup>
import { TresCanvas } from "@tresjs/core";
import { KeyboardControls, Grid } from "@tresjs/cientos";
import * as THREE from "three";
import * as Tone from "tone";

const boxRef = ref(null);
const camera = ref(null);

const start = async () => {
  const listener = new THREE.AudioListener();
  camera.value.add(listener); // Attach listener to the camera
  const context = listener.context;

  await Tone.start();
  // const synth = new Tone.Synth().toDestination();
  const synth = new Tone.MonoSynth({
    oscillator: {
      type: "square",
    },
    envelope: {
      attack: 0.1,
    },
  }).toDestination();

  context.destination.channelCount = 1;
  context.destination.channelCountMode = "explicit";
  const positionalAudio = new THREE.PositionalAudio(listener);
  const destination = Tone.context.createMediaStreamDestination();
  synth.connect(destination);
  const source = context.createMediaStreamSource(destination.stream);

  positionalAudio.setNodeSource(source);
  // positionalAudio.setRefDistance(1.0); // 1 meter reference distance
  // positionalAudio.setRolloffFactor(1.0); // Physically accurate rolloff
  positionalAudio.setMaxDistance(10000); // Maximum distance for sound
  positionalAudio.setDistanceModel("exponential"); // Most physically accurate model
  positionalAudio.setVolume(1);
  boxRef.value.add(positionalAudio);

  synth.triggerAttackRelease("C4", "10s");
};
</script>
