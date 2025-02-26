import { fireEvent, render, screen } from "@testing-library/react";

import { KeyframeList } from "./KeyframeList";
import { useScrollSync } from "./ScrollSync";

jest.mock("./ScrollSync", () => ({
  useScrollSync: jest.fn(),
}));

const mockUseScrollSync = useScrollSync as jest.Mock;
const mockKeyframeListRef = { current: { scrollLeft: 0, scrollTop: 0 } };
const mockHandleKeyframeListScroll = jest.fn();

describe("KeyframeList", () => {
  beforeEach(() => {
    mockUseScrollSync.mockReturnValue({
      keyframeListRef: mockKeyframeListRef,
      handleKeyframeListScroll: mockHandleKeyframeListScroll,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render successfully", () => {
    render(<KeyframeList duration={800} />);
    expect(screen.getByTestId("keyframe-list")).toBeInTheDocument();
  });

  it("should render 10 Segment component", () => {
    render(<KeyframeList duration={800} />);
    expect(screen.getAllByTestId("segment").length).toBe(10);
  });

  it("should pass correct duration prop to all Segments", () => {
    const duration = 1000;
    render(<KeyframeList duration={duration} />);
    const segments = screen.getAllByTestId("segment");
    segments.forEach((segment) => {
      expect(segment).toHaveStyle({ width: `${duration}px` });
    });
  });

  it("should call scroll handler when scrolling", () => {
    render(<KeyframeList duration={800} />);
    const keyframeList = screen.getByTestId("keyframe-list");

    fireEvent.scroll(keyframeList, { target: { scrollLeft: 100 } });

    expect(mockHandleKeyframeListScroll).toHaveBeenCalled();
  });
});
