import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { v4 as uuid } from "uuid";
import * as Tone from "tone";
import { Band } from "./Band";
import { BaseEffectType, EffectKeys } from "../types";

@injectable()
export class GraphicEQ implements BaseEffectType {
  id = uuid();
  name: EffectKeys = EffectKeys.graphicEQ;
  bands: Band[] = [];
  input = new Tone.Channel();
  output = new Tone.Channel();
  highpass: Band;
  highshelf: Band;

  constructor() {
    makeAutoObservable(this);
    this.highpass = new Band(30, 0, "highpass");
    this.highshelf = new Band(15000, 0, "highshelf", 1);

    this.input.connect(this.highpass.filter);
    this.highpass.connect(this.highshelf.filter);
    this.connect();
  }

  private reconnect = () => {
    this.input.disconnect();
    this.highpass.disconnect();
    this.highshelf.disconnect();

    this.connect();
  };

  createBand = (hertz?: number, gain?: number, type?: BiquadFilterType) => {
    const band = new Band(hertz, gain, type);
    this.bands.push(band);

    this.reconnect();

    return band.id;
  };

  deleteBand = (key: string) => {
    this.bands = [...this.bands.filter((band) => band?.id !== key)];
    this.reconnect();
  };

  connect = () => {
    const bandsLength = this.bands.length;
    this.input.connect(this.highpass.filter);
    if (bandsLength > 0) {
      this.highpass.connect(this.bands[0].filter);

      for (let i = 0; i < bandsLength - 1; i++) {
        this.bands[i].connect(this.bands[i + 1].filter);
      }

      this.bands[bandsLength - 1].connect(this.highshelf.filter);
    } else {
      this.highpass.connect(this.highshelf.filter);
    }
    this.highshelf.connect(this.output);
  };

  offlineRender = () => {
    const offlineInput = new Tone.Channel();
    const offlineOutput = new Tone.Channel();
    const offlineHighpass = new Band(
      this.highpass.hertz,
      this.highpass.gain,
      "highpass",
      this.highpass.Q
    );
    const offlineHighshelf = new Band(
      this.highshelf.hertz,
      this.highshelf.gain,
      "highshelf",
      this.highshelf.Q
    );
    const offlineBands = this.bands.map((band) => {
      const offlineBand = new Band(band.hertz, band.gain, band.type, band.Q);
      offlineBand.init();
      return offlineBand;
    });

    offlineInput.connect(offlineHighpass.filter);
    if (this.bands.length > 0) {
      offlineHighpass.connect(offlineBands[0].filter);
      offlineBands.forEach((band, i) => {
        if (i < offlineBands.length - 2) {
          band.connect(offlineBands[i + 1].filter);
        } else {
          band.connect(offlineHighshelf.filter);
        }
      });
    } else {
      offlineHighpass.connect(offlineHighshelf.filter);
    }

    offlineHighshelf.connect(offlineOutput);

    return { input: offlineInput, output: offlineOutput };
  };

  mute = () => this.output.set({ mute: true });
}
