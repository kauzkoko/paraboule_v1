import { Howler } from "howler";

export function useSoundComposable(soundSrc: string) {
  const touchCounter = useState<number>('touchCounter')
  let lastTouchCounter = 0;

  const sound = useSound(soundSrc, { interrupt: true });

  const play = () => {
    Howler.stop();
    if (sound.isPlaying.value && touchCounter.value === lastTouchCounter + 1) {
      sound.stop();
    } else {
      sound.play();
    }
    lastTouchCounter = touchCounter.value;
  };
  
  return {
    play,
  };
}
