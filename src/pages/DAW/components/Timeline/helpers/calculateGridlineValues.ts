import { AudioEngine } from "src/AudioEngine";
import * as Tone from 'tone';

export const calculateGridlineValues = (audioEngine: AudioEngine) => {
  const bpm = audioEngine.bpm;
  const secondsPerBeat = 60 / bpm;
  const samplesPerBeat = secondsPerBeat * Tone.getContext().sampleRate;
  const beatsPerMeasure = Tone.getTransport().timeSignature as number;
  const totalBeats = audioEngine.totalMeasures * beatsPerMeasure;

  return {
    totalBeats,
    samplesPerBeat,
  };
};