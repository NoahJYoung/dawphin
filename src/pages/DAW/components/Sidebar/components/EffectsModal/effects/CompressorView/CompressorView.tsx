import { useState } from "react";
import * as Tone from "tone";

import { CompressorKnob, CompressorMeters } from "./components";
import { AudioEngine } from "src/AudioEngine";

import styles from "./CompressorView.module.scss";

interface CompressorViewProps {
  compressor: Tone.Compressor;
  audioEngine: AudioEngine;
}

export const CompressorView = ({
  compressor,
  audioEngine,
}: CompressorViewProps) => {
  const [attack, setAttack] = useState(Number(compressor.attack.value));
  const [release, setRelease] = useState(Number(compressor.release.value));
  const [ratio, setRatio] = useState(Number(compressor.ratio.value));
  const [knee, setKnee] = useState(Number(compressor.knee.value));
  const [threshold, setThreshold] = useState(
    Number(compressor.threshold.value)
  );

  const handleAttackChange = (value: number) => {
    compressor.attack.value = value;
    setAttack(compressor.attack.value);
  };

  const handleReleaseChange = (value: number) => {
    compressor.release.value = value;
    setRelease(compressor.release.value);
  };

  const handleRatioChange = (value: number) => {
    compressor.ratio.value = value;
    setRatio(compressor.ratio.value);
  };

  const handleKneeChange = (value: number) => {
    compressor.knee.value = value;
    setKnee(compressor.knee.value);
  };

  const handleThresholdChange = (value: number) => {
    compressor.threshold.value = value;
    setThreshold(compressor.threshold.value);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid #111",
        borderRadius: "5px",
        maxWidth: "fit-content",
        padding: "10px",
        height: "100%",
      }}
    >
      <h2>{compressor.name}</h2>
      <CompressorMeters audioEngine={audioEngine} compressor={compressor} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
        }}
      >
        <CompressorKnob
          value={attack}
          label="Attack"
          min={0}
          max={1}
          step={0.01}
          suffix="s"
          onChange={handleAttackChange}
        />

        <CompressorKnob
          value={release}
          label="Release"
          min={0}
          max={1}
          step={0.01}
          suffix="s"
          onChange={handleReleaseChange}
        />

        <CompressorKnob
          value={ratio}
          label="Ratio"
          min={1}
          max={20}
          onChange={handleRatioChange}
        />

        <CompressorKnob
          value={threshold}
          label="Threshold"
          min={-100}
          max={0}
          suffix="db"
          onChange={handleThresholdChange}
        />

        <CompressorKnob
          min={0}
          max={40}
          value={knee}
          label="Knee"
          onChange={handleKneeChange}
        />
      </div>
    </div>
  );
};
