import React, { useState, useEffect, useCallback, memo } from "react";
import { Key as KeyData } from "../../helpers";
import * as Tone from "tone";

import styles from "./Key.module.scss";
import { Keyboard } from "src/AudioEngine/Keyboard";

interface KeyProps {
  keyData: KeyData;
  octave: number;
  style?: Record<string, any>;
  fullNoteName: string;
  keyboard: Keyboard;
}

const pressedKeys = new Set<string>();

export const Key = memo(
  ({ keyData, style, fullNoteName, keyboard }: KeyProps) => {
    const [active, setActive] = useState(false);

    const attack = useCallback(() => {
      if (pressedKeys.has(fullNoteName)) return;
      pressedKeys.add(fullNoteName);
      setActive(true);
      keyboard.triggerAttack(fullNoteName, Tone.immediate());
    }, [keyboard, fullNoteName, keyboard.mode]);

    const release = useCallback(() => {
      if (!pressedKeys.has(fullNoteName)) return;
      pressedKeys.delete(fullNoteName);
      setActive(false);
      keyboard.triggerRelease(fullNoteName, Tone.immediate() + 0.01);
    }, [keyboard, fullNoteName, keyboard.mode]);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.repeat || e.key !== keyData.key) return;
        attack();
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.repeat || e.key !== keyData.key) return;
        release();
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }, [attack, release, keyData.key]);

    return (
      <div
        className={`${styles.key} ${styles[keyData.type]} ${
          active ? styles.active : ""
        }`}
        style={style}
        onMouseDown={attack}
        onMouseUp={release}
        onMouseLeave={release}
        onTouchStart={attack}
        onTouchEnd={release}
      >
        <p>{keyData.key.toUpperCase()}</p>
      </div>
    );
  }
);
