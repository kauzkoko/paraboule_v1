<template>
  <div id="overlay">
    <TresCanvas>
      <Integrated />
    </TresCanvas>
    <!-- <div class="fixed left-0 top-0 w-screen h-screen bg-black opacity-20" /> -->
    <Interface @scanCamera="toggleCamera()" :xrRunning="xrRunning" />
    <div class="fixed left-0 bottom-0" v-show="xrRunning">
      <div
        v-for="(prediction, index) in predictions"
        class="predictions"
        :style="{
          left: prediction.bbox.x / 2 + 'px',
          top: prediction.bbox.y / 2 + 'px',
          borderColor: prediction.class === 'cochonette' ? 'yellow' : prediction.class === 'dark' ? 'blue' : 'red',
        }"
      >
        <div>{{ index }}</div>
      </div>
      <!-- <pre class="bg-white opacity-30">intersections: {{ intersections }}</pre> -->
      <!-- <pre class="bg-white opacity-30">plane detected: {{ planeDetected }}</pre> -->
      <!-- <button class="text-30px" @click="startXR()">StartXR</button> -->
      <!-- <button class="text-30px" @click="refreshPage()">refreshPage</button> -->
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

const planeDetected = ref(false);
const predictions = ref(null);
const intersections = ref([{ x: 1, z: 4 }]);
bus.on((event, payload) => {
  if (event === "predictions") {
    console.log("predictions", payload);
    predictions.value = payload;
  }
  if (event === "intersections" && planeDetected.value) {
    intersections.value = payload;
    sendIntersections(payload);
  }

  if (event === "plane") {
    planeDetected.value = payload.detected;
  }
});

const refreshPage = () => {
  window.location.reload();
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
  /* color: #ff0000; */
}
</style>
