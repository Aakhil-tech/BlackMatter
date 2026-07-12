/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Scale,
  ShieldCheck,
  AlertOctagon,
  PlusCircle,
  FileText,
  User,
  Calendar,
  CheckCircle,
  Clock,
  EyeOff
} from 'lucide-react';
import { ComplianceItem, GovernanceIncident } from '../types';

interface GovernanceTabProps {
  complianceItems: ComplianceItem[];
  incidents: GovernanceIncident[];
  onToggleComplianceStatus: (id: string) => void;
  onAddIncident: (incident: Omit<GovernanceIncident, 'id'>) => void;
}

export default function GovernanceTab({
  complianceItems,
  incidents,
  onToggleComplianceStatus,
  onAddIncident
}: GovernanceTabProps) {
  // Whistleblower Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<GovernanceIncident['severity']>('Low');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    onAddIncident({
      date: new Date().toISOString().split('T')[0],
      title: title.trim(),
      description: description.trim(),
      status: 'Investigating',
      severity
    });

    setTitle('');
    setDescription('');
    setSeverity('Low');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  const getStatusBadge = (status: ComplianceItem['status']) => {
    switch (status) {
      case 'Compliant':
        return 'text-green bg-green/10 border-green/20';
      case 'In Progress':
        return 'text-primary-container bg-primary-container/10 border-primary-container/20';
      case 'Action Required':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-on-surface-variant bg-white/5 border-white/5';
    }
  };

  const getSeverityBadge = (sev: GovernanceIncident['severity']) => {
    switch (sev) {
      case 'High':
        return 'text-error bg-error/10';
      case 'Medium':
        return 'text-peach bg-peach/10';
      case 'Low':
        return 'text-primary-container bg-primary-container/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper Section: Compliance items */}
      <div className="glass-card p-6 md:p-8 rounded-3xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green" />
              <span>ESG Compliance Checklist & Tracker</span>
            </h3>
            <p className="text-xs text-[#a6adc8] mt-0.5">
              Click any status badge to dynamically toggle or update corporate compliance standing
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold text-green uppercase tracking-wider bg-green/5 border border-green/10 px-3 py-1 rounded-full">
            All audits registered
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complianceItems.map((item) => (
            <div
              key={item.id}
              id={`compliance-${item.id}`}
              className="p-4 rounded-2xl bg-white/[0.015] border border-white/5 flex flex-col justify-between hover:border-white/10 transition-all group"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-primary-container uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-on-surface group-hover:text-primary-container transition-colors mt-0.5">
                      {item.title}
                    </h4>
                  </div>

                  {/* Status Toggle Button */}
                  <button
                    onClick={() => onToggleComplianceStatus(item.id)}
                    className={`
                      px-3 py-1 rounded-full border text-[11px] font-bold transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98]
                      ${getStatusBadge(item.status)}
                    `}
                    title="Click to toggle compliance status"
                  >
                    {item.status}
                  </button>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Responsible Officer & Due Date footer */}
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/[0.03] text-[10px] text-[#a6adc8]">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-on-surface-variant" />
                  <span className="truncate max-w-[150px]">{item.responsibleOfficer}</span>
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3 text-on-surface-variant" />
                  <span>Due: {item.dueDate}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lower Section: Incident logging & Whistleblower form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Incident Ledger List (Span 7) */}
        <div className="glass-card lg:col-span-7 p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary-container" />
              <span>ESG Governance Audit Incident Logs</span>
            </h3>
            <p className="text-xs text-[#a6adc8] mt-1 mb-5">
              Secure incident registry of conflict-checks, filter failures, or reporting anomalies
            </p>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-2">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                id={`incident-${inc.id}`}
                className="p-3.5 rounded-xl bg-[#11111b]/80 border border-white/5 flex gap-3.5 items-start hover:border-white/10 transition-colors"
              >
                <div className="p-2 bg-white/5 rounded-lg text-peach self-start shrink-0 mt-0.5">
                  <AlertOctagon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <h4 className="text-xs font-bold text-white truncate">{inc.title}</h4>
                    <div className="flex gap-1.5 items-center">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${getSeverityBadge(inc.severity)}`}>
                        {inc.severity} Severity
                      </span>
                      <span className="px-2 py-0.5 text-[9px] bg-white/5 border border-white/10 text-on-surface-variant rounded-full font-semibold">
                        {inc.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#a6adc8] leading-relaxed mb-2">
                    {inc.description}
                  </p>
                  <span className="text-[9px] font-mono text-on-surface-variant/70 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" /> Registered on {inc.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Secure Ethics / Whistleblower Form (Span 5) */}
        <div className="glass-card lg:col-span-5 p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-peach" />
              <span>Secure Whistleblower Alert Intake</span>
            </h3>
            <p className="text-xs text-[#a6adc8] mt-1 mb-4">
              Submit reports directly to the Audit Integrity team. Identity encryption is active automatically.
            </p>
          </div>

          {success ? (
            <div className="py-8 flex flex-col items-center justify-center text-center animate-fade-in flex-1">
              <CheckCircle className="w-12 h-12 text-green mb-3" />
              <h4 className="text-sm font-bold text-white">Alert Filed Encrypted</h4>
              <p className="text-xs text-[#a6adc8] mt-1 max-w-[200px]">
                Incident registered. Reference hash logged to the Governance audit ledger successfully.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-center">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Incident Title / Alert Type
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Conflict of Interest Check or Filter Fault"
                  className="w-full bg-[#11111b] border border-white/10 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-peach/50 focus:ring-1 focus:ring-peach/10"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Severity Level
                </label>
                <div className="flex gap-2">
                  {(['Low', 'Medium', 'High'] as const).map((lvl) => {
                    const active = severity === lvl;
                    return (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => setSeverity(lvl)}
                        className={`
                          flex-1 py-1.5 text-xs font-semibold rounded-lg border text-center transition-all
                          ${
                            active
                              ? 'bg-peach/10 text-peach border-peach/30 shadow-sm'
                              : 'bg-[#11111b] text-on-surface-variant border-white/5 hover:border-white/20'
                          }
                        `}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Factual incident description
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="State specific department, dates, material impact, or policy violated factually..."
                  className="w-full bg-[#11111b] border border-white/10 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-peach/50 focus:ring-1 focus:ring-peach/10"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-peach hover:bg-[#ffc59f] text-[#11111b] font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all active:scale-[0.98] shadow-md mt-1"
              >
                Submit Encrypted Alert
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
