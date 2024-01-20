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

  const handleTimeSignatureWheel = (e: any) => {
    if (e.deltaY < 0) {
      setTimeSignatureInput(Number(timeSignatureInput) + 1);
    } else if (e.deltaY > 0) {
      setTimeSignatureInput(Number(timeSignatureInput) - 1);
    }
  };

  const handleTotalMeasuresWheel = (e: any) => {
    if (e.deltaY < 0) {
      setTotalMeasuresInput(Number(totalMeasuresInput) + 1);
    } else if (e.deltaY > 0) {
      setTotalMeasuresInput(Number(totalMeasuresInput) - 1);
    }
  };

  const handleBpmWheel = (e: any) => {
    if (e.deltaY < 0) {
      setBpmInput(Number(bpmInput) + 1);
    } else if (e.deltaY > 0) {
      setBpmInput(Number(bpmInput) - 1);
    }
  };

  return (
    <div className={styles.projectDataDisplayContainer}>
      <div className={styles.item}>
        <input
          onWheel={handleBpmWheel}
          onChange={handleBpmChange}
          value={bpmInput}
        />
        <p>bpm</p>
      </div>
      <p className={styles.separator}>|</p>
      <div className={styles.item}>
        <input
          onWheel={handleTimeSignatureWheel}
          className={styles.small}
          onChange={handleTimeSignatureChange}
          value={timeSignatureInput}
        />
        <p style={{ fontSize: "28px", margin: 0, marginRight: 2 }}>/</p>
        <p style={{ fontSize: "28px", margin: 0 }}>4</p>
      </div>
      <p className={styles.separator}>|</p>
      <div className={styles.item}>
        <input
          onWheel={handleTotalMeasuresWheel}
          onChange={handleTotalMeasuresChange}
          value={totalMeasuresInput}
        />
        <p>bars</p>
      </div>
    </div>
  );
});
