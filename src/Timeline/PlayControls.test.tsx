import { render, screen, fireEvent } from "@testing-library/react";
import { PlayControls } from "./PlayControls";
import { MAXIMUM_DURATION_VALUE, MINIMUM_DURATION_VALUE, TIME_STEP } from "./Timeline.constants";

describe("PlayControls", () => {
  const defaultProps = {
    time: 1000,
    setTime: jest.fn(),
    duration: 5000,
    setDuration: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render successfully", () => {
    render(<PlayControls {...defaultProps} />);
    expect(screen.getByTestId("play-controls")).toBeInTheDocument();
  });

  it("should display current time value", () => {
    render(<PlayControls {...defaultProps} />);
    const timeInput = screen.getByTestId("current-time-input");
    expect(timeInput).toHaveValue(1000);
  });

  it("should call setTime with clamped value when changed", () => {
    render(<PlayControls {...defaultProps} />);
    const timeInput = screen.getByTestId("current-time-input");

    fireEvent.change(timeInput, { target: { value: "2000" } });
    fireEvent.blur(timeInput);
    expect(defaultProps.setTime).toHaveBeenCalledWith(2000);
  });

  it("should clamp time to duration when exceeding it", () => {
    render(<PlayControls {...defaultProps} />);
    const timeInput = screen.getByTestId("current-time-input");

    fireEvent.change(timeInput, { target: { value: "6000" } });
    fireEvent.blur(timeInput);
    expect(defaultProps.setTime).toHaveBeenCalledWith(5000);
  });

  it("should display duration value", () => {
    render(<PlayControls {...defaultProps} />);
    const durationInput = screen.getByTestId("duration-input");
    expect(durationInput).toHaveValue(5000);
  });

  it("should call setDuration with clamped value when changed", () => {
    render(<PlayControls {...defaultProps} />);
    const durationInput = screen.getByTestId("duration-input");

    fireEvent.change(durationInput, { target: { value: "3000" } });
    fireEvent.blur(durationInput);
    expect(defaultProps.setDuration).toHaveBeenCalledWith(3000);
  });

  it("should clamp duration to MAXIMUM_DURATION_VALUE", () => {
    render(<PlayControls {...defaultProps} />);
    const durationInput = screen.getByTestId("duration-input");

    fireEvent.change(durationInput, { target: { value: String(MAXIMUM_DURATION_VALUE + 1000) } });
    fireEvent.blur(durationInput);
    expect(defaultProps.setDuration).toHaveBeenCalledWith(MAXIMUM_DURATION_VALUE);
  });

  it("should clamp duration to MINIMUM_DURATION_VALUE", () => {
    render(<PlayControls {...defaultProps} />);
    const durationInput = screen.getByTestId("duration-input");

    fireEvent.change(durationInput, { target: { value: String(MINIMUM_DURATION_VALUE - 1000) } });
    fireEvent.blur(durationInput);
    expect(defaultProps.setDuration).toHaveBeenCalledWith(MINIMUM_DURATION_VALUE);
  });

  it("should adjust current time when new duration is less than current time", () => {
    render(<PlayControls {...defaultProps} />);
    const durationInput = screen.getByTestId("duration-input");

    fireEvent.change(durationInput, { target: { value: "500" } });
    fireEvent.blur(durationInput);
    expect(defaultProps.setDuration).toHaveBeenCalledWith(500);
    expect(defaultProps.setTime).toHaveBeenCalledWith(500);
  });

  it("should respect TIME_STEP for both inputs", () => {
    render(<PlayControls {...defaultProps} />);
    const timeInput = screen.getByTestId("current-time-input");
    const durationInput = screen.getByTestId("duration-input");

    expect(timeInput).toHaveAttribute("step", String(TIME_STEP));
    expect(durationInput).toHaveAttribute("step", String(TIME_STEP));
  });
});
