import { Howler } from "howler";

export function useSoundComposable(soundSrc) {
  const sound = useSound(soundSrc, { interrupt: true });

  const play = () => {
    Howler.stop();
    sound.play()
  };

  return {
    play,
  };
}
