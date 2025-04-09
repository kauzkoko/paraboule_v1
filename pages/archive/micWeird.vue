<template>
  <div>
    <h1>Mic</h1>
    <button @click="startMic">Start</button>
    <button @click="stopMic">Stop</button>
    <p>{{ isStarted }}</p>
    <p>{{ stream }}</p>
    <!-- Remove or keep the audio element as a fallback -->
    <audio ref="audio" autoplay controls />
  </div>
</template>

<script setup>
import { useUserMedia } from "@vueuse/core";
import { Howl } from "howler";

const isStarted = ref(false);
const audioStream = ref(null);
const audio = ref(null);
let mediaRecorder = null;
let audioChunks = [];

const { stream, start, stop, isSupported } = useUserMedia({
  constraints: {
    audio: true,
    video: false,
  },
});

const { x, y } = useMouse();
watch(x, (newVal) => {
  if (sound) {
    const mapped = map(newVal, 0, window.innerWidth, -10, 10);
    sound.pos(mapped, 0, 0);
  }
});

watch(y, (newVal) => {
  if (sound) {
    const mapped = map(newVal, 0, window.innerHeight, -10, 10);
    sound.pos(0, 0, mapped);
  }
});

let sound = null;
watch(stream, (newStream) => {
  if (newStream) {
    console.log("newStream");
    audioStream.value = newStream;
    isStarted.value = true;

    // Create MediaRecorder instance
    mediaRecorder = new MediaRecorder(newStream);
    audioChunks = [];

    // Handle the data available event to collect audio chunks
    mediaRecorder.ondataavailable = (event) => {
      console.log("event", event);
      audioChunks.push(event.data);

      // Create a new blob from the chunks
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and play the Howl instance with the new URL
      sound = new Howl({
        src: [audioUrl],
        format: ["mp3"],
        // html5: true,
        autoplay: true,
        loop: true,
        onend: () => {
          URL.revokeObjectURL(audioUrl); // Clean up the URL when done
        },
      });

      sound.pannerAttr({
        panningModel: "HRTF",
        refDistance: 1,
        rolloffFactor: 1,
        distanceModel: "exponential",
        coneInnerAngle: 360,
        coneOuterAngle: 360,
        coneOuterGain: 1,
        maxDistance: 100,
      });
      sound.pos(30, 0, 10);

      sound.play();
    };

    // Start recording
    mediaRecorder.start(30000); // Collect data every second

    // Keep the audio element updated as fallback
    //   audio.value.srcObject = newStream;
  } else {
    audioStream.value = null;
    isStarted.value = false;
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    audio.value.srcObject = null;
    audioChunks = [];
  }
});

const startMic = () => {
  if (isSupported.value) {
    start();
  } else {
    console.error("User media not supported");
  }
};

const stopMic = () => {
  stop();
};
</script>

<style scoped>
div {
  color: white;
}
</style>
