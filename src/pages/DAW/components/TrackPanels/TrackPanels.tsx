import { observer } from "mobx-react-lite";
import { Button } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined, PlusOutlined, FileAddOutlined, TableOutlined } from "@ant-design/icons"
import { useMemo, useState } from "react";
import { AudioEngine } from "src/AudioEngine";
import { TrackPanel } from "./components";
import { MetronomeIcon } from "src/pages/DAW/icons/MetronomeIcon";
import { SCROLLBAR_HEIGHT, MIN_GRID_HEIGHT, CLIP_HEIGHT, TOPBAR_HEIGHT, TRACK_PANEL_FULL_WIDTH, TRACK_PANEL_RIGHT_PADDING } from "../../constants";
import * as Tone from 'tone';

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

  const sectionHeight = useMemo(() => {
    const calculatedHeight = CLIP_HEIGHT * audioEngine.tracks.length + SCROLLBAR_HEIGHT;
    return calculatedHeight > MIN_GRID_HEIGHT ? calculatedHeight : MIN_GRID_HEIGHT
  }, [audioEngine.tracks.length]);

  const duplicateDisabled = useMemo(() => audioEngine.selectedTracks.length !== 1, [audioEngine.selectedTracks.length]);

  return (
    <div style={{display: 'flex', flexDirection: 'column', paddingRight: TRACK_PANEL_RIGHT_PADDING,}}>
      <div style={{ height: TOPBAR_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#555', border: '1px solid #333', borderRadius: '5px' }}>
        <Button
          type="text"
          icon={<PlusOutlined />}
          onClick={audioEngine.createTrack}
        />
        <Button
          disabled={duplicateDisabled}
          type="text"
          icon={<FileAddOutlined />}
          onClick={() => {}}
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
      <div ref={trackPanelsRef} style={{zIndex: 2, minWidth: TRACK_PANEL_FULL_WIDTH, height: 'calc(60vh - 30px)', overflow: 'hidden', borderRadius: '5px'}}>
        <div style={{height: sectionHeight, borderRadius: '5px'}}>
        {audioEngine.tracks.map((track, i) => (
            <TrackPanel audioEngine={audioEngine} trackNumber={i + 1} key={track.id} track={track} />
        ))}
        </div>
      </div>
    </div>
  )
});