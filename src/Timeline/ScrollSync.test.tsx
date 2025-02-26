import { renderHook, act } from "@testing-library/react";
import { ReactNode } from "react";
import { useScrollSync, ScrollSyncProvider } from "./ScrollSync";

describe("ScrollSync", () => {
  const wrapper = ({ children }: { children: ReactNode }) => <ScrollSyncProvider>{children}</ScrollSyncProvider>;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should handle scroll events correctly", async () => {
    const { result } = renderHook(() => useScrollSync(), { wrapper });

    act(() => {
      result.current.handleRulerScroll({
        currentTarget: { scrollLeft: 100 },
      } as React.UIEvent<HTMLDivElement>);
      jest.runAllTimers();
    });

    expect(result.current.scrollLeft).toBe(100);
  });

  it("should sync scroll positions between components", async () => {
    const { result } = renderHook(() => useScrollSync(), { wrapper });

    const mockRuler = { scrollLeft: 0 };
    const mockKeyframeList = { scrollLeft: 0, scrollTop: 0 };
    const mockTrackList = { scrollTop: 0 };

    // Mock the refs properly
    Object.defineProperty(result.current.rulerRef, "current", { value: mockRuler });
    Object.defineProperty(result.current.keyframeListRef, "current", { value: mockKeyframeList });
    Object.defineProperty(result.current.trackListRef, "current", { value: mockTrackList });

    act(() => {
      result.current.handleKeyframeListScroll({
        currentTarget: { scrollLeft: 200, scrollTop: 100 },
      } as React.UIEvent<HTMLDivElement>);
      jest.runAllTimers();
    });

    expect(result.current.scrollLeft).toBe(200);
    expect(mockRuler.scrollLeft).toBe(200);
    expect(mockTrackList.scrollTop).toBe(100);
  });

  it("should sync vertical scroll between keyframe list and track list", async () => {
    const { result } = renderHook(() => useScrollSync(), { wrapper });

    const mockKeyframeList = { scrollLeft: 0, scrollTop: 0 };
    const mockTrackList = { scrollTop: 0 };

    Object.defineProperty(result.current.keyframeListRef, "current", { value: mockKeyframeList });
    Object.defineProperty(result.current.trackListRef, "current", { value: mockTrackList });

    act(() => {
      result.current.handleTrackListScroll({
        currentTarget: { scrollTop: 150 },
      } as React.UIEvent<HTMLDivElement>);
      jest.runAllTimers();
    });

    expect(mockKeyframeList.scrollTop).toBe(150);
  });

  it("should handle multiple scroll events in sequence", async () => {
    const { result } = renderHook(() => useScrollSync(), { wrapper });

    const mockRuler = { scrollLeft: 0 };
    const mockKeyframeList = { scrollLeft: 0, scrollTop: 0 };

    Object.defineProperty(result.current.rulerRef, "current", { value: mockRuler });
    Object.defineProperty(result.current.keyframeListRef, "current", { value: mockKeyframeList });

    act(() => {
      result.current.handleRulerScroll({
        currentTarget: { scrollLeft: 100 },
      } as React.UIEvent<HTMLDivElement>);
      jest.runAllTimers();
    });

    act(() => {
      result.current.handleRulerScroll({
        currentTarget: { scrollLeft: 200 },
      } as React.UIEvent<HTMLDivElement>);
      jest.runAllTimers();
    });

    expect(result.current.scrollLeft).toBe(200);
    expect(mockKeyframeList.scrollLeft).toBe(200);
  });
});
