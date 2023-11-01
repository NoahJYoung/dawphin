import { Button } from "antd";
import { AudioEngine } from "src/AudioEngine";
import { FiPlus } from "react-icons/fi";
import { TRACK_PANEL_FULL_WIDTH, CLIP_HEIGHT } from "src/pages/DAW/constants";

import styles from "./AddTrackButton.module.scss";

interface AddTrackButtonProps {
  audioEngine: AudioEngine;
}

export const AddTrackButton = ({ audioEngine }: AddTrackButtonProps) => {
  return (
    <Button
      onClick={audioEngine.createTrack}
      className={styles.addTrackButton}
      icon={<FiPlus className={styles.icon} />}
      type="text"
      style={{
        width: TRACK_PANEL_FULL_WIDTH,
        height: CLIP_HEIGHT,
      }}
    />
  );
};
