import { useState } from "react";
import { keys } from "./helpers";
import { Key } from "./components";
import { AudioEngine } from "src/AudioEngine";

import styles from "./KeyboardView.module.scss";

interface KeyboardViewProps {
  audioEngine: AudioEngine;
}

export const KeyboardView = ({ audioEngine }: KeyboardViewProps) => {
  const [baseOctave] = useState(2);
  return (
    <div className={`${styles.keyboard} styled-scrollbar`}>
      {keys.map((key, i, arr) => {
        let leftPosition = 0;
        const fullNoteName = `${key.note}${baseOctave + key.relativeOctave}`;

        if (key.type === "black") {
          leftPosition =
            arr.slice(0, i).filter((k) => k.type === "white").length * 80 - 5;
        } else {
          leftPosition =
            arr.slice(0, i).filter((k) => k.type === "white").length * 80;
        }

        return (
          <Key
            style={{ left: leftPosition }}
            octave={baseOctave}
            keyData={key}
            key={key.note + i}
            fullNoteName={fullNoteName}
            polySynth={audioEngine.keyboard.synth}
          />
        );
      })}
    </div>
  );
};
