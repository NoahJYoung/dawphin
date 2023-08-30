import { AudioEngine } from 'src/AudioEngine';
import { useState, useEffect, useRef } from 'react';
import { TimelineView, TrackPanels, Tracks } from './components';

const audioEngine = new AudioEngine();

export const DAW = () => {
  const [timelineRect, setTimelineRect] = useState<DOMRect | null>(null);
  const [audioEngineInstance] = useState(audioEngine);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackPanelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('click', audioEngine.startTone);
    return document.removeEventListener('click', audioEngine.startTone);
  }, [])

  return (
    <>
      <div style={{display: 'flex'}}>
        <TrackPanels
          containerRef={containerRef}
          timelineRect={timelineRect}
          trackPanelsRef={trackPanelsRef}
          audioEngine={audioEngineInstance}
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
            audioEngine={audioEngineInstance}
          />
        </TimelineView>
      </div>
    </>
  )
}
