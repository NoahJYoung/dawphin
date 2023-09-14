import { Dropdown, MenuProps } from "antd";
import {
  SplitCellsOutlined,
  DeleteOutlined,
  CopyOutlined,
  SnippetsOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import type { AudioEngine } from "src/AudioEngine";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";

interface TimelineContextMenuProps {
  children: React.ReactNode
  audioEngine: AudioEngine
}

export const TimelineContextMenu = observer(({ children, audioEngine }: TimelineContextMenuProps) => {
  
  const canCopy = useMemo(() => {
    if (audioEngine.selectedClips.length > 0) {
      return audioEngine.selectedClips.every((selectedClip) => (
        selectedClip.track.id === audioEngine.selectedClips[0].track.id
      ))
    }
    return false;
  }, [audioEngine.selectedClips.length]);

  const canPaste = audioEngine.selectedTracks.length > 0;

  const items: MenuProps['items'] = [
    {
      key: '1',
      onClick: audioEngine.copyClips,
      label: 'Copy',
      disabled: !canCopy,
      icon: <CopyOutlined />
    },
    {
      key: '2',
      onClick: audioEngine.pasteClips,
      label: 'Paste',
      disabled: !canPaste,
      icon: <SnippetsOutlined />
    },
    { type: 'divider' },
    {
      key: '3',
      onClick: audioEngine.deleteSelectedClips,
      label: 'Delete',
      icon: <DeleteOutlined />
    },
    {
      key: '4',
      onClick: audioEngine.splitSelectedClipsAtPlayhead,
      label: 'Split at playhead',
      icon: <SplitCellsOutlined />
    },
    { type: 'divider' },
    {
      key: '5',
      onClick: () => audioEngine.setNormalized(true),
      label: 'Normalize',
      icon: <RiseOutlined />
    },
    {
      key: '6',
      onClick: () => audioEngine.setNormalized(false),
      label: 'Denormalize',
      icon: <FallOutlined />
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['contextMenu']}>
      { children }
    </Dropdown>
  )
});