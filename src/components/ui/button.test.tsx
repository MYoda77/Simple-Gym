import { describe, it, expect, jest } from "@jest/globals";
import { render, screen, userEvent } from "@/__tests__/test-utils";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("should render button with text", () => {
    render(<Button>Click me</Button>); // @ts-ignore - jest-dom matcher    expect(screen.getByText("Click me")).toBeInTheDocument();
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
    // @ts-ignore - jest-dom matcher
    expect(button).toHaveClass("bg-destructive");

    rerender(<Button variant="outline">Cancel</Button>);
    // @ts-ignore - jest-dom matcher
    expect(screen.getByText("Cancel")).toHaveClass("border");
  });

  it("should apply size classes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    // @ts-ignore - jest-dom matcher
    expect(screen.getByText("Small")).toHaveClass("h-9");

    rerender(<Button size="lg">Large</Button>);
    // @ts-ignore - jest-dom matcher
    expect(screen.getByText("Large")).toHaveClass("h-11");
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>); // @ts-ignore - jest-dom matcher    expect(screen.getByText("Disabled")).toBeDisabled();
  });

  it("should render as child component when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    const link = screen.getByText("Link Button");
    expect(link.tagName).toBe("A"); // @ts-ignore - jest-dom matcher    expect(link).toHaveAttribute("href", "/test");
  });
});
