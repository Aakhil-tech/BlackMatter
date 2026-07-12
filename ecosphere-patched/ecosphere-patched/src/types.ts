/**
 * Schema Binding
 * TypeScript interfaces aligned with Pydantic schemas in the backend.
 * Backend field names are used as the canonical source; display-only
 * properties (avatar URLs, icons) are optional and may be derived in
 * the component layer.
 */

// Environmental (schemas/environmental.py EnvironmentalGoalRead)
export interface EnvironmentalGoal {
  id: string;
  name: string;           // mapped from backend `title`
  department: string;     // derived from backend `department_id`
  target_co2: number;     // mapped from backend `target_value`
  current_co2: number;    // mapped from backend `current_value`
  deadline: string;       // mapped from backend `end_date`
  status: "On Track" | "Active" | "Completed";
}

// Social (schemas/social.py CSRActivityRead)
export interface CSRActivity {
  id: string;
  name: string;               // mapped from backend `title`
  category: string;           // derived from backend `category_id`
  participants_count: number; // derived; not in schema yet
  joined: boolean;            // derived from participation records
  avatars: string[];          // display-only; not stored in backend
}

export interface ApprovalRequest {
  id: string;
  employee_name: string;    // derived from employee_id lookup
  employee_avatar: string;  // display-only
  activity_name: string;    // derived from activity_id lookup
  hours: number;            // not in schema; placeholder 0
  status: "Pending" | "Approved" | "Rejected";
}

// Shared (schemas/shared.py DepartmentRead)
export interface Department {
  id: string;
  // Backend canonical fields
  name: string;
  code?: string;
  employee_count?: number;  // backend field (was staff_count in old types)
  status: "Active" | "Maintenance" | "active" | "inactive";
  head_employee_id?: number | null;
  // Display-only fields (not from backend)
  manager?: string;
  manager_avatar?: string;
  staff_count?: number;     // alias for employee_count for display
  icon?: string;
}

// Gamification (schemas/gamification.py ChallengeRead)
export interface Challenge {
  id: string;
  name: string;           // mapped from backend `title`
  description: string;
  xp_reward: number;
  days_left: number;      // derived from backend `deadline`
  category: "Environmental" | "Social" | "Governance";
  icon: string;           // derived from backend `difficulty`
}

// Reports (frontend-only catalogue; backend serves binary downloads)
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  status: "Ready" | "Updated" | "Review" | "Master";
  category: "Environmental" | "Social" | "Governance" | "ESG Summary";
  progress: number;
}

export interface CustomReportConfig {
  date_range: string;
  departments: string[];
  modules_included: string[];
}

// Dashboard (api/dashboard.py DashboardMetrics)
export interface DashboardMetrics {
  overall_score: number;
  emissions_trend: { month: string; emissions: number }[];
  top_departments: { name: string; score: number }[];
  csr_allocation: { category: string; value: number; color: string }[];
  total_csr_usd: number;
}
