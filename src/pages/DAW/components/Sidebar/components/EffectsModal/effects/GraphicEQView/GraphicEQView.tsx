import { CenterFrequency, EQGrid } from "./components";
import { Point } from "./types";
import * as d3 from "d3";
import { getCurvePoints } from "./helpers";
import { observer } from "mobx-react-lite";

import { GraphicEQ } from "src/AudioEngine/Effects/Equalizer/GraphicEQ";
import { Knob } from "src/pages/DAW/UIKit";

import styles from "./GraphicEQView.module.scss";

interface EqualizerViewProps {
  width: number;
  height: number;
  graphicEQ: GraphicEQ;
}

export const GraphicEQView = observer(
  ({ width, height, graphicEQ }: EqualizerViewProps) => {
    const testEQBands = graphicEQ.bands;
    const curvePoints = getCurvePoints(
      [...testEQBands].sort((a, b) => a.hertz - b.hertz)
    );
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

    const combinedCurvePath = lineGenerator(curvePoints);

    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
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

            {testEQBands.map((band, i) => (
              <CenterFrequency
                className={styles.bandPoint}
                scaleX={scaleX}
                scaleY={scaleY}
                band={band}
                key={i}
              />
            ))}
          </svg>
        </div>
        <button onClick={() => graphicEQ.createBand()}>New Band</button>
        <>
          {testEQBands.map((band, i) => {
            return (
              <div
                key={`${band.hertz}-${i}`}
                style={{ display: "flex", gap: "20px" }}
              >
                <p style={{ color: "#888" }}>{`Band ${i + 1}`}</p>
                <Knob
                  min={20}
                  max={20000}
                  step={1}
                  size={60}
                  value={band.hertz}
                  suffix=" hz"
                  onChange={band.setHertz}
                  round
                />

                <Knob
                  double
                  min={-12}
                  max={12}
                  step={0.25}
                  size={60}
                  value={band.gain}
                  suffix=" Db"
                  onChange={band.setGain}
                />

                <Knob
                  double
                  min={0.2}
                  max={20}
                  step={0.1}
                  size={60}
                  value={band.Q}
                  onChange={band.setQ}
                />
              </div>
            );
          })}
        </>
      </div>
    );
  }
);
