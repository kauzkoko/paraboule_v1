<template>
  <TresCanvas window-size clear-color="#ff0000">
    <Test :localTrigger="trigger" :volume="volume" :src="src" />
  </TresCanvas>
</template>

<script setup>
import { TresCanvas } from "@tresjs/core";

const trigger = ref(0);
const src = ref("/sounds/noz.mp3");
onKeyStroke(["t"], (e) => {
  e.preventDefault();
  console.log("trigger", trigger.value);
  trigger.value++;
});

const volume = ref(1);
onKeyStroke(["ArrowUp"], (e) => {
  e.preventDefault();
  volume.value += 0.1;
});

onKeyStroke(["ArrowDown"], (e) => {
  e.preventDefault();
  volume.value = Math.max(0, volume.value - 0.1);
});
</script>
