import { DownloadOutlined, EllipsisOutlined } from "@ant-design/icons";
import { LuFileAudio2 } from "react-icons/lu";
import { Dropdown, Button, Menu } from "antd";
import { ChangeEvent, useRef } from "react";
import { Track } from "src/AudioEngine/Track";
import { blobToBuffer } from "src/AudioEngine/helpers";
import * as Tone from "tone";

interface TrackPanelMenuProps {
  track: Track;
}

export const TrackPanelMenu = ({ track }: TrackPanelMenuProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const transport = Tone.getTransport();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      const buffer = await blobToBuffer(selectedFile);
      track.addClip(buffer, transport.seconds);
    }
  };

  const handleLabelClick = () => {
    fileInputRef.current?.click();
  };

  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        icon={<LuFileAudio2 style={{ fontSize: 18 }} />}
        onClick={handleLabelClick}
      >
        <input
          value={""}
          type="file"
          id={`fileInput${track.id}`}
          style={{ display: "none" }}
          accept="audio/*"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <div id={`fileLabel${track.id}`} style={{ display: "inline" }}>
          Add file
        </div>
      </Menu.Item>
      <Menu.Item
        onClick={track.downloadTrackAudio}
        key="2"
        icon={<DownloadOutlined style={{ fontSize: 18 }} />}
        disabled={track.clips.length === 0}
      >
        Download audio
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown dropdownRender={() => menu} trigger={["click"]}>
      <Button
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        icon={<EllipsisOutlined />}
        type="text"
      />
    </Dropdown>
  );
};
