import { observer } from "mobx-react-lite";
import {
  calculateGridlineValues,
  getTimeSignature,
  zoomToGridlineMap,
} from "../../helpers";
import { CLIP_TOP_PADDING } from "src/pages/DAW/constants";
import { useAudioEngine } from "src/pages/DAW/hooks";

interface TimelineGridProps {
  gridRef: React.LegacyRef<SVGSVGElement>;
  gridWidth: number;
  gridHeight: number;
  clipHeight: number;
  topbarHeight: number;
}

export const TimelineGrid = observer(
  ({
    gridRef,
    gridWidth,
    gridHeight,
    clipHeight,
    topbarHeight,
  }: TimelineGridProps) => {
    const audioEngine = useAudioEngine();

    const { totalBeats, samplesPerBeat } = calculateGridlineValues(audioEngine);
    const measuresOnly = audioEngine.timeline.samplesPerPixel >= 2048;

    return (
      <svg
        onDragOver={(e) => e.preventDefault()}
        ref={gridRef}
        style={{
          position: "absolute",
          pointerEvents: "none",
          cursor: "none",
        }}
        width={gridWidth}
        height={gridHeight}
        cursor="none"
      >
        <rect
          x="0"
          y="0"
          width={gridWidth}
          height={gridHeight}
          fill="transparent"
        />
        {audioEngine.tracks.map((_, trackIndex) => {
          const trackY =
            (trackIndex + 1) * (clipHeight + CLIP_TOP_PADDING) + topbarHeight;
          return (
            <line
              key={`track-line-${trackIndex}`}
              x1="0"
              y1={trackY}
              x2={gridWidth}
              y2={trackY}
              stroke="#555"
              strokeWidth={0.5}
            />
          );
        })}
        {Array.from({ length: totalBeats + 1 }).map((_, i) => {
          const sample = i * samplesPerBeat;
          let x = audioEngine.timeline.samplesToPixels(sample);

          if (measuresOnly) {
            x *= getTimeSignature(audioEngine);
          }
          const eighthNotes =
            zoomToGridlineMap[audioEngine.timeline.samplesPerPixel].eighthNotes;
          const sixteenthNotes =
            zoomToGridlineMap[audioEngine.timeline.samplesPerPixel]
              .sixteenthNotes;

          return (
            <g key={i}>
              <line
                key={i}
                x1={x}
                y1="0"
                x2={x}
                y2={gridHeight}
                stroke="#444"
              />

              {eighthNotes && (
                <line
                  key={`${i}8th`}
                  x1={x * 0.5}
                  y1="0"
                  x2={x * 0.5}
                  y2={gridHeight}
                  stroke="#444"
                />
              )}

              {sixteenthNotes && (
                <line
                  key={`${i}16th`}
                  x1={x * 0.25}
                  y1="0"
                  x2={x * 0.25}
                  y2={gridHeight}
                  stroke="#444"
                />
              )}
            </g>
          );
        })}
      </svg>
    );
  }
);
