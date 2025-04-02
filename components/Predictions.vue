<template>
  <div
    class="fixed left-0 top-0"
    v-show="xrRunning"
  >
    <div
      v-for="(prediction, index) in predictions"
      class="predictions"
      :style="{
        left: prediction.bbox.x / 2 + 'px',
        top: prediction.bbox.y / 2 + 'px',
        borderColor:
          prediction.class === 'cochonet'
            ? 'var(--cochonet)'
            : prediction.class === 'dark'
            ? 'var(--light)'
            : 'var(--dark)',
      }"
    >
      <div>{{ index }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useProtoStore();
const { predictions, xrRunning } = storeToRefs(store);

watch(predictions, (newVal) => {
  console.log(newVal);
});
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
  transform: translate(-50%, -50%);
  transition: all 0.2s ease-in-out;
}
</style>
