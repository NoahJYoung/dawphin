import { Track } from "src/AudioEngine/Track";
import { TrackFXListBox, FXListBox } from "..";
import { MasterControl } from "src/AudioEngine/MasterControl";

import styles from "./ListBoxes.module.scss";

interface ListBoxesProps {
  track: Track | MasterControl;
  effectViewIndex: number;
  setEffectViewIndex: (i: number) => void;
}

export const ListBoxes = ({
  track,
  effectViewIndex,
  setEffectViewIndex,
}: ListBoxesProps) => {
  return (
    <div className={styles.container}>
      <TrackFXListBox
        effectViewIndex={effectViewIndex}
        setEffectViewIndex={setEffectViewIndex}
        track={track}
      />
      <FXListBox track={track} />
    </div>
  );
};
