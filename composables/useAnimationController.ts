export function useAnimationController() {
  const supabase = useSupabaseClient();
  let channel = supabase.channel("animation-controller");
  channel.subscribe();

  const bus = useEventBus("tresjs");

  function flyToStart() {
    channel.send({
      type: "broadcast",
      event: "flyToStart",
      payload: {},
    });
  }

  function flyToCochonetteAndBack() {
    // bus.emit("flyToCochonetteAndBack");
    channel.send({
      type: "broadcast",
      event: "flyToCochonetteAndBack",
      payload: {},
    });
  }

  function startCircularRotation() {
    channel.send({
      type: "broadcast",
      event: "startCircularRotation",
      payload: {},
    });
  }

  return { flyToStart, flyToCochonetteAndBack, startCircularRotation };
}
