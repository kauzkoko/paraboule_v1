<template>
  <div id="overlay">
    <TresCanvas>
      <SaveImages />
    </TresCanvas>
    <canvas class="fixed left-0 top-0 w-screen h-screen bg-transparent pointer-events-none" id="outputCanvas"></canvas>
    <div class="fixed left-0 bottom-0 flex">
      <button @click="startXR()">startXR</button>
      <button @click="saveImages()">saveImages</button>
      <div class="ml-2">{{ blobsCount }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
const bus = useEventBus("protoboules");
const startXR = () => bus.emit('startXR')
const saveImages = () => bus.emit('saveImages')
const blobsCount = ref(0)
bus.on((message) => {
  if (message === "blobsCount") blobsCount.value++;
});
</script>