import { observer } from "mobx-react-lite";
import { FaRegSquare } from "react-icons/fa";
import { BsTriangle } from "react-icons/bs";
import { PiWaveSineBold } from "react-icons/pi";
import { Keyboard } from "src/AudioEngine/Keyboard";
import { Knob } from "src/pages/DAW/UIKit";

interface KeyboardSynthControlProps {
  keyboard: Keyboard;
}

export const KeyboardSynthControls = observer(
  ({ keyboard }: KeyboardSynthControlProps) => {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            maxWidth: 350,
            gap: 20,
            padding: 10,
          }}
        >
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <FaRegSquare
              style={{ fontSize: "2rem", color: "rgb(125, 0, 250)" }}
            />
            <Knob
              value={keyboard.squareVolume}
              onChange={keyboard.setSquareVolume}
              color={"rgb(125, 0, 250)"}
              min={-100}
              max={0}
              size={60}
              round
              renderValue={(value) => `${value + 100}`}
              suffix="%"
            />
          </span>

          <span
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <BsTriangle
              style={{ fontSize: "2rem", color: "rgb(125, 0, 250)" }}
            />
            <Knob
              value={keyboard.triangleVolume}
              onChange={keyboard.setTriangleVolume}
              color={"rgb(125, 0, 250)"}
              min={-100}
              max={0}
              size={60}
              round
              renderValue={(value) => `${value + 100}`}
              suffix="%"
            />
          </span>

          <span
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <PiWaveSineBold
              style={{ fontSize: "2rem", color: "rgb(125, 0, 250)" }}
            />
            <Knob
              value={keyboard.sineVolume}
              onChange={keyboard.setSineVolume}
              color="rgb(125, 0, 250)"
              min={-100}
              max={0}
              size={60}
              round
              renderValue={(value) => `${value + 100}`}
              suffix="%"
            />
          </span>
        </div>
      </>
    );
  }
);
