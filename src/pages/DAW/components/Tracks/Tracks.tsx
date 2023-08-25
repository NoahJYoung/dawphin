import { observer } from "mobx-react-lite";
import { AudioEngine } from "src/AudioEngine";
import { TrackView } from "./components";


export const Tracks = observer(({ audioEngine, timelineRect, containerRef }: { audioEngine: AudioEngine, timelineRect: DOMRect | null, containerRef: React.MutableRefObject<HTMLDivElement | null> }) => {
  return (
    <>
      {audioEngine.tracks.map(track => (
          <TrackView audioEngine={audioEngine} containerRef={containerRef} timelineRect={timelineRect} key={track.id} track={track} />
      ))}
    </>
  )
});