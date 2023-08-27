import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Track } from "src/AudioEngine/Track";
import { Button, ColorPicker } from 'antd';
import { FolderOpenOutlined } from "@ant-design/icons";
import { Input } from 'antd';
import * as Tone from 'tone';
import type { AudioEngine } from "src/AudioEngine";
import { convertRgbToRgba } from "../../../Tracks/components/TrackView/components/ClipView/ClipView";

export const TrackPanel = observer(({ track, trackNumber, audioEngine }: { track: Track, trackNumber: number, audioEngine: AudioEngine }) => {
  const [muted, setMuted] = useState(track.channel.mute);
  const transport = Tone.getTransport();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      const src = URL.createObjectURL(selectedFile);
      track.addClip(src, transport.seconds);
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', background: '#666' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 25, border: `1px solid #333`, borderTop: 'none', background: track.selected ? convertRgbToRgba(track.color, 0.6) : convertRgbToRgba(track.color, 0.3)}}>
        <p style={{ margin: '0', fontFamily: 'Arial', fontWeight: 'bold' }}>{ trackNumber }</p>
      </div>
      <div
        style={{display: 'flex', width: 225, height: 80, background: track.selected ? convertRgbToRgba(track.color, 0.6) : convertRgbToRgba(track.color, 0.3), borderBottom: '1px solid #333'}}
        onClick={() => {
          track.toggleSelect();
          audioEngine.getSelectedTracks();
        }}
      >
        <Input
          value={track.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '10px',
            height: '1.5rem',
            width: '8rem'
          }}
        />
        <div style={{ width: 'fit-content', display: 'flex', flexDirection: 'column' }}>
          <Button
            onClick={() => {
              track.toggleMute();
              setMuted(track.channel.mute)
            }}
            type="text"
            style={{
              maxWidth: '1.5rem',
              maxHeight: '1rem',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 0,
              fontSize: '0.75rem',
              fontWeight: 'bold',
              background: `${muted ? 'red' : 'grey'}`
            }}
          >
            M
          </Button>
          <label htmlFor={`fileInput${track.id}`} className="custom-file-label">
            <FolderOpenOutlined />
          </label>
          <input
            value={''}
            type="file"
            id={`fileInput${track.id}`}
            style={{ display: 'none' }}
            accept='audio/*'
            onChange={handleFileChange}
          />
        </div>
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
  )
})