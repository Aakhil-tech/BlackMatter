import { useState, useEffect, useCallback } from "react";
import { DashboardMetrics } from "../types";
import { apiRequest } from "../lib/api";

export function useDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<DashboardMetrics>("/api/dashboard/metrics");
      setMetrics(data);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  }, []);

  const logCarbonData = useCallback(async (amount: number) => {
    setError(null);
    try {
      const res = await apiRequest<{ success: boolean; score: number; emissions: any[] }>("/api/dashboard/log-carbon", {
        method: "POST",
        body: JSON.stringify({ amount }),
      });
      if (res.success && metrics) {
        setMetrics({
          ...metrics,
          overall_score: res.score,
          emissions_trend: res.emissions
        });
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to log carbon emission data");
      throw err;
    }
  }, [metrics]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    refreshMetrics: fetchMetrics,
    logCarbonData,
  };
}
