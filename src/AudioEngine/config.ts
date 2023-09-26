import { MasterControl } from "./MasterControl";
import { AudioEngine } from ".";
import { FXFactory } from "./FXFactory/FXFactory";

const master = new MasterControl();
const fxFactory = new FXFactory();
export const audioEngineInstance = new AudioEngine(master, fxFactory);
