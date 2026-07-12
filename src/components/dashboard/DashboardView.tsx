import React, { useState } from "react";
import { useDashboard } from "../../hooks/useDashboard";
import { 
  TrendingUp, 
  Plus, 
  ChevronRight, 
  Activity, 
  Globe, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from "lucide-react";

export default function DashboardView() {
  const { metrics, loading, error, logCarbonData } = useDashboard();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logAmount, setLogAmount] = useState("150");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogCarbon = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(logAmount);
    if (!isNaN(val) && val > 0) {
      try {
        await logCarbonData(val);
        setSuccessMsg(`Successfully logged ${val} tCO2e! Overall ESG score updated.`);
        setTimeout(() => setSuccessMsg(""), 4000);
        setIsModalOpen(false);
      } catch (err) {
        console.error("Log error:", err);
      }
    }
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-mauve animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-err/10 border border-red-err/20 rounded-2xl flex items-center gap-3">
        <AlertCircle className="text-red-err shrink-0" />
        <span className="text-sm font-medium">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {successMsg && (
        <div className="p-4 bg-green-env/10 border border-green-env/20 rounded-xl flex items-center gap-2 text-green-env text-sm">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Top Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h2>
          <p className="text-on-surface-variant text-sm mt-1">
            Real-time environmental, social, and governance monitoring metrics.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-peach hover:bg-peach/90 text-crust font-semibold rounded-full transition-all duration-200 transform hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-peach/20"
        >
          <Plus className="w-4 h-4" />
          <span>Log Carbon Data</span>
        </button>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 1. Overall ESG Score Card */}
        <div className="glass-panel col-span-1 md:col-span-4 p-8 flex flex-col justify-between relative overflow-hidden group min-h-[300px]">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-mauve/10 rounded-full blur-[80px] pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>
          
          <div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-white">Overall ESG Score</h3>
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                <Activity className="w-5 h-5 text-mauve" />
              </div>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed max-w-[85%]">
              Comprehensive index evaluating performance metrics across all sustainability categories.
            </p>
          </div>

          <div className="mt-8">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-extrabold tracking-tight bg-gradient-to-br from-mauve to-sapphire bg-clip-text text-transparent">
                {metrics?.overall_score || 81}
              </span>
              <span className="text-lg text-on-surface-variant font-medium">/ 100</span>
            </div>
            <div className="mt-4 flex">
              <div className="px-3 py-1 bg-green-env/15 rounded-full border border-green-env/20 flex items-center gap-1.5 text-green-env text-xs font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+4.2% from last quarter</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Carbon Emissions Trend Chart Card */}
        <div className="glass-panel col-span-1 md:col-span-8 p-8 flex flex-col justify-between min-h-[300px]">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Carbon Emissions Trend</h3>
              <p className="text-on-surface-variant text-xs mt-1">tCO2e generated over the past 6 months</p>
            </div>
            <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
              <button className="px-3 py-1.5 text-xs font-medium bg-crust border border-white/5 text-white rounded-lg transition-all">
                Monthly
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-on-surface-variant hover:text-white rounded-lg transition-all">
                Quarterly
              </button>
            </div>
          </div>

          {/* Simple Custom Mini Chart */}
          <div className="flex-1 min-h-[160px] flex items-end justify-between gap-3 mt-6 pt-4 relative">
            {/* Guide Gridlines */}
            <div className="absolute inset-x-0 top-1/4 border-t border-white/[0.03]" />
            <div className="absolute inset-x-0 top-2/4 border-t border-white/[0.03]" />
            <div className="absolute inset-x-0 top-3/4 border-t border-white/[0.03]" />

            {metrics?.emissions_trend.map((t, idx) => {
              // Scale heights to look reasonable (min 10%, max 90%)
              const maxVal = Math.max(...metrics.emissions_trend.map(m => m.emissions));
              const heightPct = (t.emissions / maxVal) * 100;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center group relative z-10">
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 bg-mantle border border-green-env/30 rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center min-w-[100px] pointer-events-none">
                    <p className="text-[10px] text-on-surface-variant">{t.month} 2024</p>
                    <p className="text-xs font-bold text-white">{t.emissions.toLocaleString()} tCO2</p>
                  </div>

                  {/* Visual Line Anchor and Glow Element */}
                  <div className="w-full flex justify-center items-end h-28 mb-2">
                    <div 
                      className="w-1.5 bg-gradient-to-t from-green-env/20 to-green-env rounded-full transition-all duration-500 group-hover:from-green-env/40 group-hover:to-green-env group-hover:w-2"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>

                  <span className="text-xs text-on-surface-variant group-hover:text-white font-mono transition-colors">
                    {t.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Top Performing Departments List */}
        <div className="glass-panel col-span-1 md:col-span-6 p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Top Performing Departments</h3>
            <p className="text-on-surface-variant text-xs mb-6">Department efficiency and score analysis</p>
          </div>

          <div className="space-y-5">
            {metrics?.top_departments.map((dept, idx) => {
              // Color selection based on dept order
              const colorClass = 
                idx === 0 ? "bg-mauve" :
                idx === 1 ? "bg-sapphire" :
                idx === 2 ? "bg-peach" : "bg-green-env";

              return (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-white">{dept.name}</span>
                    <span className="text-on-surface-variant">{dept.score}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${colorClass} rounded-full transition-all duration-1000`} 
                      style={{ width: `${dept.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. CSR Resource Allocation Donut & Data Chart */}
        <div className="glass-panel col-span-1 md:col-span-6 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">CSR Resource Allocation</h3>
              <p className="text-on-surface-variant text-xs">Sustainability capital investment splits</p>
            </div>

            <div className="space-y-2 pt-2">
              {metrics?.csr_allocation.map((alloc, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ backgroundColor: alloc.color }}
                  />
                  <span className="text-xs font-medium text-on-surface-variant flex-1">{alloc.category}</span>
                  <span className="text-xs font-semibold text-white">{alloc.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Graphical Representation of donut chart */}
          <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#222530" strokeWidth="12" />
              {/* Peach: 20% (circumference 2*pi*38 = 238.76 => 20% = 47.75) */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#fab387" strokeWidth="12" strokeDasharray="47.75 191.01" strokeDashoffset="0" />
              {/* Sapphire: 35% => 83.56 */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#74c7ec" strokeWidth="12" strokeDasharray="83.56 155.20" strokeDashoffset="-47.75" />
              {/* Mauve: 45% => 107.44 */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#cba6f7" strokeWidth="12" strokeDasharray="107.44 131.32" strokeDashoffset="-131.31" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-white">
                ${((metrics?.total_csr_usd || 2400000) / 1000000).toFixed(1)}M
              </span>
              <span className="text-[9px] text-on-surface-variant uppercase tracking-wider">USD Allocation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Log Carbon Data Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-crust/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-mantle border border-white/5 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h4 className="text-lg font-bold text-white">Log Environmental Emission</h4>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-on-surface-variant hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleLogCarbon} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
                  Carbon Emission Amount (tCO2e)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={logAmount}
                    onChange={(e) => setLogAmount(e.target.value)}
                    className="w-full bg-crust border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-peach focus:ring-1 focus:ring-peach/50 outline-none"
                    placeholder="Enter carbon tonnes..."
                    required
                    min="1"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-on-surface-variant">
                    tonnes
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Logging carbon transactions updates the emissions trend analysis instantly.
                </p>
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
                  className="px-5 py-2 bg-peach text-crust font-semibold rounded-xl hover:bg-peach/90 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs"
                >
                  Confirm Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
