import { XLines, YLines } from "./components";
import { xLines, yLines } from "../../helpers";

interface EQGridProps {
  width: number;
  height: number;
  scaleX: (value: number) => number;
  scaleY: (value: number) => number;
}

export const EQGrid = ({ width, height, scaleX, scaleY }: EQGridProps) => {
  return (
    <>
      <rect x="0" y="0" width={width} height={height} fill="black" />
      <XLines scaleX={scaleX} lines={xLines} height={height} width={width} />
      <YLines scaleY={scaleY} lines={yLines} height={height} width={width} />
    </>
  );
};
