import { observer } from "mobx-react-lite";
import { Button } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined, PlusOutlined, TableOutlined } from "@ant-design/icons"
import { useMemo } from "react";
import { AudioEngine } from "src/AudioEngine";
import { TrackPanel } from "./components";
import { MetronomeIcon } from "src/pages/DAW/icons/MetronomeIcon";
import { SCROLLBAR_HEIGHT, MIN_GRID_HEIGHT, CLIP_HEIGHT, TOPBAR_HEIGHT, TRACK_PANEL_FULL_WIDTH, TRACK_PANEL_X_PADDING, CLIP_TOP_PADDING } from "../../constants";
import * as Tone from 'tone';

const toolbarButtonStyles = {
  background: '#333',
  color: '#aaa',
  borderRadius: '6px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const buttonIconStyles = {
  fontSize: '1.1rem'
}

export const TrackPanels = observer(({ audioEngine, trackPanelsRef, containerRef }: { timelineRect: DOMRect | null, audioEngine: AudioEngine, trackPanelsRef: React.MutableRefObject<HTMLDivElement | null>, containerRef: React.MutableRefObject<HTMLDivElement | null> }) => {

  const sectionHeight = useMemo(() => {
    const calculatedHeight = (CLIP_HEIGHT + CLIP_TOP_PADDING) * audioEngine.tracks.length + SCROLLBAR_HEIGHT;
    return calculatedHeight > MIN_GRID_HEIGHT ? calculatedHeight : MIN_GRID_HEIGHT
  }, [audioEngine.tracks.length]);

  return (
    <div style={{display: 'flex', flexDirection: 'column', paddingRight: TRACK_PANEL_X_PADDING, paddingLeft: TRACK_PANEL_X_PADDING}}>
      {/* Break this out into it's own component you lazy fool */}
      <div style={{ height: TOPBAR_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button
          type="text"
          icon={<PlusOutlined style={buttonIconStyles} />}
          onClick={audioEngine.createTrack}
          style={toolbarButtonStyles}
        />
        <Button
          type="text"
          onClick={audioEngine.toggleMetronome}
          style={toolbarButtonStyles}
          icon={<MetronomeIcon color={audioEngine.metronomeActive ? 'blue' : '#aaa'} width="1.25rem" height="1.25rem" />}
        />
        <Button
          type="text"
          style={audioEngine.snap ? {...toolbarButtonStyles, color: 'blue'} : toolbarButtonStyles}
          icon={<TableOutlined style={buttonIconStyles} />}
          onClick={() => audioEngine.setSnap(!audioEngine.snap)}
        />
        <Button
          type="text"
          style={toolbarButtonStyles}
          icon={ <ZoomOutOutlined style={buttonIconStyles} /> }
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
            style={toolbarButtonStyles}
            icon={ <ZoomInOutlined style={buttonIconStyles} /> }
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
      <div ref={trackPanelsRef} style={{zIndex: 2, minWidth: TRACK_PANEL_FULL_WIDTH, height: 'calc(60vh - 30px)', overflow: 'hidden', borderRadius: '5px', paddingTop: CLIP_TOP_PADDING / 2}}>
        <div style={{height: sectionHeight, borderRadius: '5px', display: 'flex', flexDirection: 'column', gap: CLIP_TOP_PADDING}}>
        {audioEngine.tracks.map((track, i) => (
            <TrackPanel audioEngine={audioEngine} trackNumber={i + 1} key={track.id} track={track} />
        ))}
        </div>
      </div>
    </div>
  )
});