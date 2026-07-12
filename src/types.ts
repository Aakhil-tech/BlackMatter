/**
 * Schema Binding
 * Strict TypeScript interfaces mirroring the Pydantic schemas in the backend.
 */

// Environmental (environmental.py)
export interface EnvironmentalGoal {
  id: string;
  name: string;
  department: string;
  target_co2: number; // in tonnes
  current_co2: number; // in tonnes
  deadline: string;
  status: "On Track" | "Active" | "Completed";
}

// Social (social.py)
export interface CSRActivity {
  id: string;
  name: string;
  category: string;
  participants_count: number;
  joined: boolean;
  avatars: string[];
}

export interface ApprovalRequest {
  id: string;
  employee_name: string;
  employee_avatar: string;
  activity_name: string;
  hours: number;
  status: "Pending" | "Approved" | "Rejected";
}

// Governance / Settings (governance.py / settings.py)
export interface Department {
  id: string;
  name: string;
  manager: string;
  manager_avatar: string;
  staff_count: number;
  status: "Active" | "Maintenance";
  icon: string; // e.g. "energy_savings_leaf", "water_drop", "diversity_3", "history_edu"
}

// Gamification (gamification.py)
export interface Challenge {
  id: string;
  name: string;
  description: string;
  xp_reward: number;
  days_left: number;
  category: "Environmental" | "Social" | "Governance";
  icon: string;
}

// Reports (reports.py)
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  status: "Ready" | "Updated" | "Review" | "Master";
  category: "Environmental" | "Social" | "Governance" | "ESG Summary";
  progress: number; // simulated generation progress (0 to 100)
}

export interface CustomReportConfig {
  date_range: string;
  departments: string[];
  modules_included: string[];
}

// Dashboard metrics (for the overall views)
export interface DashboardMetrics {
  overall_score: number;
  emissions_trend: { month: string; emissions: number }[];
  top_departments: { name: string; score: number }[];
  csr_allocation: { category: string; value: number; color: string }[];
  total_csr_usd: number;
}
