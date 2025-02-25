import { useScrollSync } from "./ScrollSync";

export const TrackList = () => {
  const { keyframeListRef, trackListRef } = useScrollSync();

  const handleScroll = () => {
    // Sync the scroll position of the keyframe list and track list
    if (trackListRef.current && keyframeListRef.current) {
      // get the scroll position of the track list
      const scrollTop = trackListRef.current.scrollTop;
      // set the scroll position of the keyframe list
      keyframeListRef.current.scrollTop = scrollTop;
    }
  };

  return (
    <div
      ref={trackListRef}
      className="grid grid-flow-row auto-rows-[40px]
      border-r border-solid border-r-gray-700 
      overflow-auto z-[1] bg-inherit"
      data-testid="track-list"
      onScroll={handleScroll}
    >
      <div className="p-2">
        <div>Track A</div>
      </div>
      <div className="p-2">
        <div>Track B</div>
      </div>
      <div className="p-2">
        <div>Track C</div>
      </div>
      <div className="p-2">
        <div>Track D</div>
      </div>
      <div className="p-2">
        <div>Track E</div>
      </div>
      <div className="p-2">
        <div>Track F </div>
      </div>
      <div className="p-2">
        <div>Track G</div>
      </div>
      <div className="p-2">
        <div>Track H</div>
      </div>
      <div className="p-2">
        <div>Track I </div>
      </div>
      <div className="p-2">
        <div>Track J</div>
      </div>
    </div>
  );
};
