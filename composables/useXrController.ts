export function useXrController() {
  const store = useProtoStore();
  const { rawIntersections } = storeToRefs(store);

  const supabase = useSupabaseClient();
  let channel = supabase.channel("xr-controller");
  channel.subscribe();

  function sendRawIntersections() {
    channel.send({
      type: "broadcast",
      event: "rawIntersections",
      payload: { rawIntersections: rawIntersections.value },
    });
  }

  return { sendRawIntersections };
}
