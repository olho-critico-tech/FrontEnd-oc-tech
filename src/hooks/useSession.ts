import { useCallback, useEffect, useState } from "react";
import { fetchSession, requestLogout, type SessionInfo } from "@/lib/auth";

export type SessionState = {
  session: SessionInfo | null;
  loading: boolean;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useSession = (): SessionState => {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const nextSession = await fetchSession();
    setSession(nextSession);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    await requestLogout();
    setSession(null);
  }, []);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      const nextSession = await fetchSession();
      if (!isActive) return;
      setSession(nextSession);
      setLoading(false);
    };

    load();

    return () => {
      isActive = false;
    };
  }, []);

  return {
    session,
    loading,
    isAuthenticated: Boolean(session),
    refresh,
    logout,
  };
};
