import { PlusOutlined } from "@ant-design/icons";
import { Button, List } from "antd";
import { MasterControl } from "src/AudioEngine/MasterControl";
import { Track } from "src/AudioEngine/Track";
import * as Tone from "tone";

import styles from "./FXListBox.module.scss";

interface FXListboxProps {
  track: Track | MasterControl;
}

export const FXListBox = ({ track }: FXListboxProps) => {
  return (
    <div className={styles.listBoxContainer}>
      <h3>Add FX</h3>
      <List
        className={styles.listBox}
        dataSource={track.fxFactory.effects}
        renderItem={(item) => (
          <List.Item>
            <span>{item.name}</span>
            <Button
              type="text"
              onClick={() => {
                const newEffect = track.fxFactory.createEffect(item.name);
                track.addEffect(newEffect as Tone.ToneAudioNode);
              }}
              icon={<PlusOutlined />}
            />
          </List.Item>
        )}
      />
    </div>
  );
};
