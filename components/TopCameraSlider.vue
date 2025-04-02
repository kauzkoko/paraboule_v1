<template>
  <div
    class="fullScreenAll"
    v-if="store.isTouchingTopCameraSlider"
    :style="{
      pointerEvents: store.isTouchingTopCameraSlider ? 'auto' : 'none',
    }"
  />
</template>

<script setup>
const store = useProtoStore();
</script>
