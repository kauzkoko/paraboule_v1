export function useExhibitionController() {
  const bus = useEventBus("protoboules");

  const supabase = useSupabaseClient();
  let exhibitionController = supabase.channel("exhibition-controller");
  exhibitionController.subscribe();

  exhibitionController
    .on("broadcast", { event: "playFilm" }, (event) => {
      playFilm(false);
    })
    .on("broadcast", { event: "stopFilm" }, (event) => {
      stopFilm(false);
    })
    .on("broadcast", { event: "shootFilmBoule" }, (event) => {
      bus.emit("shootFilmBouleSmartphone", event.payload);
    })
    .on("broadcast", { event: "pingCochonnet" }, (event) => {
      pingCochonnet(false);
    })
    .on("broadcast", { event: "stopPingCochonnet" }, (event) => {
      stopPingCochonnet(false);
    })
    .on("broadcast", { event: "pingStartingPoint" }, (event) => {
      pingStartingPoint(false);
    })
    .on("broadcast", { event: "stopPingStartingPoint" }, (event) => {
      stopPingStartingPoint(false);
    })
    .on("broadcast", { event: "pingPhone1Supabase" }, (event) => {
      bus.emit("pingPhone1", event.payload);
    })
    .on("broadcast", { event: "pingPhone2Supabase" }, (event) => {
      bus.emit("pingPhone2", event.payload);
    })
    .on("broadcast", { event: "pingPhone3Supabase" }, (event) => {
      bus.emit("pingPhone3", event.payload);
    });

  function playFilm(broadcast = true) {
    bus.emit("playFilm");
    if (broadcast) {
      exhibitionController.send({
        type: "broadcast",
        event: "playFilm",
        payload: {},
      });
    }
  }

  function stopFilm(broadcast = true) {
    bus.emit("stopFilm");
    if (broadcast) {
      exhibitionController.send({
        type: "broadcast",
        event: "stopFilm",
        payload: {},
      });
    }
  }

  const {
    isSupported,
    data,
    post,
    error,
  } = useBroadcastChannel({ name: 'paraboule' })

  watch(data, () => {
    if (data.value) {
      if (data.value.event === "shootFilmBouleBahn") {
        const { playedCount, scheduledTime } = data.value.payload;
        bus.emit("shootFilmBouleBahn", { playedCount, scheduledTime });
      }
    }
  })

  function shootFilmBoule({ playedCount, scheduledTime, broadcast = false }: { playedCount: number, scheduledTime: number, broadcast?: boolean }) {
    post({
      event: "shootFilmBouleBahn",
      payload: { playedCount, scheduledTime },
    })
    if (broadcast) {
      exhibitionController.send({
        type: "broadcast",
        event: "shootFilmBoule",
        payload: { playedCount, scheduledTime },
      });
    }
  }

  function pingPhone1Supabase({ from }: { from: string }) {
      exhibitionController.send({
        type: "broadcast",
        event: "pingPhone1Supabase",
        payload: { from },
      });
  }

  function pingPhone2Supabase({ from }: { from: string }) {
    exhibitionController.send({
      type: "broadcast",
      event: "pingPhone2Supabase",
      payload: { from },
    });
  }

  function pingPhone3Supabase({ from }: { from: string }) {
    exhibitionController.send({
      type: "broadcast",
      event: "pingPhone3Supabase",
      payload: { from },
    });
  }

  function pingCochonnet(broadcast = true) {
    bus.emit("pingCochonnet");
    if (broadcast) {
      exhibitionController.send({
        type: "broadcast",
        event: "pingCochonnet",
        payload: {},
      });
    }
  }

  function stopPingCochonnet(broadcast = true) {
    bus.emit("stopPingCochonnet");
    if (broadcast) {
      exhibitionController.send({
        type: "broadcast",
        event: "stopPingCochonnet",
        payload: {},
      });
    }
  }

  function pingStartingPoint(broadcast = true) {
    bus.emit("pingStartingPoint");
    if (broadcast) {
      exhibitionController.send({
        type: "broadcast",
        event: "pingStartingPoint",
        payload: {},
      });
    }
  }

  function stopPingStartingPoint(broadcast = true) {
    bus.emit("stopPingStartingPoint");
    if (broadcast) {
      exhibitionController.send({
        type: "broadcast",
        event: "stopPingStartingPoint",
        payload: {},
      });
    }
  }


  return {
    playFilm,
    stopFilm,
    shootFilmBoule,
    pingCochonnet,
    stopPingCochonnet,
    pingStartingPoint,
    stopPingStartingPoint,
    pingPhone1Supabase,
    pingPhone2Supabase,
    pingPhone3Supabase,
  };
}
