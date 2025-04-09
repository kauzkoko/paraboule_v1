<template>
  <div class="fullScreen flexCenter flex-col text-white">
    <h1>Strudel</h1>
    <div class="flex flex-col gap-4">
      <button ref="fast" id="fast" @click="fastPlay">Fast</button>
      <button ref="medium" id="medium" @click="mediumPlay">Medium</button>
      <button ref="slow" id="slow" @click="slowPlay">Slow</button>
      <button ref="stop" id="stop" @click="stopPlay">Stop</button>
    </div>
  </div>
</template>

<script setup>
const { onLoaded } = useNuxtApp().$scripts.strudel

onLoaded(() => {
  initStrudel();
})

const fast = ref(null);
const medium = ref(null);
const slow = ref(null);

const { x } = useMouse();
const { width } = useWindowSize();
const arrayLength = 14;
watch(x, (newX) => {
  const tempWidth = width.value;
  const mappedX = map(newX, 0, tempWidth, 0, arrayLength);
  const tempArray = new Array(arrayLength).fill(0);
  for (let i = 0; i < 14; i++) {
    if (i < mappedX) {
      tempArray[i] = 1;
    }
  }
  window.maskRef = tempArray.join(" ");
});

const fastPlay = () => {
  evaluate("hush()");
  evaluate(`

  const maskRef = ref(() => window.maskRef)
  note("c d e f g a b b a g f e d c").mask(maskRef).cpm(120).pan(1)

  `);
};

const mediumPlay = () => {
  evaluate("hush()");
  evaluate('note("c d e f g a b b a g f e d c").jux(rev)');
};

const slowPlay = () => {
  evaluate("hush()");
  evaluate('note("c a f e").jux(rev)');
};

const stopPlay = () => {
  evaluate("hush()");
};

onUnmounted(() => {
  evaluate("hush()");
});
</script>
