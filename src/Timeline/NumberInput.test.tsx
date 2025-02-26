import { render, screen, fireEvent } from "@testing-library/react";
import { NumberInput } from "./NumberInput";

describe("NumberInput", () => {
  const defaultProps = {
    dataTestId: "test-input",
    min: 0,
    max: 1000,
    label: "Test Label",
    value: 100,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render successfully", () => {
    render(<NumberInput {...defaultProps} />);
    expect(screen.getByTestId("test-input")).toBeInTheDocument();
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("should handle arrow key interactions", () => {
    render(<NumberInput {...defaultProps} step={10} />);
    const input = screen.getByTestId("test-input");

    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(defaultProps.onChange).toHaveBeenCalledWith(110);
  });

  it("should respect min/max constraints", () => {
    render(<NumberInput {...defaultProps} min={0} max={200} value={190} />);
    const input = screen.getByTestId("test-input");

    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(defaultProps.onChange).toHaveBeenCalledWith(200);
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(defaultProps.onChange).toHaveBeenLastCalledWith(200);
  });

  it("should handle direct input changes", () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId("test-input");

    fireEvent.change(input, { target: { value: "150" } });
    fireEvent.blur(input);
    expect(defaultProps.onChange).toHaveBeenCalledWith(150);
  });

  it("should handle escape key", () => {
    render(<NumberInput {...defaultProps} value={100} />);
    const input = screen.getByTestId("test-input");

    fireEvent.change(input, { target: { value: "150" } });
    fireEvent.keyDown(input, { key: "Escape" });

    expect(defaultProps.onChange).toHaveBeenCalledWith(100);
  });

  it("should handle enter key", () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId("test-input");

    fireEvent.change(input, { target: { value: "150" } });
    fireEvent.blur(input);
    fireEvent.keyDown(input, { key: "Enter" });

    expect(defaultProps.onChange).toHaveBeenCalledWith(150);
  });

  it("should automatically select text on focus", () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId("test-input");

    const mockSelect = jest.fn();
    input.onselect = mockSelect;

    fireEvent.focus(input);
    expect(mockSelect).toHaveBeenCalled();
  });
});
