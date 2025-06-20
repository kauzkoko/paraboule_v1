import { Howler } from "howler";

export function useSoundComposable(soundSrc: string, duration = 0) {
  const store = useProtoStore();
  const sound = useSound(soundSrc, { interrupt: true, html5: true });

  const play = () => {
    Howler.stop();
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      // console.log("Already speaking, stopping current speech");
      return;
    }
    if (sound.isPlaying.value && store.currentGlobalSoundSrc === soundSrc && false) {
      console.log("stopping sound in first if", soundSrc);
      sound.stop();
    } else {
      console.log("playing sound in else", soundSrc);
      sound.play();
      if (duration > 0 && duration < 500) {
        duration = duration * 1000;
      }
      if (duration > 0) {
        console.log("setting timeout", duration);
        setTimeout(() => {
          console.log("stopping sound in timeout", soundSrc);
          sound.stop();
        }, duration);
      }
      store.currentGlobalSoundSrc = soundSrc;
    }
  };

  const stop = () => {
    sound.stop();
  };

  return {
    play,
    stop,
    isPlaying: sound.isPlaying,
  };
}
