import * as Tone from "tone";

export const blobToBuffer = async (
  blob: Blob
): Promise<Tone.ToneAudioBuffer> => {
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = await Tone.getContext().decodeAudioData(arrayBuffer);
  const toneBuffer = new Tone.ToneAudioBuffer(buffer);

  return toneBuffer;
};
