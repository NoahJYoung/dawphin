import React from "react";
import { AudioEngine } from "src/AudioEngine";
import { ChannelStrip } from "./components";
import { observer } from "mobx-react-lite";

interface MixerProps {
  audioEngine: AudioEngine
}

export const Mixer = observer(({ audioEngine }: MixerProps) => {

  return (
    <div style={{ maxWidth: '100%', overflow: 'auto', height: '100%', display: 'flex', gap: '2px' }}>
      {audioEngine.tracks.map((track, i)=> <ChannelStrip key={track.id} trackNumber={i + 1} track={track} />)}
    </div>
  )
})