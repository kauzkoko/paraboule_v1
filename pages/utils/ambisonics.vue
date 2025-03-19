<template>
  <TresCanvas window-size>
    <TresPerspectiveCamera
      :position="[cameraX, cameraY, cameraZ]"
      :rotation="[rotationX, (alpha * Math.PI) / 180, 0]"
    />
    <TresMesh
      v-for="(boule, index) in boulesToDisplay"
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
const cameraY = ref(0);
const cameraZ = ref(startPoint);

const store = useProtoStore();
const { boulesToDisplay, helpers, hihatTriggers } = storeToRefs(store);
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

const mockIntersections = ref([
  {
    id: 1,
    x: 0.15217870875827644,
    y: 0.11757755279540989,
    z: 2.14242094133827,
    class: "cochonet",
  },
  {
    id: 2,
    x: 0.3014103032020119,
    y: 0.11757755279540989,
    z: -2.3185530158534984,
    class: "dark",
  },
  {
    id: 3,
    x: 0.019827494002689575,
    y: 0.13757755279540984,
    z: -1.873205403607142,
    class: "light",
  },
  {
    id: 4,
    x: 0.35239538925638664,
    y: 0.050841178894042934,
    z: -2.040454871744344,
    class: "dark",
  },
  {
    id: 5,
    x: 0.20640927469181287,
    y: 0.10841178894042956,
    z: -1.9825655394221926,
    class: "light",
  },
]);

const scaler = 10;
const scaledBoules = ref([
  {
    id: 1,
    x: -0.15217870875827644 * scaler,
    y: 0.11757755279540989 * scaler,
    z: -2.14242094133827 * scaler,
  },
  {
    id: 2,
    x: 0.3014103032020119 * scaler,
    y: 0.11757755279540989 * scaler,
    z: -2.3185530158534984 * scaler,
  },
  {
    id: 3,
    x: -0.019827494002689575 * scaler,
    y: 0.13757755279540984 * scaler,
    z: -1.373205403607142 * scaler,
  },
  {
    id: 4,
    x: 0.35239538925638664 * scaler,
    y: 0.050841178894042934 * scaler,
    z: -2.040454871744344 * scaler,
  },
  {
    id: 5,
    x: 0.20640927469181287 * scaler,
    y: 0.10841178894042956 * scaler,
    z: -1.9825655394221926 * scaler,
  },
  {
    id: 6,
    x: 0 * scaler,
    y: 0 * scaler,
    z: 0 * scaler,
  },
]);

let theBoules = []
const setBoules = (newVal) => {
  theBoules = JSON.parse(JSON.stringify(newVal));
  console.log("theBoules", theBoules);
};

const computedBoules = computed(() => {
  return mockIntersections.value.map((intersection) => ({
    ...intersection,
    x: intersection.x * 10,
    y: intersection.y * 10,
    z: intersection.z * 10,
  }));
});

const zScaler = 30;
const moveBoules = () => {
  console.log("moveBoules", boulesToDisplay.value);
  theBoules.forEach((boule, index) => {
    console.log(boule.x);
    const relativeZstart = boule.z - cameraZ.value;
    const newZ = boule.z + cameraZ.value;
    const mappedX = boule.x / 5;
    const tag = "ball" + (index + 1) + "x";
    console.log("tag", tag);
    send.value(tag, mappedX);
    gsap.to(boule, {
      z: newZ,
      duration: 3,
      ease: "power2.out",
      onUpdate: () => {
        const relativeZ = (boule.z - cameraZ.value) * -1;
        const mappedZ = relativeZ / zScaler;
        send.value("ball" + (index + 1) + "y", mappedZ);
      },
      onComplete: () => {
        gsap.to(boule, {
          z: boule.z - cameraZ.value,
          duration: 3,
          ease: "power2.out",
          onUpdate: () => {
            const relativeZ = (boule.z - cameraZ.value) * -1;
            const mappedZ = relativeZ / zScaler;
            send.value("ball" + (index + 1) + "y", mappedZ);
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

onKeyStroke("s", (e) => {
  e.preventDefault();
  setBoules(boulesToDisplay.value);
});
</script>
