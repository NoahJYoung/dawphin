import React from "react";
import { Button, Input, Slider } from "antd";
import { observer } from "mobx-react-lite";
import { Track } from "src/AudioEngine/Track";
import { Knob } from "src/pages/DAW/UIKit";
import { Meter } from "./components";
import { RecordIcon } from "src/pages/DAW/icons";

import styles from "./ChannelStrip.module.scss";
interface ChannelStripProps {
  track: Track;
  trackNumber: number;
}

export const ChannelStrip = observer(({ track }: ChannelStripProps) => {
  const handleSelect = (e: React.MouseEvent) => {
    const audioEngine = track.audioEngine;
    if (!e.ctrlKey) {
      audioEngine.deselectAllTracks();
    }
    track.select();
  };

  const activeOuterRgb = "rgb(200, 0, 0)";
  const inactiveOuterRgb = "rgb(150, 0, 0)";
  const activeInnerRgb = "rgb(250, 100, 100)";
  const inactiveInnerRgb = "rgb(200, 100, 100)";
  return (
    <div
      onClick={handleSelect}
      style={{
        border: track.selected
          ? `1px solid ${track.color}`
          : "1px solid #191919",
        background: "#333",
        borderRadius: "6px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "0.5rem",
          background: track.color,
          borderTopRightRadius: "6px",
          borderTopLeftRadius: "6px",
          display: "flex",
          justifyContent: "center",
        }}
      />
      <div
        style={{
          padding: "0.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            gap: "4px",
          }}
        >
          <Button
            icon={
              <RecordIcon
                width={35}
                height={35}
                color={track.active ? activeOuterRgb : inactiveOuterRgb}
                innerColor={track.active ? activeInnerRgb : inactiveInnerRgb}
              />
            }
            onClick={track.toggleActive}
            style={{
              background: "transparent",
              marginLeft: "5px",
              border: "none",
              width: 35,
              height: 35,
              padding: 0,
              borderRadius: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />

          <Input
            onChange={(e) => track.setName(e.target.value)}
            value={track.name}
            style={{
              display: "flex",
              background: "transparent",
              color: "#aaa",
              border: "none",
              outline: "none",
              alignItems: "center",
              height: "1.5rem",
              width: "70px",
              padding: "0.25rem",
              fontFamily: "Inter",
              textOverflow: "ellipsis",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            gap: "20px",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Knob
            size={40}
            value={track.pan || 0}
            onChange={track.setPan}
            min={-100}
            max={100}
            double
            color="rgb(0, 0, 250)"
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: "2px",
            justifyContent: "space-evenly",
            height: "175px",
          }}
        >
          <Meter track={track} canvasHeight={175} canvasWidth={30} />
          <Slider
            className={styles.slider}
            min={-51}
            max={6}
            style={{
              height: "145px",
              position: "relative",
              marginTop: "10px",
              marginBottom: "10px",
            }}
            vertical
            value={track.volume || 0}
            onChange={track.setVolume}
            handleStyle={{
              width: "30px",
              height: "15px",
              background: "radial-gradient(#bbb, #777)",
              borderRadius: "4px",
              position: "absolute",
              left: "-8px",
              zIndex: "1000",
            }}
            railStyle={{
              background: "#111",
            }}
            trackStyle={{
              background: "#111",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <Button
              onClick={() => {
                track.toggleMute();
              }}
              type="text"
              style={{
                width: "1.5rem",
                height: "1.5rem",
                borderRadius: "6px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: `1px solid ${track.muted ? "red" : "#aaa"}`,
                color: track.muted ? "red" : "#aaa",
                padding: 0,
                paddingTop: 1,
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
            >
              M
            </Button>
            <Button
              onClick={() => {}}
              type="text"
              style={{
                width: "1.5rem",
                height: "1.5rem",
                borderRadius: "6px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: `1px solid ${track.solo ? "yellow" : "#aaa"}`,
                color: track.solo ? "yellow" : "#aaa",
                padding: 0,
                paddingTop: 1,
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
            >
              <p>S</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
