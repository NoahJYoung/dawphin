import React, { useRef, useEffect, Dispatch, SetStateAction, useMemo, useState } from 'react';
import { AudioEngine } from 'src/AudioEngine';
import * as Tone from 'tone';
import { observer } from 'mobx-react-lite';

const CANVAS_HEIGHT = 2000;
const CANVAS_WIDTH = 20000;
const TOP_BAR_HEIGHT = 30;
const WAVEFORM_HEIGHT = 120;

interface TimelineProps {
  audioEngine: AudioEngine
  setTimelineRect: Dispatch<SetStateAction<DOMRect | null>>
  setContainer: Dispatch<SetStateAction<HTMLDivElement | null>>
  timelineRect: DOMRect | null
  children: React.ReactNode
  trackPanelsRef: React.MutableRefObject<HTMLDivElement | null>
}

const getTimeSignature = (audioEngine: AudioEngine) => {
  if (Array.isArray(audioEngine.timeSignature)) {
    return audioEngine.timeSignature[0];
  } else {
    return audioEngine.timeSignature;
  }
}


const Playhead = ({ left, width, moveCursor }: { left: number, width: number, moveCursor: (e: React.MouseEvent) => void }) => (
  <svg onClick={moveCursor} style={{ zIndex: 5, position: 'absolute' }} width={width.toString()} height={CANVAS_HEIGHT.toString()}>
    <rect x={left.toString()} y="0" width="1" height={CANVAS_HEIGHT} fill="blue" />
  </svg>
);

// TODO: FIGURE OUT HOW TO HANDLE TOTAL BARS
const calculateGridlineValues = (audioEngine: AudioEngine) => {
  const ticksPerBeat = Tone.getTransport().PPQ;
  const totalBars = 100;
  const beatsPerGridLine = 0.5;
  const ticksPerGridLine = (ticksPerBeat * beatsPerGridLine * 60) / audioEngine.bpm;
  const samplesPerTick = Tone.getContext().sampleRate / Tone.getTransport().PPQ;
  const totalTicks = (ticksPerBeat * getTimeSignature(audioEngine)) * totalBars;
  const totalGridLines = Math.floor(totalTicks / ticksPerGridLine);
  const samplesPerGridLine = (samplesPerTick * ticksPerGridLine) * 2;

  return {
    totalGridLines,
    samplesPerGridLine,
  };
};


export const Timeline = observer(({ audioEngine, setTimelineRect, timelineRect, trackPanelsRef, children, setContainer }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridlineData = useMemo(() => calculateGridlineValues(audioEngine), [audioEngine.bpm, audioEngine.timeSignature, audioEngine.zoomIndex])
  const [playheadX, setPlayheadX] = useState(0);
  
  const gridRef = useRef<SVGSVGElement>(null);
  const topbarRef = useRef<SVGSVGElement>(null);
  const playheadRef = useRef<HTMLCanvasElement>(null);

  const drawSVGGrid = () => {
    const { totalGridLines, samplesPerGridLine } = gridlineData;
    const measuresOnly = audioEngine.samplesPerPixel >= 2048;
    
    return (
      <svg ref={gridRef} style={{ position: 'absolute', pointerEvents: 'none'}} width={canvasWidth} height={CANVAS_HEIGHT}>
        <rect x="0" y="0" width={canvasWidth} height={CANVAS_HEIGHT} fill="#333" />
        {audioEngine.tracks.map((track, trackIndex) => {
          const trackY = (trackIndex + 1) * WAVEFORM_HEIGHT + TOP_BAR_HEIGHT;
          return (
            <line
              key={`track-line-${trackIndex}`}
              x1="0" y1={trackY}
              x2={canvasWidth} y2={trackY}
              stroke="#444"
            />
          );
        })}
        {Array.from({ length: totalGridLines + 1 }).map((_, i) => {
          const sample = i * samplesPerGridLine;
          let x = sample / audioEngine.samplesPerPixel;
  
          if (measuresOnly) {
            x *= getTimeSignature(audioEngine);
          }
  
          return (
            <line
              key={i}
              x1={x} y1="0"
              x2={x} y2={CANVAS_HEIGHT}
              stroke="#444"
            />
          );
        })}
      </svg>
    );
  };
  

  const drawTopBar = () => {
    const { samplesPerGridLine, totalGridLines } = gridlineData;
    const beatsPerMeasure = getTimeSignature(audioEngine);
    const isSmallScale = audioEngine.samplesPerPixel < 2048;
  
    return (
      <svg ref={topbarRef} style={{ position: 'absolute', pointerEvents: 'none' }} width={canvasWidth} height={TOP_BAR_HEIGHT}>
        {Array.from({ length: totalGridLines + 1 }).map((_, i) => {
          const sample = (i * samplesPerGridLine) * beatsPerMeasure;
          const x = (sample / audioEngine.samplesPerPixel) / beatsPerMeasure;
          const isMeasure = i % beatsPerMeasure === 0;
  
          return (
            <g key={i}>
              {isMeasure && (
                <line x1={x} y1="0" x2={x} y2={TOP_BAR_HEIGHT} stroke="#444" />
              )}
              {isMeasure && (
                <text x={x + 2} y="15" fill="#444" fontSize="12px" fontFamily="Arial">
                  {i / beatsPerMeasure + 1}
                </text>
              )}
              {!isMeasure && isSmallScale && (
                <line x1={x} y1={TOP_BAR_HEIGHT / 2} x2={x} y2={TOP_BAR_HEIGHT} stroke="#444" />
              )}
            </g>
          );
        })}
      </svg>
    );
  };
  
  
  const updatePlayhead = () => {
    const x = Math.round(((Tone.getTransport().seconds) * Tone.getContext().sampleRate) / audioEngine.samplesPerPixel);
    setPlayheadX(x);
  };

  const moveCursor = (e: React.MouseEvent) => {
    if (gridRef.current && timelineRect) {
      const pixels = e.clientX + (containerRef?.current?.scrollLeft || 0) - timelineRect.x;
      const time = Tone.Time(pixels * audioEngine.samplesPerPixel, "samples");
      Tone.getTransport().seconds = time.toSeconds();
      updatePlayhead()
    }
  }
  

  useEffect(() => {
    if (!!gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect();
      setTimelineRect(rect);
      setContainer(containerRef.current)
      Tone.getTransport().scheduleRepeat(() => {
        updatePlayhead()
      }, 0.01)
      drawTopBar()
      updatePlayhead();
    };
  }, [audioEngine.timeSignature, playheadRef.current, audioEngine.bpm, audioEngine.tracks.length, audioEngine.zoomIndex, audioEngine.samplesPerPixel, containerRef.current]);

  const canvasWidth = useMemo(() => {
    const beatsPerSecond = Tone.getTransport().bpm.value / 60;
    const samplesPerBeat = Tone.getContext().sampleRate / beatsPerSecond;
    const samplesPerMeasure = samplesPerBeat * getTimeSignature(audioEngine);
    const totalSamples = samplesPerMeasure * audioEngine.totalMeasures;
    const widthInPixels = totalSamples / audioEngine.samplesPerPixel;

    return widthInPixels;
  }, [audioEngine.samplesPerPixel, audioEngine.totalMeasures]);

  return (
    <div
      ref={containerRef}
      onClick={moveCursor}
      onScroll={(e) => {
        const target = e.target as HTMLDivElement
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
      <div onClick={moveCursor} style={{ zIndex: -1, pointerEvents: 'none' }}>
        { drawSVGGrid() }
      </div>
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 4,
        height: TOP_BAR_HEIGHT,
        width: canvasWidth,
        background: '#888',
      }}>
        { drawTopBar() }
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
          width: canvasWidth,
          height: CANVAS_HEIGHT,
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        <Playhead moveCursor={moveCursor} width={canvasWidth} left={playheadX} />
      </div>
    </div>
  );
})

export default Timeline;
