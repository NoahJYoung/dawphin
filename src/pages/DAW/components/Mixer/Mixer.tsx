import { AudioEngine } from "src/AudioEngine";
import { ChannelStrip } from "./components";
import { observer } from "mobx-react-lite";

import styles from "./Mixer.module.scss";
import { MasterFader } from "../MasterFader";

interface MixerProps {
  audioEngine: AudioEngine;
}

export const Mixer = observer(({ audioEngine }: MixerProps) => {
  return (
    <div className={`${styles.mixer} styled-scrollbar`}>
      <MasterFader
        audioEngine={audioEngine}
        masterControl={audioEngine.masterControl}
      />
      {audioEngine.tracks.map((track, i) => (
        <ChannelStrip
          audioEngine={audioEngine}
          key={track.id}
          trackNumber={i + 1}
          track={track}
        />
      ))}
    </div>
  );
});
