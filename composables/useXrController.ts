export function useXrController() {
  const supabase = useSupabaseClient();
  let channel = supabase.channel("xr-controller");

  channel.subscribe();

  function sendIntersections(payload) {
    console.log("sendIntersections", payload);
    channel.send({
      type: "broadcast",
      event: "intersections",
      payload: { intersections: payload },
    });
  }

  return { sendIntersections };
}
