import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import { AudioEngine } from "src/AudioEngine";
import { Toolbar, TrackPanel } from "./components";
import { SCROLLBAR_HEIGHT, MIN_GRID_HEIGHT, CLIP_HEIGHT, TRACK_PANEL_X_PADDING, CLIP_TOP_PADDING } from "../../constants";
import styles from './Sidebar.module.scss';

interface SidebarProps {
  timelineRect: DOMRect | null
  audioEngine: AudioEngine
  trackPanelsRef: React.MutableRefObject<HTMLDivElement | null>
  containerRef: React.MutableRefObject<HTMLDivElement | null>
}

export const Sidebar = observer(({ audioEngine, trackPanelsRef, containerRef, }: SidebarProps) => {
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => setExpanded(!expanded)

  const sectionHeight = useMemo(() => {
    const calculatedHeight = (CLIP_HEIGHT + CLIP_TOP_PADDING) * audioEngine.tracks.length + SCROLLBAR_HEIGHT;
    return calculatedHeight > MIN_GRID_HEIGHT ? calculatedHeight : MIN_GRID_HEIGHT
  }, [audioEngine.tracks.length]);

  return (
    <div className={`${styles.sidebarWrapper} ${expanded ? styles.expanded : ''}`}>
      <Toolbar expanded={expanded} toggleExpanded={toggleExpanded} audioEngine={audioEngine} containerRef={containerRef} />
      
      <div
        className={styles.trackPanelsWrapper}
        ref={trackPanelsRef}
      >
        <div
          className={styles.trackPanels}
          style={{ height: sectionHeight }}
        >
        {audioEngine.tracks.map((track, i) => (
          <TrackPanel audioEngine={audioEngine} trackNumber={i + 1} key={track.id} track={track} />
        ))}
        </div>
      </div>
    </div>
  )
});