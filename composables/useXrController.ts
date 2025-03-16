export function useXrController() {
  const store = useProtoStore();
  const { rawIntersections, intersections } = storeToRefs(store);

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

  function sendIntersections() {
    channel.send({
      type: "broadcast",
      event: "intersections",
      payload: { intersections: intersections.value },
    });
  }

  return { sendRawIntersections, sendIntersections };
}
