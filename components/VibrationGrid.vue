<template>
  <div class="fullScreenAll flexCenter text-white">
    <div
      v-if="false"
      class="transition-all transition-duration-500"
      :style="{ opacity: isTouching ? 100 : 0 }"
    >
      <div
        class="fixed top-0 left-0 w-50px aspect-1 rounded-full bg-hex-ff0000 transform translate-x--50% translate-y--50%"
        v-for="(boule, index) in boules"
        :key="index"
        :style="{
          top: boule.y + 'px',
          left: boule.x + 'px',
          backgroundColor:
            boule.class === 'cochonet'
              ? '#ff0000'
              : boule.class === 'dark'
              ? '#999'
              : '#eee',
          width: boule.class === 'cochonet' ? '30px' : '50px',
        }"
      ></div>
    </div>
  </div>
</template>

<script setup>
const { isTouching } = defineProps({
  isTouching: {
    type: Boolean,
    default: false,
  },
});

const bus = useEventBus("tresjs");
bus.on((message, payload) => {
  if (message === "screenPositions") {
    console.log("screenPositions", payload);
  }
});

const { x, y } = useMouse();
const { width, height } = useWindowSize();
const boules = ref([
  {
    class: "cochonet",
    x: width.value / 2,
    y: height.value / 2,
    audio: new Audio("/sounds/elevenlabs/cochonet.mp3"),
  },
  {
    class: "dark",
    x: 200,
    y: height.value - 200,
    audio: new Audio("/sounds/elevenlabs/darkboule.mp3"),
  },
  {
    class: "light",
    x: 300,
    y: 300,
    audio: new Audio("/sounds/elevenlabs/lightboule.mp3"),
  },
]);
const pattern = ref([0]);
const { vibrate } = useVibrate({ pattern });

watch([x, y], ([x, y]) => {
  console.log(isTouching);
  if (!isTouching) return;
  boules.value.forEach((boule) => {
    const distance = Math.sqrt(
      Math.pow(x - boule.x, 2) + Math.pow(y - boule.y, 2)
    );
    if (distance < 10) {
      console.log("Touching", boule.class);
      if (boule.audio.paused) {
        boule.audio.play();
      }
    }
    if (distance < 20) pattern.value = [200];
    else if (distance < 50) pattern.value = [100];
    else if (distance < 100) pattern.value = [50];
    else {
      pattern.value = [0];
      return;
    }
    vibrate();
    console.log(`Distance to ${boule.class}:`, distance);
  });
});
</script>
