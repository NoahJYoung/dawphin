import React, {
  useEffect,
  type Dispatch,
  type SetStateAction,
  useRef,
} from 'react';
import {
  Playhead,
  TimelineContextMenu,
  TimelineGrid,
  TopBar,
} from './components';
import type { AudioEngine } from 'src/AudioEngine';
import { observer } from 'mobx-react-lite';
import * as Tone from 'tone';
import { useTimeline } from './hooks';
import { CLIP_HEIGHT, TOPBAR_HEIGHT, TRACK_PANEL_FULL_WIDTH, TRACK_PANEL_RIGHT_PADDING } from '../../constants';

import './TimelineView.css';

interface TimelineProps {
  audioEngine: AudioEngine
  setTimelineRect: Dispatch<SetStateAction<DOMRect | null>>
  containerRef: React.MutableRefObject<HTMLDivElement | null>
  children: React.ReactNode
  trackPanelsRef: React.MutableRefObject<HTMLDivElement | null>
}

export const TimelineView = observer(({
  audioEngine,
  setTimelineRect,
  trackPanelsRef,
  children,
  containerRef,
}: TimelineProps) => {  

  const {
    playheadX,
    setPlayheadX,
    gridRef,
    topbarRef,
    playheadRef,
    gridWidth,
    sectionHeight
  } = useTimeline(audioEngine);

  const mouseX = useRef(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const divRect = e.currentTarget.getBoundingClientRect();
    mouseX.current = e.clientX - divRect.left;
  };
  
  const updatePlayhead = () => {
    const x = Math.round(((Tone.getTransport().seconds) * Tone.getContext().sampleRate) / audioEngine.samplesPerPixel);
    const width = containerRef.current?.clientWidth || 0;
    const multiplier = x / width;
    const reachedScreenEnd = x % width >= width - 100;
    const shouldAutoScroll = audioEngine.state !== 'stopped' && audioEngine.state !== 'paused'
    if (shouldAutoScroll && reachedScreenEnd) {
      containerRef.current!.scrollLeft! = width * Math.round(multiplier)
    }
    setPlayheadX(x);
  };

  const moveCursor = () => {
    if (gridRef.current) {
      const pixels = mouseX.current + (containerRef?.current?.scrollLeft || 0);
      const time = Tone.Time(pixels * audioEngine.samplesPerPixel, "samples");
      if (audioEngine.snap) {
        const quantizedTime = Tone.Time(time.quantize(audioEngine.quantizationValues[audioEngine.zoomIndex]));
        audioEngine.setPosition(quantizedTime);
      } else {
        audioEngine.setPosition(time);
      }
    }
  }

  useEffect(() => {
    if (!!gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect();
      setTimelineRect(rect);
      updatePlayhead();
    };
  }, [
    audioEngine.timeSignature,
    playheadRef.current,
    audioEngine.bpm,
    audioEngine.tracks.length,
    audioEngine.zoomIndex,
    audioEngine.samplesPerPixel,
    containerRef.current,
  ]);

  useEffect(() => {
    Tone.getTransport().scheduleRepeat(() => {
      updatePlayhead()
    }, 0.01);
    audioEngine.updateTimelineUI = updatePlayhead;
  }, []);

  return (
    <TimelineContextMenu audioEngine={audioEngine}>
      <div
        className="timeline"
        ref={containerRef}
        onClick={moveCursor}
        onMouseMove={handleMouseMove}
        onScroll={(e) => {
          const target = e.target as HTMLDivElement
          audioEngine.scrollXOffsetPixels = target.scrollLeft;
          if (trackPanelsRef?.current) {
            trackPanelsRef.current.scrollTop = target.scrollTop
          }
        }}
        style={{
          paddingRight: '1px',
          maxHeight: '60vh',
          minHeight: '60vh',
          position: 'relative',
          overflowY: 'auto',
          overflowX: 'scroll',
        }}
      >
        <div onClick={moveCursor}
          style={{
            zIndex: -1,
            pointerEvents: 'none',
            borderRadius: '5px'
          }}
        >
          <TimelineGrid
            audioEngine={audioEngine}
            gridRef={gridRef}
            gridWidth={gridWidth}
            gridHeight={sectionHeight}
            clipHeight={CLIP_HEIGHT}
            topbarHeight={TOPBAR_HEIGHT}
          />
        </div>
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 4,
          height: TOPBAR_HEIGHT,
          width: gridWidth,
          background: '#888',
          borderRadius: '5px'
        }}>
          <TopBar
            audioEngine={audioEngine}
            topbarRef={topbarRef}
            topBarHeight={TOPBAR_HEIGHT}
            gridWidth={gridWidth}
          />
        </div>
        <div >
          { children }
        </div>
        <div
          onClick={moveCursor}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: gridWidth,
            height: sectionHeight,
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          <Playhead
            playheadRef={playheadRef}
            moveCursor={moveCursor}
            width={gridWidth}
            left={playheadX}
            gridHeight={sectionHeight}
          />
        </div>
      </div>
    </TimelineContextMenu>
  );
})
