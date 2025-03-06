export function useAnimationController() {
  const supabase = useSupabaseClient();
  let channel = supabase.channel("animation-controller");

  channel.subscribe();

  function flyToStart() {
    channel.send({
      type: "broadcast",
      event: "flyToStart",
    });
  }

  function flyToCochonetteAndBack() {
    channel.send({
      type: "broadcast",
      event: "flyToCochonetteAndBack",
    });
  }

  function startCircularRotation() {
    channel.send({
      type: "broadcast",
      event: "startCircularRotation",
    });
  }

  return { flyToStart, flyToCochonetteAndBack, startCircularRotation };
}
