export function useXrController() {
  const supabase = useSupabaseClient();
  let channel = supabase.channel("xr-controller");

  channel.subscribe();

  function sendIntersections(payload) {
    channel.send({
      type: "broadcast",
      event: "intersections",
      payload: payload,
    });
  }

  return { sendIntersections };
}
