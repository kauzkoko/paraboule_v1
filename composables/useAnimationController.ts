export function useAnimationController() {
  const bus = useEventBus("protoboules");
  const store = useProtoStore();

  const supabase = useSupabaseClient();
  let animationController = supabase.channel("animation-controller");
  animationController.subscribe();

  animationController
    .on("broadcast", { event: "flyToStart" }, (event) => {
      if (!includesArray.some(mode => store.modesCycler.state.name.includes(mode))) flyToStart(false);
    })
    .on("broadcast", { event: "flyToCochonnetAndBack" }, (event) => {
      if (!includesArray.some(mode => store.modesCycler.state.name.includes(mode))) flyToCochonnetAndBack(false);
    })
    .on("broadcast", { event: "startCircularRotation" }, (event) => {
      if (!includesArray.some(mode => store.modesCycler.state.name.includes(mode))) startCircularRotation(false);
    })
    .on("broadcast", { event: "stalefish180" }, (event) => {
      if (!includesArray.some(mode => store.modesCycler.state.name.includes(mode))) stalefish180(false);
    })
    .on("broadcast", { event: "lookAlongNegativeXAxis" }, (event) => {
      if (!includesArray.some(mode => store.modesCycler.state.name.includes(mode))) lookAlongNegativeXAxis(false);
    })
    .on("broadcast", { event: "lookAlongPositiveXAxis" }, (event) => {
      if (!includesArray.some(mode => store.modesCycler.state.name.includes(mode))) lookAlongPositiveXAxis(false);
    })
    .on("broadcast", { event: "lookAlongPositiveZAxis" }, (event) => {
      if (!includesArray.some(mode => store.modesCycler.state.name.includes(mode))) lookAlongPositiveZAxis(false);
    })
    .on("broadcast", { event: "lookAlongNegativeZAxis" }, (event) => {
      if (!includesArray.some(mode => store.modesCycler.state.name.includes(mode))) lookAlongNegativeZAxis(false);
    })
    .on("broadcast", { event: "flyToCochonnet" }, (event) => {
      if (!includesArray.some(mode => store.modesCycler.state.name.includes(mode))) flyToCochonnet(false);
    })
    .on("broadcast", { event: "toggleTopCamera" }, (event) => {
      if (!includesArray.some(mode => store.modesCycler.state.name.includes(mode))) toggleTopCamera({ broadcast: false, height: event.payload.height ?? 80 });
    })
    .on("broadcast", { event: "playFilm" }, (event) => {
      playFilm(false);
    })
    .on("broadcast", { event: "stopFilm" }, (event) => {
      stopFilm(false);
    })
    .on("broadcast", { event: "shootFilmBoule" }, (event) => {
      shootFilmBoule(false);
    });

  function playFilm(broadcast = true) {
    bus.emit("playFilm");
    if (broadcast) {
      animationController.send({
        type: "broadcast",
        event: "playFilm",
        payload: {},
      });
    }
  }

  function stopFilm(broadcast = true) {
    bus.emit("stopFilm");
    if (broadcast) {
      animationController.send({
        type: "broadcast",
        event: "stopFilm",
        payload: {},
      });
    }
  }

  function shootFilmBoule(broadcast = true) {
    bus.emit("shootFilmBoule");
    if (broadcast) {
      animationController.send({
        type: "broadcast",
        event: "shootFilmBoule",
        payload: {},
      });
    }
  }

  function flyToStart(broadcast = true, fromHapticGrid = false) {
    if (fromHapticGrid) bus.emit("flyToStart", "fromHapticGrid")
    else bus.emit("flyToStart")
    if (broadcast) {
      animationController.send({
        type: "broadcast",
        event: "flyToStart",
        payload: {},
      });
    }
  }

  function flyToCochonnetAndBack(broadcast = true) {
    bus.emit("flyToCochonnetAndBack");
    if (broadcast) {
      animationController.send({
        type: "broadcast",
        event: "flyToCochonnetAndBack",
        payload: {},
      });
    }
  }

  function startCircularRotation(broadcast = true) {
    bus.emit("startCircularRotation");
    if (broadcast) {
      animationController.send({
        type: "broadcast",
        event: "startCircularRotation",
        payload: {},
      });
    }
  }

  function stalefish180(broadcast = true) {
    bus.emit("stalefish180");
    if (broadcast) {
      animationController.send({
        type: "broadcast",
        event: "stalefish180",
        payload: {},
      });
    }
  }

  function lookAlongNegativeXAxis(broadcast = true) {
    bus.emit("lookAlongNegativeXAxis");
    if (broadcast) {
      animationController.send({
        type: "broadcast",
        event: "lookAlongNegativeXAxis",
        payload: {},
      });
    }
  }

  function lookAlongPositiveXAxis(broadcast = true) {
    bus.emit("lookAlongPositiveXAxis");
    if (broadcast) {
      animationController.send({
        type: "broadcast",
        event: "lookAlongPositiveXAxis",
        payload: {},
      });
    }
  }

  function lookAlongPositiveZAxis(broadcast = true) {
    bus.emit("lookAlongPositiveZAxis");
    if (broadcast) {
      animationController.send({
        type: "broadcast",
        event: "lookAlongPositiveZAxis",
        payload: {},
      });
    }
  }

  function lookAlongNegativeZAxis(broadcast = true) {
    bus.emit("lookAlongNegativeZAxis");
    if (broadcast) {
      animationController.send({
        type: "broadcast",
        event: "lookAlongNegativeZAxis",
        payload: {},
      });
    }
  }

  function flyToCochonnet(broadcast = true) {
    bus.emit("flyToCochonnet");
    if (broadcast) {
      animationController.send({
        type: "broadcast",
        event: "flyToCochonnet",
        payload: {},
      });
    }
  }

  function toggleTopCamera(options?: { broadcast?: boolean; height?: number }) {
    // console.log(options);
    bus.emit("toggleTopCamera", { height: options?.height ?? 80 });
    if (options?.broadcast) {
      animationController.send({
        type: "broadcast",
        event: "toggleTopCamera",
        payload: {
          height: options?.height ?? 80,
        },
      });
    }
  }

  return {
    flyToStart,
    flyToCochonnetAndBack,
    startCircularRotation,
    stalefish180,
    lookAlongNegativeXAxis,
    lookAlongPositiveXAxis,
    lookAlongPositiveZAxis,
    lookAlongNegativeZAxis,
    flyToCochonnet,
    toggleTopCamera,
    playFilm,
    stopFilm,
    shootFilmBoule,
  };
}
