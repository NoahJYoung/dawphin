import { useState } from "react";
import { Modal } from "antd";
import { Track } from "src/AudioEngine/Track";
import * as Tone from "tone";
import { CompressorView, EQ3View } from "./effects";
import { MasterControl } from "src/AudioEngine/MasterControl";
import { ListBoxes } from "./components/ListBoxes";
import { v4 as uuidv4 } from "uuid";
import { AudioEngine } from "src/AudioEngine";

import styles from "./EffectsModal.module.scss";

const getEffectInstances = (
  track: Track | MasterControl,
  audioEngine: AudioEngine
) => {
  if (track?.effectsChain?.length) {
    return track.effectsChain.map((effect) => {
      if (effect.name === "EQ3") {
        return <EQ3View key={uuidv4()} EQ3={effect as Tone.EQ3} />;
      }

      if (effect.name === "Reverb") {
        return <div key={uuidv4()}>reverbView</div>;
      }

      if (effect.name === "Compressor") {
        return (
          <CompressorView
            key={uuidv4()}
            audioEngine={audioEngine}
            compressor={effect as Tone.Compressor}
          />
        );
      }
    });
  }
  return [];
};

interface EffectsModalProps {
  track: Track | MasterControl;
  open: boolean;
  onCancel: () => void;
  audioEngine: AudioEngine;
}

export const EffectsModal = ({
  track,
  open,
  onCancel,
  audioEngine,
}: EffectsModalProps) => {
  const [effectViewIndex, setEffectViewIndex] = useState<number>(0);

  return (
    <Modal
      className={styles.modal}
      style={{ border: "1px solid #111", borderRadius: "5px" }}
      mask={false}
      maskClosable={false}
      title={track.name}
      footer={null}
      onCancel={onCancel}
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
          {getEffectInstances(track, audioEngine)[effectViewIndex]}
        </div>
      </div>
    </Modal>
  );
};
