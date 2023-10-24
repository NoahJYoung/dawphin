import { useState, useEffect, useCallback } from "react";
import { Key as KeyData } from "../../helpers";
import * as Tone from "tone";

import styles from "./Key.module.scss";

interface KeyProps {
  keyData: KeyData;
  octave: number;
  style?: Record<string, any>;
  fullNoteName: string;
  polySynth: Tone.PolySynth;
}

const pressedKeys = new Set<string>();

export const Key = ({ keyData, style, fullNoteName, polySynth }: KeyProps) => {
  const [active, setActive] = useState(false);

  const attack = useCallback(
    (e?: React.MouseEvent | React.TouchEvent) => {
      e && e.preventDefault();
      if (pressedKeys.has(fullNoteName)) return;
      pressedKeys.add(fullNoteName);
      setActive(true);
      polySynth.triggerAttack(fullNoteName, Tone.immediate() + 0.01);
    },
    [polySynth, fullNoteName]
  );

  const release = useCallback(
    (e?: React.MouseEvent | React.TouchEvent) => {
      e && e.preventDefault();
      if (!pressedKeys.has(fullNoteName)) return;
      pressedKeys.delete(fullNoteName);
      setActive(false);
      polySynth.triggerRelease(fullNoteName, Tone.immediate() + 0.01);
    },
    [polySynth, fullNoteName]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || active) return;
      if (e.key === keyData.key) {
        attack();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === keyData.key) {
        release();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keyData, fullNoteName]);

  return (
    <div
      onMouseDown={attack}
      onMouseUp={release}
      onTouchStart={attack}
      onTouchEnd={release}
      style={style}
      className={`${styles.key} ${styles[keyData.type]} ${
        active ? styles.active : ""
      }`}
    >
      <p>{keyData.key.toUpperCase()}</p>
    </div>
  );
};
