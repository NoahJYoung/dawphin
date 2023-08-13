import { AudioEngine } from 'src/AudioEngine';
import { observer } from 'mobx-react-lite';
import { Track } from 'src/AudioEngine/Track';
import { useState, useEffect, useRef, useMemo } from 'react';
import kick from './kick-test-3.wav';
import { Clip } from 'src/AudioEngine/Track/Clip';
import Peaks from 'peaks.js';
import * as Tone from 'tone';
import { Timeline } from './Timeline';
import { BaseContext } from 'tone';
import { sampleToTick, tickToSample } from './helpers/conversions';

const audioEngine = new AudioEngine();

interface TestClipProps {
  clip: Clip,
  audioEngine: AudioEngine
  timelineRect: DOMRect | null
}

const TestClip = observer(({ clip, audioEngine, timelineRect }: TestClipProps) => {
  const [peaks, setPeaks] = useState<any>(null);
  const [selected, setSelected] = useState(clip.isSelected);
  const overviewRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const options = {
      zoomview: {
        container: overviewRef.current || undefined
      },
      webAudio: {
        audioContext: new AudioContext(),
        multiChannel: false
      },
      scrollBar: {
        minWidth: 0
      },
      mediaElement: audioRef.current || undefined,
      playheadColor: 'transparent',
      showAxisLabels: false,
      axisGridlineColor: 'transparent',
      fontSize: 0,
      waveformColor: 'rgba(255, 0, 0, 0.5)'
    }
    
    Peaks.init(options, function(err, peaks) {
      if (err) {
        console.error(`Failed to initialize Peaks instance: ${err.message}`);
        return;
      }
      setPeaks(peaks);
      const view = peaks?.views.getView('zoomview');
      view?.setAmplitudeScale(3.0)
      view?.setZoom({ scale: audioEngine.samplesPerPixel })
    });
    
  }, [])

  useEffect(() => {
    const view = peaks?.views.getView('zoomview');
    view?.setZoom({ scale: audioEngine.samplesPerPixel });
  }, [audioEngine.samplesPerPixel])

  const handleToggleSelect = () => {
    clip.isSelected = !clip.isSelected;
    setSelected(clip.isSelected);
  }
  return (
    <>
      <div
        draggable
        onDragStart={(e) => {
          const transparentImage = new Image();
          transparentImage.src = '';
          e.dataTransfer.setDragImage(transparentImage, 0, 0);
        }}
        onDrag={(e) => {
          if (overviewRef.current && timelineRect) {
            const x = (e.clientX - timelineRect.left) * 2;
            
            if (x >= 0) {
              clip.setPosition(sampleToTick(x * audioEngine.samplesPerPixel, audioEngine.samplesPerTick))
            } else {
              clip.setPosition(0);
            }
          }
        }}
        onDragOver={e => e.preventDefault()}
        onDragEnter={e => e.preventDefault()}
        
        style={{
          marginLeft: (tickToSample(clip.startTicks, audioEngine.samplesPerTick) / 2) / audioEngine.samplesPerPixel,
          background: selected ? 'rgba(255, 0, 0, 0.4)' : 'rgba(255, 0, 0, 0.2)',
          opacity: selected ? 1 : 0.75,
          width: clip.samples / audioEngine.samplesPerPixel || 1,
          height: '120px',
          borderRadius: '4px',
          color: 'blue',
          border: '1px solid red',
        }}
        ref={overviewRef}
        onClick={handleToggleSelect}
      />
      <audio src={clip.audioSrc} ref={audioRef} />
    </>
  )
}) 

const TestTrack = observer(({ track, timelineRect }: { track: Track, timelineRect: DOMRect | null }) => {
  return (
    <div style={{display: 'flex'}}>
      <div style={{display: 'flex', marginTop: 25}}>
        {track.clips.map(clip => <TestClip timelineRect={timelineRect} key={clip.id} clip={clip} audioEngine={audioEngine} />)}
      </div>
    </div>
  )
})

const TestTrackPanel = observer(({ track }: { track: Track }) => {
  const [muted, setMuted] = useState(track.channel.mute);
  const transport = Tone.getTransport()
  return (
    <div style={{display: 'flex', border: `${!!track.selected ? '2px solid red' : '2px solid black'}`, width: '200px', marginTop: 30}}>
      <div style={{ width: 'fit-content', display: 'flex', flexDirection: 'column' }}>
        <p>{ track.name }</p>
        <button onClick={() => {
          track.toggleMute();
          setMuted(track.channel.mute)
        }} style={{ maxWidth: '3rem', fontWeight: 'bold', background: `${muted ? 'red' : 'grey'}` }}>M</button>
        <button onClick={track.toggleSelect} style={{ maxWidth: '8rem' }}>Select</button>
        <button style={{ maxWidth: '8rem' }} onClick={() => {
          Tone.start();
          track.addClip(kick, transport.ticks);
        }}>add clip</button>
      </div>
    </div>
  )
})

const TestTrackPanels = observer(({ audioEngine }: { audioEngine: AudioEngine }) => {
  const [bpm, setBpm] = useState(audioEngine.transport.bpm.value)
  const [timeSignature, setTimeSignature] = useState(audioEngine.transport.timeSignature)
  return (
    <div style={{zIndex: 2, marginRight: 40}}>
      {audioEngine.tracks.map(track => (
          <TestTrackPanel key={track.id} track={track} />
      ))}
      <button style={{ maxWidth: '8rem' }} onClick={audioEngine.createTrack}>Add Track</button>
      <button onClick={audioEngine.deleteSelectedTracks}>Delete selected</button>
      <p>{`${timeSignature}/4`}</p>
      <button onClick={() => {
        audioEngine.setTimeSignature(5)
        setTimeSignature(audioEngine.transport.timeSignature)
      }}>Raise time signature</button>
      <p>BPM:</p>
      <p>{bpm}</p>
      <div style={{display: 'flex', flexDirection: 'column'}}>
      <button onClick={() => {
          audioEngine.setBpm(audioEngine.transport.bpm.value + 1);
          setBpm(audioEngine.transport.bpm.value)
        }}>raise tempo</button>
        <button onClick={audioEngine.startTone}>start tone</button>
        <button onClick={audioEngine.play}>play</button>
        <button onClick={audioEngine.pause}>pause</button>
        <button onClick={audioEngine.stop}>stop</button>
      </div>
    </div>
  )
});

const TestTracks = observer(({ audioEngine, timelineRect }: { audioEngine: AudioEngine, timelineRect: DOMRect | null }) => {
  return (
    <div>
      {audioEngine.tracks.map(track => (
          <TestTrack timelineRect={timelineRect} key={track.id} track={track} />
      ))}
    </div>
  )
});

export const DAW = () => {
  const [timelineRect, setTimelineRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    window.addEventListener('click', () => {
      Tone.start();
      return window.removeEventListener('click', () => {
        Tone.start();
        console.log('Tone initialized')
      })
    })
  }, [])
  return (
    <>
      <Timeline timelineRect={timelineRect} setTimelineRect={setTimelineRect} audioEngine={audioEngine} />
      <div style={{display: 'flex'}}>
        <TestTrackPanels audioEngine={audioEngine} />
        <TestTracks timelineRect={timelineRect} audioEngine={audioEngine} />
      </div>
    </>
  )
}
