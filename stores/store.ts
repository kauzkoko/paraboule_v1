import { acceptHMRUpdate } from "pinia";

export const useProtoStore = defineStore("protoStore", () => {
  const supabase = useSupabaseClient();
  let channel = supabase.channel("xr-controller");

  const modelLoaded = ref(false);

  const xrRunning = ref(false);
  const helpers = ref(true);

  // will be set from setFromIntersections
  const boules = ref([
    { id: 1, name: "Boule 1", color: "red", distance: 3 },
    { id: 2, name: "Boule 2", color: "blue", distance: 2 },
    { id: 3, name: "Boule 3", color: "green", distance: 1 },
  ]);
  const sortedBoules = useSorted(boules, (a, b) => a.distance - b.distance);
  const filteredBoules = computed(() =>
    sortedBoules.value.filter((boule) => boule.distance < 30)
  );
  const boulesToDisplay = computed(() => {
    console.log("filteredBoules", filteredBoules.value);
    return filteredBoules.value;
  });

  const {
    next: nextBoule,
    prev: prevBoule,
    go: goToBoule,
    index: currentlySelectedBouleIndex,
  } = useCycleList(boulesToDisplay);
  const bouleCount = computed(() => boulesToDisplay.value.length);

  const deviceId = Math.random().toString(36).substring(2, 15);

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
      z: -2.1185530158534984,
      class: "dark",
    },
    {
      x: 0.29827494002689575,
      y: 0.11757755279540984,
      z: -1.873205403607142,
      class: "light",
    },
    {
      x: 0.35239538925638664,
      y: 0.10841178894042934,
      z: -2.040454871744344,
      class: "dark",
    },
    {
      x: 0.40640927469181287,
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
    let scaler = 25;

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
      setFromIntersections(data.payload.rawIntersections);
    })
    .subscribe();

  // mock boules
  rawIntersections.value = mockIntersections.value;

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
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProtoStore, import.meta.hot));
}
