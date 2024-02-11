interface LinearSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  decimalPlaces?: number;
}
export const LinearSlider = ({
  min,
  max,
  value,
  onChange,
  step = 1,
}: LinearSliderProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onChange(value);
  };
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={handleChange}
    />
  );
};
