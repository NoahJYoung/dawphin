import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { MasterControl } from "src/AudioEngine/MasterControl";

interface MasterMeterProps {
  master: MasterControl;
  canvasHeight: number;
  canvasWidth: number;
}

export const MasterMeter = observer(
  ({ master, canvasHeight, canvasWidth }: MasterMeterProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
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

        animationFrameId.current = requestAnimationFrame(drawMeter);
      };

      drawMeter();

      return () => {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      };
    }, [master, canvasHeight, canvasWidth]);

    return (
      <div
        style={{
          width: canvasWidth,
          height: canvasHeight,
          background: "#000",
          borderRadius: "5px",
        }}
      >
        <canvas width={canvasWidth} height={canvasHeight} ref={canvasRef} />
      </div>
    );
  }
);
