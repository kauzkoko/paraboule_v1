export function useFocusController() {
  const bus = useEventBus("protoboules");

  const store = useProtoStore();

  const supabase = useSupabaseClient();
  let focusController = supabase.channel("focus-controller");
  focusController.subscribe();

  focusController.on("broadcast", { event: "selectedBoules" }, (event) => {
    // if (!includesArray.some(mode => store.modesCycler.state.name.includes(mode))) store.selectedBoules = event.payload.selectedBoules;
  });

  function sendSelectedBoules(broadcast = true) {
    if (broadcast) {
      focusController.send({
        type: "broadcast",
        event: "selectedBoules",
        payload: {
          selectedBoules: store.selectedBoules,
        },
      });
    }
  }

  return {
    sendSelectedBoules,
  };
}
