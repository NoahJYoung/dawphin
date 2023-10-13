import { AudioEngine } from "src/AudioEngine";
import { KeyboardView } from "./components";

interface InstrumentViewProps {
  audioEngine: AudioEngine;
}

export const InstrumentsView = ({ audioEngine }: InstrumentViewProps) => {
  return (
    <>
      <KeyboardView audioEngine={audioEngine} />
    </>
  );
};
