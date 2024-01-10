import { observer } from "mobx-react-lite";
import { InputNumber } from "antd";

import styles from "./ProjectDataDisplay.module.scss";
import { useAudioEngine } from "src/pages/DAW/hooks";

export const ProjectDataDisplay = observer(() => {
  const audioEngine = useAudioEngine();

  return (
    <div
      className={styles.projectDataDisplayContainer}
      style={{
        fontFamily: "Inter",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        fontSize: "20px",
        gap: "1rem",
        height: "100%",
        borderRadius: "5px",
        width: "12rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.25rem",
          width: "100%",
          flexWrap: "nowrap",
        }}
      >
        <InputNumber
          value={audioEngine.bpm}
          type="number"
          className={styles.bpmInput}
          style={{
            width: "3.5rem",
            maxHeight: "100%",
            fontFamily: "inherit",
            fontSize: "inherit",
            border: "none",
            outline: "none",
            background: "transparent",
          }}
          controls={false}
          onChange={(e) => {
            const value = e?.valueOf();
            if (value && value > 40) {
              audioEngine.setBpm(value);
            }
          }}
        />
        <p>bpm</p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <InputNumber
          value={audioEngine.timeSignature as number}
          className={styles.timeSignatureInput}
          style={{
            width: "2rem",
            height: "28px",
            fontFamily: "Inter",
            fontSize: "28px",
            display: "flex",
            border: "none",
            outline: "none",
          }}
          min={2}
          max={12}
          controls={false}
          type="number"
          size="small"
          onChange={(e) => {
            const input = e?.valueOf();
            if (input && input > 0) {
              audioEngine.setTimeSignature(input);
            }
          }}
        />
        <p style={{ fontSize: "28px", margin: 0 }}>/</p>
        <p style={{ fontSize: "28px", margin: 0 }}>4</p>
      </div>
    </div>
  );
});
