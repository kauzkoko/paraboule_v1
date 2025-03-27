<template>
  <div
    class="fullScreenAll"
    :style="{
      pointerEvents: isTouchingSlider ? 'auto' : 'none',
    }"
  />
</template>

<script setup>
const store = useProtoStore();
const { isTouchingSlider } = storeToRefs(store);
</script>
