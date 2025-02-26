import { useMemo } from "react";

import { useScrollSync } from "./ScrollSync";
import { Segment } from "./Segment";

interface KeyframeListProps {
  duration: number;
}

export const KeyframeList = ({ duration }: KeyframeListProps) => {
  const { keyframeListRef, handleKeyframeListScroll } = useScrollSync();

  const segments = useMemo(
    () =>
      Array(10)
        .fill(null)
        .map((_, index) => <Segment key={index} duration={duration} />),
    [duration],
  );

  return (
    <div
      ref={keyframeListRef}
      className="px-4 min-w-0 overflow-auto"
      data-testid="keyframe-list"
      onScroll={handleKeyframeListScroll}
    >
      {segments}
    </div>
  );
};
