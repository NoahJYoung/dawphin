import { Slider } from "antd";
import { IoMdVolumeHigh } from "react-icons/io";

import styles from "./PadVolumeSlider.module.scss";

interface PadVolumeSliderProps {
  padNumber: number;
}

export const PadVolumeSlider = ({ padNumber }: PadVolumeSliderProps) => {
  return (
    <div className={styles.sliderWrapper}>
      <p className={styles.padNumber}>{padNumber}</p>
      <Slider
        trackStyle={{ background: "rgb(125, 0, 250)", width: 10 }}
        railStyle={{ width: 10 }}
        className={styles.slider}
        vertical
      />
      <IoMdVolumeHigh className={styles.icon} />
    </div>
  );
};
