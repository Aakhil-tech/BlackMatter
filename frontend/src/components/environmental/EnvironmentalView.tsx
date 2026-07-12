import React, { useState } from "react";
import { useEnvironmental } from "../../hooks/useEnvironmental";
import { EnvironmentalGoal } from "../../types";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Leaf, 
  AlertCircle, 
  Loader2, 
  Check, 
  FileSpreadsheet, 
  TrendingDown, 
  FileCheck2 
} from "lucide-react";

export default function EnvironmentalView() {
  const { goals, loading, error, addGoal, deleteGoal } = useEnvironmental();
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form fields
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("Supply Chain");
  const [targetCO2, setTargetCO2] = useState("800");
  const [currentCO2, setCurrentCO2] = useState("650");
  const [deadline, setDeadline] = useState("Q4 2024");
  const [status, setStatus] = useState<"On Track" | "Active" | "Completed">("On Track");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addGoal({
        name,
        department,
        target_co2: Number(targetCO2),
        current_co2: Number(currentCO2),
        deadline,
        status,
      });
      setIsModalOpen(false);
      // Reset form
      setName("");
      setDepartment("Supply Chain");
      setTargetCO2("800");
      setCurrentCO2("650");
      setStatus("On Track");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (selectedGoalId) {
      try {
        await deleteGoal(selectedGoalId);
        setSelectedGoalId(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Environmental: Emission Tracking & Goals</h2>
        <p className="text-on-surface-variant text-sm mt-1">
          Monitor and manage your organization's ecological footprint and carbon output.
        </p>
      </div>

      {/* Sub-navigation */}
      <div className="flex overflow-x-auto pb-1 gap-2 no-scrollbar border-b border-white/5">
        <button className="px-5 py-2.5 rounded-full text-xs font-semibold text-on-surface-variant hover:text-white hover:bg-white/5 transition-all whitespace-nowrap">
          Emission Factors
        </button>
        <button className="px-5 py-2.5 rounded-full text-xs font-semibold text-on-surface-variant hover:text-white hover:bg-white/5 transition-all whitespace-nowrap">
          Product ESG Profiles
        </button>
        <button className="px-5 py-2.5 rounded-full text-xs font-semibold text-on-surface-variant hover:text-white hover:bg-white/5 transition-all whitespace-nowrap">
          Carbon Transactions
        </button>
        <button className="px-5 py-2.5 rounded-full text-xs font-bold text-crust bg-green-env hover:bg-green-env/90 shadow-lg shadow-green-env/15 border border-transparent whitespace-nowrap">
          Environmental Goals
        </button>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="flex gap-2.5">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-mauve hover:bg-mauve/90 text-crust rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Goal</span>
          </button>
          
          <button 
            disabled={!selectedGoalId}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border rounded-xl transition-all ${
              selectedGoalId 
                ? "border-white/10 hover:bg-white/5 text-white" 
                : "border-white/5 text-on-surface-variant cursor-not-allowed opacity-50"
            }`}
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>

          <button 
            onClick={handleDelete}
            disabled={!selectedGoalId}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border rounded-xl transition-all ${
              selectedGoalId 
                ? "border-red-err/20 hover:bg-red-err/10 text-red-err" 
                : "border-white/5 text-on-surface-variant cursor-not-allowed opacity-50"
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Table Panel */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Name</th>
                <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Department</th>
                <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Target CO2</th>
                <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Current CO2</th>
                <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Progress</th>
                <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Deadline</th>
                <th className="py-4 px-6 text-xs font-bold text-on-surface-wider uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-white">
              {loading && goals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center">
                    <Loader2 className="w-6 h-6 text-mauve animate-spin mx-auto" />
                  </td>
                </tr>
              ) : goals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-on-surface-variant font-medium">
                    No environmental goals found. Create a new one!
                  </td>
                </tr>
              ) : (
                goals.map((g) => {
                  const isSelected = selectedGoalId === g.id;
                  
                  // Progress Pct calculation
                  const target = g.target_co2;
                  const current = g.current_co2;
                  let pct = Math.round((current / target) * 100);
                  if (pct > 100) pct = 100;

                  // Status badge style selection
                  const statusStyles = 
                    g.status === "On Track" ? "bg-green-env/10 text-green-env border-green-env/20" :
                    g.status === "Active" ? "bg-sapphire/10 text-sapphire border-sapphire/20" :
                    "bg-mauve/10 text-mauve border-mauve/20";

                  const progressColor = 
                    g.status === "On Track" ? "bg-green-env shadow-[0_0_8px_rgba(166,227,161,0.4)]" :
                    g.status === "Active" ? "bg-sapphire shadow-[0_0_8px_rgba(116,199,236,0.4)]" :
                    "bg-mauve shadow-[0_0_8px_rgba(203,166,247,0.4)]";

                  return (
                    <tr 
                      key={g.id}
                      onClick={() => setSelectedGoalId(isSelected ? null : g.id)}
                      className={`hover:bg-white/[0.02] cursor-pointer transition-colors ${
                        isSelected ? "bg-white/[0.04]" : ""
                      }`}
                    >
                      <td className="py-4 px-6 font-semibold flex items-center gap-2">
                        {isSelected && <Check className="w-4 h-4 text-green-env" />}
                        <span>{g.name}</span>
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant font-medium">{g.department}</td>
                      <td className="py-4 px-6 font-mono">{g.target_co2.toLocaleString()} t</td>
                      <td className="py-4 px-6 font-mono text-on-surface-variant">{g.current_co2.toLocaleString()} t</td>
                      <td className="py-4 px-6 min-w-[180px]">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${progressColor} rounded-full transition-all duration-500`} 
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="font-bold text-xs w-8">{pct}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant">{g.deadline}</td>
                      <td className="py-4 px-6 text-right">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusStyles}`}>
                          {g.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-crust/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-mantle border border-white/5 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-env" />
                <span>Create Environmental Goal</span>
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
                <label className="text-xs text-on-surface-variant font-semibold uppercase">Goal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-crust border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-green-env focus:ring-1 focus:ring-green-env/50 outline-none"
                  placeholder="e.g., Reduce peak electricity output"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-on-surface-variant font-semibold uppercase">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-crust border border-white/10 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-green-env focus:ring-1 focus:ring-green-env/50 outline-none"
                  >
                    <option>Supply Chain</option>
                    <option>Product Design</option>
                    <option>Facilities</option>
                    <option>Operations</option>
                    <option>Corporate</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-on-surface-variant font-semibold uppercase">Deadline</label>
                  <input
                    type="text"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-crust border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-green-env focus:ring-1 focus:ring-green-env/50 outline-none"
                    placeholder="e.g. Q4 2024"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-on-surface-variant font-semibold uppercase">Target CO2 (t)</label>
                  <input
                    type="number"
                    value={targetCO2}
                    onChange={(e) => setTargetCO2(e.target.value)}
                    className="w-full bg-crust border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-green-env"
                    required
                    min="1"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-on-surface-variant font-semibold uppercase">Current CO2 (t)</label>
                  <input
                    type="number"
                    value={currentCO2}
                    onChange={(e) => setCurrentCO2(e.target.value)}
                    className="w-full bg-crust border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-green-env"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-on-surface-variant font-semibold uppercase">Status Indicator</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-crust border border-white/10 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-green-env"
                >
                  <option value="On Track">On Track</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
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
                  className="px-5 py-2 bg-green-env text-crust font-semibold rounded-xl hover:bg-green-env/90 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
