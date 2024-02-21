import { useCallback, useEffect, useState } from "react";

interface LogSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const LogSlider = ({
  min,
  max,
  value,
  onChange,
  disabled,
}: LogSliderProps) => {
  const minLog = Math.log(min);
  const maxLog = Math.log(max);
  const scale = (maxLog - minLog) / 100;

  const valueToSlider = useCallback(
    (value: number) => {
      return (Math.log(value) - minLog) / scale;
    },
    [minLog, scale]
  );

  const sliderToValue = (sliderValue: number) => {
    return Math.exp(minLog + scale * sliderValue);
  };

  const [sliderValue, setSliderValue] = useState(valueToSlider(value));

  useEffect(() => {
    setSliderValue(valueToSlider(value));
  }, [value, minLog, maxLog, scale, valueToSlider]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setSliderValue(newValue);
    const logValue = parseFloat(sliderToValue(newValue).toFixed(2));

    onChange(logValue);
  };

  return (
    <input
      type="range"
      min="0"
      max="100"
      value={sliderValue}
      onChange={handleSliderChange}
      disabled={disabled}
    />
  );
};
