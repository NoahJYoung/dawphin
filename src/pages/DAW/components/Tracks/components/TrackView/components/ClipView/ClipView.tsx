import { observer } from "mobx-react-lite";
import React from "react";
import { Clip } from "src/AudioEngine/Track/Clip";
import { CLIP_HEIGHT, CLIP_TOP_PADDING } from "src/pages/DAW/constants";
import { convertRgbToRgba } from "src/pages/DAW/helpers";
import { calculateClipPosition } from "./helpers";
import { FadeCurve } from "./components";
import { useClip } from "./hooks";

interface ClipViewProps {
  clip: Clip;
  timelineRect: DOMRect | null;
  renderCtx: AudioContext;
  color: string;
}

export const ClipView = observer(({ clip, color }: ClipViewProps) => {
  const { waveSurferRef, audioEngine, clipWidth } = useClip(clip);

  const handleClick = (e: React.MouseEvent) => {
    const initialState = clip.isSelected;

    if (!e.ctrlKey) {
      audioEngine.deselectClips();
      clip.setSelect(true);
    } else {
      clip.setSelect(!initialState);
    }
    audioEngine.getSelectedClips();
  };

  const { top, left } = calculateClipPosition(
    audioEngine,
    clip,
    CLIP_HEIGHT,
    CLIP_TOP_PADDING
  );

  const backgroundAlpha = clip.isSelected ? 0.7 : 0.4;

  return (
    <div
      id={`wave-container${clip.id}`}
      style={{
        left,
        top: top + clip.yOffset,
        position: "absolute",
        background: convertRgbToRgba(color, backgroundAlpha),
        opacity: clip.isSelected ? 0.9 : 0.8,
        width: clipWidth >= 1 ? clipWidth : 1,
        height: "80px",
        borderRadius: "6px",
        color: "blue",
        zIndex: 3,
        overflow: "hidden",
      }}
      ref={waveSurferRef}
      onClick={handleClick}
    >
      <p
        onDragOver={(e) => e.preventDefault()}
        style={{
          margin: 0,
          marginLeft: 12,
          color: convertRgbToRgba("rgb(0, 0, 0)", 0.6),
          position: "absolute",
          fontWeight: "bold",
          fontSize: "0.75rem",
          zIndex: -1,
          userSelect: "none",
          flexWrap: "nowrap",
        }}
      >
        {`${clip.track.name} | ${clip.start.toBarsBeatsSixteenths()}`}
      </p>

      <FadeCurve
        key={"fadeIn"}
        clip={clip}
        fadeInLengthInSamples={clip.fadeIn.toSamples()}
        fadeOutLengthInSamples={clip.fadeOut.toSamples()}
        height={CLIP_HEIGHT}
        color={color}
        clipDurationInSamples={clip.duration?.toSamples() || 0}
      />
    </div>
  );
});
