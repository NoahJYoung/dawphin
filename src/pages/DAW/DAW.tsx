import { audioEngineInstance } from "src/AudioEngine";
import { AudioEngine } from "src/AudioEngine/AudioEngine";
import { useState, useEffect, useRef } from "react";
import {
  Mixer,
  TimelineView,
  Tracks,
  Sidebar,
  TransportView,
} from "./components";
import { MasterFader } from "./components/MasterFader";

import styles from "./DAW.module.scss";
import { Button, Modal } from "antd";

export const DAW = () => {
  const [timelineRect, setTimelineRect] = useState<DOMRect | null>(null);
  const [audioEngine] = useState<AudioEngine>(audioEngineInstance);
  const [startToneModalOpen, setStartToneModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackPanelsRef = useRef<HTMLDivElement>(null);

  const handleOk = () => {
    audioEngine.startTone();
    setStartToneModalOpen(false);
  };

  useEffect(() => {
    setStartToneModalOpen(true);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.topPanel}>
        <Sidebar
          containerRef={containerRef}
          timelineRect={timelineRect}
          trackPanelsRef={trackPanelsRef}
          audioEngine={audioEngine}
        />
        <TimelineView
          setTimelineRect={setTimelineRect}
          containerRef={containerRef}
          audioEngine={audioEngine}
          trackPanelsRef={trackPanelsRef}
        >
          <Tracks
            containerRef={containerRef}
            timelineRect={timelineRect}
            audioEngine={audioEngine}
          />
        </TimelineView>
      </div>
      <div className={styles.bottomPanelOuter}>
        <TransportView audioEngine={audioEngineInstance} />
        <div className={styles.bottomPanelInner}>
          <MasterFader masterControl={audioEngine.masterControl} />
          <Mixer audioEngine={audioEngineInstance} />
        </div>
      </div>
      <Modal
        title="Start audio context"
        open={startToneModalOpen}
        onOk={handleOk}
      >
        Click 'OK' to start the audio context
      </Modal>
    </div>
  );
};
