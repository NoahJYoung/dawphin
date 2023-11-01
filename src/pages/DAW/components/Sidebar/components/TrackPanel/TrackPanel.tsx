import { observer } from "mobx-react-lite";
import { Track } from "src/AudioEngine/Track";
import { Button, ColorPicker, InputRef } from "antd";
import { Input } from "antd";
import type { AudioEngine } from "src/AudioEngine";
import { CLIP_HEIGHT, TRACK_PANEL_FULL_WIDTH } from "src/pages/DAW/constants";
import { RecordIcon } from "src/pages/DAW/icons";
import { TrackPanelMenu } from "./components";
import { useRef } from "react";
import { FaHeadphonesAlt } from "react-icons/fa";
import { GoMute } from "react-icons/go";
import { Color } from "antd/es/color-picker";

export const TrackPanel = observer(
  ({
    track,
    audioEngine,
    expanded,
  }: {
    track: Track;
    trackNumber: number;
    audioEngine: AudioEngine;
    expanded: boolean;
  }) => {
    const inputRef = useRef<InputRef | null>(null);

    const handleMute = () => {
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

    const handleSolo = () => {
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

    const handleClick = (e: React.MouseEvent) => {
      if (!e.ctrlKey) {
        audioEngine.deselectAllTracks();
      }
      track.select();
      audioEngine.getSelectedTracks();
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
      if (!e.ctrlKey) {
        audioEngine.deselectClips();
      }
      track.selectAllClips();
    };

    const handlePressEnter = () => {
      if (inputRef.current) {
        inputRef.current.blur();
      }
    };

    const handleColorChange = (color: Color) => {
      const r = color.toRgb().r;
      const g = color.toRgb().g;
      const b = color.toRgb().b;
      if (track.selected) {
        audioEngine.setSelectedTracksColor(`rgb(${r},${g},${b})`);
      } else {
        track.setColor(`rgb(${r},${g},${b})`);
      }
    };

    const activeOuterRgb = "rgb(200, 0, 0)";
    const inactiveOuterRgb = "rgb(150, 0, 0)";
    const activeInnerRgb = "rgb(250, 100, 100)";
    const inactiveInnerRgb = "rgb(200, 100, 100)";

    return (
      <div
        style={{
          border: track.selected
            ? `1px solid ${track.color}`
            : "1px solid #191919",
          borderRadius: "6px",
          display: "flex",
          width: TRACK_PANEL_FULL_WIDTH,
          height: CLIP_HEIGHT,
          background: "#333",
          opacity: track.muted ? 0.5 : 1,
        }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        <div
          style={{
            width: "0.75rem",
            background: track.color,
            borderTopLeftRadius: "6px",
            borderBottomLeftRadius: "6px",
            display: "flex",
            justifyContent: "center",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "4px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "fit-content",
              position: "relative",
            }}
          >
            <Button
              icon={
                <RecordIcon
                  width={30}
                  height={30}
                  color={track.active ? activeOuterRgb : inactiveOuterRgb}
                  innerColor={track.active ? activeInnerRgb : inactiveInnerRgb}
                />
              }
              onClick={track.toggleActive}
              style={{
                background: "transparent",
                border: "none",
                width: 35,
                height: 35,
                padding: 0,
                borderRadius: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            />
            <Input
              onChange={(e) => track.setName(e.target.value)}
              ref={inputRef}
              value={track.name}
              onPressEnter={handlePressEnter}
              style={{
                display: "flex",
                background: "transparent",
                color: "#aaa",
                border: "none",
                outline: "none",
                alignItems: "center",
                height: "1.5rem",
                width: "8rem",
                padding: "0.25rem",
                fontFamily: "Inter",
                textOverflow: "ellipsis",
              }}
            />

            <ColorPicker
              size={"small"}
              format="rgb"
              style={{
                background: "transparent",
                border: "none",
                maxWidth: "100%",
              }}
              disabledAlpha
              value={track.color}
              onChange={handleColorChange}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TrackPanelMenu track={track} />
            <div
              style={{
                display: expanded ? "flex" : "none",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              <Button
                onClick={handleMute}
                type="text"
                icon={
                  <GoMute
                    style={{
                      fontSize: "1.25rem",
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
            </div>
          </div>
        </div>
      </div>
    );
  }
);
