import { useScrollSync } from "./ScrollSync";
import { Segment } from "./Segment";

interface KeyframeListProps {
  duration: number;
}

export const KeyframeList = ({ duration }: KeyframeListProps) => {
  const { keyframeListRef, handleKeyframeListScroll } = useScrollSync();

  return (
    <div
      ref={keyframeListRef}
      className="px-4 min-w-0 overflow-auto"
      data-testid="keyframe-list"
      onScroll={handleKeyframeListScroll}
    >
      <Segment duration={duration} />
      <Segment duration={duration} />
      <Segment duration={duration} />
      <Segment duration={duration} />
      <Segment duration={duration} />
      <Segment duration={duration} />
      <Segment duration={duration} />
      <Segment duration={duration} />
      <Segment duration={duration} />
      <Segment duration={duration} />
    </div>
  );
};
