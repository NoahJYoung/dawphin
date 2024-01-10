import { AudioEngine } from "src/AudioEngine";
import { observer } from "mobx-react-lite";
import { useKeys } from "./hooks";
import styles from "./KeyboardView.module.scss";

interface KeyboardViewProps {
  audioEngine: AudioEngine;
}

export const KeyboardView = observer(({ audioEngine }: KeyboardViewProps) => {
  const keyElements = useKeys(audioEngine);
  return (
    <div className={`${styles.keyboard} styled-scrollbar`}>{keyElements}</div>
  );
});
