// Mock implementation for testing
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { jest } from "@jest/globals";

export const authAPI = {
  getCurrentUser: jest.fn().mockResolvedValue(null),
  onAuthStateChange: jest.fn().mockReturnValue({
    data: {
      subscription: {
        id: "test-sub",
        callback: jest.fn(),
        unsubscribe: jest.fn(),
      },
    },
  }),
  signUp: jest.fn().mockResolvedValue({ user: null }),
  signIn: jest.fn().mockResolvedValue({ user: null }),
  signOut: jest.fn().mockResolvedValue(undefined),
  resetPassword: jest.fn().mockResolvedValue(undefined),
};

export const customExercisesAPI = {
  getAll: jest.fn().mockResolvedValue([]),
  create: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue(undefined),
  getById: jest.fn().mockResolvedValue(null),
  search: jest.fn().mockResolvedValue([]),
};

export const exercisesAPI = {
  getAll: jest.fn().mockResolvedValue([]),
  create: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue(undefined),
  getById: jest.fn().mockResolvedValue(null),
};

export const workoutsAPI = {
  getAll: jest.fn().mockResolvedValue([]),
  create: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue(undefined),
  getById: jest.fn().mockResolvedValue(null),
  duplicate: jest.fn().mockResolvedValue({}),
};

export const progressAPI = {
  getAll: jest.fn().mockResolvedValue([]),
  create: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue(undefined),
  getById: jest.fn().mockResolvedValue(null),
  getByDateRange: jest.fn().mockResolvedValue([]),
  getByDate: jest.fn().mockResolvedValue(null),
};

export const scheduleAPI = {
  getAll: jest.fn().mockResolvedValue([]),
  create: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue(undefined),
  getById: jest.fn().mockResolvedValue(null),
  getByDateRange: jest.fn().mockResolvedValue([]),
  getByDate: jest.fn().mockResolvedValue([]),
};

export const workoutSessionsAPI = {
  getAll: jest.fn().mockResolvedValue([]),
  start: jest.fn().mockResolvedValue({ id: "test-session-id" }),
  complete: jest.fn().mockResolvedValue({}),
  updateProgress: jest.fn().mockResolvedValue({}),
  cancel: jest.fn().mockResolvedValue({}),
  getById: jest.fn().mockResolvedValue(null),
  getByDateRange: jest.fn().mockResolvedValue([]),
};

export const sessionsAPI = {
  create: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  complete: jest.fn().mockResolvedValue({}),
  getById: jest.fn().mockResolvedValue(null),
  getRecent: jest.fn().mockResolvedValue([]),
};

export const realtimeAPI = {
  subscribeToExercises: jest.fn().mockReturnValue({
    unsubscribe: jest.fn().mockResolvedValue("ok"),
  }),
  subscribeToWorkouts: jest.fn().mockReturnValue({
    unsubscribe: jest.fn().mockResolvedValue("ok"),
  }),
  subscribeToProgress: jest.fn().mockReturnValue({
    unsubscribe: jest.fn().mockResolvedValue("ok"),
  }),
  subscribeToSchedule: jest.fn().mockReturnValue({
    unsubscribe: jest.fn().mockResolvedValue("ok"),
  }),
  unsubscribe: jest.fn().mockResolvedValue("ok"),
};

export const personalRecordsAPI = {
  getAll: jest.fn().mockResolvedValue([]),
  create: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue(undefined),
};

export const workoutHistoryAPI = {
  getAll: jest.fn().mockResolvedValue([]),
  create: jest.fn().mockResolvedValue({}),
  getById: jest.fn().mockResolvedValue(null),
};

export const activitiesAPI = {
  getAll: jest.fn().mockResolvedValue([]),
  create: jest.fn().mockResolvedValue({}),
};

export const userSettingsAPI = {
  get: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
};
