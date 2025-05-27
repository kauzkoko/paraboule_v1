<template>
  <TresCanvas window-size alpha>
    <Suspense>
      <PredictionTo3dScene :bouleX="referenceBouleX" />
    </Suspense>
  </TresCanvas>
  <div @click="enabled = !enabled">
    <div>
      <video ref="video" muted autoplay playsinline class="h-100dvh w-100dvw" />
    </div>
  </div>
  <div class="fixed left-0 top-0">
    <div
      class="fixed top-50dvh transform-gpu translate-y--50% bg-yellow transition-all duration-100 opacity-50"
      :style="{
        left: `${referenceBouleX}px`,
        width: `${referenceBouleScale}px`,
        height: `${referenceBouleScale}px`,
      }"
    >
      R
    </div>
    <div
      v-for="(prediction, index) in predictions"
      class="predictions"
      :style="{
        left: prediction.bbox.x / 1 + 'px',
        top: prediction.bbox.y / 1 + 'px',
        width: index === 0 ? '30px' : '15px',
        height: index === 0 ? '30px' : '15px',
        borderColor:
          prediction.class === 'cochonnet'
            ? 'red'
            : prediction.class === 'dark'
            ? '#999'
            : '#eee',
      }"
    >
      <div>{{ index }}</div>
    </div>
  </div>
</template>

<script setup>
import { TresCanvas } from "@tresjs/core";

const { predictFromImage, startWorker } = await useInference();
const store = useProtoStore();
const { modelLoaded, modelWorkerId } = storeToRefs(store);

startWorker();
const video = useTemplateRef("video");
const { width, height } = useWindowSize();
const { stream, enabled } = useUserMedia({
  constraints: reactive({
    video: {
      facingMode: { exact: "environment" }, // Use rear camera
      width: { ideal: height.value },
      height: { ideal: width.value },
      zoom: 1, // Set zoom factor to 1
    },
  }),
});

watchEffect(async () => {
  if (video.value) {
    video.value.srcObject = stream.value;
  }
});

const readyToPredict = computed(() => {
  return video.value && modelLoaded.value && enabled.value;
});

const referenceBoule = ref(null);
const referenceBouleX = ref(null);
const referenceBouleScale = ref(null);
const predictions = ref([]);
const predict = async () => {
  let result = await predictFromImage(video.value);
  if (result && result.length > 0) {
    result.sort((a, b) => b.confidence - a.confidence);
    predictions.value = result;
    referenceBoule.value = result[0];
  }
};

watch(referenceBoule, (newVal) => {
  console.log("referenceBoule", newVal);
  referenceBouleX.value = map(newVal.bbox.x, 0, width.value, -10, 10);
  referenceBouleScale.value = map(newVal.bbox.width, 0, 30, 10, 50);
});

const { pause, resume } = useRafFn(
  () => {
    if (readyToPredict.value) {
      predict();
    }
  },
  { fpsLimit: 5 }
);

onKeyStroke("Escape", () => {
  enabled.value = !enabled.value;
});

const source = shallowRef(0);
setInterval(() => {
  source.value = map(Math.random(), 0, 1, -10, 10);
}, 2000);

const output = useTransition(source, {
  duration: 2000,
});
</script>

<style scoped>
.predictions {
  position: fixed;
  background-color: transparent;
  border-style: solid;
  border-color: #ff0000;
  border-width: 3px;
  border-radius: 50%;
  aspect-ratio: 1;
  width: 15px;
  aspect-ratio: 1;
  height: 15px;
  text-align: center;
  opacity: 1;
  position: flex;
  justify-content: center;
  align-items: center;
  transform: translate(-50%, -50%);
  transition: all 0.2s ease-in-out;
}

canvas {
  pointer-events: none;
}
</style>
