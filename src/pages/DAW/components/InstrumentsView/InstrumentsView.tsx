import { AudioEngine } from "src/AudioEngine";
import { ControlPanel, KeyboardView } from "./components";

interface InstrumentViewProps {
  audioEngine: AudioEngine;
}

export const InstrumentsView = ({ audioEngine }: InstrumentViewProps) => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-evenly",
      }}
    >
      <KeyboardView audioEngine={audioEngine} />
      <ControlPanel audioEngine={audioEngine} />
    </div>
  );
};
