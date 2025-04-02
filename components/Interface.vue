<template>
  <div class="absolute left-0 w-100dvw h-100dvh" @click="onFullscreenClick()">
    <VirtualAudioSpace :trigger="audioTrigger"></VirtualAudioSpace>
  </div>
  <div
    class="outer"
    v-show="store.isTouchingSlider"
    @click="onClickSliderComponent"
  >
    <div class="container">
      <div class="big">
        <div v-show="!store.isTappingOnSlider">
          <div>
            Press and hold while sliding your finger vertically on the screen to
            navigate through the scene. A single tap will exit.
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="outer"
    v-show="store.isTouchingTopCameraSlider"
    @click="onClickTopCameraSliderComponent"
  >
    <div class="container">
      <div class="big">
        <div v-show="!store.isTappingOnTopCameraSlider">
          <div>
            Press and hold while sliding your finger vertically on the screen to
            set height of camera. A single tap will exit.
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="outer"
    v-show="store.isTouchingHaptic"
    @click="onClickHapticGridComponent"
  >
    <div class="container">
      <div class="big">
        <div v-show="!store.isTappingOnHaptic">
          <div>
            Tap, hold and move across the screen to navigate. Tap once to exit.
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="outer pointer-events-none" v-show="store.predictionVisualiser">
    <div class="container">
      <div class="big">
        <div v-show="!store.predictionVisualiser">
          <div>Tap once to exit.</div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="outer"
    ref="el"
    v-show="
      !store.isTouchingHaptic &&
      !store.isTouchingSlider &&
      !store.isTouchingTopCameraSlider &&
      !store.predictionVisualiser
    "
  >
    <div class="container">
      <template
        v-for="(item, index) in currentPage"
        :key="'grid-item-' + index"
      >
        <div
          :ref="refs.set"
          class="grid-item"
          :index="getIndex(item)"
          @touchend="onTouchEnd"
          v-touch:swipe="(dir, e) => onSwipe(dir, e, index, item)"
          @click="onClick(item, index)"
          @touchstart="onTouchStart(index)"
          :style="{
            background:
              touchedIndex === index ? 'rgba(255,0,0,.25)' : 'transparent',
            transition:
              touchedIndex === index ? 'background 50ms' : 'background 500ms',
            opacity: getItem(item).deactivated
              ? getItem(item).deactivated.value
                ? 0.5
                : 1
              : 1,
          }"
        >
          <div
            class="absolute text-hex-ff0000 text-12px px-2 py-2"
            :class="{
              'top-0 left-0': index === 0,
              'top-0 right-0': index === 1,
              'bottom-0 left-0': index === 2,
              'bottom-0 right-0': index === 3,
            }"
          >
            {{ getItem(item).name }}
          </div>
          <div class="flex justify-center items-center w-full h-full">
            <img
              v-if="getItem(item).imgSrc"
              :src="getItem(item).imgSrc.value ?? getItem(item).imgSrc"
            />
            <div
              v-else-if="getItem(item).html"
              class="text-hex-ff0000 text-20px text-center flexCenter max-w-80%"
            >
              <div
                v-html="getItem(item).html.value ?? getItem(item).html"
              ></div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div
      class="center-circle"
      ref="swiper"
      :index="'pageAnnouncer'"
      @click="onSingleClick"
      @touchstart="onTouchStart('pageAnnouncer')"
      @touchend="onTouchEnd"
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
      <div class="text-hex-ff0000 text-38px" :index="'pageAnnouncer'">
        {{ stepperIndex + 1 }}
      </div>
    </div>
    <QrScanner
      v-if="scanForQr"
      :scanForQr="scanForQr"
      @qrCodeFound="onQrCode"
    ></QrScanner>
  </div>
  <Slider
    @click="onClickSliderComponent"
    @touchstart="onTappingOnSlider"
    @touchend="onTappingOnSlider"
  />
  <TopCameraSlider
    @click="onClickToggleTopCameraSliderComponent"
    @touchstart="onTappingOnTopCameraSlider"
    @touchend="onTappingOnTopCameraSlider"
  />
  <VibrationGrid
    @click="onClickHapticGridComponent"
    @touchstart="onTappingOnHaptic"
    @touchend="onTappingOnHaptic"
  ></VibrationGrid>
  <PredictionVisualiser></PredictionVisualiser>
</template>

<script setup>
import { Howler } from "howler";
import { useQRCode } from "@vueuse/integrations/useQRCode";

const store = useProtoStore();
const { speak } = useSpeech();
const bus = useEventBus("protoboules");
const { sendRawIntersections } = useXrController();

const onTappingOnHaptic = () => {
  store.isTappingOnHaptic = !store.isTappingOnHaptic;
};

const onTappingOnSlider = () => {
  console.log("onTappingOnSlider");
  store.isTappingOnSlider = !store.isTappingOnSlider;
  // if (!store.isTappingOnSlider) {
  //   // flyToStart();
  // }
};

const onTappingOnTopCameraSlider = () => {
  store.isTappingOnTopCameraSlider = !store.isTappingOnTopCameraSlider;
};

const {
  vibrateOnce,
  vibrateTwice,
  vibrateThrice,
  vibrateQuadrice,
  vibratePageOne,
  vibratePageTwo,
  vibratePageThree,
  vibratePageFour,
  vibratePageFive,
  vibratePageSix,
  vibratePageSeven,
  vibratePageEight,
  vibratePageNine,
  vibratePageTen,
  vibratePageEleven,
  vibratePageTwelve,
} = useVibrations();

const { sendPlayCocho, sendPlayShoes, sendPlayPhone } = useSoundController({
  listen: true,
});
const {
  startCircularRotation,
  flyToCochonetAndBack,
  stalefish180,
  lookAlongNegativeXAxis,
  lookAlongPositiveXAxis,
  lookAlongPositiveZAxis,
  lookAlongNegativeZAxis,
  flyToCochonet,
  flyToStart,
  toggleTopCamera,
} = useAnimationController();

// layout flickering fix
const el = ref(null);
watch(
  () => store.xrRunning,
  (newVal) => {
    if (newVal) {
      el.value.style.opacity = "0";
      setTimeout(() => {
        el.value.style.opacity = "1";
      }, 500);
    }
  }
);

const onSwipe = (direction, e, index, item) => {
  if (direction === "right") {
    currentPage.value[index].cycler.next();
  } else if (direction === "left") {
    currentPage.value[index].cycler.prev();
  } else if (direction === "bottom") {
    if (currentPage.value[index].name === "Ping Cochonet") refreshPage();
    else if (currentPage.value[index].name === "Change player 1 audio") {
      store.players.player1.audioCycler.prev();
    } else if (currentPage.value[index].name === "Change player 2 audio") {
      store.players.player2.audioCycler.prev();
    } else if (currentPage.value[index].name === "Change YOLO model") {
      store.yoloModelCycler.prev();
    }
  } else if (direction === "top") {
    if (currentPage.value[index].name === "Change player 1 audio") {
      store.players.player1.audioCycler.next();
    } else if (currentPage.value[index].name === "Change player 2 audio") {
      store.players.player2.audioCycler.next();
    } else if (currentPage.value[index].name === "Change YOLO model") {
      store.yoloModelCycler.next();
    }
  }
};

const setAlphaController = () => {
  store.alphaController = !store.alphaController;
  store.baseAlpha = store.gyroAlpha;
  console.log("in setAlphaController", store.alphaController);
};

const onFullscreenClick = () => {
  if (store.alphaController) {
    store.alphaController = false;
    flyToStart();
  }
  console.log("in onFullscreenClick", store.alphaController);
};

// register click functions
const scanCamera = () => {
  if (!afterLongPress) {
    if (store.arSupported) {
      if (store.xrRunning) {
        bus.emit("stopXR");
      } else if (store.modelLoaded) {
        bus.emit("startXR");
      }
    } else {
      console.log("AR not supported");
      speak("AR not supported");
    }
  }
};

const scanForPoints = () => {
  if (!afterLongPress) {
    if (store.xrRunning) {
      bus.emit("stopXR");
      store.isScanningForPoints = false;
      setTimeout(() => {
        store.setScoreFromPoints();
      }, 100);
    } else if (store.modelLoaded) {
      bus.emit("startXR");
      store.isScanningForPoints = true;
    }
  }
};

const setPointsFromLatestScan = () => {
  console.log("setPointsFromLatestScan");
  store.setScoreFromPoints();
};

const click_pingCochonet = () => {
  if (!afterLongPress) {
    sendPlayCocho(5000);
  }
};

const startCocho = () => {
  if (!afterLongPress) {
    startCircularRotation();
  }
};

const flyCochoBack = () => {
  if (!afterLongPress) {
    flyToCochonetAndBack();
  }
};

const click_flyToCochonet = () => {
  if (!afterLongPress) {
    flyToCochonet();
  }
};

const click_stalefish180 = () => {
  if (!afterLongPress) {
    stalefish180();
  }
};

const click_bouleFocuser = (bouleIndex) => {
  store.volume = 1;
  store.focusBoules(bouleIndex);
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
    clearTimeout(clickTimeout);
    clickTimeout = null;
    onDoubleClick();
  } else {
    clickTimeout = setTimeout(() => {
      announcePage();
      clickTimeout = null;
    }, 300);
  }
};

const micDown = new Audio("/sounds/strudel/micdown.mp3");
const micUp = new Audio("/sounds/strudel/micup.mp3");
watch(isListening, () => {
  if (!isListening.value) {
    let compare = result.value.toLowerCase();
    console.log("compare", compare);
    switch (compare) {
      case "page 1":
      case "page one":
      case "h1":
        goTo(stepNames.value[0]);
        break;
      case "page 2":
      case "page two":
      case "h2":
        goTo(stepNames.value[1]);
        break;
      case "page 3":
      case "page three":
      case "h3":
        goTo(stepNames.value[2]);
        break;
      case "page 4":
      case "page four":
      case "h4":
        goTo(stepNames.value[3]);
        break;
      case "page 5":
      case "page five":
      case "h5":
        goTo(stepNames.value[4]);
        break;
      case "page 6":
      case "page six":
      case "h6":
        goTo(stepNames.value[5]);
        break;
      case "scan camera":
      case "scan field":
      case "scan the field":
        scanCamera();
        break;
      case "scan qr":
      case "scan qr code":
      case "scan the qr code":
        scanqr();
        break;
      case "ping the field":
        ping();
        break;
      case "ping the shoes":
      case "ping the hoop":
      case "ping the hoolahoop":
        pingShoes();
        break;
      case "ping the phone":
        pingPhone();
        break;
      case "score standings":
      case "tell the score":
        scoreStandings();
        break;
      case "boule focuser":
      case "focus all":
        click_bouleFocuser("all");
        break;
      case "focus the ball 1":
      case "focus ball 1":
      case "focus ball one":
      case "focus the ball one":
      case "focus the first ball":
        click_bouleFocuser(1);
        break;
      case "focus the ball 2":
      case "focus ball 2":
      case "focus ball two":
      case "focus the second ball":
        click_bouleFocuser(2);
        break;
      case "focus the ball 3":
      case "focus ball 3":
      case "focus ball three":
      case "focus the third ball":
        click_bouleFocuser(3);
        break;
      case "focus the ball 4":
      case "focus ball 4":
      case "focus ball four":
      case "focus ball for":
      case "focus the fourth ball":
        click_bouleFocuser(4);
        break;
      case "focus the ball 5":
      case "focus ball 5":
      case "focus ball five":
      case "focus the fifth ball":
        click_bouleFocuser(5);
        break;
      case "focus the ball 6":
      case "focus ball 6":
      case "focus ball six":
      case "focus the sixth ball":
        click_bouleFocuser(6);
        break;
      case "fly to center and back":
      case "fly to center":
        flyToCochonetAndBack();
        break;
      case "fly to other side and back":
      case "fly to other side":
        stalefish180();
        break;
      case "Haptic grid":
      case "toggle haptic":
      case "toggle haptic feedback":
      case "toggle haptics":
        click_hapticGridNear();
        break;
      default:
        console.log("default", result.value);
        setTimeout(() => {
          micDown.play();
        }, 500);
        return;
    }
    // setTimeout(() => {
    //   micUp.play();
    // }, 500);
  }
});

const onDoubleClick = () => {
  console.log("onDoubleClick");
  if (clickTimeout) {
    clearTimeout(clickTimeout);
    clickTimeout = null;
  }
  if (!isListening.value) {
    start();
    console.log("start listening");
  }
};

const incrementPlayer1 = () => {
  console.log("incrementPlayer1");
  store.incrementPlayer1shotsTaken();
};
const incrementPlayer2 = () => {
  console.log("incrementPlayer2");
  store.incrementPlayer2shotsTaken();
};

const isNextRound = computed(() => {
  return (
    store.players.player1.shotsTaken === 3 &&
    store.players.player2.shotsTaken === 3
  );
});

const computedAnnounceBallsPlayedHtml = computed(() => {
  return isNextRound.value
    ? `<div class='text-40px'>
            <div>Next round?</div>
        </div>`
    : `
        <div class='text-48px'>
          <div>${store.players.player1.shotsTaken} / 3</div><br />
          <div class='h-3px bg-hex-ff0000 w-100%'></div><br/>
          <div>${store.players.player2.shotsTaken} / 3</div>
        </div>`;
});

const computedScoreStandingsHtml = computed(() => {
  return `
    <div class='text-48px'>
      <div>${store.players.player1.score} / 13</div><br />
      <div class='h-3px bg-hex-ff0000 w-100%'></div><br/>
      <div>${store.players.player2.score} / 13</div>
    </div>`;
});
const text = ref("");
const announceBallsPlayed = () => {
  console.log("announceBallsPlayed");
  text.value = `Player 1 has played ${store.players.player1.shotsTaken} ${
    store.players.player1.shotsTaken === 1 ? "ball" : "balls"
  }. Player 2 has played ${store.players.player2.shotsTaken} ${
    store.players.player2.shotsTaken === 1 ? "ball" : "balls"
  }. `;
  if (isNextRound.value) {
    text.value +=
      "Current round is over. Please start a new round by pressing the plus button.";
  }
  speak(text.value);
};

const rewind = () => {
  console.log("rewind");
  store.undoPlayers();
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

const scoresSounds = [];
for (let i = 0; i <= 13; i++) {
  for (let j = 0; j <= 13; j++) {
    scoresSounds.push(
      useSoundComposable(`/sounds/elevenlabs/scores/${i}_${j}.mp3`)
    );
  }
}

const scoreStandings = () => {
  console.log("scoreStandings");
  const index = store.players.player1.score * 14 + store.players.player2.score;
  scoresSounds[index].play();
};

const pingShoes = () => {
  console.log("pingShoes");
  if (!afterLongPress) {
    sendPlayShoes();
  }
};

const pingPhone = () => {
  if (!afterLongPress) {
    sendPlayPhone(7);
  }
};

const refreshPage = () => {
  console.log("refreshPage");
  window.location.reload();
};

const onClickSliderComponent = () => {
  console.log("onClickSliderComponent");
  store.isTouchingSlider = !store.isTouchingSlider;
};

const click_slider = () => {
  console.log("click_slider");
  store.isTouchingSlider = !store.isTouchingSlider;
};

const onClickToggleTopCameraSliderComponent = () => {
  store.isTouchingTopCameraSlider = !store.isTouchingTopCameraSlider;
  if (!store.isTouchingTopCameraSlider) {
    toggleTopCamera();
  }
};

const click_toggleFixedTopCamera = () => {
  toggleTopCamera({ broadcast: true, height: 100 });
};

const click_toggleTopCameraSlider = () => {
  console.log("click_toggleTopCamera");
  store.isTouchingTopCameraSlider = !store.isTouchingTopCameraSlider;
  toggleTopCamera();
};

const onClickTopCameraSliderComponent = () => {
  if (store.isTouchingTopCameraSlider) {
    toggleTopCamera();
  }
  store.isTouchingTopCameraSlider = !store.isTouchingTopCameraSlider;
};

const onClickHapticGridComponent = () => {
  store.isTouchingHaptic = !store.isTouchingHaptic;
};

const click_hapticGridNear = () => {
  store.currentHapticGrid = "near";
  store.isTouchingHaptic = !store.isTouchingHaptic;
};

const click_hapticGridMedium = () => {
  store.currentHapticGrid = "medium";
  store.isTouchingHaptic = !store.isTouchingHaptic;
};

const click_hapticGridFar = () => {
  store.currentHapticGrid = "far";
  store.isTouchingHaptic = !store.isTouchingHaptic;
};

const click_mute = () => {
  console.log("click_mute");
  Howler.stop();
  store.toggle3dAudio();
  window.speechSynthesis.cancel();
};

const addFunction = () => {
  console.log("addFunction");
  // TODO: add add function
};

const url = ref("asdfdsadf");
const qrcode = useQRCode(url.value, {
  margin: 1,
  width: 110,
  color: {
    dark: "#ff0000",
    light: "#000000",
  },
});

const computedUniqueQrHtml = computed(() => {
  return `
    <div class='text-48px'>
      <div>${lastQrCode.value}</div>
    </div>`;
});

const coinImgSrc = ref("/icons/gsicht.svg");
const tossCoin = () => {
  const totalTime = 2000;
  const count = 5;
  coinImgSrc.value = "/icons/fragezeichen.svg";
  setTimeout(() => {
    // for (let i = 1; i < count; i++) {
    //   setTimeout(() => {
    //     coinImgSrc.value = "/icons/fragezeichen" + (i + 1) + ".svg";
    //     console.log("coinImgSrc", coinImgSrc.value);
    //   }, (totalTime / count) * i);
    // }
    coinImgSrc.value =
      Math.random() < 0.5 ? "/icons/gsicht.svg" : "/icons/zahl.svg";
  }, totalTime);
};

const vibrateByIndex = (index) => {
  if (index === 0) vibrateOnce();
  if (index === 1) vibrateTwice();
  if (index === 2) vibrateThrice();
  if (index === 3) vibrateQuadrice();
};

const touchedIndex = ref(null);
const onTouchStart = (index) => {
  touchedIndex.value = index;
  audioTrigger.value++;
  store.touchCounter++;
  vibrateByIndex(index);
};

const onTouchEnd = () => {
  setTimeout(() => {
    touchedIndex.value = null;
  }, 300);
};

const pages = [
  [
    {
      name: "Ping Cochonet",
      clickFunction: click_pingCochonet,
      imgSrc: "/icons/cocho.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_pingCocho.mp3",
      cycler: useCycleList(["Ping Cochonet", "Ping Startpoint"]),
      modes: ["All", "Dev", "Testing", "Player"],
    },
    {
      name: "Scan Field",
      deactivated: computed(() => !store.arSupported),
      clickFunction: scanCamera,
      imgSrc: "/icons/scanCamera.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_scanField.mp3",
      cycler: useCycleList([
        "Scan Field",
        "Toggle Top Camera Slider",
        "Scan and count points",
        "Set points from latest scan",
      ]),
      modes: ["All", "Dev", "Testing", "Player"],
    },
    {
      name: "Alpha Controller",
      clickFunction: setAlphaController,
      imgSrc: "/icons/gyros.svg",
      html: "Toggle Alpha Controller",
      cycler: useCycleList([
        "Alpha Controller",
        "Slider",
        "Show Stunden Orientation",
      ]),
      modes: ["All", "Dev", "Testing", "Player"],
    },
    {
      name: "Focus All Boules",
      deactivated: computed(() => store.boulesCount < 1),
      clickFunction: () => click_bouleFocuser("all"),
      imgSrc: "/icons/focusAll.svg",
      html: "Focus all Boules",
      cycler: useCycleList([
        "Focus All Boules",
        "Focus Boule 1",
        "Focus Boule 2",
        "Focus Boule 3",
        "Focus Boule 4",
        "Focus Boule 5",
        "Focus Boule 6",
      ]),
      modes: ["All", "Dev", "Testing", "Player"],
    },
  ],
  [
    {
      name: "Score Standings",
      clickFunction: scoreStandings,
      html: computedScoreStandingsHtml,
      explanationSrc: "/sounds/elevenlabs/explanation_currentScore.mp3",
      cycler: useCycleList(["Score Standings"]),
      modes: ["All", "Dev", "Testing", "Player"],
    },
    {
      name: "Scan and count points",
      clickFunction: scanForPoints,
      html: "Scan and count points",
      cycler: useCycleList([
        "Scan and count points",
        "Set points from latest scan",
        "Scan field",
      ]),
      modes: ["All", "Dev", "Testing"],
    },
    {
      name: "Set points from latest scan",
      clickFunction: setPointsFromLatestScan,
      html: "Set points from latest scan",
      cycler: useCycleList([
        "Set points from latest scan",
        "Scan and count points",
      ]),
      modes: ["All", "Dev", "Testing"],
    },
    {
      name: "Increment shots taken",
      clickFunction: () => {
        if (store.globalShotsTaken < 7) {
          store.globalShotsTaken++;
        } else {
          store.resetShotsTaken();
        }
      },
      html: computed(() =>
        store.globalShotsTaken < 7
          ? store.globalShotsTaken
          : "Reset shots taken"
      ),
      cycler: useCycleList(["Increment shots taken"]),
      modes: ["All", "Dev", "Testing"],
    },
  ],
  [
    {
      name: "Player 1 Shot Incrementer",
      clickFunction: incrementPlayer1,
      imgSrc: "/icons/plus.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_playerOneIncrementer.mp3",
      cycler: useCycleList([
        "Player 1 Shot Incrementer",
        "Player 2 Shot Incrementer",
      ]),
      modes: ["All", "Dev", "Testing"],
    },
    {
      name: "Player 2 Shot Incrementer",
      clickFunction: incrementPlayer2,
      imgSrc: "/icons/plus.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_playerTwoIncrementer.mp3",
      cycler: useCycleList([
        "Player 2 Shot Incrementer",
        "Player 1 Shot Incrementer",
      ]),
      modes: ["All", "Dev", "Testing"],
    },
    {
      name: "Announce Balls Played",
      clickFunction: announceBallsPlayed,
      explanationSrc: "/sounds/elevenlabs/explanation_ballsShotAnnouncer.mp3",
      html: computedAnnounceBallsPlayedHtml,
      cycler: useCycleList(["Announce Balls Played", "Rewind"]),
      modes: ["All", "Dev", "Testing"],
    },
    {
      name: "Rewind",
      clickFunction: rewind,
      imgSrc: "/icons/rewind.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_rewinder.mp3",
      cycler: useCycleList(["Rewind", "Announce Balls Played"]),
      modes: ["All", "Dev", "Testing"],
    },
  ],
  [
    {
      name: "Pirate Radar",
      clickFunction: startCocho,
      imgSrc: "/icons/around.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_pirateRadar.mp3",
      cycler: useCycleList(["Pirate Radar", "Boomerang", "Stalefish 180"]),
      modes: ["All", "Dev", "Testing"],
    },
    {
      name: "Boomerang",
      clickFunction: flyCochoBack,
      imgSrc: "/icons/boomerang1.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_boomerang.mp3",
      cycler: useCycleList(["Boomerang", "Pirate Radar"]),
      modes: ["All", "Dev", "Testing"],
    },
    {
      name: "Look along 12 o'clock",
      clickFunction: lookAlongNegativeZAxis,
      html: "Look along 12 o'clock",
      imgSrc: "/icons/12oclock.svg",
      cycler: useCycleList([
        "Look along 12 o'clock",
        "Look along 9 o'clock",
        "Look along 3 o'clock",
        "Look along 6 o'clock",
      ]),
      modes: ["All", "Dev", "Testing"],
    },
    {
      name: "Haptic grid far",
      clickFunction: click_hapticGridFar,
      html: "Haptic grid far",
      explanationSrc: "/sounds/elevenlabs/explanation_hapticGrid.mp3",
      cycler: useCycleList([
        "Haptic grid far",
        "Haptic grid medium",
        "Haptic grid near",
      ]),
      modes: ["All", "Dev", "Testing", "Player"],
    },
  ],
  [
    {
      name: "Look along 12 o'clock",
      clickFunction: lookAlongNegativeZAxis,
      html: "Look along 12 o'clock",
      imgSrc: "/icons/12oclock.svg",
      cycler: useCycleList([
        "Look along 12 o'clock",
        "Look along 9 o'clock",
        "Look along 3 o'clock",
        "Look along 6 o'clock",
      ]),
      modes: ["All", "Dev", "Testing"],
    },
    {
      name: "Look along 3 o'clock",
      clickFunction: lookAlongPositiveXAxis,
      html: "Look along 3 o'clock",
      imgSrc: "/icons/lookAlong3.svg",
      cycler: useCycleList([
        "Look along 3 o'clock",
        "Look along 9 o'clock",
        "Look along 12 o'clock",
        "Look along 6 o'clock",
      ]),
      modes: ["All", "Dev", "Testing"],
    },
    {
      name: "Look along 9 o'clock",
      clickFunction: lookAlongNegativeXAxis,
      html: "Look along 9 o'clock",
      imgSrc: "/icons/lookAlong9.svg",
      cycler: useCycleList([
        "Look along 9 o'clock",
        "Look along 3 o'clock",
        "Look along 12 o'clock",
        "Look along 6 o'clock",
      ]),
      modes: ["All", "Dev", "Testing"],
    },
    {
      name: "Look along 6 o'clock",
      clickFunction: lookAlongPositiveZAxis,
      html: "Look along 6 o'clock",
      imgSrc: "/icons/6oclock.svg",
      cycler: useCycleList([
        "Look along 6 o'clock",
        "Look along 12 o'clock",
        "Look along 9 o'clock",
        "Look along 3 o'clock",
      ]),
      modes: ["All", "Dev", "Testing"],
    },
  ],
  [
    {
      name: "Toggle Top Camera Slider",
      clickFunction: click_toggleTopCameraSlider,
      html: "Toggle Top Camera Slider",
      cycler: useCycleList(["Toggle Top Camera Slider"]),
      modes: ["All", "Dev", "Testing", "Player"],
    },
    {
      name: "Player 1 Score Incrementer",
      clickFunction: store.incrementPlayer1score,
      imgSrc: "/icons/plus.svg",
      // explanationSrc: "/sounds/elevenlabs/explanation_playerOneIncrementer.mp3",
      cycler: useCycleList([
        "Player 1 Score Incrementer",
        "Player 2 Score Incrementer",
      ]),
      modes: ["All", "Dev", "Testing", "Solo"],
    },
    {
      name: "Player 2 Score Incrementer",
      clickFunction: store.incrementPlayer2score,
      imgSrc: "/icons/plus.svg",
      // explanationSrc: "/sounds/elevenlabs/explanation_playerTwoIncrementer.mp3",
      cycler: useCycleList([
        "Player 2 Score Incrementer",
        "Player 1 Score Incrementer",
      ]),
      modes: ["All", "Dev", "Testing", "Solo"],
    },
  ],
  [
    {
      name: "Pairing Status",
      clickFunction: qrStatus,
      explanationSrc:
        "/sounds/elevenlabs/explanation_pairingStatusAnnouncer.mp3",
      html: "Pairing-Status:<br />Connected to 3wasds3w2.",
      cycler: useCycleList(["Pairing Status", "Ping Phone"]),
      modes: ["All", "Dev", "Testing"],
    },
    {
      name: "Ping Phone",
      clickFunction: pingPhone,
      imgSrc: "/icons/pingPhone.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_phonePinger.mp3",
      cycler: useCycleList(["Ping Phone", "Pairing Status"]),
      modes: ["All", "Dev", "Testing"],
    },
    {
      name: "Scan QR",
      clickFunction: scanqr,
      imgSrc: "/icons/scanQr1.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_qrScanner.mp3",
      cycler: useCycleList(["Scan QR", "Unique QR"]),
    },
    {
      name: "Unique QR",
      clickFunction: qr,
      imgSrc: qrcode,
      // html: computedUniqueQrHtml",
      explanationSrc: "/sounds/elevenlabs/explanation_uniqueQr.mp3",
      cycler: useCycleList(["Unique QR", "Scan QR"]),
      modes: ["All", "Dev", "Testing"],
    },
  ],
  [
    {
      name: "Raw Intersections",
      clickFunction: sendRawIntersections,
      html: "Send scan results to other device",
      explanationSrc: "/sounds/elevenlabs/explanation_calibrator.mp3",
      cycler: useCycleList(["Raw Intersections", "Refresh page"]),
      modes: ["All", "Dev", "Testing"],
    },
    {
      name: "Refresh page",
      clickFunction: refreshPage,
      html: "F5",
      explanationSrc: "/sounds/elevenlabs/explanation_pageRefresher.mp3",
      cycler: useCycleList(["Refresh page", "Raw Intersections"]),
      modes: ["All", "Dev", "Testing"],
    },
    {
      name: "Toss Coin",
      clickFunction: tossCoin,
      imgSrc: coinImgSrc,
      html: "Toss a coin and get heads or tails",
      explanationSrc: "/sounds/elevenlabs/explanation_tossCoin.mp3",
      cycler: useCycleList(["Toss Coin"]),
      modes: ["All", "Dev", "Testing"],
    },
    {
      name: "Show Stunden Orientation",
      clickFunction: () => {
        store.showStundenOrientation = !store.showStundenOrientation;
        console.log(
          "Stunden Orientation toggled:",
          store.showStundenOrientation
        );
      },
      html: "Toggle watch orientation",
      cycler: useCycleList(["Show Stunden Orientation"]),
      modes: ["All", "Dev", "Testing"],
    },
  ],
  [
    {
      name: "Focus Boule 1",
      deactivated: computed(() => store.boulesCount < 2),
      clickFunction: () => click_bouleFocuser(1),
      imgSrc: "/icons/focus1.svg",
      html: "Focus on Boule 1",
      cycler: useCycleList([
        "Focus Boule 1",
        "Focus Boule 2",
        "Focus Boule 3",
        "Focus Boule 4",
        "Focus Boule 5",
        "Focus Boule 6",
        "Focus All Boules",
      ]),
      modes: ["All", "Dev", "Testing", "Player"],
    },
    {
      name: "Focus Boule 2",
      deactivated: computed(() => store.boulesCount < 3),
      clickFunction: () => click_bouleFocuser(2),
      imgSrc: "/icons/focus2.svg",
      html: "Focus on Boule 2",
      cycler: useCycleList([
        "Focus Boule 2",
        "Focus Boule 3",
        "Focus Boule 4",
        "Focus Boule 5",
        "Focus Boule 6",
        "Focus Boule 1",
      ]),
      modes: ["All", "Dev", "Testing"],
    },
    {
      name: "Focus Boule 3",
      deactivated: computed(() => store.boulesCount < 4),
      clickFunction: () => click_bouleFocuser(3),
      imgSrc: "/icons/focus3.svg",
      html: "Focus on Boule 3",
      cycler: useCycleList([
        "Focus Boule 3",
        "Focus Boule 4",
        "Focus Boule 5",
        "Focus Boule 6",
        "Focus Boule 1",
      ]),
      modes: ["All", "Dev", "Testing"],
    },
    {
      name: "Focus Cochonet",
      deactivated: computed(() => store.boulesCount < 1),
      clickFunction: () => click_bouleFocuser(0),
      html: "Focus Cochonet",
      cycler: useCycleList([
        "Focus Cochonet",
        "Focus All Boules",
        "Focus Boule 1",
        "Focus Boule 2",
        "Focus Boule 3",
        "Focus Boule 4",
        "Focus Boule 5",
        "Focus Boule 6",
      ]),
      modes: ["All", "Dev", "Testing"],
    },
  ],
  [
    {
      name: "Focus Boule 4",
      deactivated: computed(() => store.boulesCount < 5),
      clickFunction: () => click_bouleFocuser(4),
      imgSrc: "/icons/focus4.svg",
      html: "Focus on Boule 4",
      cycler: useCycleList([
        "Focus Boule 4",
        "Focus Boule 5",
        "Focus Boule 6",
        "Focus Boule 1",
        "Focus Boule 2",
        "Focus Boule 3",
        "Focus All Boules",
      ]),
      modes: ["All", "Dev", "Testing"],
    },
    {
      name: "Focus Boule 5",
      deactivated: computed(() => store.boulesCount < 6),
      clickFunction: () => click_bouleFocuser(5),
      imgSrc: "/icons/focus5.svg",
      html: "Focus on Boule 5",
      cycler: useCycleList([
        "Focus Boule 5",
        "Focus Boule 6",
        "Focus Boule 1",
        "Focus Boule 2",
        "Focus Boule 3",
        "Focus Boule 4",
        "Focus All Boules",
      ]),
      modes: ["All", "Dev", "Testing"],
    },
    {
      name: "Focus Boule 6",
      deactivated: computed(() => store.boulesCount < 7),
      clickFunction: () => click_bouleFocuser(6),
      imgSrc: "/icons/focus6.svg",
      html: "Focus on Boule 6",
      cycler: useCycleList([
        "Focus Boule 6",
        "Focus Boule 4",
        "Focus Boule 5",
        "Focus All Boules",
      ]),
      modes: ["All", "Dev", "Testing"],
    },
    {
      name: "Focus All Boules",
      deactivated: computed(() => store.boulesCount < 1),
      clickFunction: () => click_bouleFocuser("all"),
      imgSrc: "/icons/focusAll.svg",
      html: "Focus all Boules",
      cycler: useCycleList([
        "Focus All Boules",
        "Focus Cochonet",
        "Focus Boule 1",
        "Focus Boule 2",
        "Focus Boule 3",
        "Focus Boule 4",
        "Focus Boule 5",
        "Focus Boule 6",
      ]),
      modes: ["All", "Dev", "Testing"],
    },
  ],
  [
    {
      name: "Haptic grid near",
      clickFunction: click_hapticGridNear,
      html: "Haptic grid near",
      explanationSrc: "/sounds/elevenlabs/explanation_hapticGrid.mp3",
      cycler: useCycleList([
        "Haptic grid near",
        "Haptic grid medium",
        "Haptic grid far",
      ]),
      modes: ["All", "Dev", "Testing", "Player"],
    },
    {
      name: "Haptic grid medium",
      clickFunction: click_hapticGridMedium,
      html: "Haptic grid medium",
      explanationSrc: "/sounds/elevenlabs/explanation_hapticGrid.mp3",
      cycler: useCycleList([
        "Haptic grid medium",
        "Haptic grid near",
        "Haptic grid far",
      ]),
      modes: ["All", "Dev", "Testing"],
    },
    {
      name: "Haptic grid far",
      clickFunction: click_hapticGridFar,
      html: "Haptic grid far",
      explanationSrc: "/sounds/elevenlabs/explanation_hapticGrid.mp3",
      cycler: useCycleList([
        "Haptic grid far",
        "Haptic grid medium",
        "Haptic grid near",
      ]),
      modes: ["All", "Dev", "Testing"],
    },
  ],
  [
    {
      name: "Ping Startpoint",
      clickFunction: pingShoes,
      imgSrc: "/icons/hoolahoop.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_hoolaPinger.mp3",
      cycler: useCycleList(["Ping Startpoint", "Ping Cochonet"]),
      modes: ["All", "Dev", "Testing", "Player"],
    },
    {
      name: "Stalefish 180",
      clickFunction: click_stalefish180,
      imgSrc: "/icons/stalefish180.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_throughTurnAndBack.mp3",
      cycler: useCycleList(["Stalefish 180"]),
      modes: ["All", "Dev", "Testing", "Player"],
    },
  ],
  [
    {
      name: "Alpha Controller",
      clickFunction: setAlphaController,
      imgSrc: "/icons/gyros.svg",
      html: "Toggle Alpha Controller",
      cycler: useCycleList(["Alpha Controller"]),
      modes: ["All", "Dev", "Testing", "Player"],
    },
    {
      name: "Fly to Cochonet",
      clickFunction: click_flyToCochonet,
      imgSrc: "/icons/flyToCochonet.svg",
      html: "Fly to Cochonet",
      cycler: useCycleList(["Fly to Cochonet"]),
      modes: ["All", "Dev", "Testing", "Player"],
    },
    {
      name: "Slider",
      clickFunction: click_slider,
      imgSrc: "/icons/slider.svg",
      html: "Slider",
      cycler: useCycleList(["Slider"]),
      modes: ["All", "Dev", "Testing", "Player"],
    },
  ],
  [
    {
      name: "Change player 1 audio",
      clickFunction: () => {
        store.playSoundBySrc(store.currentSoundPlayer1);
      },
      html: computed(
        () =>
          `<div class='text-14px opacity-50'>${store.prevSoundPlayer1}</div><div class='text-16px'>${store.currentSoundPlayer1}</div><div class='text-14px opacity-50'>${store.nextSoundPlayer1}</div>`
      ),
      explanationSrc: "/sounds/elevenlabs/explanation_player1AudioCycler.mp3",
      cycler: useCycleList(["Change player 1 audio"]),
      modes: ["All", "Dev", "Testing"],
    },
    {
      name: "Change player 2 audio",
      clickFunction: () => {
        store.playSoundBySrc(store.currentSoundPlayer2);
      },
      html: computed(
        () =>
          `<div class='text-14px opacity-50'>${store.prevSoundPlayer2}</div><div class='text-16px'>${store.currentSoundPlayer2}</div><div class='text-14px opacity-50'>${store.nextSoundPlayer2}</div>`
      ),
      explanationSrc: "/sounds/elevenlabs/explanation_player2AudioCycler.mp3",
      cycler: useCycleList(["Change player 2 audio"]),
      modes: ["All", "Dev", "Testing"],
    },
    {
      name: "Change YOLO model",
      clickFunction: () => {
        speak(`YOLO model is ${store.yoloModelCycler.state.id}.`);
      },
      html: computed(
        () =>
          `<div class='text-14px opacity-50'>${store.prevYoloModel}</div><div class='text-16px'>${store.yoloModelCycler.state.id}</div><div class='text-14px opacity-50'>${store.nextYoloModel}</div>`
      ),
      cycler: useCycleList(["Change YOLO model", "Add function"]),
      modes: ["All", "Dev", "Testing"],
    },
  ],
  [
    {
      name: "Add function",
      clickFunction: addFunction,
      // imgSrc: "/icons/referenz.svg",
      html: "<div>+ Add</div>",
      cycler: useCycleList(["Add function"]),
      modes: ["All"],
    },
    {
      name: "Default",
      clickFunction: () => {},
      html: "Placeholder",
      imgSrc: "/icons/watch.svg",
      cycler: useCycleList(["Default"]),
      modes: ["All"],
    },
    {
      name: "Mute all sounds",
      clickFunction: click_mute,
      html: "Mute all sounds",
      cycler: useCycleList(["Mute all sounds"]),
      modes: ["All", "Dev"],
    },
    {
      name: "Prediction Visualiser",
      clickFunction: () => {
        store.predictionVisualiser = !store.predictionVisualiser;
      },
      html: "Prediction Visualiser",
      cycler: useCycleList(["Prediction Visualiser"]),
      modes: ["All", "Dev"],
    },
  ],
  [
    {
      name: "Change Mode",
      clickFunction: () => {
        store.modesCycler.next();
        speak(`Mode changed to ${store.modesCycler.state.name}`);
      },
      html: computed(() => `Current Mode: ${store.modesCycler.state.name}`),
      cycler: useCycleList(["Change Mode"]),
      modes: modesList.map((mode) => mode.name),
    },
    {
      name: "Toggle Reverse Field",
      deactivated: computed(() => !store.reverseField),
      clickFunction: () => {
        store.reverseField = !store.reverseField;
        speak(`Field ${store.reverseField ? "reversed" : "normal"}`);
      },
      html: computed(
        () => `Toggle Reverse Field: ${store.reverseField ? "ON" : "OFF"}`
      ),
      cycler: useCycleList(["Toggle Reverse Field"]),
      modes: ["All", "Dev", "Testing", "Player"],
    },
  ],
];

const flatPages = pages.flat();

let pagesBasedOnMode = ref([]);
const setPagesBasedOnMode = () => {
  pages.forEach((page) => {
    pagesBasedOnMode.value.push(
      page.filter((item) => {
        if (typeof item.modes === "object") {
          return item.modes?.includes(store.modesCycler.state.name);
        } else {
          return true;
        }
      })
    );
  });
};
setPagesBasedOnMode();

watch(
  () => store.modesCycler.state,
  () => {
    console.log("mode changed", store.modesCycler.state.name);
    pagesBasedOnMode.value = [];
    setPagesBasedOnMode();
  }
);

const {
  goToNext,
  goToPrevious,
  goTo,
  stepNames,
  isLast,
  isFirst,
  index: stepperIndex,
  current: currentPage,
} = useStepper(pagesBasedOnMode);

const announcePage = () => {
  if (currentPage.value.length === 0) return;
  const currentPageLength = currentPage.value.length;
  let names = [];
  for (let i = 0; i < currentPageLength; i++) {
    names.push(
      flatPages.find(
        (entry) => entry.name === currentPage.value[i].cycler.state
      ).name
    );
  }
  const message = `Page ${stepperIndex.value + 1}. ${names.join(", ")}.`;
  console.log(message);
  speak(message);
};

const getIndex = (item) => {
  return flatPages.findIndex((entry) => entry.name === item.cycler.state);
};

const getItem = (item) => {
  return flatPages.find((entry) => entry.name === item.cycler.state);
};

const onClick = (item, index) => {
  flatPages.find((entry) => entry.name === item.cycler.state).clickFunction();
};

const explanations = flatPages.map((item) =>
  useSoundComposable(item.explanationSrc)
);

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
    explanations[index].play();
    lastIndex = index;
  }

  store.touchCounter++;
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
    Howler.stop();
    setTimeout(() => {
      afterLongPress = false;
    }, 100);
  },
});

const swiper = useTemplateRef("swiper");
onLongPress(swiper, longPressCallback, {
  delay: 300,
  modifiers: {
    prevent: true,
  },
  onMouseUp: () => {
    Howler.stop();
    setTimeout(() => {
      afterLongPress = false;
    }, 100);
  },
});

const { isSwiping, direction } = useSwipe(swiper);
watch(isSwiping, (val) => {
  if (val) {
    if (direction.value === "left") {
      if (isLast.value) {
        const firstStep = stepNames.value[0];
        goTo(firstStep);
      } else {
        goToNext();
      }
    }
    if (direction.value === "right") {
      if (isFirst.value) {
        const lastStep = stepNames.value[stepNames.value.length - 1];
        goTo(lastStep);
      } else {
        goToPrevious();
      }
    }
    if (direction.value === "down") {
      flyToStart();
    }
    if (direction.value === "up") {
      click_mute();
    }

    if (stepperIndex.value === 0) vibratePageOne();
    else if (stepperIndex.value === 1) vibratePageTwo();
    else if (stepperIndex.value === 2) vibratePageThree();
    else if (stepperIndex.value === 3) vibratePageFour();
    else if (stepperIndex.value === 4) vibratePageFive();
    else if (stepperIndex.value === 5) vibratePageSix();
    else if (stepperIndex.value === 6) vibratePageSeven();
    else if (stepperIndex.value === 7) vibratePageEight();
    else if (stepperIndex.value === 8) vibratePageNine();
    else if (stepperIndex.value === 9) vibratePageTen();
    else if (stepperIndex.value === 10) vibratePageEleven();
    else if (stepperIndex.value === 11) vibratePageTwelve();
  }
});

onKeyStroke(["ArrowLeft"], (e) => {
  e.preventDefault();
  if (isFirst.value) {
    const lastStep = stepNames.value[stepNames.value.length - 1];
    goTo(lastStep);
  } else {
    goToPrevious();
  }
});

onKeyStroke(["ArrowRight"], (e) => {
  e.preventDefault();
  if (isLast.value) {
    9;
    const firstStep = stepNames.value[0];
    goTo(firstStep);
  } else {
    goToNext();
  }
});

onKeyStroke(["1", "2", "3", "4", "5", "6", "7", "8", "9"], (e) => {
  const pageIndex = parseInt(e.key) - 1;
  if (pageIndex >= 0 && pageIndex < pages.length) {
    goTo(stepNames.value[pageIndex]);
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
  z-index: 1000;
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

.big {
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  border: 3px solid #ff0000;
  grid-row: span 2;
  grid-column: span 2;
  border-radius: 5px;
  > div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: top;
    div {
      margin-top: 10px;
      text-align: center;
      font-size: 30px;
      font-weight: 400;
      color: red;
      width: 80%;
    }
  }
}

.grid-item {
  border: 3px solid #ff0000;
  border-radius: 5px;
  user-select: none;
  pointer-events: auto;
  overflow: hidden;
  transition: all 50ms;
  position: relative;
  div {
    pointer-events: none;
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

  &:nth-child(4) {
    border-top-left-radius: 60px;
  }
}

.center-circle {
  width: 160px;
  aspect-ratio: 1;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px dashed transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1;
    border-radius: 50%;
    width: 100%;
    border: 3px solid red;
  }
  > * {
    pointer-events: none;
  }
}
</style>
