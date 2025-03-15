<template>
  <div
    class="absolute left-0 w-100dvw h-100dvh"
    :style="{ top: isTouching ? '0' : '-40px' }"
  >
    <VirtualAudioSpace
      :isTouching="isTouching"
      :trigger="audioTrigger"
      :selected-boule="store.boulesStepper.index+1"
    />
  </div>
  <VibrationGrid :isTouching="isTouching" @click="isTouching = !isTouching" />
  <div class="outer" ref="el" v-show="!isTouching">
    <div class="container">
      <div
        :ref="refs.set"
        v-for="(item, index) in currentPage"
        :key="index"
        class="grid-item"
        :index="index"
        @click="item.clickFunction()"
        @touchstart="onTouchStart(index, item.explanationSrc)"
        @touchend="onTouchEnd"
        :style="{
          background:
            touchedIndex === index ? 'rgba(255,0,0,.25)' : 'transparent',
          transition:
            touchedIndex === index ? 'background 50ms' : 'background 500ms',
        }"
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
      :index="'pageAnnouncer'"
      @click="onSingleClick"
      @touchstart="onTouchStart('pageAnnouncer')"
      @touchend="onTouchEnd"
      v-on:dblclick.native="onDoubleClick()"
      :style="{
        background:
          touchedIndex === 'pageAnnouncer'
            ? 'rgba(255,0,0,.25)'
            : 'transparent',
        transition:
          touchedIndex === 'pageAnnouncer'
            ? 'background 50ms'
            : 'background 500ms',
      }"
    >
      <div class="text-hex-ff0000 text-38px mt-7px ml--1px">
        {{ (stepperIndex % pages.length) + 1 }}
      </div>
    </div>
    <QrScanner
      v-if="scanForQr"
      :scanForQr="scanForQr"
      @qrCodeFound="onQrCode"
    />
  </div>
</template>

<script setup>
import { Howler } from "howler";

const props = defineProps({
  xrRunning: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["scanCamera"]);
const isTouching = ref(false);

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

const store = useProtoStore();
const bouleFocuser = () => {
  if (store.boulesStepper.isLast) {
    const firstStep = store.boulesStepper.stepNames[0];
    store.boulesStepper.goTo(firstStep);
  } else {
    store.boulesStepper.goToNext();
  }
};

const focusBoulesBefore = () => {
  console.log("focusBoulesBefore");
};

const qr = () => {
  console.log("qr");
};

const pairingStatusAnnouncer = useSoundComposable(
  "/sounds/elevenlabs/click_pairingStatusAnnouncer.mp3"
);
const qrStatus = () => {
  pairingStatusAnnouncer.play();
};

const audioTrigger = ref(0);
let clickTimeout = null;
const { isListening, isFinal, result, start, stop } = useSpeechRecognition();
const onSingleClick = () => {
  if (clickTimeout) {
    console.log("if");
    clearTimeout(clickTimeout);
    clickTimeout = null;
    onDoubleClick();
  } else {
    console.log("else");
    clickTimeout = setTimeout(() => {
      announcePage();
      clickTimeout = null;
    }, 300);
  }
};

const onDoubleClick = () => {
  console.log("onDoubleClick");
  if (clickTimeout) {
    clearTimeout(clickTimeout);
    clickTimeout = null;
  }
  if (isListening.value) {
    useSound("/sounds/strudel/micup.mp3", {
      interrupt: true,
    }).play();
    stop();
    let res = result.value;
    console.log("stop listening", res);
    if (res) {
      if (res.includes("ping jack")) {
        sendPlayCocho();
      }
      if (res.includes("ping shoes")) {
        sendPlayShoes();
      }
      if (res.includes("scan field")) {
        scanCamera();
      }
      if (res.includes("pairing status")) {
        qrStatus();
      }
      if (res.includes("current score")) {
        scoreStandings();
      }
      if (
        res.includes("player one incrementer") ||
        res.includes("increment player one")
      ) {
        incrementPlayer1();
      }
      if (
        res.includes(
          "player two incrementer" || res.includes("increment player two")
        )
      ) {
        incrementPlayer2();
      }
      if (res.includes("announce balls played")) {
        announceBallsPlayed();
      }
      if (res.includes("rewind")) {
        rewind();
      }
      if (res.includes("pirate radar")) {
        startCocho();
      }
      if (res.includes("boomerang")) {
        flyCochoBack();
      }
      if (res.includes("boule focuser")) {
        bouleFocuser();
      }
      if (res.includes("boules before")) {
        focusBoulesBefore();
      }
      if (res.includes("calibrator")) {
        orientation();
      }
      if (res.includes("unique QR")) {
        qr();
      }
      if (res.includes("QR code")) {
        qr();
      }
      if (res.includes("QR scanner")) {
        scanqr();
      }
      if (res.includes("page announcer")) {
        console.log("announcePage");
        announcePage();
      }
      const pageNumber = res.endsWith("page one")
        ? 1
        : res.endsWith("page two")
        ? 2
        : res.endsWith("page three")
        ? 3
        : res.endsWith("page four")
        ? 4
        : res.endsWith("page five")
        ? 5
        : null;
      if (pageNumber >= 1 && pageNumber <= pages.length) {
        stepperIndex = pageNumber - 1;
      }
    }
  } else {
    start();
    console.log("start listening");
    useSound("/sounds/strudel/micdown.mp3", {
      interrupt: true,
    }).play();
  }
};

const players = ref({
  player1: {
    shotsTaken: 0,
  },
  player2: {
    shotsTaken: 0,
  },
});
const { undo } = useRefHistory(players, {
  deep: true,
});
const incrementPlayer1 = () => {
  console.log("incrementPlayer1");
  if (
    players.value.player1.shotsTaken === 3 &&
    players.value.player2.shotsTaken === 3
  ) {
    players.value.player1.shotsTaken = 0;
    players.value.player2.shotsTaken = 0;
  }
  if (players.value.player1.shotsTaken < 3) {
    players.value.player1.shotsTaken++;
  }
};
const incrementPlayer2 = () => {
  console.log("incrementPlayer2");
  if (
    players.value.player2.shotsTaken === 3 &&
    players.value.player1.shotsTaken === 3
  ) {
    players.value.player2.shotsTaken = 0;
    players.value.player1.shotsTaken = 0;
  }
  if (players.value.player2.shotsTaken < 3) {
    players.value.player2.shotsTaken++;
  }
};
const computedNextShot = computed(
  () =>
    players.value.player1.shotsTaken === 3 &&
    players.value.player2.shotsTaken === 3
);
const computedAnnounceBallsPlayedHtml = computed(() => {
  return computedNextShot.value
    ? `<div class='text-40px'>
            <div>Next round?</div>
        </div>`
    : `
        <div class='text-48px'>
          <div>${players.value.player1.shotsTaken} / 3</div><br />
          <div class='h-3px bg-hex-ff0000 w-100%'></div><br/>
          <div>${players.value.player2.shotsTaken} / 3</div>
        </div>`;
});

const { speak } = useSpeech();
const text = ref("");
const announceBallsPlayed = () => {
  console.log("announceBallsPlayed");
  text.value = `Player 1 has played ${players.value.player1.shotsTaken} ${
    players.value.player1.shotsTaken === 1 ? "ball" : "balls"
  }. Player 2 has played ${players.value.player2.shotsTaken} ${
    players.value.player2.shotsTaken === 1 ? "ball" : "balls"
  }. `;
  if (computedNextShot.value) {
    text.value +=
      "Current round is over. Please start a new round by pressing the plus button.";
  }
  speak(text.value);
};

const rewind = () => {
  console.log("rewind");
  undo();
};

const scanForQr = ref(false);
const lastQrCode = ref("");
const onQrCode = (code) => {
  console.log("qrCodeFound", code);
  lastQrCode.value = code;
  scanForQr.value = false;
};

const scanqr = () => {
  console.log("scanqr");
  scanForQr.value = !scanForQr.value;
  setInterval(() => {
    scanForQr.value = false;
  }, 10000);
};

const currentScoreSound = useSoundComposable(
  "/sounds/elevenlabs/click_currentScore.mp3"
);

const scoreStandings = () => {
  console.log("scoreStandings");
  currentScoreSound.play();
};

const pingShoes = () => {
  console.log("pingShoes");
  if (!afterLongPress) {
    sendPlayShoes();
  }
};

const pingPhone = () => {
  console.log("pingPhone");
  if (!afterLongPress) {
    sendPlayPhone();
  }
};

const click_hapticGrid = () => {
  console.log("click_hapticGrid");
  isTouching.value = !isTouching.value;
};

const { sendPlayCocho, sendPlayShoes, sendPlayPhone } = useSoundController();
const { startCircularRotation, flyToCochonetteAndBack } =
  useAnimationController();

const vibrateByIndex = (index) => {
  if (index === 0) vibrateOnce();
  if (index === 1) vibrateTwice();
  if (index === 2) vibrateThrice();
  if (index === 3) vibrateQuadrice();
};

const touchCounter = useState("touchCounter", () => 0);
const touchedIndex = ref(null);
const onTouchStart = (index, explanationSrc) => {
  touchedIndex.value = index;
  audioTrigger.value++;
  console.log("audioTrigger", audioTrigger.value);
  console.log("touchCounter", touchCounter);
  touchCounter.value++;
  // if (explanationSrc && explanationSrc.endsWith("hapticGrid.mp3")) {
  //   isTouching.value = true;
  // }
  vibrateByIndex(index);
};

const onTouchEnd = () => {
  setTimeout(() => {
    touchedIndex.value = null;
  }, 300);
  // isTouching.value = false;
};

const pages = [
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
      imgSrc: "/icons/bouleFocuser.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_bouleFocuser.mp3",
    },
    {
      clickFunction: click_hapticGrid,
      // imgSrc: "/icons/calibrator2.svg",
      html: "Tap to toggle haptic feedback",
      explanationSrc: "/sounds/elevenlabs/explanation_hapticGrid.mp3",
    },
  ],
  [
    {
      clickFunction: qrStatus,
      explanationSrc:
        "/sounds/elevenlabs/explanation_pairingStatusAnnouncer.mp3",
      html: "Pairing-Status:<br />Connected to 3wasds3w2.",
    },
    {
      clickFunction: pingPhone,
      imgSrc: "/icons/pingPhone3.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_pingPhone3.mp3",
    },
    {
      clickFunction: scanqr,
      imgSrc: "/icons/scanQr1.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_qrScanner.mp3",
    },
    {
      clickFunction: qr,
      imgSrc: "/icons/uniqueQr.png",
      explanationSrc: "/sounds/elevenlabs/explanation_uniqueQr.mp3",
    },
  ],
  [
    {
      clickFunction: incrementPlayer1,
      imgSrc: "/icons/plus.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_playerOneIncrementer.mp3",
    },
    {
      clickFunction: incrementPlayer2,
      imgSrc: "/icons/plus.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_playerTwoIncrementer.mp3",
    },
    {
      clickFunction: announceBallsPlayed,
      explanationSrc: "/sounds/elevenlabs/explanation_announceBallsPlayed.mp3",
      html: computedAnnounceBallsPlayedHtml,
    },
    {
      clickFunction: rewind,
      imgSrc: "/icons/rewind.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_rewinder.mp3",
    },
  ],
  [
    {
      clickFunction: orientation,
      imgSrc: "/icons/calibrator2.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_calibrator.mp3",
    },
    {
      clickFunction: focusBoulesBefore,
      imgSrc: "/icons/boulesBefore.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_boulesBefore.mp3",
    },
    {
      clickFunction: orientation,
      // imgSrc: "/icons/calibrator2.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_calibrator.mp3",
    },
    {
      clickFunction: orientation,
      // imgSrc: "/icons/calibrator2.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_calibrator.mp3",
    },
  ],
];
const {
  goToNext,
  goToPrevious,
  goTo,
  stepNames,
  isLast,
  isFirst,
  index: stepperIndex,
  current: currentPage,
} = useStepper(pages);
goToNext();

const pageOneAnnouncer = useSoundComposable(
  "/sounds/elevenlabs/announce_page1.mp3"
);
const pageTwoAnnouncer = useSoundComposable(
  "/sounds/elevenlabs/announce_page2.mp3"
);
const announcePage = () => {
  console.log("announcePage");
  if (stepperIndex % pages.length === 0) {
    pageOneAnnouncer.play();
  } else {
    pageTwoAnnouncer.play();
  }
};

const explanations = pages
  .flat()
  .map((item) => useSoundComposable(item.explanationSrc));

const pageAnnouncerExplanation = useSoundComposable(
  "/sounds/elevenlabs/explanation_pageAnnouncer.mp3"
);
let lastIndex = 0;
const longPressCallback = (e) => {
  afterLongPress = true;
  const index = e.srcElement.getAttribute("index");
  console.log("long press on index", index);

  if (index === "pageAnnouncer") {
    pageAnnouncerExplanation.play();
    lastIndex = "pageAnnouncer";
    return;
  }

  if (!isNaN(index) && index !== null) {
    let explanationIndex =
      (absoluteSelectedPageIndex.value * 4 + parseInt(index)) %
      explanations.length;

    explanations[explanationIndex].play();
    lastIndex = explanationIndex;
  }

  touchCounter.value++;
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
    console.log("onMouseUp");
    Howler.stop();
    setTimeout(() => {
      afterLongPress = false;
    }, 100);
  },
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
    console.log("swiping", direction.value);
    if (direction.value === "right") {
      if (isLast.value) {
        const firstStep = stepNames.value[0];
        goTo(firstStep);
      } else {
        goToNext();
      }
    }
    if (direction.value === "left") {
      console.log(stepperIndex.value === 0);
      if (isFirst.value) {
        const lastStep = stepNames.value[stepNames.value.length - 1];
        goTo(lastStep);
      } else {
        goToPrevious();
      }
    }

    if (stepperIndex.value === 0) vibratePageOne();
    else if (stepperIndex.value === 1) vibratePageTwo();
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
  transition: all 50ms;
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
