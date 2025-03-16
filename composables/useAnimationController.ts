export function useAnimationController() {
  const supabase = useSupabaseClient();
  let channel = supabase.channel("animation-controller");
  channel.subscribe();

  const bus = useEventBus("tresjs");

  function flyToStart() {
    bus.emit("flyToStart");
    channel.send({
      type: "broadcast",
      event: "flyToStart",
      payload: {},
    });
  }

  function flyToCochonetteAndBack() {
    bus.emit("flyToCochonetteAndBack");
    channel.send({
      type: "broadcast",
      event: "flyToCochonetteAndBack",
      payload: {},
    });
  }

  function startCircularRotation() {
    bus.emit("startCircularRotation");
    channel.send({
      type: "broadcast",
      event: "startCircularRotation",
      payload: {},
    });
  }

  function stalefish180() {
    bus.emit("stalefish180");
    channel.send({
      type: "broadcast",
      event: "stalefish180",
      payload: {},
    });
  }

  return { flyToStart, flyToCochonetteAndBack, startCircularRotation, stalefish180 };
}
