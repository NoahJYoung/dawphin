import React, { useState, useRef } from "react";

interface ResizableLayoutProps {
  top: React.ReactElement;
  middle: React.ReactElement;
  bottom: React.ReactElement;
  className?: string;
}

export const ResizableLayout = ({
  top,
  middle,
  bottom,
  className,
}: ResizableLayoutProps) => {
  const [topHeightPercentage, setTopHeightPercentage] = useState(60);

  const layoutRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: MouseEvent) => {
    if (layoutRef.current) {
      const totalHeight = layoutRef.current.clientHeight - 40;
      const newTopHeight =
        ((e.clientY - layoutRef.current.getBoundingClientRect().top) /
          totalHeight) *
        100;
      if (newTopHeight >= 0 && newTopHeight <= 100) {
        setTopHeightPercentage(newTopHeight);
      }
    }
  };

  const startResize = () => {
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", stopResize);
  };

  const stopResize = () => {
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", stopResize);
  };

  const topHeight = `calc(${topHeightPercentage}vh - 25px)`;
  const bottomHeight = `calc(${100 - topHeightPercentage}vh - 25px)`;

  return (
    <div
      className={className}
      ref={layoutRef}
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <div style={{ height: topHeight, overflow: "auto" }}>{top}</div>
      <div
        style={{ height: "50px", cursor: "ns-resize", userSelect: "none" }}
        onMouseDown={startResize}
      >
        {middle}
      </div>
      <div
        ref={bottomRef}
        className="styled-scrollbar"
        style={{
          height: bottomHeight,
          overflow: "auto",
        }}
      >
        {bottom}
      </div>
    </div>
  );
};
