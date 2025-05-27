<template>
  <div class="w-screen h-screen flex flex-col justify-center items-center">
    <div
      class="circle"
      @click="sendPlay"
      :style="{
        backgroundColor: loadedSounds[soundsCycler.index.value].isPlaying.value
          ? 'blue'
          : 'black',
      }"
      v-touch:swipe="(direction) => onSwipe(direction)"
    >
      <div class="smaller">{{ prevSound }}</div>
      <div>
        {{ soundsCycler.state }}
      </div>
      <div class="smaller">{{ nextSound }}</div>
    </div>
    <div class="fixed bottom-10vh">{{ localDuration }}s</div>
    <div
      class="fixed bottom-0 left-50dvw translate-x--50% w-screen h-100px flexCenter"
    >
      <div class="mr-10px">0s</div>
      <input type="range" v-model="localDuration" min="0" max="20" />
      <div class="ml-10px">20s</div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
let soundController = supabase.channel("sound-controller");

const loadedSounds = [];
soundSrcs.forEach((soundSrc) => {
  loadedSounds.push(useSoundComposable(soundSrc));
});

const soundsCycler = useCycleList(soundSrcs, {
  initialValue: soundSrcs[soundSrcs.length - 4],
});

const prevSound = computed(() => {
  const currentIndex = soundsCycler.index.value;
  const lastIndex = soundSrcs.length - 1;
  if (currentIndex === 0) return soundSrcs[lastIndex];
  return soundSrcs[currentIndex - 1];
});

const nextSound = computed(() => {
  const currentIndex = soundsCycler.index.value;
  const lastIndex = soundSrcs.length - 1;
  if (currentIndex === lastIndex) return soundSrcs[0];
  return soundSrcs[currentIndex + 1];
});

const localDuration = ref(5);
let lastTimeout = null;
soundController
  .on("broadcast", { event: "playCochonnet" }, (event) => {
    console.log(
      "receeiving  playCochonnet event in sound controller: ",
      event.payload.duration
    );
    loadedSounds[soundsCycler.index.value].play();
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }
    lastTimeout = setTimeout(() => {
      loadedSounds[soundsCycler.index.value].stop();
    }, event.payload.duration ?? localDuration.value ?? 5000);
  })
  .subscribe();

let sendPlay = () => {
  loadedSounds[soundsCycler.index.value].play();
  setTimeout(() => {
    loadedSounds[soundsCycler.index.value].stop();
  }, localDuration.value * 1000 ?? 5000);
  soundController.sendPlayCochonnet(localDuration.value * 1000 ?? 5000);
};

const onSwipe = (direction) => {
  console.log("direction: ", direction);
  if (direction === "left") {
    soundsCycler.next();
  } else if (direction === "right") {
    soundsCycler.prev();
  } else if (direction === "top") {
    soundsCycler.next();
  } else if (direction === "bottom") {
    soundsCycler.prev();
  }
};
</script>

<style scoped>
div {
  @apply text-center text-hex-ff0000 text-20px;
}

.circle {
  transition: background-color 0.5s ease-out;
  @apply w-70vw h-70vw rounded-full bg-black border-hex-ff0000 border-3px border-solid flexCenter flex-col;
  .smaller {
    @apply text-center text-hex-ff0000 text-12px opacity-50 py-2;
  }
}

.circle:active {
  background-color: #ff0000 !important;
  transition: background-color 0s;
}

input {
  width: 70dvw;
  -webkit-appearance: none;
  appearance: none;
  background: red;
  cursor: pointer;
  outline: none;
  border-radius: 20px;
  height: 10px;
  border: 1px solid #ff0000;

  /* Change the thumb color to match the design */
  /* background: linear-gradient(to right, #ff0000, blue); */
  /* Create a repeating linear gradient with black and white alternating every 10% */
  background: linear-gradient(
    to right,
    black 0%,
    black 4%,
    white 6%,
    white 10%,
    black 12%,
    black 16%,
    white 18%,
    white 22%,
    black 24%,
    black 28%,
    white 30%,
    white 34%,
    black 36%,
    black 40%,
    white 42%,
    white 46%,
    black 48%,
    black 52%,
    white 54%,
    white 58%,
    black 60%,
    black 64%,
    white 66%,
    white 70%,
    black 72%,
    black 76%,
    white 78%,
    white 82%,
    black 84%,
    black 88%,
    white 90%,
    white 94%,
    black 96%,
    black 100%
  );
}

input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 30px;
  height: 30px;
  background: red;
  border-radius: 20px;
  cursor: pointer;
  border: 2px solid #ff0000;
  box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
}

input::-moz-range-thumb {
  width: 30px;
  height: 30px;
  background: red;
  border-radius: 20px;
  cursor: pointer;
  border: 2px solid #ff0000;
  box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
}

input::-ms-thumb {
  width: 30px;
  height: 30px;
  background: red;
  border-radius: 20px;
  cursor: pointer;
  border: 2px solid #ff0000;
  box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
}
</style>
