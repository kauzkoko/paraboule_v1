<template>
  <div class="outer fixed left-0 transform-gpu translate-y--11px w-100dvw h-100dvh" @click="onFullscreenClick()">
    <VirtualAudioSpace :trigger="audioTrigger"></VirtualAudioSpace>
  </div>
  <div class="outer" v-show="store.isTouchingSlider" @click="onClickSliderComponent"
    @touchstart="isTouchingSliderTouchStartHandler">
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
  <div class="outer" v-show="store.isTouchingTopCameraSlider" @click="onClickTopCameraSliderComponent">
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
  <div class="outer" v-show="store.isTouchingHaptic" @click="onClickHapticGridComponent">
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
  <div class="outer pointer-events-none" v-show="store.predictionVisualiser || store.scannerOpen">
    <div class="container scannerClass">
      <div class="big">
        <div v-show="!store.predictionVisualiser || !store.scannerOpen">
          <div>Tap once to exit.</div>
        </div>
      </div>
    </div>
  </div>
  <div class="outer" ref="el" v-show="!store.isTouchingHaptic &&
    !store.isTouchingSlider &&
    !store.isTouchingTopCameraSlider &&
    !store.predictionVisualiser &&
    !store.scannerOpen
    ">
    <div class="container">
      <template v-for="(item, index) in currentPage" :key="'grid-item-' + index">
        <div :ref="refs.set" class="grid-item" :index="getIndex(item)" @touchend="onTouchEnd"
          v-show="getItem(item).name !== 'Placeholder'" v-touch:swipe="(dir, e) => onSwipe(dir, e, index, item)"
          @click="onClick(item, index)" @touchstart="onTouchStart(index)" :style="{
            background:
              touchedIndex === index ? 'red' : 'transparent',
            transition:
              touchedIndex === index ? 'all 100ms' : 'all 500ms',
            opacity: getItem(item).deactivated
              ? getItem(item).deactivated.value
                ? 0.5
                : 1
              : 1,
            boxShadow: touchedIndex === index || (store.infoStepper.isCurrent('functions') && index === store.buttonTransitionIndex && store.buttonTransition) ? '0px 4px 38.4px 22px #616BFF inset, 6px 20px 119.6px 52px #FFF inset' : 'none',
          }">
          <div class="absolute text-[var(--border-color)] text-14px font-bold px-7px py-4px" :class="{
            'top-0 left-0': index === 0,
            'top-0 right-0': index === 1,
            'bottom-0 left-0': index === 2,
            'bottom-0 right-0': index === 3,
          }">
            {{ getItem(item).name }}
          </div>
          <div
            class="flex justify-center items-center w-full h-full children:w-70% children:h-70% transition-opacity duration-1000"
            :class="store.infoScreen ? 'opacity-0' : 'opacity-100'">
            <SvgIcon v-if="getItem(item).imgSrc && !getItem(item).imgSrc.value && getItem(item).imgSrc.includes('.svg')"
              :name="getIconName(getItem(item).imgSrc)" />
            <img
              :class="getItem(item).imgSrc.value ?? (getItem(item).imgSrc.startsWith('data') || getItem(item).imgSrc.includes('.png')) ? 'h-initial' : 'initial'"
              v-else-if="getItem(item).imgSrc" :src="getItem(item).imgSrc.value ?? getItem(item).imgSrc" />
            <div v-else-if="getItem(item).html"
              class="text-[var(--border-color)] text-24px font-bold text-center flexCenter max-w-80%">
              <div v-html="getItem(item).html.value ?? ''"></div>
              <!-- <div v-html="getItem(item).html.value ?? getItem(item).html"></div> -->
            </div>
          </div>
        </div>
      </template>
      <div class="center-circle aspect-1" ref="swiper" :index="'pageAnnouncer'" @click="onSingleClick"
        @touchstart="onTouchStart('pageAnnouncer')" @touchend="onTouchEnd" :style="{
          background:
            touchedIndex === 'pageAnnouncer'
              ? 'transparent'
              : 'black',
          transition:
            touchedIndex === 'pageAnnouncer'
              ? 'all 300ms'
              : 'all 300ms',
          boxShadow: touchedIndex === 'pageAnnouncer' || store.infoStepper.isCurrent('center-circle') ? '0px 0px 50px 50px var(--border-color) inset' : 'none',
          border: touchedIndex === 'pageAnnouncer' ? 'solid 10px black' : 'solid 10px black',

        }">
        <div class="text-[var(--border-color)] text-38px aspect-1" :style="{
          width: store.infoStepper.isCurrent('center-circle') ? '130px' : '200px',
        }" :index="'pageAnnouncer'">
          <span> {{ stepperIndex + 1 }}</span>
        </div>
      </div>
    </div>
    <QrScanner v-if="scanForQr" :scanForQr="scanForQr" @qrCodeFound="onQrCode"></QrScanner>
  </div>
  @click="onClickSliderComponent" @touchstart="onTappingOnSlider" @touchend="onTappingOnSlider" />
  <TopCameraSlider @click="onClickToggleTopCameraSliderComponent" @touchstart="onTappingOnTopCameraSlider"
    @touchend="onTappingOnTopCameraSlider" />
  <VibrationGrid @click="onClickHapticGridComponent" @touchstart="onTappingOnHaptic" @touchend="onTappingOnHaptic">
  </VibrationGrid>
  <PredictionVisualiser></PredictionVisualiser>
  <Scanner></Scanner>
</template>

<script setup>
import { Howler } from "howler";
import { useQRCode } from "@vueuse/integrations/useQRCode";

await preloadComponents(['SvgIcon'])

const store = useProtoStore();
const { speak } = useSpeech();
const bus = useEventBus("protoboules");
const { sendReverseField } = useScanController();
const { sendRawIntersections } = useXrController();
const { sendPlayCochonnet, sendPlayHoola, sendPlayPhone } = useSoundController({
  listen: true,
});
const { sendMute, sendUnmute } = useAssistantController();
const { sendGlobalShotsTaken } = useScoreController();

const onTappingOnHaptic = () => {
  store.isTappingOnHaptic = !store.isTappingOnHaptic;
};

const onTappingOnSlider = () => {
  store.isTappingOnSlider = !store.isTappingOnSlider;
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

const {
  startCircularRotation,
  flyToCochonnetAndBack,
  stalefish180,
  lookAlongNegativeXAxis,
  lookAlongPositiveXAxis,
  lookAlongPositiveZAxis,
  lookAlongNegativeZAxis,
  flyToCochonnet,
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
    if (currentPage.value[index].name === "Ping Cochonnet") refreshPage();
    else if (currentPage.value[index].name === "Change player 1 audio") {
      store.players.player1.audioCycler.prev();
    } else if (currentPage.value[index].name === "Change player 2 audio") {
      store.players.player2.audioCycler.prev();
    } else if (currentPage.value[index].name === "Change YOLO model") {
      store.yoloModelCycler.prev();
    } else if (currentPage.value[index].name === "Change Mode") {
      store.modesCycler.prev();
    }
  } else if (direction === "top") {
    if (currentPage.value[index].name === "Change player 1 audio") {
      store.players.player1.audioCycler.next();
    } else if (currentPage.value[index].name === "Change player 2 audio") {
      store.players.player2.audioCycler.next();
    } else if (currentPage.value[index].name === "Change YOLO model") {
      store.yoloModelCycler.next();
    } else if (currentPage.value[index].name === "Change Mode") {
      store.modesCycler.next();
    }
  }
};

const setAlphaController = () => {
  store.alphaController = !store.alphaController;
  store.baseAlpha = store.gyroAlpha;
  console.log("in setAlphaController", store.alphaController);
};

whenever(() => !store.alphaController, () => {
  console.log('test')
  flyToStart()
})

const onFullscreenClick = () => {
  if (store.alphaController) {
    store.alphaController = false;
    flyToStart();
  }

  if (store.scannerOpen) store.scannerOpen = false
  if (store.predictionVisualiser) store.predictionVisualiser = false
  // console.log("in onFullscreenClick", store.alphaController);
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

const click_pingCochonnet = () => {
  if (!afterLongPress) {
    sendPlayCochonnet(5000);
  }
};

const startCocho = () => {
  if (!afterLongPress) {
    startCircularRotation();
  }
};

const flyCochoBack = () => {
  if (!afterLongPress) {
    flyToCochonnetAndBack();
  }
};

const click_flyToCochonnet = () => {
  if (!afterLongPress) {
    flyToCochonnet();
  }
};

const click_flyToStart = () => {
  if (!afterLongPress) {
    flyToStart();
  }
};

const click_stalefish180 = () => {
  if (!afterLongPress) {
    stalefish180();
  }
};

const click_bouleFocuser = (bouleIndex) => {
  store.volume = 1;
  // click_toggleMute()
  store.unmute3dAudio()
  if (bouleIndex === 'all') store.bouleFocuserCycler.go(0);
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
        flyToCochonnetAndBack();
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
  // if (!isListening.value) {
  //   start();
  //   console.log("start listening");
  // }
  click_toggleMute();
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
    ? `<div class='text-23px'>
            <div>Round over. Tap any + below to start new round.</div>
        </div>`
    : `
        <div class='text-36px'>
          <div>${store.players.player1.shotsTaken} / 3</div><br />
          <div class='h-3px bg-hex-ff0000 w-100% my--30px!'></div><br/>
          <div>${store.players.player2.shotsTaken} / 3</div>
        </div>`;
});

const gameOver = computed(() => {
  return store.players.player1.score >= 13 || store.players.player2.score >= 13;
});

const computedScoreStandingsHtml = computed(() => {
  if (store.gameOver) {
    return `
        <div class='text-23px'>Team ${store.previousWinner} wins ${store.previousWinnerScore} / ${store.previousLoserScore}. Tap any + below to restart.</div>
      </div>`;
  }
  return `
    <div class='text-36px word-break-none'>
      <div class='whitespace-nowrap'>${store.players.player1.score} / 13</div><br />
      <div class='h-3px bg-hex-ff0000 w-100% my--30px!'></div><br/>
      <div>${store.players.player2.score} / 13</div>
    </div>`;
});

const text = ref("");
const announceBallsPlayed = () => {
  console.log("announceBallsPlayed");
  text.value = `Player 1 has played ${store.players.player1.shotsTaken} ${store.players.player1.shotsTaken === 1 ? "ball" : "balls"
    }. Player 2 has played ${store.players.player2.shotsTaken} ${store.players.player2.shotsTaken === 1 ? "ball" : "balls"
    }. `;
  if (isNextRound.value) {
    text.value +=
      "Current round is over. Start new round by pressing any plus button below.";
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
    sendPlayHoola();
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
  store.isTouchingSliderTimeout = true
  store.isTouchingSlider = !store.isTouchingSlider;
};

const click_slider = () => {
  store.isTouchingSlider = !store.isTouchingSlider;

};

const isTouchingSliderTouchStartHandler = () => {
  store.isTouchingSliderTimeout = false
}

whenever(() => !store.isTouchingSlider, () => {
  flyToStart()
})

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
  flyToStart(true, true)
};

const click_hapticGridFar = () => {
  store.currentHapticGrid = "far";
  store.isTouchingHaptic = !store.isTouchingHaptic;
};

const click_toggleMute = () => {
  console.log("click_toggleMute");
  Howler.stop();
  store.toggle3dAudio();
  window.speechSynthesis.cancel();
  if (store.volume === 0) {
    sendMute();
  } else {
    sendUnmute();
  }
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

const coinImgSrc = ref("/icons/coinFlip.svg");
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
      Math.random() < 0.5 ? "/icons/coinFlip.svg" : "/icons/zahl.svg";
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

const getSvgIcon = (iconName) => {
  const svgIcons = {
    gyros: `<svg class="custom-svg-icon" width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="75" cy="75" r="23.5" stroke="currentColor" stroke-width="3"/>
      <path d="M108.178 92.3553C108.178 93.1838 108.849 93.8553 109.678 93.8553H123.178C124.006 93.8553 124.678 93.1838 124.678 92.3553C124.678 91.5269 124.006 90.8553 123.178 90.8553L111.178 90.8553L111.178 78.8553C111.178 78.0269 110.506 77.3553 109.678 77.3553C108.849 77.3553 108.178 78.0269 108.178 78.8553V92.3553ZM117 74.6777L118.5 74.6777V74.6777H117ZM115.097 65.1106L116.483 64.5366L116.483 64.5366L115.097 65.1106ZM110.738 93.416C113.199 90.9552 115.151 88.0339 116.483 84.8188L113.711 83.6707C112.53 86.5219 110.799 89.1125 108.617 91.2947L110.738 93.416ZM116.483 84.8188C117.815 81.6037 118.5 78.1577 118.5 74.6777L115.5 74.6777C115.5 77.7637 114.892 80.8196 113.711 83.6707L116.483 84.8188ZM118.5 74.6777C118.5 71.1976 117.815 67.7517 116.483 64.5366L113.711 65.6846C114.892 68.5358 115.5 71.5916 115.5 74.6777H118.5ZM116.483 64.5366C115.151 61.3214 113.199 58.4001 110.738 55.9393L108.617 58.0607C110.799 60.2428 112.53 62.8335 113.711 65.6846L116.483 64.5366Z" fill="currentColor"/>
      <path d="M42.1777 57.0001C42.1777 56.1717 41.5062 55.5001 40.6777 55.5001H27.1777C26.3493 55.5001 25.6777 56.1717 25.6777 57.0001C25.6777 57.8286 26.3493 58.5001 27.1777 58.5001H39.1777V70.5001C39.1777 71.3286 39.8493 72.0001 40.6777 72.0001C41.5062 72.0001 42.1777 71.3286 42.1777 70.5001V57.0001ZM33.3554 74.6778L31.8554 74.6778L31.8554 74.6778H33.3554ZM35.2584 84.2449L33.8726 84.8189L33.8726 84.8189L35.2584 84.2449ZM39.6171 55.9395C37.1563 58.4002 35.2043 61.3216 33.8726 64.5367L36.6442 65.6847C37.8252 62.8336 39.5562 60.243 41.7384 58.0608L39.6171 55.9395ZM33.8726 64.5367C32.5408 67.7518 31.8554 71.1978 31.8554 74.6778L34.8554 74.6778C34.8554 71.5917 35.4632 68.5359 36.6442 65.6847L33.8726 64.5367ZM31.8554 74.6778C31.8554 78.1578 32.5408 81.6038 33.8726 84.8189L36.6442 83.6709C35.4632 80.8197 34.8554 77.7639 34.8554 74.6778H31.8554ZM33.8726 84.8189C35.2043 88.034 37.1563 90.9554 39.6171 93.4161L41.7384 91.2948C39.5562 89.1126 37.8252 86.522 36.6442 83.6709L33.8726 84.8189Z" fill="currentColor"/>
      <path d="M0 75H10H20M150 75H140H130" stroke="currentColor" stroke-width="3"/>
      <path d="M10 113L18.6603 108M139.904 38L131.244 43" stroke="currentColor" stroke-width="3"/>
      <path d="M10 38L18.6603 43M139.904 113L131.244 108" stroke="currentColor" stroke-width="3"/>
      <path d="M37 139.904L42 131.244M112 10L107 18.6603" stroke="currentColor" stroke-width="3"/>
      <path d="M37 10L42 18.6603M112 139.904L107 131.244" stroke="currentColor" stroke-width="3"/>
      <path d="M75 150V140V130M75 0V10V20" stroke="currentColor" stroke-width="3"/>
      <rect x="51.5" y="24.5" width="47" height="100" rx="6.5" stroke="currentColor" stroke-width="3"/>
    </svg>`,
    // Add more icons as needed
  };

  return svgIcons[iconName] || '';
};

const pages = [
  [
    {
      name: "Gyros Controller",
      clickFunction: setAlphaController,
      imgSrc: "/icons/gyros.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_gyro.mp3",
      html: "Toggle Gyros Controller",
      cycler: useCycleList(["Gyros Controller"]),
      modes: ["All", "Dev", "Testing", "Player", "SBV", "Solo", "S1", "Exhibition"],
    },
    {
      name: "Bug",
      clickFunction: click_slider,
      imgSrc: "/icons/slider.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_slider.mp3",
      html: "Bug",
      cycler: useCycleList(["Bug"]),
      modes: ["All", "Dev", "Testing", "SBV", "Player", "S1", "Exhibition"],
    },
    {
      name: "Fly to Cochonnet",
      clickFunction: click_flyToCochonnet,
      imgSrc: "/icons/flyToCochonnet.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_flyOnTheCochonnet.mp3",
      html: "Fly to cochonnet",
      cycler: useCycleList(["Fly to Cochonnet"]),
      modes: ["All", "Dev", "Testing", "SBV", "Player", "S1", "Exhibition"],
    },
    {
      name: "Fly to Starting Point",
      clickFunction: click_flyToStart,
      imgSrc: "/icons/flyToStart.svg",
      // explanationSrc: "/sounds/elevenlabs/explanation_flyOnTheStartpoint.mp3",
      html: "Fly to starting point",
      cycler: useCycleList(["Fly to Starting Point"]),
      modes: ["All", "Dev", "Testing", "SBV", "Player", "S1", "Exhibition"],
    },
  ],
  [
    {
      name: "Pirate Radar",
      clickFunction: () => {
        store.showStundenOrientation = true;
        const currentLookalongFunction = flatPages.find(
          (item) => item.name === store.lookAlongCycler.state
        );
        currentLookalongFunction.clickFunction();
        store.lookAlongCycler.next();
      },
      html: "Pirate Radar",
      imgSrc: "/icons/toggleLookalong.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_ocklocktoggler.mp3",
      cycler: useCycleList(["Pirate Radar"]),
      modes: ["All", "Dev", "Testing", "Player", "S1", "Exhibition"],
    },
    {
      name: "Haptic Grid",
      clickFunction: click_hapticGridMedium,
      html: "Haptic Grid",
      imgSrc: "/icons/hapticGridMedium.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_hapticGrid.mp3",
      cycler: useCycleList([
        "Haptic Grid",
        "Haptic grid near",
        "Haptic grid far",
      ]),
      modes: ["All", "Dev", "Testing", "SBV", "Player", "S1", "Exhibition"],
    },
    {
      name: "Ping Cochonnet",
      clickFunction: click_pingCochonnet,
      imgSrc: "/icons/cocho.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_pingCocho.mp3",
      cycler: useCycleList(["Ping Cochonnet"]),
      modes: ["All", "Dev", "Testing", "Player", "Solo", "S1", "Exhibition"],
    },
    {
      name: "Ping Starting Point",
      clickFunction: pingShoes,
      imgSrc: "/icons/hoolahoop.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_hoolaPinger.mp3",
      cycler: useCycleList(["Ping Starting Point", "Ping Cochonnet"]),
      modes: ["All", "Dev", "Testing", "Player", "S2", "S1", "Exhibition"],
    },
  ],
  [
    {
      name: "Switch Boule Fokuss <3",
      deactivated: computed(() => store.boulesCount < 1),
      clickFunction: () => {
        const currentBouleFocuserFunction = flatPages.find(
          (item) => item.name === store.bouleFocuserCycler.state
        );
        currentBouleFocuserFunction.clickFunction();
        if (store.bouleFocuserCycler.index === store.boulesCount - 1) {
          store.bouleFocuserCycler.go(0);
        } else {
          store.bouleFocuserCycler.next();
        }
        console.log(currentBouleFocuserFunction)

      },
      imgSrc: "/icons/heart.png",
      html: "Switch Boule Fokuss <3",
      explanationSrc: "/sounds/elevenlabs/explanation_toggleBouleFocuser.mp3",
      cycler: useCycleList(["Switch Boule Fokuss <3"]),
      modes: ["All", "Dev", "Testing", "Player", "S1", "Exhibition"],
    },
    {
      name: "Focus Big Boules",
      deactivated: computed(() => store.boulesCount < 1),
      clickFunction: () => click_bouleFocuser("all"),
      imgSrc: "/icons/focusAllBlur2.png",
      html: "Focus all Boules",
      cycler: useCycleList([
        "Focus Big Boules",
        "Focus Cochonnet",
        "Focus Boule 1",
        "Focus Boule 2",
        "Focus Boule 3",
        "Focus Boule 4",
        "Focus Boule 5",
        "Focus Boule 6",
      ]),
      modes: ["All", "Dev", "Testing", "SBV", "Player", "S1", "Exhibition"],
    },
    {
      name: "Focus Team Blue",
      clickFunction: () => {
        const blueBoules = store.boulesToDisplay
          .map((boule, index) => ({ index, class: boule.class }))
          .filter(boule => boule.class === "light")
          .map(boule => boule.index);
        store.selectedBoules = blueBoules;
        store.unmute3dAudio()
        store.volumePulse++;
      },
      imgSrc: "/icons/focusBlueBlur.png",
      html: "Focus Team Blue",
      cycler: useCycleList(["Focus Team Blue"]),
      modes: ["All", "Dev", "Testing", "SBV", "Player", "S1", "Exhibition"],
    },
    {
      name: "Focus Team Red",
      clickFunction: () => {
        const redBoules = store.boulesToDisplay
          .map((boule, index) => ({ index, class: boule.class }))
          .filter(boule => boule.class === "dark")
          .map(boule => boule.index);
        store.selectedBoules = redBoules;
        store.unmute3dAudio()
        store.volumePulse++;
      },
      imgSrc: "/icons/focusRedBlur.png",
      html: "Focus Team Red",
      cycler: useCycleList(["Focus Team Red"]),
      modes: ["All", "Dev", "Testing", "SBV", "Player", "S1", "Exhibition"],
    },
  ],
  [
    {
      name: "Focus Cochonnet",
      deactivated: computed(() => store.boulesCount < 1),
      clickFunction: () => click_bouleFocuser(0),
      imgSrc: "/icons/focusCochonnet.svg",
      html: "Focus Cochonnet",
      cycler: useCycleList([
        "Focus Cochonnet",
        "Focus Big Boules",
        "Focus Boule 1",
        "Focus Boule 2",
        "Focus Boule 3",
        "Focus Boule 4",
        "Focus Boule 5",
        "Focus Boule 6",
      ]),
      modes: ["All", "Dev", "Testing", "Player", "Exhibition"],
    },
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
        "Focus Big Boules",
      ]),
      modes: ["All", "Dev", "Testing", "Player", "Exhibition"],
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
      modes: ["All", "Dev", "Testing", "Player", "Exhibition"],
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
      modes: ["All", "Dev", "Testing", "Player", "Exhibition"],
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
      modes: ["All", "Dev", "Testing", "SBV", "Player", "Exhibition"],
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
      modes: ["All", "Dev", "Testing", "SBV", "Player", "Exhibition"],
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
      modes: ["All", "Dev", "Testing", "SBV", "Player", "Exhibition"],
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
      modes: ["All", "Dev", "Testing", "SBV", "Player", "Exhibition"],
    },
  ],
  [
    {
      name: "Pirate Radar Old",
      clickFunction: startCocho,
      explanationSrc: "/sounds/elevenlabs/explanation_pirateRadar.mp3",
      cycler: useCycleList(["Pirate Radar Old", "Boomerang", "Stalefish 180"]),
      modes: ["All", "Dev", "Testing", "Player", "Exhibition"],
    },
    {
      name: "Boomerang",
      clickFunction: flyCochoBack,
      imgSrc: "/icons/boomerang1.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_boomerang.mp3",
      cycler: useCycleList(["Boomerang", "Pirate Radar Old"]),
      modes: ["All", "Dev", "Testing", "Exhibition"],
    },
    {
      name: "Stalefish 180",
      clickFunction: click_stalefish180,
      explanationSrc: "/sounds/elevenlabs/explanation_throughTurnAndBack.mp3",
      cycler: useCycleList(["Stalefish 180"]),
      modes: ["All", "Dev", "Testing", "Exhibition"],
    },
  ],
  [
    {
      name: "Toggle mute",
      clickFunction: click_toggleMute,
      html: "Toggle mute",
      cycler: useCycleList(["Toggle mute"]),
      modes: ["All", "Dev", "Testing", "Referee", "S1", "Exhibition"],
    },
    {
      name: "Refresh page",
      clickFunction: refreshPage,
      html: "F5",
      explanationSrc: "/sounds/elevenlabs/explanation_pageRefresher.mp3",
      cycler: useCycleList(["Refresh page"]),
      modes: ["All", "Dev", "Testing", "Exhibition", "S1"],
    },
    {
      name: "Toggle Sky",
      clickFunction: () => {
        store.isSky = !store.isSky;
      },
      html: "Toggle Sky",
      cycler: useCycleList(["Toggle Sky"]),
      modes: ["All", "Dev", "Testing", "Exhibition", "S1", "S2"],
    },
    {
      name: "Exhibition Mode",
      clickFunction: () => {
        const findExhibitionModeIndex = modesList.findIndex(
          (mode) => mode.name === "Exhibition"
        );
        store.modesCycler.go(findExhibitionModeIndex);
        speak("Exhibition mode activated");
      },
      html: "Activate Exhibition Mode",
      cycler: useCycleList(["Exhibition Mode"]),
      modes: ["All", "Dev", "Testing", "Referee", "S1", "S2"],
    },
  ],
  [
    {
      name: "Show Stunden Orientation",
      clickFunction: () => {
        store.showStundenOrientation = !store.showStundenOrientation;
      },
      html: "Toggle watch orientation",
      cycler: useCycleList(["Show Stunden Orientation"]),
      modes: ["All", "Dev", "Testing", "Player", "Exhibition"],
    },

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
      modes: ["All", "Dev", "Testing", "SBV", "Player", "Exhibition"],
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
      modes: ["All", "Dev", "Testing", "SBV", "Player", "Exhibition"],
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
        "Focus Big Boules",
      ]),
      modes: ["All", "Dev", "Testing", "Player", "Exhibition"],
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
        "Focus Big Boules",
      ]),
      modes: ["All", "Dev", "Testing", "Player", "Exhibition"],
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
        "Focus Big Boules",
      ]),
      modes: ["All", "Dev", "Testing", "Player", "Exhibition"],
    },
    {
      name: "Quick Focuser",
      clickFunction: () => {
        if (store.volume === 0) {
          store.volume = 1;
          let timeout = 2000;
          const prevSelectedBoules = store.selectedBoules;
          const amountOfBoulesToDisplay = store.boulesToDisplay.length;
          for (let i = 0; i < amountOfBoulesToDisplay; i++) {
            setTimeout(() => {
              store.focusBoules(i);
            }, i * timeout);
            if (i === amountOfBoulesToDisplay - 1) {
              setTimeout(() => {
                if (prevSelectedBoules.length > 1) {
                  click_bouleFocuser("all");
                } else if (prevSelectedBoules.length === 1) {
                  click_bouleFocuser(prevSelectedBoules[0]);
                } else {
                  console.log("no boules were selected");
                }
                store.volume = 0;
              }, i * timeout + timeout);
            }
          }
        }
      },
      imgSrc: "/icons/focusLoopGross.svg",
      html: "Quick Focuser",
      cycler: useCycleList(["Quick Focuser"]),
      modes: ["All", "Dev", "Testing", "SBV", "Player", "Exhibition"],
    },
  ],
  [
    {
      name: "Scan and count points",
      clickFunction: scanForPoints,
      html: "Scan and count points",
      cycler: useCycleList([
        "Scan and count points",
        "Set points from latest scan",
      ]),
      modes: ["All", "Dev", "Testing", "Referee", "Solo"],
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
          sendGlobalShotsTaken();
        } else {
          store.resetShotsTaken();
          sendGlobalShotsTaken();
        }
      },
      html: computed(() =>
        store.globalShotsTaken < 7
          ? store.globalShotsTaken
          : "Reset shots taken"
      ),
      cycler: useCycleList(["Increment shots taken"]),
      modes: ["All", "Dev", "Testing", "Referee", "Exhibition"],
    },
  ],
  [
    {
      name: "50 / 50 Coin Flip",
      clickFunction: tossCoin,
      imgSrc: coinImgSrc,
      // html: "Toss a coin and get heads or tails",
      explanationSrc: "/sounds/elevenlabs/explanation_tossCoin.mp3",
      cycler: useCycleList(["50 / 50 Coin Flip"]),
      modes: ["All", "Dev", "Testing", "S3", "Exhibition"],
    },

    {
      name: "Ping Starting Point",
      clickFunction: pingShoes,
      imgSrc: "/icons/hoolahoop.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_hoolaPinger.mp3",
      cycler: useCycleList(["Ping Starting Point", "Ping Cochonnet"]),
      modes: ["All", "Dev", "Testing", "Player", "S3", "Exhibition"],
    },
    {
      name: "Toggle Top Camera",
      clickFunction: click_toggleTopCameraSlider,
      imgSrc: "/icons/topGrid.svg",
      html: "Toggle Top Camera",
      cycler: useCycleList(["Toggle Top Camera"]),
      modes: ["All", "Dev", "Testing", "Player", "S3", "Exhibition"],
    },
    {
      name: "Scan Field",
      clickFunction: () => {
        console.log("open scan field")
        store.scannerOpen = !store.scannerOpen
        // store.predictionVisualiser = !store.predictionVisualiser;
      },
      imgSrc: "/icons/scanField.svg",
      html: "Scan Field",
      cycler: useCycleList(["Scan Field"]),
      modes: ["All", "Dev", "Testing", "Referee", "S3", "Exhibition"],
    },
  ],
  [
    {
      name: "Boules Thrown (Round)",
      clickFunction: announceBallsPlayed,
      explanationSrc: "/sounds/elevenlabs/explanation_ballsShotAnnouncer.mp3",
      html: computedAnnounceBallsPlayedHtml,
      cycler: useCycleList(["Boules Thrown (Round)"]),
      modes: ["All", "Dev", "Testing", "S3", "Exhibition"],
    },
    {
      name: "Undo Last Increment",
      clickFunction: rewind,
      imgSrc: "/icons/rewind.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_rewinder.mp3",
      cycler: useCycleList(["Undo Last Increment"]),
      modes: ["All", "Dev", "Testing", "S3", "Exhibition"],
    },
    {
      name: "Increment Shots Team 1",
      clickFunction: incrementPlayer1,
      imgSrc: "/icons/plus.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_playerOneIncrementer.mp3",
      cycler: useCycleList([
        "Increment Shots Team 1",
      ]),
      modes: ["All", "Dev", "Testing", "Referee", "S3", "Exhibition"],
    },
    {
      name: "Increment Shots Team 2",
      clickFunction: incrementPlayer2,
      imgSrc: "/icons/plus.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_playerTwoIncrementer.mp3",
      cycler: useCycleList([
        "Increment Shots Team 2",
      ]),
      modes: ["All", "Dev", "Testing", "S3", "Exhibition"],
    },
  ],
  [
    {
      name: "Total Score (Game)",
      clickFunction: scoreStandings,
      html: computedScoreStandingsHtml,
      explanationSrc: "/sounds/elevenlabs/explanation_currentScore.mp3",
      cycler: useCycleList([
        "Total Score (Game)",
      ]),
      modes: ["All", "Dev", "Testing", "Referee", "S3", "Exhibition"],
    },
    {
      name: "Undo Last Increment",
      clickFunction: rewind,
      imgSrc: "/icons/rewind.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_rewinder.mp3",
      cycler: useCycleList(["Undo Last Increment"]),
      modes: ["All", "Dev", "Testing", "S3", "Exhibition"],
    },
    {
      name: "Increment Score Team 1",
      clickFunction: store.incrementPlayer1score,
      imgSrc: "/icons/plus.svg",
      html: "Increment Score Team 1",
      // explanationSrc: "/sounds/elevenlabs/explanation_playerOneIncrementer.mp3",
      cycler: useCycleList([
        "Increment Score Team 1",
      ]),
      modes: ["All", "Dev", "Testing", "Solo", "S3", "Exhibition"],
    },
    {
      name: "Increment Score Team 2",
      clickFunction: store.incrementPlayer2score,
      imgSrc: "/icons/plus.svg",
      html: "Increment Score Team 2",
      // explanationSrc: "/sounds/elevenlabs/explanation_playerTwoIncrementer.mp3",
      cycler: useCycleList([
        "Increment Score Team 2",
      ]),
      modes: ["All", "Dev", "Testing", "Solo", "S3", "Exhibition"],
    },
  ],
  [
    {
      name: "Pairing Status",
      clickFunction: qrStatus,
      explanationSrc:
        "/sounds/elevenlabs/explanation_pairingStatusAnnouncer.mp3",
      html: "Pairing-Status:<br />Connected to 3wasds3w2.",
      cycler: useCycleList(["Pairing Status", "Ping Connected Phone"]),
      modes: ["All", "Dev", "Testing", "QR", "S2", "Exhibition"],
    },
    {
      name: "Ping Connected Phone",
      clickFunction: pingPhone,
      imgSrc: "/icons/pingPhone.svg",
      html: "Ping Connected Phone",
      explanationSrc: "/sounds/elevenlabs/explanation_phonePinger.mp3",
      cycler: useCycleList(["Ping Connected Phone", "Pairing Status"]),
      modes: ["All", "Dev", "Testing", "QR", "S2", "Exhibition"],
    },
    {
      name: "Scan QR",
      clickFunction: scanqr,
      imgSrc: "/icons/scanQr1.svg",
      html: "Scan QR",
      explanationSrc: "/sounds/elevenlabs/explanation_qrScanner.mp3",
      cycler: useCycleList(["Scan QR", "Unique QR"]),
      modes: ["All", "Dev", "Testing", "QR", "S2", "Exhibition"],
    },
    {
      name: "Unique QR",
      clickFunction: qr,
      imgSrc: qrcode,
      html: "Unique QR",
      // html: computedUniqueQrHtml",
      explanationSrc: "/sounds/elevenlabs/explanation_uniqueQr.mp3",
      cycler: useCycleList(["Unique QR", "Scan QR"]),
      modes: ["All", "Dev", "Testing", "QR", "S2", "Exhibition"],
    },
  ],
  [
    {
      name: "Referee Mode",
      clickFunction: () => {
        const findRefereeModeIndex = modesList.findIndex(
          (mode) => mode.name === "Referee"
        );
        store.modesCycler.go(findRefereeModeIndex);
        speak("Referee mode activated");
      },
      html: "Activate Referee Mode",
      cycler: useCycleList(["Referee Mode"]),
      modes: ["All", "Dev", "Testing", "Player"],
    },
    {
      name: "Player Mode",
      clickFunction: () => {
        const findPlayerModeIndex = modesList.findIndex(
          (mode) => mode.name === "Player"
        );
        store.modesCycler.go(findPlayerModeIndex);
        speak("Player mode activated");
      },
      html: "Activate Player Mode",
      cycler: useCycleList(["Player Mode"]),
      modes: ["All", "Dev", "Testing", "Referee"],
    },
    {
      name: "All Mode",
      clickFunction: () => {
        const findAllModeIndex = modesList.findIndex(
          (mode) => mode.name === "All"
        );
        store.modesCycler.go(findAllModeIndex);
        speak("All mode activated");
      },
      html: "Activate All Mode",
      cycler: useCycleList(["All Mode"]),
      modes: ["Dev", "Testing", "Player", "Referee", "Solo", "All", "Exhibition"],
    },
    {
      name: "Change Mode",
      clickFunction: () => {
        speak(`Current mode is ${store.modesCycler.state.name}`);
      },
      html: computed(
        () =>
          `<div class='text-14px opacity-50'>${store.prevMode}</div><div class='text-16px'>${store.modesCycler.state.name}</div><div class='text-14px opacity-50'>${store.nextMode}</div>`
      ),
      cycler: useCycleList(["Change Mode"]),
      modes: ["All"],
    },
  ],
  [
    {
      name: "S1 Mode",
      clickFunction: () => {
        const findPlayerModeIndex = modesList.findIndex(
          (mode) => mode.name === "S1"
        );
        store.modesCycler.go(findPlayerModeIndex);
        speak("S1 mode activated");
      },
      html: "Activate S1 Mode",
      cycler: useCycleList(["S1 Mode"]),
      modes: ["All", "Dev", "Testing", "Referee", "Exhibition"],
    },
    {
      name: "S2 Mode",
      clickFunction: () => {
        const findS2ModeIndex = modesList.findIndex(
          (mode) => mode.name === "S2"
        );
        store.modesCycler.go(findS2ModeIndex);
        speak("S2 mode activated");
      },
      html: "Activate S2 Mode",
      cycler: useCycleList(["S2 Mode"]),
      modes: ["All", "Dev", "Testing", "Referee", "Exhibition"],
    },
    {
      name: "S3 Mode",
      clickFunction: () => {
        const findS3ModeIndex = modesList.findIndex(
          (mode) => mode.name === "S3"
        );
        store.modesCycler.go(findS3ModeIndex);
        speak("S3 mode activated");
      },
      html: "Activate S3 Mode",
      cycler: useCycleList(["S3 Mode"]),
      modes: ["All", "Dev", "Testing", "Referee", "Exhibition"],
    },
  ],
  [
    {
      name: "Mock Intersections",
      clickFunction: () => {
        store.mockIntersectionsCycler.next();
        store.setMockIntersections();
        sendRawIntersections();
      },
      html: "Mock Intersections",
      cycler: useCycleList(["Mock Intersections"]),
      modes: ["All", "Dev", "Testing", "Referee", "Assistant"],
    },
    {
      name: "Raw Intersections",
      clickFunction: sendRawIntersections,
      html: "Send scan results to other device",
      explanationSrc: "/sounds/elevenlabs/explanation_calibrator.mp3",
      cycler: useCycleList(["Raw Intersections"]),
      modes: ["All", "Dev", "Testing", "Referee"],
    },
    {
      name: "Toggle Reverse Field",
      deactivated: computed(() => !store.reverseField),
      clickFunction: () => {
        store.reverseField = !store.reverseField;
        sendReverseField();
        speak(`Field ${store.reverseField ? "reversed" : "normal"}`);
      },
      html: computed(
        () => `Toggle Reverse Field: ${store.reverseField ? "ON" : "OFF"}`
      ),
      cycler: useCycleList(["Toggle Reverse Field"]),
      modes: ["All", "Dev", "Testing", "Referee", "Exhibition"],
    },
  ],
  [
    {
      name: "Scan Field",
      deactivated: computed(() => !store.arSupported),
      clickFunction: scanCamera,
      imgSrc: "/icons/scanCamera.svg",
      explanationSrc: "/sounds/elevenlabs/explanation_scanField.mp3",
      cycler: useCycleList([
        "Scan Field",
        "Toggle Top Camera",
        "Scan and count points",
        "Set points from latest scan",
        "Increment shots taken",
      ]),
      modes: ["All", "Dev", "Testing", "Solo", "Referee", "Player"],
    },
    {
      name: "Prediction Visualiser",
      clickFunction: () => {
        store.predictionVisualiser = !store.predictionVisualiser;
      },
      html: "Prediction Visualiser",
      cycler: useCycleList(["Prediction Visualiser"]),
      modes: ["All", "Dev", "Testing", "Referee", "Exhibition", "S3"],
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
      cycler: useCycleList(["Change YOLO model"]),
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
        "Haptic Grid",
        "Haptic grid far",
      ]),
      modes: ["All", "Dev", "Testing", "Exhibition"],
    },
    {
      name: "Haptic grid far",
      clickFunction: click_hapticGridFar,
      html: "Haptic grid far",
      explanationSrc: "/sounds/elevenlabs/explanation_hapticGrid.mp3",
      cycler: useCycleList([
        "Haptic grid far",
        "Haptic Grid",
        "Haptic grid near",
      ]),
      modes: ["All", "Dev", "Testing", "Exhibition"],
    },
    {
      name: "Add function",
      clickFunction: addFunction,
      // imgSrc: "/icons/referenz.svg",
      html: "<div>+ Add</div>",
      cycler: useCycleList(["Add function"]),
      modes: ["All"],
    },
  ],
  [
    {
      name: "Exhibition Mode",
      clickFunction: () => {
        const findExhibitionModeIndex = modesList.findIndex(
          (mode) => mode.name === "Exhibition"
        );
        store.modesCycler.go(findExhibitionModeIndex);
        speak("Exhibition mode activated");
      },
      html: "Activate Exhibition Mode",
      cycler: useCycleList(["Exhibition Mode"]),
      modes: ["All", "Dev", "Testing", "Referee", "S3"],
    },
    {
      name: "Mock Intersections",
      clickFunction: () => {
        store.mockIntersectionsCycler.next();
        store.setMockIntersections();
        sendRawIntersections();
      },
      html: "Mock Intersections",
      cycler: useCycleList(["Mock Intersections"]),
      modes: ["All", "Dev", "Testing", "Referee", "Assistant", "Exhibition"],
    },
  ]
];

const flatPages = pages.flat();

const flatModes = ref(true);
let pagesBasedOnMode = ref([]);

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
  if (flatModes) {
    console.log("flatModes", flatModes);
    let tempFlatPagesBasedOnMode = [];
    pagesBasedOnMode.value.forEach((page) => {
      page.forEach((item) => {
        tempFlatPagesBasedOnMode.push(item);
      });
    });
    const tempLength = tempFlatPagesBasedOnMode.length;
    const itemsPerRow = 4;
    const rows = Math.ceil(tempFlatPagesBasedOnMode.length / itemsPerRow);

    let structuredPages = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < itemsPerRow; j++) {
        const index = i * itemsPerRow + j;
        if (index < tempFlatPagesBasedOnMode.length) {
          row.push(tempFlatPagesBasedOnMode[index]);
        }
      }
      structuredPages.push(row);
    }
    pagesBasedOnMode.value = structuredPages;
    console.log("Structured pages created:", pagesBasedOnMode.value);
    goTo(stepNames.value[0]);
  }
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

const getIconName = (imgSrc) => {
  const src = imgSrc.value ?? imgSrc;
  // Extract filename without extension from path like "/icons/gyros.svg"
  return src.split('/').pop().replace('.svg', '');
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
    store.showStundenOrientation = false
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
      // click_toggleMute();
      flyToCochonnet();
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

onKeyStroke(["v"], (e) => {
  store.volumePulse++;
});

onMounted(() => {
  goTo(stepNames.value[2]);

})
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
  mix-blend-mode: difference;
}

.container {
  mix-blend-mode: difference;
  height: 98.9dvh;
  width: 100%;
  padding: 5px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1px 1px;
  grid-auto-flow: row;
  grid-template-areas:
    ". ."
    ". .";
  user-select: none;
}

@keyframes fadeRedToWhite {
  0% { color: red; border-color: red; }
  100% { color: white; border-color: white; }
}

.scannerClass div {
  animation: fadeRedToWhite 2000ms ease-in-out forwards;
}

.big {
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  border: 3px solid var(--border-color);
  grid-row: span 2;
  grid-column: span 2;
  border-radius: 5px;

  >div {
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
  border: var(--border-width) solid var(--border-color);
  border-radius: 5px;
  user-select: none;
  pointer-events: auto;
  overflow: hidden;
  transition: all 50ms;
  position: relative;
  mix-blend-mode: difference;


  div {
    pointer-events: none;
    mix-blend-mode: difference;
  }

  &:first-child {
    border-bottom-right-radius: 60px;
    /* padding-left: 10px; */
  }

  &:nth-child(2) {
    border-bottom-left-radius: 60px;
  }

  &:nth-child(3) {
    border-top-right-radius: 60px;
    /* border-bottom-right-radius: 105px; */
  }

  &:nth-child(4) {
    border-top-left-radius: 60px;
    /* border-bottom-left-radius: 105px; */
  }
}

.center-circle {
  width: 200px;
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
  mix-blend-mode: difference;

  /* box-shadow: 0px 0px 35px 14px var(--center-circle-shadow) inset; */
  /* background-color: var(--center-circle-background); */

  >div {
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1;
    border-radius: 50%;
    width: 100%;
    border: var(--border-width) solid var(--center-circle-border);
    overflow: hidden;
    /* background-color: var(--center-circle-background); */
    color: var(--center-circle-border);
    /* color: transparent; */
    /* span {
      background-color: black;
      color: black;
      text-align: center;
      margin-top: -130px;
      height: 1000px;
      width: 2000px;
    } */
    /* opacity: 0.5; */
    background-color: red;
    background: linear-gradient(180deg, #F00 0%, #900 100%);
    background: transparent;
  }

  >* {
    pointer-events: none;
  }
}
</style>
