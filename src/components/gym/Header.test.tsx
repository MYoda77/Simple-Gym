import { describe, it, expect, jest } from "@jest/globals";
import { render, screen, userEvent } from "@/__tests__/test-utils";
import Header from "@/components/gym/Header";
import { ViewType } from "@/types/gym";

// Mock useAuth
jest.mock("@/lib/useAuth", () => ({
  useAuth: () => ({
    user: { id: "test-user", email: "test@example.com" },
    signOut: jest.fn(),
  }),
}));

describe("Header", () => {
  const defaultProps = {
    currentView: "dashboard" as ViewType,
    setCurrentView: jest.fn(),
    mobileMenuOpen: false,
    setMobileMenuOpen: jest.fn(),
    exportData: jest.fn(),
    importData: jest.fn(),
    resetAllData: jest.fn(),
    onProgressClick: jest.fn(),
  };

  it("should render the header with title", () => {
    render(<Header {...defaultProps} />); // @ts-ignore - jest-dom matcher    expect(screen.getByText("Simple gym")).toBeInTheDocument();
  });

  it("should display navigation items", () => {
    render(<Header {...defaultProps} />);
    // @ts-ignore - jest-dom matcher
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    // @ts-ignore - jest-dom matcher
    expect(screen.getByText("Calendar")).toBeInTheDocument();
    // @ts-ignore - jest-dom matcher
    expect(screen.getByText("Workouts")).toBeInTheDocument();
    // @ts-ignore - jest-dom matcher
    expect(screen.getByText("Exercises")).toBeInTheDocument();
  });

  it("should highlight current view", () => {
    render(<Header {...defaultProps} currentView="workouts" />);
    const workoutsButton = screen.getByText("Workouts");
    // Button with hero variant should have specific classes    // @ts-ignore - jest-dom matcher    expect(workoutsButton.closest("button")).toHaveClass("bg-primary");
  });

  it("should call setCurrentView when navigation item is clicked", async () => {
    const setCurrentView = jest.fn();
    const user = userEvent.setup();

    render(<Header {...defaultProps} setCurrentView={setCurrentView} />);

    await user.click(screen.getByText("Workouts"));
    expect(setCurrentView).toHaveBeenCalledWith("workouts");
  });

  it("should call onProgressClick when Progress button is clicked", async () => {
    const onProgressClick = jest.fn();
    const user = userEvent.setup();

    render(<Header {...defaultProps} onProgressClick={onProgressClick} />);

    await user.click(screen.getByText("Progress"));
    expect(onProgressClick).toHaveBeenCalled();
  });

  it("should display app logo", () => {
    render(<Header {...defaultProps} />);
    const logo = screen.getByText("Simple gym").previousSibling; // @ts-ignore - jest-dom matcher    expect(logo).toBeInTheDocument();
  });
});
