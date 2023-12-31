import { useState } from "react";
import { Knob } from "src/pages/DAW/UIKit";
import * as Tone from "tone";

import styles from "./EQ3View.module.scss";
import { observer } from "mobx-react-lite";
import { EQVisualizer } from "./components";

interface EQ3Props {
  EQ3: Tone.EQ3;
}

export const EQ3View = observer(({ EQ3 }: EQ3Props) => {
  const [lowValue, setLowValue] = useState(EQ3.low.value);
  const [midValue, setMidValue] = useState(EQ3.mid.value);
  const [highValue, setHighValue] = useState(EQ3.high.value);

  const [lowFrequency, setLowFrequency] = useState(EQ3.lowFrequency.value);
  const [highFrequency, setHighFrequency] = useState(EQ3.highFrequency.value);
  const [QValue, setQValue] = useState(EQ3.Q.value);

  return (
    <div className={styles.EQ3Container}>
      <h2>EQ3</h2>
      <EQVisualizer
        lowValue={lowValue}
        midValue={midValue}
        highValue={highValue}
        lowFrequency={Number(lowFrequency)}
        highFrequency={Number(highFrequency)}
        Q={QValue}
      />

      <div className={styles.knobsContainer}>
        <div className={styles.knobRow}>
          <span className={styles.gridItem}>
            <label>Low</label>
            <Knob
              color="red"
              double
              min={-10}
              max={10}
              size={48}
              suffix="Db"
              value={lowValue}
              onChange={(e) => {
                EQ3.low.value = e.valueOf();
                setLowValue(EQ3.low.value);
              }}
            />
          </span>

          <span className={styles.gridItem}>
            <label>Mid</label>
            <Knob
              double
              color="blue"
              min={-10}
              max={10}
              size={48}
              suffix="Db"
              value={midValue}
              onChange={(e) => {
                EQ3.mid.value = e.valueOf();
                setMidValue(EQ3.mid.value);
              }}
            />
          </span>

          <span className={styles.gridItem}>
            <label>High</label>
            <Knob
              double
              color="green"
              min={-10}
              max={10}
              size={48}
              suffix="Db"
              value={highValue}
              onChange={(e) => {
                EQ3.high.value = e.valueOf();
                setHighValue(EQ3.high.value);
              }}
            />
          </span>
        </div>
        <div className={styles.knobRow}>
          <span className={styles.gridItem}>
            <label>Low cutoff</label>
            <Knob
              min={20}
              max={1600}
              color="rgb(125, 0, 250)"
              size={48}
              suffix="Hz"
              value={Number(lowFrequency.valueOf())}
              onChange={(e) => {
                EQ3.lowFrequency.value = e.valueOf();
                setLowFrequency(EQ3.lowFrequency.value);
              }}
              round
            />
          </span>

          <span className={styles.gridItem}>
            <label>High cutoff</label>
            <Knob
              min={2400}
              max={20000}
              size={48}
              color="rgb(125, 0, 250)"
              suffix="Hz"
              value={Number(highFrequency.valueOf())}
              onChange={(e) => {
                EQ3.highFrequency.value = e.valueOf();
                setHighFrequency(EQ3.highFrequency.value);
              }}
              round
            />
          </span>
        </div>
      </div>
    </div>
  );
});
