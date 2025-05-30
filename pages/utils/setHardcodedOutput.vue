<template>
    <div>
        <h1>Set Output</h1>
        <button id="myButton" @click="getAudioOutputDevices">Auto-Select PA278QV Device</button>
        <audio ref="audioPlayer" src="/sounds/coinFlip.mp3" preload="auto"></audio>
        <div id="status"></div>
    </div>
</template>

<script setup>
async function getAudioOutputDevices() {
  try {
    // Get permission to access media devices
    // const test = await navigator.mediaDevices.getUserMedia({ audio: true });
    // console.log(test)

    // Enumerate devices
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log(devices)

    // Filter for audio output devices
    const outputDevices = devices.filter(device => device.kind === 'audiooutput');

    // Log them
    outputDevices.forEach(device => {
      console.log(`Label: ${device.label}, ID: ${device.deviceId}`);
    });

    return outputDevices;
  } catch (err) {
    console.error('Error accessing audio devices:', err);
  }
}
</script>

<style scoped>
button {
    margin: 10px 5px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
}

button:hover {
    background-color: #0056b3;
}

#status {
    margin: 20px 0;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 5px;
    border-left: 4px solid #007bff;
}

h1 {
    color: #333;
}
</style>