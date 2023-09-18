import React from "react";
import { observer } from "mobx-react-lite";
import { AudioEngine } from "src/AudioEngine";
import { ProjectDataDisplay, TransportControls } from "./components";

interface TransportViewProps {
  audioEngine: AudioEngine
}

export const TransportView = observer(({ audioEngine }: TransportViewProps) => {
  const screenWidth = window.innerWidth;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: screenWidth < 769 ? 'column' : 'row',
        height: '50px',
        gap: '1rem',
        alignItems: screenWidth < 769 ? undefined : 'center',
        marginBottom: '5px'
      }}
    >
      <TransportControls audioEngine={audioEngine} />
      <ProjectDataDisplay audioEngine={audioEngine} />
    </div>
  )
})