import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { AudioEngine } from "src/AudioEngine";
import * as Tone from "tone";

interface CompressorMetersProps {
  compressor: Tone.Compressor;
  audioEngine: AudioEngine;
}

const meterContainerStyles: any = {
  background: "#111",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

export const CompressorMeters = observer(
  ({ compressor, audioEngine }: CompressorMetersProps) => {
    const inputCanvasRef = useRef<HTMLCanvasElement>(null);
    const outputCanvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number | null>(null);

    const canvasHeight = 200;

    const drawOutputMeter = (
      canvasRef: React.RefObject<HTMLCanvasElement>,
      meterValue: number
    ) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      const canvasWidth = canvas?.width ?? 0;
      if (!context || !canvas) return;

      context.clearRect(0, 0, canvasWidth, canvasHeight);

      const totalHeight = Math.max(0, (meterValue + 60) * (canvasHeight / 60));
      const greenHeight = Math.min(totalHeight, (52 * canvasHeight) / 60);
      const yellowHeight = Math.min(
        totalHeight - greenHeight,
        (56 * canvasHeight) / 60 - greenHeight
      );
      const redHeight = totalHeight - greenHeight - yellowHeight;

      context.fillStyle = "green";
      context.fillRect(0, canvasHeight - greenHeight, canvasWidth, greenHeight);

      context.fillStyle = "yellow";
      context.fillRect(
        0,
        canvasHeight - greenHeight - yellowHeight,
        canvasWidth,
        yellowHeight
      );

      context.fillStyle = "red";
      context.fillRect(
        0,
        canvasHeight - greenHeight - yellowHeight - redHeight,
        canvasWidth,
        redHeight
      );
    };

    const drawCompressionMeter = (
      canvasRef: React.RefObject<HTMLCanvasElement>,
      meterValue: number
    ) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      const canvasWidth = canvas?.width ?? 0;
      if (!context || !canvas) return;

      context.clearRect(0, 0, canvasWidth, canvasHeight);

      const blueHeight = Math.max(
        0,
        Math.abs(meterValue) * (canvasHeight / 60)
      );

      context.fillStyle = "blue";
      context.fillRect(0, 0, canvasWidth, blueHeight);
    };

    const outputMeter = new Tone.Meter(0.9);

    useEffect(() => {
      compressor.connect(outputMeter);

      const draw = () => {
        if (
          audioEngine.state !== "playing" &&
          audioEngine.state !== "recording"
        ) {
          if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
          }
          return;
        }

        const compression = compressor.reduction;
        const outputLevel = outputMeter.getValue() as number;

        drawCompressionMeter(inputCanvasRef, compression);
        drawOutputMeter(outputCanvasRef, outputLevel);

        animationFrameId.current = requestAnimationFrame(draw);
      };

      draw();

      return () => {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      };
    }, [audioEngine.state, compressor, canvasHeight]);

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          background: "#111",
          padding: "5px",
          gap: "10px",
          borderRadius: "5px",
        }}
      >
        <div style={meterContainerStyles}>
          <canvas width={150} height={canvasHeight} ref={inputCanvasRef} />
          <label>Reduction</label>
        </div>

        <div style={meterContainerStyles}>
          <canvas width={150} height={canvasHeight} ref={outputCanvasRef} />
          <label>Output</label>
        </div>
      </div>
    );
  }
);
