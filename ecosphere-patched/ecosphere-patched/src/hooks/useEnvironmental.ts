import { useState, useEffect, useCallback } from "react";
import { EnvironmentalGoal } from "../types";
import { apiRequest } from "../lib/api";

// Backend shape from schemas/environmental.py EnvironmentalGoalRead
interface BackendGoal {
  id: number;
  title: string;
  department_id: number | null;
  description: string | null;
  target_metric: string;
  target_value: number;
  current_value: number;
  start_date: string;
  end_date: string;
  status: string;
}

// Map backend -> frontend display type
function mapGoal(g: BackendGoal): EnvironmentalGoal {
  return {
    id: String(g.id),
    name: g.title,
    department: g.department_id ? `Dept #${g.department_id}` : "Org-wide",
    target_co2: g.target_value,
    current_co2: g.current_value,
    deadline: g.end_date,
    status:
      g.status === "completed"
        ? "Completed"
        : g.status === "active"
        ? "Active"
        : "On Track",
  };
}

// Map frontend form -> backend create payload
function toBackendPayload(goalData: Partial<EnvironmentalGoal>) {
  return {
    title: goalData.name || "Untitled Goal",
    target_metric: "kgCO2e",
    target_value: goalData.target_co2 ?? 0,
    current_value: goalData.current_co2 ?? 0,
    start_date: new Date().toISOString().split("T")[0],
    end_date: goalData.deadline || new Date().toISOString().split("T")[0],
    status: goalData.status?.toLowerCase().replace(" ", "_") || "active",
    department_id: null, // future: resolve department name -> id
  };
}

export function useEnvironmental() {
  const [goals, setGoals] = useState<EnvironmentalGoal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<BackendGoal[]>("/api/environmental/goals");
      setGoals(data.map(mapGoal));
    } catch (err: any) {
      setError(err.message || "Failed to load environmental goals");
    } finally {
      setLoading(false);
    }
  }, []);

  const addGoal = useCallback(async (goalData: Partial<EnvironmentalGoal>) => {
    setError(null);
    try {
      const newGoal = await apiRequest<BackendGoal>("/api/environmental/goals", {
        method: "POST",
        body: JSON.stringify(toBackendPayload(goalData)),
      });
      const mapped = mapGoal(newGoal);
      setGoals((prev) => [mapped, ...prev]);
      return mapped;
    } catch (err: any) {
      setError(err.message || "Failed to add environmental goal");
      throw err;
    }
  }, []);

  const deleteGoal = useCallback(async (id: string) => {
    setError(null);
    try {
      // Backend doesn't expose DELETE /goals/{id} yet — optimistic local remove
      // TODO: add DELETE route to api/environmental.py when needed
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
