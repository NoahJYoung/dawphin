import audioBufferToWav from "audiobuffer-to-wav";
import { ToneAudioBuffer } from "tone";

export const bufferToBlob = (buffer: ToneAudioBuffer): Blob => {
  const rawBuffer = buffer.get();
  if (rawBuffer) {
    const blob = new Blob([audioBufferToWav(rawBuffer)], {
      type: "audio/wav",
    });
    return blob;
  } else {
    throw new Error("Unable to convert buffer to blob");
  }
};
