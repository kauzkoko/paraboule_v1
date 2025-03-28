import { acceptHMRUpdate } from "pinia";

export const useProtoStore = defineStore("protoStore", () => {
  const supabase = useSupabaseClient();
  let channel = supabase.channel("xr-controller");

  const bus = useEventBus("protoboules");

  const modelLoaded = ref(false);

  const player1Name = ref("Player 1");
  const player2Name = ref("Player 2");
  const player1Class = ref("dark");
  const player2Class = ref("light");
  const player1Score = ref(0);
  const player2Score = ref(0);

  const xrRunning = ref(false);
  const isScanningForPoints = ref(false);

  const isTopCamera = ref(false);

  const boules = ref([]);
  const sortedBoules = useSorted(boules, (a, b) => a.distance - b.distance);

  const { history } = useRefHistory(sortedBoules);
  const filteredBoules = computed(() => {
    // TODO: filter results
    // if (history.value.length > 1) {
    //   const currentLength = sortedBoules.value.length;
    //   const previousLength = history.value[1].snapshot.length;
    //   if (currentLength === previousLength) {
    //     console.log("Same length as previous snapshot", currentLength);
    //     return sortedBoules.value.filter((boule) => boule.distance < 30);
    //     bus.emit("stopXR");
    //   }
    // }
    return sortedBoules.value.filter((boule) => boule.distance < 30);
  });

  const { history: filteredBoulesHistory } = useRefHistory(filteredBoules);
  const boulesToDisplay = computed(() => {
    console.log("filteredBoulesHistory", filteredBoulesHistory.value);
    // console.log("filteredBoules", filteredBoules.value);
    if (sortedBoules.value.length > 0) {
      bus.emit("stopXR");
    }
    return filteredBoules.value;
  });

  const winnerPoints = ref(0);
  const winnerClass = ref("");
  watch(
    () => sortedBoules.value,
    (newSortedBoules) => {
      winnerPoints.value = 0;
      if (newSortedBoules.length < 2) return;
      const closestBoule = newSortedBoules[1];
      const closestClass = closestBoule.class;
      winnerPoints.value++;
      winnerClass.value = closestClass;
      if (
        newSortedBoules.length > 2 &&
        newSortedBoules[2].class === closestClass
      ) {
        winnerPoints.value++;
      }
      if (
        newSortedBoules.length > 3 &&
        newSortedBoules[3].class === closestClass
      ) {
        winnerPoints.value++;
      }
    }
  );
  const setScoreFromPoints = () => {
    if (player1Class.value === winnerClass.value) {
      player1Score.value += winnerPoints.value;
    } else {
      player2Score.value += winnerPoints.value;
    }
  };
  const score = computed(() => {
    return `${player1Score.value} - ${player2Score.value}`;
  });

  const currentHapticGrid = ref("near");
  const touchCounter = ref(0);

  const currentSoundSrc = ref("");

  const selectedBoules = ref([]);
  const {
    next: nextBoule,
    prev: prevBoule,
    go: goToBoule,
    index: currentlySelectedBouleIndex,
  } = useCycleList(boulesToDisplay);

  const bouleCount = computed(() => boulesToDisplay.value.length);

  const deviceId = Math.random().toString(36).substring(2, 15);

  const trigger = ref(0);
  const hihatTriggers = ref([0, 0, 0, 0]);

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
        boule.color = "#333";
        boule.player = 2;
      }

      tempBoules.push(boule);
    });
    boules.value = tempBoules;
    console.log("boules in setFromIntersections", boules.value);
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

  // mock boules
  rawIntersections.value = mockIntersections.value;

  const { alpha: gyroAlpha } = useDeviceOrientation();
  const alphaController = ref(false);
  const baseAlpha = ref(0);
  const isTouching = ref(false);
  const isTouchingSlider = ref(false);
  const helpers = ref(false);
  const showStundenOrientation = ref(false);
  const volume = ref(0);

  const player1AudioSrcs = ref([
    "/sounds/noise.mp3",
    "/sounds/noisehigh.mp3",
    "/sounds/noiselow.mp3",
    "/sounds/shortdeep.mp3",
    "/sounds/waterBig.m4a",
    "/sounds/waterMedium.m4a",
    "/sounds/waterBigger.m4a",
    "/sounds/noz.mp3",
    "/sounds/noz2.mp3",
  ]);
  const player2AudioSrcs = ref([
    "/sounds/noise.mp3",
    "/sounds/noisehigh.mp3",
    "/sounds/noiselow.mp3",
    "/sounds/shortdeep.mp3",
    "/sounds/waterBig.m4a",
    "/sounds/waterMedium.m4a",
    "/sounds/waterBigger.m4a",
    "/sounds/noz.mp3",
    "/sounds/noz2.mp3",
  ]);
  const player1AudioSrc = ref("/sounds/noise.mp3");
  const player2AudioSrc = ref("/sounds/waterBig.mp4");

  watch(player1AudioSrc, () => {
    trigger.value++;
  });
  watch(player2AudioSrc, () => {
    trigger.value++;
  });

  const lastPlayer1AudioSrc = computed(() => {
    const currentPlayer1Index = player1AudioSrcs.value.findIndex(
      (src) => src === player1AudioSrc.value
    );
    const previousPlayer1AudioSrc =
      currentPlayer1Index > 0
        ? player1AudioSrcs.value[currentPlayer1Index - 1]
        : player1AudioSrcs.value[player1AudioSrcs.value.length - 1];
    return previousPlayer1AudioSrc;
  });

  const nextPlayer1AudioSrc = computed(() => {
    const currentPlayer1Index = player1AudioSrcs.value.findIndex(
      (src) => src === player1AudioSrc.value
    );
    const nextPlayer1AudioSrc =
      currentPlayer1Index < player1AudioSrcs.value.length - 1
        ? player1AudioSrcs.value[currentPlayer1Index + 1]
        : player1AudioSrcs.value[0];
    return nextPlayer1AudioSrc;
  });

  const lastPlayer2AudioSrc = computed(() => {
    const currentPlayer2Index = player2AudioSrcs.value.findIndex(
      (src) => src === player2AudioSrc.value
    );
    const previousPlayer2AudioSrc =
      currentPlayer2Index > 0
        ? player2AudioSrcs.value[currentPlayer2Index - 1]
        : player2AudioSrcs.value[player2AudioSrcs.value.length - 1];
    return previousPlayer2AudioSrc;
  });

  const nextPlayer2AudioSrc = computed(() => {
    const currentPlayer2Index = player2AudioSrcs.value.findIndex(
      (src) => src === player2AudioSrc.value
    );
    const nextPlayer2AudioSrc =
      currentPlayer2Index < player2AudioSrcs.value.length - 1
        ? player2AudioSrcs.value[currentPlayer2Index + 1]
        : player2AudioSrcs.value[0];
    return nextPlayer2AudioSrc;
  });

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

  return {
    boules,
    deviceId,
    rawIntersections,
    mockIntersections,
    predictions,
    planeDetected,
    xrRunning,
    helpers,
    sortedBoules,
    filteredBoules,
    boulesToDisplay,
    bouleCount,
    goToBoule,
    nextBoule,
    currentlySelectedBouleIndex,
    modelLoaded,
    hihatTriggers,
    player1Score,
    player2Score,
    isScanningForPoints,
    score,
    winnerPoints,
    winnerClass,
    player1Name,
    player2Name,
    player1Class,
    player2Class,
    setScoreFromPoints,
    currentHapticGrid,
    touchCounter,
    currentSoundSrc,
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
    selectedBoules,
    player1AudioSrc,
    player2AudioSrc,
    player1AudioSrcs,
    player2AudioSrcs,
    lastPlayer1AudioSrc,
    lastPlayer2AudioSrc,
    nextPlayer1AudioSrc,
    nextPlayer2AudioSrc,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProtoStore, import.meta.hot));
}
