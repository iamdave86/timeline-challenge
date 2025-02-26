import { fireEvent, render, screen } from "@testing-library/react";

import { Ruler } from "./Ruler";
import { useScrollSync } from "./ScrollSync";

jest.mock("./ScrollSync", () => ({
  useScrollSync: jest.fn(),
}));

const mockUseScrollSync = useScrollSync as jest.Mock;
const mockRulerRef = { current: { scrollLeft: 0 } };
const mockHandleRulerScroll = jest.fn();

describe("Ruler", () => {
  const mockSetTime = jest.fn();

  beforeEach(() => {
    mockUseScrollSync.mockReturnValue({
      rulerRef: mockRulerRef,
      handleRulerScroll: mockHandleRulerScroll,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render successfully", () => {
    render(<Ruler duration={1000} setTime={mockSetTime} />);
    expect(screen.getByTestId("ruler")).toBeInTheDocument();
  });

  it("should render ruler bar with correct width", () => {
    render(<Ruler duration={1000} setTime={mockSetTime} />);
    const rulerBar = screen.getByTestId("ruler-bar");
    expect(rulerBar).toHaveStyle({ width: "1000px" });
  });

  it("should sync scroll between ruler and keyframe list", () => {
    render(<Ruler duration={1000} setTime={mockSetTime} />);
    const ruler = screen.getByTestId("ruler");

    fireEvent.scroll(ruler, { target: { scrollLeft: 100 } });
    expect(mockHandleRulerScroll).toHaveBeenCalled();
  });

  it("should handle mouse interactions correctly", () => {
    const mockClientX = 100;
    render(<Ruler duration={1000} setTime={mockSetTime} />);
    const ruler = screen.getByTestId("ruler");

    const mockRect = { left: 0 };
    jest.spyOn(ruler, "getBoundingClientRect").mockImplementation(() => mockRect as DOMRect);
    jest.spyOn(window, "getComputedStyle").mockImplementation(() => ({ paddingLeft: "0px" } as CSSStyleDeclaration));

    fireEvent.mouseDown(ruler, { clientX: mockClientX });
    expect(mockSetTime).toHaveBeenCalledWith(100);

    fireEvent.mouseMove(ruler, { clientX: mockClientX + 50 });
    expect(mockSetTime).toHaveBeenCalledWith(150);

    fireEvent.mouseUp(ruler);
    fireEvent.mouseMove(ruler, { clientX: mockClientX + 100 });
    expect(mockSetTime).toHaveBeenCalledTimes(2);
  });

  it("should handle event listeners lifecycle", () => {
    const { unmount } = render(<Ruler duration={1000} setTime={mockSetTime} />);
    const ruler = screen.getByTestId("ruler");

    jest.spyOn(window, "getComputedStyle").mockImplementation(() => ({ paddingLeft: "0px" } as CSSStyleDeclaration));

    const addEventListenerSpy = jest.spyOn(ruler, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(ruler, "removeEventListener");

    fireEvent.mouseDown(ruler);
    expect(addEventListenerSpy).toHaveBeenCalledWith("mousemove", expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith("mouseup", expect.any(Function));

    fireEvent.mouseUp(ruler);
    expect(removeEventListenerSpy).toHaveBeenCalledWith("mousemove", expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith("mouseup", expect.any(Function));

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalled();
  });

  it("should respect duration bounds when calculating time", () => {
    render(<Ruler duration={1000} setTime={mockSetTime} />);
    const ruler = screen.getByTestId("ruler");

    jest.spyOn(ruler, "getBoundingClientRect").mockImplementation(() => ({ left: 0 } as DOMRect));
    jest.spyOn(window, "getComputedStyle").mockImplementation(() => ({ paddingLeft: "0px" } as CSSStyleDeclaration));

    fireEvent.mouseDown(ruler, { clientX: -100 });
    expect(mockSetTime).toHaveBeenCalledWith(0);

    fireEvent.mouseDown(ruler, { clientX: 2000 });
    expect(mockSetTime).toHaveBeenCalledWith(1000);
  });
});
