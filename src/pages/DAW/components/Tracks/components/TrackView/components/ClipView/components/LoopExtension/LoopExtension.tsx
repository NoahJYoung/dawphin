import * as Tone from "tone";
import { observer } from "mobx-react-lite";
import { Clip } from "src/AudioEngine/Track/Clip";
import { useAudioEngine } from "src/pages/DAW/hooks";

interface LoopExtensionProps {
  clip: Clip;
  clipHeight: number;
  color: string;
  left: number;
  top: number;
  onClick: (e: React.MouseEvent) => void;
}

export const LoopExtension = observer(
  ({ clip, clipHeight, color, left, top, onClick }: LoopExtensionProps) => {
    const audioEngine = useAudioEngine();
    const loopSampleLength = Tone.Time(
      clip.loopExtension?.duration
    ).toSamples();

    const loopWidth = clip.loopExtension
      ? audioEngine.timeline.samplesToPixels(loopSampleLength)
      : 0;

    const numberOfLoops = Math.floor(
      (clip.loopExtension?.length || 0) / clip.audioBuffer.length
    );

    const loopSectionArray = Array(numberOfLoops).fill({});

    const sectionWidth = audioEngine.timeline.samplesToPixels(
      clip.audioBuffer.length
    );

    return (
      <div
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          height: clipHeight,
          background: color,
          opacity: clip.isSelected ? 0.3 : 0.2,
          left,
          width: loopWidth,
          position: "absolute",
          top,
          borderRadius: "6px",
        }}
      >
        {loopSectionArray.map((_, i) => (
          <div
            key={`${clip.id}${i}`}
            style={{
              position: "absolute",
              height: clipHeight,
              width: sectionWidth,
              background: "transparent",
              borderRight: `3px dotted #191919`,
              left: sectionWidth * i,
            }}
          />
        ))}
        <hr style={{ width: "100%", border: "2px dotted #191919" }} />
      </div>
    );
  }
);
