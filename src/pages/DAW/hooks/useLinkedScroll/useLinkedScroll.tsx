import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useAudioEngine } from "..";
import { TOPBAR_HEIGHT } from "../../constants";

interface LinkedScrollContextType {
  scrollTop: number;
  setScrollTop: (value: number) => void;
  sectionHeight: number;
}

const LinkedScrollContext = createContext<LinkedScrollContextType | undefined>(
  undefined
);

interface LinkedScrollProviderProps {
  children: ReactNode;
}

export const LinkedScrollProvider = ({
  children,
}: LinkedScrollProviderProps) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const audioEngine = useAudioEngine();

  useEffect(() => {
    window.addEventListener("resize", () => {
      setInnerHeight(window.innerHeight);
    });
    return window.removeEventListener("resize", () => {
      setInnerHeight(window.innerHeight);
    });
  }, []);

  const tracksHeight = audioEngine.tracks.length * 84 + (84 + TOPBAR_HEIGHT);
  const minHeight = innerHeight / 2 + 36;
  const sectionHeight = tracksHeight > minHeight ? tracksHeight : minHeight;

  return (
    <LinkedScrollContext.Provider
      value={{ scrollTop, setScrollTop, sectionHeight }}
    >
      {children}
    </LinkedScrollContext.Provider>
  );
};

export const useLinkedScroll = () => {
  const context = useContext(LinkedScrollContext);

  if (context === undefined) {
    throw new Error(
      "useLinkedScroll must be used within a LinkedScrollProvider"
    );
  }

  return context;
};
