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
import { Radio } from "antd";

import { MasterFader } from "./components/MasterFader";

import styles from "./DAW.module.scss";
import { PianoRoll } from "./components/MidiEditor";

enum BottomPanelView {
  MIXER = "mixer",
  KEYBOARD = "keyboard",
  MIDI_EDITOR = "midiEditor",
}

const viewOptions = [
  {
    label: "Mixer",
    value: "mixer",
  },
  {
    label: "Keyboard",
    value: "keyboard",
  },
  {
    label: "MIDI Editor",
    value: "midiEditor",
  },
];

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

          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            style={{ width: "fit-content" }}
            value={bottomPanelView}
            options={viewOptions}
            onChange={(e) => setBottomPanelView(e.target.value)}
          />
        </div>

        <div className={styles.bottomPanelInner}>
          <MasterFader
            audioEngine={audioEngine}
            masterControl={audioEngine.masterControl}
          />
          {/* TODO: Create a component switch component, so as to not leave this IIF in the middle of here */}
          <>
            {(() => {
              switch (bottomPanelView) {
                case BottomPanelView.MIXER:
                  return <Mixer audioEngine={audioEngineInstance} />;

                case BottomPanelView.MIDI_EDITOR:
                  return <PianoRoll notes={[]} />;

                case BottomPanelView.KEYBOARD:
                  return <h1>KEYBOARD</h1>;

                default:
                  return null;
              }
            })()}
          </>
        </div>
      </div>
    </div>
  );
};
