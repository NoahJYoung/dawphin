interface PlayheadProps {
  left: number;
  width: number;
  gridHeight: number;
  moveCursor: (e: React.MouseEvent) => void;
  playheadRef: React.LegacyRef<SVGSVGElement>;
}

export const Playhead = ({
  left,
  width,
  moveCursor,
  gridHeight,
  playheadRef,
}: PlayheadProps) => (
  <svg
    ref={playheadRef}
    onClick={moveCursor}
    style={{
      zIndex: 5,
      position: "absolute",
    }}
    width={width.toString()}
    height={gridHeight.toString()}
  >
    <rect
      x={(left - 1).toString()}
      y="0"
      width="2"
      height={gridHeight}
      fill="blue"
    />
  </svg>
);
