import React from "react";
import { observer } from "mobx-react-lite";
import { AudioEngine } from "src/AudioEngine";
import { ProjectDataDisplay, TransportControls } from "./components";

interface TransportViewProps {
  audioEngine: AudioEngine
}

export const TransportView = observer(({ audioEngine }: TransportViewProps) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '5px',
        height: '100%',
        borderRadius: '5px',
      }}
    >
      <div
        style={{
          display: 'flex',
          height: '100%',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <TransportControls audioEngine={audioEngine} />
        <ProjectDataDisplay audioEngine={audioEngine} />
      </div>
    </div>
  )
})