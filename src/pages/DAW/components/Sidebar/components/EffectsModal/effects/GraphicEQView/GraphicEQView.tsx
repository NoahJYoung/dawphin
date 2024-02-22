import { BandTab, CenterFrequency, EQGrid } from "./components";
import { Point } from "./types";
import * as d3 from "d3";
import { getCurvePoints } from "./helpers";
import { observer } from "mobx-react-lite";
import { GraphicEQ } from "src/AudioEngine/Effects/Equalizer/GraphicEQ";
import { Tabs } from "antd";
import { useRef, useState } from "react";
import { getCorrectedCurvePoints } from "./helpers/getCorrectedCurvePoints";

import { Band } from "src/AudioEngine/Effects/Equalizer/Band";
import {
  HighPassFilterIcon,
  HighShelfFilterIcon,
  PeakingFilterIcon,
} from "src/pages/DAW/icons";

import styles from "./GraphicEQView.module.scss";

const getBandIcon = (band: Band, index: number, selectedBandId: string) => {
  const selected = band.id === selectedBandId;
  const neutralColor = "#888";
  const selectedColor = "rgba(125, 0, 250)";
  const typeToLabelMap: Record<BiquadFilterType, unknown> = {
    peaking: (
      <PeakingFilterIcon
        color={selected ? selectedColor : neutralColor}
        number={index}
        size={28}
      />
    ),
    highpass: (
      <HighPassFilterIcon
        color={selected ? selectedColor : neutralColor}
        size={28}
      />
    ),
    highshelf: (
      <HighShelfFilterIcon
        color={selected ? selectedColor : neutralColor}
        size={28}
      />
    ),
    bandpass: "BP",
    allpass: "AP",
    lowpass: "LP",
    lowshelf: "LS",
    notch: "N",
  };

  return typeToLabelMap[band.type];
};

interface EqualizerViewProps {
  width: number;
  height: number;
  graphicEQ: GraphicEQ;
}

const MIN_HERTZ = 20;
const MAX_HERTZ = 20000;

export const GraphicEQView = observer(
  ({ width, height, graphicEQ }: EqualizerViewProps) => {
    const [activeBandId, setActiveBandId] = useState<string>(
      graphicEQ.highpass.id
    );

    const allBands = [
      graphicEQ.highpass,
      ...graphicEQ.bands,
      graphicEQ.highshelf,
    ];

    const curvePoints = getCurvePoints(
      [...allBands].sort((a, b) => a.hertz - b.hertz)
    );
    const prevCurvePoints = useRef(curvePoints);

    const correctedPoints = getCorrectedCurvePoints(
      prevCurvePoints.current,
      curvePoints
    );
    prevCurvePoints.current = correctedPoints;

    const activeBand = allBands.find((band) => band.id === activeBandId);
    const scaleY = d3
      .scaleLinear()
      .domain([-12, 12])
      .range([height - 20, 0]);

    const scaleX = d3
      .scaleLog()
      .domain([MIN_HERTZ, MAX_HERTZ])
      .range([20, width - 10]);

    const lineGenerator = d3
      .line<Point>()
      .x((band) => scaleX(band.hertz))
      .y((band) => scaleY(band.gain))
      .curve(d3.curveBumpX);

    // const combinedCurvePath = lineGenerator(curvePoints);

    const lines = curvePoints.map((array: any) => lineGenerator(array));

    const createBand = () => {
      setActiveBandId(graphicEQ.createBand());
    };

    const deleteBand = (key: string) => {
      if (key !== graphicEQ.highpass.id && key !== graphicEQ.highshelf.id) {
        graphicEQ.deleteBand(key);
        setActiveBandId(allBands[0]?.id);
      }
    };

    const bandTabs = allBands.map((band, i) => ({
      icon: getBandIcon(band, i, activeBandId),
      key: band.id,
      closable: band.type === "peaking",
    }));

    const handleChange = (id: string) => {
      setActiveBandId(id);
    };

    const onEdit = (
      targetKey: React.MouseEvent | React.KeyboardEvent | string,
      action: "add" | "remove"
    ) => {
      if (action === "add") {
        createBand();
      } else {
        if (typeof targetKey === "string") {
          deleteBand(targetKey);
        }
      }
    };

    const changeBandTab = (id: string) => {
      setActiveBandId(id);
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
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

            {/* {combinedCurvePath && (
              <path
                d={combinedCurvePath}
                fill="rgba(125, 0, 250, 0.5)"
                stroke="rgb(125, 0, 250)"
              />
            )} */}

            {lines.map((line: any) => (
              <path
                d={line}
                fill="rgba(125, 0, 250, 0.5)"
                stroke="rgb(125, 0, 250)"
              />
            ))}

            {allBands.map((band, i) => (
              <CenterFrequency
                range={[MIN_HERTZ, MAX_HERTZ]}
                changeBandTab={changeBandTab}
                className={styles.bandPoint}
                scaleX={scaleX}
                scaleY={scaleY}
                band={band}
                key={i}
              />
            ))}
          </svg>
        </div>

        <Tabs
          activeKey={activeBandId}
          onChange={handleChange}
          items={bandTabs}
          type="editable-card"
          size="small"
          onEdit={onEdit}
        />

        {activeBand && <BandTab key={activeBand.id} band={activeBand} />}
      </div>
    );
  }
);
