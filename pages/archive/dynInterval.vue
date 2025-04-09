<template>
  <div class="w-full h-full flex flex-col items-center justify-center text-white">
    <div>{{ counter }}</div>
    <div class="controls">
      <input type="range" min="50" max="1000" step="50" v-model="interval" />
      <span>Interval: {{ interval }}ms</span>
    </div>
  </div>
</template>

<script setup>
const interval = ref(200);
const counter = useInterval(interval);
</script>
