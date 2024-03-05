import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { MasterControl } from "src/AudioEngine/MasterControl";
import { useAudioEngine } from "src/pages/DAW/hooks";

interface MasterMeterProps {
  master: MasterControl;
  canvasHeight: number;
  canvasWidth: number;
}

export const MasterMeter = observer(
  ({ master, canvasHeight, canvasWidth }: MasterMeterProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number | null>(null);
    const audioEngine = useAudioEngine();

    useEffect(() => {
      const shouldRun =
        audioEngine.state !== "stopped" && audioEngine.state !== "paused";
      const drawMeter = () => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!context) return;

        const leftMeterValue = master.leftMeter.getValue() as number;
        const rightMeterValue = master.rightMeter.getValue() as number;

        context.clearRect(0, 0, canvasWidth, canvasHeight);

        const drawChannelMeter = (
          x: number,
          width: number,
          meterValue: number
        ) => {
          const totalHeight = (meterValue + 60) * (canvasHeight / 60);
          const greenHeight = Math.min(totalHeight, (52 * canvasHeight) / 60);
          const yellowHeight = Math.min(
            totalHeight - greenHeight,
            (57 * canvasHeight) / 60 - greenHeight
          );
          const redHeight = totalHeight - greenHeight - yellowHeight;

          context.fillStyle = "green";
          context.fillRect(x, canvasHeight - greenHeight, width, greenHeight);
          context.fillStyle = "yellow";
          context.fillRect(
            x,
            canvasHeight - greenHeight - yellowHeight,
            width,
            yellowHeight
          );
          context.fillStyle = "red";
          context.fillRect(
            x,
            canvasHeight - greenHeight - yellowHeight - redHeight,
            width,
            redHeight
          );
        };

        drawChannelMeter(0, canvasWidth / 2 - 2, leftMeterValue);
        drawChannelMeter(
          canvasWidth / 2 + 2,
          canvasWidth / 2 - 2,
          rightMeterValue
        );

        if (shouldRun)
          animationFrameId.current = requestAnimationFrame(drawMeter);
      };

      if (shouldRun) drawMeter();

      return () => {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      };
    }, [master, canvasHeight, canvasWidth, audioEngine.state]);

    return (
      <div
        style={{
          width: canvasWidth,
          height: canvasHeight,
          background: "#000",
          borderRadius: "2px",
        }}
      >
        <canvas width={canvasWidth} height={canvasHeight} ref={canvasRef} />
      </div>
    );
  }
);
