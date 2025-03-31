<template>
  <div
    class="fullScreenAll flexCenter text-white"
    :style="{
      pointerEvents: store.isTouchingHaptic ? 'auto' : 'none',
    }"
  />
</template>

<script setup>
const store = useProtoStore();

const boules = ref([]);
const bus = useEventBus("protoboules");
bus.on((message, payload) => {
  if (message === "screenPositions") {
    console.log("screenPositions", payload);
    boules.value = payload;
  }
});

const { x, y } = useMouse();

const cochonet = new Audio("/sounds/elevenlabs/cochonet.mp3");
const darkBouleAudios = [
  new Audio("/sounds/elevenlabs/darkboule1.mp3"),
  new Audio("/sounds/elevenlabs/darkboule2.mp3"),
  new Audio("/sounds/elevenlabs/darkboule3.mp3"),
];
const lightBouleAudios = [
  new Audio("/sounds/elevenlabs/lightboule1.mp3"),
  new Audio("/sounds/elevenlabs/lightboule2.mp3"),
  new Audio("/sounds/elevenlabs/lightboule3.mp3"),
];

watch([x, y], ([x, y]) => {
  if (!store.isTouchingHaptic) return;
  boules.value.forEach((boule) => {
    const distance = Math.sqrt(
      Math.pow(x - boule.x, 2) + Math.pow(y - boule.y, 2)
    );
    if (distance < 10) {
      if (boule.class === "cochonet" || boule.class === "cochonet") {
        cochonet.play();
      } else if (boule.class === "dark") {
        darkBouleAudios[boule.classNumber - 1].play();
      } else if (boule.class === "light") {
        lightBouleAudios[boule.classNumber - 1].play();
      }
    } else if (distance < 50) {
      useVibrate({ pattern: [50, 0] }).vibrate();
    }
  });
});
</script>
