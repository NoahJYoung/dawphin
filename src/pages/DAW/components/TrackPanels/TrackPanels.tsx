import { observer } from "mobx-react-lite";
import { useState } from "react";
import { AudioEngine } from "src/AudioEngine";
import * as Tone from 'tone';
import { TrackPanel } from "./components";

export const TrackPanels = observer(({ audioEngine, trackPanelsRef }: { audioEngine: AudioEngine, trackPanelsRef: React.MutableRefObject<HTMLDivElement | null> }) => {
  const [bpm, setBpm] = useState(Tone.getTransport().bpm.value);
  const [timeSignature, setTimeSignature] = useState(Tone.getTransport().timeSignature);

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBpm(parseInt(e.target.value));
  }
  const handleBpmClick = () => {
    audioEngine.setBpm(bpm);
    setBpm(Tone.getTransport().bpm.value)
  }
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
    <div ref={trackPanelsRef} style={{zIndex: 2, minWidth: 250, maxHeight: '60vh', overflow: 'hidden', background: '#222'}}>
      <div style={{ marginTop: 30, height: 2000 }}>
      {audioEngine.tracks.map(track => (
          <TrackPanel key={track.id} track={track} />
      ))}
      </div>
    </div>
    <div>
      <button style={{ maxWidth: '8rem' }} onClick={audioEngine.createTrack}>Add Track</button>
      <button onClick={audioEngine.deleteSelectedTracks}>Delete selected</button>
      <p>{`${timeSignature}/4`}</p>
      <button onClick={() => {
        audioEngine.setTimeSignature(5)
        setTimeSignature(Tone.getTransport().timeSignature)
      }}>Raise time signature</button>
      <p>BPM:</p>
      <p>{Tone.getTransport().bpm.value}</p>
      <input type="number" value={bpm} onChange={handleBpmChange}/>
      <button onClick={handleBpmClick}>Set BPM</button>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <button
          onClick={async () => Tone.start()}>
            start tone
          </button>
        <button onClick={audioEngine.play}>play</button>
        <button onClick={audioEngine.pause}>pause</button>
        <button onClick={audioEngine.stop}>stop</button>
        <button onClick={() => audioEngine.setZoom('zoomIn')}>Zoom in</button>
        <button onClick={() => audioEngine.setZoom('zoomOut')}>Zoom out</button>
      </div>
    </div>
    </div>
  )
});