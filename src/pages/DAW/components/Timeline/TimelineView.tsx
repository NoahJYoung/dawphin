import React, {
  useRef,
  useEffect,
  type Dispatch,
  type SetStateAction,
  useMemo,
  useState,
} from 'react';
import {
  Playhead,
  TimelineContextMenu,
  TimelineGrid,
  TopBar,
} from './components';
import type { AudioEngine } from 'src/AudioEngine';
import { observer } from 'mobx-react-lite';
import { getTimeSignature } from './helpers';
import * as Tone from 'tone';

const GRID_HEIGHT = 2000;
const TOPBAR_HEIGHT = 30;
const CLIP_HEIGHT = 80;

interface TimelineProps {
  audioEngine: AudioEngine
  setTimelineRect: Dispatch<SetStateAction<DOMRect | null>>
  containerRef: React.MutableRefObject<HTMLDivElement | null>
  timelineRect: DOMRect | null
  children: React.ReactNode
  trackPanelsRef: React.MutableRefObject<HTMLDivElement | null>
}

export const TimelineView = observer(({ audioEngine, setTimelineRect, timelineRect, trackPanelsRef, children, containerRef }: TimelineProps) => {  
  const [playheadX, setPlayheadX] = useState(0);
  const gridRef = useRef<SVGSVGElement>(null);
  const topbarRef = useRef<SVGSVGElement>(null);
  const playheadRef = useRef<HTMLCanvasElement>(null);
  
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

  const moveCursor = (e: React.MouseEvent) => {
    if (gridRef.current && timelineRect) {
      const pixels = e.clientX + (containerRef?.current?.scrollLeft || 0) - 250;
      const time = Tone.Time(pixels * audioEngine.samplesPerPixel, "samples");
      Tone.getTransport().seconds = audioEngine.snap ? Tone.Time(time.quantize(audioEngine.quantizationValues[audioEngine.zoomIndex])).toSeconds() : time.toSeconds();
      updatePlayhead()
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
  }, [])

  const gridWidth = useMemo(() => {
    const beatsPerSecond = Tone.getTransport().bpm.value / 60;
    const samplesPerBeat = Tone.getContext().sampleRate / beatsPerSecond;
    const samplesPerMeasure = samplesPerBeat * getTimeSignature(audioEngine);
    const totalSamples = samplesPerMeasure * audioEngine.totalMeasures;
    const widthInPixels = totalSamples / audioEngine.samplesPerPixel;

    return widthInPixels;
  }, [audioEngine.samplesPerPixel, audioEngine.totalMeasures]);

  return (
    <TimelineContextMenu audioEngine={audioEngine}>
      <div
        ref={containerRef}
        onClick={moveCursor}
        onScroll={(e) => {
          const target = e.target as HTMLDivElement
          audioEngine.scrollXOffsetPixels = target.scrollLeft;
          if (trackPanelsRef?.current) {
            trackPanelsRef.current.scrollTop = target.scrollTop
          }
        }}
        style={{
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
          }}
        >
          <TimelineGrid
            audioEngine={audioEngine}
            gridRef={gridRef}
            gridWidth={gridWidth}
            gridHeight={GRID_HEIGHT}
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
            height: GRID_HEIGHT,
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          <Playhead
            moveCursor={moveCursor}
            width={gridWidth}
            left={playheadX}
            gridHeight={GRID_HEIGHT}
          />
        </div>
      </div>
    </TimelineContextMenu>
  );
})
