import { StepBackwardOutlined, StepForwardOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { observer } from "mobx-react-lite";
import { AudioEngine } from "src/AudioEngine";
import { PauseIcon, PlayIcon, RecordIcon, StopIcon } from "src/pages/DAW/icons";

interface TransportControlsProps {
  audioEngine: AudioEngine;
}

export const TransportControls = observer(({ audioEngine }: TransportControlsProps) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
      <Button
        icon={<StepBackwardOutlined style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }} />}
        onClick={audioEngine.toStart}
        style={{
          border: '1px solid #111',
          background: 'linear-gradient(#666, #333)',
          padding: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderTopLeftRadius: '50%',
          borderBottomLeftRadius: '50%',
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
      />
      <Button
        icon={<StopIcon color={'rgb(175, 175, 175)'} height={40} width={40} />}
        onClick={audioEngine.stop}
        style={{
          background: 'linear-gradient(#666, #333)',
          border: '1px solid #111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '40px',
          width: '40px',
          borderRadius: 0,
          boxShadow: audioEngine.state === 'stopped' ? '1px 1px 4px 1px #222 inset' : '',
        }}
      />
      <Button
        icon={<PlayIcon color={'rgb(0, 250, 0)'} height={40} width={40} />}
        onClick={audioEngine.play}
        style={{
          background: 'linear-gradient(#666, #333)',
          border: '1px solid #111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '40px',
          width: '40px',
          borderRadius: 0,
          boxShadow: audioEngine.state === 'playing' ? '1px 1px 4px 1px #222 inset' : '',
        }}
      />
      <Button
        icon={<PauseIcon color={'rgb(0, 0, 250)'} height={40} width={40} />}
        onClick={audioEngine.pause}
        style={{
          background: 'linear-gradient(#666, #333)',
          border: '1px solid #111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '40px',
          width: '40px',
          borderRadius: 0,
          boxShadow: audioEngine.state === 'paused' ? '1px 1px 4px 1px #222 inset' : '',
        }}
      />
      <Button
        icon={<StepForwardOutlined style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }} />}
        onClick={audioEngine.toEnd}
        style={{
          border: '1px solid #111',
          background: 'linear-gradient(#666, #333)',
          padding: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderTopRightRadius: '50%',
          borderBottomRightRadius: '50%',
        }}
      />
      </div>
      <Button
        icon={<RecordIcon width={40} height={40} color="rgb(200, 0, 0)" innerColor="rgb(150, 0, 0)" />}
        onClick={() => audioEngine.setState('recording')}
        style={{
          background: 'transparent',
          marginLeft: '5px',
          border: 'none',
          width: 40,
          height: 40,
          padding: 0,
          borderRadius: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: audioEngine.state === 'recording' ? 1 : 0.5,
        }}
      />
    </div>
  )
})

