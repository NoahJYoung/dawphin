import { observer } from "mobx-react-lite";
import { useState, useRef, useEffect } from "react";
import { AudioEngine } from "src/AudioEngine";
import { Clip } from "src/AudioEngine/Track/Clip";
import WaveSurfer from "wavesurfer.js";
import { ClipContextMenu } from "./components";

interface ClipViewProps {
  clip: Clip,
  audioEngine: AudioEngine
  timelineRect: DOMRect | null
  renderCtx: AudioContext
  color: string
}

export const convertRgbToRgba = (rgb: string, alpha: number) => {
  const rgbValues = rgb.match(/\d+/g);
  if (!rgbValues || rgbValues.length !== 3) {
    throw new Error('Invalid RGB format');
  }
  const rgbaColor = `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${alpha})`;
  return rgbaColor;
}

export const ClipView = observer(({ clip, audioEngine, timelineRect, color }: ClipViewProps) => {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [peaks, setPeaks] = useState<number[][] | undefined>(undefined);
  const prevX = useRef(0);

  const [touchTimeout, setTouchTimeout] = useState<number | null>(null);
  const [isLongTouch, setIsLongTouch] = useState(false);
  const overviewRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (wavesurfer) {
      setPeaks(wavesurfer.exportPeaks())
    }
    const sampleRate = 44100;
    const pixelsPerSample = audioEngine.samplesPerPixel;
    const pixelsPerSecond = Math.round(sampleRate / pixelsPerSample);
    if (overviewRef?.current && clip.end) {
      const wavesurfer = WaveSurfer.create({
        interact: true,
        media: audioRef?.current || undefined,
        container: overviewRef.current,
        waveColor: convertRgbToRgba('rgb(0, 0, 0)', 0.5),
        progressColor: convertRgbToRgba('rgb(0, 0, 0)', 0.5),
        url: clip.audioSrc,
        height: 'auto',
        minPxPerSec: pixelsPerSecond,
        hideScrollbar: true,
        cursorWidth: 0,
        normalize: false,
        peaks,
      })
      setWavesurfer(wavesurfer);
    }
    
  }, [clip.duration, peaks]);
  

  const handleClick = (e: React.MouseEvent) => {
    if (!e.ctrlKey) {
      const initialState = clip.isSelected;
      audioEngine.deselectClips();
      clip.setSelect(!initialState);
    } else {
      clip.setSelect(true);
    }
    audioEngine.getSelectedClips()
  };

  const handleDragStart = (e: React.DragEvent) => {
    const transparentImage = new Image();
    transparentImage.src = '';
    e.dataTransfer.setDragImage(transparentImage, 0, 0);
  }

  const handleDrag = (e: React.DragEvent) => {
    const dragValue = 2.5
    const movementValue = dragValue * audioEngine.samplesPerPixel
    if (overviewRef.current && timelineRect) {
      if (e.clientX !== prevX.current) {
        if (e.clientX > prevX.current) {
          audioEngine.moveSelectedClips(movementValue, 'right');
        } else {
          audioEngine.moveSelectedClips(movementValue, 'left');
        }
        prevX.current = e.clientX
      }
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsLongTouch(false);

    setTouchTimeout(setTimeout(() => {
      setIsLongTouch(true);
      clip.setSelect(true);
    }, 500));
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    // if (touchTimeout) {
    //   clearTimeout(touchTimeout);
    //   setTouchTimeout(null)
    // }
  
    // if (isLongTouch) {
    //   if (overviewRef.current && timelineRect) {
    //     const container = e.currentTarget.parentElement;
    //     const x = (e.touches[0].clientX - timelineRect.left + (container?.scrollLeft || 0)) * 2;
        
    //     if (x > 0) {
    //       clip.setPosition((x * audioEngine.samplesPerPixel) / 2)
    //     } else {
    //       clip.setPosition(0);
    //     }
    //   }
    // }
  };
  
  const handleTouchEnd = () => {
    if (touchTimeout) {
      clearTimeout(touchTimeout);
      setTouchTimeout(null);
    }
    clip.setSelect(true);
    setIsLongTouch(false)
  };

  useEffect(() => {
    const sampleRate = 44100;
    const pixelsPerSample = audioEngine.samplesPerPixel;
    const pixelsPerSecond = Math.round(sampleRate / pixelsPerSample);
    wavesurfer?.zoom(pixelsPerSecond)
  }, [audioEngine.samplesPerPixel])

  const calculatePosition = () => {
    const left = Math.round(clip.start.toSamples() / audioEngine.samplesPerPixel);
    const top = audioEngine.tracks.findIndex((track) => track.id === clip.trackId) * 80;

    return { top, left };
  }

  useEffect(() => {
    const container = document.querySelector(`#wave-container${clip.id} > div`);
    if (container) {
      const shadowRoot = container.shadowRoot;
      if (shadowRoot) {
        const firstDiv = shadowRoot.querySelector('.scroll[part="scroll"]') as HTMLElement;
        if (firstDiv) {
          firstDiv.style.pointerEvents = 'none';
        }
      }
    }
  }, [overviewRef.current])

  const clipWidth = (clip?.duration?.toSamples() || 1) / audioEngine.samplesPerPixel;
 
  const { top, left } = calculatePosition();

  const backgroundAlpha = clip.isSelected ? 0.5 : 0.2;

  return (
    <>
      <div
        id={`wave-container${clip.id}`}
        draggable
        onDrag={handleDrag}
        onDragStart={handleDragStart}
        onDragEnd={() => {
          if (audioEngine.snap) {
            audioEngine.quantizeSelectedClips();
          }
        }}
        // onTouchStart={handleTouchStart}
        // onTouchMove={handleTouchMove}
        // onTouchEnd={handleTouchEnd}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={e => e.preventDefault()}
        
        style={{
          left,
          top,
          position: 'absolute',
          background: convertRgbToRgba(color, backgroundAlpha),
          opacity: clip.isSelected ? 0.9 : 0.8,
          width: clipWidth >= 1 ? clipWidth : 1,
          height: '80px',
          borderRadius: '10px',
          color: 'blue',
          border: `1px solid ${color}`,
          zIndex: 3,
        }}
        ref={overviewRef}
        onClick={handleClick}
      />
      <audio src={clip.audioSrc} ref={audioRef} />
    </>
  )
}) 