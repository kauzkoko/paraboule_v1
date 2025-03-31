export function useScoreController() {
  const bus = useEventBus("protoboules");

  const store = useProtoStore();

  const supabase = useSupabaseClient();
  let scoreController = supabase.channel("score-controller");
  scoreController.subscribe();

  scoreController
    .on("broadcast", { event: "score" }, (event) => {
      console.log("score", event.payload.score);
    })

  function setNewScore(broadcast = true) {
    bus.emit("score");
    if (broadcast) {
      scoreController.send({
        type: "broadcast",
        event: "score",
        payload: {},
      });
    }
  }

  return {
    setNewScore,
  };
}
