import { observer } from "mobx-react-lite";
import { AudioEngine } from "src/AudioEngine";
import { ProjectDataDisplay, TransportControls } from "./components";

import styles from "./TransportView.module.scss";

interface TransportViewProps {
  audioEngine: AudioEngine;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const TransportView = observer(
  ({ audioEngine, containerRef }: TransportViewProps) => {
    return (
      <div
        style={{
          display: "flex",
          height: "50px",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "5px",
        }}
      >
        <TransportControls
          containerRef={containerRef}
          audioEngine={audioEngine}
        />
        <div className={styles.hideOnSmallScreens}>
          <ProjectDataDisplay audioEngine={audioEngine} />
        </div>
      </div>
    );
  }
);
