<template>
  <div class="fullScreenAll" v-if="store.scannerOpen" @click="onClick()">
    <div>
      <video ref="video" muted autoplay playsinline class="fixed left-0 top-0 h-100dvh w-100dvw" />
    </div>
    <div class="fixed left-0 top-0 pointer-events-none" @click="onClick()">
    </div>
  </div>
</template>

<script setup>
const store = useProtoStore();

const onClick = () => {
  console.log("clicked, close me")
  store.scannerOpen = !store.scannerOpen
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
  enabled.value = store.scannerOpen;
});

watchEffect(async () => {
  if (video.value) {
    video.value.srcObject = stream.value;
  }
});

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
