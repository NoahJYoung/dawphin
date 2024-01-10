import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { Track } from "src/AudioEngine/Track";
import { CLIP_HEIGHT, CLIP_TOP_PADDING } from "src/pages/DAW/constants";
import { convertRgbToRgba } from "src/pages/DAW/helpers";
import * as Tone from "tone";
import { calculatePlaceholderClipPosition } from "./helpers";
import { useAudioEngine } from "src/pages/DAW/hooks";

interface PlaceholderClipProps {
  track: Track;
}

export const PlaceholderClip = observer(({ track }: PlaceholderClipProps) => {
  const [clipWidth, setClipWidth] = useState(1);
  const rAFId = useRef<number | null>(null);
  const audioEngine = useAudioEngine();

  if (!track.placeholderClipStart) {
    return null;
  }

  const { top, left } = calculatePlaceholderClipPosition(
    audioEngine,
    track,
    CLIP_HEIGHT,
    CLIP_TOP_PADDING
  );

  const clipStartInPixels =
    track.placeholderClipStart!.toSamples() /
    audioEngine.timeline.samplesPerPixel;

  const updateWidthWithRAF = () => {
    if (audioEngine.state === "recording") {
      const transportPositionInPixels =
        Tone.Time(Tone.getTransport().seconds).toSamples() /
        audioEngine.timeline.samplesPerPixel;
      const newWidth = transportPositionInPixels - clipStartInPixels;
      setClipWidth(Math.max(newWidth, 1));
      rAFId.current = requestAnimationFrame(updateWidthWithRAF);
    }
  };

  useEffect(() => {
    if (audioEngine.state === "recording" && track.active) {
      rAFId.current = requestAnimationFrame(updateWidthWithRAF);
    }

    return () => {
      if (rAFId.current) {
        cancelAnimationFrame(rAFId.current);
      }
    };
  }, [audioEngine.state, track.active]);

  return (
    <div
      style={{
        left,
        top,
        position: "absolute",
        background: convertRgbToRgba(track.color, 0.5),
        opacity: 0.9,
        width: clipWidth >= 1 ? clipWidth : 1,
        height: "80px",
        borderRadius: "10px",
        color: "blue",
        border: `1px solid ${track.color}`,
        zIndex: 3,
        overflow: "hidden",
      }}
    />
  );
});
