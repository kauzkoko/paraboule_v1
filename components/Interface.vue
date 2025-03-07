<template>
  <div class="outer" ref="el" :style="{ bottom: xrRunning ? '0' : '0' }">
    <div class="container" :style="{ height: xrRunning ? '890px' : '890px' }">
      <div
        :ref="refs.set"
        v-for="(item, index) in selectedPage"
        :key="index"
        class="grid-item"
        :index="index + 1"
        @click="item.clickFunction()"
        @touchstart="item.vibrationFunction()"
      >
        <img :src="item.imgSrc" />
      </div>
    </div>
    <div class="center-circle" ref="swiper" index="0">
      <div class="text-hex-ff0000 text-35px mt-1">
        {{ Math.abs(selectedPageIndex) % pages.length }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  xrRunning: {
    type: Boolean,
    required: true,
  },
});

const explanations = [
  new Audio("/sounds/elevenlabs/explanation_pageOne.mp3"),
  new Audio("/sounds/elevenlabs/explanation_scanner.mp3"),
  new Audio("/sounds/elevenlabs/explanation_pinger.mp3"),
  new Audio("/sounds/elevenlabs/explanation_pirateradar.mp3"),
  new Audio("/sounds/elevenlabs/explanation_flytococho.mp3"),
];

let lastIndex = 0;
const longPressCallback = (e) => {
  const index = e.srcElement.getAttribute("index");
  console.log("long press", index);
  explanations[lastIndex].pause();
  explanations[lastIndex].currentTime = 0;
  explanations[index].play();
  lastIndex = index;
};

const refs = useTemplateRefsList();
onLongPress(refs, longPressCallback, {
  modifiers: {
    prevent: true,
  },
});

const { vibrate: vibrateOnce } = useVibrate({ pattern: [50] });
const { vibrate: vibrateTwice } = useVibrate({ pattern: [50, 30, 50] });
const { vibrate: vibrateThrice } = useVibrate({
  pattern: [50, 30, 50, 30, 50],
});
const { vibrate: vibrateQuadrice } = useVibrate({
  pattern: [50, 30, 50, 30, 50, 30, 50],
});

const { vibrate: vibratePageOne } = useVibrate({
  pattern: [100, 20, 50, 20],
});

const { vibrate: vibratePageTwo } = useVibrate({
  pattern: [100, 20, 50, 20, 50, 20],
});

const swiper = useTemplateRef("swiper");
onLongPress(swiper, longPressCallback, {
  modifiers: {
    prevent: true,
  },
});

const { isSwiping, direction } = useSwipe(swiper);
watch(isSwiping, (val) => {
  if (val) {
    if (direction.value === "right") selectedPageIndex.value++;
    if (direction.value === "left") selectedPageIndex.value--;

    // announce the page with a vibration
    if (selectedPageIndex.value % pages.value.length === 0) vibratePageOne();
    else vibratePageTwo();
  }
});

const el = ref(null);
watch(
  () => props.xrRunning,
  (newVal) => {
    if (newVal) {
      el.value.style.opacity = "0";
      setTimeout(() => {
        el.value.style.opacity = "1";
      }, 500);
    }
  }
);

const emit = defineEmits(["scanCamera"]);
const scanCamera = () => {
  emit("scanCamera");
};

const ping = () => {
  sendPlay("ping");
};

const startCocho = () => {
  startCircularRotation();
};

const flyCochoBack = () => {
  flyToCochonetteAndBack();
};

const orientation = () => {
  console.log("orientation");
};

const qr = () => {
  console.log("qr");
};

const focusBoule1 = () => {
  console.log("focusBoule1");
};

const scoreStandings = () => {
  console.log("scoreStandings");
};

const { sendPlay } = useSoundController();
const { startCircularRotation, flyToCochonetteAndBack } =
  useAnimationController();

const selectedPageIndex = ref(0);
const pages = ref([
  [
    {
      clickFunction: scanCamera,
      imgSrc: "/icons/scan.svg",
      vibrationFunction: vibrateOnce,
    },
    {
      clickFunction: ping,
      imgSrc: "/icons/cocho.svg",
      vibrationFunction: vibrateTwice,
    },
    {
      clickFunction: startCocho,
      imgSrc: "/icons/around.svg",
      vibrationFunction: vibrateThrice,
    },
    {
      clickFunction: flyCochoBack,
      imgSrc: "/icons/through.svg",
      vibrationFunction: vibrateQuadrice,
    },
  ],
  [
    {
      clickFunction: orientation,
      imgSrc: "/icons/ns.svg",
      vibrationFunction: vibrateOnce,
    },
    {
      clickFunction: qr,
      imgSrc: "/icons/qr.png",
      vibrationFunction: vibrateTwice,
    },
    {
      clickFunction: focusBoule1,
      imgSrc: "/icons/boule1.svg",
      vibrationFunction: vibrateThrice,
    },
    {
      clickFunction: scoreStandings,
      imgSrc: "/icons/standing.svg",
      vibrationFunction: vibrateQuadrice,
    },
  ],
]);
const selectedPage = computed(
  () => pages.value[Math.abs(selectedPageIndex.value) % pages.value.length]
);
watch(selectedPage, (val) => {
  console.log(val);
});
</script>

<style>
.outer {
  width: 100dvw;
  height: 100dvh;
  display: flex;
  background-color: transparent;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  user-select: none;
  position: fixed;
  left: 0;
  transition: opacity 100ms;
}

.container {
  width: 100%;
  padding: 5px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 5px 5px;
  grid-auto-flow: row;
  grid-template-areas:
    ". ."
    ". .";
  user-select: none;
}

.grid-item {
  border: 3px solid #ff0000;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  pointer-events: auto;
  img {
    pointer-events: none;
    /* width: 90px; */
  }

  &:first-child {
    border-bottom-right-radius: 60px;
  }

  &:nth-child(2) {
    border-bottom-left-radius: 60px;
  }

  &:nth-child(3) {
    border-top-right-radius: 60px;
  }

  &:last-child {
    border-top-left-radius: 60px;
  }
}

.center-circle {
  width: 120px;
  aspect-ratio: 1;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 3px solid red;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
