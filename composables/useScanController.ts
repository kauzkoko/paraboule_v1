export function useScanController() {
  const bus = useEventBus("protoboules");

  const store = useProtoStore();

  const supabase = useSupabaseClient();
  let scanController = supabase.channel("scan-controller");
  scanController.subscribe();

  scanController.on("broadcast", { event: "reverseField" }, (event) => {
    if (!includesArray.some(mode => store.modesCycler.state.name.includes(mode))) {
      console.log("reverseField", event.payload.reverseField);
      store.reverseField = event.payload.reverseField;
    }
  });

  function sendReverseField(broadcast = true) {
    if (broadcast) {
      scanController.send({
        type: "broadcast",
        event: "reverseField",
        payload: {
          reverseField: store.reverseField,
        },
      });
    }
  }

  return {
    sendReverseField,
  };
}
