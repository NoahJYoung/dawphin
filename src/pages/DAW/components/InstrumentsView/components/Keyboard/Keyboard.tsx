import { keys } from "./helpers";
import { Key } from "./components";
import styles from "./Keyboard.module.scss";

export const Keyboard = () => {
  return (
    <div className={`${styles.keyboard} styled-scrollbar`}>
      {keys.map((key, i, arr) => {
        let leftPosition = 0;

        if (key.type === "black") {
          leftPosition =
            arr.slice(0, i).filter((k) => k.type === "white").length * 80 - 5;
        } else {
          leftPosition =
            arr.slice(0, i).filter((k) => k.type === "white").length * 80;
        }

        return (
          <Key
            style={{ left: leftPosition }}
            octave={0}
            keyData={key}
            key={key.note + i}
          />
        );
      })}
    </div>
  );
};
