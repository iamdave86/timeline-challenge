import { render, screen } from "@testing-library/react";
import { Segment } from "./Segment";

describe("Segment", () => {
  it("should render successfully", () => {
    render(<Segment duration={1000} />);
    expect(screen.getByTestId("segment")).toBeInTheDocument();
  });

  it("should render with correct width based on duration prop", () => {
    render(<Segment duration={850} />);
    const segment = screen.getByTestId("segment");
    expect(segment).toHaveStyle({ width: "850px" });
  });
});
