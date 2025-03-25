export function useSpeech() {
  const speak = (text: string) => {
    if (!window.speechSynthesis) {
      console.error("Speech Synthesis API is not supported in this browser.");
      return;
    }

    // Check if speech synthesis is already speaking
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      console.log("Already speaking, stopping current speech");
      return;
    }

	Howler.stop();
    const utterance = new SpeechSynthesisUtterance(text);

    const voices = window.speechSynthesis.getVoices();
    const enGBVoice = voices.find((voice) => voice.lang === "en-GB");
    if (enGBVoice) {
      utterance.voice = enGBVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (!window.speechSynthesis) {
      console.error("Speech Synthesis API is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
  };

  return {
    speak,
    stop,
  };
}
