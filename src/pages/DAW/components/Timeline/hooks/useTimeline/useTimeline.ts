import { useEffect, useMemo, useRef, useState } from "react";
import { getTimeSignature } from "../../helpers";
import {
  CLIP_HEIGHT,
  CLIP_TOP_PADDING,
  MIN_GRID_HEIGHT,
  SCROLLBAR_HEIGHT,
} from "src/pages/DAW/constants";
import * as Tone from "tone";
import { useAudioEngine, useLinkedScroll } from "src/pages/DAW/hooks";

export const useTimeline = (
  containerRef: React.MutableRefObject<HTMLDivElement | null>,
  setTimelineRect: (rect: DOMRect) => void
) => {
  const [rAFId, setRAFId] = useState<number | null>(null);
  const { scrollTop, setScrollTop, sectionHeight } = useLinkedScroll();
  const audioEngine = useAudioEngine();

  const gridRef = useRef<SVGSVGElement>(null);
  const topbarRef = useRef<SVGSVGElement>(null);
  const playheadRef = useRef<SVGSVGElement>(null);
  const playheadXRef = useRef(0);
  const mouseX = useRef(0);

  const updatePlayhead = () => {
    const x = Math.round(
      audioEngine.timeline.samplesToPixels(
        Tone.getTransport().seconds * Tone.getContext().sampleRate
      )
    );
    const width = containerRef.current?.clientWidth || 0;
    const multiplier = x / width;
    const reachedScreenEnd = x % width >= width - 100;
    const shouldAutoScroll =
      audioEngine.state !== "stopped" && audioEngine.state !== "paused";
    if (shouldAutoScroll && reachedScreenEnd) {
      containerRef.current!.scrollLeft! = width * Math.round(multiplier);
    }
    playheadXRef.current = x;
  };

  const updatePlayheadWithRAF = () => {
    updatePlayhead();
    if (audioEngine.state === "playing" || audioEngine.state === "recording") {
      setRAFId(requestAnimationFrame(updatePlayheadWithRAF));
    }
  };

  useEffect(() => {
    if (audioEngine.state === "playing" || audioEngine.state === "recording") {
      setRAFId(requestAnimationFrame(updatePlayheadWithRAF));
    } else if (rAFId !== null) {
      cancelAnimationFrame(rAFId);
      setRAFId(null);
    }
  }, [audioEngine.state]);

  useEffect(() => {
    audioEngine.timeline.updateTimelineUI = updatePlayhead;
  }, []);

  useEffect(() => {
    if (gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect();
      setTimelineRect(rect);
      updatePlayhead();
    }
  }, [
    audioEngine.timeSignature,
    playheadRef.current,
    audioEngine.bpm,
    audioEngine.tracks.length,
    audioEngine.timeline.zoomIndex,
    audioEngine.timeline.samplesPerPixel,
    containerRef.current,
    audioEngine.cursorPosition,
  ]);

  const gridWidth = useMemo(() => {
    const beatsPerSecond = Tone.getTransport().bpm.value / 60;
    const samplesPerBeat = Tone.getContext().sampleRate / beatsPerSecond;
    const samplesPerMeasure = samplesPerBeat * getTimeSignature(audioEngine);
    const totalSamples = samplesPerMeasure * audioEngine.timeline.totalMeasures;
    const widthInPixels = audioEngine.timeline.samplesToPixels(totalSamples);

    return widthInPixels;
  }, [
    audioEngine.timeline.samplesPerPixel,
    audioEngine.timeline.totalMeasures,
    audioEngine.bpm,
  ]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const divRect = e.currentTarget.getBoundingClientRect();
    mouseX.current = e.clientX - divRect.left;
  };

  const handleClick = (e: any) => {
    const trackToSelectIndex =
      Math.round((e.clientY + e.target.scrollTop) / (80 + 2.5)) - 1;
    const inRange =
      trackToSelectIndex >= 0 && trackToSelectIndex < audioEngine.tracks.length;
    if (inRange) {
      if (!e.ctrlKey) {
        audioEngine.deselectAllTracks();
      }
      audioEngine.tracks[trackToSelectIndex].select();
      audioEngine.getSelectedTracks();
    } else if (trackToSelectIndex >= audioEngine.tracks.length) {
      audioEngine.deselectAllTracks();
    }
    if (gridRef.current) {
      const pixels = mouseX.current + (containerRef?.current?.scrollLeft || 0);
      const time = Tone.Time(
        audioEngine.timeline.pixelsToSamples(pixels),
        "samples"
      );
      if (audioEngine.timeline.snap) {
        const quantizedTime = Tone.Time(
          time.quantize(
            audioEngine.timeline.quantizationValues[
              audioEngine.timeline.zoomIndex
            ]
          )
        );
        audioEngine.setPosition(quantizedTime);
      } else {
        audioEngine.setPosition(time);
      }
    }
  };

  const handleScroll = (e: any) => {
    // e.preventDefault();
    const target = e.target as HTMLDivElement;
    audioEngine.timeline.scrollXOffsetPixels = target.scrollLeft;
    // if (trackPanelsRef?.current) {
    //   trackPanelsRef.current.scrollTop = target.scrollTop;
    // }
    setScrollTop(target.scrollTop);
  };

  useEffect(() => {
    const div = containerRef.current;
    if (div) {
      div.scrollTop = scrollTop;
      div.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (div) {
        div.removeEventListener("scroll", handleScroll);
      }
    };
  }, [scrollTop, setScrollTop]);

  // const sectionHeight = useMemo(() => {
  //   const clipFullHeight = CLIP_HEIGHT + CLIP_TOP_PADDING;
  //   const calculatedHeight =
  //     clipFullHeight * audioEngine.tracks.length +
  //     SCROLLBAR_HEIGHT +
  //     clipFullHeight;
  //   return calculatedHeight > MIN_GRID_HEIGHT
  //     ? calculatedHeight
  //     : MIN_GRID_HEIGHT;
  // }, [audioEngine.tracks.length]);

  return {
    gridRef,
    topbarRef,
    playheadRef,
    gridWidth,
    sectionHeight,
    playheadXRef,
    handleMouseMove,
    handleClick,
    handleScroll,
  };
};
