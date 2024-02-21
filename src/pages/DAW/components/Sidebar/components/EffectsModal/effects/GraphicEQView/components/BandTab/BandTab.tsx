import { Band } from "src/AudioEngine/Effects/Equalizer/Band";
import { Slider } from "src/pages/DAW/UIKit";

interface BandTabProps {
  band: Band;
}

export const BandTab = ({ band }: BandTabProps) => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        paddingLeft: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: 10,
          width: "100%",
          gap: "5px",
        }}
      >
        <Slider
          logarithmic
          min={20}
          max={20000}
          value={band.hertz}
          onChange={band.setHertz}
          suffix="Hz"
          showValue
          label="Frequency"
        />

        <Slider
          min={-12}
          max={12}
          step={0.1}
          value={band.gain}
          onChange={band.setGain}
          suffix="Db"
          showValue
          label="Gain"
          disabled={band.type === "highpass"}
        />

        <Slider
          logarithmic
          min={0.1}
          max={20}
          value={band.Q}
          onChange={band.setQ}
          showValue
          label="Q"
          disabled={band.type !== "peaking"}
        />
      </div>
    </div>
  );
};
