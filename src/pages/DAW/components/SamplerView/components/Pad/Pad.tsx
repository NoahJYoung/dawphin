import { ChangeEvent, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button } from "antd";
import { PiFolder, PiTrash } from "react-icons/pi";
import { useAudioEngine } from "src/pages/DAW/hooks";

import styles from "./Pad.module.scss";

interface PadProps {
  padNumber: number;
}

export const Pad = observer(({ padNumber }: PadProps) => {
  const [active, setActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sampler } = useAudioEngine();

  const attack = () => {
    setActive(true);
    sampler.attack(padNumber);
  };

  const release = () => {
    setActive(false);
    sampler.release(padNumber);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      sampler.loadAudio(padNumber, selectedFile);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const isAudioLoaded = !!sampler.pads[padNumber]?.loaded;

  useEffect(() => {
    const stringPadNumber = String(padNumber);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || active || !isAudioLoaded) return;
      if (e.key === stringPadNumber) {
        attack();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === stringPadNumber) {
        release();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [padNumber]);

  return (
    <span key={padNumber} className={styles.padWrapper}>
      <button
        disabled={!isAudioLoaded}
        onMouseDown={attack}
        onMouseUp={release}
        onMouseLeave={release}
        className={`${styles.pad} ${active ? styles.active : ""}`}
      >
        {padNumber}
      </button>
      <div className={styles.buttons}>
        <Button
          onClick={handleClick}
          type="text"
          icon={<PiFolder className={styles.icon} />}
        />
        <Button
          disabled={!isAudioLoaded}
          type="text"
          icon={<PiTrash className={styles.icon} />}
        />
      </div>

      <input
        value={""}
        type="file"
        id={`fileInput${padNumber}`}
        style={{ display: "none" }}
        accept="audio/*"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
    </span>
  );
});
