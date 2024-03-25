import { MasterControl } from "./MasterControl";
import { AudioEngine } from ".";
import { FXFactory } from "./Effects";
import { Timeline } from "./Timeline";
import { Track } from "./Track";
import { Clip } from "./Track/Clip";
import { Keyboard } from "./Keyboard";
import { Sampler } from "./Sampler";
import { Container, interfaces } from "inversify";
import { v4 as uuid } from "uuid";
import { constants } from "./constants";
import * as Tone from "tone";
import { AuxSend, AuxSendManager } from "./AuxSendManager";

const container = new Container();

container.bind(FXFactory).toSelf().inSingletonScope();

container.bind(Timeline).toSelf().inSingletonScope();

container.bind(MasterControl).toSelf().inSingletonScope();

container.bind(Keyboard).toSelf().inSingletonScope();

container.bind(Sampler).toSelf().inSingletonScope();

container.bind(AuxSendManager).toSelf().inSingletonScope();

container
  .bind<interfaces.Factory<Clip>>(constants.CLIP_FACTORY)
  .toFactory<Clip>(() => {
    return (...args: unknown[]) => {
      const [track, audioBuffer, start, fadeIn, fadeOut, peaksData] = args as [
        Track,
        Tone.ToneAudioBuffer,
        Tone.TimeClass,
        Tone.TimeClass,
        Tone.TimeClass,
        number[][]
      ];
      return new Clip(track, audioBuffer, start, fadeIn, fadeOut, peaksData);
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
container
  .bind<interfaces.Factory<AuxSend>>(constants.SEND_FACTORY)
  .toFactory<AuxSend>(() => {
    return (...args: unknown[]) => {
      const [from, to, volume, id] = args as [Track, Track, number, string];
      return new AuxSend(from, to, volume, id);
    };
  });

container.bind(AudioEngine).toSelf().inSingletonScope();

export const audioEngineInstance = container.get(AudioEngine);
