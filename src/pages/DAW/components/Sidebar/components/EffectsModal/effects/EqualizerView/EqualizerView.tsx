import { EQGrid } from "./components";
import { Point, mockedBands } from "./types";
import * as d3 from "d3";
import * as Tone from "tone";
import { getCurvePoints } from "./helpers";
import { useMemo } from "react";
import { observer } from "mobx-react-lite";

import styles from "./EqualizerView.module.scss";
import { Equalizer } from "src/AudioEngine/Effects/Equalizer/Equalizer";

interface EqualizerViewProps {
  width: number;
  height: number;
}

const testEq = new Equalizer(new Tone.Channel(), Tone.getDestination());

const testEqBands = testEq.bands;

export const EqualizerView = observer(
  ({ width, height }: EqualizerViewProps) => {
    const curvePoints = getCurvePoints(testEqBands);
    const scaleY = d3
      .scaleLinear()
      .domain([-12, 12])
      .range([height - 20, 0]);

    const scaleX = d3
      .scaleLog()
      .domain([20, 20000])
      .range([30, width - 15]);

    const lineGenerator = d3
      .line<Point>()
      .x((band) => scaleX(band.hertz))
      .y((band) => scaleY(band.gain))
      .curve(d3.curveBumpX);

    const combinedCurvePath = useMemo(
      () => lineGenerator(curvePoints),
      [mockedBands.length]
    );

    return (
      <>
        <div
          className={styles.container}
          style={{ height, width, borderRadius: "6px" }}
        >
          <svg width={width} height={height} style={{ borderRadius: "6px" }}>
            <EQGrid
              scaleY={scaleY}
              scaleX={scaleX}
              width={width}
              height={height}
            />

            {combinedCurvePath && (
              <path
                d={combinedCurvePath}
                fill="rgba(125, 0, 250, 0.5)"
                stroke="rgb(125, 0, 250)"
              />
            )}

            {testEqBands.map((band, i) => (
              <circle
                className={styles.bandPoint}
                key={i}
                stroke="#888"
                fill="transparent"
                cx={scaleX(band.hertz)}
                cy={scaleY(band.gain)}
                r={5}
              />
            ))}
          </svg>
        </div>
        <button onClick={() => testEq.createBand()}>New Band</button>
      </>
    );
  }
);
