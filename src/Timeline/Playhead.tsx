import { useMemo } from "react";
import { useScrollSync } from "./ScrollSync";

const LEFT_OFFSET = 316;
const HEAD_WIDTH = 5;
const PADDING = 16; // 1rem

type PlayheadProps = {
  time: number;
};

export const Playhead = ({ time }: PlayheadProps) => {
  // scrollLeft is the scroll position of the ruler and keyframe list
  const { scrollLeft } = useScrollSync();

  // position is the position of the playhead relative to the scroll position
  const position = useMemo(() => time - scrollLeft, [time, scrollLeft]);

  // Hide the playhead if it's outside the visible area
  // left side: position < -(PADDING + HEAD_WIDTH)
  // right side: position > window.innerWidth - (LEFT_OFFSET - HEAD_WIDTH)
  const isHidden = useMemo(
    () => position < -(PADDING + HEAD_WIDTH) || position > window.innerWidth - (LEFT_OFFSET - HEAD_WIDTH),
    [position],
  );

  // Calculate the position of the playhead
  const playheadStyle = useMemo(
    () => ({
      transform: `translateX(calc(${position}px - 50%))`,
      left: `${LEFT_OFFSET}px`,
    }),
    [position],
  );

  return (
    <div
      className={`absolute left-[${LEFT_OFFSET}px] h-full border-l-2 border-solid border-yellow-600 ${
        isHidden ? "hidden" : ""
      }`}
      data-testid="playhead"
      style={playheadStyle}
    >
      <div className="absolute border-solid border-[5px] border-transparent border-t-yellow-600 -translate-x-1.5" />
    </div>
  );
};
