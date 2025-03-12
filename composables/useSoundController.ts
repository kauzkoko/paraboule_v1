export function useSoundController() {
  const supabase = useSupabaseClient();
  let channel = supabase.channel("sound-controller");

  channel.subscribe();

  function sendPlayCocho() {
    channel.send({
      type: "broadcast",
      event: "playCocho",
      payload: {},
    });
  }

  function sendPlayShoes() {
    channel.send({
      type: "broadcast",
      event: "playShoes",
      payload: {},
    });
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
