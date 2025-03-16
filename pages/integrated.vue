<template>
  <div id="overlay">
    <TresCanvas>
      <XR />
    </TresCanvas>
    <Interface @scanCamera="toggleCamera()" :xrRunning="xrRunning" />
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
    <!-- <div class="fixed right-0 bottom-0 text-white">{{ planeDetected }}</div> -->
  </div>
</template>

<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";

const store = useProtoStore();
const { planeDetected, predictions } = storeToRefs(store);

const bus = useEventBus("protoboules");
const startXR = () => {
  bus.emit("startXR");
};
const stopXR = () => {
  bus.emit("stopXR");
};

const scanCounter = ref(0);
const xrRunning = ref(false);
const toggleCamera = () => {
  scanCounter.value++;
  if (xrRunning.value) {
    stopXR();
  } else {
    startXR();
  }
  xrRunning.value = !xrRunning.value;
};
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
