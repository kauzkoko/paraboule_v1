<template>
  <div id="overlay">
    <TresCanvas>
      <Suspense>
        <Integrated />
      </Suspense>
    </TresCanvas>
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
      <button class="text-30px" @click="startXR()">StartXR</button>
      <button class="text-30px" @click="refreshPage()">refreshPage</button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 823 1920
import { TresCanvas } from "@tresjs/core";

const supabase = useSupabaseClient();
let channel = supabase.channel("xr-controller");

channel
  .on("broadcast", { event: "intersections" }, (event) => {
    console.log("received intersections: ", event);
  })
  .subscribe();

const bus = useEventBus("tresjs");
const startXR = () => {
  bus.emit("startXR")
  console.log("sending startXR");
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
    channel.send({
      type: "broadcast",
      event: "intersections",
      payload: payload,
    });
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
html {
  margin: 0;
  padding: 0;
}
</style>
