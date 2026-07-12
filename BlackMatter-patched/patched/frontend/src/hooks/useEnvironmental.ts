import { useState, useEffect, useCallback } from "react";
import { EnvironmentalGoal } from "../types";
import { apiRequest } from "../lib/api";

export function useEnvironmental() {
  const [goals, setGoals] = useState<EnvironmentalGoal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<EnvironmentalGoal[]>("/api/environmental/goals");
      setGoals(data);
    } catch (err: any) {
      setError(err.message || "Failed to load environmental goals");
    } finally {
      setLoading(false);
    }
  }, []);

  const addGoal = useCallback(async (goalData: Partial<EnvironmentalGoal>) => {
    setError(null);
    try {
      const newGoal = await apiRequest<EnvironmentalGoal>("/api/environmental/goals", {
        method: "POST",
        body: JSON.stringify(goalData),
      });
      setGoals((prev) => [newGoal, ...prev]);
      return newGoal;
    } catch (err: any) {
      setError(err.message || "Failed to add environmental goal");
      throw err;
    }
  }, []);

  const deleteGoal = useCallback(async (id: string) => {
    setError(null);
    try {
      await apiRequest(`/api/environmental/goals/${id}`, {
        method: "DELETE",
      });
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete environmental goal");
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goals,
    loading,
    error,
    refreshGoals: fetchGoals,
    addGoal,
    deleteGoal,
  };
}
