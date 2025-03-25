<template>
  <div class="flexCenter fullScreenAll">
    <button @click="toggleLeftWall()">toggle left wall</button>
    <button @click="sendBallX()">send ball x</button>
  </div>
</template>

<script setup>
const { osc, on, send: sendOSC, bang } = useOSC();

let toggler = false;
const toggleLeftWall = () => {
  sendOSC("toggleLeftWall", toggler ? 1 : 0);
  toggler = !toggler;
};

const sendBallX = () => {
  sendOSC("ballX", map(30, 0, 100, -1, 1));
};

setInterval(() => {
  sendOSC("ballX", map(Math.floor(Math.random() * 100), 0, 100, -1, 1));
}, 1000);
</script>
