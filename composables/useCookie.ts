import { ref, computed, watchEffect } from "vue";
import type { ApiResponse, UserSession } from "~/utils/model";

interface SessionOptions {
  autoRefresh?: boolean;
  refreshThresholdMinutes?: number;
}

const LOCAL_STORAGE_KEY = "user_session";

export const useAppSession = () => {
  const getStoredSession = (): UserSession | null => {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    try {
      const session = JSON.parse(raw) as UserSession;
      // Check if session is expired
      if (new Date(session.expiresIn).getTime() <= Date.now()) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return null;
      }
      return session;
    } catch {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return null;
    }
  };

  const storeSession = (session: UserSession | null) => {
    if (session) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const session = ref<UserSession | null>(getStoredSession());

  // Keep localStorage in sync if session changes
  watchEffect(() => {
    storeSession(session.value);
  });

  const isAuthenticated = computed(() => {
    if (!session.value) return false;

    // Check if session is expired
    const expiresIn = new Date(session.value.expiresIn).getTime();
    const now = Date.now();

    if (expiresIn <= now) {
      // Session expired, clear it
      session.value = null;
      return false;
    }

    return true;
  });

  const updateSession = (newSession: UserSession | null) => {
    session.value = newSession;
  };

  const getSession = async (
    options: SessionOptions = {}
  ): Promise<ApiResponse<UserSession>> => {
    const { autoRefresh = false, refreshThresholdMinutes = 10 } = options;

    if (!session.value) {
      return {
        ok: false,
        data: undefined,
        error: { message: "No active session" },
      };
    }

    const expiresIn = new Date(session.value.expiresIn).getTime();
    const now = Date.now();
    const thresholdMs = refreshThresholdMinutes * 60 * 1000;

    // Check if session is expired
    if (expiresIn <= now) {
      session.value = null;
      return {
        ok: false,
        data: undefined,
        error: { message: "Session expired" },
      };
    }

    if (autoRefresh && expiresIn - now < thresholdMs) {
      // Optionally add refresh logic here
    }

    return {
      ok: true,
      data: session.value,
    };
  };

  const clearSession = () => {
    session.value = null;
  };

  const setItem = <T>(key: string, value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getItem = <T>(key: string): T | null => {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  };

  return {
    session,
    isAuthenticated,
    getSession,
    updateSession,
    clearSession,
    setItem,
    getItem,
  };
};
