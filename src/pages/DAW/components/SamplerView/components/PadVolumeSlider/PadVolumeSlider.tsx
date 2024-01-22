import { Slider } from "antd";
import { IoMdVolumeHigh } from "react-icons/io";
import { useAudioEngine } from "src/pages/DAW/hooks";
import { observer } from "mobx-react-lite";

import styles from "./PadVolumeSlider.module.scss";

interface PadVolumeSliderProps {
  padNumber: number;
}

export const PadVolumeSlider = observer(
  ({ padNumber }: PadVolumeSliderProps) => {
    const audioEngine = useAudioEngine();
    return (
      <div className={styles.sliderWrapper}>
        <p className={styles.padNumber}>{padNumber}</p>
        <Slider
          value={audioEngine.sampler.padStates[padNumber].volume}
          max={0}
          min={-100}
          onChange={(e) => {
            audioEngine.sampler.setPadVolume(padNumber, e);
          }}
          trackStyle={{ background: "rgb(125, 0, 250)", width: 10 }}
          railStyle={{ width: 10 }}
          className={styles.slider}
          vertical
        />
        <IoMdVolumeHigh className={styles.icon} />
      </div>
    );
  }
);
