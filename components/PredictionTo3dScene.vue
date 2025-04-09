<template>
  <TresPerspectiveCamera
    ref="camera"
    :position="[0, 1, 10]"
    :rotation="[0, 0, 0]"
  />
  <TresMesh ref="bouleRef" :position="[0, 0, 0]">
    <TresSphereGeometry :args="[1, 24, 24]" />
    <Suspense>
      <PositionalAudio
        :ready="true"
        :helper="true"
        :autoplay="false"
        :loop="true"
        :key="trigger"
        url="/sounds/noise.mp3"
      />
    </Suspense>
    <TresMeshPhysicalMaterial
      :roughness="0.4"
      :metalness="1"
      emissive="white"
    />
  </TresMesh>
  <TresMesh ref="boxRef" :position="[0, 0, -500]">
    <TresBoxGeometry :args="[1, 1, 1]" />
    <Suspense>
      <PositionalAudio
        :ready="true"
        :helper="true"
        :autoplay="false"
        :loop="true"
        :key="trigger"
        url="/sounds/shortdeep.mp3"
      />
    </Suspense>
    <TresMeshPhysicalMaterial
      :roughness="0.4"
      :metalness="1"
      emissive="red"
    />
  </TresMesh>
  <TresAmbientLight :intensity="230" />
  <GridComponent />
</template>

<script setup>
import { useLoop } from "@tresjs/core";
import { gsap } from "gsap";
import { PositionalAudio } from "@tresjs/cientos";

const props = defineProps({
  bouleX: {
    type: Number,
    default: 0,
  },
});

const bouleRef = ref(null);
const boxRef = ref(null);

const trigger = ref(0);
watch(
  () => props.bouleX,
  (newX) => {
    bouleRef.value.position.x = newX;
    boxRef.value.position.z = map(Math.abs(newX), 0, 10, 0, -500);
  }
);
</script>
