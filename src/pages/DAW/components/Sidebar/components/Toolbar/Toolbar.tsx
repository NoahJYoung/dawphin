import {
  PlusOutlined,
  TableOutlined,
  ZoomOutOutlined,
  ZoomInOutlined,
  CaretLeftOutlined,
  DoubleLeftOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { observer } from "mobx-react-lite";
import { AudioEngine } from "src/AudioEngine";
import { TOPBAR_HEIGHT } from "src/pages/DAW/constants";
import { MetronomeIcon } from "src/pages/DAW/icons";
import * as Tone from "tone";

import styles from "./Toolbar.module.scss";

interface ToolbarProps {
  audioEngine: AudioEngine;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  toggleExpanded: () => void;
  expanded: boolean;
}

export const Toolbar = observer(
  ({ audioEngine, containerRef, expanded, toggleExpanded }: ToolbarProps) => {
    return (
      <div
        style={{
          height: TOPBAR_HEIGHT,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          className={`${styles.toolbarButton} ${expanded ? "" : styles.hidden}`}
          type="text"
          icon={<PlusOutlined className={styles.buttonIcon} />}
          onClick={audioEngine.createTrack}
        />
        <Button
          className={`${styles.toolbarButton} ${expanded ? "" : styles.hidden}`}
          type="text"
          onClick={audioEngine.toggleMetronome}
          icon={
            <MetronomeIcon
              color={audioEngine.metronomeActive ? "blue" : "#aaa"}
              width="1.25rem"
              height="1.25rem"
            />
          }
        />
        <Button
          className={`${styles.toolbarButton} ${
            expanded ? "" : styles.hidden
          } ${audioEngine.snap ? styles.active : ""}`}
          type="text"
          icon={<TableOutlined className={styles.buttonIcon} />}
          onClick={() => audioEngine.setSnap(!audioEngine.snap)}
        />
        <Button
          className={`${styles.toolbarButton} ${expanded ? "" : styles.hidden}`}
          type="text"
          icon={<ZoomOutOutlined className={styles.buttonIcon} />}
          onClick={() => {
            audioEngine.setZoom("zoomOut");
            if (containerRef.current?.scrollLeft) {
              if (
                containerRef.current?.scrollLeft ||
                containerRef.current?.scrollLeft === 0
              ) {
                const transportPos =
                  (Tone.getTransport().seconds * Tone.getContext().sampleRate) /
                  audioEngine.samplesPerPixel;
                const offset = containerRef.current.clientWidth / 2;
                containerRef.current.scrollLeft = transportPos - offset;
              }
            }
          }}
        />
        <Button
          className={`${styles.toolbarButton} ${expanded ? "" : styles.hidden}`}
          type="text"
          icon={<ZoomInOutlined className={styles.buttonIcon} />}
          onClick={() => {
            audioEngine.setZoom("zoomIn");
            if (
              containerRef.current?.scrollLeft ||
              containerRef.current?.scrollLeft === 0
            ) {
              const transportPos =
                (Tone.getTransport().seconds * Tone.getContext().sampleRate) /
                audioEngine.samplesPerPixel;
              const offset = containerRef.current.clientWidth / 2;
              containerRef.current.scrollLeft = transportPos - offset;
            }
          }}
        />
        <Button
          className={`${styles.lgHidden} ${styles.toolbarButton} ${
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
