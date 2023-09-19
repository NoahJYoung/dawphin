import { useMemo, useRef, useState } from "react";
import type { AudioEngine } from "src/AudioEngine";
import { getTimeSignature } from "../../helpers";
import {
  CLIP_HEIGHT,
  CLIP_TOP_PADDING,
  MIN_GRID_HEIGHT,
  SCROLLBAR_HEIGHT,
} from "src/pages/DAW/constants";
import * as Tone from "tone";

export const useTimeline = (audioEngine: AudioEngine) => {
  const [playheadX, setPlayheadX] = useState(0);
  const gridRef = useRef<SVGSVGElement>(null);
  const topbarRef = useRef<SVGSVGElement>(null);
  const playheadRef = useRef<SVGSVGElement>(null);

  const gridWidth = useMemo(() => {
    const beatsPerSecond = Tone.getTransport().bpm.value / 60;
    const samplesPerBeat = Tone.getContext().sampleRate / beatsPerSecond;
    const samplesPerMeasure = samplesPerBeat * getTimeSignature(audioEngine);
    const totalSamples = samplesPerMeasure * audioEngine.totalMeasures;
    const widthInPixels = totalSamples / audioEngine.samplesPerPixel;

    return widthInPixels;
  }, [audioEngine.samplesPerPixel, audioEngine.totalMeasures, audioEngine.bpm]);

  const sectionHeight = useMemo(() => {
    const calculatedHeight =
      (CLIP_HEIGHT + CLIP_TOP_PADDING) * audioEngine.tracks.length +
      (SCROLLBAR_HEIGHT + 10);
    return calculatedHeight > MIN_GRID_HEIGHT
      ? calculatedHeight
      : MIN_GRID_HEIGHT;
  }, [audioEngine.tracks.length]);

  return {
    gridRef,
    topbarRef,
    playheadRef,
    playheadX,
    gridWidth,
    setPlayheadX,
    sectionHeight,
  };
};
