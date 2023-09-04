import { AudioEngine } from 'src/AudioEngine';
import { useState, useEffect, useRef } from 'react';
import { TimelineView, TrackPanels, Tracks, TransportControls } from './components';

const audioEngine = new AudioEngine();

export const DAW = () => {
  const [timelineRect, setTimelineRect] = useState<DOMRect | null>(null);
  const [audioEngineInstance, setAudioEngineInstance] = useState<AudioEngine>(audioEngine);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackPanelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('click', audioEngineInstance.startTone);
    return document.removeEventListener('click', audioEngineInstance.startTone);
  }, [])

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
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
          audioEngine={audioEngineInstance}
          trackPanelsRef={trackPanelsRef}
        >
          <Tracks
            containerRef={containerRef}
            timelineRect={timelineRect}
            audioEngine={audioEngineInstance}
          />
        </TimelineView>
      </div>
      <TransportControls audioEngine={audioEngineInstance} />
    </div>
  )
}
