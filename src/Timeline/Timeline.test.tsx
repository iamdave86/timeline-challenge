import { render, screen, act } from "@testing-library/react";
import { Timeline } from "./Timeline";
import * as PlayControls from "./PlayControls";
import * as Ruler from "./Ruler";
import * as KeyframeList from "./KeyframeList";
import * as Playhead from "./Playhead";

jest.mock("./ScrollSync", () => ({
  ScrollSyncProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="scroll-sync">{children}</div>,
}));
jest.mock("./PlayControls", () => ({
  PlayControls: jest.fn(() => <div data-testid="play-controls" />),
}));
jest.mock("./Ruler", () => ({
  Ruler: jest.fn(() => <div data-testid="ruler" />),
}));
jest.mock("./TrackList", () => ({
  TrackList: jest.fn(() => <div data-testid="track-list" />),
}));
jest.mock("./KeyframeList", () => ({
  KeyframeList: jest.fn(() => <div data-testid="keyframe-list" />),
}));
jest.mock("./Playhead", () => ({
  Playhead: jest.fn(() => <div data-testid="playhead" />),
}));

describe("Timeline", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render successfully", () => {
    render(<Timeline />);
    expect(screen.getByTestId("timeline")).toBeInTheDocument();
  });

  it("should update time across all components when handleSetTime is called", () => {
    render(<Timeline />);

    const rulerProps = (Ruler.Ruler as jest.Mock).mock.calls[0][0];

    act(() => {
      rulerProps.setTime(500);
    });

    expect(Playhead.Playhead).toHaveBeenCalledWith(expect.objectContaining({ time: 500 }), expect.any(Object));
    expect(PlayControls.PlayControls).toHaveBeenCalledWith(expect.objectContaining({ time: 500 }), expect.any(Object));
  });

  it("should update duration across all components when handleSetDuration is called", () => {
    render(<Timeline />);

    const playControlsProps = (PlayControls.PlayControls as jest.Mock).mock.calls[0][0];

    act(() => {
      playControlsProps.setDuration(3000);
    });

    expect(Ruler.Ruler).toHaveBeenCalledWith(expect.objectContaining({ duration: 3000 }), expect.any(Object));
    expect(KeyframeList.KeyframeList).toHaveBeenCalledWith(
      expect.objectContaining({ duration: 3000 }),
      expect.any(Object),
    );
  });
});
