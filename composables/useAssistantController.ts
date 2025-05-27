import { Howler } from "howler";

export function useAssistantController() {
  const bus = useEventBus("protoboules");

  const store = useProtoStore();

  const supabase = useSupabaseClient();
  let assistantController = supabase.channel("assistant-controller");
  assistantController.subscribe();

  assistantController.on("broadcast", { event: "toggle3dAudio" }, (event) => {
    if (!store.modesCycler.state.name.includes("Exhibition")) {
      Howler.stop();
      store.toggle3dAudio();
      window.speechSynthesis.cancel();
    }
  });

  assistantController.on("broadcast", { event: "mute" }, (event) => {
    if (!store.modesCycler.state.name.includes("Exhibition")) {
      console.log("mute");
      Howler.stop();
      store.mute3dAudio();
      window.speechSynthesis.cancel();
    }
  });

  assistantController.on("broadcast", { event: "unmute" }, (event) => {
    if (!store.modesCycler.state.name.includes("Exhibition")) {
      console.log("unmute");
      Howler.stop();
      store.unmute3dAudio();
      window.speechSynthesis.cancel();
    }
  });

  function sendMute(broadcast = true) {
    if (broadcast) {
      assistantController.send({
        type: "broadcast",
        event: "mute",
      });
    }
  }

  function sendUnmute(broadcast = true) {
    if (broadcast) {
      assistantController.send({
        type: "broadcast",
        event: "unmute",
      });
    }
  }

  function sendToggle3dAudio(broadcast = true) {
    if (broadcast) {
      assistantController.send({
        type: "broadcast",
        event: "toggle3dAudio",
      });
    }
  }

  return {
    sendMute,
    sendUnmute,
    sendToggle3dAudio,
  };
}
