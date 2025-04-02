<template>
  <div
    class="fullScreenAll"
    v-if="store.isTouchingSlider"
    :style="{
      pointerEvents: store.isTouchingSlider ? 'auto' : 'none',
    }"
  />
</template>

<script setup>
const store = useProtoStore();
</script>
