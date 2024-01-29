import { useRef } from "react";
import { IoClose } from "react-icons/io5";

import styles from "./Dialog.module.scss";

interface ModalProps {
  open: boolean;
  children: JSX.Element;
  onClose: () => void;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  closeable?: boolean;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode;
}

export const Dialog = ({
  open,
  children,
  onClose,
  closeable = true,
  className,
  style,
  title,
  footer,
  id,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <dialog
      id={id}
      ref={dialogRef}
      style={style}
      className={[className, styles.modal, "styled-scrollbar"].join(" ")}
      onClose={onClose}
      open={open}
    >
      <div className={styles.innerWrapper}>
        <div className={styles.header}>
          {title && <h3>{title}</h3>}
          {closeable && (
            <button
              className={styles.xButton}
              onClick={() => dialogRef.current?.close()}
            >
              <IoClose className={styles.icon} />
            </button>
          )}
        </div>
        {(title || closeable) && <hr />}
        <div className={styles.contentWrapper}>
          <div className={`${styles.content} styled-scrollbar`}>{children}</div>
        </div>

        {footer && <hr />}
        {footer && footer}
      </div>
    </dialog>
  );
};
