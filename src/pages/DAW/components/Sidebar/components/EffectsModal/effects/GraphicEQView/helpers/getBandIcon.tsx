import { Band } from "src/AudioEngine/Effects/GraphicEQ/Band";
import {
  PeakingFilterIcon,
  HighPassFilterIcon,
  HighShelfFilterIcon,
} from "src/pages/DAW/icons";

export const getBandIcon = (
  band: Band,
  index: number,
  selectedBandId: string
) => {
  const selected = band.id === selectedBandId;
  const neutralColor = "#888";
  const selectedColor = "rgba(125, 0, 250)";
  const typeToLabelMap: Partial<Record<BiquadFilterType, JSX.Element>> = {
    peaking: (
      <PeakingFilterIcon
        color={selected ? selectedColor : neutralColor}
        number={index}
        size={28}
      />
    ),
    highpass: (
      <HighPassFilterIcon
        color={selected ? selectedColor : neutralColor}
        size={28}
      />
    ),
    highshelf: (
      <HighShelfFilterIcon
        color={selected ? selectedColor : neutralColor}
        size={28}
      />
    ),
  };

  return typeToLabelMap[band.type];
};
