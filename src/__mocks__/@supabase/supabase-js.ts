import { jest } from "@jest/globals";

// Mock Supabase Client
export const mockSupabaseClient = {
  auth: {
    getSession: jest
      .fn()
      .mockResolvedValue({ data: { session: null }, error: null }),
    getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
    signUp: jest
      .fn()
      .mockResolvedValue({ data: { user: null, session: null }, error: null }),
    signInWithPassword: jest
      .fn()
      .mockResolvedValue({ data: { user: null, session: null }, error: null }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
    resetPasswordForEmail: jest
      .fn()
      .mockResolvedValue({ data: {}, error: null }),
    onAuthStateChange: jest.fn().mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    }),
  },
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
  }),
  channel: jest.fn().mockReturnValue({
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn().mockReturnThis(),
  }),
};

// Mock createClient function
export const createClient = jest.fn().mockReturnValue(mockSupabaseClient);

export default {
  createClient,
};
