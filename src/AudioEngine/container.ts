import { MasterControl } from "./MasterControl";
import { AudioEngine } from ".";
import { FXFactory } from "./Effects";
import { Timeline } from "./Timeline";
import { Track } from "./Track";
import { Clip } from "./Track/Clip";
import { Keyboard } from "./Keyboard";
import { SamplePad } from "./SamplePad";
import { Container, interfaces } from "inversify";
import { v4 as uuid } from "uuid";
import { constants } from "./constants";
import * as Tone from "tone";

const container = new Container();

container.bind(AudioEngine).toSelf().inSingletonScope();

container.bind(FXFactory).toSelf().inSingletonScope();

container.bind(Timeline).toSelf().inSingletonScope();

container.bind(MasterControl).toSelf().inSingletonScope();

container
  .bind<interfaces.Factory<Clip>>(constants.CLIP_FACTORY)
  .toFactory<Clip>(() => {
    return (...args: unknown[]) => {
      const [track, audioSrc, audioBuffer, start, fadeIn, fadeOut] = args as [
        Track,
        string,
        Tone.ToneAudioBuffer,
        Tone.TimeClass,
        Tone.TimeClass,
        Tone.TimeClass
      ];
      return new Clip(track, audioSrc, audioBuffer, start, fadeIn, fadeOut);
    };
  });

container
  .bind<interfaces.Factory<Track>>(constants.TRACK_FACTORY)
  .toFactory<Track>(() => {
    return () => {
      return new Track(
        container.get(AudioEngine),
        container.get(constants.CLIP_FACTORY),
        uuid(),
        "New Track"
      );
    };
  });

container.bind(Keyboard).toSelf().inSingletonScope();

container.bind(SamplePad).toSelf().inSingletonScope();

export const audioEngineInstance = container.get(AudioEngine);
