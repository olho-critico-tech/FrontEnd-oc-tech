import { useCallback, useEffect, useState } from "react";
import { fetchUserProfile, type UserProfile } from "@/lib/user";

export type UserState = {
  user: UserProfile | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

export const useUser = (): UserState => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const nextUser = await fetchUserProfile();
    setUser(nextUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      const nextUser = await fetchUserProfile();
      if (!isActive) return;
      setUser(nextUser);
      setLoading(false);
    };

    load();

    return () => {
      isActive = false;
    };
  }, []);

  return {
    user,
    loading,
    refresh,
  };
};

