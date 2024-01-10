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
import { InstrumentsView } from "./components/InstrumentsView";
import { SlidersOutlined } from "@ant-design/icons";
import { PiPianoKeysFill, PiWaveformBold } from "react-icons/pi";

import styles from "./DAW.module.scss";

enum BottomPanelView {
  MIXER = "mixer",
  KEYBOARD = "keyboard",
  MIDI_EDITOR = "midiEditor",
  SAMPLE_PAD = "samplePad",
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
                    bottomPanelView === BottomPanelView.KEYBOARD
                      ? styles.active
                      : ""
                  }`}
                />
              }
            />

            <Button
              type="text"
              className={styles.viewButton}
              onClick={() => setBottomPanelView(BottomPanelView.SAMPLE_PAD)}
              icon={
                <PiWaveformBold
                  className={`${styles.btnIcon} ${
                    bottomPanelView === BottomPanelView.SAMPLE_PAD
                      ? styles.active
                      : ""
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
                case BottomPanelView.KEYBOARD:
                  return <InstrumentsView audioEngine={audioEngineInstance} />;

                // case BottomPanelView.SAMPLE_PAD:
                //   return <div>SAMPLE PAD</div>;

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
