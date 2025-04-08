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
import { Box, KeyboardControls } from "@tresjs/cientos";
import * as THREE from "three";
import * as Tone from "tone";

const boxRef = ref(null);
const camera = ref(null);
let panner = null;
let synth = null;

const start = async () => {
  try {
    // Step 1: Initialize Tone.js
    await Tone.start();
    console.log("Tone.js started");

    // Step 2: Create a simple synth
    synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 1 }
    });

    // Step 3: Create a panner for spatial audio
    panner = new Tone.Panner3D({
      positionX: 0,
      positionY: 0,
      positionZ: 0,
      orientationX: 0,
      orientationY: 0,
      orientationZ: 0,
      panningModel: "HRTF",
      distanceModel: "exponential",
      maxDistance: 50,
      refDistance: 1,
      rolloffFactor: 1
    }).toDestination();

    // Step 4: Connect synth to panner
    synth.connect(panner);

    // Step 5: Play a test note
    synth.triggerAttackRelease("C3", "30s");

    // Step 6: Start the animation loop
    animate();

  } catch (error) {
    console.error("Error setting up audio:", error);
  }
}

const updateAudioPositions = () => {
  if (camera.value && boxRef.value && panner) {
    // Calculate distance between camera and box using Three.js
    const distance = camera.value.position.distanceTo(boxRef.value.position);
    // Map distance to frequency (closer = higher pitch)
    // Clamp distance between 1 and 20 meters for reasonable pitch range
    const clampedDistance = Math.max(1, Math.min(20, distance));
    
    // Map distance directly to frequency range (220Hz - 880Hz)
    // As distance increases, frequency decreases
    const frequency = 220 + ((20 - clampedDistance) / 19) * (880 - 220);
    
    // Update synth frequency
    if (synth) {
      synth.frequency.rampTo(frequency, 0.1);
    }

    // Update listener (camera) position
    const cameraPosition = camera.value.position;
    Tone.Listener.positionX.value = cameraPosition.x;
    Tone.Listener.positionY.value = cameraPosition.y;
    Tone.Listener.positionZ.value = cameraPosition.z;

    // Update listener orientation using camera's matrix
    const matrix = camera.value.matrix;
    const forward = new THREE.Vector3();
    forward.setFromMatrixColumn(matrix, 2);
    
    // Set the forward vector
    Tone.Listener.forwardX.value = -1*forward.x;
    Tone.Listener.forwardY.value = forward.y;
    Tone.Listener.forwardZ.value = forward.z;

    // Update source (box) position
    const boxPosition = boxRef.value.position;
    panner.positionX.value = boxPosition.x;
    panner.positionY.value = boxPosition.y;
    panner.positionZ.value = boxPosition.z;
  }
}

const animate = () => {
  updateAudioPositions();
  requestAnimationFrame(animate);
}
</script>
