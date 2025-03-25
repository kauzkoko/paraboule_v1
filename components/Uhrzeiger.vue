<template>
  <TresPerspectiveCamera :position="[0, 30, 0]" :rotation="[-Math.PI / 2, 0, 0]" />
  <OrbitControls />
  <Circle
    :args="[5, 32]"
    :rotation="[-Math.PI / 2, 0, 0]"
    :position="[0, 0, 0]"
	color="yellow"
	receive-shadow
  />
  <Box :scale="[.5,.5,5]" :position="[0, .5/2+.5, 0]" :rotation="[0, rotationHour, 0]" color="black" cast-shadow />
  <TresDirectionalLight cast-shadow :position="[0, 5, 0]" :intensity="3" />
</template>

<script setup>
import { Circle, Box, KeyboardControls, OrbitControls } from "@tresjs/cientos";

const hourTime = ref(7);
const rotationHour = computed(() => {
  return (hourTime.value / 12) * (2 * Math.PI);
});
</script>
