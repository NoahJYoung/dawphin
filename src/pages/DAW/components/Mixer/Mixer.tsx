import React from "react";
import { AudioEngine } from "src/AudioEngine";
import { ChannelStrip } from "./components";
import { observer } from "mobx-react-lite";

interface MixerProps {
  audioEngine: AudioEngine
}

export const Mixer = observer(({ audioEngine }: MixerProps) => {

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      {audioEngine.tracks.map(track => <ChannelStrip key={track.id} track={track} />)}
    </div>
  )
})