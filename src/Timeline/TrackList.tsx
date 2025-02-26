import { useMemo } from "react";

import { useScrollSync } from "./ScrollSync";

export const TRACK_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

interface TrackItemProps {
  letter: string;
}

const TrackItem = ({ letter }: TrackItemProps) => (
  <div className="p-2">
    <div>Track {letter}</div>
  </div>
);

export const TrackList = () => {
  const { trackListRef, handleTrackListScroll } = useScrollSync();

  const tracks = useMemo(() => TRACK_LETTERS.map((letter) => <TrackItem key={letter} letter={letter} />), []);

  return (
    <div
      ref={trackListRef}
      className="grid grid-flow-row auto-rows-[40px]
      border-r border-solid border-r-gray-700 
      overflow-auto z-[1] bg-inherit"
      data-testid="track-list"
      onScroll={handleTrackListScroll}
    >
      {tracks}
    </div>
  );
};
