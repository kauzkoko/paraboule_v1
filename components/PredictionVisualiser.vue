<template>
  <div class="fullScreenAll" v-if="store.predictionVisualiser" @click="onClick()">
    <div>
      <video ref="video" muted autoplay playsinline class="fixed left-0 top-0 h-100dvh w-100dvw" />
    </div>
    <div class="fixed left-0 top-0 pointer-events-none" @click="onClick()">
      <div
        v-for="(prediction, index) in predictions"
        class="predictions"
        :style="{
          left: prediction.bbox.x / 1 + 'px',
          top: prediction.bbox.y / 1 + 'px',
          borderColor:
            prediction.class === 'cochonet'
            ? 'var(--cochonet)'
            : prediction.class === 'dark'
            ? 'var(--light)'
            : 'var(--dark)',
        }"
      >
        <div>{{ index }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { predictFromImage } = await useInference();
const store = useProtoStore();
const { modelLoaded, modelWorkerId } = storeToRefs(store);


const onClick = () => {
  store.predictionVisualiser = !store.predictionVisualiser;
};

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

watchEffect(() => {
  enabled.value = store.predictionVisualiser;
});

watchEffect(async () => {
  if (video.value) {
    video.value.srcObject = stream.value;
  }
});

const readyToPredict = computed(() => {
  return video.value && modelLoaded.value && enabled.value;
});

const predictions = ref([]);
const predict = async () => {
  let result = await predictFromImage(video.value);
  console.log(result);
  predictions.value = result;
};

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
  height: 15px;
  text-align: center;
  opacity: 1;
  position: flex;
  justify-content: center;
  align-items: center;
  transform: translate(-50%, -50%);
  transition: all 0.2s ease-in-out;
}
</style>
