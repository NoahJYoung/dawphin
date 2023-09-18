import { PlusOutlined, TableOutlined, ZoomOutOutlined, ZoomInOutlined, CaretLeftOutlined, DoubleLeftOutlined, LeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { observer } from "mobx-react-lite";
import { AudioEngine } from "src/AudioEngine";
import { TOPBAR_HEIGHT } from "src/pages/DAW/constants";
import { MetronomeIcon } from "src/pages/DAW/icons";
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

interface ToolbarProps {
  audioEngine: AudioEngine
  containerRef: React.MutableRefObject<HTMLDivElement | null>
  toggleExpanded: () => void
  expanded: boolean
}

export const Toolbar = observer(({ audioEngine, containerRef, expanded, toggleExpanded }: ToolbarProps) => {
  return (
    <div style={{ height: TOPBAR_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button
          type="text"
          icon={<PlusOutlined style={buttonIconStyles} />}
          onClick={audioEngine.createTrack}
          style={{...toolbarButtonStyles, display: expanded ? 'flex' : 'none'}}
        />
        <Button
          type="text"
          onClick={audioEngine.toggleMetronome}
          style={{...toolbarButtonStyles, display: expanded ? 'flex' : 'none'}}
          icon={<MetronomeIcon color={audioEngine.metronomeActive ? 'blue' : '#aaa'} width="1.25rem" height="1.25rem" />}
        />
        <Button
          type="text"
          style={audioEngine.snap ? {...toolbarButtonStyles, color: 'blue'} : {...toolbarButtonStyles, display: expanded ? 'flex' : 'none'}}
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
        <Button
          type="text"
          style={{...toolbarButtonStyles, transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)'}}
          icon={ <LeftOutlined style={buttonIconStyles} /> }
          onClick={toggleExpanded}
        />
      </div>
  )
})