import { DeleteOutlined } from "@ant-design/icons";
import { List, Button } from "antd";
import { MasterControl } from "src/AudioEngine/MasterControl";
import { Track } from "src/AudioEngine/Track";
import * as Tone from "tone";

import styles from "./TrackFXListbox.module.scss";

interface TrackFXListboxProps {
  track: Track | MasterControl;
  setEffectViewIndex: (i: number) => void;
  effectViewIndex: number;
}

export const TrackFXListBox = ({
  track,
  setEffectViewIndex,
  effectViewIndex,
}: TrackFXListboxProps) => {
  const isCurrentView = (index: number) => index === effectViewIndex;

  return (
    <div className={styles.listBoxContainer}>
      <h3>Track FX</h3>
      <List
        className={styles.listBox}
        dataSource={track.effectsChain}
        renderItem={(item, i) => (
          <List.Item
            actions={[
              <Button
                type="text"
                onClick={() => {
                  const newEffect = track.fxFactory.createEffect(item.name);
                  track.addEffect(newEffect as Tone.ToneAudioNode);
                }}
                icon={<DeleteOutlined />}
              />,
            ]}
            className={`${styles.listItem} ${
              isCurrentView(i) ? styles.selected : ""
            }`}
            onClick={() => setEffectViewIndex(i)}
          >
            <span>{item.name}</span>
          </List.Item>
        )}
      />
    </div>
  );
};
