import { useState } from "react";
import { Button, Input, Slider } from "antd";
import { observer } from "mobx-react-lite";
import { Knob } from "src/pages/DAW/UIKit";
import { MasterMeter } from "./components";
import { EffectsModal } from "../Sidebar/components";

import styles from "./MasterFader.module.scss";
import { MasterControl } from "src/AudioEngine/MasterControl";
import { AudioEngine } from "src/AudioEngine";
interface MasterFaderProps {
  masterControl: MasterControl;
  audioEngine: AudioEngine;
}

export const MasterFader = observer(
  ({ masterControl, audioEngine }: MasterFaderProps) => {
    const [effectsModalOpen, setEffectsModalOpen] = useState(false);

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
          height: "300px",
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
            maxHeight: "310px",
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
                style={{ display: "flex", flexDirection: "column", gap: "5px" }}
              >
                <Button
                  onClick={() => {
                    // masterControl.toggleMute();
                  }}
                  type="text"
                  style={{
                    width: "1.5rem",
                    height: "1.5rem",
                    borderRadius: "6px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: `1px solid #aaa`,
                    color: "#aaa",
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
                    border: `1px solid #aaa`,
                    color: "#aaa",
                    padding: 0,
                    paddingTop: 1,
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                  }}
                >
                  <p>S</p>
                </Button>

                <Button
                  onClick={toggleEffectsModal}
                  type="text"
                  style={{
                    width: "1.5rem",
                    height: "1.5rem",
                    borderRadius: "6px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: `1px solid #aaa`,
                    color: "#aaa",
                    padding: 0,
                    paddingTop: 1,
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                  }}
                >
                  <p>FX</p>
                </Button>
              </div>
            </div>
          </div>
          <EffectsModal
            onCancel={closeEffectsModal}
            track={masterControl}
            open={effectsModalOpen}
            audioEngine={audioEngine}
          />
        </div>
      </div>
    );
  }
);
