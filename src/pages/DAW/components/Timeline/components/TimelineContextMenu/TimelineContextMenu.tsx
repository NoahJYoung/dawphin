import { Dropdown, MenuProps } from "antd";
import {
  SplitCellsOutlined,
  DeleteOutlined,
  CopyOutlined,
  SnippetsOutlined,
  RiseOutlined,
  FallOutlined,
  ArrowRightOutlined,
  MergeCellsOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import * as Tone from "tone";
import { FadeModal } from "../FadeModal";
import { useAudioEngine } from "src/pages/DAW/hooks";

interface TimelineContextMenuProps {
  children: React.ReactNode;
}

export const TimelineContextMenu = observer(
  ({ children }: TimelineContextMenuProps) => {
    const [fadeModalOpen, setFadeModalOpen] = useState(false);
    const audioEngine = useAudioEngine();

    const openFadeModal = () => setFadeModalOpen(true);
    const closeFadeModal = () => setFadeModalOpen(false);

    // const canCopy = useMemo(() => {
    //   if (audioEngine.selectedClips.length > 0) {
    //     return audioEngine.selectedClips.every(
    //       (selectedClip) =>
    //         selectedClip.track.id === audioEngine.selectedClips[0].track.id
    //     );
    //   }
    //   return false;
    // }, [audioEngine.selectedClips.length]);

    // const canPaste = audioEngine.clipboard.length > 0;

    // const hasSelectedClips = audioEngine.selectedClips.length;

    const cursorPositionSamples = Tone.Time(
      Tone.getTransport().seconds
    ).toSamples();

    const items: MenuProps["items"] = [
      {
        key: "1",
        onClick: audioEngine.copyClips,
        label: "Copy",
        // disabled: !canCopy || !hasSelectedClips,
        icon: <CopyOutlined />,
      },
      {
        key: "2",
        onClick: audioEngine.pasteClips,
        label: "Paste",
        // disabled: !canPaste,
        icon: <SnippetsOutlined />,
      },
      { type: "divider" },
      {
        key: "3",
        onClick: audioEngine.deleteSelectedClips,
        // disabled: !hasSelectedClips,
        label: "Delete",
        icon: <DeleteOutlined />,
      },
      {
        key: "4",
        onClick: audioEngine.splitSelectedClipsAtPlayhead,
        label: "Split",
        // disabled: !hasSelectedClips,
        icon: <SplitCellsOutlined />,
      },
      {
        key: "5",
        onClick: audioEngine.joinSelectedClips,
        label: "Join",
        // disabled: !hasSelectedClips,
        icon: <MergeCellsOutlined />,
      },
      { type: "divider" },
      {
        key: "6",
        onClick: () => audioEngine.setNormalized(true),
        label: "Normalize",
        // disabled: !hasSelectedClips,
        icon: <RiseOutlined />,
      },
      {
        key: "7",
        onClick: () => audioEngine.setNormalized(false),
        label: "Denormalize",
        // disabled: !hasSelectedClips,
        icon: <FallOutlined />,
      },
      { type: "divider" },
      {
        key: "8",
        onClick: () =>
          audioEngine.selectedClips[0].setPosition(cursorPositionSamples),
        label: "Move to cursor",
        // disabled: audioEngine.selectedClips.length !== 1,
        icon: <ArrowRightOutlined />,
      },
    ];

    return (
      <>
        <Dropdown menu={{ items }} trigger={["contextMenu"]}>
          {children}
        </Dropdown>
        <FadeModal open={fadeModalOpen} />
      </>
    );
  }
);
