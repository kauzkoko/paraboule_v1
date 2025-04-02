<template>
  <div class="fullScreen flexCenter flex-col text-white">
    <h1>Strudel</h1>
    <div class="flex flex-col gap-4">
      <button id="play">Play</button>
      <button id="stop">Stop</button>
      <button id="eval">Eval</button>
    </div>
  </div>
</template>

<script setup>
const { onLoaded } = useNuxtApp().$scripts.strudel;

onLoaded(() => {
  initStrudel({
    prebake: () => samples("github:tidalcycles/dirt-samples"),
  });

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
</script>

