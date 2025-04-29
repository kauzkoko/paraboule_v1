<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos'
const { scene } = await useGLTF("/models/treetrunk.glb", {
  draco: true,
});

const props = defineProps({
  rotation: {
    type: Array,
    default: () => [0, 0, 0],
  },
  position: {
    type: Array,
    default: () => [0, 0, -6],
  },
  scale: {
    type: Array,
    default: () => [2.5,1.2,1.2],
  },
});
</script>

<template>
  <primitive :object="scene" :scale="scale" :position="position" :rotation="rotation" />
</template>