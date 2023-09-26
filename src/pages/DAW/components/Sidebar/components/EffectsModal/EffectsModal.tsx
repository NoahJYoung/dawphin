import React, { useState } from "react";
import { Button, Modal } from "antd";
import { Track } from "src/AudioEngine/Track";
import * as Tone from "tone";
import { EQ3View } from "./effects";
import { PlusCircleOutlined } from "@ant-design/icons";

import styles from "./EffectsModal.module.scss";

interface EffectsModalProps {
  track: Track;
  open: boolean;
  onCancel: () => void;
}

const getEffectInstances = (track: Track) => {
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
      title={track.name}
      closeIcon={false}
      onCancel={onCancel}
      onOk={onCancel}
      cancelButtonProps={{ style: { display: "none" } }}
      open={open}
      bodyStyle={{ height: "100%", width: "100%" }}
      width={800}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          gap: "10px",
          color: "#aaa",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "50%",
            width: "40%",
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

          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              border: "1px solid black",
              height: "100%",
              padding: 0,
            }}
          >
            {track.audioEngine.fxFactory.effects.map((effect) => (
              <li
                key={effect.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <span>{effect.name}</span>
                <Button
                  onClick={() => {
                    const newEffect = track.audioEngine.fxFactory.createEffect(
                      effect.name
                    );
                    track.addEffect(newEffect as Tone.ToneAudioNode);
                  }}
                  icon={<PlusCircleOutlined />}
                />
              </li>
            ))}
          </ul>
        </div>

        <div
          className="styled-scrollbar"
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            overflow: "auto",
          }}
        >
          {getEffectInstances(track)[effectViewIndex]}
        </div>
      </div>
    </Modal>
  );
};
