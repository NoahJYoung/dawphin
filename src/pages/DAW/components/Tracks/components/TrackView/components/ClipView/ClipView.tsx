import { observer } from "mobx-react-lite";
import { useState, useRef, useEffect } from "react";
import { AudioEngine } from "src/AudioEngine";
import { Clip } from "src/AudioEngine/Track/Clip";
import { CLIP_HEIGHT, CLIP_TOP_PADDING } from "src/pages/DAW/constants";
import { convertRgbToRgba } from "src/pages/DAW/helpers";
import WaveSurfer from "wavesurfer.js";
import * as Tone from "tone";

// This file needs a lot of cleanup, but I'm committing now to push and test on mobile

interface ClipViewProps {
  clip: Clip;
  audioEngine: AudioEngine;
  timelineRect: DOMRect | null;
  renderCtx: AudioContext;
  color: string;
}

export const ClipView = observer(
  ({ clip, audioEngine, timelineRect, color }: ClipViewProps) => {
    const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
    const [peaks, setPeaks] = useState<number[][] | undefined>(undefined);
    const prevX = useRef(0);
    const overviewRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef(null);
    const touchStartX = useRef<number>(0);
    const touchStartY = useRef<number>(0);

    useEffect(() => {
      if (wavesurfer) {
        setPeaks(wavesurfer.exportPeaks());
      }
      const sampleRate = 44100;
      const pixelsPerSample = audioEngine.samplesPerPixel;
      const pixelsPerSecond = Math.round(sampleRate / pixelsPerSample);
      if (overviewRef?.current && clip.end) {
        const wavesurfer = WaveSurfer.create({
          interact: true,
          media: audioRef?.current || undefined,
          container: overviewRef.current,
          waveColor: convertRgbToRgba("rgb(0, 0, 0)", 0.5),
          progressColor: convertRgbToRgba("rgb(0, 0, 0)", 0.5),
          url: clip.audioSrc,
          height: "auto",
          minPxPerSec: pixelsPerSecond,
          hideScrollbar: true,
          cursorWidth: 0,
          normalize: false,
          peaks,
        });
        setWavesurfer(wavesurfer);
      }
    }, [clip.duration, peaks]);

    useEffect(() => {
      wavesurfer?.setOptions({ normalize: clip.normalized });
    }, [clip.normalized]);

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
    };

    const handleDrag = (e: React.DragEvent) => {
      const dragValue = 2.5;
      const movementValue = dragValue * audioEngine.samplesPerPixel;
      if (overviewRef.current && timelineRect) {
        if (e.clientX !== prevX.current) {
          if (e.clientX > prevX.current) {
            audioEngine.moveSelectedClips(movementValue, "right");
          } else {
            audioEngine.moveSelectedClips(movementValue, "left");
          }
          prevX.current = e.clientX;
        }
      }
    };

    const [isDraggable, setIsDraggable] = useState(false);
    const longPressTimer = useRef<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
      longPressTimer.current = setTimeout(() => {
        setIsDraggable(true);
      }, 500); // 500ms for long press
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };

    // const handleTouchMove = (e: React.TouchEvent) => {
    //   if (isDraggable) {
    //     // e.preventDefault();

    //     const dragValue = 2.5;
    //     const movementValue = dragValue * audioEngine.samplesPerPixel;

    //     // Using the first touch point. For multi-touch, this may need to be adjusted.
    //     const touchClientX = e.changedTouches[0].clientX;

    //     if (overviewRef.current && timelineRect) {
    //       if (touchClientX !== prevX.current) {
    //         if (touchClientX > prevX.current) {
    //           audioEngine.moveSelectedClips(movementValue, "right");
    //         } else {
    //           audioEngine.moveSelectedClips(movementValue, "left");
    //         }
    //         prevX.current = touchClientX;
    //       }
    //     }
    //   }
    // };

    // const handleGlobalTouchMove = (e: TouchEvent) => {
    //   if (overviewRef.current?.contains(e.target as Node)) {
    //     const deltaX = e.touches[0].clientX - touchStartX.current;
    //     const deltaY = e.touches[0].clientY - touchStartY.current;

    //     if (Math.abs(deltaX) > Math.abs(deltaY)) {
    //       e.preventDefault();
    //     }
    //   }
    // };

    const handleRawTouchMove = (e: TouchEvent) => {
      if (isDraggable) {
        e.preventDefault();
        const dragValue = 2.5;
        const movementValue = dragValue * audioEngine.samplesPerPixel;
        const touchClientX = e.changedTouches[0].clientX;

        if (overviewRef.current && timelineRect) {
          if (touchClientX !== prevX.current) {
            if (touchClientX > prevX.current) {
              audioEngine.moveSelectedClips(movementValue, "right");
            } else {
              audioEngine.moveSelectedClips(movementValue, "left");
            }
            prevX.current = touchClientX;
          }
        }
      }
    };

    useEffect(() => {
      // document.addEventListener("touchmove", handleGlobalTouchMove, {
      //   passive: false,
      // });

      if (overviewRef.current) {
        overviewRef.current.addEventListener("touchmove", handleRawTouchMove, {
          passive: false,
        });
      }

      return () => {
        // document.removeEventListener("touchmove", handleGlobalTouchMove);
        if (overviewRef.current) {
          overviewRef.current.removeEventListener(
            "touchmove",
            handleRawTouchMove
          );
        }
      };
    }, [isDraggable, audioEngine, timelineRect]);

    useEffect(() => {
      const sampleRate = Tone.getContext().sampleRate;
      const pixelsPerSample = audioEngine.samplesPerPixel;
      const pixelsPerSecond = Math.round(sampleRate / pixelsPerSample);
      wavesurfer?.zoom(pixelsPerSecond);
    }, [audioEngine.samplesPerPixel]);

    const calculatePosition = () => {
      const left = Math.round(
        clip.start.toSamples() / audioEngine.samplesPerPixel
      );
      const top =
        audioEngine.tracks.findIndex((track) => track.id === clip.track.id) *
          (CLIP_HEIGHT + CLIP_TOP_PADDING) +
        CLIP_TOP_PADDING / 2;

      return { top, left };
    };

    useEffect(() => {
      const container = document.querySelector(
        `#wave-container${clip.id} > div`
      );
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
    }, [overviewRef.current]);

    const clipWidth =
      (clip?.duration?.toSamples() || 1) / audioEngine.samplesPerPixel;

    const { top, left } = calculatePosition();

    const backgroundAlpha = clip.isSelected ? 0.5 : 0.2;

    return (
      <>
        <div
          id={`wave-container${clip.id}`}
          draggable
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          // onTouchMove={handleTouchMove}
          onDrag={handleDrag}
          onDragStart={handleDragStart}
          onDragEnd={() => {
            if (audioEngine.snap) {
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
          ref={overviewRef}
          onClick={handleClick}
        >
          <p
            style={{
              margin: 0,
              color: convertRgbToRgba("rgb(0, 0, 0)", 0.5),
              position: "absolute",
              fontWeight: "bold",
              fontSize: "0.75rem",
            }}
          >{`${clip.track.name} | ${clip.start.toBarsBeatsSixteenths()}`}</p>
        </div>
        <audio src={clip.audioSrc} ref={audioRef} />
      </>
    );
  }
);
