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

import styles from "./DAW.module.scss";
import { PianoRoll } from "./components/MidiEditor";
import { InstrumentsView } from "./components/InstrumentsView";
import { SlidersOutlined } from "@ant-design/icons";
import { PiPianoKeysFill } from "react-icons/pi";

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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
              width: "100%",
              maxWidth: "150px",
            }}
          >
            <Button
              type="text"
              onClick={() => setBottomPanelView(BottomPanelView.MIXER)}
              style={{
                height: 36,
                width: 36,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              icon={
                <SlidersOutlined
                  style={{
                    fontSize: "2rem",
                    color:
                      bottomPanelView === "mixer" ? "rgb(125, 0, 250)" : "#555",
                  }}
                />
              }
            />
            <Button
              type="text"
              style={{
                height: 36,
                width: 36,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => setBottomPanelView(BottomPanelView.KEYBOARD)}
              icon={
                <PiPianoKeysFill
                  style={{
                    fontSize: "2rem",
                    color:
                      bottomPanelView === "keyboard"
                        ? "rgb(150, 0, 250)"
                        : "#aaa",
                  }}
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
                case BottomPanelView.MIXER:
                  return <Mixer audioEngine={audioEngineInstance} />;

                case BottomPanelView.MIDI_EDITOR:
                  return <PianoRoll notes={[]} />;

                case BottomPanelView.KEYBOARD:
                  return <InstrumentsView audioEngine={audioEngineInstance} />;

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
