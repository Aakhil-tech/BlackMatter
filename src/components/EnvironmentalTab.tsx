/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  Search,
  Filter,
  Trash2,
  Calendar,
  Layers,
  Leaf,
  PlusCircle,
  Wind,
  Sun,
  Flame,
  Info
} from 'lucide-react';
import { CarbonLogEntry } from '../types';

interface EnvironmentalTabProps {
  carbonLogs: CarbonLogEntry[];
  onAddLog: (entry: Omit<CarbonLogEntry, 'id'>) => void;
  onDeleteLog: (id: string) => void;
  departments: string[];
}

export default function EnvironmentalTab({
  carbonLogs,
  onAddLog,
  onDeleteLog,
  departments
}: EnvironmentalTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterActivity, setFilterActivity] = useState('All');

  // Calculator State
  const [calcActivity, setCalcActivity] = useState<'Electricity' | 'Fuel/Gas' | 'Business Travel'>('Electricity');
  const [calcVal, setCalcVal] = useState<number>(1000);

  const CONVERSIONS = {
    Electricity: { factor: 0.0004, unit: 'kWh' },
    'Fuel/Gas': { factor: 0.0088, unit: 'Gallons' },
    'Business Travel': { factor: 0.00022, unit: 'Miles' }
  };

  const calculatedCarbon = parseFloat((calcVal * CONVERSIONS[calcActivity].factor).toFixed(3));

  // Filter logs logic
  const filteredLogs = carbonLogs.filter((log) => {
    const matchesSearch =
      log.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.activityType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = filterDept === 'All' || log.department === filterDept;
    const matchesActivity = filterActivity === 'All' || log.activityType === filterActivity;

    return matchesSearch && matchesDept && matchesActivity;
  });

  const handleQuickAdd = () => {
    onAddLog({
      date: new Date().toISOString().split('T')[0],
      department: departments[0] || 'Operations',
      activityType: calcActivity,
      amount: calcVal,
      unit: CONVERSIONS[calcActivity].unit,
      tco2e: calculatedCarbon,
      notes: `Calculator quick-log of ${calcActivity}`
    });
  };

  return (
    <div className="space-y-6">
      {/* Upper Grid: Energy Mix & Carbon Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Renewable Energy Mix Gauge (Span 5) */}
        <div className="glass-card lg:col-span-5 p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Wind className="w-5 h-5 text-primary-container" />
              <span>Renewable Energy Intake</span>
            </h3>
            <p className="text-xs text-[#a6adc8] mt-1 mb-5">
              Current share of renewable vs grid-fossil power across industrial assembly plants
            </p>
          </div>

          <div className="space-y-4">
            {/* Solar segment */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-on-surface">
                  <Sun className="w-3.5 h-3.5 text-[#fab387]" /> Solar Arrays (Self-Generation)
                </span>
                <span className="font-mono text-white">35%</span>
              </div>
              <div className="h-1.5 w-full bg-[#313244] rounded-full overflow-hidden">
                <div className="h-full bg-[#fab387] rounded-full" style={{ width: '35%' }} />
              </div>
            </div>

            {/* Wind segment */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-on-surface">
                  <Wind className="w-3.5 h-3.5 text-[#74c7ec]" /> Purchased Wind Power PPA
                </span>
                <span className="font-mono text-white">42%</span>
              </div>
              <div className="h-1.5 w-full bg-[#313244] rounded-full overflow-hidden">
                <div className="h-full bg-[#74c7ec] rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            {/* Fossil Fuel grid */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-on-surface-variant">
                  <Flame className="w-3.5 h-3.5 text-error" /> Fossil Grid Power (Sourced)
                </span>
                <span className="font-mono text-white">23%</span>
              </div>
              <div className="h-1.5 w-full bg-[#313244] rounded-full overflow-hidden">
                <div className="h-full bg-error rounded-full" style={{ width: '23%' }} />
              </div>
            </div>
          </div>

          <div className="bg-[#a6e3a1]/5 border border-[#a6e3a1]/10 rounded-2xl p-3.5 flex gap-2.5 mt-5">
            <Info className="w-4 h-4 text-green self-start shrink-0" />
            <p className="text-[11px] text-[#a6adc8] leading-relaxed">
              Renewable share expanded by <strong className="text-white">+8%</strong> this month following the activation of the Logistics terminal roof-mounted solar array.
            </p>
          </div>
        </div>

        {/* Dynamic Calculator (Span 7) */}
        <div className="glass-card lg:col-span-7 p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green" />
              <span>Scope 1 & 2 Emissions Calculator</span>
            </h3>
            <p className="text-xs text-[#a6adc8] mt-1 mb-4">
              Instantly compute metrics into tCO2e to understand environmental impact.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['Electricity', 'Fuel/Gas', 'Business Travel'] as const).map((act) => (
                <button
                  type="button"
                  key={act}
                  onClick={() => setCalcActivity(act)}
                  className={`
                    px-4 py-2 text-xs font-semibold rounded-xl border text-center transition-all
                    ${
                      calcActivity === act
                        ? 'bg-green/10 text-green border-green/30 shadow-sm'
                        : 'bg-[#11111b] text-on-surface-variant border-white/5 hover:border-white/20'
                    }
                  `}
                >
                  {act}
                </button>
              ))}
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold text-on-surface-variant">
                <span>Operational Usage Quantity</span>
                <span className="font-mono text-green">
                  {CONVERSIONS[calcActivity].unit}
                </span>
              </div>
              <input
                type="number"
                min="1"
                value={calcVal}
                onChange={(e) => setCalcVal(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#11111b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-green/50 focus:ring-1 focus:ring-green/10 font-mono"
              />
            </div>

            {/* Results output */}
            <div className="bg-surface-container-lowest/60 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#a6adc8] uppercase tracking-wider block">
                  Calculated Footprint equivalent
                </span>
                <span className="text-2xl font-bold font-mono text-green">
                  {calculatedCarbon.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-green ml-1">tCO2e</span>
              </div>

              <button
                onClick={handleQuickAdd}
                disabled={calcVal <= 0}
                className="bg-green text-crust font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(166,227,161,0.2)]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Quick Log Entry</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Logs Ledger */}
      <div className="glass-card p-6 md:p-8 rounded-3xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-on-surface">Verified ESG Carbon Audit Logs</h3>
            <p className="text-xs text-[#a6adc8] mt-0.5">
              Comprehensive registry of verified carbon equivalents across operations
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Dept Filter */}
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="bg-[#11111b] border border-white/10 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none"
            >
              <option value="All">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* Activity Filter */}
            <select
              value={filterActivity}
              onChange={(e) => setFilterActivity(e.target.value)}
              className="bg-[#11111b] border border-white/10 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none"
            >
              <option value="All">All Activities</option>
              <option value="Electricity">Electricity</option>
              <option value="Fuel/Gas">Fuel/Gas</option>
              <option value="Business Travel">Business Travel</option>
              <option value="Waste Management">Waste Management</option>
              <option value="Water Consumption">Water Consumption</option>
            </select>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-3.5 h-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search description..."
                className="bg-[#11111b] border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:border-green/40 w-full"
              />
            </div>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-on-surface-variant">
            <Layers className="w-10 h-10 mx-auto mb-3 opacity-30 text-[#a6adc8]" />
            <p className="text-sm font-semibold">No carbon logs matched your current filters.</p>
            <p className="text-xs text-[#a6adc8]/70 mt-1">Try resetting the department or activity filters to view logs.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table id="carbon-logs-table" className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/5 text-xs font-bold text-on-surface-variant uppercase tracking-wider pb-3">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Source Category</th>
                  <th className="py-3 px-4 text-right">Raw Activity Amount</th>
                  <th className="py-3 px-4 text-right">Equiv. Carbon Output</th>
                  <th className="py-3 px-4">Notes / Audit Ref</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    id={`log-row-${log.id}`}
                    className="hover:bg-white/[0.01] transition-colors group/row"
                  >
                    <td className="py-3.5 px-4 font-mono text-xs flex items-center gap-1.5 text-on-surface">
                      <Calendar className="w-3.5 h-3.5 text-on-surface-variant" />
                      <span>{log.date}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-1 bg-white/5 rounded-md text-xs font-semibold text-white">
                        {log.department}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-[#a6adc8]">
                      {log.activityType}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs font-medium text-on-surface">
                      {log.amount.toLocaleString()} <span className="text-[10px] text-on-surface-variant">{log.unit}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs font-bold text-green">
                      {log.tco2e.toLocaleString(undefined, { minimumFractionDigits: 1 })} <span className="text-[10px]">tCO2e</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-on-surface-variant max-w-[200px] truncate">
                      {log.notes}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        id={`delete-btn-${log.id}`}
                        onClick={() => onDeleteLog(log.id)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
