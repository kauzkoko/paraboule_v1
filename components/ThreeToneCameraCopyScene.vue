<template>
  <TresPerspectiveCamera
    ref="camera"
    :position="[0, 0.1, 0]"
    :rotation="[0, 0, 0]"
  />
  <TresMesh ref="boxRef" :position="[-10, 0, -5]">
    <TresBoxGeometry />
    <TresMeshBasicMaterial color="yellow" />
  </TresMesh>
  <KeyboardControls />
  <Grid :args="[30, 30]" />
  <TresAxesHelper :scale="10" />
</template>

<script setup>
import { TresCanvas, useTresContext, useLoop } from "@tresjs/core";
import { KeyboardControls, Grid } from "@tresjs/cientos";
import * as THREE from "three";
import * as Tone from "tone";

const boxRef = ref(null);
const camera = ref(null);
let panner;
let isStarted = false;

function setRotation(angle) {
  Tone.Listener.forwardX.value = Math.sin(angle);
  Tone.Listener.forwardY.value = 0;
  Tone.Listener.forwardZ.value = -Math.cos(angle);
}

const { onBeforeRender } = useLoop();
onBeforeRender(({ delta }) => {
  if (!isStarted) return;
  Tone.Listener.positionX.value = camera.value.position.x;
  Tone.Listener.positionY.value = camera.value.position.y;
  Tone.Listener.positionZ.value = camera.value.position.z;

  // const heading = camera.value.rotation.y;
  // const radians = heading > 0
  //   ? heading
  //   : (2 * Math.PI) + heading;
  // const degrees = THREE.MathUtils.radToDeg(radians);
  // const degreesRounded = Math.floor(degrees);
  // // console.log("rotationY", degreesRounded);
  // setRotation(radians);

  // Get the camera's rotation as a matrix
  // const matrix = new THREE.Matrix4();
  // camera.value.matrixWorld.decompose(
  //   new THREE.Vector3(),
  //   new THREE.Quaternion(),
  //   new THREE.Vector3()
  // );
  // matrix.identity().setPosition(camera.value.position).multiply(camera.value.matrixWorld);

  // // Calculate the front (forward) and up vectors
  // const front = new THREE.Vector3(0, 0, -1).applyMatrix4(matrix).normalize();
  // const up = new THREE.Vector3(0, 1, 0).applyMatrix4(matrix).normalize();

  // Get the camera's world position, rotation, and scale
  const matrix = camera.value.matrixWorld; // Directly use the matrixWorld for the camera

  // Calculate the forward (front) and up vectors based on camera rotation
  const front = new THREE.Vector3(0, 0, -1).applyMatrix4(matrix).normalize();
  const up = new THREE.Vector3(0, 1, 0).applyMatrix4(matrix).normalize();

  // Set the listener's front and up
  Tone.Listener.forwardX.value = front.x;
  Tone.Listener.forwardY.value = front.y;
  Tone.Listener.forwardZ.value = front.z;

  Tone.Listener.upX.value = up.x;
  Tone.Listener.upY.value = up.y;
  Tone.Listener.upZ.value = up.z;
});

const start = async () => {
  camera.value.rotation.order = "YXZ";
  isStarted = true;
  await Tone.start();
  const synth = new Tone.MonoSynth({
    oscillator: {
      type: "square",
    },
    envelope: {
      attack: 0.1,
    },
  });

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
    rolloffFactor: 1,
  }).toDestination();
  synth.connect(panner);
  panner.setPosition(...boxRef.value.position);
  synth.triggerAttackRelease("C4", "10s");
};

onKeyStroke("e", () => {
  start();
});
</script>
