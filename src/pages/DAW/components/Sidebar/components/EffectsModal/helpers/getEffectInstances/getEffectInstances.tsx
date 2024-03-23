import { GraphicEQ, Reverb } from "src/AudioEngine/Effects";
import { EffectKeys } from "src/AudioEngine/Effects";
import { Track } from "src/AudioEngine/Track";
import { GraphicEQView, ReverbView } from "../../effects";

export const getEffectInstances = (track: Track) => {
  if (track?.effectsChain?.length) {
    return track.effectsChain.map((effect) => {
      switch (effect.name) {
        case EffectKeys.graphicEQ:
          return (
            <GraphicEQView
              graphicEQ={effect as GraphicEQ}
              key={effect.id}
              height={250}
              width={540}
            />
          );
        case EffectKeys.reverb:
          return <ReverbView reverb={effect as Reverb} />;
        default:
          return null;
      }
    });
  }
  return [];
};
