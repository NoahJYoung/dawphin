import { AudioEngine } from 'src/AudioEngine';
import { useState, useEffect, useRef } from 'react';
import { Mixer, TimelineView, TrackPanels, Tracks, TransportView } from './components';
import { TRACK_PANEL_FULL_WIDTH } from './constants';

const audioEngine = new AudioEngine();

export const DAW = () => {
  const [timelineRect, setTimelineRect] = useState<DOMRect | null>(null);
  const [audioEngineInstance] = useState<AudioEngine>(audioEngine);

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
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '40vh',
          background: '#222',
          padding: '5px',
        }}
      >
        <div>
          <TransportView audioEngine={audioEngineInstance} />
        </div>
        <div
          style={{
            display: 'flex',
            height: '100%',
            color: '#aaa',
            fontFamily: 'arial'
          }}
        >
          <div
            style={{
              width: TRACK_PANEL_FULL_WIDTH,
            }}
          >
            MASTER FADER
          </div>
          <div style={{
            width: '90vw'
          }}>
            <Mixer audioEngine={audioEngineInstance} />
          </div>
          
        </div>
      </div>
    </div>
  )
}
