<template>
  <div>
    <h1>Howler Spatial</h1>
    <button @click="play">Play</button>
  </div>
</template>

<script setup>
import { Howl, Howler } from "howler";

const { x, y } = useMouse();
watch(x, (newVal) => {
  sound.pos(Math.floor(map(newVal, 0, window.innerWidth, -10, 10)), 0, 0);
});

const sound = new Howl({
  src: ["/sounds/noz.mp3"],
});

sound.pannerAttr({
  panningModel: "HRTF",
  refDistance: 1,
  rolloffFactor: 1,
  distanceModel: "exponential",
  coneInnerAngle: 360,
  coneOuterAngle: 360,
  coneOuterGain: 1,
  maxDistance: 100,
});

const play = () => {
  sound.play();
};
</script>
