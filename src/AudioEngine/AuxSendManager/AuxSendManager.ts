import { makeAutoObservable } from "mobx";
import { injectable, inject } from "inversify";
import { AuxSend } from "./AuxSend";
import { Track } from "../Track";
import { constants } from "../constants";

@injectable()
export class AuxSendManager {
  constructor(
    @inject(constants.SEND_FACTORY)
    private getNewAuxSend: (
      from: Track,
      to: Track,
      volume: number,
      id?: string
    ) => AuxSend,
    public sends: AuxSend[] = []
  ) {
    makeAutoObservable(this);
  }

  getSendsByTrack = (track: Track) => {
    return this.sends.filter(({ to }) => track.id === to.id);
  };

  getReceivesByTrack = (track: Track) => {
    return this.sends.filter(({ from }) => track.id === from.id);
  };

  createNewSend = (from: Track, to: Track, volume: number, id?: string) => {
    const send = this.getNewAuxSend(from, to, volume, id);
    this.sends = [...this.sends, send];
  };

  delete = (id: string) => {
    const sendToDelete = this.sends.find((send) => send.id === id);

    if (sendToDelete) {
      this.sends = this.sends.filter((send) => send.id !== id);
      sendToDelete.destroy();
    }
  };

  getOfflineEffects = () => {
    return this.sends.map((send) => [
      send.from.id,
      { effects: send.to.effectsChain, volume: send.volume },
    ]);
  };
}
