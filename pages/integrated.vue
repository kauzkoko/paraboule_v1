<template>
  <div id="overlay">
    <TresCanvas>
      <Integrated />
    </TresCanvas>
    <Interface @scanCamera="toggleCamera()" :xrRunning="xrRunning" />
    <div
      class="fixed left-0 bottom-0 transition-opacity transition-duration-200"
      :style="{ opacity: showIntersections ? '100' : '0' }"
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
  </div>
</template>

<script setup lang="ts">
// 823 1920
import { TresCanvas } from "@tresjs/core";

const { sendIntersections } = useXrController();

const bus = useEventBus("tresjs");
const startXR = () => {
  console.log("startXR in parent");
  bus.emit("startXR");
};

const stopXR = () => {
  console.log("stopXR");
  bus.emit("stopXR");
};

const scanCounter = ref(0);
const xrRunning = ref(false);
const toggleCamera = () => {
  scanCounter.value++;
  console.log("toggleCamera");
  if (xrRunning.value) {
    stopXR();
  } else {
    startXR();
  }
  xrRunning.value = !xrRunning.value;
};

const showIntersections = ref(false);
const planeDetected = ref(false);
const predictions = ref(null);
const intersections = ref([{ x: 1, z: 4 }]);
bus.on((event, payload) => {
  if (event === "predictions") {
    console.log("predictions", payload);
    predictions.value = payload;
  }
  if (event === "intersections" && planeDetected.value) {
    showIntersections.value = true;
    intersections.value = payload;
    setTimeout(() => {
      showIntersections.value = false;
      // intersections.value = [];
    }, 2000);
    sendIntersections(payload);
  }

  if (event === "plane") {
    planeDetected.value = payload.detected;
  }
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
  /* color: #ff0000; */
}
</style>
