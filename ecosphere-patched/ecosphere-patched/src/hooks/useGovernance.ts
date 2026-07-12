import { useState, useEffect, useCallback } from "react";
import { Department } from "../types";
import { apiRequest } from "../lib/api";

// Backend DepartmentCreate/Read shape (from schemas/shared.py)
interface BackendDept {
  id: number;
  name: string;
  code: string;
  head_employee_id: number | null;
  parent_department_id: number | null;
  status: string;
  employee_count: number;
  created_at: string;
}

function mapDept(d: BackendDept): Department {
  return {
    id: String(d.id),
    name: d.name,
    code: d.code,
    employee_count: d.employee_count,
    staff_count: d.employee_count, // alias for display
    status: d.status as any,
    head_employee_id: d.head_employee_id,
    // Display-only fields not in backend — left blank; UI has fallbacks
    manager: undefined,
    manager_avatar: undefined,
    icon: undefined,
  };
}

export function useGovernance() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Departments live at /api/departments (shared router), NOT /api/governance/departments
      const data = await apiRequest<BackendDept[]>("/api/departments");
      setDepartments(data.map(mapDept));
    } catch (err: any) {
      setError(err.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  }, []);

  const addDepartment = useCallback(async (deptData: Partial<Department>) => {
    setError(null);
    try {
      // Only send fields the backend schema accepts; drop display-only ones
      const payload = {
        name: deptData.name,
        code: (deptData as any).code ||
              (deptData.name || "DEPT").toUpperCase().replace(/\s+/g, "_").slice(0, 20),
        status: String(deptData.status || "active").toLowerCase(),
      };
      const newDept = await apiRequest<BackendDept>("/api/departments", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      // Merge display-only fields the UI passed in for immediate render
      const mapped: Department = {
        ...mapDept(newDept),
        manager: (deptData as any).manager,
        manager_avatar: (deptData as any).manager_avatar,
        staff_count: (deptData as any).staff_count ?? newDept.employee_count,
        icon: (deptData as any).icon,
      };
      setDepartments((prev) => [...prev, mapped]);
      return mapped;
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
