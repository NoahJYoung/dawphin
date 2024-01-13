import { Clip } from "src/AudioEngine/Track/Clip";
import { useWaveSurfer } from "..";
import { useAudioEngine } from "src/pages/DAW/hooks";
import { useMemo, useState } from "react";

export const useClip = (clip: Clip) => {
  const [fadeMode, setFadeMode] = useState<"in" | "out" | null>(null);
  const audioEngine = useAudioEngine();
  const waveSurferRef = useWaveSurfer(clip, audioEngine);

  const clipWidth = useMemo(
    () =>
      (clip.duration?.toSamples() || 1) / audioEngine.timeline.samplesPerPixel,
    [audioEngine.timeline.samplesPerPixel, clip.duration]
  );

  return { audioEngine, waveSurferRef, fadeMode, setFadeMode, clipWidth };
};
