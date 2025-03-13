export function useSoundController() {
  const supabase = useSupabaseClient();
  let channel = supabase.channel("sound-controller");

  const { sendCochonet, sendHoola } = useMqtt();

  channel.subscribe();

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

  function sendPlayPhone() {
    channel.send({
      type: "broadcast",
      event: "playPhone",
      payload: {},
    });
  }

  return { sendPlayCocho, sendPlayShoes, sendPlayPhone };
}
