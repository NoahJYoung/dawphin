import { useState } from "react";
import { Dialog } from "src/pages/DAW/UIKit";
import { Track } from "src/AudioEngine/Track";
import { MdRoute } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { Button, Menu } from "antd";
import { AudioEngine } from "src/AudioEngine";
import { useAudioEngine } from "src/pages/DAW/hooks";
import { SlLink } from "react-icons/sl";
import Sider from "antd/es/layout/Sider";
import { observer } from "mobx-react-lite";
import styles from "./EffectsModal.module.scss";
import { PiTrash } from "react-icons/pi";
import { EffectNames } from "src/AudioEngine/Effects/types";
import { getEffectInstances } from "./helpers";
import { AuxSendView } from "./components";

const getMenuItems = (
  track: Track,
  audioEngine: AudioEngine,
  setView: (index: number, config?: { replace: boolean }) => void
) => {
  return [
    {
      key: "1",
      label: "FX Chain",
      icon: <SlLink style={{ fontSize: 18 }} />,
      children: track.effectsChain.map((effect, i) => ({
        key: `1-${i + 1}`,
        label: (
          <span
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p>{EffectNames[effect.name]}</p>
            <Button
              onClick={() => track.removeEffect(effect.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
              type="text"
              icon={<PiTrash />}
            />
          </span>
        ),
        onClick: () => setView(i),
      })),
      disabled: track.effectsChain.length === 0,
    },
    {
      key: "2",
      label: "Add FX",
      icon: <FiPlus style={{ fontSize: 18 }} />,
      children: audioEngine.fxFactory.getEffectKeys().map((key, i) => ({
        label: EffectNames[key],
        key: `2-${i + 1}`,
        onClick: () => {
          setView(i);
          const newEffect = track.fxFactory.createEffect(key);
          if (newEffect) {
            track.addEffect(newEffect);
          }
        },
      })),
    },
    {
      key: "3",
      label: "Aux Sends",
      onClick: () => setView(3, { replace: true }),
      icon: <MdRoute style={{ fontSize: 18 }} />,
    },
  ];
};

interface EffectsModalProps {
  track: Track;
  open: boolean;
  onCancel: () => void;
}

export const EffectsModal = observer(
  ({ track, open, onCancel }: EffectsModalProps) => {
    const [effectViewIndex, setEffectViewIndex] = useState<number>(0);
    const audioEngine = useAudioEngine();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [isAuxSendView, setIsAuxSendView] = useState(false);

    const handleMouseEnter = () => {
      setIsSidebarOpen(true);
    };

    const handleMouseLeave = () => {
      setIsSidebarOpen(false);
    };

    const handleViewChange = (index: number, config?: { replace: boolean }) => {
      if (!config?.replace) {
        setEffectViewIndex(index);
        const selectedKeys = [`1-${index + 1}`];
        setSelectedKeys(selectedKeys);
      } else {
        setSelectedKeys([index.toString()]);
        setIsAuxSendView(true);
      }
    };

    const items = getMenuItems(track as Track, audioEngine, handleViewChange);

    return (
      <Dialog
        className={styles.modal}
        title={track.name}
        onClose={onCancel}
        open={open}
      >
        <>
          <Sider
            width={250}
            collapsedWidth={80}
            style={{ background: "#191919" }}
            collapsible
            collapsed={!isSidebarOpen}
            onCollapse={(value) => setIsSidebarOpen(value)}
            defaultCollapsed
            trigger={null}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`${styles.sidebar} ${
              isSidebarOpen ? styles.sidebarOpen : ""
            }`}
          >
            <Menu
              style={{ background: "#191919", border: "none" }}
              mode="inline"
              items={items}
              selectedKeys={selectedKeys}
            />
          </Sider>

          <div
            style={{ display: isAuxSendView ? "none" : "flex" }}
            className={styles.effectViewContainer}
          >
            {getEffectInstances(track)[effectViewIndex]}
          </div>

          <div
            style={{ display: isAuxSendView ? "flex" : "none" }}
            className={styles.effectViewContainer}
          >
            <AuxSendView track={track} />
          </div>
        </>
      </Dialog>
    );
  }
);
