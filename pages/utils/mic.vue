<template>
	<div>
    <h1>Mic</h1>
    <button @click="startMic">Start</button>
    <button @click="stopMic">Stop</button>
    <p>{{ isStarted }}</p>
    <p>{{ stream }}</p>
    <audio ref="audio" muted autoplay controls />
  </div>
</template>

<script setup>
import { useUserMedia } from '@vueuse/core'

const isStarted = ref(false)
const audioStream = ref(null)
const audio = ref(null)
const { stream, start, stop, isSupported } = useUserMedia({
  constraints: {
    audio: true,
    video: false,
  },
})

watch(stream, (newStream) => {
  if (newStream) {
    audioStream.value = newStream
    isStarted.value = true
    audio.value.srcObject = newStream
  } else {
    audioStream.value = null
    isStarted.value = false
    audio.value.srcObject = null
  }
})

const startMic = () => {
  if (isSupported.value) {
    start()
  } else {
    console.error('User media not supported')
  }
}

const stopMic = () => {
  stop()
}
</script>

<style scoped>
div {
  color: white;
}
</style>
