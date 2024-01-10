import { observer } from "mobx-react-lite";
import { useKeys } from "./hooks";
import styles from "./KeyboardView.module.scss";

export const KeyboardView = observer(() => {
  const keyElements = useKeys();
  return (
    <div className={`${styles.keyboard} styled-scrollbar`}>{keyElements}</div>
  );
});
