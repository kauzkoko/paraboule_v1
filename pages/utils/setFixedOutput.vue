<template>
    <div>
        <h1>Set Fixed Output</h1>
        <button id="myButton">Set to First Available Device</button>
        <button id="listButton">List All Devices</button>
        <button id="defaultButton">Set to Default</button>
        <audio ref="audioPlayer" src="/sounds/coinFlip.mp3" preload="auto"></audio>
        <div id="status"></div>
        <div id="deviceList"></div>
    </div>
</template>

<script setup>
const audioPlayer = ref(null)

const updateStatus = (message, isError = false) => {
    const status = document.querySelector("#status");
    status.innerHTML = `<p style="color: ${isError ? 'red' : 'green'}">${message}</p>`;
    console.log(message);
}

const getAvailableAudioDevices = async () => {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioOutputs = devices.filter(device => device.kind === 'audiooutput');
        return audioOutputs;
    } catch (err) {
        console.error('Error enumerating devices:', err);
        return [];
    }
}

const setAudioOutput = async (deviceId, deviceLabel = 'Unknown') => {
    try {
        await audioPlayer.value.setSinkId(deviceId);
        updateStatus(`✅ Audio output set to: ${deviceLabel} (ID: ${deviceId})`);
        audioPlayer.value.play();
        return true;
    } catch (err) {
        updateStatus(`❌ Failed to set audio output to ${deviceLabel}: ${err.message}`, true);
        return false;
    }
}

onMounted(() => {
    // Set to first available device
    document.querySelector("#myButton").addEventListener("click", async () => {
        if (!navigator.mediaDevices.selectAudioOutput) {
            updateStatus("❌ selectAudioOutput() not supported in this browser.", true);
            return;
        }

        updateStatus("🔍 Finding available audio devices...");
        
        const devices = await getAvailableAudioDevices();
        
        if (devices.length === 0) {
            updateStatus("❌ No audio output devices found.", true);
            return;
        }

        // Try to set to the first non-default device, or default if only one exists
        let targetDevice = devices.find(device => device.deviceId !== 'default') || devices[0];
        
        const success = await setAudioOutput(targetDevice.deviceId, targetDevice.label);
        
        if (!success && devices.length > 1) {
            // If first device failed, try the default device
            updateStatus("🔄 Trying default device...");
            await setAudioOutput('', 'Default Device');
        }
    });

    // List all devices
    document.querySelector("#listButton").addEventListener("click", async () => {
        updateStatus("🔍 Listing all audio devices...");
        
        const devices = await getAvailableAudioDevices();
        const deviceList = document.querySelector("#deviceList");
        
        if (devices.length === 0) {
            deviceList.innerHTML = '<p style="color: red;">No audio output devices found.</p>';
            return;
        }

        deviceList.innerHTML = '<h3>Available Audio Output Devices:</h3>';
        
        devices.forEach((device, index) => {
            const deviceInfo = document.createElement('div');
            deviceInfo.style.cssText = 'border: 1px solid #ccc; margin: 10px 0; padding: 10px; border-radius: 5px;';
            deviceInfo.innerHTML = `
                <p><strong>Device ${index + 1}:</strong></p>
                <p><strong>Label:</strong> ${device.label || 'Unknown Device'}</p>
                <p><strong>ID:</strong> ${device.deviceId || 'No ID'}</p>
                <button onclick="window.setSpecificDevice('${device.deviceId}', '${device.label || 'Unknown'}')">
                    Use This Device
                </button>
            `;
            deviceList.appendChild(deviceInfo);
        });

        updateStatus(`📋 Found ${devices.length} audio output device(s)`);
    });

    // Set to default device
    document.querySelector("#defaultButton").addEventListener("click", async () => {
        updateStatus("🔄 Setting to default audio device...");
        await setAudioOutput('', 'Default Device');
    });

    // Make function globally available for device buttons
    window.setSpecificDevice = async (deviceId, deviceLabel) => {
        updateStatus(`🔄 Setting audio output to ${deviceLabel}...`);
        await setAudioOutput(deviceId, deviceLabel);
    };

    // Initial status
    updateStatus("Ready! Click a button to set audio output.");
});
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

#deviceList {
    margin-top: 20px;
}

h1 {
    color: #333;
}
</style>