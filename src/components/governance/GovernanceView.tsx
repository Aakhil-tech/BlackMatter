import React, { useState } from "react";
import { 
  ShieldCheck, 
  CheckSquare, 
  Scale, 
  BookOpen, 
  TrendingUp, 
  AlertCircle, 
  FileLock, 
  UserSquare2 
} from "lucide-react";

export default function GovernanceView() {
  const [checklist, setChecklist] = useState([
    { id: "chk-1", text: "Anti-Bribery and Corruption policy review complete", checked: true },
    { id: "chk-2", text: "Whistleblower reporting channel active", checked: true },
    { id: "chk-3", text: "Board compensation structure approved by ethics committee", checked: false },
    { id: "chk-4", text: "Tier-1 supplier ESG compliance audits finalized", checked: false },
    { id: "chk-5", text: "Public disclosure of Q3 transparency data published", checked: true }
  ]);

  const toggleCheck = (id: string) => {
    setChecklist(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  const scorePct = Math.round((checklist.filter(c => c.checked).length / checklist.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Corporate Governance & Compliance</h2>
        <p className="text-on-surface-variant text-sm mt-1">
          Monitor board composition, ethical policy disclosures, regulatory compliance standards, and risk mitigation audits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Core Stats Overview */}
        <div className="glass-panel col-span-1 md:col-span-4 p-6 flex flex-col justify-between h-64 relative overflow-hidden group">
          <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-sapphire/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-sapphire/20 transition-all duration-500" />
          
          <div className="space-y-2 z-10">
            <div className="flex justify-between items-center">
              <Scale className="w-5 h-5 text-sapphire" />
              <span className="text-[10px] font-bold text-sapphire bg-sapphire/10 px-2 py-0.5 rounded-full border border-sapphire/20 uppercase tracking-widest">
                Robust
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">Board Diversity & Ethics</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Evaluating board composition independence, stakeholder representativeness, and compensation reviews.
            </p>
          </div>

          <div className="z-10 flex gap-6 pt-4">
            <div>
              <p className="text-2xl font-extrabold text-sapphire">82%</p>
              <p className="text-[9px] text-on-surface-variant uppercase tracking-wider mt-1">Independence</p>
            </div>
            <div className="border-l border-white/5 pl-6">
              <p className="text-2xl font-extrabold text-white">3:2</p>
              <p className="text-[9px] text-on-surface-variant uppercase tracking-wider mt-1">Gender Ratio</p>
            </div>
          </div>
        </div>

        {/* Audit Status Overview */}
        <div className="glass-panel col-span-1 md:col-span-8 p-6 flex flex-col justify-between h-64 relative border-l-4 border-sapphire">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">ESG Regulatory Compliance</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed max-w-lg">
                Ongoing verification against European CSRD, TCFD, and global ESG transparency reporting mandates.
              </p>
            </div>
            <div className="p-3 bg-sapphire/10 rounded-xl border border-sapphire/20 text-sapphire shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-4">
            <div>
              <p className="text-3xl font-extrabold text-white">99.4%</p>
              <p className="text-[9px] text-on-surface-variant uppercase tracking-widest mt-1">Audit Alignment</p>
            </div>
            <div className="border-l border-white/5 pl-6">
              <p className="text-3xl font-extrabold text-green-env">0</p>
              <p className="text-[9px] text-on-surface-variant uppercase tracking-widest mt-1">Active Infractions</p>
            </div>
            <div className="border-l border-white/5 pl-6">
              <p className="text-3xl font-extrabold text-sapphire">Q3 2024</p>
              <p className="text-[9px] text-on-surface-variant uppercase tracking-widest mt-1">Next Ethics Review</p>
            </div>
          </div>
        </div>

        {/* Regulatory Compliance Checklist */}
        <div className="glass-panel col-span-1 md:col-span-8 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-md font-bold text-white">Compliance Protocol Checklist</h3>
            <span className="text-xs font-mono text-sapphire font-bold">{scorePct}% Compliant</span>
          </div>

          <div className="space-y-3">
            {checklist.map((item) => (
              <div 
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-sapphire/20 cursor-pointer transition-all"
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                  item.checked 
                    ? "bg-sapphire border-sapphire text-crust" 
                    : "border-white/10"
                }`}>
                  {item.checked && <CheckSquare className="w-4 h-4 stroke-[3]" />}
                </div>
                <span className={`text-xs ${item.checked ? "text-on-surface-variant line-through font-medium" : "text-white font-semibold"}`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk & Policy Disclosures Block */}
        <div className="glass-panel col-span-1 md:col-span-4 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-bold text-white">Disclosures & Filings</h3>
              <FileLock className="w-4 h-4 text-on-surface-variant" />
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
              Access the validated corporate filings, ESG annual audits, and sustainability policy sheets.
            </p>
          </div>

          <div className="space-y-3">
            <a href="#" className="flex items-center justify-between p-2.5 rounded-lg bg-crust border border-white/5 text-xs text-white hover:border-sapphire/30 transition-all font-semibold">
              <span>Annual ESG Audit Report (2024)</span>
              <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-on-surface-variant font-mono">PDF</span>
            </a>
            <a href="#" className="flex items-center justify-between p-2.5 rounded-lg bg-crust border border-white/5 text-xs text-white hover:border-sapphire/30 transition-all font-semibold">
              <span>Supplier Code of Conduct</span>
              <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-on-surface-variant font-mono">DOCX</span>
            </a>
            <a href="#" className="flex items-center justify-between p-2.5 rounded-lg bg-crust border border-white/5 text-xs text-white hover:border-sapphire/30 transition-all font-semibold">
              <span>Board Independence Chart</span>
              <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-on-surface-variant font-mono">XLSX</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
