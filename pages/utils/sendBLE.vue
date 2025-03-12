<template>
	<div>
		<button @click="sendToBLEDevice(5)">sendToBle</button>
	</div>
</template>

<script setup>
async function sendToBLEDevice(duration) {
    try {
        // Request Bluetooth device
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['4fafc201-1fb5-459e-8fcc-c5c9c331914b']
        });

        // Connect to GATT server
        const server = await device.gatt.connect();
        
        // Get the service
        const service = await server.getPrimaryService('4fafc201-1fb5-459e-8fcc-c5c9c331914b');

        // Get the characteristic
        const characteristic = await service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');

        // Convert string to UTF-8 bytes
        const encoder = new TextEncoder();
        const value = encoder.encode(duration.toString());

        // Write value to characteristic
        await characteristic.writeValue(value);

        console.log("Sent:", duration);
    } catch (error) {
        console.error("Error:", error);
    }
}
</script>