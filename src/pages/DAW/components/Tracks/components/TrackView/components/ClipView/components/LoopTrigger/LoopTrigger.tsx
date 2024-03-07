import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Clip } from "src/AudioEngine/Track/Clip";
import { ImLoop } from "react-icons/im";
import { useAudioEngine } from "src/pages/DAW/hooks";

interface LoopTriggerProps {
  clipHeight: number;
  clipWidth: number;
  clip: Clip;
  color: string;
  top: number;
  left: number;
}

export const LoopTrigger = ({
  clipHeight,
  clipWidth,
  clip,
  color,
  top,
  left,
}: LoopTriggerProps) => {
  const loopTriggerRef = useRef<HTMLSpanElement>(null);
  const audioEngine = useAudioEngine();

  useEffect(() => {
    if (loopTriggerRef.current) {
      const fadeInDragHandler = d3
        .drag<HTMLSpanElement, unknown>()
        .on("start", function () {
          d3.select(this).raise();
        })
        .on("drag", function (e) {
          clip.setLoopExtension(audioEngine.timeline.pixelsToSamples(e.dx));
        })
        .on("end", function () {
          clip.loadCombinedBuffer();
          if (audioEngine.timeline.snap) {
            clip.quantizeLoopEnd();
          }
        });

      d3.select(loopTriggerRef.current).call(fadeInDragHandler);
    }
  }, [audioEngine.timeline, clip]);

  return (
    <span
      ref={loopTriggerRef}
      style={{
        display: "flex",
        alignItems: "center",
        background: color,
        justifyContent: "center",
        border: `1px solid #191919`,
        borderRadius: "6px",
        color: "#191919",
        zIndex: 1000,
        height: 24,
        width: 24,
        position: "absolute",
        left: left + clipWidth,
        top: top + clipHeight - 24,
        cursor: "pointer",
        opacity: clip.isSelected ? 1 : 0.5,
      }}
    >
      <ImLoop />
    </span>
  );
};
