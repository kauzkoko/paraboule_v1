export function useXrController() {
  const store = useProtoStore();

  const supabase = useSupabaseClient();
  let xrController = supabase.channel("xr-controller");
  xrController.subscribe();

  xrController.on("broadcast", { event: "rawIntersections" }, (event) => {
    store.rawIntersections = event.payload.rawIntersections;
  });

  function sendRawIntersections() {
    xrController.send({
      type: "broadcast",
      event: "rawIntersections",
      payload: { rawIntersections: store.rawIntersections },
    });
  }

  return { sendRawIntersections };
}
