import { createContext, useContext, RefObject } from "react";

type ScrollContainerRefs = {
  rulerRef: RefObject<HTMLDivElement>;
  keyframeListRef: RefObject<HTMLDivElement>;
  trackListRef: RefObject<HTMLDivElement>;
};

// ScrollSyncContext is a React Context that provides a way to share the refs of the scrollable containers
// between the Ruler, KeyframeList, and TrackList components.
export const ScrollSyncContext = createContext<ScrollContainerRefs | null>(null);

// useScrollSync is a custom hook that allows components to access the refs of the scrollable containers
export const useScrollSync = () => {
  const context = useContext(ScrollSyncContext);
  if (!context) {
    throw new Error("useScrollSync must be used within ScrollSyncProvider");
  }
  return context;
};
