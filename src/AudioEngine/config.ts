import { MasterControl } from "./MasterControl";
import { AudioEngine } from ".";
import { FXFactory } from "./FXFactory/FXFactory";
import { Timeline } from "./Timeline";
import { TrackFactory } from "./Track";
import { ClipFactory } from "./Track/Clip";

const fxFactory = new FXFactory();
const timeline = new Timeline();
const clipFactory = new ClipFactory();
const master = new MasterControl(fxFactory);
const trackFactory = new TrackFactory(clipFactory);

export const audioEngineInstance = new AudioEngine(
  master,
  fxFactory,
  timeline,
  trackFactory
);
