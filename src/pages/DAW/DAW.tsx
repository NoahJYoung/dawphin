import { audioEngineInstance } from "src/AudioEngine";
import { AudioEngine } from "src/AudioEngine/AudioEngine";
import { useState, useRef } from "react";
import {
  Mixer,
  TimelineView,
  Tracks,
  Sidebar,
  TransportView,
} from "./components";
import { Button } from "antd";

import { PianoRoll } from "./components/MidiEditor";
import { InstrumentsView } from "./components/InstrumentsView";
import { SlidersOutlined } from "@ant-design/icons";
import { PiPianoKeysFill } from "react-icons/pi";

import styles from "./DAW.module.scss";

enum BottomPanelView {
  MIXER = "mixer",
  KEYBOARD = "keyboard",
  MIDI_EDITOR = "midiEditor",
}

export const DAW = () => {
  const [timelineRect, setTimelineRect] = useState<DOMRect | null>(null);
  const [audioEngine] = useState<AudioEngine>(audioEngineInstance);
  const [bottomPanelView, setBottomPanelView] = useState<BottomPanelView>(
    BottomPanelView.MIXER
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const trackPanelsRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`${styles.wrapper} styled-scrollbar`}>
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
        <div className={styles.bottomPanelMiddle}>
          <TransportView
            containerRef={containerRef}
            audioEngine={audioEngineInstance}
          />

          <div className={styles.viewButtonContainer}>
            <Button
              type="text"
              onClick={() => setBottomPanelView(BottomPanelView.MIXER)}
              className={styles.viewButton}
              icon={
                <SlidersOutlined
                  className={`${styles.btnIcon} ${
                    bottomPanelView === "mixer" ? styles.active : ""
                  }`}
                />
              }
            />
            <Button
              type="text"
              className={styles.viewButton}
              onClick={() => setBottomPanelView(BottomPanelView.KEYBOARD)}
              icon={
                <PiPianoKeysFill
                  className={`${styles.btnIcon} ${
                    bottomPanelView === "keyboard" ? styles.active : ""
                  }`}
                />
              }
            />
          </div>
        </div>

        <div className={`${styles.bottomPanelInner} styled-scrollbar`}>
          {/* TODO: Create a component switch component, so as to not leave this IIF in the middle of here */}
          <>
            {(() => {
              switch (bottomPanelView) {
                case BottomPanelView.MIDI_EDITOR:
                  return <PianoRoll notes={[]} />;

                case BottomPanelView.KEYBOARD:
                  return <InstrumentsView audioEngine={audioEngineInstance} />;

                case BottomPanelView.MIXER:
                default:
                  return <Mixer audioEngine={audioEngineInstance} />;
              }
            })()}
          </>
        </div>
      </div>
    </div>
  );
};
