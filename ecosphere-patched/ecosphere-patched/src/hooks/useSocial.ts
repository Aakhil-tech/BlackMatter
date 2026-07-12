import { useState, useEffect, useCallback } from "react";
import { CSRActivity, ApprovalRequest } from "../types";
import { apiRequest } from "../lib/api";

// Raw backend shapes (different from frontend display types)
interface BackendCSRActivity {
  id: number;
  title: string;
  category_id: number;
  points_reward: number;
  start_date: string;
  end_date: string | null;
  status: string;
  department_id: number | null;
  description: string | null;
}

interface BackendParticipation {
  id: number;
  employee_id: number;
  activity_id: number;
  approval_status: "pending" | "approved" | "rejected";
  points_earned: number;
  completion_date: string | null;
  approved_by_employee_id: number | null;
  proof_url: string | null;
}

// Map backend activity -> frontend CSRActivity display shape
function mapActivity(a: BackendCSRActivity): CSRActivity {
  return {
    id: String(a.id),
    name: a.title,
    category: String(a.category_id), // Category name would need a separate lookup
    participants_count: 0,           // Would need a COUNT query; backend doesn't expose this yet
    joined: false,
    avatars: [],
  };
}

// Map backend participation -> frontend ApprovalRequest display shape
function mapParticipation(p: BackendParticipation): ApprovalRequest {
  return {
    id: String(p.id),
    employee_name: `Employee #${p.employee_id}`,   // Full name needs employee join — not in schema yet
    employee_avatar: "",
    activity_name: `Activity #${p.activity_id}`,  // Name needs activity join — not in schema yet
    hours: 0,
    status:
      p.approval_status === "approved"
        ? "Approved"
        : p.approval_status === "rejected"
        ? "Rejected"
        : "Pending",
  };
}

export function useSocial() {
  const [activities, setActivities] = useState<CSRActivity[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [acts, parts] = await Promise.all([
        apiRequest<BackendCSRActivity[]>("/api/social/activities"),
        // Fetch all participations; filter to pending for the approvals panel
        apiRequest<BackendParticipation[]>("/api/social/participations"),
      ]);
      setActivities(acts.map(mapActivity));
      setApprovals(
        parts
          .filter((p) => p.approval_status === "pending")
          .map(mapParticipation)
      );
    } catch (err: any) {
      setError(err.message || "Failed to load social metrics data");
    } finally {
      setLoading(false);
    }
  }, []);

  // "Joining" an activity = creating a participation record for the current employee.
  // HARDCODED employee_id=1 until auth is wired. Replace with JWT sub when ready.
  const joinActivity = useCallback(async (id: string) => {
    setError(null);
    try {
      await apiRequest("/api/social/participations", {
        method: "POST",
        body: JSON.stringify({
          employee_id: 1,
          activity_id: Number(id),
        }),
      });
      await fetchData(); // Refresh to reflect new participation
      return activities.find((a) => a.id === id) as CSRActivity;
    } catch (err: any) {
      setError(err.message || "Failed to join CSR initiative");
      throw err;
    }
  }, [fetchData, activities]);

  // Approve/reject maps to POST /api/social/participations/{id}/approve
  const resolveApproval = useCallback(
    async (id: string, action: "Approved" | "Rejected") => {
      setError(null);
      try {
        const updated = await apiRequest<BackendParticipation>(
          `/api/social/participations/${id}/approve`,
          {
            method: "POST",
            body: JSON.stringify({
              approval_status: action.toLowerCase(),
              approved_by_employee_id: 1, // Replace with JWT sub when auth is wired
            }),
          }
        );
        const mapped = mapParticipation(updated);
        setApprovals((prev) => prev.map((a) => (a.id === id ? mapped : a)));
        return mapped;
      } catch (err: any) {
        setError(err.message || `Failed to ${action.toLowerCase()} participation`);
        throw err;
      }
    },
    []
  );

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
