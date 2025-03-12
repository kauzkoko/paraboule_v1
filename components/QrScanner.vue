<template>
  <div>
    <video class="fixed top-0 left-0 w-screen h-screen hidden" ref="videoElem" />
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
    { returnDetailedScanResult: false, highlightScanRegion: false }
  );
  qrScanner.start();
});

onUnmounted(() => {
  qrScanner.stop();
});
</script>
