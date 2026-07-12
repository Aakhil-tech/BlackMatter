import { useState, useEffect, useCallback } from "react";
import { ReportTemplate, CustomReportConfig } from "../types";
import { apiRequest } from "../lib/api";

const FALLBACK_TEMPLATES: ReportTemplate[] = [
  { id: "environmental", name: "Environmental Impact Report", description: "Carbon transactions, emission factors, and goal progress", status: "Ready", category: "Environmental", progress: 100 },
  { id: "social", name: "Social Responsibility Report", description: "CSR activity participation and diversity metrics", status: "Ready", category: "Social", progress: 100 },
  { id: "governance", name: "Governance & Compliance Report", description: "Audit findings, ESG policy acknowledgements, compliance issues", status: "Updated", category: "Governance", progress: 100 },
  { id: "esg_summary", name: "ESG Summary Report", description: "Full organisation ESG score with all pillars", status: "Master", category: "ESG Summary", progress: 100 },
];

export function useReports() {
  const [reports, setReports] = useState<ReportTemplate[]>(FALLBACK_TEMPLATES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<ReportTemplate[]>("/api/reports/templates");
      setReports(data);
    } catch (err: any) {
      // Non-fatal — use the fallback static list so the UI still renders
      console.warn("Could not load report templates from backend, using static list:", err.message);
      setReports(FALLBACK_TEMPLATES);
    } finally {
      setLoading(false);
    }
  }, []);

  const runCustomReport = useCallback(async (config: CustomReportConfig) => {
    setError(null);
    try {
      // /api/reports/custom returns 503 until report_service is implemented.
      // The UI should handle the 503 gracefully (toast message, not crash).
      const params = new URLSearchParams({ export_format: "pdf" });
      if (config.date_range) {
        const [from, to] = config.date_range.split(":");
        if (from) params.set("date_from", from);
        if (to) params.set("date_to", to);
      }
      const response = await fetch(`/api/reports/custom?${params}`, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 503) {
        throw new Error("Report generation is not yet available. Check back soon.");
      }
      if (!response.ok) throw new Error(`Report error: ${response.status}`);
      return await response.blob();
    } catch (err: any) {
      setError(err.message || "Failed to generate report");
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, loading, error, refreshReports: fetchReports, runCustomReport, setReports };
}
