import { observer } from "mobx-react-lite";
import { LogSlider, LinearSlider } from "./components/";
import styles from "./Slider.module.scss";

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  logarithmic?: boolean;
  step?: number;
  vertical?: boolean;
  suffix?: string;
  showValue?: boolean;
  label?: string;
  disabled?: boolean;
}

export const Slider = observer(
  ({
    min,
    max,
    value,
    onChange,
    logarithmic,
    step,
    vertical,
    suffix,
    showValue,
    label,
    disabled,
  }: SliderProps) => {
    return (
      <div
        className={`${styles.sliderContainer} ${
          vertical ? styles.vertical : styles.horizontal
        }`}
      >
        {label && <p style={{ opacity: disabled ? 0.5 : 1 }}>{label}</p>}
        <div className={styles.sliderContainerInner}>
          {logarithmic ? (
            <LogSlider
              min={min}
              max={max}
              value={value}
              onChange={onChange}
              disabled={disabled}
            />
          ) : (
            <LinearSlider
              min={min}
              max={max}
              value={value}
              onChange={onChange}
              step={step}
              disabled={disabled}
            />
          )}
          {showValue && (
            <p style={{ opacity: disabled ? 0.5 : 1 }}>{`${value} ${
              suffix ? suffix : ""
            }`}</p>
          )}
        </div>
      </div>
    );
  }
);
