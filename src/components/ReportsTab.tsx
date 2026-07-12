/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  Check,
  CheckCircle,
  FileSpreadsheet,
  Cpu,
  Layers
} from 'lucide-react';
import { CarbonLogEntry, DepartmentESG, SocialMetrics, ComplianceItem } from '../types';

interface ReportsTabProps {
  carbonLogs: CarbonLogEntry[];
  departments: DepartmentESG[];
  socialMetrics: SocialMetrics;
  complianceItems: ComplianceItem[];
}

export default function ReportsTab({
  carbonLogs,
  departments,
  socialMetrics,
  complianceItems
}: ReportsTabProps) {
  const [reportYear, setReportYear] = useState('2026');
  const [includeCarbon, setIncludeCarbon] = useState(true);
  const [includeSocial, setIncludeSocial] = useState(true);
  const [includeGovernance, setIncludeGovernance] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(true);
  const [notification, setNotification] = useState('');

  // Calculations
  const totalCarbon = carbonLogs.reduce((sum, log) => sum + log.tco2e, 0);
  const avgESGScore = Math.round(
    departments.reduce((sum, dept) => sum + dept.overallScore, 0) / departments.length
  );

  const handleGenerate = () => {
    setIsGenerating(true);
    setIsGenerated(false);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      setNotification('Custom ESG Report Generated successfully!');
      setTimeout(() => setNotification(''), 2000);
    }, 1200);
  };

  const downloadJSON = () => {
    const payload = {
      reportYear,
      generatedAt: new Date().toISOString(),
      platform: 'EcoSphere ESG Management',
      auditMetrics: {
        overallAverageEsgScore: avgESGScore,
        environmentalMetrics: includeCarbon ? {
          totalScope1And2CarbonFootprintTonnes: totalCarbon,
          logsCount: carbonLogs.length,
          historicalLogs: carbonLogs
        } : null,
        socialMetrics: includeSocial ? socialMetrics : null,
        governanceMetrics: includeGovernance ? {
          compliantCount: complianceItems.filter((i) => i.status === 'Compliant').length,
          totalComplianceItems: complianceItems.length,
          checklist: complianceItems
        } : null
      }
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `EcoSphere-ESG-Report-${reportYear}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setNotification('Report downloaded as JSON Payload!');
    setTimeout(() => setNotification(''), 2500);
  };

  const downloadCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'EcoSphere ESG Disclosure Report Summary\r\n';
    csvContent += `Report Disclosure Year,${reportYear}\r\n`;
    csvContent += `Generated At,${new Date().toISOString()}\r\n`;
    csvContent += `Overall Average ESG Index,${avgESGScore}/100\r\n\r\n`;

    if (includeCarbon) {
      csvContent += 'ENVIRONMENTAL AUDIT LEDGER\r\n';
      csvContent += 'Log ID,Date,Department,Source,Amount,Unit,tCO2e\r\n';
      carbonLogs.forEach((log) => {
        csvContent += `"${log.id}","${log.date}","${log.department}","${log.activityType}",${log.amount},"${log.unit}",${log.tco2e}\r\n`;
      });
      csvContent += '\r\n';
    }

    if (includeSocial) {
      csvContent += 'SOCIAL DIVERSITY AND EMPLOYEE SENTIMENT METRICS\r\n';
      csvContent += `Employee Satisfaction Index,${socialMetrics.employeeSatisfaction}%\r\n`;
      csvContent += `Minority Representation,${socialMetrics.minorityRepresentation}%\r\n`;
      csvContent += `Training Hours Sourced,${socialMetrics.trainingHoursPerEmployee} hrs/employee\r\n`;
      csvContent += `Workplace Incidents YTD,${socialMetrics.workplaceSafetyIncidents}\r\n\r\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodedUri);
    downloadAnchor.setAttribute('download', `EcoSphere-ESG-Report-${reportYear}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setNotification('Report downloaded as CSV Excel sheet!');
    setTimeout(() => setNotification(''), 2500);
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Upper Grid Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Report configuration (Span 4) */}
        <div className="glass-card lg:col-span-4 p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 mb-1.5">
              <Calendar className="w-5 h-5 text-primary-container" />
              <span>Report Configuration</span>
            </h3>
            <p className="text-xs text-[#a6adc8] mb-5">Customize reporting parameters to compile custom disclosure logs</p>

            <div className="space-y-4">
              {/* Year Select */}
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Disclosure Year
                </label>
                <select
                  value={reportYear}
                  onChange={(e) => setReportYear(e.target.value)}
                  className="w-full bg-[#11111b] border border-white/10 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none"
                >
                  <option value="2026">2026 Disclosure Summary (Current)</option>
                  <option value="2025">2025 Historical Disclosure</option>
                  <option value="2024">2024 Historical Disclosure</option>
                </select>
              </div>

              {/* Checklist Parameters */}
              <div className="space-y-2.5 pt-2">
                <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Select Disclosure sections
                </span>

                <label className="flex items-center gap-3 text-xs text-[#a6adc8] font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeCarbon}
                    onChange={(e) => setIncludeCarbon(e.target.checked)}
                    className="accent-primary-container rounded border-white/10"
                  />
                  <span>Environmental Footprint (Carbon logs)</span>
                </label>

                <label className="flex items-center gap-3 text-xs text-[#a6adc8] font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeSocial}
                    onChange={(e) => setIncludeSocial(e.target.checked)}
                    className="accent-primary-container rounded border-white/10"
                  />
                  <span>Social Equity & Diversity Ratios</span>
                </label>

                <label className="flex items-center gap-3 text-xs text-[#a6adc8] font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeGovernance}
                    onChange={(e) => setIncludeGovernance(e.target.checked)}
                    className="accent-primary-container rounded border-white/10"
                  />
                  <span>Governance compliance checklists</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-primary-container text-crust font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              {isGenerating ? 'Compiling disclosure...' : 'Compile Custom Report'}
            </button>
          </div>
        </div>

        {/* Live Disclosure Preview Area (Span 8) */}
        <div className="glass-card lg:col-span-8 p-6 rounded-3xl flex flex-col justify-between min-h-[350px]">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <FileText className="w-5 h-5 text-green" />
                <span>Custom Disclosure Compilation Preview</span>
              </h3>
              {notification && (
                <span className="px-3 py-1 bg-green/10 text-green border border-green/20 text-[10px] rounded-xl flex items-center gap-1.5 animate-fade-in font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{notification}</span>
                </span>
              )}
            </div>

            {isGenerating ? (
              <div className="py-20 flex flex-col items-center justify-center text-center animate-pulse">
                <Cpu className="w-10 h-10 text-primary-container animate-spin mb-3" />
                <p className="text-xs font-semibold text-[#a6adc8]">Compiling and sealing carbon ledger coordinates...</p>
              </div>
            ) : isGenerated ? (
              /* Beautiful rendered report draft */
              <div id="compiled-report-preview" className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-4 max-h-[340px] overflow-y-auto font-sans">
                {/* Header doc */}
                <div className="border-b border-white/10 pb-4 flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-extrabold text-white uppercase tracking-tight">EcoSphere ESG Disclosure Summary</h4>
                    <p className="text-[10px] font-mono text-[#a6adc8] mt-1">UUID: ACT-2026-F65B &bull; Generated: {new Date().toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-green px-2 py-0.5 bg-green/10 border border-green/20 rounded-md">
                    Sealed Draft
                  </span>
                </div>

                {/* Score section */}
                <div className="grid grid-cols-2 gap-4 bg-white/[0.015] border border-white/5 p-3 rounded-xl text-center">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#a6adc8]">Audit Year</span>
                    <span className="text-base font-bold text-white block mt-0.5">{reportYear}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#a6adc8]">Avg ESG Score</span>
                    <span className="text-base font-bold text-primary-container block mt-0.5">{avgESGScore} / 100</span>
                  </div>
                </div>

                {/* Environmental Section */}
                {includeCarbon && (
                  <div className="space-y-1.5 text-xs">
                    <h5 className="font-bold text-white border-l-2 border-green pl-2 uppercase tracking-wide text-[10px]">Environmental Footprint Summary</h5>
                    <div className="grid grid-cols-2 gap-3 text-on-surface-variant font-medium pt-1">
                      <span>Total Carbon Footprint: <strong className="text-white font-mono">{totalCarbon.toFixed(2)} tCO2e</strong></span>
                      <span>Total Registered Logs: <strong className="text-white font-mono">{carbonLogs.length} audit entries</strong></span>
                    </div>
                  </div>
                )}

                {/* Social Section */}
                {includeSocial && (
                  <div className="space-y-1.5 text-xs pt-2">
                    <h5 className="font-bold text-white border-l-2 border-primary-container pl-2 uppercase tracking-wide text-[10px]">Social Equity Disclosure</h5>
                    <div className="grid grid-cols-2 gap-3 text-on-surface-variant font-medium pt-1">
                      <span>Employee Satisfaction: <strong className="text-white font-mono">{socialMetrics.employeeSatisfaction}% index</strong></span>
                      <span>Minority Representation: <strong className="text-white font-mono">{socialMetrics.minorityRepresentation}%</strong></span>
                      <span>Community Outreach: <strong className="text-white font-mono">${(socialMetrics.communityInvestmentUSD).toLocaleString()} USD</strong></span>
                      <span>Avg Training Hours: <strong className="text-white font-mono">{socialMetrics.trainingHoursPerEmployee} hrs/staff</strong></span>
                    </div>
                  </div>
                )}

                {/* Governance Section */}
                {includeGovernance && (
                  <div className="space-y-1.5 text-xs pt-2">
                    <h5 className="font-bold text-white border-l-2 border-peach pl-2 uppercase tracking-wide text-[10px]">Governance standing</h5>
                    <div className="grid grid-cols-2 gap-3 text-on-surface-variant font-medium pt-1">
                      <span>Compliance Items: <strong className="text-white font-mono">{complianceItems.length} checked</strong></span>
                      <span>Status Compliant: <strong className="text-green font-mono">{complianceItems.filter((i) => i.status === 'Compliant').length} Compliant</strong></span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-on-surface-variant">
                <Layers className="w-10 h-10 mx-auto opacity-30 mb-2" />
                <p className="text-xs">No active report compiled. Click compile to generate a new draft.</p>
              </div>
            )}
          </div>

          {/* Export selectors */}
          {isGenerated && (
            <div className="pt-6 border-t border-white/5 flex flex-wrap gap-3 justify-end">
              <button
                id="print-report-btn"
                onClick={triggerPrint}
                className="px-4 py-2 rounded-xl bg-[#11111b] border border-white/10 text-xs font-semibold text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Draft</span>
              </button>

              <button
                id="export-csv-btn"
                onClick={downloadCSV}
                className="px-4 py-2 rounded-xl bg-[#11111b] border border-white/10 text-xs font-semibold text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-green" />
                <span>Export CSV Excel</span>
              </button>

              <button
                id="export-json-btn"
                onClick={downloadJSON}
                className="px-4 py-2 rounded-xl bg-green text-crust text-xs font-bold flex items-center gap-1.5 transition-all active:scale-[0.98] shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download JSON Payload</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
