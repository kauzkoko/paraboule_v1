<template>
  <div
    class="fixed left-0 bottom-0 transition-opacity transition-duration-200"
    v-show="xrRunning"
  >
    <div
      v-for="(prediction, index) in predictions"
      class="predictions transition-all transition-duration-200 opacity-50"
      :style="{
        left: prediction.bbox.x / 2 + 'px',
        top: prediction.bbox.y / 2 + 'px',
        borderColor:
          prediction.class === 'cochonet'
            ? 'red'
            : prediction.class === 'dark'
            ? '#999'
            : '#eee',
      }"
    >
      <div>{{ index }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useProtoStore();
const { predictions, xrRunning } = storeToRefs(store);
</script>

<style>
.predictions {
  position: fixed;
  background-color: transparent;
  border-style: solid;
  border-color: #ff0000;
  border-width: 3px;
  border-radius: 50%;
  aspect-ratio: 1;
  width: 15px;
  height: 15px;
  text-align: center;
  opacity: 1;
  position: flex;
  justify-content: center;
  align-items: center;
}
</style>
