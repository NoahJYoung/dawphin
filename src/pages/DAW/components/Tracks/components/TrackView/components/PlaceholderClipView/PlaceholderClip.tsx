import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Track } from "src/AudioEngine/Track";
import { CLIP_HEIGHT, CLIP_TOP_PADDING } from "src/pages/DAW/constants";
import { convertRgbToRgba } from "src/pages/DAW/helpers";
import * as Tone from "tone";

interface PlaceholderClipProps {
  track: Track;
}

export const PlaceholderClip = observer(({ track }: PlaceholderClipProps) => {
  const audioEngine = track.audioEngine;
  const [clipWidth, setClipWidth] = useState(1);

  if (!track.placeholderClipStart) {
    return null;
  }

  const calculatePosition = () => {
    const left = Math.round(
      track.placeholderClipStart!.toSamples() / audioEngine.samplesPerPixel
    );
    const top =
      audioEngine.tracks.findIndex(
        (audioEngineTrack) => audioEngineTrack.id === track.id
      ) *
        (CLIP_HEIGHT + CLIP_TOP_PADDING) +
      CLIP_TOP_PADDING / 2;

    return { top, left };
  };

  const { top, left } = calculatePosition();

  const clipStartInPixels =
    track.placeholderClipStart!.toSamples() / audioEngine.samplesPerPixel;

  useEffect(() => {
    if (audioEngine.state === "recording") {
      Tone.getTransport().scheduleRepeat(() => {
        const transportPositionInPixels =
          Tone.Time(Tone.getTransport().seconds).toSamples() /
          audioEngine.samplesPerPixel;
        const newWidth = transportPositionInPixels - clipStartInPixels;
        setClipWidth(newWidth);
      }, 0.01);
    }
  }, [audioEngine.state]);

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
