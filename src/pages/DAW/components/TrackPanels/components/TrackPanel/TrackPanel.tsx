import { observer } from "mobx-react-lite";
import { Track } from "src/AudioEngine/Track";
import { Button, ColorPicker } from 'antd';
import { FolderOpenOutlined } from "@ant-design/icons";
import { Input } from 'antd';
import type { AudioEngine } from "src/AudioEngine";
import { CLIP_HEIGHT, TRACK_PANEL_FULL_WIDTH } from "src/pages/DAW/constants";
import * as Tone from 'tone';
import { getTrackBackgroundColor } from "src/pages/DAW/helpers";
import { RecordIcon } from "src/pages/DAW/icons";

import styles from './TrackPanel.module.scss';

export const TrackPanel = observer(({ track, audioEngine }: { track: Track, trackNumber: number, audioEngine: AudioEngine }) => {
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

  const activeOuterRgb = 'rgb(200, 0, 0)';
  const inactiveOuterRgb = 'rgb(150, 0, 0)';
  const activeInnerRgb = 'rgb(250, 100, 100)';
  const inactiveInnerRgb = 'rgb(200, 100, 100)';

  return (
    <div
      style={{
        border: track.selected ? `1px solid ${track.color}` : '1px solid #191919',
        borderRadius: '6px',
        display: 'flex',
        width: TRACK_PANEL_FULL_WIDTH,
        height: CLIP_HEIGHT,
        background: '#333',
        borderBottom: '1px solid #333',
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div
        style={{
          width: '0.75rem',
          background: track.color,
          borderTopLeftRadius: '6px',
          borderBottomLeftRadius: '6px',
          display: 'flex',
          justifyContent: 'center',
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          padding: '4px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', height: 'fit-content' }}>
          <Button
            icon={(
              <RecordIcon
                width={30}
                height={30}
                color={track.active ? activeOuterRgb: inactiveOuterRgb}
                innerColor={track.active ? activeInnerRgb: inactiveInnerRgb}
              />
            )}
            onClick={track.toggleActive}
            style={{
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
              display: 'flex',
              background: 'transparent',
              color: '#aaa',
              border: 'none',
              outline: 'none',
              alignItems: 'center',
              height: '1.5rem',
              width: '8rem',
              padding: '0.25rem'
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              value={''}
              type="file"
              id={`fileInput${track.id}`}
              style={{ display: 'none' }}
              accept='audio/*'
              onChange={handleFileChange}
            />
            <label
              htmlFor={`fileInput${track.id}`}
              className={`${styles.folderButton} custom-file-label`}
            >
              <FolderOpenOutlined style={{ color: '#aaa', padding: '0.25rem', border: '1px solid #aaa', borderRadius: '6px' }} />
            </label>
            <ColorPicker
              size={"small"}
              format="rgb"
              style={{
                background: 'transparent',
                border: 'none'
              }}
              disabledAlpha
              value={track.color}
              onChange={(e) => {
                const r = e.toRgb().r
                const g = e.toRgb().g
                const b = e.toRgb().b
                track.setColor(`rgb(${r},${g},${b})`)
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
            <Button
                onClick={() => {
                  track.toggleMute();
                }}
                type="text"
                style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: `1px solid ${track.muted ? 'red' : '#aaa'}`,
                  color: track.muted ? 'red' : '#aaa',
                  padding: 0.25,
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                }}
              >
                M
              </Button>
              <Button
                onClick={() => {}}
                type="text"
                style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: `1px solid ${track.solo ? 'yellow' : '#aaa'}`,
                  color: track.solo ? 'yellow' : '#aaa',
                  padding: 0.25,
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                }}
              >
                S
              </Button>
            </div>
        </div>
      </div>
    </div>
  )
})