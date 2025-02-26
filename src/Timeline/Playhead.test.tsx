import { render, screen } from "@testing-library/react";
import { Playhead } from "./Playhead";
import { useScrollSync } from "./ScrollSync";

jest.mock("./ScrollSync", () => ({
  useScrollSync: jest.fn(),
}));

const mockUseScrollSync = useScrollSync as jest.Mock;

describe("Playhead", () => {
  beforeEach(() => {
    mockUseScrollSync.mockReturnValue({ scrollLeft: 0 });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render successfully", () => {
    render(<Playhead time={100} />);
    expect(screen.getByTestId("playhead")).toBeInTheDocument();
  });

  it("should calculate correct transform with no scroll", () => {
    render(<Playhead time={200} />);
    const playhead = screen.getByTestId("playhead");
    expect(playhead).toHaveStyle({
      transform: "translateX(calc(200px - 50%))",
    });
  });

  it("should calculate correct transform with scroll", () => {
    mockUseScrollSync.mockReturnValue({ scrollLeft: 100 });
    render(<Playhead time={300} />);
    const playhead = screen.getByTestId("playhead");
    expect(playhead).toHaveStyle({
      transform: "translateX(calc(200px - 50%))",
    });
  });

  it("should handle zero time value", () => {
    render(<Playhead time={0} />);
    const playhead = screen.getByTestId("playhead");
    expect(playhead).toHaveStyle({
      transform: "translateX(calc(0px - 50%))",
    });
  });

  it("should handle negative scroll values", () => {
    mockUseScrollSync.mockReturnValue({ scrollLeft: -100 });
    render(<Playhead time={100} />);
    const playhead = screen.getByTestId("playhead");
    expect(playhead).toHaveStyle({
      transform: "translateX(calc(200px - 50%))",
    });
  });
});
