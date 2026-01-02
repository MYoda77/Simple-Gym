import { jest } from "@jest/globals";

export const authAPI = {
  getCurrentUser: jest.fn().mockResolvedValue(null),
  onAuthStateChange: jest.fn().mockReturnValue({
    data: { subscription: { unsubscribe: jest.fn() } },
  }),
  signUp: jest.fn().mockResolvedValue({ user: null }),
  signIn: jest.fn().mockResolvedValue({ user: null }),
  signOut: jest.fn().mockResolvedValue(undefined),
  resetPassword: jest.fn().mockResolvedValue(undefined),
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
};

export const scheduleAPI = {
  getAll: jest.fn().mockResolvedValue([]),
  create: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue(undefined),
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
  subscribeToExercises: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
  subscribeToWorkouts: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
  subscribeToProgress: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
  subscribeToSchedule: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
};
