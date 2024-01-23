import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import {
  Toolbar,
  TrackPanel,
  SidebarContextMenu,
  AddTrackButton,
} from "./components";
import styles from "./Sidebar.module.scss";
import { useAudioEngine, useLinkedScroll } from "../../hooks";

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

    const { scrollTop, setScrollTop, sectionHeight } = useLinkedScroll();

    const handleScroll = (e: any) => {
      e.preventDefault();
      setScrollTop(e.target.scrollTop);
    };

    useEffect(() => {
      const div = trackPanelsRef.current;
      if (div) {
        div.scrollTop = scrollTop;
        div.addEventListener("scroll", handleScroll);
      }

      return () => {
        if (div) {
          div.removeEventListener("scroll", handleScroll);
        }
      };
    }, [scrollTop, setScrollTop]);

    const toggleExpanded = () => setExpanded(!expanded);

    const audioEngine = useAudioEngine();

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
              style={{ height: Math.round(sectionHeight - 36) }}
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
