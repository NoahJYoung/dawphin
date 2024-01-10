import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Track } from "src/AudioEngine/Track";
import { ClipView } from "./components";
import { PlaceholderClip } from "./components/PlaceholderClipView";

export const TrackView = observer(
  ({
    track,
    timelineRect,
  }: {
    track: Track;
    timelineRect: DOMRect | null;
    containerRef: React.MutableRefObject<HTMLDivElement | null>;
  }) => {
    const [renderCtx] = useState(new AudioContext());

    return (
      <div style={{ display: "flex", position: "relative" }}>
        {track?.clips?.map((clip) => (
          <ClipView
            color={track.color}
            renderCtx={renderCtx}
            timelineRect={timelineRect}
            key={clip.id}
            clip={clip}
          />
        ))}
        {track.placeholderClipStart && <PlaceholderClip track={track} />}
      </div>
    );
  }
);
