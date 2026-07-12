import { useState, useEffect, useCallback } from "react";
import { Department } from "../types";
import { apiRequest } from "../lib/api";

export function useGovernance() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<Department[]>("/api/governance/departments");
      setDepartments(data);
    } catch (err: any) {
      setError(err.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  }, []);

  const addDepartment = useCallback(async (deptData: Partial<Department>) => {
    setError(null);
    try {
      const newDept = await apiRequest<Department>("/api/governance/departments", {
        method: "POST",
        body: JSON.stringify(deptData),
      });
      setDepartments((prev) => [...prev, newDept]);
      return newDept;
    } catch (err: any) {
      setError(err.message || "Failed to add department");
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return {
    departments,
    loading,
    error,
    refreshDepartments: fetchDepartments,
    addDepartment,
  };
}
