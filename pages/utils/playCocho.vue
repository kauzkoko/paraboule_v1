<template>
  <div class="w-screen h-screen flex justify-center items-center">
    <div>
      <button
        @click="sendPlay"
        class="w-30vw aspect-1 rounded-full bg-hex-ff0000 border-none"
        :style="{ backgroundColor: isPlaying ? 'blue' : 'red' }"
      >
        sendPlayCocho
      </button>
    </div>
  </div>
</template>

<script setup>
const noz = new Audio("/sounds/noz.mp3");

const supabase = useSupabaseClient();
let channel = supabase.channel("sound-controller");

const isPlaying = ref(false);
channel
  .on("broadcast", { event: "playCocho" }, (event) => {
    console.log("received event on vue page: ", event);
    noz.play();
    isPlaying.value = true;
    setTimeout(() => {
      noz.pause();
      noz.currentTime = 0;
      isPlaying.value = false;
    }, event.payload.duration ?? 5000);
  })
  .subscribe();

let sendPlay = () => {
  channel.send({
    type: "broadcast",
    event: "playCocho",
    payload: { duration: 5000 },
  });
};
</script>
