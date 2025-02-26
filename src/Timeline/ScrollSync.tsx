import { createContext, useContext, RefObject, ReactNode, useState, useRef, useCallback } from "react";

interface ScrollState {
  left: number;
  top: number;
}

enum ScrollSourceEnum {
  RULER = "ruler",
  KEYFRAMELIST = "keyframeList",
  TRACKLIST = "trackList",
}

interface ScrollSyncProps {
  rulerRef: RefObject<HTMLDivElement>;
  keyframeListRef: RefObject<HTMLDivElement>;
  trackListRef: RefObject<HTMLDivElement>;
  scrollLeft: number;
  handleRulerScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  handleKeyframeListScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  handleTrackListScroll: (event: React.UIEvent<HTMLDivElement>) => void;
}

/**
 * ScrollSyncContext is a React Context that provides a way to share the refs of the scrollable containers
 * between the Ruler, KeyframeList, and TrackList components.
 *
 * rulerRef, keyframeListRef, and trackListRef are refs that store the DOM elements of the ruler, keyframe list, and track list.
 * scrollLeft is a state that stores the scroll position of the ruler and keyframe list, used for Playhead.
 * handleRulerScroll, handleKeyframeListScroll, and handleTrackListScroll are event handlers for scroll events.
 * */
export const ScrollSyncContext = createContext<ScrollSyncProps | null>(null);

// ScrollSyncProvider is a component that provides the ScrollSyncContext to its children.
export const ScrollSyncProvider = ({ children }: { children: ReactNode }) => {
  const [scrollLeft, setScrollLeft] = useState<number>(0);

  const rulerRef = useRef<HTMLDivElement>(null);
  const keyframeListRef = useRef<HTMLDivElement>(null);
  const trackListRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef<boolean>(false);

  // syncScroll is a function that synchronizes the scroll position of the ruler, keyframe list, and track list.
  const syncScroll = useCallback((updates: Partial<ScrollState>, source: ScrollSourceEnum) => {
    // Prevent multiple scroll events from being processed at the same time
    if (isScrolling.current) return;
    isScrolling.current = true;

    // Use requestAnimationFrame to ensure the scroll position is updated after the scroll event
    requestAnimationFrame(() => {
      // Update the scroll position of the ruler and keyframe list
      if (updates.left !== undefined) {
        if (source !== ScrollSourceEnum.RULER && rulerRef.current) {
          // Set the scroll position of the ruler
          rulerRef.current.scrollLeft = updates.left;
        }
        if (source !== ScrollSourceEnum.KEYFRAMELIST && keyframeListRef.current) {
          // Set the scroll position of the keyframe list
          keyframeListRef.current.scrollLeft = updates.left;
        }

        setScrollLeft(updates.left);
      }

      // Update the scroll position of the keyframe list and track list
      if (updates.top !== undefined) {
        if (source !== ScrollSourceEnum.TRACKLIST && trackListRef.current) {
          // Set the scroll position of the track list
          trackListRef.current.scrollTop = updates.top;
        }
        if (source !== ScrollSourceEnum.KEYFRAMELIST && keyframeListRef.current) {
          // Set the scroll position of the keyframe list
          keyframeListRef.current.scrollTop = updates.top;
        }
      }

      isScrolling.current = false;
    });
  }, []);

  // Event handlers for scroll events
  const handleRulerScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget;
      syncScroll({ left: target.scrollLeft }, ScrollSourceEnum.RULER);
    },
    [syncScroll],
  );

  const handleKeyframeListScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget;
      syncScroll(
        {
          left: target.scrollLeft,
          top: target.scrollTop,
        },
        ScrollSourceEnum.KEYFRAMELIST,
      );
    },
    [syncScroll],
  );

  const handleTrackListScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget;
      syncScroll({ top: target.scrollTop }, ScrollSourceEnum.TRACKLIST);
    },
    [syncScroll],
  );

  const contextValue = {
    rulerRef,
    keyframeListRef,
    trackListRef,
    scrollLeft,
    handleRulerScroll,
    handleKeyframeListScroll,
    handleTrackListScroll,
  };

  return <ScrollSyncContext.Provider value={contextValue}>{children}</ScrollSyncContext.Provider>;
};

// useScrollSync is a custom hook that allows components to access the refs of the scrollable containers
export const useScrollSync = () => {
  const context = useContext(ScrollSyncContext);
  if (!context) {
    throw new Error("useScrollSync must be used within ScrollSyncProvider");
  }
  return context;
};
