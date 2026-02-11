"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole } from "@/lib/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  currentProjectId: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  selectRole: (role: UserRole) => void;
  setCurrentProject: (projectId: string) => void;
  logout: () => void;
}

// Mock users for development
const MOCK_USERS: Record<string, User> = {
  producer: {
    id: "usr_001",
    name: "Dil Raju",
    email: "producer@filmglimmora.com",
    role: "producer",
    avatar: undefined,
  },
  director: {
    id: "usr_002",
    name: "Sukumar",
    email: "director@filmglimmora.com",
    role: "director",
    avatar: undefined,
  },
  production_head: {
    id: "usr_003",
    name: "Rajesh Naidu",
    email: "production@filmglimmora.com",
    role: "production_head",
    avatar: undefined,
  },
  vfx_head: {
    id: "usr_004",
    name: "Srinivas Mohan",
    email: "vfx@filmglimmora.com",
    role: "vfx_head",
    avatar: undefined,
  },
  financier: {
    id: "usr_005",
    name: "Allu Aravind",
    email: "investor@filmglimmora.com",
    role: "financier",
    avatar: undefined,
  },
  marketing_head: {
    id: "usr_006",
    name: "Priya Sharma",
    email: "marketing@filmglimmora.com",
    role: "marketing_head",
    avatar: undefined,
  },
  admin: {
    id: "usr_007",
    name: "Admin User",
    email: "admin@filmglimmora.com",
    role: "admin",
    avatar: undefined,
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      currentProjectId: "proj_001",

      login: async (email: string, _password: string) => {
        // Mock login — match by email prefix
        const roleKey = email.split("@")[0];
        const user = MOCK_USERS[roleKey];
        if (user) {
          set({ user, isAuthenticated: true, currentProjectId: "proj_001" });
          return true;
        }
        // Also allow login by any email, default to producer
        set({
          user: { ...MOCK_USERS.producer, email },
          isAuthenticated: true,
          currentProjectId: "proj_001",
        });
        return true;
      },

      selectRole: (role: UserRole) => {
        const user = MOCK_USERS[role];
        if (user) {
          set({ user, isAuthenticated: true });
        }
      },

      setCurrentProject: (projectId: string) => {
        set({ currentProjectId: projectId });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, currentProjectId: null });
      },
    }),
    {
      name: "filmglimmora-auth",
    }
  )
);
