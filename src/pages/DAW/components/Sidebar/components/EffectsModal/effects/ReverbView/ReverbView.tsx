import { observer } from "mobx-react-lite";
import { Reverb } from "src/AudioEngine/Effects";
import { Knob } from "src/pages/DAW/UIKit";

interface ReverbViewProps {
  reverb: Reverb;
}

export const ReverbView = observer(({ reverb }: ReverbViewProps) => {
  console.log(reverb);
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        gap: "1rem",
        justifyContent: "space-evenly",
      }}
    >
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <p>Pre delay</p>
        <Knob
          min={0}
          size={50}
          max={2}
          step={0.1}
          value={reverb.preDelay.valueOf()}
          onChange={(value) => reverb.set({ preDelay: value })}
        />
      </span>

      <span
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <p>Decay</p>
        <Knob
          min={0.01}
          max={2}
          size={50}
          step={0.01}
          value={reverb.decay.valueOf()}
          onChange={(value) => reverb.set({ decay: value })}
        />
      </span>

      <span
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <p>Wet</p>
        <Knob
          min={0}
          max={1}
          size={50}
          step={0.1}
          value={reverb.wet.valueOf()}
          onChange={(value) => reverb.set({ wet: value })}
        />
      </span>
    </div>
  );
});
