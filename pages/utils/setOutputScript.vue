<template>
    <div>
        <h1>Set Output Press</h1>
        <audio ref="audioPlayer" src="/sounds/coinFlip.mp3" preload="auto" ></audio>

        <button @click="playAudio">Play Audio</button>
    </div>
</template>

<script setup>
const audioPlayer = ref(null)

onKeyStroke("e", () => {
    navigator.mediaDevices
        .selectAudioOutput()
        .then(async (device) => {
            console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
            await audioPlayer.value.setSinkId(device.deviceId);
            audioPlayer.value.play()
        })
        .catch((err) => {
            console.error(`${err.name}: ${err.message}`);
        });
});

const playAudio = () => {
    audioPlayer.value.play()
}
</script>

<style scoped></style>