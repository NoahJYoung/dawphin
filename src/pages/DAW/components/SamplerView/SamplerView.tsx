import { samplePads } from "./helpers";
import { Pad, PadVolumeSlider } from "./components";
import { useAudioEngine } from "../../hooks";

import styles from "./SamplerView.module.scss";

export const SamplerView = () => {
  const audioEngine = useAudioEngine();
  return (
    <div className={styles.container}>
      <div className={styles.sampler}>
        {samplePads.map((padNumber) => (
          <Pad
            key={padNumber}
            padNumber={padNumber}
            pad={audioEngine.sampler.pads[padNumber]}
          />
        ))}
      </div>
      <div className={styles.volumeSliders}>
        {[...samplePads].sort().map((padNumber) => (
          <PadVolumeSlider key={padNumber} padNumber={padNumber} />
        ))}
      </div>
    </div>
  );
};
