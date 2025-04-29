<template>
  <TresMesh
    :rotation="[-Math.PI / 2, 0, 0]"
    :position="[0, -.015, 10]"
    receive-shadow
  >
    <TresPlaneGeometry :args="[10, 30, 1500, 1500]" />
    <TresMeshStandardMaterial
      :map="map"
      :displacementMap="displacementMap"
      :roughnessMap="roughnessMap"
      :normalMap="normalMap"
      :aoMap="aoMap"
      :displacementScale="0.12"
    />
  </TresMesh>
</template>

<script setup>
import { useTexture } from "@tresjs/core";
import { RepeatWrapping } from 'three';

const { map, displacementMap, normalMap, roughnessMap, aoMap } =
  await useTexture({
    map: "/textures/gravel/gravel_floor_02_diff_4k.jpg",
    displacementMap: "/textures/gravel/gravel_floor_02_disp_4k.jpg",
    normalMap: "/textures/gravel/gravel_floor_02_nor_gl_4k.jpg",
    roughnessMap: "/textures/gravel/gravel_floor_02_rough_4k.jpg",
    aoMap: "/textures/gravel/gravel_floor_02_ao_4k.jpg",
  });

// Set wrapping mode to repeat
map.wrapS = map.wrapT = RepeatWrapping;
displacementMap.wrapS = displacementMap.wrapT = RepeatWrapping;
normalMap.wrapS = normalMap.wrapT = RepeatWrapping;
roughnessMap.wrapS = roughnessMap.wrapT = RepeatWrapping;
aoMap.wrapS = aoMap.wrapT = RepeatWrapping;

// Scale the textures to make them appear larger or smaller
const textureScaleX = 1; // Adjust this value to change the overall texture scale
const textureScaleY = 4; // Adjust this value to change the overall texture scale
map.repeat.set(textureScaleX, textureScaleY);
displacementMap.repeat.set(textureScaleX, textureScaleY);
normalMap.repeat.set(textureScaleX, textureScaleY);
roughnessMap.repeat.set(textureScaleX, textureScaleY);
aoMap.repeat.set(textureScaleX, textureScaleY);
</script>
