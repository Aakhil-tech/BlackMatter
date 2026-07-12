import React, { useState } from "react";
import { useReports } from "../../hooks/useReports";
import { 
  FileText, 
  Settings, 
  Calendar, 
  Building2, 
  Sliders, 
  Play, 
  CheckCircle, 
  Loader2, 
  AlertCircle,
  FileDown
} from "lucide-react";

export default function ReportsView() {
  const { reports, runCustomReport, setReports } = useReports();
  
  // Custom Config State
  const [dateRange, setDateRange] = useState("Jun 2024 - Nov 2024");
  const [selectedDepts, setSelectedDepts] = useState<string[]>(["Supply Chain", "Facilities", "Operations"]);
  const [selectedModules, setSelectedModules] = useState<string[]>(["Carbon Tracking", "CSR Participation", "Regulatory Audits"]);
  
  // Generation Simulation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStep, setGenStep] = useState("");
  const [genSuccess, setGenSuccess] = useState<any | null>(null);

  // Filters for subnav
  const [activeTab, setActiveTab] = useState<"ESG Summary" | "Environmental" | "Social" | "Governance">("ESG Summary");

  const handleDeptToggle = (name: string) => {
    setSelectedDepts(prev => 
      prev.includes(name) ? prev.filter(d => d !== name) : [...prev, name]
    );
  };

  const handleModuleToggle = (name: string) => {
    setSelectedModules(prev => 
      prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDepts.length === 0 || selectedModules.length === 0) {
      alert("Please select at least one department and one module.");
      return;
    }

    setIsGenerating(true);
    setGenSuccess(null);
    
    // Simulate compilation steps
    const steps = [
      "Securing connection via encrypted API key channel...",
      "Querying carbon transaction logs & database metrics...",
      "Synthesizing corporate social volunteer structures...",
      "Verifying governance compliance against CSRD protocols...",
      "Compiling regulatory reporting modules...",
      "Structuring PDF layout sheets with cryptographic hash signatures..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setGenStep(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 1400));
    }

    try {
      const res = await runCustomReport({
        date_range: dateRange,
        departments: selectedDepts,
        modules_included: selectedModules
      });
      
      setGenSuccess(res);
      
      // Inject new report template into local hook state for display!
      const newTemplate = {
        id: `rep-custom-${Date.now()}`,
        name: `Custom ESG Report`,
        description: `Custom configuration audit including modules: ${selectedModules.join(", ")}.`,
        status: "Ready" as const,
        category: "ESG Summary" as const,
        progress: 100
      };
      setReports(prev => [newTemplate, ...prev]);

    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
      setGenStep("");
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Ready":
        return "bg-green-env/10 text-green-env border-green-env/20";
      case "Updated":
        return "bg-sapphire/10 text-sapphire border-sapphire/20";
      case "Review":
        return "bg-peach/10 text-peach border-peach/20";
      default:
        return "bg-mauve/10 text-mauve border-mauve/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">ESG Custom Report Builder</h2>
        <p className="text-on-surface-variant text-sm mt-1">
          Generate, audit, and configure compliant environmental, social, and governance records.
        </p>
      </div>

      {/* Navigation tabs */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar border-b border-white/5">
        {(["ESG Summary", "Environmental", "Social", "Governance"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab
                ? "bg-mauve text-crust font-bold shadow-lg shadow-mauve/15"
                : "text-on-surface-variant hover:text-white hover:bg-white/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Custom Report Configurator (Bento Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Builder Controls */}
        <form onSubmit={handleGenerate} className="glass-panel col-span-1 lg:col-span-7 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Settings className="w-5 h-5 text-mauve" />
            <h3 className="text-md font-bold text-white">Custom Configuration</h3>
          </div>

          <div className="space-y-5">
            {/* Date range selection */}
            <div className="space-y-2">
              <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-mauve" />
                <span>Date range</span>
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full bg-crust border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-mauve"
              >
                <option>Jun 2024 - Nov 2024</option>
                <option>Q3 2024 (Jul - Sep)</option>
                <option>H1 2024 Audit Window</option>
                <option>Full Year 2023 Historic</option>
              </select>
            </div>

            {/* Department checkboxes */}
            <div className="space-y-2.5">
              <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sapphire" />
                <span>Target Departments</span>
              </label>
              <div className="grid grid-cols-2 gap-3 bg-crust/50 p-4 rounded-xl border border-white/5">
                {["Supply Chain", "Facilities", "Operations", "Product Design", "Renewable Ops"].map((dept) => {
                  const isChecked = selectedDepts.includes(dept);
                  return (
                    <label key={dept} className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleDeptToggle(dept)}
                        className="rounded border-white/10 text-mauve focus:ring-0 focus:ring-offset-0 w-4 h-4 bg-crust"
                      />
                      <span className={`text-xs ${isChecked ? "text-white font-semibold" : "text-on-surface-variant"}`}>
                        {dept}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Modules checkboxes */}
            <div className="space-y-2.5">
              <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-green-env" />
                <span>Modules & Audit Dimensions</span>
              </label>
              <div className="grid grid-cols-2 gap-3 bg-crust/50 p-4 rounded-xl border border-white/5">
                {["Carbon Tracking", "CSR Participation", "Board Audit logs", "Regulatory Audits", "Diversity Indexes"].map((mod) => {
                  const isChecked = selectedModules.includes(mod);
                  return (
                    <label key={mod} className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleModuleToggle(mod)}
                        className="rounded border-white/10 text-mauve focus:ring-0 w-4 h-4 bg-crust"
                      />
                      <span className={`text-xs ${isChecked ? "text-white font-semibold" : "text-on-surface-variant"}`}>
                        {mod}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 bg-mauve hover:bg-mauve/90 text-crust font-extrabold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-mauve/15"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Compiling Report...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Generate Report PDF</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Side: Execution progress/success logger & instructions */}
        <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">
          {/* Active Generation console */}
          <div className="glass-panel p-6 flex-1 flex flex-col justify-between relative overflow-hidden min-h-[220px]">
            <div>
              <h3 className="text-md font-bold text-white mb-2">Build Pipeline</h3>
              <p className="text-xs text-on-surface-variant">Real-time compilation tracking stream</p>
            </div>

            <div className="bg-crust border border-white/5 p-4 rounded-xl flex-1 my-4 flex flex-col justify-center min-h-[120px]">
              {isGenerating ? (
                <div className="space-y-3 text-center">
                  <Loader2 className="w-6 h-6 text-mauve animate-spin mx-auto" />
                  <p className="text-xs font-mono text-white leading-relaxed max-w-[85%] mx-auto">
                    {genStep}
                  </p>
                </div>
              ) : genSuccess ? (
                <div className="space-y-3 text-center">
                  <CheckCircle className="w-8 h-8 text-green-env mx-auto" />
                  <p className="text-xs font-semibold text-white">Custom ESG report compilation complete!</p>
                  <p className="text-[10px] text-on-surface-variant font-mono">ID: {genSuccess.started_at}</p>
                  <button className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-env text-crust font-bold text-xs rounded-full hover:scale-105 active:scale-95 transition-all mt-2">
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-2 py-4">
                  <p className="text-xs font-semibold text-on-surface-variant">Pipeline Idle</p>
                  <p className="text-[10px] text-on-surface-variant max-w-[80%] mx-auto leading-relaxed">
                    Adjust the configuration options on the left and trigger compilation to run audits.
                  </p>
                </div>
              )}
            </div>

            <p className="text-[10px] font-mono text-on-surface-variant text-center">
              SYSTEM STATUS: SECURE CHANNELS ONLINE
            </p>
          </div>
        </div>
      </div>

      {/* Historical Report Templates Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-white">Historic Report Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports
            .filter((r) => activeTab === "ESG Summary" || r.category === activeTab)
            .map((r) => (
              <div 
                key={r.id} 
                className="glass-panel p-6 flex flex-col justify-between h-full group border-l-2 hover:border-l-mauve hover:bg-white/[0.01]"
                style={{ borderLeftColor: r.category === "Environmental" ? "#a6e3a1" : r.category === "Social" ? "#74c7ec" : r.category === "Governance" ? "#fab387" : "#cba6f7" }}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-mauve" />
                      <h4 className="text-base font-bold text-white group-hover:text-mauve transition-colors">
                        {r.name}
                      </h4>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${getStatusStyle(r.status)}`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {r.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-on-surface-variant font-mono uppercase tracking-wider">
                    {r.category}
                  </span>
                  <button className="flex items-center gap-1 text-mauve font-semibold hover:underline">
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
