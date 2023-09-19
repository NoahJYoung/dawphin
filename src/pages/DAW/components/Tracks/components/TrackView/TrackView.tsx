import { observer } from "mobx-react-lite";
import { useState } from "react";
import type { AudioEngine } from "src/AudioEngine";
import { Track } from "src/AudioEngine/Track";
import { ClipView } from "./components";
import { PlaceholderClip } from "./components/PlaceholderClipView";

export const TrackView = observer(
  ({
    track,
    timelineRect,
    audioEngine,
  }: {
    track: Track;
    timelineRect: DOMRect | null;
    containerRef: React.MutableRefObject<HTMLDivElement | null>;
    audioEngine: AudioEngine;
  }) => {
    const [renderCtx] = useState(new AudioContext());

    return (
      <div style={{ display: "flex", position: "relative" }}>
        {track.clips.map((clip) => (
          <ClipView
            color={track.color}
            renderCtx={renderCtx}
            timelineRect={timelineRect}
            key={clip.id}
            clip={clip}
            audioEngine={audioEngine}
          />
        ))}
        {track.placeholderClipStart && <PlaceholderClip track={track} />}
      </div>
    );
  }
);
