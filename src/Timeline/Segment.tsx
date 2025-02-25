interface SegmentProps {
  duration: number;
}

// duration is the total width of the segment: 1ms = 1px
export const Segment = ({ duration }: SegmentProps) => {
  return (
    <div className="py-2" data-testid="segment" style={{ width: `${duration}px` }}>
      <div className="h-6 rounded-md bg-white/10"></div>
    </div>
  );
};
