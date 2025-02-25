import { createContext, useContext, RefObject } from "react";

type ScrollContainerRefs = {
  rulerRef: RefObject<HTMLDivElement>;
  keyframeListRef: RefObject<HTMLDivElement>;
  trackListRef: RefObject<HTMLDivElement>;
  scrollLeft: number;
  setScrollLeft: (value: number) => void;
};

// ScrollSyncContext is a React Context that provides a way to share the refs of the scrollable containers
// between the Ruler, KeyframeList, and TrackList components.
// rulerRef, keyframeListRef, and trackListRef are refs that store the DOM elements of the ruler, keyframe list, and track list.
// scrollLeft is a state that stores the scroll position of the ruler and keyframe list, used for Playhead
// setScrollLeft is a function that allows components to update the scroll position of the ruler and keyframe list.
export const ScrollSyncContext = createContext<ScrollContainerRefs | null>(null);

// useScrollSync is a custom hook that allows components to access the refs of the scrollable containers
export const useScrollSync = () => {
  const context = useContext(ScrollSyncContext);
  if (!context) {
    throw new Error("useScrollSync must be used within ScrollSyncProvider");
  }
  return context;
};
