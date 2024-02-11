import { Channel } from "tone";

export interface BaseEffectType {
  id: string;
  name: string;
  input: Channel;
  output: Channel;
  offlineRender: () => { input: Channel; output: Channel };
}

export enum EffectKeys {
  graphicEQ = "GRAPHIC-EQ",
}

export const EffectNames = {
  [EffectKeys.graphicEQ]: "Graphic EQ",
};
