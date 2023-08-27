import { observer } from "mobx-react-lite";
import { Button } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined, PlusOutlined, FileAddOutlined, TableOutlined } from "@ant-design/icons"
import { useMemo, useState } from "react";
import { AudioEngine } from "src/AudioEngine";
import * as Tone from 'tone';
import { TrackPanel } from "./components";
import { MetronomeIcon } from "src/pages/DAW/icons/MetronomeIcon";

export const TrackPanels = observer(({ audioEngine, trackPanelsRef, containerRef }: { timelineRect: DOMRect | null, audioEngine: AudioEngine, trackPanelsRef: React.MutableRefObject<HTMLDivElement | null>, containerRef: React.MutableRefObject<HTMLDivElement | null> }) => {
  const [bpm, setBpm] = useState(Tone.getTransport().bpm.value);
  const [timeSignature, setTimeSignature] = useState(Tone.getTransport().timeSignature);

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBpm(parseInt(e.target.value));
  }
  const handleBpmClick = () => {
    audioEngine.setBpm(bpm);
    setBpm(Tone.getTransport().bpm.value)
  }
  const duplicateDisabled = useMemo(() => audioEngine.selectedTracks.length !== 1, [audioEngine.selectedTracks.length]);
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <div style={{ height: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#555', border: '1px solid #333' }}>
        <Button
          type="text"
          icon={<PlusOutlined />}
          onClick={audioEngine.createTrack}
        />
        <Button
          disabled={duplicateDisabled}
          type="text"
          icon={<FileAddOutlined />}
          onClick={audioEngine.createTrack}
        />
        <Button
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          type="text"
          onClick={audioEngine.toggleMetronome}
          icon={<MetronomeIcon color={audioEngine.metronomeActive ? 'blue' : 'black'} width="1rem" height="1rem" />}
        />
        <Button
          type="text"
          style={{ color: audioEngine.snap ? 'blue' : '#000' }}
          icon={<TableOutlined />}
          onClick={() => audioEngine.setSnap(!audioEngine.snap)}
        />
        <Button
          type="text"
          icon={ <ZoomOutOutlined /> }
          onClick={() => {
            audioEngine.setZoom('zoomOut');
            if (containerRef.current?.scrollLeft) {
              if (containerRef.current?.scrollLeft || containerRef.current?.scrollLeft === 0) {
                const transportPos = (Tone.getTransport().seconds * Tone.getContext().sampleRate) / audioEngine.samplesPerPixel;
                const offset = containerRef.current.clientWidth / 2
                containerRef.current.scrollLeft = transportPos - offset;
              }
            }
          }}
        />
          <Button
            type="text"
            icon={ <ZoomInOutlined /> }
            onClick={() => {
              audioEngine.setZoom('zoomIn');
              if (containerRef.current?.scrollLeft || containerRef.current?.scrollLeft === 0) {
                const transportPos = (Tone.getTransport().seconds * Tone.getContext().sampleRate) / audioEngine.samplesPerPixel;
                const offset = containerRef.current.clientWidth / 2
                containerRef.current.scrollLeft = transportPos - offset;
              }
            }}
          />
      </div>
      <div ref={trackPanelsRef} style={{zIndex: 2, minWidth: 250, height: 'calc(60vh - 30px)', overflow: 'hidden', background: '#111'}}>
        <div style={{height: 2000}}>
        {audioEngine.tracks.map((track, i) => (
            <TrackPanel audioEngine={audioEngine} trackNumber={i + 1} key={track.id} track={track} />
        ))}
        </div>
      </div>
      <div>
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
        </div>
      </div>
    </div>
  )
});