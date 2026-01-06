import { describe, it, expect, jest } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen, userEvent } from "@/__tests__/test-utils";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("should render button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeTruthy();
  });

  it("should handle click events", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should apply variant styles", () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByText("Delete");
    // @ts-expect-error - jest-dom matcher
    expect(button).toHaveClass("bg-destructive");

    rerender(<Button variant="outline">Cancel</Button>);
    // @ts-expect-error - jest-dom matcher
    expect(screen.getByText("Cancel")).toHaveClass("border");
  });

  it("should apply size classes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    // @ts-expect-error - jest-dom matcher
    expect(screen.getByText("Small")).toHaveClass("h-9");

    rerender(<Button size="lg">Large</Button>);
    // @ts-expect-error - jest-dom matcher
    expect(screen.getByText("Large")).toHaveClass("h-11");
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText("Disabled") as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it("should render as child component when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    const link = screen.getByText("Link Button");
    expect(link.tagName).toBe("A");
    // @ts-expect-error - jest-dom matcher
    expect(link).toHaveAttribute("href", "/test");
  });
});
