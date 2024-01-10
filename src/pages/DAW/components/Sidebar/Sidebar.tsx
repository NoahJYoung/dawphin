import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import {
  Toolbar,
  TrackPanel,
  SidebarContextMenu,
  AddTrackButton,
} from "./components";
import {
  SCROLLBAR_HEIGHT,
  MIN_GRID_HEIGHT,
  CLIP_HEIGHT,
  CLIP_TOP_PADDING,
} from "../../constants";
import styles from "./Sidebar.module.scss";
import { useAudioEngine } from "../../hooks";

interface SidebarProps {
  timelineRect: DOMRect | null;
  trackPanelsRef: React.MutableRefObject<HTMLDivElement | null>;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const Sidebar = observer(
  ({ trackPanelsRef, containerRef }: SidebarProps) => {
    const [expanded, setExpanded] = useState(
      window.innerWidth > 480 ? true : false
    );

    const toggleExpanded = () => setExpanded(!expanded);

    const audioEngine = useAudioEngine();

    const sectionHeight = useMemo(() => {
      const clipFullHeight = CLIP_HEIGHT + CLIP_TOP_PADDING;
      const calculatedHeight =
        clipFullHeight * audioEngine.tracks.length +
        SCROLLBAR_HEIGHT +
        clipFullHeight;
      return calculatedHeight > MIN_GRID_HEIGHT
        ? calculatedHeight
        : MIN_GRID_HEIGHT;
    }, [audioEngine.tracks.length]);

    return (
      <SidebarContextMenu>
        <div
          style={{
            minWidth: expanded ? 235 : 64,
          }}
          className={`${styles.sidebarWrapper} ${
            expanded ? styles.expanded : ""
          }`}
        >
          <Toolbar
            expanded={expanded}
            toggleExpanded={toggleExpanded}
            containerRef={containerRef}
          />

          <div className={styles.trackPanelsWrapper} ref={trackPanelsRef}>
            <div
              className={styles.trackPanels}
              style={{ height: sectionHeight }}
            >
              {audioEngine.tracks.map((track, i) => (
                <TrackPanel
                  trackNumber={i + 1}
                  key={track.id}
                  track={track}
                  expanded={expanded}
                />
              ))}
              <AddTrackButton expanded={expanded} />
            </div>
          </div>
        </div>
      </SidebarContextMenu>
    );
  }
);
