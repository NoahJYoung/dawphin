import { Dropdown, MenuProps } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { useAudioEngine } from "src/pages/DAW/hooks";

interface TimelineContextMenuProps {
  children: React.ReactNode;
}

export const SidebarContextMenu = observer(
  ({ children }: TimelineContextMenuProps) => {
    const audioEngine = useAudioEngine();
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
