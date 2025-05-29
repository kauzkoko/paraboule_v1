<template>
    <div>
        <h1>Set Output</h1>
        <button id="myButton">Select Audio Output</button>
        <audio ref="audioPlayer" src="/sounds/coinFlip.mp3" preload="auto"></audio>
    </div>
</template>

<script setup>
const audioPlayer = ref(null)

onMounted(() => {
    document.querySelector("#myButton").addEventListener("click", () => {
        if (!navigator.mediaDevices.selectAudioOutput) {
            console.log("selectAudioOutput() not supported.");
            return;
        }

        // Display prompt and log selected device or error
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
});
</script>

<style scoped></style>