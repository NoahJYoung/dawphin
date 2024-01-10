import { observer } from "mobx-react-lite";
import { TrackView } from "./components";
import { useAudioEngine } from "../../hooks";

interface TracksProps {
  timelineRect: DOMRect | null;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const Tracks = observer(
  ({ timelineRect, containerRef }: TracksProps) => {
    const { tracks } = useAudioEngine();

    return (
      <>
        {tracks?.map((track) => (
          <TrackView
            containerRef={containerRef}
            timelineRect={timelineRect}
            key={track.id}
            track={track}
          />
        ))}
      </>
    );
  }
);
