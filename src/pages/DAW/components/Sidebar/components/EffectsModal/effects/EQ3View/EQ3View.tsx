import React from "react";
import { Knob } from "src/pages/DAW/UIKit";
import * as Tone from "tone";

import styles from "./EQ3View.module.scss";
import { observer } from "mobx-react-lite";

interface EQ3Props {
  EQ3: Tone.EQ3;
}

export const EQ3View = observer(({ EQ3 }: EQ3Props) => {
  return (
    <div className={styles.EQ3Container}>
      <span className={styles.gridItem}>
        <label>Band 1</label>
        <Knob min={0} size={48} value={EQ3.low.value} onChange={() => {}} />
      </span>

      <span className={styles.gridItem}>
        <label>Band 2</label>
        <Knob min={0} size={48} value={EQ3.mid.value} onChange={() => {}} />
      </span>

      <span className={styles.gridItem}>
        <label>Band 3</label>
        <Knob
          min={0}
          max={100}
          size={48}
          value={EQ3.high.value}
          onChange={() => {}}
        />
      </span>

      <span className={styles.gridItem}>
        <label>Low freq</label>
        <Knob
          min={20}
          max={20000}
          size={48}
          value={Number(EQ3.lowFrequency.value)}
          onChange={() => {}}
        />
      </span>

      <span className={styles.gridItem}>
        <label>Q</label>
        <Knob
          min={0}
          size={48}
          value={Number(EQ3.Q.value)}
          onChange={() => {}}
        />
      </span>

      <span className={styles.gridItem}>
        <label>High freq</label>
        <Knob
          min={20}
          max={20000}
          size={48}
          value={Number(EQ3.highFrequency.value)}
          onChange={() => {}}
        />
      </span>
    </div>
  );
});
