import * as Tone from "tone";
import { observer } from "mobx-react-lite";
import { Clip } from "src/AudioEngine/Track/Clip";
import { useAudioEngine } from "src/pages/DAW/hooks";
import { LoopTrigger } from "..";

interface LoopExtensionProps {
  clip: Clip;
  clipHeight: number;
  color: string;
  left: number;
  top: number;
  onClick: (e: React.MouseEvent) => void;
  showLoopControl: boolean;
}

export const LoopExtension = observer(
  ({
    clip,
    clipHeight,
    color,
    left,
    top,
    onClick,
    showLoopControl,
  }: LoopExtensionProps) => {
    const audioEngine = useAudioEngine();
    const loopSampleLength = Tone.Time(
      clip.loopExtension?.duration
    ).toSamples();

    const loopWidth = clip.loopExtension
      ? audioEngine.timeline.samplesToPixels(loopSampleLength)
      : 0;
    return (
      <div
        onClick={onClick}
        style={{
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
        {showLoopControl && (
          <LoopTrigger
            clip={clip}
            clipHeight={clipHeight}
            clipWidth={loopWidth}
            color={color}
          />
        )}
      </div>
    );
  }
);
