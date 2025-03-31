import { acceptHMRUpdate } from "pinia";

export const useProtoStore = defineStore("protoStore", () => {
  const supabase = useSupabaseClient();
  let channel = supabase.channel("xr-controller");

  const bus = useEventBus("protoboules");

  const soundSrcs = [
    "/sounds/noise.mp3",
    "/sounds/noisehigh.mp3",
    "/sounds/noiselow.mp3",
    "/sounds/shortdeep.mp3",
    "/sounds/waterBig.m4a",
    "/sounds/waterMedium.m4a",
    "/sounds/waterBigger.m4a",
    "/sounds/noz.mp3",
    "/sounds/noz2.mp3",
    "/sounds/strudel/c3major.mp3",
    "/sounds/strudel/e3major.mp3",
    "/sounds/strudel/g3major.mp3",
    "/sounds/strudel/startpoint.mp3",
  ];

  // score / players
  const players = ref({
    player1: {
      name: "Player 1",
      shotsTaken: 0,
      class: "dark",
      audioCycler: useCycleList(soundSrcs),
      score: 0,
    },
    player2: {
      name: "Player 2",
      shotsTaken: 0,
      class: "light",
      audioCycler: useCycleList(soundSrcs),
      score: 0,
    },
  });
  const globalShotsTaken = ref(0);
  const resetShotsTaken = () => {
    console.log("resetShotsTaken");
    globalShotsTaken.value = 0;
  };

  const boules = ref([]);
  const boulesCount = ref(0);
  const sortedBoules = useSorted(boules, (a, b) => a.distance - b.distance);
  const { history: sortedBoulesHistory } = useRefHistory(sortedBoules);
  const filteredBoules = computed(() => {
    return sortedBoules.value.filter((boule) => boule.distance < 30);
  });
  const { history: filteredBoulesHistory } = useRefHistory(filteredBoules);
  const boulesToDisplay = computed(() => {
    if (sortedBoules.value.length > 0) {
      bus.emit("stopXR");
    }
    boulesCount.value = filteredBoules.value.length;
    return filteredBoules.value;
  });

  // yolo
  const modelLoaded = ref(false);
  const modelWorkerId = ref(null);
  const init = async () => {
    const { startWorker } = await useInference();
    arSupported.value =
      (await navigator.xr?.isSessionSupported("immersive-ar")) ?? false;
    if (arSupported.value) {
      await startWorker();
    }
  };
  const yoloModels = [
    {
      name: "bolobolo",
      id: "24",
      modelId: "rf_li9xBZWuL5cSB9B343OFn9GGqpF2",
    },
    {
      name: "bolobolo",
      id: "25",
      modelId: "rf_li9xBZWuL5cSB9B343OFn9GGqpF2",
    },
    {
      name: "bolobolo",
      id: "26",
      modelId: "rf_li9xBZWuL5cSB9B343OFn9GGqpF2",
    },
    {
      name: "bolobolo",
      id: "27",
      modelId: "rf_li9xBZWuL5cSB9B343OFn9GGqpF2",
    },
  ];
  const yoloModelCycler = useCycleList(yoloModels);
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
  const rawIntersections = ref([]);
  const mockIntersections = ref([
    {
      x: 0.15217870875827644,
      y: 0.11757755279540989,
      z: -2.14242094133827,
      class: "cochonet",
    },
    {
      x: 0.3014103032020119,
      y: 0.11757755279540989,
      z: -2.3185530158534984,
      class: "dark",
    },
    {
      x: 0.019827494002689575,
      y: 0.13757755279540984,
      z: -1.873205403607142,
      class: "light",
    },
    {
      x: 0.35239538925638664,
      y: 0.050841178894042934,
      z: -2.040454871744344,
      class: "dark",
    },
    {
      x: 0.20640927469181287,
      y: 0.10841178894042956,
      z: -1.9825655394221926,
      class: "light",
    },
  ]);
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

  const { undo: undoPlayers } = useRefHistory(players, {
    deep: true,
  });

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
  const winnerPoints = ref(0);
  const winnerClass = ref("");
  watch(
    () => boulesToDisplay.value,
    (newBoules) => {
      winnerPoints.value = 0;
      if (newBoules.length < 2) return;
      const closestBoule = newBoules[1];
      const closestClass = closestBoule.class;
      winnerPoints.value++;
      winnerClass.value = closestClass;
      if (newBoules.length > 2 && newBoules[2].class === closestClass) {
        winnerPoints.value++;
      }
      if (newBoules.length > 3 && newBoules[3].class === closestClass) {
        winnerPoints.value++;
      }
    }
  );
  const setScoreFromPoints = () => {
    if (players.value.player1.class === winnerClass.value) {
      players.value.player1.score += winnerPoints.value;
    } else {
      players.value.player2.score += winnerPoints.value;
    }
  };
  const score = computed(() => {
    return `${players.value.player1.score} - ${players.value.player2.score}`;
  });


  const selectedBoules = ref([]);
  const {
    next: nextBoule,
    prev: prevBoule,
    go: goToBoule,
    index: currentlySelectedBouleIndex,
  } = useCycleList(boulesToDisplay);

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
  const isTappingOnSlider = ref(false);

  // stundenorientation
  const hihatTriggers = ref([0, 0, 0, 0]);
  const showStundenOrientation = ref(false);

  // positional audio
  const trigger = ref(0);
  const helpers = ref(false);
  const volume = ref(0);
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

  const toggle3dAudio = () => {
    if (volume.value === 0) {
      unmute3dAudio();
    } else {
      mute3dAudio();
    }
  };

  const setFromIntersections = () => {
    let cochonet = rawIntersections.value.find(
      (item) => item.class === "cochonet" || item.class === "cochonette"
    );
    let offsetX = 0;
    let offsetY = 0;
    let scaler = 23;
    if (cochonet) {
      offsetX = cochonet.x * scaler;
      offsetY = cochonet.z * scaler;
    }
    let tempBoules = [];
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

      if (item.class === "cochonet") {
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
      console.log("newIntersections", newIntersections);
      setFromIntersections();
    }
  });
  channel
    .on("broadcast", { event: "rawIntersections" }, (data) => {
      console.log("rawIntersections", data);
      rawIntersections.value = data.payload.rawIntersections;
    })
    .subscribe();
  rawIntersections.value = mockIntersections.value;

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
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProtoStore, import.meta.hot));
}
