import { Dropdown, MenuProps } from "antd";
import {
  SplitCellsOutlined,
  DeleteOutlined,
  CopyOutlined,
  SnippetsOutlined,
  ExpandAltOutlined,
  ColumnHeightOutlined,
  VerticalAlignMiddleOutlined,
} from '@ant-design/icons';
import type { AudioEngine } from "src/AudioEngine";
import { Clip } from "src/AudioEngine/Track/Clip";

interface ClipContextMenuProps {
  children: React.ReactNode
  audioEngine: AudioEngine
  clip: Clip
}

export const ClipContextMenu = ({ children, audioEngine, clip }: ClipContextMenuProps) => {

  const items: MenuProps['items'] = [
    {
      key: '1',
      onClick: audioEngine.splitSelectedClipsAtPlayhead,
      label: 'Copy',
      icon: <CopyOutlined />
    },
    {
      key: '2',
      onClick: audioEngine.splitSelectedClipsAtPlayhead,
      label: 'Paste',
      icon: <SnippetsOutlined />
    },
    { type: 'divider' },
    {
      key: '3',
      onClick: audioEngine.deleteSelectedClips,
      label: 'Delete selected',
      icon: <DeleteOutlined />
    },
    {
      key: '4',
      onClick: audioEngine.splitSelectedClipsAtPlayhead,
      label: 'Split selected',
      icon: <SplitCellsOutlined />
    },
    { type: 'divider' },
    {
      key: '5',
      onClick: audioEngine.splitSelectedClipsAtPlayhead,
      label: 'Normalize',
      disabled: clip.normalized,
      icon: <ColumnHeightOutlined />
    },
    {
      key: '6',
      onClick: audioEngine.splitSelectedClipsAtPlayhead,
      label: 'Denormalize',
      disabled: !clip.normalized,
      icon: <VerticalAlignMiddleOutlined />
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['contextMenu']}>
      { children }
    </Dropdown>
  )
}