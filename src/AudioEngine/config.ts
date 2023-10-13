import { MasterControl } from "./MasterControl";
import { AudioEngine } from ".";
import { FXFactory } from "./Effects";
import { Timeline } from "./Timeline";
import { TrackFactory } from "./Track";
import { ClipFactory } from "./Track/Clip";
import { Keyboard } from "./Keyboard";
import * as Tone from "tone";

const fxFactory = new FXFactory();
const timeline = new Timeline();
const clipFactory = new ClipFactory();
const master = new MasterControl(fxFactory);
const trackFactory = new TrackFactory(clipFactory);

const poly = new Tone.PolySynth(Tone.AMSynth).toDestination();
const keyboard = new Keyboard(poly);

export const audioEngineInstance = new AudioEngine(
  master,
  fxFactory,
  timeline,
  trackFactory,
  keyboard
);
