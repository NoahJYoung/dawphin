import { audioEngineInstance } from 'src/AudioEngine';
import { AudioEngine } from 'src/AudioEngine/AudioEngine';
import { useState, useEffect, useRef } from 'react';
import { Mixer, TimelineView, TrackPanels, Tracks, TransportView } from './components';
import { TRACK_PANEL_FULL_WIDTH } from './constants';
import { MasterFader } from './components/MasterFader';

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
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <div style={{display: 'flex'}}>
        <TrackPanels
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
              height: '100%',
            }}
          >
            <MasterFader masterControl={audioEngine.masterControl} />
          </div>
          <div style={{
            width: '85vw',
            height: '90%',
          }}>
            <Mixer audioEngine={audioEngineInstance} />
          </div>
          
        </div>
      </div>
    </div>
  )
}
