export function useSoundController(options: { listen: boolean }) {
  const supabase = useSupabaseClient();
  let channel = supabase.channel("sound-controller");

  const { sendCochonet, sendHoola } = useMqtt();
  const { play } = useSoundComposable("/sounds/noz.mp3", 5);

  channel.subscribe();

  channel.on("broadcast", { event: "playPhone" }, (event) => {
    console.log("received playPhone event from sound controller: ", event);
    const payload = event.payload || {};
    console.log("Payload:", payload);
    if (options.listen) {
      play();
    }
  });

  function sendPlayCocho() {
    channel.send({
      type: "broadcast",
      event: "playCocho",
      payload: {},
    });
    sendCochonet("5");
  }

  function sendPlayShoes() {
    channel.send({
      type: "broadcast",
      event: "playShoes",
      payload: {},
    });
    sendHoola("3");
  }

  function sendPlayPhone(duration = 5) {
    channel.send({
      type: "broadcast",
      event: "playPhone",
      payload: { duration },
    });
  }

  return { sendPlayCocho, sendPlayShoes, sendPlayPhone };
}
