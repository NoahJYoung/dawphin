import { ChannelStrip } from "./components";
import { observer } from "mobx-react-lite";
import { MasterFader } from "../MasterFader";
import { useAudioEngine } from "../../hooks";

import styles from "./Mixer.module.scss";

export const Mixer = observer(() => {
  const { tracks } = useAudioEngine();
  return (
    <div className={`${styles.mixer} styled-scrollbar`}>
      <MasterFader />
      <div className={`${styles.channels} styled-scrollbar`}>
        {tracks.map((track, i) => (
          <ChannelStrip key={track.id} trackNumber={i + 1} track={track} />
        ))}
      </div>
    </div>
  );
});
