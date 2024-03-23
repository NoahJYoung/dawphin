import { useEffect, useRef } from "react";
import { Band } from "src/AudioEngine/Effects/GraphicEQ/Band";
import * as d3 from "d3";

interface CenterPointProps {
  band: Band;
  range: number[];
  scaleX: d3.ScaleLogarithmic<number, number, never>;
  scaleY: d3.ScaleLinear<number, number, never>;
  className?: string;
  changeBandTab: (id: string) => void;
}

export const CenterFrequency = ({
  band,
  range,
  scaleX,
  scaleY,
  className,
  changeBandTab,
}: CenterPointProps) => {
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (circleRef.current) {
      const [min, max] = range;
      const dragHandler = d3
        .drag<SVGCircleElement, unknown>()
        .on("start", function () {
          d3.select(this).raise();
        })
        .on("drag", function (event) {
          const newX = scaleX.invert(event.x);
          const newY = scaleY.invert(event.y);

          if (newX >= min && newX <= max) {
            band.setHertz(newX);
          } else {
            return;
          }

          if (band.type !== "highpass") {
            if (newY <= 12 && newY >= -12) {
              d3.select(this).attr("cx", event.x).attr("cy", event.y);
              band.setGain(newY);
            } else {
              return;
            }
          }
        });

      d3.select(circleRef.current).call(dragHandler);
    }
  }, [scaleX, scaleY, band, range]);

  const handleClick = () => {
    changeBandTab(band.id);
  };

  return (
    <circle
      onClick={handleClick}
      ref={circleRef}
      className={className}
      stroke="#888"
      fill="transparent"
      cx={scaleX(band.hertz)}
      cy={scaleY(band.gain)}
      r={5}
    />
  );
};
