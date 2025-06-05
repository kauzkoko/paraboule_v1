import { acceptHMRUpdate } from "pinia";

interface Boule {
  x: number;
  y: number;
  z?: number;
  color: string;
  size: number;
  player: number;
  class: string;
  distance: number;
  sortingIndex?: number;
  rank?: number;
}

interface RawIntersection {
  x: number;
  y: number;
  z: number;
  class: string;
}

export const useProtoStore = defineStore("protoStore", () => {
  const { sendNewScore, sendPlayersShotsTaken } = useScoreController();
  const { sendSelectedBoules } = useFocusController();

  const bus = useEventBus("protoboules");

  const modesCycler = useCycleList(modesList);
  const initIndex = modesList.findIndex((mode) => mode.name === "S1");
  modesCycler.go(initIndex);

  const prevMode = computed(() => {
    const currentIndex = modesCycler.index.value;
    const lastIndex = modesList.length - 1;
    if (currentIndex === 0) return modesList[lastIndex].name;
    return modesList[currentIndex - 1].name;
  });

  const nextMode = computed(() => {
    const currentIndex = modesCycler.index.value;
    const lastIndex = modesList.length - 1;
    if (currentIndex === lastIndex) return modesList[0].name;
    return modesList[currentIndex + 1].name;
  });

  const predictionVisualiser = ref(false);

  const predictionTo3d = ref(false);

  const lookAlongCycler = useCycleList([
    "Look along 12 o'clock",
    "Look along 3 o'clock",
    "Look along 6 o'clock",
    "Look along 9 o'clock",
  ]);

  // score / players
  const players = ref({
    player1: {
      name: "Player 1",
      shotsTaken: 0,
      class: "dark",
      audioCycler: useCycleList(soundSrcs, {
        initialValue: soundSrcs.find(src => src.includes("raman1")),
      }),
      score: 0,
      color: "#ff0000",
      colorCode: "#ff0000",
      colorName: "red",
    },
    player2: {
      name: "Player 2",
      shotsTaken: 0,
      class: "light",
      audioCycler: useCycleList(soundSrcs, { initialValue: soundSrcs.find(src => src.includes("raman2")) }),
      score: 0,
      color: "#0000ff",
      colorCode: "#0000ff",
      colorName: "blue",
    },
  });

  const previousWinner = ref("1");
  const previousWinnerScore = ref(0);
  const previousLoserScore = ref(0);
  const gameOver = ref(false);
  const incrementPlayer1score = () => {
    if (gameOver.value) gameOver.value = false;
    players.value.player1.score++;
    sendNewScore();
    if (players.value.player1.score === 13) {
      resetGame();
    }
  };

  const incrementPlayer2score = () => {
    if (gameOver.value) gameOver.value = false;
    players.value.player2.score++;
    if (players.value.player2.score === 13) {
      resetGame();
    }
  };

  const resetGame = () => {
    gameOver.value = true;
    previousWinner.value = players.value.player2.score > players.value.player1.score ? "2" : "1";
    previousWinnerScore.value = players.value.player2.score > players.value.player1.score ? players.value.player2.score : players.value.player1.score;
    previousLoserScore.value = players.value.player2.score > players.value.player1.score ? players.value.player1.score : players.value.player2.score;
    players.value.player1.shotsTaken = 0;
    players.value.player2.shotsTaken = 0;
    players.value.player1.score = 0;
    players.value.player2.score = 0;
    sendNewScore();
  }

  const incrementPlayer1shotsTaken = () => {
    if (
      players.value.player1.shotsTaken === 3 &&
      players.value.player2.shotsTaken === 3
    ) {
      players.value.player1.shotsTaken = 0;
      players.value.player2.shotsTaken = 0;
      sendPlayersShotsTaken();
    }
    if (players.value.player1.shotsTaken < 3) {
      players.value.player1.shotsTaken++;
      sendPlayersShotsTaken();
    }
  };

  const incrementPlayer2shotsTaken = () => {
    if (
      players.value.player2.shotsTaken === 3 &&
      players.value.player1.shotsTaken === 3
    ) {
      players.value.player2.shotsTaken = 0;
      players.value.player1.shotsTaken = 0;
      sendPlayersShotsTaken();
    }
    if (players.value.player2.shotsTaken < 3) {
      players.value.player2.shotsTaken++;
      sendPlayersShotsTaken();
    }
  };

  const globalShotsTaken = ref(0);
  const resetShotsTaken = () => {
    globalShotsTaken.value = 0;
  };

  const reverseField = ref(false);

  const isSearching = ref(true);
  const boules = ref<Boule[]>([]);
  const boulesCount = ref(0);
  const sortedBoules = useSorted(boules, (a, b) => a.distance - b.distance);
  const { history: sortedBoulesHistory } = useRefHistory(sortedBoules);
  const filteredBoules = computed(() => {
    // return sortedBoules.value.filter((boule) => boule.distance < 30);
    if (reverseField.value) {
      return sortedBoules.value.map((boule) => {
        return {
          ...boule,
          x: boule.x * -1,
          y: boule.y * -1,
        };
      });
    } else {
      // First, get all boules of each player class and sort them by distance
      const player1Boules = sortedBoules.value
        .filter(b => b.class === "dark")
        .sort((a, b) => a.distance - b.distance);
      const player2Boules = sortedBoules.value
        .filter(b => b.class === "light")
        .sort((a, b) => a.distance - b.distance);

      return sortedBoules.value.map((boule, index) => {
        let rank = 0;
        if (boule.class === "dark") {
          rank = player1Boules.findIndex(b => b === boule) + 1;
        } else if (boule.class === "light") {
          rank = player2Boules.findIndex(b => b === boule) + 1;
        }

        return {
          ...boule,
          sortingIndex: index,
          rank: rank || 0, // 0 for cochonnet
        };
      });
    }
  });
  const { history: filteredBoulesHistory } = useRefHistory(filteredBoules);
  const boulesToDisplay = computed(() => {
    const amountBoulesAndCochonnet = filteredBoules.value.length;
    boulesCount.value = amountBoulesAndCochonnet;
    const amountOnlyBoules = amountBoulesAndCochonnet - 1;
    const maxBoulesAmount = globalShotsTaken.value;
    if (amountOnlyBoules <= maxBoulesAmount) {
      // console.log("filteredBoulesHistory.value.length",filteredBoulesHistory.value.length);
      if (filteredBoulesHistory.value.length > 1) isSearching.value = false;
      // bus.emit("stopXR");
    }
    return filteredBoules.value;
  });

  const bouleFocuserCycler = useCycleList([
    "Focus Cochonnet",
    "Focus Boule 1",
    "Focus Boule 2",
    "Focus Boule 3",
    "Focus Boule 4",
    "Focus Boule 5",
    "Focus Boule 6",
    // "Focus Big Boules",
  ]);

  // yolo
  const modelLoaded = ref(false);
  const modelWorkerId = ref(null);
  const init = async () => {
    const { startWorker } = await useInference();
    // await startWorker();

    arSupported.value =
      (await navigator.xr?.isSessionSupported("immersive-ar")) ?? false;
    // console.log("arSupported", arSupported.value);
    // if (arSupported.value) {
    //   await startWorker();
    // }
  };

  const baboucheModels = yoloModels.filter(
    (model) => model.name === "babouche-hzhjy"
  );
  const boloboloModels = yoloModels.filter(
    (model) => model.name === "bolobolo"
  );

  const yoloModelCycler = useCycleList(boloboloModels, {
    initialValue: boloboloModels[0],
  });
  const prevYoloModel = computed(() => {
    const currentIndex = yoloModelCycler.index.value;
    const lastIndex = yoloModels.length - 1;
    if (currentIndex === 0) return yoloModels[lastIndex].id;
    return yoloModels[currentIndex - 1].id;
  });
  const nextYoloModel = computed(() => {
    const currentIndex = yoloModelCycler.index.value;
    const lastIndex = yoloModels.length - 1;
    if (currentIndex === lastIndex) return yoloModels[0].id;
    return yoloModels[currentIndex + 1].id;
  });
  watch(yoloModelCycler.index, async () => {
    const { startWorker, stopWorker } = await useInference();
    await stopWorker();
    await startWorker();
  });

  // xr
  const isScanningForPoints = ref(false);
  const xrRunning = ref(false);
  const arSupported = ref(false);
  const rawIntersections = ref<RawIntersection[]>([]);
  const mockIntersectionsCycler = useCycleList(mockIntersections);
  const predictions = ref([]);
  const planeDetected = ref(false);

  // player sounds
  const soundComposables = soundSrcs.map((soundSrc) =>
    useSoundComposable(soundSrc)
  );
  const playSoundBySrc = (soundSrc: string, duration = 0) => {
    const soundIndex = soundSrcs.indexOf(soundSrc);
    if (soundIndex !== -1) {
      if (soundComposables[soundIndex]) {
        soundComposables[soundIndex].play();
      }
    }
  };

  const { undo } = useRefHistory(players, {
    deep: true,
  });
  const undoPlayers = () => {
    undo();
    sendPlayersShotsTaken();
  };

  const currentSoundPlayer1 = computed(() => {
    return players.value.player1.audioCycler.state;
  });
  const currentSoundPlayer2 = computed(() => {
    return players.value.player2.audioCycler.state;
  });
  const prevSoundPlayer1 = computed(() => {
    const currentIndex = players.value.player1.audioCycler.index;
    const lastIndex = soundSrcs.length - 1;
    if (currentIndex === 0) return soundSrcs[lastIndex];
    return soundSrcs[currentIndex - 1];
  });
  const nextSoundPlayer1 = computed(() => {
    const currentIndex = players.value.player1.audioCycler.index;
    const lastIndex = soundSrcs.length - 1;
    if (currentIndex === lastIndex) return soundSrcs[0];
    return soundSrcs[currentIndex + 1];
  });
  const prevSoundPlayer2 = computed(() => {
    const currentIndex = players.value.player2.audioCycler.index;
    const lastIndex = soundSrcs.length - 1;
    if (currentIndex === 0) return soundSrcs[lastIndex];
    return soundSrcs[currentIndex - 1];
  });
  const nextSoundPlayer2 = computed(() => {
    const currentIndex = players.value.player2.audioCycler.index;
    const lastIndex = soundSrcs.length - 1;
    if (currentIndex === lastIndex) return soundSrcs[0];
    return soundSrcs[currentIndex + 1];
  });
  // find better solution
  watch(currentSoundPlayer1, (newSound) => {
    toggle3dAudio();
    setTimeout(() => {
      toggle3dAudio();
    }, 100);
  });
  watch(currentSoundPlayer2, (newSound) => {
    toggle3dAudio();
    setTimeout(() => {
      toggle3dAudio();
    }, 100);
  });


  // score / winner
  const roundWinnerPoints = ref(0);
  const roundWinnerClass = ref("");
  watch(
    () => boulesToDisplay.value,
    (newBoules) => {
      roundWinnerPoints.value = 0;
      if (newBoules.length < 2) {
        return;
      }
      const closestBoule = newBoules[1];
      const closestClass = closestBoule.class;
      roundWinnerPoints.value++;
      roundWinnerClass.value = closestClass;
      if (newBoules.length > 2 && newBoules[2].class === closestClass) {
        roundWinnerPoints.value++;
      }
      if (newBoules.length > 3 && newBoules[3].class === closestClass) {
        roundWinnerPoints.value++;
      }
    }
  );
  const setScoreFromPoints = () => {
    if (players.value.player1.class === roundWinnerClass.value) {
      players.value.player1.score += roundWinnerPoints.value;
    } else {
      players.value.player2.score += roundWinnerPoints.value;
    }
    sendNewScore();
  };

  const score = computed(() => {
    return `${players.value.player1.score} - ${players.value.player2.score}`;
  });

  const volumePulse = ref(0);
  const selectedBoules = ref([]);
  const {
    next: nextBoule,
    prev: prevBoule,
    go: goToBoule,
    index: currentlySelectedBouleIndex,
  } = useCycleList(boulesToDisplay);

  const focusBoules = (bouleIndex) => {
    if (bouleIndex === "all")
      selectedBoules.value = boulesToDisplay.value
        .map((_, index) => index)
        .slice(1);
    else if (boulesToDisplay.value.length >= bouleIndex)
      selectedBoules.value = [bouleIndex];
    else {
      // console.log("bouleIndex out of range", bouleIndex);
    }
    // volumePulse.value++;
    // sendSelectedBoules();
  };

  const touchCounter = ref(0);
  const currentGlobalSoundSrc = ref("");

  // qr
  const deviceId = Math.random().toString(36).substring(2, 15);

  // animations
  const isTopCamera = ref(false);
  const isTouchingTopCameraSlider = ref(false);
  const isTappingOnTopCameraSlider = ref(false);

  // gyro
  const { alpha: gyroAlpha } = useDeviceOrientation();
  const alphaController = ref(false);
  const baseAlpha = ref(0);

  // haptic
  const isTouching = ref(false);
  const currentHapticGrid = ref("near");
  const isTappingOnHaptic = ref(false);

  // slider
  const isTouchingSlider = ref(false);
  const isTouchingSliderTimeout = ref(true)
  const isTappingOnSlider = ref(false);

  // stundenorientation
  const hihatTriggers = ref([0, 0, 0, 0]);
  const showStundenOrientation = ref(false);

  // sky
  const isSky = ref(false);
  watch(isSky, () => {
    const borderColor = useCssVar('--border-color')
    if (isSky.value) borderColor.value = '#666'
    else borderColor.value = 'red'
  })

  // positional audio
  const trigger = ref(0);
  const helpers = ref(false);
  const volume = ref(1);
  const mute3dAudio = () => {
    volume.value = 0;
  };

  let unmuteCounter = 0;
  const unmute3dAudio = () => {
    volume.value = 1;
    if (unmuteCounter === 0) {
      selectedBoules.value = boulesToDisplay.value
        .map((_, index) => index)
        .slice(1);
    }
    unmuteCounter++;
  };
  // unmute3dAudio();

  const toggle3dAudio = () => {
    if (volume.value === 0) {
      unmute3dAudio();
    } else {
      mute3dAudio();
    }
  };

  const setFromIntersections = () => {
    let cochonnet = rawIntersections.value.find(
      (item) => item.class === "cochonnet" || item.class === "cochonnette"
    );
    let offsetX = 0;
    let offsetY = 0;
    let scaler = 23;
    if (cochonnet) {
      offsetX = cochonnet.x * scaler;
      offsetY = cochonnet.z * scaler;
    }
    let tempBoules: Boule[] = [];
    rawIntersections.value.forEach((item) => {
      let scaledX = item.x * scaler - offsetX;
      let scaledY = item.z * scaler - offsetY;
      let distance = Math.sqrt(scaledX * scaledX + scaledY * scaledY);
      let boule = {
        x: scaledX,
        y: scaledY,
        color: "yellow",
        size: 1,
        player: 3,
        class: item.class,
        distance: distance,
      };

      if (item.class === "cochonnet") {
        boule.color = "orange";
        boule.size = 0.4;
        boule.player = 0;
      } else if (item.class === "dark") {
        boule.color = "#111";
        boule.player = 1;
      } else if (item.class === "light") {
        boule.color = "#555";
        boule.player = 2;
      }

      tempBoules.push(boule);
    });
    boules.value = tempBoules;
  };

  watch(rawIntersections, (newIntersections) => {
    if (newIntersections) {
      setFromIntersections();
    }
  });

  const setIntersectionsByNumber = (number: number) => {
    rawIntersections.value = mockIntersections[number]
    if (number === 1) focusBoules(0)
    else {
      setTimeout(() => {
        focusBoules('all')
      }, 1000)
    }
  }

  const checkTimes = [7, 66, 116]
  bus.on((message, payload) => {
    if (message === "shootFilmBouleSmartphone") {
      console.log("shootFilmBouleSmartphone", payload)
      if (payload.playedCount === 0 || payload.playedCount % 2 === 0) {
        if (payload.scheduledTime === checkTimes[0]) {
          setIntersectionsByNumber(2)
        }
        if (payload.scheduledTime === checkTimes[1]) {
          setIntersectionsByNumber(3)
        }
        if (payload.scheduledTime === checkTimes[2]) {
          setIntersectionsByNumber(4)
        }
      } else if (payload.playedCount % 2 === 1) {
        if (payload.scheduledTime === checkTimes[0]) {
          setIntersectionsByNumber(5)
        }
        if (payload.scheduledTime === checkTimes[1]) {
          setIntersectionsByNumber(6)
        }
        if (payload.scheduledTime === checkTimes[2]) {
          setIntersectionsByNumber(7)
          setTimeout(() => {
            setTimeout(() => {
              setIntersectionsByNumber(0)
              setTimeout(() => {
                setIntersectionsByNumber(1)
              }, 5000)
            }, 7000)
          }, 40000)
        }
      }
    }
  });


  const setMockIntersections = () => {
    // console.log("setMockIntersections", mockIntersectionsCycler.state.value);
    rawIntersections.value = mockIntersectionsCycler.state.value;
  };
  // setMockIntersections();

  const infoStepper = useStepper({
    'welcome': {
      title: 'Welcome to',
      img: '/icons/paraboule_black.svg',
      // subtitle: 'PARABOULE is an exploration<br> of spatial audio and object detection in Pétanque. It is built with accessibility in mind and assists you in playing Boule by binaural hearing.',
      subtitle: 'PARABOULE is an assistive tool to play Pétanque by binaural hearing and haptic feedback. <span class="important text-red!">This is the exhibition version of the app.</span>',
      bottomText: 'PARABOULE explores<br> spatial audio and object detection technologies in Pétanque. It is built with accessibility considerations in mind.'
    },
    'role': {
      'S1': {
        title: 'Smartphone 1:<br>The shot',
        upperText: 'You are using the first of three smartphone interfaces in the exhibition. Each smartphone demonstrates specific functions of PARABOULE being used in a real game of Pétanque.',
        bottomText: 'This smartphone lets you analyze the game situation through spatial audio and haptic feedback. The feedback will help you understand the game situation and make strategic decisions in a real game of Pétanque.'
      },
      'S2': {
        title: 'Smartphone 2:<br>Orientation',
        upperText: 'You are using the second of three smartphone interfaces in the exhibition. Each smartphone demonstrates specific functions of PARABOULE being used in a real game of Pétanque.',
        bottomText: 'This smartphone shows features that help you identify the playground and starting point without using sight. It also demonstrates how to connect to other smartphones running PARABOULE.'
      },
      'S3': {
        title: 'Smartphone 3:<br>The VAR',
        upperText: 'You are using the first of three smartphone interfaces in the exhibition. Each smartphone demonstrates specific functions of PARABOULE being used in a real game of Pétanque.',
        bottomText: 'This smartphone showcases the role of a VAR (Virtual Assistant Referee) in PARABOULE. The VAR is continuously scanning the Boule field and tracking the current score.',
        // additionalText: 'Use this smartphone to provide real-time data. This enables the player on Smartphone 1 to receive spatial audio feedback, helping them understand the positions of the boules and prepare for their next shot.'
      },
      'Empty': {
        title: 'Empty Title',
        upperText: '',
        bottomText: ''

      }
    },
    'functions': {
      title: 'How to use<br> the Buttons',
      subtitle: 'Each button triggers a function that demonstrates a specific feature of PARABOULE. <span class="important text-red!">You can always PRESS and HOLD on the button to hear what it is supposed to do and how it works.</span>',
    },
    'center-circle': {
      title: 'How to navigate<br> in the app',
      subtitle: 'A small circle in the middle is your main navigation aid in the app. Perform SWIPE gestures directly on its area to find your way around the app.',
    },
    'disclaimer': {
      title: 'Disclaimer',
      upperText: 'This version of PARABOULE is curated for exhibition purposes and, in this exact composition, is not intended for real-life gameplay. Many functions are staged, simplified or not implemented.',
      bottomText: 'This app is designed to make Pétanque accessible to visually impaired players. Every part of the interface should be fully usable without sight and support long-term use. Some elements may not be intuitively understandable in the exhibition setting.'
    }
  })

  const buttonTransition = ref(false);
  const buttonTransitionIndex = ref(1);
  const infoScreen = ref(true);

  return {
    yoloModelCycler,
    prevYoloModel,
    nextYoloModel,
    playSoundBySrc,
    modelWorkerId,
    modelLoaded,
    init,
    arSupported,
    xrRunning,
    isScanningForPoints,
    boules,
    deviceId,
    rawIntersections,
    mockIntersections,
    predictions,
    planeDetected,
    helpers,
    sortedBoules,
    filteredBoules,
    boulesToDisplay,
    goToBoule,
    nextBoule,
    selectedBoules,
    currentlySelectedBouleIndex,
    hihatTriggers,
    score,
    players,
    undoPlayers,
    currentSoundPlayer1,
    currentSoundPlayer2,
    prevSoundPlayer1,
    nextSoundPlayer1,
    prevSoundPlayer2,
    nextSoundPlayer2,
    setScoreFromPoints,
    currentGlobalSoundSrc,
    alphaController,
    baseAlpha,
    gyroAlpha,
    isTouching,
    isTouchingSlider,
    showStundenOrientation,
    trigger,
    volume,
    mute3dAudio,
    unmute3dAudio,
    toggle3dAudio,
    isTopCamera,
    boulesCount,
    currentHapticGrid,
    touchCounter,
    isTouchingTopCameraSlider,
    isTappingOnHaptic,
    isTappingOnSlider,
    isTappingOnTopCameraSlider,
    globalShotsTaken,
    resetShotsTaken,
    incrementPlayer1shotsTaken,
    incrementPlayer2shotsTaken,
    incrementPlayer1score,
    incrementPlayer2score,
    focusBoules,
    modesCycler,
    predictionVisualiser,
    predictionTo3d,
    reverseField,
    prevMode,
    nextMode,
    volumePulse,
    mockIntersectionsCycler,
    setMockIntersections,
    lookAlongCycler,
    bouleFocuserCycler,
    isSearching,
    isSky,
    infoStepper,
    buttonTransition,
    buttonTransitionIndex,
    infoScreen,
    gameOver,
    previousWinnerScore,
    previousLoserScore,
    previousWinner,
    isTouchingSliderTimeout,
    setIntersectionsByNumber,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProtoStore, import.meta.hot));
}
