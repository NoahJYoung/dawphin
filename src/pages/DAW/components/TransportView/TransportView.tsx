import { useState } from "react";

import { observer } from "mobx-react-lite";
import { Modal } from "antd";
import { ProjectDataDisplay, TransportControls } from "./components";

import styles from "./TransportView.module.scss";

interface TransportViewProps {
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const TransportView = observer(
  ({ containerRef }: TransportViewProps) => {
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
          width: "100%",
          maxWidth: "400px",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TransportControls containerRef={containerRef} openModal={openModal} />
        <div className={styles.hideOnSmallScreens}>
          <ProjectDataDisplay />
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
          <ProjectDataDisplay />
        </Modal>
      </div>
    );
  }
);
