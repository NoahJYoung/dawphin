import { AudioEngine } from "src/AudioEngine";

export const getTimeSignature = (audioEngine: AudioEngine) => {
  if (Array.isArray(audioEngine.timeSignature)) {
    return audioEngine.timeSignature[0];
  } else {
    return audioEngine.timeSignature;
  }
};
