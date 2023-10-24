interface PlayheadProps {
  left: number;
  width: number;
  gridHeight: number;
  onClick: (e: React.MouseEvent) => void;
  playheadRef: React.LegacyRef<SVGSVGElement>;
}

export const Playhead = ({
  left,
  width,
  onClick,
  gridHeight,
  playheadRef,
}: PlayheadProps) => (
  <svg
    ref={playheadRef}
    onClick={onClick}
    onDragOver={(e) => e.preventDefault()}
    style={{
      zIndex: 5,
      position: "absolute",
      cursor: "none",
    }}
    width={width.toString()}
    height={gridHeight.toString()}
  >
    <rect
      x={(left - 1).toString()}
      y="0"
      width="2"
      height={gridHeight}
      fill="#aaa"
    />
  </svg>
);
