import { useState } from "react";

import { observer } from "mobx-react-lite";
import { Modal } from "antd";
import { AudioEngine } from "src/AudioEngine";
import { ProjectDataDisplay, TransportControls } from "./components";

import styles from "./TransportView.module.scss";

interface TransportViewProps {
  audioEngine: AudioEngine;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const TransportView = observer(
  ({ audioEngine, containerRef }: TransportViewProps) => {
    const [projectModalOpen, setProjectModalOpen] = useState(false);

    const openModal = () => {
      setProjectModalOpen(true);
    };

    const closeModal = () => {
      setProjectModalOpen(false);
    };

    return (
      <div
        style={{
          display: "flex",
          height: "50px",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "5px",
        }}
      >
        <TransportControls
          containerRef={containerRef}
          audioEngine={audioEngine}
          openModal={openModal}
        />
        <div className={styles.hideOnSmallScreens}>
          <ProjectDataDisplay audioEngine={audioEngine} />
        </div>

        <Modal
          onOk={closeModal}
          onCancel={closeModal}
          footer={null}
          style={{ padding: 0 }}
          rootClassName={styles.paddingZero}
          cancelButtonProps={{ style: { display: "none" } }}
          okButtonProps={{ style: { fontFamily: "Inter" } }}
          open={projectModalOpen}
          className={styles.hideOnMediumScreens}
        >
          <ProjectDataDisplay audioEngine={audioEngine} />
        </Modal>
      </div>
    );
  }
);
