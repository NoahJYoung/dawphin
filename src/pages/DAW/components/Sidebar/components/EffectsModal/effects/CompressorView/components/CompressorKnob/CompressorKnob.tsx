import { Knob } from "src/pages/DAW/UIKit";

const knobContainerStyles: any = {
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
  alignItems: "center",
  justifyContent: "center",
};

interface CompressorKnobProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

export const CompressorKnob = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix,
}: CompressorKnobProps) => {
  return (
    <span style={knobContainerStyles}>
      <label>{label}</label>
      <Knob
        color={"rgb(125, 0, 250)"}
        size={48}
        min={min}
        max={max}
        onChange={onChange}
        value={value}
        step={step}
        suffix={suffix}
      />
    </span>
  );
};
