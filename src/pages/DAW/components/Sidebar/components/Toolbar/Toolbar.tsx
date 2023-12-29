import { PlusOutlined, LeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { observer } from "mobx-react-lite";
import { AudioEngine } from "src/AudioEngine";
import { TOPBAR_HEIGHT } from "src/pages/DAW/constants";
import { PiMetronomeBold } from "react-icons/pi";
import { BiSolidMagnet } from "react-icons/bi";
import { FiDownload } from "react-icons/fi";
import { FaSave } from "react-icons/fa";
import { IoMdExit } from "react-icons/io";

import styles from "./Toolbar.module.scss";

interface ToolbarProps {
  audioEngine: AudioEngine;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  toggleExpanded: () => void;
  expanded: boolean;
}

export const Toolbar = observer(
  ({ audioEngine, expanded, toggleExpanded }: ToolbarProps) => {
    return (
      <div
        style={{
          height: TOPBAR_HEIGHT,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px 0 4px 0",
        }}
      >
        <Button
          className={`${styles.toolbarButton} ${expanded ? "" : styles.hidden}`}
          type="text"
          onClick={audioEngine.toggleMetronome}
          icon={
            <PiMetronomeBold
              className={`${styles.buttonIcon} ${
                audioEngine.metronomeActive ? styles.active : ""
              }`}
            />
          }
        />
        <Button
          className={`${styles.toolbarButton} ${
            expanded ? "" : styles.hidden
          } ${audioEngine.timeline.snap ? styles.active : ""}`}
          type="text"
          icon={
            <BiSolidMagnet
              className={`${styles.buttonIcon} ${
                audioEngine.timeline.snap ? styles.active : ""
              }`}
            />
          }
          onClick={() =>
            audioEngine.timeline.setSnap(!audioEngine.timeline.snap)
          }
        />

        <Button
          className={`${styles.toolbarButton} ${expanded ? "" : styles.hidden}`}
          type="text"
          onClick={() => {}}
          icon={<FiDownload className={styles.buttonIcon} />}
        />

        <Button
          className={`${styles.toolbarButton} ${expanded ? "" : styles.hidden}`}
          type="text"
          onClick={() => {}}
          icon={<FaSave className={styles.buttonIcon} />}
          disabled
        />

        <Button
          className={`${styles.toolbarButton} ${expanded ? "" : styles.hidden}`}
          type="text"
          onClick={() => {}}
          icon={<IoMdExit className={styles.buttonIcon} />}
        />

        <Button
          className={`${styles.lgHidden} ${styles.leftArrow} ${
            !expanded ? styles.rotate : ""
          }`}
          type="text"
          icon={<LeftOutlined className={styles.buttonIcon} />}
          onClick={toggleExpanded}
        />
      </div>
    );
  }
);
