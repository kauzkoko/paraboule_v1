export function useAnimationController() {
  const bus = useEventBus("protoboules");

  const supabase = useSupabaseClient();
  let animationController = supabase.channel("animation-controller");
  animationController.subscribe();

  animationController
    .on("broadcast", { event: "flyToStart" }, (event) => {
      flyToStart(false);
    })
    .on("broadcast", { event: "flyToCochonetAndBack" }, (event) => {
      flyToCochonetAndBack(false);
    })
    .on("broadcast", { event: "startCircularRotation" }, (event) => {
      startCircularRotation(false);
    })
    .on("broadcast", { event: "stalefish180" }, (event) => {
      stalefish180(false);
    })
    .on("broadcast", { event: "lookAlongNegativeXAxis" }, (event) => {
      lookAlongNegativeXAxis(false);
    })
    .on("broadcast", { event: "lookAlongPositiveXAxis" }, (event) => {
      lookAlongPositiveXAxis(false);
    })
    .on("broadcast", { event: "lookAlongPositiveZAxis" }, (event) => {
      lookAlongPositiveZAxis(false);
    })
    .on("broadcast", { event: "lookAlongNegativeZAxis" }, (event) => {
      lookAlongNegativeZAxis(false);
    })
    .on("broadcast", { event: "flyToCochonet" }, (event) => {
      flyToCochonet(false);
    })
    .on("broadcast", { event: "toggleTopCamera" }, (event) => {
      toggleTopCamera(false);
    });

  function flyToStart(broadcast = true) {
    bus.emit("flyToStart");
    if (broadcast) {
      animationController.send({
        type: "broadcast",
        event: "flyToStart",
        payload: {},
      });
    }
  }

  function flyToCochonetAndBack(broadcast = true) {
    bus.emit("flyToCochonetAndBack");
    if (broadcast) {
      animationController.send({
        type: "broadcast",
        event: "flyToCochonetAndBack",
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

  function flyToCochonet(broadcast = true) {
    bus.emit("flyToCochonet");
    if (broadcast) {
      animationController.send({
        type: "broadcast",
        event: "flyToCochonet",
        payload: {},
      });
    }
  }

  function toggleTopCamera(broadcast = true) {
    bus.emit("toggleTopCamera");
    if (broadcast) {
      animationController.send({
        type: "broadcast",
        event: "toggleTopCamera",
        payload: {},
      });
    }
  }

  return {
    flyToStart,
    flyToCochonetAndBack,
    startCircularRotation,
    stalefish180,
    lookAlongNegativeXAxis,
    lookAlongPositiveXAxis,
    lookAlongPositiveZAxis,
    lookAlongNegativeZAxis,
    flyToCochonet,
    toggleTopCamera,
  };
}
