export function useScoreController() {
  const bus = useEventBus("protoboules");

  const store = useProtoStore();

  const supabase = useSupabaseClient();
  let scoreController = supabase.channel("score-controller");
  scoreController.subscribe();

  scoreController.on("broadcast", { event: "score" }, (event) => {
    if (!store.modesCycler.state.name.includes("Exhibition")) {
      store.players.player1.score = event.payload.player1Score;
      store.players.player2.score = event.payload.player2Score;
    }
  });

  scoreController.on("broadcast", { event: "shotsTaken" }, (event) => {
    if (!store.modesCycler.state.name.includes("Exhibition")) {
      store.globalShotsTaken = event.payload.globalShotsTaken;
      store.players.player1.shotsTaken = event.payload.player1ShotsTaken;
      store.players.player2.shotsTaken = event.payload.player2ShotsTaken;
    }
  });

  scoreController.on("broadcast", { event: "globalShotsTaken" }, (event) => {
    if (!store.modesCycler.state.name.includes("Exhibition")) {
      store.globalShotsTaken = event.payload.globalShotsTaken;
    }
  });

  scoreController.on("broadcast", { event: "playersShotsTaken" }, (event) => {
    if (!store.modesCycler.state.name.includes("Exhibition")) {
      store.players.player1.shotsTaken = event.payload.player1ShotsTaken;
      store.players.player2.shotsTaken = event.payload.player2ShotsTaken;
    }
  });

  scoreController.on("broadcast", { event: "allData" }, (event) => {
    if (!store.modesCycler.state.name.includes("Exhibition")) {
      store.players.player1.score = event.payload.player1Score;
      store.players.player2.score = event.payload.player2Score;
      store.globalShotsTaken = event.payload.globalShotsTaken;
      store.players.player1.shotsTaken = event.payload.player1ShotsTaken;
      store.players.player2.shotsTaken = event.payload.player2ShotsTaken;
    }
  });

  function sendShotsTaken(broadcast = true) {
    if (broadcast) {
      scoreController.send({
        type: "broadcast",
        event: "shotsTaken",
        payload: {
          globalShotsTaken: store.globalShotsTaken,
          player1ShotsTaken: store.players.player1.shotsTaken,
          player2ShotsTaken: store.players.player2.shotsTaken,
        },
      });
    }
  }

  function sendGlobalShotsTaken(broadcast = true) {
    if (broadcast) {
      scoreController.send({
        type: "broadcast",
        event: "globalShotsTaken",
        payload: {
          globalShotsTaken: store.globalShotsTaken,
        },
      });
    }
  }

  function sendPlayersShotsTaken(broadcast = true) {
    if (broadcast) {
      scoreController.send({
        type: "broadcast",
        event: "playersShotsTaken",
        payload: {
          player1ShotsTaken: store.players.player1.shotsTaken,
          player2ShotsTaken: store.players.player2.shotsTaken,
        },
      });
    }
  }

  function sendNewScore(broadcast = true) {
    if (broadcast) {
      scoreController.send({
        type: "broadcast",
        event: "score",
        payload: {
          player1Score: store.players.player1.score,
          player2Score: store.players.player2.score,
        },
      });
    }
  }

  function sendAllData(broadcast = true) {
    if (broadcast) {
      scoreController.send({
        type: "broadcast",
        event: "allData",
        payload: {
          player1Score: store.players.player1.score,
          player2Score: store.players.player2.score,
          globalShotsTaken: store.globalShotsTaken,
          player1ShotsTaken: store.players.player1.shotsTaken,
          player2ShotsTaken: store.players.player2.shotsTaken,
        },
      });
    }
  }

  return {
    sendNewScore,
    sendGlobalShotsTaken,
    sendPlayersShotsTaken,
    sendShotsTaken,
    sendAllData,
  };
}
