import { InputNumber, Modal } from "antd";
import { useState } from "react";

interface FadeModalProps {
  open: boolean;
}

export const FadeModal = ({ open }: FadeModalProps) => {
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
