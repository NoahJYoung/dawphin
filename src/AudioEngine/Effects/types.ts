import { Channel } from "tone";

export interface BaseEffectType {
  id: string;
  name: string;
  input: Channel;
  output: Channel;
}
