export function useSoundController() {
  const supabase = useSupabaseClient();
  let channel = supabase.channel("sound-controller");

  channel.subscribe();

  function sendPlay() {
    channel.send({
      type: "broadcast",
      event: "play",
    });
  }

  return { sendPlay };
}
