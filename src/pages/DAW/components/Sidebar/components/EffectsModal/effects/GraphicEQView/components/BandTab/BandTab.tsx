import { Band } from "src/AudioEngine/Effects/Equalizer/Band";
import { Knob } from "src/pages/DAW/UIKit";

interface BandTabProps {
  band: Band;
}

export const BandTab = ({ band }: BandTabProps) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
      }}
    >
      <Knob
        min={20}
        max={20000}
        step={1}
        size={60}
        value={band.hertz}
        suffix=" hz"
        onChange={band.setHertz}
        round
      />

      <Knob
        double
        min={-12}
        max={12}
        step={0.025}
        size={60}
        value={band.gain}
        suffix=" Db"
        onChange={band.setGain}
      />

      <Knob
        min={0.2}
        max={20}
        step={0.1}
        size={60}
        value={band.Q}
        onChange={band.setQ}
      />
    </div>
  );
};
