import { Howler } from "howler";

export function useSoundComposable(soundSrc: string, duration = 0) {
  const touchCounter = useState<number>("touchCounter");
  let lastTouchCounter = 0;

  const sound = useSound(soundSrc, { interrupt: true });

  const play = () => {
    Howler.stop();
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      console.log("Already speaking, stopping current speech");
      return;
    }
    if (sound.isPlaying.value && touchCounter.value === lastTouchCounter + 1) {
      sound.stop();
    } else {
      sound.play();
      if (duration > 0 && duration < 500) {
        duration = duration * 1000;
      }
      if (duration > 0) {
        setTimeout(() => {
          sound.stop();
        }, duration);
      }
    }
    lastTouchCounter = touchCounter.value;
  };

  return {
    play,
  };
}
