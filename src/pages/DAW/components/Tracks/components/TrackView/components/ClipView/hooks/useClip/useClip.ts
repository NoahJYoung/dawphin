import { Clip } from "src/AudioEngine/Track/Clip";
import { useWaveSurfer } from "..";
import { useAudioEngine } from "src/pages/DAW/hooks";
import { useEffect, useMemo } from "react";
import * as d3 from "d3";

export const useClip = (clip: Clip) => {
  const audioEngine = useAudioEngine();
  const waveSurferRef = useWaveSurfer(clip, audioEngine);

  const clipWidth = useMemo(
    () => audioEngine.timeline.samplesToPixels(clip.duration?.toSamples() || 1),
    [audioEngine.timeline.samplesPerPixel, clip.duration]
  );

  useEffect(() => {
    if (waveSurferRef.current) {
      const dragHandler = d3
        .drag<any, unknown>()
        .on("start", function () {
          d3.select(this).raise();
        })
        .on("drag", function (event) {
          audioEngine.moveSelectedClips(event.dx);
        })
        .on("end", function () {
          if (audioEngine.timeline.snap) {
            audioEngine.quantizeSelectedClips();
          }
        });

      d3.select(waveSurferRef.current).call(dragHandler);
    }
  }, [clip]);
  return { audioEngine, waveSurferRef, clipWidth };
};
