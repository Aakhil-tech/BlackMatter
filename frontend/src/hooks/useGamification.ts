import { useState, useEffect, useCallback } from "react";
import { Challenge } from "../types";
import { apiRequest } from "../lib/api";

export function useGamification() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<Challenge[]>("/api/gamification/challenges");
      setChallenges(data);
    } catch (err: any) {
      setError(err.message || "Failed to load challenges");
    } finally {
      setLoading(false);
    }
  }, []);

  const joinChallenge = useCallback(async (id: string) => {
    setError(null);
    try {
      await apiRequest(`/api/gamification/challenges/${id}/join`, {
        method: "POST",
      });
      // Refresh list to update active state
      await fetchChallenges();
    } catch (err: any) {
      setError(err.message || "Failed to join challenge");
      throw err;
    }
  }, [fetchChallenges]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  return {
    challenges,
    loading,
    error,
    refreshChallenges: fetchChallenges,
    joinChallenge,
  };
}
