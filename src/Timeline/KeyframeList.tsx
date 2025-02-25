import { useScrollSync } from "./ScrollSync";
import { Segment } from "./Segment";

interface KeyframeListProps {
  duration: number;
}

export const KeyframeList = ({ duration }: KeyframeListProps) => {
  const { rulerRef, keyframeListRef, trackListRef, setScrollLeft } = useScrollSync();

  const handleScroll = () => {
    // Sync the scroll position of the ruler and keyframe list
    if (rulerRef.current && keyframeListRef.current) {
      // get the scroll position of the keyframe list
      const scrollLeft = keyframeListRef.current.scrollLeft;
      // set the scroll position of the ruler
      rulerRef.current.scrollLeft = scrollLeft;

      // Update the scroll position state, used for Playhead
      setScrollLeft(scrollLeft);
    }

    // Sync the scroll position of the keyframe list and track list
    if (keyframeListRef.current && trackListRef.current) {
      // get the scroll position of the keyframe list
      const scrollTop = keyframeListRef.current.scrollTop;
      // set the scroll position of the track list
      trackListRef.current.scrollTop = scrollTop;
    }
  };

  return (
    <div
      ref={keyframeListRef}
      className="px-4 min-w-0 overflow-auto"
      data-testid="keyframe-list"
      onScroll={handleScroll}
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
