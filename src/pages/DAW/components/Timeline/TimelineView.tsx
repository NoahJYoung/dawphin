import React, { type Dispatch, type SetStateAction } from "react";
import {
  Playhead,
  TimelineContextMenu,
  TimelineGrid,
  TopBar,
} from "./components";
import type { AudioEngine } from "src/AudioEngine";
import { observer } from "mobx-react-lite";
import { useTimeline } from "./hooks";
import { CLIP_HEIGHT, TOPBAR_HEIGHT } from "../../constants";

import styles from "./TimelineView.module.scss";

interface TimelineProps {
  audioEngine: AudioEngine;
  setTimelineRect: Dispatch<SetStateAction<DOMRect | null>>;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  children: React.ReactNode;
  trackPanelsRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const TimelineView = observer(
  ({
    audioEngine,
    setTimelineRect,
    trackPanelsRef,
    children,
    containerRef,
  }: TimelineProps) => {
    const {
      gridRef,
      topbarRef,
      playheadRef,
      gridWidth,
      sectionHeight,
      playheadXRef,
      handleMouseMove,
      handleClick,
      handleScroll,
    } = useTimeline(audioEngine, containerRef, trackPanelsRef, setTimelineRect);

    return (
      <TimelineContextMenu audioEngine={audioEngine}>
        <div
          className={`${styles.timelineView} styled-scrollbar`}
          ref={containerRef}
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onScroll={handleScroll}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className={styles.gridContainer} onClick={handleClick}>
            <TimelineGrid
              audioEngine={audioEngine}
              gridRef={gridRef}
              gridWidth={gridWidth}
              gridHeight={sectionHeight}
              clipHeight={CLIP_HEIGHT}
              topbarHeight={TOPBAR_HEIGHT}
            />
          </div>
          <div
            className={styles.topBarContainer}
            style={{
              height: TOPBAR_HEIGHT,
              width: gridWidth,
            }}
          >
            <TopBar
              audioEngine={audioEngine}
              topbarRef={topbarRef}
              topBarHeight={TOPBAR_HEIGHT}
              gridWidth={gridWidth}
            />
          </div>
          <div>{children}</div>
          <div
            className={styles.playheadContainer}
            onClick={handleClick}
            style={{
              width: gridWidth,
              height: sectionHeight,
            }}
          >
            <Playhead
              playheadRef={playheadRef}
              onClick={handleClick}
              width={gridWidth}
              left={playheadXRef.current}
              gridHeight={sectionHeight}
            />
          </div>
        </div>
      </TimelineContextMenu>
    );
  }
);
