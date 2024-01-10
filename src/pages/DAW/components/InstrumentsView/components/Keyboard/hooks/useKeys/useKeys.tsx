import React, { useMemo } from "react";
import { keys } from "../../helpers";
import { Key } from "../../components";
import { useAudioEngine } from "src/pages/DAW/hooks";

export const useKeys = () => {
  const audioEngine = useAudioEngine();
  const { baseOctave } = audioEngine.keyboard;
  const keyElements = useMemo(() => {
    return keys.map((key, i, arr) => {
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
          polySynth={audioEngine.keyboard}
        />
      );
    });
  }, [baseOctave, keys]);

  return keyElements;
};
