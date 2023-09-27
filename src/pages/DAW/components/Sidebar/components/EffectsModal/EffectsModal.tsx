import { useState } from "react";
import { Modal } from "antd";
import { Track } from "src/AudioEngine/Track";
import * as Tone from "tone";
import { EQ3View } from "./effects";
import { MasterControl } from "src/AudioEngine/MasterControl";
import { ListBoxes } from "./components/ListBoxes";

import styles from "./EffectsModal.module.scss";

interface EffectsModalProps {
  track: Track | MasterControl;
  open: boolean;
  onCancel: () => void;
}

const getEffectInstances = (track: Track | MasterControl) => {
  return track.effectsChain.map((effect, i) => {
    if (effect.name === "EQ3") {
      return <EQ3View key={i} EQ3={effect as Tone.EQ3} />;
    }

    if (effect.name === "Reverb") {
      return <div key={i}>reverbView</div>;
    }
  });
};

export const EffectsModal = ({ track, open, onCancel }: EffectsModalProps) => {
  const [effectViewIndex, setEffectViewIndex] = useState(0);

  return (
    <Modal
      className={styles.modal}
      title={track.name}
      closeIcon={false}
      onCancel={onCancel}
      onOk={onCancel}
      cancelButtonProps={{ style: { display: "none" } }}
      okText="Close"
      open={open}
      bodyStyle={{ height: "100%", width: "100%", padding: "0.5rem" }}
      width={800}
    >
      <div className={styles.innerContainer}>
        <ListBoxes
          setEffectViewIndex={setEffectViewIndex}
          effectViewIndex={effectViewIndex}
          track={track}
        />
        <div className={styles.effectViewContainer}>
          {getEffectInstances(track)[effectViewIndex]}
        </div>
      </div>
    </Modal>
  );
};
