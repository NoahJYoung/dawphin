import React from "react";
import {
  EllipsisOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { observer } from "mobx-react-lite";
import { AudioEngine } from "src/AudioEngine";
import { PauseIcon, PlayIcon, RecordIcon, StopIcon } from "src/pages/DAW/icons";
import * as Tone from "tone";

import styles from "./TransportControls.module.scss";

interface TransportControlsProps {
  audioEngine: AudioEngine;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const TransportControls = observer(
  ({ audioEngine, containerRef }: TransportControlsProps) => {
    const handleZoomIn = () => {
      audioEngine.setZoom("zoomIn");
      if (
        containerRef.current?.scrollLeft ||
        containerRef.current?.scrollLeft === 0
      ) {
        const transportPos =
          (Tone.getTransport().seconds * Tone.getContext().sampleRate) /
          audioEngine.samplesPerPixel;
        const offset = containerRef.current.clientWidth / 2;
        containerRef.current.scrollLeft = transportPos - offset;
      }
    };

    const handleZoomOut = () => {
      audioEngine.setZoom("zoomOut");
      if (containerRef.current?.scrollLeft) {
        if (
          containerRef.current?.scrollLeft ||
          containerRef.current?.scrollLeft === 0
        ) {
          const transportPos =
            (Tone.getTransport().seconds * Tone.getContext().sampleRate) /
            audioEngine.samplesPerPixel;
          const offset = containerRef.current.clientWidth / 2;
          containerRef.current.scrollLeft = transportPos - offset;
        }
      }
    };
    return (
      <div className={styles.transport}>
        <Button
          className={styles.transportButton}
          icon={
            <StepBackwardOutlined
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            />
          }
          onClick={audioEngine.toStart}
        />
        <Button
          style={{
            border:
              audioEngine.state === "stopped"
                ? "1px solid rgb(175, 175, 175)"
                : "none",
          }}
          className={styles.transportButton}
          icon={
            <StopIcon color={"rgb(175, 175, 175)"} height={20} width={20} />
          }
          onClick={audioEngine.stop}
        />
        <Button
          style={{
            border:
              audioEngine.state === "playing" ? "1px solid green" : "none",
          }}
          className={styles.transportButton}
          icon={
            <PlayIcon
              color={
                audioEngine.state === "playing" ? "rgb(0, 250, 0)" : "#aaa"
              }
              height={20}
              width={20}
            />
          }
          onClick={audioEngine.play}
        />
        <Button
          style={{
            border: audioEngine.state === "paused" ? "1px solid blue" : "none",
          }}
          className={styles.transportButton}
          icon={
            <PauseIcon
              color={audioEngine.state === "paused" ? "rgb(0, 0, 250)" : "#aaa"}
              height={20}
              width={20}
            />
          }
          onClick={audioEngine.pause}
        />
        <Button
          className={styles.transportButton}
          icon={
            <StepForwardOutlined
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            />
          }
          onClick={audioEngine.toEnd}
        />
        <Button
          style={{
            border:
              audioEngine.state === "recording" ? "1px solid red" : "none",
          }}
          className={styles.transportButton}
          icon={
            <RecordIcon
              width={32}
              height={32}
              color={
                audioEngine.state === "recording"
                  ? "rgb(200, 0, 0)"
                  : "rgb(150, 50, 50)"
              }
              innerColor={
                audioEngine.state === '"recording'
                  ? "rgb(250, 125, 125)"
                  : "rgb(200, 125, 125)"
              }
            />
          }
          onClick={audioEngine.record}
        />

        <Button
          className={styles.zoomControl}
          icon={
            <ZoomOutOutlined
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            />
          }
          onClick={handleZoomOut}
        />

        <Button
          className={styles.zoomControl}
          icon={
            <ZoomInOutlined
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            />
          }
          onClick={handleZoomIn}
        />

        <Button
          className={styles.elipsis}
          icon={
            <EllipsisOutlined
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            />
          }
          onClick={() => alert("Project Settings Modal")}
        />
      </div>
    );
  }
);
