export function useSoundController(options: { listen: boolean }) {
  const supabase = useSupabaseClient();
  let channel = supabase.channel("sound-controller");

  const { play } = useSoundComposable("/sounds/noz.mp3", 5);

  channel.subscribe();

  channel.on("broadcast", { event: "playPhone" }, (event) => {
    // console.log("received playPhone event from sound controller: ", event);
    const payload = event.payload || {};
    // console.log("Payload:", payload);
    if (options.listen) {
      // console.log("playing phone sound");
      // play();
    }
  });

  function sendPlayCochonnet(duration = 5000) {
    // console.log("sending playCochonnet event to sound controller: ", duration);
    channel.send({
      type: "broadcast",
      event: "playCochonnet",
      payload: { duration },
    });
    // sendCochonnetMqtt((duration / 1000).toString());
  }

  function sendPlayHoola(duration = 5000) {
    channel.send({
      type: "broadcast",
      event: "playHoola",
      payload: { duration },
    });
    // sendHoolaMqtt((duration / 1000).toString());
  }

  function sendPlayPhone(duration = 5000) {
    channel.send({
      type: "broadcast",
      event: "playPhone",
      payload: { duration },
    });
  }

  return { sendPlayCochonnet, sendPlayHoola, sendPlayPhone };
}
