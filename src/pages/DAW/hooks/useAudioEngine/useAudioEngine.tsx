import { createContext, useContext, useState } from "react";
import { AudioEngine, audioEngineInstance } from "src/AudioEngine";

const AudioEngineContext = createContext<AudioEngine>(audioEngineInstance);

interface AudioEngineProviderProps {
  children: React.ReactNode;
}

export const AudioEngineProvider = ({ children }: AudioEngineProviderProps) => {
  const [audioEngine] = useState<AudioEngine>(audioEngineInstance);

  return (
    <AudioEngineContext.Provider value={audioEngine}>
      {children}
    </AudioEngineContext.Provider>
  );
};

export const useAudioEngine = () => {
  const audioEngine = useContext(AudioEngineContext);

  if (!audioEngine) {
    throw new Error("useAudioEngine must be used within a AudioEngineProvider");
  }

  return audioEngine;
};
