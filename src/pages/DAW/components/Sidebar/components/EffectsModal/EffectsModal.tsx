import React, { useState } from "react";
import { Modal } from "antd";
import { Track } from "src/AudioEngine/Track";
import * as Tone from "tone";
import { EQ3View } from "./effects";

import styles from "./EffectsModal.module.scss";

interface EffectsModalProps {
  track: Track;
  open: boolean;
  onCancel: () => void;
}

const reverb = new Tone.Reverb(10);
const eq3 = new Tone.EQ3(0, 5, 10);

const getEffectInstances = (track: Track) => {
  return track.effectsChain.map((effect) => {
    if (effect.name === "EQ3") {
      return <EQ3View EQ3={effect as Tone.EQ3} />;
    }

    if (effect.name === "Reverb") {
      return <div>reverbView</div>;
    }
  });
};

export const EffectsModal = ({ track, open, onCancel }: EffectsModalProps) => {
  const [effectViewIndex, setEffectViewIndex] = useState(0);

  return (
    <Modal
      title={track.name}
      closeIcon={false}
      onCancel={onCancel}
      onOk={onCancel}
      cancelButtonProps={{ style: { display: "none" } }}
      open={open}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          gap: "2rem",
          background: "#292929",
          color: "#aaa",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "20rem",
            justifyContent: "space-evenly",
          }}
        >
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              border: "1px solid black",
              height: "100%",
              width: "100%",
            }}
          >
            {track.effectsChain.map((effect, i) => (
              <li onClick={() => setEffectViewIndex(i)} key={i}>
                {effect.name}
              </li>
            ))}
          </ul>

          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              border: "1px solid black",
              height: "100%",
            }}
          >
            <button
              onClick={() => {
                track.addEffect(reverb);
              }}
            >
              Add Reverb
            </button>

            <button
              onClick={() => {
                track.addEffect(eq3);
              }}
            >
              Add EQ
            </button>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "20rem",
            height: "20rem",
          }}
        >
          {getEffectInstances(track)[effectViewIndex]}
        </div>
      </div>
    </Modal>
  );
};
