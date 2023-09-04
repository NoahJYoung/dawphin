import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Track } from "src/AudioEngine/Track";
import { Button, ColorPicker } from 'antd';
import { FolderOpenOutlined } from "@ant-design/icons";
import { Input } from 'antd';
import type { AudioEngine } from "src/AudioEngine";
import { convertRgbToRgba } from "../../../Tracks/components/TrackView/components/ClipView/ClipView";
import { CLIP_HEIGHT, TRACK_NUMBER_WIDTH, TRACK_PANEL_WIDTH } from "src/pages/DAW/constants";
import * as Tone from 'tone';

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

  const panelBackgroundColor = track.selected ? `radial-gradient(${convertRgbToRgba(track.color, 0.8)}, ${convertRgbToRgba(track.color, 0.6)})` : `radial-gradient(${convertRgbToRgba(track.color, 0.5)}, ${convertRgbToRgba(track.color, 0.3)})`;

  return (
    <div style={{ width: '100%', display: 'flex', background: 'transparent', borderRadius: '5px'}}>
      <div style={{borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: TRACK_NUMBER_WIDTH, border: `1px solid #222`, borderTop: 'none', background: panelBackgroundColor}}>
        <p style={{ margin: '0', fontFamily: 'Arial', fontWeight: 'bold' }}>{ trackNumber }</p>
      </div>
      <div
        style={{borderRadius: '5px', display: 'flex', width: TRACK_PANEL_WIDTH, height: CLIP_HEIGHT, background: panelBackgroundColor, borderBottom: '1px solid #333'}}
        onClick={(e) => {
          if (!e.ctrlKey) {
            audioEngine.deselectAllTracks();
          }
          track.select();
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
        <div style={{ width: 'fit-content', display: 'flex', flexDirection: 'column', borderRadius: '5px' }}>
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