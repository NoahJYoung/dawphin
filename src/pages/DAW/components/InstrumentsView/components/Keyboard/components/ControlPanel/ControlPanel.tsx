import React from "react";
import { observer } from "mobx-react-lite";
import { Button, Slider } from "antd";
import { IoMdVolumeHigh } from "react-icons/io";
import { Knob } from "src/pages/DAW/UIKit";
import { PiWaveSineBold } from "react-icons/pi";
import { FaRegSquare, FaPlus, FaMinus } from "react-icons/fa";
import { BsTriangle } from "react-icons/bs";
import { useAudioEngine } from "src/pages/DAW/hooks";

export const ControlPanel = observer(() => {
  const { keyboard } = useAudioEngine();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        width: 250,
        height: 290,
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
        }}
      >
        <IoMdVolumeHigh style={{ fontSize: "2rem" }} />
        <Slider
          style={{ width: "100%" }}
          min={-50}
          max={0}
          onChange={keyboard.setVolume}
          value={keyboard.volume}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p style={{ margin: 0 }}>Octave</p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Button
            onClick={() => keyboard.setBaseOctave(keyboard.baseOctave - 1)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            type="text"
            icon={<FaMinus />}
          />
          <p>{keyboard.baseOctave}</p>
          <Button
            onClick={() => keyboard.setBaseOctave(keyboard.baseOctave + 1)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            type="text"
            icon={<FaPlus />}
          />
        </div>
      </div>

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
          <BsTriangle style={{ fontSize: "2rem", color: "rgb(125, 0, 250)" }} />
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
    </div>
  );
});
