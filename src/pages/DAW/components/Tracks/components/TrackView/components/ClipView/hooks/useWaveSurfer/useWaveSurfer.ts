import { useEffect, useMemo, useRef, useState } from "react";
import { AudioEngine } from "src/AudioEngine";
import { Clip } from "src/AudioEngine/Track/Clip";
import { bufferToBlob } from "src/AudioEngine/helpers";
import { convertRgbToRgba } from "src/pages/DAW/helpers";
import * as Tone from "tone";
import WaveSurfer from "waveSurfer.js";

export const useWaveSurfer = (clip: Clip, audioEngine: AudioEngine) => {
  const [waveSurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const waveSurferRef = useRef(null);
  const audioURL = useMemo(
    () => URL.createObjectURL(bufferToBlob(clip.audioBuffer)),
    [clip.audioBuffer]
  );

  useEffect(() => {
    const sampleRate = Tone.getContext().sampleRate;
    const samplesPerPixel = audioEngine.timeline.samplesPerPixel;
    const pixelsPerSecond = Math.round(sampleRate / samplesPerPixel);
    if (waveSurferRef?.current && clip.end) {
      const surfer = WaveSurfer.create({
        interact: true,
        container: waveSurferRef.current,
        waveColor: convertRgbToRgba("rgb(0, 0, 0)", 0.5),
        progressColor: convertRgbToRgba("rgb(0, 0, 0)", 0.5),
        url: audioURL,
        height: "auto",
        minPxPerSec: pixelsPerSecond,
        hideScrollbar: true,
        cursorWidth: 0,
        normalize: false,
      });
      setWavesurfer(surfer);
    }

    return () => {
      if (waveSurfer) {
        waveSurfer.destroy();
      }
      URL.revokeObjectURL(audioURL);
    };
  }, [clip.duration, clip.audioBuffer, audioURL]);

  useEffect(() => {
    waveSurfer?.setOptions({ normalize: clip.normalized });
  }, [clip.normalized]);

  useEffect(() => {
    const sampleRate = Tone.getContext().sampleRate;
    const samplesPerPixel = audioEngine.timeline.samplesPerPixel;
    const pixelsPerSecond = Math.round(sampleRate / samplesPerPixel);
    waveSurfer?.zoom(pixelsPerSecond);
  }, [audioEngine.timeline.samplesPerPixel]);

  useEffect(() => {
    const container = document.querySelector(`#wave-container${clip.id} > div`);
    if (container) {
      const shadowRoot = container.shadowRoot;
      if (shadowRoot) {
        const firstDiv = shadowRoot.querySelector(
          '.scroll[part="scroll"]'
        ) as HTMLElement;
        if (firstDiv) {
          firstDiv.style.pointerEvents = "none";
        }
      }
    }
  }, [waveSurferRef.current]);

  return waveSurferRef;
};
