import { useState } from "react";
import { Button, Input, Slider } from "antd";
import { observer } from "mobx-react-lite";
import { Knob } from "src/pages/DAW/UIKit";
import { MasterMeter } from "./components";
import { EffectsModal } from "../Sidebar/components";

import styles from "./MasterFader.module.scss";

import { FaHeadphonesAlt } from "react-icons/fa";
import { GoMute } from "react-icons/go";
import { useAudioEngine } from "../../hooks";

export const MasterFader = observer(() => {
  const [effectsModalOpen, setEffectsModalOpen] = useState(false);
  const audioEngine = useAudioEngine();
  const { masterControl } = audioEngine;
  const closeEffectsModal = () => {
    setEffectsModalOpen(false);
  };

  const toggleEffectsModal = () => {
    setEffectsModalOpen(!effectsModalOpen);
  };

  return (
    <div
      className={styles.mixer}
      style={{
        width: "120px",
        paddingRight: "5px",
        paddingTop: 0,
      }}
    >
      <div
        style={{
          border: "1px solid #191919",
          background: "#333",
          borderRadius: "6px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          minWidth: "120px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "0.5rem",
            background: "#aaa",
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
            justifyContent: "space-evenly",
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
            <Input
              onChange={() => {}}
              value="Master"
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
                textAlign: "center",
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
              value={0}
              onChange={() => {}}
              min={-100}
              max={100}
              double
              color="rgb(0, 0, 250)"
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.25rem",
              justifyContent: "space-evenly",
              height: "175px",
            }}
          >
            <MasterMeter
              master={masterControl}
              canvasHeight={175}
              canvasWidth={24}
            />
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
              value={masterControl.volume || 0}
              onChange={masterControl.setVolume}
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
                onClick={() => {}}
                type="text"
                icon={
                  <GoMute
                    style={{
                      fontSize: "1.25rem",
                      // color: audioEngine.masterControl.muted ? "red" : "#aaa",
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
                onClick={() => {}}
                type="text"
                icon={
                  <FaHeadphonesAlt
                    style={{
                      fontSize: "1.25rem",
                      // color: track.solo ? "yellow" : "#aaa",
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
          track={masterControl}
          open={effectsModalOpen}
        />
      </div>
    </div>
  );
});
