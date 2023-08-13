import React, { useRef, useEffect, Dispatch, SetStateAction, useMemo } from 'react';
import { AudioEngine } from 'src/AudioEngine';
import * as Tone from 'tone';
import { sampleToTick } from './helpers/conversions';

interface TimelineProps {
  audioEngine: AudioEngine
  setTimelineRect: Dispatch<SetStateAction<DOMRect | null>>
  timelineRect: DOMRect | null
}


// TODO: UPDATE HARDCODED TIME SIGNATURE VALUES
// TODO: FIGURE OUT HOW TO HANDLE TOTAL BARS
const calculateGridlineValues = () => {
  const ticksPerBeat = Tone.Transport.PPQ;
  const totalBars = 100;     
  const beatsPerGridLine = 0.5;
  const ticksPerGridLine = ticksPerBeat * beatsPerGridLine;
  const samplesPerTick = Tone.context.sampleRate / Tone.Transport.PPQ;
  const samplesPerGridLine = samplesPerTick * ticksPerGridLine;
  const totalTicks = (ticksPerBeat * 4) * totalBars;
  const totalSamples = totalTicks * samplesPerTick;
  const totalGridLines = Math.floor(totalSamples / samplesPerGridLine);

  return {
    totalGridLines,
    samplesPerGridLine,
  }
}

export const Timeline = ({ audioEngine, setTimelineRect, timelineRect }: TimelineProps) => {
  const transport = Tone.getTransport();

  const gridlineData = useMemo(() => calculateGridlineValues(), [])
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const topBarCanvasRef = useRef<HTMLCanvasElement>(null);
  const playheadCanvasRef = useRef<HTMLCanvasElement>(null);

  const drawGrid = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { totalGridLines, samplesPerGridLine } = gridlineData;
      // const ticksPerBeat = Tone.Transport.PPQ;
      // const totalBars = 100;     
      // const beatsPerGridLine = 0.5;
      // const ticksPerGridLine = ticksPerBeat * beatsPerGridLine;
    
      // const samplesPerGridLine = audioEngine.samplesPerTick * ticksPerGridLine;
    
      // const totalTicks = (ticksPerBeat * 4) * totalBars;
      // const totalSamples = totalTicks * audioEngine.samplesPerTick;
      // const totalGridLines = Math.floor(totalSamples / samplesPerGridLine);
    
      for (let i = 0; i <= totalGridLines; i++) {
        const sample = i * samplesPerGridLine;
        const x = sample / audioEngine.samplesPerPixel;
        
        ctx.strokeStyle = 'lightgray';
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
    };
  }

  const drawTopBar = () => {
    const topBarCanvas = topBarCanvasRef.current;
    const topBarCtx = topBarCanvas?.getContext('2d', { willReadFrequently: true });
    
    if (topBarCanvas && topBarCtx) {
      const ticksPerBeat = Tone.Transport.PPQ;
      // !!!!!!!! BEATS PER MEASURE
      const beatsPerMeasure = 4;
      const ticksPerMeasure = ticksPerBeat * beatsPerMeasure;
  
      const samplesPerMeasure = audioEngine.samplesPerTick * ticksPerMeasure;
  
      const totalBars = 100;
      const totalMeasures = (totalBars * beatsPerMeasure);
  
      topBarCtx.clearRect(0, 0, topBarCanvas.width, topBarCanvas.height);
  
      for (let i = 0; i <= totalMeasures; i++) {
        const sample = i * samplesPerMeasure / 2;
        const x = sample / audioEngine.samplesPerPixel;
  
        topBarCtx.strokeStyle = '#888';
        topBarCtx.beginPath();
        topBarCtx.moveTo(x, 0);
        topBarCtx.lineTo(x, topBarCanvas.height);
        topBarCtx.stroke();
  
        topBarCtx.fillStyle = '#888';
        topBarCtx.font = '12px Arial';
        topBarCtx.fillText(`${i + 1}`, x + 2, 15);
      }
    }
  };
  
  const updatePlayhead = () => {
    const playheadCanvas = playheadCanvasRef.current;
    const playheadCtx = playheadCanvas?.getContext('2d', { willReadFrequently: true });

    if (playheadCanvas && playheadCtx) {
      playheadCtx.clearRect(0, 0, playheadCanvas?.width, playheadCanvas.height);
  
      const currentPositionSamples = transport.ticks * audioEngine.samplesPerTick;
  
      const playheadX = (currentPositionSamples / audioEngine.samplesPerPixel) / 2;
  
      playheadCtx.fillStyle = 'blue';
      playheadCtx.fillRect(playheadX, 0, 2, playheadCanvas.height);
    }
  };

  useEffect(() => {
    if (!!canvasRef.current && !!playheadCanvasRef.current) {
      const rect = playheadCanvasRef.current.getBoundingClientRect();
      setTimelineRect(rect);
      Tone.Transport.scheduleRepeat(updatePlayhead, '128n')
      drawGrid();
      drawTopBar()
      updatePlayhead();
    };
  }, [transport]);

  const canvasHeight = 2000;
  const canvasWidth = 20000;
  const topBarHeight = 30;

  return (
    <div style={{
      maxHeight: '60vh',
      minHeight: '60vh',
      // position: 'relative',
      overflowY: 'scroll',
    }}>
      <canvas
        ref={canvasRef}
        style={{
          marginLeft: 250,
          position: 'absolute',
          top: 0,
          left: 0,
          width: canvasWidth,
          zIndex: -1,
        }}
        width={canvasWidth}
        height={canvasHeight} // Use the desired canvas height
      />
      <canvas
        ref={topBarCanvasRef}
        style={{
          marginLeft: 250,
          position: 'absolute',
          top: 0,
          left: 0,
          width: canvasWidth,
        }}
        width={canvasWidth}
        height={topBarHeight}
        />
      <canvas
        ref={playheadCanvasRef}
        onClick={(e) => {
          if (playheadCanvasRef.current && timelineRect) {
            const x = (e.clientX - timelineRect.left) * 2;
            audioEngine.setPosition(sampleToTick(x * audioEngine.samplesPerPixel, audioEngine.samplesPerTick), updatePlayhead)
          }
        }}
        style={{
          marginLeft: 250,
          position: 'absolute',
          top: 0,
          left: 0,
          width: canvasWidth,
          zIndex: 0,
        }}
        onDragOver={e => e.preventDefault()}
        onDragEnter={e => e.preventDefault()}
        onWheel={(e) => {
          if (audioEngine.state !== 'playing') {
            if (e.deltaY > 0) {
              audioEngine.setZoom('zoomOut');
            } else {
              audioEngine.setZoom('zoomIn');
            }
            drawGrid();
            drawTopBar();
            updatePlayhead();
          }
        }}
        width={canvasWidth}
        height={canvasHeight}
      />
    </div>
  );
};

export default Timeline;
