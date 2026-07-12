import React, { useState } from "react";
import { useGovernance } from "../../hooks/useGovernance";
import { 
  Building2, 
  Plus, 
  Settings, 
  Check, 
  Loader2, 
  AlertCircle,
  HelpCircle,
  HeartPulse,
  BrainCircuit,
  Workflow
} from "lucide-react";

export default function SettingsView() {
  const { departments, loading, error, addDepartment } = useGovernance();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [manager, setManager] = useState("");
  const [staffCount, setStaffCount] = useState("24");
  const [status, setStatus] = useState<"Active" | "Maintenance">("Active");
  const [icon, setIcon] = useState("energy_savings_leaf");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Backend DepartmentCreate needs: name, code, status (lowercase)
      // manager and icon are display-only and not stored in backend
      await addDepartment({
        name,
        code: name.toUpperCase().replace(/\s+/g, "_").slice(0, 20),
        status: status === "Active" ? "active" as any : "inactive" as any,
        // Display-only props for local rendering before next fetch
        manager,
        staff_count: Number(staffCount),
        icon,
      });
      setIsModalOpen(false);
      // Reset form
      setName("");
      setManager("");
      setStaffCount("24");
      setStatus("Active");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Organization Settings & Departments</h2>
        <p className="text-on-surface-variant text-sm mt-1">
          Review structural governance boundaries, department operations, and configurations.
        </p>
      </div>

      {/* Bento Grid: Governance Health & System Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Bento 1: Governance Health */}
        <div className="glass-panel p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-env/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-green-env/25 transition-all duration-500" />
          
          <div className="space-y-4 z-10">
            <div className="flex justify-between items-center">
              <div className="p-3 bg-green-env/10 rounded-xl border border-green-env/20 text-green-env">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-green-env/10 text-green-env text-xs font-bold border border-green-env/20">
                STABLE
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Governance Health</h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                All 12 organizational departments are actively reporting within the ESG safety thresholds for Q3.
              </p>
            </div>
          </div>

          <div className="mt-8 z-10 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-on-surface-variant">Safety Coverage</span>
              <span className="text-white">94%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-green-env rounded-full w-[94%]" />
            </div>
          </div>
        </div>

        {/* Bento 2: System Insights */}
        <div className="glass-panel p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-mauve/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-mauve/25 transition-all duration-500" />
          
          <div className="space-y-4 z-10">
            <div className="flex justify-between items-center">
              <div className="p-3 bg-mauve/10 rounded-xl border border-mauve/20 text-mauve">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-mauve/10 text-mauve text-xs font-bold border border-mauve/20">
                OPTIMIZED
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">System Insights</h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Optimizing automated reporting loops saves up to 14% on computation and carbon overhead.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 z-10">
            <div className="p-3 bg-crust border border-white/5 rounded-xl">
              <span className="text-2xl font-extrabold text-mauve">14%</span>
              <p className="text-[9px] text-on-surface-variant uppercase font-semibold mt-1">Efficiency Gain</p>
            </div>
            <div className="p-3 bg-crust border border-white/5 rounded-xl">
              <span className="text-2xl font-extrabold text-white">2.4s</span>
              <p className="text-[9px] text-on-surface-variant uppercase font-semibold mt-1">API Response Latency</p>
            </div>
          </div>
        </div>

      </div>

      {/* Departments Administration */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Department Administration</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-mauve hover:bg-mauve/90 text-crust rounded-xl transition-all shadow-md shadow-mauve/10"
          >
            <Plus className="w-4 h-4" />
            <span>New Department</span>
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-err/10 border border-red-err/20 rounded-xl flex items-center gap-2 text-red-err text-xs">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5 text-on-surface-variant text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Department Name</th>
                  <th className="py-4 px-6">Manager</th>
                  <th className="py-4 px-6">Staff Count</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-white">
                {loading && departments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center">
                      <Loader2 className="w-6 h-6 text-mauve animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : (
                  departments.map((dept) => (
                    <tr key={dept.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 px-6 font-semibold flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <Building2 className="w-4.5 h-4.5 text-mauve" />
                        </div>
                        <span>{dept.name}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10">
                            <img src={dept.manager_avatar || ""} alt={dept.manager || "—"} className="w-full h-full object-cover" />
                          </div>
                          <span className="font-medium text-on-surface-variant">{dept.manager || "—"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-on-surface-variant">{dept.staff_count ?? dept.employee_count ?? 0} members</td>
                      <td className="py-4 px-6 text-right">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          (dept.status === "Active" || dept.status === "active")
                            ? "bg-green-env/10 text-green-env border-green-env/20"
                            : "bg-peach/10 text-peach border-peach/20"
                        }`}>
                          {dept.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* New Department Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-crust/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-mantle border border-white/5 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Workflow className="w-5 h-5 text-mauve" />
                <span>Add Department</span>
              </h4>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-on-surface-variant hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-on-surface-variant font-semibold uppercase">Department Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-crust border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-mauve"
                  placeholder="e.g. Carbon Procurement"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-on-surface-variant font-semibold uppercase">Manager Name</label>
                  <input
                    type="text"
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    className="w-full bg-crust border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-mauve"
                    placeholder="Manager Name"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-on-surface-variant font-semibold uppercase">Staff Count</label>
                  <input
                    type="number"
                    value={staffCount}
                    onChange={(e) => setStaffCount(e.target.value)}
                    className="w-full bg-crust border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-mauve"
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-on-surface-variant font-semibold uppercase">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-crust border border-white/10 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-mauve"
                  >
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-on-surface-variant font-semibold uppercase">Core Icon</label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full bg-crust border border-white/10 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-mauve"
                  >
                    <option value="energy_savings_leaf">Leaf</option>
                    <option value="water_drop">Water Drop</option>
                    <option value="diversity_3">Social Diversity</option>
                    <option value="history_edu">compliance</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-white/10 text-on-surface rounded-xl hover:bg-white/5 transition-all text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-mauve text-crust font-semibold rounded-xl hover:bg-mauve/90 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
