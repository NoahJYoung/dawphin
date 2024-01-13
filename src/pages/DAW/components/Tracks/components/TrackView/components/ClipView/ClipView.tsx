import { observer } from "mobx-react-lite";
import React, { useRef } from "react";
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

export const ClipView = observer(
  ({ clip, timelineRect, color }: ClipViewProps) => {
    const prevX = useRef(0);

    const { waveSurferRef, audioEngine, fadeMode, setFadeMode, clipWidth } =
      useClip(clip);

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

    const handleDragStart = (e: React.DragEvent) => {
      const transparentImage = new Image();
      transparentImage.src = "";
      e.dataTransfer.setDragImage(transparentImage, 0, 0);

      const clickX = e.clientX;
      const clickY = e.clientY;
      const clipRect = e.currentTarget.getBoundingClientRect();

      const fadeInEndPosition =
        clip.fadeIn.toSamples() / audioEngine.timeline.samplesPerPixel +
        clipRect.left;
      const fadeOutStartPosition =
        clipRect.right -
        clip.fadeOut.toSamples() / audioEngine.timeline.samplesPerPixel;

      if (clickY - clipRect.top < 25) {
        if (Math.abs(clickX - fadeInEndPosition) < 10) {
          setFadeMode("in");
        } else if (Math.abs(clickX - fadeOutStartPosition) < 10) {
          setFadeMode("out");
        } else {
          setFadeMode(null);
        }
      } else {
        setFadeMode(null);
      }
    };

    const handleMouseUp = () => {
      setFadeMode(null);
    };

    const handleDrag = (e: React.DragEvent) => {
      const dragValue = 2.5;
      const movementValue = dragValue * audioEngine.timeline.samplesPerPixel;
      e.preventDefault();
      if (waveSurferRef.current && timelineRect) {
        if (!fadeMode) {
          if (e.clientX !== prevX.current) {
            if (e.clientX > prevX.current) {
              audioEngine.moveSelectedClips(movementValue, "right");
            } else {
              audioEngine.moveSelectedClips(movementValue, "left");
            }
            prevX.current = e.clientX;
          }
        } else if (fadeMode === "in") {
          if (e.clientX !== prevX.current) {
            if (!clip.isSelected) {
              audioEngine.deselectClips();
              clip.setSelect(true);
            }
            if (e.clientX > prevX.current) {
              audioEngine.setFadeInOnSelectedClips(movementValue, "right");
            } else {
              audioEngine.setFadeInOnSelectedClips(movementValue, "left");
            }
            prevX.current = e.clientX;
          }
        } else {
          if (!clip.isSelected) {
            audioEngine.deselectClips();
            clip.setSelect(true);
          }
          if (e.clientX !== prevX.current) {
            if (e.clientX > prevX.current) {
              audioEngine.setFadeOutOnSelectedClips(movementValue, "right");
            } else {
              audioEngine.setFadeOutOnSelectedClips(movementValue, "left");
            }
            prevX.current = e.clientX;
          }
        }
      }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 2) {
        prevX.current = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        const avgClientX = (touch1.clientX + touch2.clientX) / 2;

        const dragValue = 10;
        const movementValue = dragValue * audioEngine.timeline.samplesPerPixel;

        if (waveSurferRef.current && timelineRect) {
          if (avgClientX !== prevX.current) {
            if (avgClientX > prevX.current) {
              audioEngine.moveSelectedClips(movementValue, "right");
            } else {
              audioEngine.moveSelectedClips(movementValue, "left");
            }
            prevX.current = avgClientX;
          }
        }
      }
    };

    const { top, left } = calculateClipPosition(
      audioEngine,
      clip,
      CLIP_HEIGHT,
      CLIP_TOP_PADDING
    );

    const backgroundAlpha = clip.isSelected ? 0.5 : 0.2;

    return (
      <>
        <div
          id={`wave-container${clip.id}`}
          draggable={fadeMode === null}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onMouseUp={handleMouseUp}
          onTouchEnd={() => {
            if (audioEngine.timeline.snap) {
              audioEngine.quantizeSelectedClips();
            }
          }}
          onDrag={handleDrag}
          onDragStart={handleDragStart}
          onDragEnd={() => {
            setFadeMode(null);
            if (audioEngine.timeline.snap) {
              audioEngine.quantizeSelectedClips();
            }
          }}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => e.preventDefault()}
          style={{
            left,
            top,
            position: "absolute",
            background: convertRgbToRgba(color, backgroundAlpha),
            opacity: clip.isSelected ? 0.9 : 0.8,
            width: clipWidth >= 1 ? clipWidth : 1,
            height: "80px",
            borderRadius: "6px",
            color: "blue",
            border: `1px solid ${color}`,
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
              color: convertRgbToRgba("rgb(0, 0, 0)", 0.5),
              position: "absolute",
              fontWeight: "bold",
              fontSize: "0.75rem",
              zIndex: -1,
              userSelect: "none",
            }}
          >
            {`${clip.track.name} | ${clip.start.toBarsBeatsSixteenths()}`}
          </p>

          <FadeCurve
            key={"fadeIn"}
            fadeInLengthInSamples={clip.fadeIn.toSamples()}
            fadeOutLengthInSamples={clip.fadeOut.toSamples()}
            height={CLIP_HEIGHT}
            color={color}
            samplesPerPixel={audioEngine.timeline.samplesPerPixel}
            clipDurationInSamples={clip.duration?.toSamples() || 0}
          />
        </div>
      </>
    );
  }
);
