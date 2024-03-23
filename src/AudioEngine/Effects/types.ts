import { Channel } from "tone";

export interface BaseEffectType {
  id: string;
  name: EffectKeys;
  input: Channel;
  output: Channel;
  offlineRender: () => { input: Channel; output: Channel };
}

export enum EffectKeys {
  graphicEQ = "GRAPHIC-EQ",
  reverb = "REVERB",
}

export const EffectNames = {
  [EffectKeys.graphicEQ]: "Graphic EQ",
  [EffectKeys.reverb]: "Reverb",
};
