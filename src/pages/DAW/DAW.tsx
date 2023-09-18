import { audioEngineInstance } from 'src/AudioEngine';
import { AudioEngine } from 'src/AudioEngine/AudioEngine';
import { useState, useEffect, useRef } from 'react';
import { Mixer, TimelineView, Tracks, Sidebar, TransportView } from './components';
import { MasterFader } from './components/MasterFader';

import styles from './DAW.module.scss';

export const DAW = () => {
  const [timelineRect, setTimelineRect] = useState<DOMRect | null>(null);
  const [audioEngine] = useState<AudioEngine>(audioEngineInstance);
  

  const containerRef = useRef<HTMLDivElement>(null);
  const trackPanelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('click', audioEngine.startTone);
    return document.removeEventListener('click', audioEngine.startTone);
  }, [audioEngine])

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
    </div>
  )
}
