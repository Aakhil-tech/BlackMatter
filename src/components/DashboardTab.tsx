/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  MoreHorizontal,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { DepartmentESG, CSRAllocation, CarbonLogEntry } from '../types';

interface DashboardTabProps {
  carbonLogs: CarbonLogEntry[];
  departments: DepartmentESG[];
  allocations: CSRAllocation[];
  onOpenLogModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export default function DashboardTab({
  carbonLogs,
  departments,
  allocations,
  onOpenLogModal,
  onNavigateTab
}: DashboardTabProps) {
  const [trendView, setTrendView] = useState<'monthly' | 'quarterly'>('monthly');
  const [activeHoverIdx, setActiveHoverIdx] = useState<number | null>(4); // Default tooltip on index 4 (Nov equivalent)

  // Dynamic calculations based on logs
  const totalEmissionsYTD = carbonLogs.reduce((sum, log) => sum + log.tco2e, 0);

  // Compute averaged overall scores
  const avgESGScore = Math.round(
    departments.reduce((sum, dept) => sum + dept.overallScore, 0) / departments.length
  );

  const getTrendingColorClass = (score: number) => {
    if (score >= 80) return 'text-[#a6e3a1] bg-[#a6e3a1]/10 border-[#a6e3a1]/20';
    if (score >= 60) return 'text-primary-container bg-primary-container/10 border-primary-container/20';
    return 'text-[#fab387] bg-[#fab387]/10 border-[#fab387]/20';
  };

  // Mock data representing monthly emissions points for past 6 months leading to current
  const monthlyEmissionsTrend = [
    { month: 'Jan 2026', value: 14.2 },
    { month: 'Feb 2026', value: 13.8 },
    { month: 'Mar 2026', value: 13.1 },
    { month: 'Apr 2026', value: 12.8 },
    { month: 'May 2026', value: 12.45 },
    { month: 'Jun 2026', value: 11.9 }
  ];

  const quarterlyEmissionsTrend = [
    { month: 'Q3 2025', value: 41.5 },
    { month: 'Q4 2025', value: 39.8 },
    { month: 'Q1 2026', value: 41.1 },
    { month: 'Q2 2026', value: 37.15 }
  ];

  const activeTrendData = trendView === 'monthly' ? monthlyEmissionsTrend : quarterlyEmissionsTrend;

  // Let's draw an SVG path dynamically for the line and area
  const svgWidth = 600;
  const svgHeight = 150;
  const paddingX = 40;
  const paddingY = 20;

  // Find bounds for plotting
  const maxVal = Math.max(...activeTrendData.map((d) => d.value)) * 1.15;
  const minVal = Math.min(...activeTrendData.map((d) => d.value)) * 0.85;

  const getCoordinates = () => {
    const points = activeTrendData.map((d, idx) => {
      const x = paddingX + (idx / (activeTrendData.length - 1)) * (svgWidth - paddingX * 2);
      // Invert Y because SVG coordinates starts from top-left
      const y =
        svgHeight -
        paddingY -
        ((d.value - minVal) / (maxVal - minVal)) * (svgHeight - paddingY * 2);
      return { x, y, ...d };
    });
    return points;
  };

  const coordinates = getCoordinates();

  // Create SVG path string
  let pathD = '';
  let areaD = '';

  if (coordinates.length > 0) {
    // Generate curved line path using basic bezier controls or linear paths
    // For exact consistency, let's plot neat lines
    pathD = `M ${coordinates[0].x} ${coordinates[0].y}`;
    for (let i = 1; i < coordinates.length; i++) {
      const prev = coordinates[i - 1];
      const curr = coordinates[i];
      // control points for smooth bezier curvature
      const cpX1 = prev.x + (curr.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (curr.x - prev.x) / 2;
      const cpY2 = curr.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
    }

    // Connect to bottom of SVG for area fill
    areaD = `${pathD} L ${coordinates[coordinates.length - 1].x} ${svgHeight} L ${coordinates[0].x} ${svgHeight} Z`;
  }

  // Sum allocation total for donut rendering
  const totalAllocationUSD = allocations.reduce((sum, item) => sum + item.amountUSD, 0);

  return (
    <div className="space-y-6">
      {/* Dynamic ESG Insights Summary Banner */}
      <div className="glass-card rounded-3xl p-5 bg-gradient-to-r from-[#2c292e]/40 to-[#1d1a20]/40 border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex gap-3.5 min-w-0">
          <div className="p-2.5 bg-primary-container/10 rounded-xl text-primary-container border border-primary-container/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface">ESG Smart Insight: Carbon Reduction Active</h4>
            <p className="text-xs text-[#a6adc8] max-w-2xl mt-0.5">
              EcoSphere averaged scores reached <strong className="text-primary-container">{avgESGScore}</strong> this quarter due to hybrid fuel deployments in Logistics and increased Community Outreach investments. You have logged <strong className="text-green">{totalEmissionsYTD.toFixed(1)} tCO2e</strong> in operational footprint YTD.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('gamification')}
          className="text-xs font-semibold text-primary-container hover:text-white flex items-center gap-1 group shrink-0"
        >
          <span>Claim Reduction Badges</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-6">
        {/* 1. Overall ESG Card (Span 4 cols) */}
        <div className="glass-card col-span-1 md:col-span-4 lg:col-span-4 p-8 flex flex-col justify-between relative overflow-hidden group rounded-3xl">
          {/* Decorative ambient light */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-container/10 rounded-full blur-[80px] pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>

          <div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-on-surface">Overall ESG Score</h3>
              <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                <BarChart3 className="w-5 h-5 text-primary-container" />
              </div>
            </div>
            <p className="text-xs md:text-sm text-[#a6adc8] leading-relaxed">
              Comprehensive index mapping environmental operations, employee equity, and regulatory compliance protocols.
            </p>
          </div>

          <div className="mt-8">
            <div className="flex items-baseline gap-1.5">
              <span className="text-6xl font-bold font-sans tracking-tight esg-gradient-text">
                {avgESGScore}
              </span>
              <span className="text-xl text-[#a6adc8] font-semibold">/100</span>
            </div>

            <div className="mt-5">
              <span className="px-3 py-1 bg-green/10 rounded-full border border-green/20 flex items-center gap-1 w-fit text-green text-[11px] font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+4.2% from last quarter</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2. Emissions Trend (Span 8 cols) */}
        <div className="glass-card col-span-1 md:col-span-8 lg:col-span-8 p-8 flex flex-col relative overflow-hidden group rounded-3xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 z-10 relative">
            <div>
              <h3 className="text-lg font-bold text-on-surface">Carbon Emissions Trend</h3>
              <p className="text-xs text-[#a6adc8] mt-0.5">
                Total footprint equivalent (tCO2e) generated across facilities
              </p>
            </div>
            <div className="flex bg-white/[0.03] p-0.5 border border-white/5 rounded-xl">
              <button
                id="trend-monthly-btn"
                onClick={() => {
                  setTrendView('monthly');
                  setActiveHoverIdx(4);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  trendView === 'monthly'
                    ? 'bg-white/10 text-on-surface border border-white/5'
                    : 'text-on-surface-variant/80 hover:text-on-surface'
                }`}
              >
                Monthly
              </button>
              <button
                id="trend-quarterly-btn"
                onClick={() => {
                  setTrendView('quarterly');
                  setActiveHoverIdx(3);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  trendView === 'quarterly'
                    ? 'bg-white/10 text-on-surface border border-white/5'
                    : 'text-on-surface-variant/80 hover:text-on-surface'
                }`}
              >
                Quarterly
              </button>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="flex-1 w-full min-h-[160px] relative z-10 mt-2">
            <svg
              className="w-full h-full min-h-[160px]"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="gradient-area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#a6e3a1" stopOpacity="0.25"></stop>
                  <stop offset="100%" stopColor="#a6e3a1" stopOpacity="0"></stop>
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line stroke="rgba(255,255,255,0.04)" strokeWidth="1" x1="0" x2={svgWidth} y1={svgHeight * 0.25} y2={svgHeight * 0.25}></line>
              <line stroke="rgba(255,255,255,0.04)" strokeWidth="1" x1="0" x2={svgWidth} y1={svgHeight * 0.5} y2={svgHeight * 0.5}></line>
              <line stroke="rgba(255,255,255,0.04)" strokeWidth="1" x1="0" x2={svgWidth} y1={svgHeight * 0.75} y2={svgHeight * 0.75}></line>

              {/* Area filled path */}
              {areaD && <path d={areaD} fill="url(#gradient-area)"></path>}

              {/* Line path */}
              {pathD && (
                <path
                  className="fill-none stroke-green"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: 'drop-shadow(0 4px 10px rgba(166, 227, 161, 0.45))' }}
                  d={pathD}
                ></path>
              )}

              {/* Reactive Data points */}
              {coordinates.map((pt, idx) => {
                const isActive = activeHoverIdx === idx;
                return (
                  <g key={idx}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isActive ? '8' : '4'}
                      fill={isActive ? '#a6e3a1' : '#11111b'}
                      stroke="#a6e3a1"
                      strokeWidth={isActive ? '2.5' : '2'}
                      className="cursor-pointer transition-all duration-150"
                      onClick={() => setActiveHoverIdx(idx)}
                      onMouseEnter={() => setActiveHoverIdx(idx)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Dynamic tooltips based on activeHoverIdx */}
            {activeHoverIdx !== null && coordinates[activeHoverIdx] && (
              <div
                id="trend-chart-tooltip"
                className="absolute bg-[#181825] border border-green/30 rounded-xl p-3 shadow-lg z-20 backdrop-blur-md animate-fade-in pointer-events-none"
                style={{
                  left: `${Math.min(
                    Math.max(coordinates[activeHoverIdx].x - 70, 10),
                    svgWidth - 160
                  )}px`,
                  top: `${Math.max(coordinates[activeHoverIdx].y - 85, 10)}px`
                }}
              >
                <p className="text-[10px] uppercase font-bold text-[#a6adc8] mb-0.5">
                  {coordinates[activeHoverIdx].month}
                </p>
                <p className="text-xs font-semibold text-on-surface flex items-baseline gap-1">
                  <span className="text-sm font-bold text-white">
                    {coordinates[activeHoverIdx].value.toLocaleString()}
                  </span>
                  <span>{trendView === 'monthly' ? 'tCO2e' : 'tCO2e Q-Total'}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 3. Department Ranking (Span 6 cols) */}
        <div className="glass-card col-span-1 md:col-span-4 lg:col-span-6 p-8 flex flex-col justify-between rounded-3xl">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-lg font-bold text-on-surface">Top Performing Departments</h3>
              <p className="text-xs text-on-surface-variant/80 mt-0.5">Ranked by consolidated ESG index parameters</p>
            </div>
            <span className="material-symbols-outlined text-[#a6adc8] cursor-pointer hover:text-primary-container transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </span>
          </div>

          <div className="space-y-5 flex-1 justify-center flex flex-col">
            {departments.map((dept) => {
              // Custom fills matching Catppuccin Mocha spectrum specified
              let fillClass = 'bg-[#cba6f7]';
              let shadowStyle = { boxShadow: '0 0 10px rgba(203, 166, 247, 0.45)' };

              if (dept.name === 'Logistics') {
                fillClass = 'bg-[#74c7ec]';
                shadowStyle = { boxShadow: '0 0 10px rgba(116, 199, 236, 0.45)' };
              } else if (dept.name === 'Corporate') {
                fillClass = 'bg-[#fab387]';
                shadowStyle = { boxShadow: '0 0 10px rgba(250, 179, 135, 0.45)' };
              } else if (dept.name === 'Facilities') {
                fillClass = 'bg-[#a6e3a1]';
                shadowStyle = { boxShadow: '0 0 10px rgba(166, 227, 161, 0.45)' };
              }

              return (
                <div key={dept.id} id={`dept-row-${dept.id}`} className="group/dept cursor-pointer">
                  <div className="flex justify-between text-xs md:text-sm mb-1.5">
                    <span className="font-semibold text-on-surface group-hover/dept:text-primary-container transition-colors">
                      {dept.name}
                    </span>
                    <span className="font-mono text-[#a6adc8]">{dept.overallScore}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#313244] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${fillClass}`}
                      style={{
                        width: `${dept.overallScore}%`,
                        ...shadowStyle
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => onNavigateTab('settings')}
            className="mt-6 text-xs text-center font-bold text-[#a6adc8] hover:text-white transition-colors flex items-center justify-center gap-1"
          >
            <span>Configure target thresholds</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4. CSR Donut Chart (Span 6 cols) */}
        <div className="glass-card col-span-1 md:col-span-4 lg:col-span-6 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-on-surface mb-1">CSR Resource Allocation</h3>
            <p className="text-xs text-[#a6adc8] mb-5">Current fund allocation across active community programs</p>

            <div className="space-y-3">
              {allocations.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-on-surface flex-1 truncate">{item.name}</span>
                  <span className="text-xs font-mono font-bold text-white">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Donut SVG logic */}
          <div className="relative w-40 h-40 shrink-0">
            <svg
              className="w-full h-full -rotate-90 transform drop-shadow-xl"
              viewBox="0 0 100 100"
            >
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                fill="none"
                r="40"
                stroke="#313244"
                strokeWidth="11"
              ></circle>

              {/* Segments:
                  Community Outreach: 45% (dasharray: 113.1, dashoffset: -138.2)
                  Reforestation: 35% (dasharray: 88, dashoffset: -50.2)
                  Clean Energy Ed.: 20% (dasharray: 50.2, dashoffset: 0)
                  Circumference = ~251.3
              */}
              {/* Clean Energy: 20% */}
              <circle
                cx="50"
                cy="50"
                fill="none"
                r="40"
                stroke="#fab387"
                strokeWidth="11.5"
                strokeDasharray="50.2 201.1"
                strokeDashoffset="0"
                strokeLinecap="round"
              ></circle>

              {/* Reforestation: 35% */}
              <circle
                cx="50"
                cy="50"
                fill="none"
                r="40"
                stroke="#74c7ec"
                strokeWidth="11.5"
                strokeDasharray="88 163.3"
                strokeDashoffset="-50.2"
                strokeLinecap="round"
              ></circle>

              {/* Community Outreach: 45% */}
              <circle
                cx="50"
                cy="50"
                fill="none"
                r="40"
                stroke="#cba6f7"
                strokeWidth="11.5"
                strokeDasharray="113.1 138.2"
                strokeDashoffset="-138.2"
                strokeLinecap="round"
              ></circle>
            </svg>

            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-on-surface">
                ${(totalAllocationUSD / 1000000).toFixed(1)}M
              </span>
              <span className="text-[9px] text-[#a6adc8] font-bold uppercase tracking-wider">
                USD Total
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Carbon Auditing Action Block */}
      <div className="glass-card rounded-3xl p-6 bg-gradient-to-br from-[#1e1e2e]/60 to-[#11111b]/80 border border-white/5 flex flex-col sm:flex-row items-center gap-5 justify-between">
        <div className="flex gap-4 items-center">
          <div className="p-3 bg-green/10 rounded-2xl border border-green/20 text-green">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface">Audit Trail Transparency Assurance</h4>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Every manual entry undergoes instant conversion and logs a immutable footprint hash for stakeholder audit disclosures.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenLogModal}
          className="w-full sm:w-auto bg-green hover:bg-[#8ee089] text-[#11111b] font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all hover:scale-[1.03] active:scale-[0.98] shadow-[0_4px_15px_rgba(166,227,161,0.2)]"
        >
          Begin Audit Intake
        </button>
      </div>
    </div>
  );
}
