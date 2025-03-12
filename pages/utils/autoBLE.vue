<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useBluetooth } from '@vueuse/core'

const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b'
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8'

// Use the Bluetooth composable
const { device, isConnected, requestDevice, server, error } = useBluetooth({
  acceptAllDevices: true,
  optionalServices: [SERVICE_UUID],
})

// Store characteristic reference
const characteristic = ref(null)

// Function to connect to the last used device
async function connectToLastDevice() {
  try {
    // Get previously paired Bluetooth devices
    const devices = await navigator.bluetooth.getDevices()
    if (devices.length > 0) {
      const lastDevice = devices[0] // Select the last used device (or modify to your preference)
      console.log("Connecting to last used device:", lastDevice.name)
      device.value = lastDevice
    } else {
      console.log("No paired devices found. Please pair manually.")
    }
  } catch (err) {
    console.error("Error fetching devices:", err)
  }
}

// Watch for connection changes and get the characteristic
watch(isConnected, async (connected) => {
  if (connected && server.value) {
    try {
      const service = await server.value.getPrimaryService(SERVICE_UUID)
      characteristic.value = await service.getCharacteristic(CHARACTERISTIC_UUID)
      console.log('Connected and characteristic found!')
    } catch (err) {
      console.error('Failed to get characteristic:', err)
    }
  }
})

// Function to send data to BLE device
async function sendToBLEDevice(duration) {
  if (!characteristic.value) {
    console.error('No characteristic available. Ensure device is connected.')
    return
  }

  try {
    const encoder = new TextEncoder()
    const value = encoder.encode(duration.toString())
    await characteristic.value.writeValue(value)
    console.log('Sent:', duration)
  } catch (err) {
    console.error('Error sending data:', err)
  }
}

// Computed property for UI feedback
const statusMessage = computed(() => {
  if (isConnected.value) return `Connected to ${device.value?.name}`
  if (error.value) return `Error: ${error.value.message}`
  return 'Not connected'
})

// Attempt to connect to the last used device on mounted
onMounted(() => {
  connectToLastDevice()
})
</script>

<template>
  <div>
    <h2>Bluetooth Connection</h2>
    <p>{{ statusMessage }}</p>
    <button @click="requestDevice">Pair Device</button>
    <button v-if="isConnected" @click="sendToBLEDevice('5')">Send "5"</button>
  </div>
</template>