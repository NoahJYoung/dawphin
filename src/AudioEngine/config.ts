import { MasterControl } from "./MasterControl";
import { AudioEngine } from ".";
import { FXFactory } from "./FXFactory/FXFactory";

const fxFactory = new FXFactory();
const master = new MasterControl(fxFactory);
export const audioEngineInstance = new AudioEngine(master, fxFactory);
