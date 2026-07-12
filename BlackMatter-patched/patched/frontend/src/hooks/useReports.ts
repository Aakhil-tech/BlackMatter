import { useState, useEffect, useCallback } from "react";
import { ReportTemplate, CustomReportConfig } from "../types";
import { apiRequest } from "../lib/api";

export function useReports() {
  const [reports, setReports] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<ReportTemplate[]>("/api/reports/templates");
      setReports(data);
    } catch (err: any) {
      setError(err.message || "Failed to load report templates");
    } finally {
      setLoading(false);
    }
  }, []);

  const runCustomReport = useCallback(async (config: CustomReportConfig) => {
    setError(null);
    try {
      return await apiRequest("/api/reports/custom", {
        method: "POST",
        body: JSON.stringify(config),
      });
    } catch (err: any) {
      setError(err.message || "Failed to trigger custom report execution");
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    loading,
    error,
    refreshReports: fetchReports,
    runCustomReport,
    setReports,
  };
}
