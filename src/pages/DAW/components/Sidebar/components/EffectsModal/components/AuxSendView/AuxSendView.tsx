import { useAudioEngine } from "src/pages/DAW/hooks";
import { Button, Dropdown, MenuProps } from "antd";
import { Track } from "src/AudioEngine/Track";
import { observer } from "mobx-react-lite";
import { FiPlus } from "react-icons/fi";

interface AuxSendViewProps {
  track: Track;
}

export const AuxSendView = observer(({ track }: AuxSendViewProps) => {
  const { auxSendManager, tracks } = useAudioEngine();

  const availableTracks = tracks.filter(({ id }) => id !== track.id);

  const sendMenuItems: MenuProps["items"] = availableTracks.map(
    (availableTrack) => ({
      key: availableTrack.id,
      label: availableTrack.name,
      onClick: () => auxSendManager.createNewSend(track, availableTrack, 0),
    })
  );

  const receiveMenuItems = availableTracks.map((availableTrack) => ({
    key: availableTrack.id,
    label: availableTrack.name,
    onClick: () => auxSendManager.createNewSend(availableTrack, track, 0),
  }));

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        gap: "1rem",
        justifyContent: "space-evenly",
        // alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Dropdown trigger={["click"]} menu={{ items: receiveMenuItems }}>
          <Button
            style={{ height: "3rem", display: "flex", alignItems: "center" }}
            icon={<FiPlus style={{ fontSize: 20 }} />}
          >
            New receive
          </Button>
        </Dropdown>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Dropdown trigger={["click"]} menu={{ items: sendMenuItems }}>
          <Button
            style={{ height: "3rem", display: "flex", alignItems: "center" }}
            icon={<FiPlus style={{ fontSize: 20 }} />}
          >
            New send
          </Button>
        </Dropdown>
      </div>
    </div>
  );
});
