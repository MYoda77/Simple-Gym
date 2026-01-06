/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { AuthProvider, useAuth } from "@/lib/useAuth";
import { mockUser } from "@/__tests__/fixtures";

// Mock the API - must define inline in jest.mock for hoisting
jest.mock("@/lib/supabase-api", () => ({
  authAPI: {
    getCurrentUser: jest.fn(),
    onAuthStateChange: jest.fn(),
    signUp: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    resetPassword: jest.fn(),
  },
}));

// Import the mocked API after jest.mock
import { authAPI } from "@/lib/supabase-api";
const mockAuthAPI = authAPI as jest.Mocked<typeof authAPI>;

describe("useAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it("should initialize with null user and loading true", () => {
    mockAuthAPI.getCurrentUser.mockResolvedValue(null);
    mockAuthAPI.onAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          id: "test-sub",
          callback: jest.fn(),
          unsubscribe: jest.fn(),
        },
      },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it("should sign up a new user", async () => {
    mockAuthAPI.getCurrentUser.mockResolvedValue(null);
    mockAuthAPI.onAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          id: "test-sub",
          callback: jest.fn(),
          unsubscribe: jest.fn(),
        },
      },
    });
    mockAuthAPI.signUp.mockResolvedValue({
      user: mockUser,
      session: null,
    } as any);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signUp(
        "test@example.com",
        "password123",
        "Test User"
      );
    });

    expect(mockAuthAPI.signUp).toHaveBeenCalledWith(
      "test@example.com",
      "password123",
      "Test User"
    );
  });

  it("should sign in a user", async () => {
    mockAuthAPI.getCurrentUser.mockResolvedValue(null);
    mockAuthAPI.onAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          id: "test-sub",
          callback: jest.fn(),
          unsubscribe: jest.fn(),
        },
      },
    });
    mockAuthAPI.signIn.mockResolvedValue({
      user: mockUser,
      session: null,
    } as any);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn("test@example.com", "password123");
    });

    expect(mockAuthAPI.signIn).toHaveBeenCalledWith(
      "test@example.com",
      "password123"
    );
  });

  it("should sign out a user", async () => {
    mockAuthAPI.getCurrentUser.mockResolvedValue(mockUser);
    mockAuthAPI.onAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          id: "test-sub",
          callback: jest.fn(),
          unsubscribe: jest.fn(),
        },
      },
    });
    mockAuthAPI.signOut.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockAuthAPI.signOut).toHaveBeenCalled();
  });

  it("should throw error when used outside AuthProvider", () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow("useAuth must be used within an AuthProvider");
  });
});
