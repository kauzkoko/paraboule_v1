export function useAnimationController() {
  const bus = useEventBus("protoboules");

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

  function lookAlongNegativeXAxis() {
    bus.emit("lookAlongNegativeXAxis");
    channel.send({
      type: "broadcast",
      event: "lookAlongNegativeXAxis",
      payload: {},
    });
  }

  function lookAlongPositiveXAxis() {
    bus.emit("lookAlongPositiveXAxis");
    channel.send({
      type: "broadcast",
      event: "lookAlongPositiveXAxis",
      payload: {},
    });
  }

  function lookAlongPositiveZAxis() {
    bus.emit("lookAlongPositiveZAxis");
    channel.send({
      type: "broadcast",
      event: "lookAlongPositiveZAxis",
      payload: {},
    });
  }

  function lookAlongNegativeZAxis() {
    bus.emit("lookAlongNegativeZAxis");
    channel.send({
      type: "broadcast",
      event: "lookAlongNegativeZAxis",
      payload: {},
    });
  }

  return {
    flyToStart,
    flyToCochonetAndBack,
    startCircularRotation,
    stalefish180,
    lookAlongNegativeXAxis,
    lookAlongPositiveXAxis,
    lookAlongPositiveZAxis,
    lookAlongNegativeZAxis,
  };
}
