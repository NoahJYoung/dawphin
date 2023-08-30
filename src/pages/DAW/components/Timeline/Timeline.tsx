import React, { useRef, useEffect, Dispatch, SetStateAction, useMemo, useState } from 'react';
import { AudioEngine } from 'src/AudioEngine';
import * as Tone from 'tone';
import { observer } from 'mobx-react-lite';
import { TimelineContextMenu } from './components';

const CANVAS_HEIGHT = 2000;
const TOP_BAR_HEIGHT = 30;
const WAVEFORM_HEIGHT = 80;

interface TimelineProps {
  audioEngine: AudioEngine
  setTimelineRect: Dispatch<SetStateAction<DOMRect | null>>
  containerRef: React.MutableRefObject<HTMLDivElement | null>
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
    <rect x={(left - 1).toString()} y="0" width="2" height={CANVAS_HEIGHT} fill="blue" />
  </svg>
);

const calculateGridlineValues = (audioEngine: AudioEngine) => {
  const bpm = audioEngine.bpm;
  const secondsPerBeat = 60 / bpm;
  const samplesPerBeat = secondsPerBeat * Tone.getContext().sampleRate;
  const pixelsPerBeat = Math.round(samplesPerBeat / audioEngine.samplesPerPixel);
  const beatsPerMeasure = Tone.getTransport().timeSignature as number;

  
  const totalBeats = audioEngine.totalMeasures * beatsPerMeasure;

  return {
    totalBeats,
    samplesPerBeat,
    pixelsPerBeat
  };
};


export const Timeline = observer(({ audioEngine, setTimelineRect, timelineRect, trackPanelsRef, children, containerRef }: TimelineProps) => {
  
  const gridlineData = useMemo(() => calculateGridlineValues(audioEngine), [audioEngine.bpm, audioEngine.timeSignature, audioEngine.zoomIndex])
  const [playheadX, setPlayheadX] = useState(0);
  
  const gridRef = useRef<SVGSVGElement>(null);
  const topbarRef = useRef<SVGSVGElement>(null);
  const playheadRef = useRef<HTMLCanvasElement>(null);

  const drawSVGGrid = () => {
    const { totalBeats, samplesPerBeat } = gridlineData;
    const measuresOnly = audioEngine.samplesPerPixel >= 2048;

    const zoomToGridlineMap: Record<number, any> = {
      4092: { eighthNotes: false, sixteenthNotes: false},
      2048: { eighthNotes: false, sixteenthNotes: false},
      1024: { eighthNotes: false, sixteenthNotes: false},
      512: { eighthNotes: false, sixteenthNotes: false},
      256: { eighthNotes: true, sixteenthNotes: false},
      128: { eighthNotes: true, sixteenthNotes: false},
      64: { eighthNotes: true, sixteenthNotes: true},
      32: { eighthNotes: true, sixteenthNotes: true},
    }
    
    
    return (
      <svg ref={gridRef} style={{ position: 'absolute', pointerEvents: 'none'}} width={canvasWidth} height={CANVAS_HEIGHT}>
        <rect x="0" y="0" width={canvasWidth} height={CANVAS_HEIGHT} fill="#333" />
        {audioEngine.tracks.map((_, trackIndex) => {
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
        {Array.from({ length: totalBeats + 1 }).map((_, i) => {
          const sample = i * samplesPerBeat;
          let x = sample / audioEngine.samplesPerPixel;
  
          
          if (measuresOnly) {
            x *= getTimeSignature(audioEngine);
          }
          const eighthNotes = zoomToGridlineMap[audioEngine.samplesPerPixel].eighthNotes;
          const sixteenthNotes = zoomToGridlineMap[audioEngine.samplesPerPixel].sixteenthNotes;
  
          return (
            <g key={i}>
              <line
                key={i}
                x1={x} y1="0"
                x2={x} y2={CANVAS_HEIGHT}
                stroke="#444"
              />

              {eighthNotes && (
                <line
                  key={`${i}8th`}
                  x1={x * 0.5} y1="0"
                  x2={x * 0.5} y2={CANVAS_HEIGHT}
                  stroke="#444"
                />)}

              {sixteenthNotes && (
                <line
                  key={`${i}16th`}
                  x1={x * 0.25} y1="0"
                  x2={x * 0.25} y2={CANVAS_HEIGHT}
                  stroke="#444"
                />)}
            </g>
          );
        })}
      </svg>
    );
  };
  

  const drawTopBar = () => {
    const { totalBeats, samplesPerBeat } = gridlineData;
    const beatsPerMeasure = getTimeSignature(audioEngine);
    // const isSmallScale = audioEngine.samplesPerPixel < 2048;
    
    const zoomToGridlineMap: Record<number, any> = {
      4092: { eighthNotes: false, sixteenthNotes: false, quarterNotes: false},
      2048: { eighthNotes: false, sixteenthNotes: false, quarterNotes: false},
      1024: { eighthNotes: false, sixteenthNotes: false, quarterNotes: true},
      512: { eighthNotes: false, sixteenthNotes: false, quarterNotes: true},
      256: { eighthNotes: true, sixteenthNotes: false, quarterNotes: true},
      128: { eighthNotes: true, sixteenthNotes: false, quarterNotes: true},
      64: { eighthNotes: true, sixteenthNotes: true, quarterNotes: true},
      32: { eighthNotes: true, sixteenthNotes: true, quarterNotes: true},
    }

    return (
      <svg ref={topbarRef} style={{ position: 'absolute', pointerEvents: 'none' }} width={canvasWidth} height={TOP_BAR_HEIGHT}>
        {Array.from({ length: (totalBeats + 1) }).map((_, i) => {
          const sample = (i * samplesPerBeat) * beatsPerMeasure;
          const x = (sample / audioEngine.samplesPerPixel) / beatsPerMeasure;
          const isMeasure = i % beatsPerMeasure === 0;

          const isQuarterNote = !isMeasure

          const shouldDrawQuarterNotes = zoomToGridlineMap[audioEngine.samplesPerPixel].quarterNotes;
          const shouldDrawEighthNotes = zoomToGridlineMap[audioEngine.samplesPerPixel].eighthNotes;
          const shouldDrawSixteenthNotes = zoomToGridlineMap[audioEngine.samplesPerPixel].sixteenthNotes;
          
          return (
            <g key={i}>
              {isMeasure && (
                <line key={`${i}m`} x1={x} y1="0" x2={x} y2={TOP_BAR_HEIGHT} stroke="#444" />
              )}
              {isMeasure && (
                <text x={x + 2} y="15" fill="#444" fontSize="12px" fontFamily="Arial">
                  {i / beatsPerMeasure + 1}
                </text>
              )}
              {shouldDrawQuarterNotes && isQuarterNote && (
                <line key={`${i}4n`} x1={x} y1={TOP_BAR_HEIGHT * 0.25} x2={x} y2={TOP_BAR_HEIGHT} stroke="#444" />
              )}

              {shouldDrawEighthNotes && (
                <line key={`${i}8n`} x1={x * 0.5} y1={TOP_BAR_HEIGHT * 0.5} x2={x * 0.5} y2={TOP_BAR_HEIGHT} stroke="#444" />
              )}

              {shouldDrawSixteenthNotes && (
                <line key={`${i}16n`} x1={x * 0.25} y1={TOP_BAR_HEIGHT * 0.75} x2={x * 0.25} y2={TOP_BAR_HEIGHT} stroke="#444" />
              )}
            </g>
          );
        })}
      </svg>
    );
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
      drawTopBar()
      updatePlayhead();
    };
  }, [audioEngine.timeSignature, playheadRef.current, audioEngine.bpm, audioEngine.tracks.length, audioEngine.zoomIndex, audioEngine.samplesPerPixel, containerRef.current]);

  useEffect(() => {
    Tone.getTransport().scheduleRepeat(() => {
      updatePlayhead()
    }, 0.01);
    updatePlayhead();
  }, [])

  const canvasWidth = useMemo(() => {
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
    </TimelineContextMenu>
  );
})

export default Timeline;
