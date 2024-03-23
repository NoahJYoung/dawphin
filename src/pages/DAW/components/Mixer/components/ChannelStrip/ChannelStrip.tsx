import React, { useRef, useState } from "react";
import { Button, Input, InputRef, Slider, Tooltip } from "antd";
import { observer } from "mobx-react-lite";
import { Track } from "src/AudioEngine/Track";
import { Knob } from "src/pages/DAW/UIKit";
import { Meter } from "./components";
import { PiPianoKeysFill, PiWaveformBold } from "react-icons/pi";
import { GoMute } from "react-icons/go";
import { RecordIcon } from "src/pages/DAW/icons";
import { FaHeadphonesAlt } from "react-icons/fa";
import { EffectsModal } from "../../../Sidebar/components";
import { AudioOutlined } from "@ant-design/icons";
import { useAudioEngine } from "src/pages/DAW/hooks";

import styles from "./ChannelStrip.module.scss";

interface ChannelStripProps {
  track: Track;
  trackNumber: number;
}

export const ChannelStrip = observer(({ track }: ChannelStripProps) => {
  const [effectsModalOpen, setEffectsModalOpen] = useState(false);
  const inputRef = useRef<InputRef | null>(null);
  const audioEngine = useAudioEngine();

  const closeEffectsModal = () => {
    setEffectsModalOpen(false);
  };

  const toggleEffectsModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEffectsModalOpen(!effectsModalOpen);
  };

  const handleSelect = (e: React.MouseEvent) => {
    if (!e.ctrlKey) {
      audioEngine.deselectAllTracks();
    }
    track.select();
  };

  const handleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (track.selected) {
      if (track.muted) {
        audioEngine.unmuteSelectedTracks();
      } else {
        audioEngine.muteSelectedTracks();
      }
    } else {
      track.muted ? track.setMuted(false) : track.setMuted(true);
    }
  };

  const handleSolo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (track.selected) {
      if (track.solo) {
        audioEngine.unsoloSelectedTracks();
      } else {
        audioEngine.soloSelectedTracks();
        audioEngine.muteUnsoloedTracks();
      }
    } else {
      if (track.solo) {
        track.setSolo(false);
      } else {
        track.setSolo(true);
        audioEngine.muteUnsoloedTracks();
      }
    }
  };

  const handlePressEnter = () => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const activeOuterRgb = "rgb(200, 0, 0)";
  const inactiveOuterRgb = "rgb(150, 0, 0)";
  const activeInnerRgb = "rgb(250, 100, 100)";
  const inactiveInnerRgb = "rgb(200, 100, 100)";

  const activeInputStyles = {
    color: track.color,
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div
      onClick={handleSelect}
      style={{
        border: track.selected
          ? `2px solid ${track.color}`
          : "2px solid #191919",
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
            onClick={(e) => {
              e.stopPropagation();
              track.toggleActive();
            }}
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
            ref={inputRef}
            onChange={(e) => track.setName(e.target.value)}
            onPressEnter={handlePressEnter}
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
            renderValue={(value) => `${Math.abs(value)}`}
            suffix="%"
            round
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Tooltip mouseEnterDelay={0.75} title="Microphone">
            <Button
              style={
                track.inputMode === "mic"
                  ? activeInputStyles
                  : {
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }
              }
              onClick={(e) => {
                e.stopPropagation();
                track.setInputMode("mic");
              }}
              icon={<AudioOutlined style={{ fontSize: "1.3rem" }} />}
              type="text"
            />
          </Tooltip>

          <Tooltip mouseEnterDelay={0.75} title="Keyboard">
            <Button
              style={
                track.inputMode === "keyboard"
                  ? activeInputStyles
                  : {
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }
              }
              onClick={(e) => {
                e.stopPropagation();
                track.setInputMode("keyboard");
              }}
              type="text"
              icon={
                <PiPianoKeysFill
                  style={{
                    fontSize: "1.8rem",
                    color:
                      track.inputMode === "keyboard" ? track.color : "#aaa",
                  }}
                />
              }
            />
          </Tooltip>
          <Tooltip mouseEnterDelay={0.75} title="Sample pad">
            <Button
              style={
                track.inputMode === "sampler"
                  ? activeInputStyles
                  : {
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }
              }
              onClick={(e) => {
                e.stopPropagation();
                track.setInputMode("sampler");
              }}
              type="text"
              icon={
                <PiWaveformBold
                  style={{
                    fontSize: "1.6rem",
                    color: track.inputMode === "sampler" ? track.color : "#aaa",
                  }}
                />
              }
            />
          </Tooltip>
        </div>
        <div
          style={{
            display: "flex",
            gap: "2px",
            justifyContent: "space-evenly",
            height: "175px",
          }}
        >
          <Meter track={track} canvasHeight={175} canvasWidth={24} />
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            <Button
              onClick={handleMute}
              type="text"
              icon={
                <GoMute
                  style={{
                    fontSize: "1.4rem",
                    color: track.muted ? "red" : "#aaa",
                  }}
                />
              }
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            />

            <Button
              onClick={handleSolo}
              type="text"
              icon={
                <FaHeadphonesAlt
                  style={{
                    fontSize: "1.25rem",
                    color: track.solo ? "yellow" : "#aaa",
                  }}
                />
              }
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            />

            <Button
              onClick={toggleEffectsModal}
              type="text"
              style={{
                width: "2rem",
                height: "2rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              FX
            </Button>
          </div>
        </div>
      </div>
      <EffectsModal
        onCancel={closeEffectsModal}
        track={track}
        open={effectsModalOpen}
      />
    </div>
  );
});
