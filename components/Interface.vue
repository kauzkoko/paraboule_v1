<template>
  <div
    class="absolute left-0 w-100dvw h-100dvh"
    :style="{ top: isTouching ? '0' : '-40px' }"
  >
    <VirtualAudioSpace :isTouching="isTouching" :trigger="audioTrigger" />
  </div>
  <VibrationGrid
    :isTouching="isTouching"
    @click="isTouching = !isTouching"
    @touchstart="onTappingOnHaptic"
    @touchend="onTappingOnHaptic"
  />
  <div class="outer" v-show="isTouching">
    <div class="container">
      <div class="big">
        <div v-show="!isTappingOnHaptic">
          <div>
            Tap, hold and move across the screen to navigate. Tap once to exit.
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="outer" ref="el" v-show="!isTouching" s>
    <div class="container">
      <div
        :ref="refs.set"
        v-for="(item, index) in currentPage"
        :key="'grid-item-' + index"
        class="grid-item children:pointer-events-none"
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
        }"
      >
        <div class="flex justify-center items-center">
          <img
            v-if="getItem(item).imgSrc"
            :src="getItem(item).imgSrc"
            :style="{
              width: getItem(item).imgSrc.endsWith('uniqueQr.png')
                ? '30dvw'
                : '',
            }"
          />
          <div
            v-if="getItem(item).html"
            class="text-hex-ff0000 text-20px text-center flexCenter"
          >
            <div v-html="getItem(item).html.value ?? getItem(item).html"></div>
          </div>
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
    />
  </div>
</template>

<script setup>
import { Howler } from "howler";

const bus = useEventBus("protoboules");

const store = useProtoStore();
const { player1Score, player2Score } = storeToRefs(store);
const isTouching = ref(false);

const { sendRawIntersections } = useXrController();

const isTappingOnHaptic = ref(false);
const onTappingOnHaptic = () => {
  console.log("onTappingOnHaptic");
  isTappingOnHaptic.value = !isTappingOnHaptic.value;
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
} = useVibrations();

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

const onSwipe = (dir, e, index, item) => {
  // const indexElement = e.srcElement.getAttribute("index");
  if (dir === "right") {
    currentPage.value[index].cycler.next();
  } else {
    currentPage.value[index].cycler.prev();
  }
};

// register click functions
const scanCamera = () => {
  if (!afterLongPress) {
    if (store.xrRunning) {
      bus.emit("stopXR");
    } else if (store.modelLoaded) {
      bus.emit("startXR");
    }
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
    flyToCochonetAndBack();
  }
};

const click_stalefish180 = () => {
  if (!afterLongPress) {
    stalefish180();
  }
};

const orientation = () => {
  console.log("orientation");
};

const bouleFocuser = (bouleIndex) => {
  store.focusBoules = true;
  if (bouleIndex < store.bouleCount) {
    store.goToBoule(bouleIndex);
    return;
  } else if (bouleIndex >= store.bouleCount) {
    const message = `There are only ${store.bouleCount - 1} balls.`;
    speak(message);
    return;
  }
  store.nextBoule();
  if (store.currentlySelectedBouleIndex === 0) {
    store.nextBoule();
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
        bouleFocuser();
        break;
      case "focus the ball 1":
      case "focus ball 1":
      case "focus ball one":
      case "focus the ball one":
      case "focus the first ball":
        bouleFocuser(1);
        break;
      case "focus the ball 2":
      case "focus ball 2":
      case "focus ball two":
      case "focus the second ball":
        bouleFocuser(2);
        break;
      case "focus the ball 3":
      case "focus ball 3":
      case "focus ball three":
      case "focus the third ball":
        bouleFocuser(3);
        break;
      case "focus the ball 4":
      case "focus ball 4":
      case "focus ball four":
      case "focus ball for":
      case "focus the fourth ball":
        bouleFocuser(4);
        break;
      case "focus the ball 5":
      case "focus ball 5":
      case "focus ball five":
      case "focus the fifth ball":
        bouleFocuser(5);
        break;
      case "focus the ball 6":
      case "focus ball 6":
      case "focus ball six":
      case "focus the sixth ball":
        bouleFocuser(6);
        break;
      case "fly to center and back":
      case "fly to center":
        flyToCochonetAndBack();
        break;
      case "fly to other side and back":
      case "fly to other side":
        stalefish180();
        break;
      case "haptic grid":
      case "toggle haptic":
      case "toggle haptic feedback":
      case "toggle haptics":
        click_hapticGrid();
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

const computedScoreStandingsHtml = computed(() => {
  return `
    <div class='text-48px'>
      <div>${player1Score.value} / 13</div><br />
      <div class='h-3px bg-hex-ff0000 w-100%'></div><br/>
      <div>${player2Score.value} / 13</div>
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

const scores = [];
for (let i = 0; i <= 13; i++) {
  for (let j = 0; j <= 13; j++) {
    scores.push(useSoundComposable(`/sounds/elevenlabs/scores/${i}_${j}.mp3`));
  }
}

const scoreStandings = () => {
  console.log("scoreStandings");
  const index = player1Score.value * 14 + player2Score.value;
  scores[index].play();
};

const pingShoes = () => {
  console.log("pingShoes");
  if (!afterLongPress) {
    sendPlayShoes();
  }
};

const pingPhone = () => {
  console.log("pingPhone, TODO maybe add calling sound");
  if (!afterLongPress) {
    sendPlayPhone();
  }
};

const refreshPage = () => {
  console.log("refreshPage");
  window.location.reload();
};

const click_hapticGrid = () => {
  console.log("click_hapticGrid");
  isTouching.value = !isTouching.value;
};

const ambisonicsFlyToCocho = () => {
  console.log("ambisonicsFlyToCocho");
  // TODO: add ambisonics fly to cocho
};

const { sendPlayCocho, sendPlayShoes, sendPlayPhone } = useSoundController();
const {
  startCircularRotation,
  flyToCochonetAndBack,
  stalefish180,
  lookAlongNegativeXAxis,
  lookAlongPositiveXAxis,
  lookAlongPositiveZAxis,
  lookAlongNegativeZAxis,
} = useAnimationController();

const vibrateByIndex = (index) => {
  if (index === 0) vibrateOnce();
  if (index === 1) vibrateTwice();
  if (index === 2) vibrateThrice();
  if (index === 3) vibrateQuadrice();
};

const touchCounter = useState("touchCounter", () => 0);
const touchedIndex = ref(null);
const onTouchStart = (index) => {
  touchedIndex.value = index;
  audioTrigger.value++;
  touchCounter.value++;
  vibrateByIndex(index);
};

const onTouchEnd = () => {
  setTimeout(() => {
    touchedIndex.value = null;
  }, 300);
};

const focusBoule1 = () => bouleFocuser(1);
const focusBoule2 = () => bouleFocuser(2);
const focusBoule3 = () => bouleFocuser(3);
const focusBoule4 = () => bouleFocuser(4);
const focusAllBoules = () => {
  store.focusBoules = false;
};

const pages = [
  [
    {
      id: 0,
      name: "Haptic Grid",
      clickFunction: click_hapticGrid,
      imgSrc: "/icons/hapticGrid.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_hapticGrid.mp3",
      cycler: useCycleList([0]),
    },
    {
      id: 1,
      name: "Ping Cocho",
      clickFunction: ping,
      imgSrc: "/icons/cocho.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_pingCocho.mp3",
      cycler: useCycleList([1, 2]),
    },
    {
      id: 2,
      name: "Ping Shoes",
      clickFunction: pingShoes,
      imgSrc: "/icons/hoolahoop.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_hoolaPinger.mp3",
      cycler: useCycleList([2, 1]),
    },
    {
      id: 3,
      name: "Scan Camera",
      clickFunction: scanCamera,
      imgSrc: "/icons/scanCamera.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_scanField.mp3",
      cycler: useCycleList([3, 22]),
    },
  ],
  [
    {
      id: 4,
      name: "Pirate Radar",
      clickFunction: startCocho,
      imgSrc: "/icons/around.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_pirateRadar.mp3",
      cycler: useCycleList([4, 5, 6, 7]),
    },
    {
      id: 5,
      name: "Boomerang",
      clickFunction: flyCochoBack,
      imgSrc: "/icons/boomerang1.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_boomerang.mp3",
      cycler: useCycleList([5, 6, 7, 4]),
    },
    {
      id: 6,
      name: "Boule Focuser",
      clickFunction: bouleFocuser,
      imgSrc: "/icons/bouleFocuser.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_bouleFocuser.mp3",
      cycler: useCycleList([6, 20, 21, 22, 23, 24]),
    },
    {
      id: 7,
      name: "Stalefish 180",
      clickFunction: click_stalefish180,
      imgSrc: "/icons/stalefish180.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_throughTurnAndBack.mp3",
      cycler: useCycleList([7, 4, 5, 6]),
    },
  ],
  [
    {
      id: 8,
      name: "Score Standings",
      clickFunction: scoreStandings,
      // imgSrc: "/icons/standing.svg",
      html: computedScoreStandingsHtml,
      explanationSrc: "/sounds/elevenlabs/explanation_currentScore.mp3",
      cycler: useCycleList([8, 18]),
    },
    {
      id: 28,
      name: "Ambisonics Fly to Cocho",
      clickFunction: ambisonicsFlyToCocho,
      html: "Ambisonics Fly to Cocho",
      cycler: useCycleList([28]),
    },
    {
      id: 29,
      name: "Set score from scan",
      clickFunction: ambisonicsFlyToCocho,
      html: "Scan field to increment total score",
      cycler: useCycleList([29]),
    },
    {
      id: 30,
      name: "Mute",
      clickFunction: ambisonicsFlyToCocho,
      html: "Mute",
      cycler: useCycleList([30]),
    },
  ],
  [
    {
      id: 31,
      name: "Look along negative X axis",
      clickFunction: lookAlongNegativeXAxis,
      html: "Look along negative X axis",
      cycler: useCycleList([31]),
    },
    {
      id: 32,
      name: "Look along positive X axis",
      clickFunction: lookAlongPositiveXAxis,
      html: "Look along positive X axis",
      cycler: useCycleList([32]),
    },
    {
      id: 33,
      name: "Look along positive Z axis",
      clickFunction: lookAlongPositiveZAxis,
      html: "Look along positive Z axis",
      cycler: useCycleList([33]),
    },
    {
      id: 34,
      name: "Look along negative Z axis",
      clickFunction: lookAlongNegativeZAxis,
      html: "Look along negative Z axis",
      cycler: useCycleList([34]),
    },
  ],
  [
    {
      id: 16,
      name: "Player 1 Incrementer",
      clickFunction: incrementPlayer1,
      imgSrc: "/icons/plus.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_playerOneIncrementer.mp3",
      cycler: useCycleList([16, 17]),
    },
    {
      id: 17,
      name: "Player 2 Incrementer",
      clickFunction: incrementPlayer2,
      imgSrc: "/icons/plus.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_playerTwoIncrementer.mp3",
      cycler: useCycleList([17, 16]),
    },
    {
      id: 18,
      name: "Announce Balls Played",
      clickFunction: announceBallsPlayed,
      explanationSrc: "/sounds/elevenlabs/explanation_ballsShotAnnouncer.mp3",
      html: computedAnnounceBallsPlayedHtml,
      cycler: useCycleList([18, 8]),
    },
    {
      id: 19,
      name: "Rewind",
      clickFunction: rewind,
      imgSrc: "/icons/rewind.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_rewinder.mp3",
      cycler: useCycleList([19, 16, 17]),
    },
  ],
  [
    {
      id: 12,
      name: "Pairing Status",
      clickFunction: qrStatus,
      explanationSrc:
        "/sounds/elevenlabs/explanation_pairingStatusAnnouncer.mp3",
      html: "Pairing-Status:<br />Connected to 3wasds3w2.",
      cycler: useCycleList([12, 13, 14, 15]),
    },
    {
      id: 13,
      name: "Ping Phone",
      clickFunction: pingPhone,
      imgSrc: "/icons/pingPhone6.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_phonePinger.mp3",
      cycler: useCycleList([13, 12, 14, 15]),
    },
    {
      id: 14,
      name: "Scan QR",
      clickFunction: scanqr,
      imgSrc: "/icons/scanQr1.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_qrScanner.mp3",
      cycler: useCycleList([14, 15, 13, 12]),
    },
    {
      id: 15,
      name: "Unique QR",
      clickFunction: qr,
      imgSrc: "/icons/uniqueQr.png",
      explanationSrc: "/sounds/elevenlabs/explanation_uniqueQr.mp3",
      cycler: useCycleList([15, 13, 14, 12]),
    },
  ],
  [
    {
      id: 20,
      name: "Orientation",
      clickFunction: orientation,
      html: "Focus on Boule 1",
      explanationSrc: "/sounds/elevenlabs/explanation_calibrator.mp3",
      cycler: useCycleList([20]),
    },
    {
      id: 21,
      name: "Boules Before",
      clickFunction: focusBoulesBefore,
      imgSrc: "/icons/boulesBefore.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_boulesBefore.mp3",
      cycler: useCycleList([21]),
    },
    {
      id: 22,
      name: "Raw Intersections",
      clickFunction: sendRawIntersections,
      html: "Send scan results to other device",
      explanationSrc: "/sounds/elevenlabs/explanation_calibrator.mp3",
      cycler: useCycleList([22]),
    },
    {
      id: 23,
      name: "Refresh page",
      clickFunction: refreshPage,
      html: "Click to refresh page",
      explanationSrc: "/sounds/elevenlabs/explanation_pageRefresher.mp3",
      cycler: useCycleList([23]),
    },
  ],
  [
    {
      id: 24,
      name: "Focus Boule 1",
      clickFunction: focusBoule1,
      html: "Focus on Boule 1",
      cycler: useCycleList([24, 25, 26, 27]),
    },
    {
      id: 25,
      name: "Focus Boule 2",
      clickFunction: focusBoule2,
      html: "Focus on Boule 2",
      cycler: useCycleList([25, 24, 26, 27]),
    },
    {
      id: 26,
      name: "Focus Boule 3",
      clickFunction: focusBoule3,
      html: "Focus on Boule 3",
      cycler: useCycleList([26, 24, 25, 27]),
    },
    {
      id: 27,
      name: "Focus All Boules",
      clickFunction: focusAllBoules,
      html: "Focus all Boules",
      cycler: useCycleList([27, 24, 25, 26]),
    },
  ],
  [],
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

const flatPages = pages.flat();
const announcePage = () => {
  if (currentPage.value.length === 0) return;
  let names = [
    flatPages.find((entry) => entry.id === currentPage.value[0].cycler.state)
      .name,
    flatPages.find((entry) => entry.id === currentPage.value[1].cycler.state)
      .name,
    flatPages.find((entry) => entry.id === currentPage.value[2].cycler.state)
      .name,
    flatPages.find((entry) => entry.id === currentPage.value[3].cycler.state)
      .name,
  ];
  const message = `Page ${stepperIndex.value + 1}. ${names.join(", ")}.`;
  console.log(message);
  speak(message);
};

const getIndex = (item) => {
  return flatPages.findIndex((entry) => entry.id === item.cycler.state);
};

const getItem = (item) => {
  return flatPages.find((entry) => entry.id === item.cycler.state);
};

const onClick = (item, index) => {
  console.log("onClick", item.cycler.state, index);
  store.focusBoules = false;
  pages
    .flat()
    .find((page) => page.id === item.cycler.state)
    .clickFunction();
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
    explanations[index].play();
    lastIndex = index;
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
      bus.emit("flyToStart");
    }
    if (direction.value === "up") {
      Howler.stop();
      store.helpers = !store.helpers;
      window.speechSynthesis.cancel();
    }

    if (stepperIndex.value === 0) vibratePageOne();
    else if (stepperIndex.value === 1) vibratePageTwo();
    else if (stepperIndex.value === 2) vibratePageThree();
    else if (stepperIndex.value === 3) vibratePageFour();
    else if (stepperIndex.value === 4) vibratePageFive();
    else if (stepperIndex.value === 5) vibratePageSix();
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
    const firstStep = stepNames.value[0];
    goTo(firstStep);
  } else {
    goToNext();
  }
});

onKeyStroke(["1", "2", "3", "4", "5", "6"], (e) => {
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
  width: 100%;
  height: 100%;
  border: 3px solid #ff0000;
  grid-row: span 2;
  grid-column: span 2;
  border-radius: 5px;
  > div {
    width: 100%;
    height: 100%;
    background-color: #ff0000;
    opacity: 0.7;
    display: flex;
    justify-content: center;
    align-items: center;
    div {
      text-align: center;
      font-size: 30px;
      font-weight: 400;
      color: black;
      width: 80%;
    }
  }
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
  > div {
    > * {
      pointer-events: none;
    }
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
  width: 150px;
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
    width: 80%;
    border: 3px solid red;
  }
  > * {
    pointer-events: none;
  }
}
</style>
