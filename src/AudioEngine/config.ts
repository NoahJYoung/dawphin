import { MasterControl } from "./MasterControl";
import { AudioEngine } from ".";
import { FXFactory } from "./Effects";
import { Timeline } from "./Timeline";
import { TrackFactory } from "./Track";
import { ClipFactory } from "./Track/Clip";
import { Keyboard } from "./Keyboard";
import { Container } from "inversify";

const container = new Container();

container.bind(FXFactory).toSelf().inSingletonScope();
container.bind(Timeline).toSelf().inSingletonScope();
container.bind(ClipFactory).toSelf().inSingletonScope();
container.bind(MasterControl).toSelf().inSingletonScope();
container.bind(TrackFactory).toSelf().inSingletonScope();
container.bind(Keyboard).toSelf().inSingletonScope();
container.bind(AudioEngine).toSelf().inSingletonScope();

export const audioEngineInstance = container.get(AudioEngine);
