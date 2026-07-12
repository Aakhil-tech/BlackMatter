/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Calculator, Info, CheckCircle } from 'lucide-react';
import { CarbonLogEntry } from '../types';

interface CarbonDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<CarbonLogEntry, 'id'>) => void;
  departments: string[];
}

export default function CarbonDataModal({
  isOpen,
  onClose,
  onSave,
  departments
}: CarbonDataModalProps) {
  const [department, setDepartment] = useState(departments[0] || 'Operations');
  const [activityType, setActivityType] = useState<CarbonLogEntry['activityType']>('Electricity');
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [calculatedTco2e, setCalculatedTco2e] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Conversion rates (Metric Tonnes of CO2 equivalent per unit)
  const CONVERSION_FACTORS = {
    Electricity: { factor: 0.0004, unit: 'kWh', label: 'Electricity Consumption' },
    'Fuel/Gas': { factor: 0.0088, unit: 'Gallons', label: 'Diesel/Gasoline Fuel' },
    'Business Travel': { factor: 0.00022, unit: 'Miles', label: 'Commercial Flight or Fleet Mileage' },
    'Waste Management': { factor: 2.016, unit: 'Tons', label: 'Landfill Waste Disposal' },
    'Water Consumption': { factor: 0.000026, unit: 'Gallons', label: 'Recycled and Fresh Water Intake' }
  };

  const activeMeta = CONVERSION_FACTORS[activityType];

  // Auto-calculate Carbon tCO2e whenever activity or amount changes
  useEffect(() => {
    const rawVal = parseFloat(amount.toString()) || 0;
    const computed = rawVal * activeMeta.factor;
    setCalculatedTco2e(parseFloat(computed.toFixed(4)));
  }, [amount, activityType, activeMeta.factor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    onSave({
      date,
      department,
      activityType,
      amount: parseFloat(amount.toString()),
      unit: activeMeta.unit,
      tco2e: calculatedTco2e,
      notes: notes.trim() || `Log of ${activityType}`
    });

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setAmount(0);
      setNotes('');
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Blur Overlay */}
      <div
        className="fixed inset-0 bg-[#100d12]/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Main Glass Modal Card */}
      <div className="glass-card relative w-full max-w-lg rounded-3xl p-6 md:p-8 bg-gradient-to-b from-[#181825] to-[#11111b] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary-container/10 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-peach/10 rounded-xl border border-peach/20">
              <Calculator className="w-5 h-5 text-peach" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">Log Dynamic Carbon Metrics</h3>
              <p className="text-xs text-on-surface-variant/70">Quantify emissions into tCO2e immediately</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {showSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-green/10 border border-green/30 flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green" />
            </div>
            <h4 className="text-xl font-bold text-on-surface">Data Logged Successfully!</h4>
            <p className="text-sm text-[#a6adc8] mt-1 max-w-xs">
              Emissions trend graphs and overall ESG scores updated across the Ecosphere portal.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {/* Split row: Department & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Corporate Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#11111b] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:border-peach/50 focus:ring-1 focus:ring-peach/20"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Audit Entry Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-[#11111b] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:border-peach/50 focus:ring-1 focus:ring-peach/20"
                />
              </div>
            </div>

            {/* Activity Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Emission Source Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(CONVERSION_FACTORS) as CarbonLogEntry['activityType'][]).map((type) => {
                  const active = activityType === type;
                  return (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setActivityType(type)}
                      className={`
                        px-3 py-2 text-xs font-medium rounded-xl border text-center transition-all truncate
                        ${
                          active
                            ? 'bg-peach/10 text-peach border-peach/40 shadow-sm'
                            : 'bg-[#11111b] text-on-surface-variant border-white/5 hover:border-white/20'
                        }
                      `}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amount input & Unit */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Operational Usage Amount
                </label>
                <span className="text-xs font-mono text-peach">
                  unit: {activeMeta.unit}
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0.001"
                  required
                  value={amount === 0 ? '' : amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  placeholder={`e.g. 15000 ${activeMeta.unit}`}
                  className="w-full bg-[#11111b] border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-peach/50 focus:ring-1 focus:ring-peach/20 font-mono pr-16"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-on-surface-variant uppercase">
                  {activeMeta.unit}
                </div>
              </div>
            </div>

            {/* Live conversion banner */}
            <div className="bg-surface-container-lowest/80 border border-white/5 rounded-2xl p-4 flex gap-3.5">
              <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400 self-start shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <div className="space-y-1.5 min-w-0">
                <p className="text-xs font-medium text-on-surface leading-tight">
                  {activeMeta.label} conversion factor:
                </p>
                <p className="text-[11px] text-on-surface-variant font-mono">
                  1 {activeMeta.unit} = {activeMeta.factor} tonnes of CO₂ equivalent (tCO₂e)
                </p>
                <div className="pt-2 flex items-baseline gap-2 border-t border-white/[0.03] mt-2">
                  <span className="text-[11px] font-semibold text-on-surface-variant">Computed Carbon output:</span>
                  <span className="text-base font-mono font-bold text-green">
                    {calculatedTco2e.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs font-bold text-green">tCO₂e</span>
                </div>
              </div>
            </div>

            {/* Notes input */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Audit Notes / Facility Details
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Briefly state location, equipment serial, or audit specifics..."
                rows={2}
                className="w-full bg-[#11111b] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:border-peach/50 focus:ring-1 focus:ring-peach/20"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-white/5 text-sm font-semibold text-on-surface-variant hover:text-on-surface hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={amount <= 0}
                className={`
                  px-6 py-2.5 rounded-xl text-sm font-semibold text-crust transition-all duration-200
                  ${
                    amount > 0
                      ? 'bg-peach hover:scale-[1.02] shadow-[0_4px_12px_rgba(250,179,135,0.2)]'
                      : 'bg-peach/40 cursor-not-allowed opacity-50'
                  }
                `}
              >
                Validate & Save Log
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
