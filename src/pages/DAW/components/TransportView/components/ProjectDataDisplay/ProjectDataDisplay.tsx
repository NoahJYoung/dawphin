import { ChangeEvent } from "react";

import { observer } from "mobx-react-lite";
import { useDebouncedProjectSettings } from "./hooks";

import styles from "./ProjectDataDisplay.module.scss";

export const ProjectDataDisplay = observer(() => {
  const {
    totalMeasuresInput,
    setTotalMeasuresInput,
    timeSignatureInput,
    setTimeSignatureInput,
    bpmInput,
    setBpmInput,
  } = useDebouncedProjectSettings();

  const handleTotalMeasuresChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== "") {
      setTotalMeasuresInput(event.target.value);
    } else {
      setTotalMeasuresInput("");
    }
  };

  const handleTimeSignatureChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTimeSignatureInput(event.target.value);
  };

  const handleBpmChange = (event: ChangeEvent<HTMLInputElement>) => {
    setBpmInput(event.target.value);
  };

  return (
    <div className={styles.projectDataDisplayContainer}>
      <div className={styles.item}>
        <input onChange={handleBpmChange} value={bpmInput} />
        <p>bpm</p>
      </div>

      <div className={styles.item}>
        <input
          className={styles.small}
          onChange={handleTimeSignatureChange}
          value={timeSignatureInput}
        />
        <p style={{ fontSize: "28px", margin: 0, marginRight: 2 }}>/</p>
        <p style={{ fontSize: "28px", margin: 0 }}>4</p>
      </div>
      <div className={styles.item}>
        <input
          onChange={handleTotalMeasuresChange}
          value={totalMeasuresInput}
        />
        <p>measures</p>
      </div>
    </div>
  );
});
