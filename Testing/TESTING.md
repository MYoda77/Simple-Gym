# Testing Guide for SimpleGym

## Overview

This project uses Jest and React Testing Library for testing. The testing setup includes:

- **Jest**: Test runner and assertion library
- **React Testing Library**: For testing React components
- **@testing-library/user-event**: For simulating user interactions
- **ts-jest**: TypeScript support for Jest

## Running Tests

### Available Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode (for continuous integration)
npm run test:ci
```

## Test Structure

### Directory Structure

```
src/
├── __mocks__/              # Mock files for external dependencies
│   ├── fileMock.js         # Mock for static assets
│   ├── supabase-api.ts     # Mock for Supabase API
│   └── @supabase/
│       └── supabase-js.ts  # Mock for Supabase client
├── __tests__/              # Test utilities and fixtures
│   ├── test-utils.tsx      # Custom render function with providers
│   └── fixtures.ts         # Mock data for tests
├── components/             # Component test files (*.test.tsx)
├── hooks/                  # Hook test files (*.test.tsx)
├── utils/                  # Utility test files (*.test.ts)
└── lib/                    # Library test files (*.test.tsx)
```

### Test File Naming

- Component tests: `ComponentName.test.tsx`
- Hook tests: `useHookName.test.tsx`
- Utility tests: `utilityName.test.ts`

## Writing Tests

### Basic Component Test

```typescript
import { render, screen } from "@/__tests__/test-utils";
import { MyComponent } from "@/components/MyComponent";

describe("MyComponent", () => {
  it("should render correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

### Testing User Interactions

```typescript
import { render, screen } from "@/__tests__/test-utils";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("should handle clicks", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByText("Click me"));

    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Testing Custom Hooks

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { useWorkoutTemplates } from "@/hooks/useWorkoutTemplates-COMPATIBLE";

describe("useWorkoutTemplates", () => {
  it("should fetch workouts", async () => {
    const { result } = renderHook(() => useWorkoutTemplates());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.workouts).toBeDefined();
  });
});
```

### Using Mock Data

```typescript
import { mockUser, mockWorkout } from "@/__tests__/fixtures";

describe("MyComponent", () => {
  it("should display workout data", () => {
    render(<WorkoutCard workout={mockWorkout} />);
    expect(screen.getByText(mockWorkout.name)).toBeInTheDocument();
  });
});
```

## Mocking

### Mocking Supabase

The Supabase client is automatically mocked in `src/__mocks__/@supabase/supabase-js.ts`.

For specific tests, you can customize the mock:

```typescript
import { mockSupabaseClient } from "@/__mocks__/@supabase/supabase-js";

beforeEach(() => {
  mockSupabaseClient.from("workouts").select.mockResolvedValue({
    data: [mockWorkout],
    error: null,
  });
});
```

### Mocking API Calls

API calls are mocked in `src/__mocks__/supabase-api.ts`:

```typescript
import { workoutsAPI } from "@/lib/supabase-api";

jest.mock("@/lib/supabase-api", () => ({
  workoutsAPI: {
    getAll: jest.fn().mockResolvedValue([mockWorkout]),
  },
}));
```

### Mocking React Router

The custom render function in `test-utils.tsx` automatically wraps components with `BrowserRouter`.

### Mocking Authentication

```typescript
jest.mock("@/lib/useAuth", () => ({
  useAuth: () => ({
    user: mockUser,
    loading: false,
    signIn: jest.fn(),
    signOut: jest.fn(),
  }),
}));
```

## Best Practices

### 1. Test User Behavior, Not Implementation

❌ Bad:

```typescript
expect(component.state.isOpen).toBe(true);
```

✅ Good:

```typescript
expect(screen.getByRole("dialog")).toBeVisible();
```

### 2. Use Semantic Queries

Prefer queries in this order:

1. `getByRole` - Most accessible
2. `getByLabelText` - Good for forms
3. `getByPlaceholderText` - For inputs
4. `getByText` - For non-interactive elements
5. `getByTestId` - Last resort

### 3. Use `waitFor` for Async Operations

```typescript
await waitFor(() => {
  expect(screen.getByText("Loaded")).toBeInTheDocument();
});
```

### 4. Clean Up After Tests

```typescript
afterEach(() => {
  jest.clearAllMocks();
});
```

### 5. Test Accessibility

```typescript
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

it("should have no accessibility violations", async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Coverage Goals

Current coverage thresholds are set to 50% for all metrics:

- Branches: 50%
- Functions: 50%
- Lines: 50%
- Statements: 50%

To view detailed coverage:

```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory.

## Common Issues

### Issue: "Cannot find module"

**Solution**: Check that module path aliases are correctly configured in `jest.config.js`:

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

### Issue: "window.matchMedia is not a function"

**Solution**: This is handled in `jest.setup.ts`. If you see this error, ensure the setup file is loaded.

### Issue: Tests timeout

**Solution**: Increase timeout for specific tests:

```typescript
it("should complete", async () => {
  // test code
}, 10000); // 10 second timeout
```

## CI/CD Integration

For GitHub Actions or other CI systems, use:

```bash
npm run test:ci
```

This runs tests with:

- `--ci` flag for optimized CI performance
- `--coverage` for code coverage reports
- `--maxWorkers=2` to limit resource usage

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [jest-dom Matchers](https://github.com/testing-library/jest-dom)

## Next Steps

To expand test coverage:

1. Add tests for remaining components in `src/components/`
2. Test error handling and edge cases
3. Add integration tests for user flows
4. Test responsive behavior with different screen sizes
5. Add visual regression tests with tools like Percy or Chromatic
