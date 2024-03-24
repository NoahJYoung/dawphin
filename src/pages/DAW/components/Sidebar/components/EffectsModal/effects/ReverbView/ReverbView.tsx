import { Button } from "antd";
import { observer } from "mobx-react-lite";
import { Reverb } from "src/AudioEngine/Effects";
import { Knob } from "src/pages/DAW/UIKit";

interface ReverbViewProps {
  reverb: Reverb;
}

export const ReverbView = observer(({ reverb }: ReverbViewProps) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <Button
            onClick={reverb.toggleActiveConvolver}
            style={{
              height: "3rem",
              width: "6rem",
              fontSize: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: reverb.activeConvolverIndex === 0 ? 1 : 0.5,
            }}
          >
            Plate
          </Button>
          <Button
            onClick={reverb.toggleActiveConvolver}
            style={{
              height: "3rem",
              width: "6rem",
              fontSize: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: reverb.activeConvolverIndex === 1 ? 1 : 0.5,
            }}
          >
            Hall
          </Button>
        </div>
        <span
          style={{
            position: "relative",
            width: 160,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Knob
            size={120}
            value={reverb.wet}
            min={0}
            max={1}
            color="rgb(125, 0, 250)"
            step={0.01}
            onChange={reverb.setWet}
            renderValue={(value) => `${Math.round(value * 100)}%`}
          />
          <p style={{ position: "absolute", top: "100%", left: 0 }}>Dry</p>
          <p style={{ position: "absolute", top: "100%", right: 0 }}>Wet</p>
        </span>
      </div>
    </div>
  );
});
