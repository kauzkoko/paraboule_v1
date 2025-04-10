<template>
  <h2 class="large grid centered square-grid text-xl">
    <span>H</span>
    <span>E</span>
    <span>L</span>
    <span>L</span>
    <span>O</span>
    <span>&nbsp;</span>
    <span>W</span>
    <span>O</span>
    <span>R</span>
    <span>L</span>
    <span>D</span>
  </h2>
</template>

<script setup>
import { animate } from "animejs";

onMounted(() => {
  animate("span", {
    // Property keyframes
    y: [
      { to: "-2.75rem", ease: "outExpo", duration: 600 },
      { to: 0, ease: "outBounce", duration: 800, delay: 100 },
    ],
    // Property specific parameters
    rotate: {
      from: "-1turn",
      delay: 0,
    },
    delay: (_, i) => i * 50, // Function based value
    ease: "inOutCirc",
    loopDelay: 1000,
    loop: true,
  });
});
</script>

<style scoped>
* {
	color: white;
}
</style>
