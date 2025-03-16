export function useAnimationController() {
  const bus = useEventBus("tresjs");

  const supabase = useSupabaseClient();
  let channel = supabase.channel("animation-controller");
  channel.subscribe();


  function flyToStart() {
    bus.emit("flyToStart");
    channel.send({
      type: "broadcast",
      event: "flyToStart",
      payload: {},
    });
  }

  function flyToCochonetAndBack() {
    bus.emit("flyToCochonetAndBack");
    channel.send({
      type: "broadcast",
      event: "flyToCochonetAndBack",
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

  return { flyToStart, flyToCochonetAndBack, startCircularRotation, stalefish180 };
}
