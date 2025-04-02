<template>
  <div class="w-full h-full text-white">
    <div>alpha: {{ Math.round(alpha) }}</div>
    <div>gamma: {{ Math.round(gamma) }}</div>
    <div>base alpha: {{ Math.round(baseAlpha) }}</div>
    <div>base gamma: {{ Math.round(baseGamma) }}</div>
    <div>relative alpha: {{ Math.round(relativeAlpha) }}</div>
    <div>relative gamma: {{ Math.round(relativeGamma) }}</div>
    <div>mapped relative alpha: {{ Math.round(mappedRelativeAlpha) }}</div>
    <button
      class="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-20"
      @click="setBase()"
    >
      set base
    </button>
  </div>
</template>

<script setup>
const { alpha, gamma } = useDeviceOrientation();
const baseAlpha = ref(0);
const baseGamma = ref(0);
// Computed values for relative orientation
const relativeAlpha = computed(() => {
  // Handle the 0-360 range for alpha values
  let diff = alpha.value - baseAlpha.value;
  // Normalize to ensure we get the shortest path around the circle
  if (diff > 180) {
    diff -= 360;
  } else if (diff < -180) {
    diff += 360;
  }
  return diff;
});

const mappedRelativeAlpha = computed(() => {
  let diff = alpha.value - baseAlpha.value;
  if (diff > 180) {
    diff -= 360;
  } else if (diff < -180) {
    diff += 360;
  }
  const normalized = diff < 0 ? diff + 360 : diff;
  return normalized;
  // Uncomment to map to 0-Math.PI range
  // return (normalized / 360) * Math.PI;
});

const relativeGamma = computed(() => {
  return gamma.value - baseGamma.value;
});

const setBase = () => {
  console.log("Setting base...");
  baseAlpha.value = alpha.value;
  baseGamma.value = gamma.value;
  console.log("Base values set - Alpha:", baseAlpha, "Gamma:", baseGamma);
};
</script>
