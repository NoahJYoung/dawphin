import { AudioEngine } from 'src/AudioEngine';
import { observer } from 'mobx-react-lite';
import { Track } from 'src/AudioEngine/Track';
import { useState, useEffect, useRef } from 'react';
import { Clip } from 'src/AudioEngine/Track/Clip';
import { Timeline, TrackPanels, Tracks } from './components';
import WaveSurfer from 'wavesurfer.js';

const audioEngine = new AudioEngine();

export const DAW = () => {
  const [timelineRect, setTimelineRect] = useState<DOMRect | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const [audioEngineInstance, setAudioEngineInstance] = useState(audioEngine);
  const trackPanelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('click', () => audioEngine.startTone());
    return document.removeEventListener('click', () => audioEngine.startTone());
  }, [])

  return (
    <>
      <div style={{display: 'flex'}}>
        <TrackPanels trackPanelsRef={trackPanelsRef} audioEngine={audioEngineInstance} />
        <Timeline
          timelineRect={timelineRect}
          setTimelineRect={setTimelineRect}
          setContainer={setContainer}
          audioEngine={audioEngine}
          trackPanelsRef={trackPanelsRef}
        >
          <Tracks container={container} timelineRect={timelineRect} audioEngine={audioEngineInstance} />
        </Timeline>
      </div>
    </>
  )
}
