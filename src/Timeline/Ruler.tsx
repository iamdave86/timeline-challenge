import { useEffect, useState } from "react";

import { useScrollSync } from "./ScrollSync";
import { roundToNearestMs } from "./Timeline.constants";

type RulerProps = {
  duration: number;
  setTime: (time: number) => void;
};

// Duration is the total width of the ruler: 1ms = 1px
export const Ruler = ({ duration, setTime }: RulerProps) => {
  const { rulerRef, keyframeListRef } = useScrollSync();
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Add or remove event listeners based on the dragging state
  useEffect(() => {
    // The element is the ruler itself
    const element = rulerRef.current;
    if (!element) return;

    if (isDragging) {
      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseup", handleMouseUp);
    } else {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Update the time based on the mouse event
  const updateTimeFromMouseEvent = (event: MouseEvent | React.MouseEvent) => {
    if (!rulerRef.current) return;

    // Get the container's dimensions
    const container = rulerRef.current;
    const rect = container.getBoundingClientRect();
    // Get the scroll offset and padding
    const scrollOffset = container.scrollLeft;
    const paddingLeft = parseInt(getComputedStyle(container).paddingLeft);

    // Calculate the time based on the mouse event
    const clickX = event.clientX - rect.left - paddingLeft + scrollOffset;
    const clampedX = Math.max(0, Math.min(clickX, duration));
    const roundedTime = roundToNearestMs(clampedX);
    setTime(roundedTime);
  };

  const handleScroll = () => {
    // Sync the scroll position of the ruler and keyframe list
    if (rulerRef.current && keyframeListRef.current) {
      // get the scroll position of the ruler
      const scrollLeft = rulerRef.current.scrollLeft;
      // set the scroll position of the keyframe list
      keyframeListRef.current.scrollLeft = scrollLeft;
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updateTimeFromMouseEvent(event);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging || !rulerRef.current) return;
    updateTimeFromMouseEvent(event);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={rulerRef}
      className="px-4 py-2 min-w-0 
      border-b border-solid border-gray-700 
      overflow-x-auto overflow-y-hidden"
      data-testid="ruler"
      onScroll={handleScroll}
      onMouseDown={handleMouseDown}
    >
      <div className="h-6 rounded-md bg-white/25" data-testid="ruler-bar" style={{ width: `${duration}px` }}></div>
    </div>
  );
};
