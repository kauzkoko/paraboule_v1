<template>
  <div class="fullScreenAll flexCenter text-white">
    <div @touchstart="isTouching = true" @touchend="isTouching = false">
      test
    </div>
  </div>
</template>

<script setup>
const isTouching = ref(false);
const { x, y } = useMouse();
const { width, height } = useWindowSize();
const cochonet = { x: width.value / 2, y: height.value / 2 };
const pattern = ref([50, 50, 50, 50, 50, 50, 50, 50]);
const { vibrate } = useVibrate({ pattern });
watch(isTouching, (value) => {
  if (value) {
    vibrate();
  }
});

watch([x, y], ([x, y]) => {
  const distance = Math.sqrt(
    Math.pow(x - cochonet.x, 2) + Math.pow(y - cochonet.y, 2)
  );
  console.log("Distance to cochonet:", distance);
  if (isTouching) {
    // pattern.value = [Math.max(50, 1000 - distance)];
    if (distance < 20) pattern.value = [200];
    else if (distance < 50) pattern.value = [100];
    else if (distance < 100) pattern.value = [50];
    else return
    vibrate();
  }
});
</script>
