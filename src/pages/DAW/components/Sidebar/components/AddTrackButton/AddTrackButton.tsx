import { Button } from "antd";
import { useAudioEngine } from "src/pages/DAW/hooks";
import { FiPlus } from "react-icons/fi";
import { TRACK_PANEL_FULL_WIDTH, CLIP_HEIGHT } from "src/pages/DAW/constants";

import styles from "./AddTrackButton.module.scss";

interface AddTrackButtonProps {
  expanded: boolean;
}

export const AddTrackButton = ({ expanded }: AddTrackButtonProps) => {
  const audioEngine = useAudioEngine();
  return (
    <Button
      onClick={audioEngine.createTrack}
      className={`${styles.addTrackButton} ${expanded ? styles.expanded : ""}`}
      icon={<FiPlus className={styles.icon} />}
      type="text"
      style={{
        width: TRACK_PANEL_FULL_WIDTH,
        height: CLIP_HEIGHT,
      }}
    />
  );
};
