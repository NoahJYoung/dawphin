import { MasterControl } from "./MasterControl";
import { AudioEngine } from ".";
import { FXFactory } from "./FXFactory/FXFactory";
import { Timeline } from "./Timeline";

const fxFactory = new FXFactory();
const master = new MasterControl(fxFactory);
const timeline = new Timeline();
export const audioEngineInstance = new AudioEngine(master, fxFactory, timeline);
