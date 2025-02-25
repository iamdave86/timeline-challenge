type RulerProps = {
  duration: number;
};

// duration is the total width of the ruler: 1ms = 1px
export const Ruler = ({ duration }: RulerProps) => {
  // TODO: implement mousedown and mousemove to update time and Playhead position

  return (
    <div
      className="px-4 py-2 min-w-0 
      border-b border-solid border-gray-700 
      overflow-x-auto overflow-y-hidden"
      data-testid="ruler"
    >
      <div className="h-6 rounded-md bg-white/25" data-testid="ruler-bar" style={{ width: `${duration}px` }}></div>
    </div>
  );
};
