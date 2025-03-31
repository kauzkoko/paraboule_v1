<template>
  <TresMesh>
    <TresSphereGeometry :args="[1, 32, 32]" />
    <TresMeshStandardMaterial
      :map="sandTexture.map"
      :displacementMap="sandTexture.displacementMap"
      :roughnessMap="sandTexture.roughnessMap"
      :normalMap="sandTexture.normalMap"
    />
  </TresMesh>
</template>

<script setup>
import { useTexture } from "@tresjs/core";

const sandTexture = await useTexture({
  map: "/textures/coast_sand_02_diff_1k.jpg",
  displacementMap: "/textures/coast_sand_02_arm_1k.jpg",
  roughnessMap: "/textures/coast_sand_02_nor_gl_1k.jpg",
  normalMap: "/textures/coast_sand_02_nor_gl_1k.jpg",
});
</script>
