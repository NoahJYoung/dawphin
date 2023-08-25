import { Dropdown, MenuProps, Button } from "antd";
import type { AudioEngine } from "src/AudioEngine";

interface ClipContextMenuProps {
  children: React.ReactNode
  audioEngine: AudioEngine
}

export const ClipContextMenu = ({ children, audioEngine }: ClipContextMenuProps) => {

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Button onClick={audioEngine.deleteSelectedClips} type='text'>
          Delete
        </Button>
      ),
    },
    {
      key: '2',
      label: (
        <Button
          onClick={audioEngine.splitSelectedClipsAtPlayhead}
          type='text'
        >
          Split at playhead
        </Button>
      ),
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['contextMenu']}>
      { children }
    </Dropdown>
  )
}