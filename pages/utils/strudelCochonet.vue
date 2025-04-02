<template>
  <div class="fullScreen flexCenter flex-col text-white">
    <h1>Strudel</h1>
    <div class="flex flex-col gap-4">
      <button id="play">Play</button>
      <button id="stop">Stop</button>
      <button id="eval">Eval</button>
      <button id="sendPlay">Send Play</button>
      <div :style="{ backgroundColor: isPlaying ? 'blue' : 'red' }">
        isplaying: {{ isPlaying }}
      </div>
    </div>
  </div>
</template>

<script setup>
const { onLoaded } = useNuxtApp().$scripts.strudel;

onLoaded(() => {
  initStrudel({
    prebake: () => samples("github:tidalcycles/dirt-samples"),
  });
});

const supabase = useSupabaseClient();
let channel = supabase.channel("sound-controller");

onMounted(() => {
  document
    .getElementById("play")
    .addEventListener("click", () => s("bd sd").play());

  document
    .getElementById("eval")
    .addEventListener("click", () => evaluate('note("c a f e").jux(rev)'));

  document.getElementById("stop").addEventListener("click", () => {
    console.log("stop");
    hush();
    evaluate("hush()");
  });
});

const isPlaying = ref(false);
channel
  .on("broadcast", { event: "playCocho" }, (event) => {
    const duration = event.payload.duration ?? 3000;
    if (isPlaying.value) {
      evaluate("hush()");
      isPlaying.value = false;
    } else {
      isPlaying.value = true;
      evaluate('note("c a f e").jux(rev)');
      setTimeout(() => {
        evaluate("hush()");
        isPlaying.value = false;
      }, duration);
    }
  })
  .subscribe();

let sendPlay = () => {
  channel.send({
    type: "broadcast",
    event: "playCocho",
    payload: {},
  });
};

onUnmounted(() => {
  evaluate("hush()");
});
</script>
