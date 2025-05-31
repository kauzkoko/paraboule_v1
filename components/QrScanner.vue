<template>
  <div class="fixed top-100px left-0 w-100dvw h-100dvw flex items-center justify-center">
    <div><video class="w-100dvw h-100dvw! aspect-square mix-blend-difference border-rounded-20px! border-solid-10px! border-white!" ref="videoElem" /></div>
  </div>
</template>

<script setup>
import QrScanner from "qr-scanner";
const emit = defineEmits(["qrCodeFound"]);

const videoElem = ref();
const code = ref("");

let qrScanner
onMounted(() => {
  qrScanner = new QrScanner(
    videoElem.value,
    (data) => {
      code.value = data.data;
      emit("qrCodeFound", code.value);
    },
    {
      returnDetailedScanResult: false, highlightScanRegion: true, calculateScanRegion: (video) => ({
        // x: 0,
        // y: 0,
        width: video.videoWidth,
        height: video.videoHeight,
        // downScaledWidth: 300,
        // downScaledHeight: 300
      }),
    }
  );
  qrScanner.start();
});

onUnmounted(() => {
  qrScanner.stop();
  qrScanner.destroy();
});
</script>
