import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";
import { MasterControl } from "src/AudioEngine/MasterControl";
import * as Tone from 'tone';

interface MasterMeterProps {
  master: MasterControl
  canvasHeight: number
  canvasWidth: number
}

export const MasterMeter = observer(({ master, canvasHeight, canvasWidth}: MasterMeterProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawEventId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!context) return;
    const clearCanvas = () => {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    Tone.getTransport().on('pause', clearCanvas);
    Tone.getTransport().on('stop', clearCanvas);


    const drawMeter = () => {
      const leftMeterValue = master.leftMeter.getValue() as number;
      const rightMeterValue = master.rightMeter.getValue() as number;
      
      const leftMeterHeight = (leftMeterValue + 60) * (canvasHeight / 60);
      context.fillStyle = "green";
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.fillRect(0, canvasHeight - leftMeterHeight, (canvasWidth / 2) - 2, leftMeterHeight);

      const rightMeterHeight = (rightMeterValue + 60) * (canvasHeight / 60);
      context.fillRect((canvasWidth / 2) + 2, canvasHeight - rightMeterHeight, (canvasWidth / 2) - 2, rightMeterHeight);
    };

    drawEventId.current = Tone.getTransport().scheduleRepeat(drawMeter, 0.05);

    return () => {
      if (drawEventId.current) {
        Tone.getTransport().clear(drawEventId.current);
      }
      Tone.getTransport().off('pause', clearCanvas);
      Tone.getTransport().off('stop', clearCanvas);
    };
  }, [master, canvasRef, canvasHeight, canvasWidth]);

  return (
    <div style={{ width: canvasWidth, height: canvasHeight, background: '#000', borderRadius: '5px' }}>
      <canvas width={canvasWidth} height={canvasHeight} ref={canvasRef} />
    </div>
  )
})