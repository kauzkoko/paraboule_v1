<template>
  <div id="overlay">
    <TresCanvas>
      <XR />
    </TresCanvas>
    <Interface @scanCamera="toggleCamera()" />
    <Predictions />
  </div>
</template>

<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";

const store = useProtoStore();
const { predictions, xrRunning } = storeToRefs(store);

const bus = useEventBus("protoboules");
const startXR = () => {
  bus.emit("startXR");
};
const stopXR = () => {
  bus.emit("stopXR");
};

const scanCounter = ref(0);
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
