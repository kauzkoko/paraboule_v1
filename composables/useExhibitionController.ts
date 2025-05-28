export function useExhibitionController() {
  const bus = useEventBus("protoboules");
  const store = useProtoStore();

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
      shootFilmBoule(false);
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

  function shootFilmBoule(broadcast = true) {
    bus.emit("shootFilmBoule");
    if (broadcast) {
      exhibitionController.send({
        type: "broadcast",
        event: "shootFilmBoule",
        payload: {},
      });
    }
  }


  return {
    playFilm,
    stopFilm,
    shootFilmBoule,
  };
}
