import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Track } from "src/AudioEngine/Track";
import * as Tone from 'tone';

export const TrackPanel = observer(({ track }: { track: Track }) => {
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
    <div
      style={{display: 'flex', width: '100%', height: 119, background: track.selected ? '#888' : '#666', borderBottom: track.selected ? '1px solid #777' : '1px solid #555'}}
      onClick={() => track.toggleSelect()}
    >
      <div style={{ width: 'fit-content', display: 'flex', flexDirection: 'column' }}>
        <button onClick={() => {
          track.toggleMute();
          setMuted(track.channel.mute)
        }} style={{ maxWidth: '3rem', fontWeight: 'bold', background: `${muted ? 'red' : 'grey'}` }}>M</button>
        <button onClick={track.toggleSelect} style={{ maxWidth: '8rem' }}>Select</button>
        <label htmlFor={`fileInput${track.id}`} className="custom-file-label">
          Add clip
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
    </div>
  )
})