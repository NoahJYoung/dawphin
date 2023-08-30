import React, { useMemo, useRef, useState } from "react";
import type { AudioEngine } from "src/AudioEngine";
import { getTimeSignature } from "../../helpers";
import * as Tone from 'tone';

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
  }, [audioEngine.samplesPerPixel, audioEngine.totalMeasures]);

  const sectionHeight = useMemo(() => (
    (80 * audioEngine.tracks.length + 30) > 2000 ? (80 * audioEngine.tracks.length + 30) : 2000
    ), [audioEngine.tracks.length]);

  return {
    gridRef,
    topbarRef,
    playheadRef,
    playheadX,
    gridWidth,
    setPlayheadX,
    sectionHeight
  }
}