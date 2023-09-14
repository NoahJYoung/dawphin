import { MasterControl } from './MasterControl';
import { AudioEngine } from '.';

const master = new MasterControl();
export const audioEngineInstance = new AudioEngine(master)