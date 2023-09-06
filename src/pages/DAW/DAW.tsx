import { AudioEngine } from 'src/AudioEngine';
import { useState, useEffect, useRef } from 'react';
import { TimelineView, TrackPanels, Tracks, TransportView } from './components';
import { Knob } from './UIKit';

const audioEngine = new AudioEngine();

export const DAW = () => {
  const [timelineRect, setTimelineRect] = useState<DOMRect | null>(null);
  const [audioEngineInstance] = useState<AudioEngine>(audioEngine);
  const [knobValue, setKnobValue] = useState(0);

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
      <div
        style={{
          width: '100%',
          height: '40vh',
          background: '#222',
          padding: '5px',
        }}
      >
        <TransportView audioEngine={audioEngineInstance} />
        <Knob value={knobValue} onChange={setKnobValue} />
      </div>
    </div>
  )
}
