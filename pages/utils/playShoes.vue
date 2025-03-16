<template>
  <div class="w-screen h-screen flex justify-center items-center">
    <div>
      <button
        @click="sendPlay"
        class="w-30vw aspect-1 rounded-full bg-hex-ff0000 border-none"
        :style="{backgroundColor: isPlaying ? 'blue' : 'red'}"
      >
        sendPlayShoes
      </button>
    </div>
  </div>
</template>

<script setup>
const noz = new Audio("/sounds/strudel/startpoint.mp3");

const supabase = useSupabaseClient();
let channel = supabase.channel("sound-controller");

const isPlaying = ref(false);
channel
  .on("broadcast", { event: "playShoes" }, (event) => {
    console.log("received event on vue page: ", event);
    noz.play();
    isPlaying.value = true;
    setTimeout(() => {
      noz.pause();
      noz.currentTime = 0;
      isPlaying.value = false;
    }, 3000);
  })
  .subscribe();

let sendPlay = () => {
  channel.send({
    type: "broadcast",
    event: "playShoes",
    payload: {},
  });
};
</script>
