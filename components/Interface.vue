<template>
  <div class="outer" ref="el">
    <div class="container">
      <div
        :ref="refs.set"
        v-for="(item, index) in selectedPage"
        :key="index"
        class="grid-item"
        :index="index"
        @click="item.clickFunction()"
        @touchstart="vibrateByIndex(index)"
      >
        <img
          v-if="item.imgSrc"
          :src="item.imgSrc"
          :style="{ width: item.imgSrc.endsWith('uniqueQr.png') ? '70%' : '' }"
        />
        <div v-else class="text-hex-ff0000 text-20px text-center flex">
          <div v-html="item.html"></div>
        </div>
      </div>
    </div>
    <div
      class="center-circle"
      ref="swiper"
      :index="null"
      @click="announcePage()"
    >
      <div class="text-hex-ff0000 text-35px mt-1">
        {{ (Math.abs(selectedPageIndex) % pages.length) + 1 }}
      </div>
    </div>
    <QrScanner v-if="scanForQr" @qrCodeFound="onQrCode" />
  </div>
</template>

<script setup>
const props = defineProps({
  xrRunning: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["scanCamera"]);

const {
  vibrateOnce,
  vibrateTwice,
  vibrateThrice,
  vibrateQuadrice,
  vibratePageOne,
  vibratePageTwo,
} = useVibrations();

// layout flickering fix
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

// register click functions
const scanCamera = () => {
  if (!afterLongPress) {
    emit("scanCamera");
  }
};

const ping = () => {
  if (!afterLongPress) {
    sendPlayCocho();
  }
};

const startCocho = () => {
  if (!afterLongPress) {
    startCircularRotation();
  }
};

const flyCochoBack = () => {
  if (!afterLongPress) {
    flyToCochonetteAndBack();
  }
};

const orientation = () => {
  console.log("orientation");
};

const bouleFocuser = () => {
  console.log("bouleFocuser");
};

const focusBoulesBefore = () => {
  console.log("focusBoulesBefore");
};

const qr = () => {
  console.log("qr");
};

const qrStatus = () => {
  console.log("qrStatus");
};

// const player1 = ref({
//   shotsTaken: 0,
// });

// const player2 = ref({
//   shotsTaken: 0,
// });

const players = ref({
  player1: {
    shotsTaken: 0,
  },
  player2: {
    shotsTaken: 0,
  },
});

const { history, undo, redo } = useRefHistory(players, {
  deep: true,
});

const incrementPlayer1 = () => {
  console.log("incrementPlayer1");
  if (players.value.player1.shotsTaken > 3 && players.value.player2.shotsTaken === 3) {
    players.value.player1.shotsTaken = 0;
  }
  if (players.value.player1.shotsTaken < 3) {
    players.value.player1.shotsTaken++;
  }
};

const incrementPlayer2 = () => {
  console.log("incrementPlayer2");
  if (players.value.player2.shotsTaken > 3 && players.value.player1.shotsTaken === 3) {
    players.value.player2.shotsTaken = 0;
  }
  if (players.value.player2.shotsTaken < 3) {
    players.value.player2.shotsTaken++;
  }
};

const computedAnnounceBallsPlayedHtml = computed(() => {
  return players.value.player1.shotsTaken === 3 && players.value.player2.shotsTaken === 3
    ? `<div class='text-40px'>
            <div>Next round?</div>
        </div>`
    : `
        <div class='text-40px'>
          <div>${players.value.player1.shotsTaken} / 3</div><br />
          <div class='h-3px bg-hex-ff0000 w-100%'></div><br/>
          <div>${players.value.player2.shotsTaken} / 3</div>
        </div>`;
});


// const incrementPlayer2 = () => {
//   console.log("incrementPlayer2");
//   if (player2.value.shotsTaken === 3 && player1.value.shotsTaken === 3) {
//     player2.value.shotsTaken = 0;
//   }
//   if (player2.value.shotsTaken < 3) {
//     player2.value.shotsTaken++;
//   }
// };

const announceBallsPlayed = () => {
  console.log("announceBallsPlayed");
};

const rewind = () => {
  console.log("rewind");
  undo();
};

const lastQrCode = ref("");
const onQrCode = (code) => {
  console.log("qrCodeFound", code);
  lastQrCode.value = code;
  scanForQr.value = false;
};

const scanForQr = ref(false);
const scanqr = () => {
  console.log("scanqr");
  scanForQr.value = !scanForQr.value;
  setInterval(() => {
    scanForQr.value = false;
  }, 10000);
};

const isSoundPlaying = ref(false);
const currentScoreAudio = new Audio(
  "/sounds/elevenlabs/click_currentScore.mp3"
);
const scoreStandings = () => {
  console.log("scoreStandings");
  if (isSoundPlaying.value) {
    currentScoreAudio.pause();
    currentScoreAudio.currentTime = 0;
    isSoundPlaying.value = false;
  } else if (!afterLongPress) {
    isSoundPlaying.value = true;
    currentScoreAudio.play();
    currentScoreAudio.onended = () => {
      isSoundPlaying.value = false;
    };
  }
};

const pingShoes = () => {
  console.log("pingShoes");
  if (!afterLongPress) {
    sendPlayShoes();
  }
};

const { sendPlayCocho, sendPlayShoes } = useSoundController();
const { startCircularRotation, flyToCochonetteAndBack } =
  useAnimationController();

const vibrateByIndex = (index) => {
  if (index === 0) vibrateOnce();
  if (index === 1) vibrateTwice();
  if (index === 2) vibrateThrice();
  if (index === 3) vibrateQuadrice();
};

const selectedPageIndex = ref(3);
const absoluteSelectedPageIndex = computed(() =>
  Math.abs(selectedPageIndex.value)
);
const pages = ref([
  [
    {
      clickFunction: scanCamera,
      imgSrc: "/icons/scanCamera.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_scanField.mp3",
    },
    {
      clickFunction: ping,
      imgSrc: "/icons/cocho.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_pingCocho.mp3",
    },
    {
      clickFunction: pingShoes,
      imgSrc: "/icons/hoolahoop.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_pingShoes.mp3",
    },
    {
      clickFunction: scoreStandings,
      imgSrc: "/icons/standing.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_currentScore.mp3",
    },
  ],
  [
    {
      clickFunction: startCocho,
      imgSrc: "/icons/around.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_pirateRadar.mp3",
    },
    {
      clickFunction: flyCochoBack,
      imgSrc: "/icons/boomerang.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_boomerang.mp3",
    },
    {
      clickFunction: bouleFocuser,
      imgSrc: "/icons/bouleFocuser11.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_bouleFocuser.mp3",
    },
    {
      clickFunction: focusBoulesBefore,
      imgSrc: "/icons/boulesBefore.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_boulesBefore.mp3",
    },
  ],
  [
    {
      clickFunction: orientation,
      imgSrc: "/icons/ns.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_orientation.mp3",
    },
    {
      clickFunction: qrStatus,
      // imgSrc: "/icons/qrStatus.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_qrStatus.mp3",
      html: "QR-Status:<br />Connected to 3wasds3w2.",
    },
    {
      clickFunction: qr,
      imgSrc: "/icons/uniqueQr.png",
      explanationSrc: "/sounds/elevenlabs/explanation_uniqueQr.mp3",
    },
    {
      clickFunction: scanqr,
      imgSrc: "/icons/scanqr.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_qrScanner.mp3",
    },
  ],
  [
    {
      clickFunction: incrementPlayer1,
      imgSrc: "/icons/plus.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_incrementPlayer1.mp3",
    },
    {
      clickFunction: incrementPlayer2,
      imgSrc: "/icons/plus.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_incrementPlayer2.mp3",
    },
    {
      clickFunction: announceBallsPlayed,
      explanationSrc: "/sounds/elevenlabs/explanation_announceBallsPlayed.mp3",
      html: computedAnnounceBallsPlayedHtml,
    },
    {
      clickFunction: rewind,
      imgSrc: "/icons/rewind.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_rewind.mp3",
    },
  ],
]);

let pageAnnouncerExplanation = new Audio(
  "/sounds/elevenlabs/explanation_pageAnnouncer.mp3"
);
const explanations = pages.value
  .flat()
  .map((item) => new Audio(item.explanationSrc));
console.log(explanations);

let announcePageAudioArray = [];
for (let i = 1; i <= pages.value.length; i++) {
  announcePageAudioArray.push(
    new Audio(`/sounds/elevenlabs/announce_page${i}.mp3`)
  );
}

const isAnnouncingPage = ref(false);
const announcePage = () => {
  console.log("announcePage", announcePageAudioArray);

  if (!afterLongPress && !isAnnouncingPage.value) {
    announcePageAudioArray[
      absoluteSelectedPageIndex.value % announcePageAudioArray.length
    ].play();
    isAnnouncingPage.value = true;
  } else if (isAnnouncingPage.value) {
    announcePageAudioArray[
      absoluteSelectedPageIndex.value % announcePageAudioArray.length
    ].pause();
    announcePageAudioArray[
      absoluteSelectedPageIndex.value % announcePageAudioArray.length
    ].currentTime = 0;
    isAnnouncingPage.value = false;
  }
};

let lastIndex = 0;
const longPressCallback = (e) => {
  afterLongPress = true;
  const index = e.srcElement.getAttribute("index");
  console.log("long press on index", index);

  if (!index) {
    pageAnnouncerExplanation.play();
    lastIndex = null;
    return;
  }

  let explanationIndex = absoluteSelectedPageIndex.value * 4 + parseInt(index);
  console.log("explanationIndex", explanationIndex);

  if (lastIndex) {
    explanations[lastIndex].pause();
    explanations[lastIndex].currentTime = 0;
  } else {
    pageAnnouncerExplanation.pause();
    pageAnnouncerExplanation.currentTime = 0;
  }

  explanations[explanationIndex].play();
  lastIndex = explanationIndex;
};

let afterLongPress = false;
const refs = useTemplateRefsList();
onLongPress(refs, longPressCallback, {
  delay: 300,
  modifiers: {
    prevent: true,
  },
  // distanceThreshold: 5,
  onMouseUp: () => {
    explanations[lastIndex].pause();
    explanations[lastIndex].currentTime = 0;
    setTimeout(() => {
      afterLongPress = false;
    }, 100);
  },
});

const selectedPage = computed(
  () => pages.value[absoluteSelectedPageIndex.value % pages.value.length]
);
watch(selectedPage, (val) => {
  console.log(val);
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
  bottom: 0;
}

.container {
  height: 98dvh;
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
  overflow: hidden;
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
  width: 110px;
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
