import { useScrollSync } from "./ScrollSync";

type PlayheadProps = {
  time: number;
};

export const Playhead = ({ time }: PlayheadProps) => {
  // scrollLeft is the scroll position of the ruler and keyframe list
  const { scrollLeft } = useScrollSync();

  return (
    <div
      className="absolute left-[316px] h-full border-l-2 border-solid border-yellow-600"
      data-testid="playhead"
      style={{ transform: `translateX(calc(${time - scrollLeft}px - 50%))` }}
    >
      <div className="absolute border-solid border-[5px] border-transparent border-t-yellow-600 -translate-x-1.5" />
    </div>
  );
};
