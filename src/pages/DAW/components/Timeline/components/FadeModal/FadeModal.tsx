import { InputNumber, Modal } from "antd";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { AudioEngine } from "src/AudioEngine";

interface FadeModalProps {
  audioEngine: AudioEngine;
  open: boolean;
}

export const FadeModal = ({ audioEngine, open }: FadeModalProps) => {
  const [fadeInInput, setFadeInInput] = useState("");
  const [fadeOutInput, setFadeOutInput] = useState("");

  return (
    <Modal open={open} footer={null}>
      <span style={{ display: "flex", flexDirection: "column" }}>
        <label>Fade in:</label>
        <InputNumber value={fadeInInput} />
      </span>
      <span style={{ display: "flex", flexDirection: "column" }}>
        <label>Fade out:</label>
        <InputNumber value={fadeOutInput} />
      </span>
    </Modal>
  );
};
