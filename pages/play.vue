<template>
  <div>
    <div>
      <button @click="send">send xy</button>
    </div>
  </div>
</template>

<script setup>
const noz = new Audio("/sounds/noz.mp3");

const supabase = useSupabaseClient();
let channel = supabase.channel("sound-controller");


channel
  .on("broadcast", { event: "play" }, (event) => {
    console.log("received event on vue page: ", event);
    noz.play();
    setTimeout(() => {
      noz.pause();
      noz.currentTime = 0;
    }, 3000);
  })
  .subscribe();

let send = () => {
  channel.send({
    type: "broadcast",
    event: "play",
  });
};
</script>
