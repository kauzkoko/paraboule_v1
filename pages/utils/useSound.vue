<template>
  <div>
    <button @click="play">play</button>
  </div>
</template>

<script setup>
import buttonSfx from "/sounds/elevenlabs/explanation_boomerang.mp3";
const { play } = useSound(buttonSfx, { interrupt: true });
</script>
