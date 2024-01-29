import { observer } from "mobx-react-lite";
import { Button, Select, Slider } from "antd";
import { IoMdVolumeHigh } from "react-icons/io";
import { IoMusicalNoteSharp } from "react-icons/io5";

import { useAudioEngine } from "src/pages/DAW/hooks";
import { KeyboardSynthControls } from "./components";
import { FaMinus, FaPlus } from "react-icons/fa";

export const ControlPanel = observer(() => {
  const { keyboard } = useAudioEngine();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: 250,
        height: 290,
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
        }}
      >
        <IoMdVolumeHigh style={{ fontSize: "2rem" }} />
        <Slider
          style={{ width: "100%" }}
          min={-50}
          max={0}
          onChange={keyboard.setVolume}
          value={keyboard.volume}
          handleStyle={{
            width: "15px",
            height: "30px",
            background: "radial-gradient(#bbb, #777)",
            borderRadius: "4px",
            position: "absolute",
            top: "-7px",
            zIndex: "1000",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p style={{ margin: 0 }}>Octave</p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Button
            onClick={() => keyboard.setBaseOctave(keyboard.baseOctave - 1)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            type="text"
            icon={<FaMinus />}
          />
          <p>{keyboard.baseOctave}</p>
          <Button
            onClick={() => keyboard.setBaseOctave(keyboard.baseOctave + 1)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            type="text"
            icon={<FaPlus />}
          />
        </div>
      </div>
      <Select
        value={keyboard.mode}
        onChange={keyboard.setKeyboardMode}
        options={[
          { label: "Synthesizer", value: "synth" },
          { label: "Sampler", value: "sampler" },
        ]}
      />

      {keyboard.mode === "synth" ? (
        <KeyboardSynthControls keyboard={keyboard} />
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
          }}
        >
          <IoMusicalNoteSharp style={{ fontSize: 30 }} />
          <Select
            value={keyboard.baseUrl}
            onChange={keyboard.setSamplerBaseUrl}
            options={[{ label: "Piano", value: "src/assets/sounds/keys/" }]}
            style={{ width: "100%" }}
          />
        </div>
      )}
    </div>
  );
});
