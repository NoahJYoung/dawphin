import { useState, useEffect } from "react";
import { Key as KeyData } from "../../helpers";
import styles from "./Key.module.scss";

interface KeyProps {
  keyData: KeyData;
  octave: number;
  style?: Record<string, any>;
}

export const Key = ({ keyData, octave, style }: KeyProps) => {
  const fullNoteName = `${keyData.note}${octave + keyData.relativeOctave}`;
  const [active, setActive] = useState(false);

  const attack = () => {
    setActive(true);
  };

  const release = () => {
    setActive(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.repeat) {
        if (e.key === keyData.key) {
          attack();
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.repeat) {
        if (e.key === keyData.key) {
          release();
        }
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
      style={style}
      className={`${styles.key} ${styles[keyData.type]} ${
        active ? styles.active : ""
      }`}
    >
      <p>{keyData.key.toUpperCase()}</p>
    </div>
  );
};
