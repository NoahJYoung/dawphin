import { observer } from "mobx-react-lite";
import { Clip } from "src/AudioEngine/Track/Clip";
import { ImLoop } from "react-icons/im";
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

    const numberOfLoops = Math.floor(
      (clip.loopExtension?.length || 0) / clip.audioBuffer.length
    );

    const remainder =
      (clip.loopExtension?.length || 0) % clip.audioBuffer.length;

    const remainderWidth = audioEngine.timeline.samplesToPixels(remainder);

    const loopSectionArray = Array(numberOfLoops).fill({});

    const sectionWidth = audioEngine.timeline.samplesToPixels(
      clip.audioBuffer.length
    );

    const clipStartOffset = audioEngine.timeline.samplesToPixels(
      clip.start.toSamples()
    );

    return (
      <>
        {loopSectionArray.map((_, i) => (
          <div
            onClick={onClick}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: clipHeight,
              background: color,
              opacity: clip.isSelected ? 0.4 : 0.2,
              left: left + sectionWidth * i + 1,
              width: sectionWidth,
              position: "absolute",
              top,
              borderRadius: "6px",
            }}
          >
            <ImLoop style={{ fontSize: 56, opacity: 0.2 }} />
          </div>
        ))}
        {!!remainder && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: clipHeight,
              background: color,
              opacity: clip.isSelected ? 0.4 : 0.2,
              left:
                clipStartOffset +
                sectionWidth +
                sectionWidth * numberOfLoops +
                1,
              width: remainderWidth,
              position: "absolute",
              overflow: "hidden",
              top,
              borderRadius: "6px",
            }}
          >
            <ImLoop
              style={{
                fontSize: 56,
                opacity: 0.2,
                position: "absolute",
                left: sectionWidth / 2 - 28,
              }}
            />
          </div>
        )}
      </>
    );
  }
);
