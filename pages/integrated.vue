<template>
  <div id="overlay">
    <TresCanvas>
      <Suspense>
        <Integrated />
      </Suspense>
    </TresCanvas>
    <Interface @scanCamera="toggleCamera()" class="opacity-50 outer" :xrRunning="xrRunning" />
    <div class="fixed left-0 bottom-0">
      <div
        v-for="(prediction, index) in predictions"
        class="fixed bg-yellow rounded-full aspect-1 w-10px text-10px text-center opacity-50"
        :style="{
          left: prediction.bbox.x / 2 + 'px',
          top: prediction.bbox.y / 2 + 'px',
        }"
      >
        {{ index }}
      </div>
      <pre class="bg-white opacity-30">intersections: {{ intersections }}</pre>
      <pre class="bg-white opacity-30">plane detected: {{ planeDetected }}</pre>
      <!-- <button class="text-30px" @click="startXR()">StartXR</button> -->
      <button class="text-30px" @click="refreshPage()">refreshPage</button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 823 1920
import { TresCanvas } from "@tresjs/core";

const { sendIntersections } = useXrController();

const bus = useEventBus("tresjs");
const startXR = () => {
  console.log("startXR");
  bus.emit("startXR")
};

const stopXR = () => {
  console.log("stopXR");
  bus.emit("stopXR")
};

const xrRunning = ref(false);
const toggleCamera = () => {
  console.log("toggleCamera");
  xrRunning.value ? stopXR() : startXR();
  xrRunning.value = !xrRunning.value;
};

const planeDetected = ref(false);
const predictions = ref(null);
const intersections = ref([{ x: 1, z: 4 }]);
let lastPredictions = [];
bus.on((event, payload) => {
  if (event === "predictions") {
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
