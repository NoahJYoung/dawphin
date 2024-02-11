import { Dropdown } from "antd";
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
import { PiWaveformBold } from "react-icons/pi";
import { bufferToWav } from "src/AudioEngine/helpers";
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";

interface TimelineContextMenuProps {
  children: React.ReactNode;
}

export const TimelineContextMenu = observer(
  ({ children }: TimelineContextMenuProps) => {
    const [fadeModalOpen] = useState(false);
    const audioEngine = useAudioEngine();

    // const openFadeModal = () => setFadeModalOpen(true);
    // const closeFadeModal = () => setFadeModalOpen(false);

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

    const items: ItemType<MenuItemType>[] = [
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
        label: "Join",
        // disabled: !hasSelectedClips,
        icon: <MergeCellsOutlined />,
        children: [
          {
            key: "5-1",
            onClick: () => audioEngine.joinSelectedClips(),
            label: "With fades",
          },
          {
            key: "5-2",
            onClick: () => audioEngine.joinSelectedClips({ noFade: true }),
            label: "Without fades",
          },
        ],
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
        onClick: () => {
          const [selectedClip] = audioEngine.selectedClips;
          selectedClip.setPosition(cursorPositionSamples);
        },
        label: "Move to cursor",
        // disabled: audioEngine.selectedClips.length !== 1,
        icon: <ArrowRightOutlined />,
      },
      {
        key: "9",

        label: "Send to sampler",
        disabled: audioEngine.selectedClips.length !== 1,
        children: Array.from(Array(10).keys())
          .slice(1, 10)
          .map((num) => ({
            key: `9-${num}`,
            label: `Pad ${num}`,
            onClick: async () => {
              const bufferWithFades =
                await audioEngine.selectedClips[0].getBufferWithFades();
              audioEngine.sampler.loadAudio(num, bufferToWav(bufferWithFades));
            },
          })),
        icon: <PiWaveformBold />,
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
