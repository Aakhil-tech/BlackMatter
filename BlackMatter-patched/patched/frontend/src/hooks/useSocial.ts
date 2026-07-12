import { useState, useEffect, useCallback } from "react";
import { CSRActivity, ApprovalRequest } from "../types";
import { apiRequest } from "../lib/api";

export function useSocial() {
  const [activities, setActivities] = useState<CSRActivity[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [acts, apprs] = await Promise.all([
        apiRequest<CSRActivity[]>("/api/social/activities"),
        apiRequest<ApprovalRequest[]>("/api/social/approvals"),
      ]);
      setActivities(acts);
      setApprovals(apprs);
    } catch (err: any) {
      setError(err.message || "Failed to load social metrics data");
    } finally {
      setLoading(false);
    }
  }, []);

  const joinActivity = useCallback(async (id: string) => {
    setError(null);
    try {
      const updated = await apiRequest<CSRActivity>(`/api/social/activities/${id}/join`, {
        method: "POST",
      });
      setActivities((prev) => prev.map((a) => (a.id === id ? updated : a)));
      return updated;
    } catch (err: any) {
      setError(err.message || "Failed to join CSR initiative");
      throw err;
    }
  }, []);

  const resolveApproval = useCallback(async (id: string, action: "Approved" | "Rejected") => {
    setError(null);
    try {
      const updated = await apiRequest<ApprovalRequest>(`/api/social/approvals/${id}/action`, {
        method: "POST",
        body: JSON.stringify({ action }),
      });
      setApprovals((prev) => prev.map((a) => (a.id === id ? updated : a)));
      return updated;
    } catch (err: any) {
      setError(err.message || `Failed to ${action.toLowerCase()} employee hours`);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    activities,
    approvals,
    loading,
    error,
    refreshSocial: fetchData,
    joinActivity,
    resolveApproval,
  };
}
