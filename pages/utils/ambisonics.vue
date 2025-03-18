<template>
  <TresCanvas window-size>
    <TresPerspectiveCamera
      :position="[cameraX, cameraY, cameraZ]"
      :rotation="[rotationX, (alpha * Math.PI) / 180, 0]"
    />
    <TresMesh
      v-for="(boule, index) in boules"
      :position="[boule.x, 0, boule.z]"
      :key="index"
    >
      <TresSphereGeometry :args="[1, 24, 24]" />
      <TresMeshPhysicalMaterial
        :roughness="0.4"
        :metalness="1"
        :emissive="'red'"
      />
    </TresMesh>
    <TresAmbientLight :intensity="100" />
    <TresDirectionalLight />
    <Grid />
  </TresCanvas>
</template>

<script setup>
import gsap from "gsap";
import { TresCanvas } from "@tresjs/core";
import { Grid } from "@tresjs/cientos";

const { send } = useOSC();

let startPoint = 30;
const alpha = ref(0);
const rotationX = ref(0);
const cameraX = ref(0);
const cameraY = ref(1);
const cameraZ = ref(startPoint);

const boules = ref([
  {
    id: 1,
    x: 0,
    y: 0,
    z: 0,
  },
  {
    id: 2,
    x: 3,
    y: 0,
    z: 1,
  },
  {
    id: 3,
    x: 2,
    y: 0,
    z: -3,
  },
]);

const moveBoules = () => {
  boules.value.forEach((boule) => {
    console.log(boule);
    const relativeZstart = boule.z - cameraZ.value;
    const newZ = boule.z + cameraZ.value;
    const mappedX = boule.x / 5;
    const tag = "ball" + boule.id + "x";
    send.value(tag, mappedX);
    gsap.to(boule, {
      z: newZ,
      duration: 3,
      ease: "power2.out",
      onUpdate: () => {
        const relativeZ = (boule.z - cameraZ.value) * -1;
        const mappedZ = relativeZ / 30;
        send.value("ball" + boule.id + "y", mappedZ);
      },
      onComplete: () => {
        gsap.to(boule, {
          z: boule.z - cameraZ.value,
          duration: 3,
          ease: "power2.out",
          onUpdate: () => {
            const relativeZ = (boule.z - cameraZ.value) * -1;
            const mappedZ = relativeZ / 30;
            send.value("ball" + boule.id + "y", mappedZ);
          },
        });
      },
    });
  });
};

onKeyStroke("m", (e) => {
  e.preventDefault();
  moveBoules();
});
</script>
