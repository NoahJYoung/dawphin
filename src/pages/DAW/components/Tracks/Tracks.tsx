import { observer } from "mobx-react-lite";
import { AudioEngine } from "src/AudioEngine";
import { TrackView } from "./components";


export const Tracks = observer(({ audioEngine, timelineRect, container }: { audioEngine: AudioEngine, timelineRect: DOMRect | null, container: HTMLDivElement | null }) => {
  return (
    <>
      {audioEngine.tracks.map(track => (
          <TrackView audioEngine={audioEngine} container={container} timelineRect={timelineRect} key={track.id} track={track} />
      ))}
    </>
  )
});