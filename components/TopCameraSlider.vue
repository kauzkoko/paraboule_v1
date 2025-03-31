<template>
  <div
    class="fullScreenAll"
    :style="{
      pointerEvents: store.isTouchingTopCameraSlider ? 'auto' : 'none',
    }"
  />
</template>

<script setup>
const store = useProtoStore();
</script>
