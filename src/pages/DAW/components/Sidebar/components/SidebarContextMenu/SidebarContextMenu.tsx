import { Dropdown, MenuProps } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { AudioEngine } from "src/AudioEngine";
import { observer } from "mobx-react-lite";

interface TimelineContextMenuProps {
  children: React.ReactNode;
  audioEngine: AudioEngine;
}

export const SidebarContextMenu = observer(
  ({ children, audioEngine }: TimelineContextMenuProps) => {
    const items: MenuProps["items"] = [
      {
        key: "1",
        onClick: audioEngine.createTrack,
        label: "New track",
        icon: <PlusOutlined />,
      },
      {
        key: "2",
        onClick: audioEngine.deleteSelectedTracks,
        label: "Delete selected tracks",
        icon: <DeleteOutlined />,
      },
    ];

    return (
      <Dropdown menu={{ items }} trigger={["contextMenu"]}>
        {children}
      </Dropdown>
    );
  }
);
