import { AudioEngine } from "src/AudioEngine";
import { ChannelStrip } from "./components";
import { observer } from "mobx-react-lite";

import styles from "./Mixer.module.scss";

interface MixerProps {
  audioEngine: AudioEngine;
}

export const Mixer = observer(({ audioEngine }: MixerProps) => {
  return (
    <div
      className={`${styles.mixer} styled-scrollbar`}
      style={{
        maxWidth: "100%",
        overflow: "auto",
        height: "300px",
        display: "flex",
        gap: "4px",
      }}
    >
      {audioEngine.tracks.map((track, i) => (
        <ChannelStrip key={track.id} trackNumber={i + 1} track={track} />
      ))}
    </div>
  );
});
