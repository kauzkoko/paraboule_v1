<script setup>
import { TresCanvas, useTresContext, useLoop } from "@tresjs/core";
import * as THREE from "three";
import { animate } from "animejs";

const props = defineProps({
  parent: {
    type: Object,
    required: true,
  },
  listener: {
    type: Object,
    required: true,
  },
  isSelected: {
    type: Boolean,
    required: true,
  },
});

let sound;
watch(
  () => props.parent,
  (newVal) => {
    // console.log(newVal);
    sound = new THREE.PositionalAudio(props.listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load("/sounds/strudel/simplebeat.mp3", function (buffer) {
      const lowpass = sound.context.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(1000, sound.context.currentTime);
      sound.setFilters([lowpass]);
      sound.setBuffer(buffer);
      sound.setRefDistance(1.0);
      sound.setRolloffFactor(1.0);
      sound.setMaxDistance(10000);
      sound.setDistanceModel("exponential");
      sound.setLoop(true);
      sound.setVolume(0);
      sound.setPlaybackRate(1);
      sound.play();
    });
  }
);

const volume = ref(0);
watch(
  () => props.isSelected,
  (newVal) => {
    // console.log(newVal);
    if (newVal) {
      animate(volume, {
        value: 1,
        duration: 1000,
        easing: "power2.out",
        onUpdate: () => {
          sound.setVolume(volume.value);
        },
      });
    } else {
      animate(volume, {
        value: 0,
        duration: 1000,
        easing: "power2.out",
        onUpdate: () => {
          sound.setVolume(volume.value);
        },
      });
    }
  }
);
</script>
