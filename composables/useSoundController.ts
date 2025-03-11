export function useSoundController() {
  const supabase = useSupabaseClient();
  let channel = supabase.channel("sound-controller");

  channel.subscribe();

  function sendPlayCocho() {
    channel.send({
      type: "broadcast",
      event: "playCocho",
    });
  }

  function sendPlayShoes() {
    channel.send({
      type: "broadcast",
      event: "playShoes",
    });
  }

  return { sendPlayCocho, sendPlayShoes };
}