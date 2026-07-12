import { useState, useEffect, useCallback } from "react";
import { Challenge } from "../types";
import { apiRequest } from "../lib/api";

interface BackendChallenge {
  id: number;
  title: string;
  category_id: number;
  description: string | null;
  xp_reward: number;
  difficulty: "easy" | "medium" | "hard";
  evidence_required: boolean;
  deadline: string | null;
  department_id: number | null;
  status: string;
}

const CATEGORY_LABELS: Record<number, "Environmental" | "Social" | "Governance"> = {
  1: "Environmental",
  2: "Social",
  3: "Governance",
};

const DIFFICULTY_ICONS: Record<string, string> = {
  easy: "🌱",
  medium: "⚡",
  hard: "🔥",
};

function daysLeft(deadline: string | null): number {
  if (!deadline) return 30;
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function mapChallenge(c: BackendChallenge): Challenge {
  return {
    id: String(c.id),
    name: c.title,
    description: c.description || "",
    xp_reward: c.xp_reward,
    days_left: daysLeft(c.deadline),
    category: CATEGORY_LABELS[c.category_id] ?? "Environmental",
    icon: DIFFICULTY_ICONS[c.difficulty] ?? "🌿",
  };
}

export function useGamification() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Only fetch ACTIVE challenges for the employee-facing view
      const data = await apiRequest<BackendChallenge[]>(
        "/api/gamification/challenges?status=active"
      );
      setChallenges(data.map(mapChallenge));
    } catch (err: any) {
      setError(err.message || "Failed to load challenges");
    } finally {
      setLoading(false);
    }
  }, []);

  // Join = create a ChallengeParticipation row.
  // HARDCODED employee_id=1 until auth is wired (same as social).
  const joinChallenge = useCallback(async (id: string) => {
    setError(null);
    try {
      await apiRequest("/api/gamification/challenge-participations", {
        method: "POST",
        body: JSON.stringify({
          challenge_id: Number(id),
          employee_id: 1, // Replace with JWT sub when auth is wired
          progress: 0,
        }),
      });
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
