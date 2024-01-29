import { useState, useRef } from "react";
import {
  Mixer,
  TimelineView,
  Tracks,
  Sidebar,
  TransportView,
  SamplerView,
} from "./components";
import { Button } from "antd";
import { InstrumentsView } from "./components/InstrumentsView";
import { RiSoundModuleLine } from "react-icons/ri";
import { PiPianoKeysFill, PiWaveformBold } from "react-icons/pi";
import { AudioEngineProvider, LinkedScrollProvider } from "./hooks";

import styles from "./DAW.module.scss";

enum BottomPanelView {
  MIXER = "mixer",
  KEYBOARD = "keyboard",
  MIDI_EDITOR = "midiEditor",
  SAMPLE_PAD = "samplePad",
}

export const DAW = () => {
  const [timelineRect, setTimelineRect] = useState<DOMRect | null>(null);
  const [bottomPanelView, setBottomPanelView] = useState<BottomPanelView>(
    BottomPanelView.MIXER
  );

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <AudioEngineProvider>
      <LinkedScrollProvider>
        <div className={`${styles.wrapper} styled-scrollbar`}>
          <div className={styles.topPanel}>
            <Sidebar containerRef={containerRef} timelineRect={timelineRect} />
            <TimelineView
              setTimelineRect={setTimelineRect}
              containerRef={containerRef}
            >
              <Tracks containerRef={containerRef} timelineRect={timelineRect} />
            </TimelineView>
          </div>

          <div className={styles.bottomPanelOuter}>
            <div className={styles.bottomPanelMiddle}>
              <TransportView containerRef={containerRef} />

              <div className={styles.viewButtonContainer}>
                <Button
                  type="text"
                  onClick={() => setBottomPanelView(BottomPanelView.MIXER)}
                  className={styles.viewButton}
                  icon={
                    <RiSoundModuleLine
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
              <>
                {(() => {
                  switch (bottomPanelView) {
                    case BottomPanelView.KEYBOARD:
                      return <InstrumentsView />;

                    case BottomPanelView.SAMPLE_PAD:
                      return <SamplerView />;

                    case BottomPanelView.MIXER:
                    default:
                      return <Mixer />;
                  }
                })()}
              </>
            </div>
          </div>
        </div>
      </LinkedScrollProvider>
    </AudioEngineProvider>
  );
};
