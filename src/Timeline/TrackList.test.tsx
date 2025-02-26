import { fireEvent, render, screen } from "@testing-library/react";

import { TRACK_LETTERS, TrackList } from "./TrackList";
import { useScrollSync } from "./ScrollSync";

jest.mock("./ScrollSync", () => ({
  useScrollSync: jest.fn(),
}));

const mockUseScrollSync = useScrollSync as jest.Mock;
const mockTrackListRef = { current: { scrollTop: 0 } };
const mockHandleTrackListScroll = jest.fn();

describe("TrackList", () => {
  beforeEach(() => {
    mockUseScrollSync.mockReturnValue({
      trackListRef: mockTrackListRef,
      handleTrackListScroll: mockHandleTrackListScroll,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render successfully", () => {
    render(<TrackList />);
    expect(screen.getByTestId("track-list")).toBeInTheDocument();
  });

  it("should render 10 children", () => {
    render(<TrackList />);
    expect(screen.getByTestId("track-list").children.length).toBe(10);
  });

  it("should render tracks from A to J", () => {
    render(<TrackList />);

    TRACK_LETTERS.forEach((letter) => {
      expect(screen.getByText(`Track ${letter}`)).toBeInTheDocument();
    });
  });

  it("should call scroll handler when scrolling", () => {
    render(<TrackList />);
    const keyframeList = screen.getByTestId("track-list");

    fireEvent.scroll(keyframeList, { target: { scrollLeft: 100 } });

    expect(mockHandleTrackListScroll).toHaveBeenCalled();
  });
});
