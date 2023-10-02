import {
  DownloadOutlined,
  EllipsisOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import { Dropdown, Button, Menu } from "antd";
import { ChangeEvent, useRef } from "react";
import { Track } from "src/AudioEngine/Track";
import * as Tone from "tone";

interface TrackPanelMenuProps {
  track: Track;
}

export const TrackPanelMenu = ({ track }: TrackPanelMenuProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const transport = Tone.getTransport();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      const src = URL.createObjectURL(selectedFile);
      track.addClip(src, transport.seconds);
    }
  };

  const handleLabelClick = () => {
    fileInputRef.current?.click();
  };

  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        icon={<FolderOpenOutlined />}
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
      <Menu.Item key="2" icon={<DownloadOutlined />}>
        Download track
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown dropdownRender={() => menu} trigger={["click"]}>
      <Button icon={<EllipsisOutlined />} type="text" />
    </Dropdown>
  );
};
