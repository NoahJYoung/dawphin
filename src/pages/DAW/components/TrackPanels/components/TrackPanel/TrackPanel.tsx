import { observer } from "mobx-react-lite";
import { Track } from "src/AudioEngine/Track";
import { Button, ColorPicker, Space } from 'antd';
import { FolderOpenOutlined } from "@ant-design/icons";
import { Input } from 'antd';
import type { AudioEngine } from "src/AudioEngine";
import { CLIP_HEIGHT, TRACK_NUMBER_WIDTH, TRACK_PANEL_WIDTH } from "src/pages/DAW/constants";
import * as Tone from 'tone';
import { getTrackBackgroundColor } from "src/pages/DAW/helpers";
import { RecordIcon } from "src/pages/DAW/icons";

import styles from './TrackPanel.module.scss';

const { Compact } = Space;

export const TrackPanel = observer(({ track, trackNumber, audioEngine }: { track: Track, trackNumber: number, audioEngine: AudioEngine }) => {
  const transport = Tone.getTransport();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      const src = URL.createObjectURL(selectedFile);
      track.addClip(src, transport.seconds);
    }
  };

  const handleClick = (e: React.MouseEvent) =>{
    if (!e.ctrlKey) {
      audioEngine.deselectAllTracks();
    }
    track.select();
    audioEngine.getSelectedTracks();
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!e.ctrlKey) {
      audioEngine.deselectClips();
    }
    track.selectAllClips();
  }

  const trackBackgroundColor = getTrackBackgroundColor(track);
  const activeOuterRgb = 'rgb(200, 0, 0)';
  const inactiveOuterRgb = 'rgb(150, 0, 0)';
  const activeInnerRgb = 'rgb(150, 0, 0)';
  const inactiveInnerRgb = 'rgb(100, 0, 0)';

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        background: 'transparent',
        borderRadius: '5px',
      }}
    >
      <div style={{borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: TRACK_NUMBER_WIDTH, border: `1px solid #222`, borderTop: 'none', background: trackBackgroundColor}}>
        <p style={{ margin: '0', fontFamily: 'Arial', fontWeight: 'bold' }}>{ trackNumber }</p>
      </div>
      <div
        style={{borderRadius: '5px', display: 'flex', width: TRACK_PANEL_WIDTH, height: CLIP_HEIGHT, background: trackBackgroundColor, borderBottom: '1px solid #333'}}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        <div style={{ position: 'relative', width: '75%' }}>
          <Button
              icon={<RecordIcon width={30} height={30} color={track.active ? activeOuterRgb: inactiveOuterRgb} innerColor={track.active ? activeInnerRgb: inactiveInnerRgb} />}
              onClick={track.toggleActive}
              style={{
                top: '-1px',
                left: '0px',
                position: 'absolute',
                background: 'transparent',
                border: 'none',
                width: 35,
                height: 35,
                padding: 0,
                borderRadius: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
              }}
            />
          <Input
            onChange={(e) => track.setName(e.target.value)}
            value={track.name}
            style={{
              left: '5px',
              top: '5px',
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '12px',
              height: '1.5rem',
              width: '8rem',
              textAlign: 'center'
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: '4rem', justifyContent: 'space-evenly' }}>
        <div style={{ width: '100%', display: 'flex', borderRadius: '5px', justifyContent: 'space-evenly', alignItems: 'center' }}>
        <Button
            onClick={() => {
              track.toggleMute();
            }}
            type="text"
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid #111',
              padding: 0,
              fontSize: '0.75rem',
              fontWeight: 'bold',
              background: `${track.muted ? 'red' : 'grey'}`
            }}
          >
            M
          </Button>
          <Button
            onClick={() => {}}
            type="text"
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'center',
              border: '1px solid #111',
              alignItems: 'center',
              padding: 0,
              fontSize: '0.75rem',
              fontWeight: 'bold',
              background: `${track.solo ? 'yellow' : 'grey'}`
            }}
          >
            S
          </Button>
          </div>
          <div>
          <input
            value={''}
            type="file"
            id={`fileInput${track.id}`}
            style={{ display: 'none' }}
            accept='audio/*'
            onChange={handleFileChange}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
          <label
            htmlFor={`fileInput${track.id}`}
            className={`${styles.folderButton} custom-file-label`}
          >
            <FolderOpenOutlined />
          </label>
          <ColorPicker
            size={"small"}
            format="rgb"
            disabledAlpha
            value={track.color}
            onChangeComplete={(e) => {
              const r = e.toRgb().r
              const g = e.toRgb().g
              const b = e.toRgb().b
              track.setColor(`rgb(${r},${g},${b})`)
            }}
          />
        </div>
        </div>
      </div>
    </div>
  )
})