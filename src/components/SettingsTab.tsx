/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Settings,
  Bell,
  RefreshCw,
  Building,
  Info,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { ESGThresholdSettings } from '../types';

interface SettingsTabProps {
  settings: ESGThresholdSettings;
  onUpdateSettings: (updated: Partial<ESGThresholdSettings>) => void;
  onResetData: () => void;
}

export default function SettingsTab({
  settings,
  onUpdateSettings,
  onResetData
}: SettingsTabProps) {
  const [compName, setCompName] = useState('EcoSphere Corporate Ltd.');
  const [compSector, setCompSector] = useState('Industrial & Logistics');
  const [success, setSuccess] = useState('');

  const handleToggle = (key: keyof ESGThresholdSettings) => {
    onUpdateSettings({ [key]: !settings[key] });
  };

  const handleNumChange = (key: keyof ESGThresholdSettings, val: number) => {
    onUpdateSettings({ [key]: Math.max(0, val) });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('Corporate thresholds & metadata optimized!');
    setTimeout(() => setSuccess(''), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Visual Header Banner */}
      {success && (
        <div className="bg-green/10 border border-green/20 text-green px-4 py-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle className="w-4 h-4 text-green" />
          <span>{success}</span>
        </div>
      )}

      {/* Profile & Sector panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Company profile (Span 6) */}
        <div className="glass-card lg:col-span-6 p-6 rounded-3xl">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 mb-1">
            <Building className="w-5 h-5 text-primary-container" />
            <span>Corporate ESG Metadata Profiles</span>
          </h3>
          <p className="text-xs text-[#a6adc8] mb-5">Set profile properties that will reflect on all disclosure reporting forms</p>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Organization Registered Name
              </label>
              <input
                type="text"
                value={compName}
                onChange={(e) => setCompName(e.target.value)}
                className="w-full bg-[#11111b] border border-white/10 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Industrial Operational Sector
              </label>
              <select
                value={compSector}
                onChange={(e) => setCompSector(e.target.value)}
                className="w-full bg-[#11111b] border border-white/10 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none"
              >
                <option value="Industrial & Logistics">Industrial & Logistics Operations</option>
                <option value="Technology & Software">Technology & Cloud Computing</option>
                <option value="Finance & Venture Investment">Finance & Capital Markets</option>
                <option value="Hospitality & Services">Retail & Corporate Services</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-primary-container hover:bg-[#b58df1] text-crust font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-[0.98] shadow-sm"
            >
              Update Profile Details
            </button>
          </form>
        </div>

        {/* Global Threshold settings (Span 6) */}
        <div className="glass-card lg:col-span-6 p-6 rounded-3xl">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-peach" />
            <span>Target Threshold Benchmarks</span>
          </h3>
          <p className="text-xs text-[#a6adc8] mb-5">Establish maximum caps and metrics that trigger administrative alarms</p>

          <div className="space-y-4 font-sans text-xs">
            {/* Target Carbon */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-white block">Maximum Carbon Footprint Cap</span>
                <span className="text-[10px] text-on-surface-variant/80">YTD max target equivalent limit (tCO2e)</span>
              </div>
              <input
                type="number"
                min="50"
                max="2000"
                value={settings.targetCarbonYTD}
                onChange={(e) => handleNumChange('targetCarbonYTD', parseInt(e.target.value) || 500)}
                className="w-24 bg-[#11111b] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-on-surface font-mono text-center"
              />
            </div>

            {/* Target Social Satisfaction */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-white block">Social Satisfaction Target Index</span>
                <span className="text-[10px] text-on-surface-variant/80">Minimum acceptable employee satisfaction %</span>
              </div>
              <input
                type="number"
                min="50"
                max="100"
                value={settings.socialSatisfactionTarget}
                onChange={(e) => handleNumChange('socialSatisfactionTarget', parseInt(e.target.value) || 85)}
                className="w-24 bg-[#11111b] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-on-surface font-mono text-center"
              />
            </div>

            {/* Toggle alerts */}
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-white/[0.03]">
              <div>
                <span className="font-bold text-white block">Audit Alert Notifications</span>
                <span className="text-[10px] text-on-surface-variant/80">Trigger notifications on high variance spikes</span>
              </div>
              <button
                onClick={() => handleToggle('alertNotifications')}
                className={`
                  w-12 h-6.5 rounded-full p-1 transition-all cursor-pointer flex items-center
                  ${settings.alertNotifications ? 'bg-peach justify-end' : 'bg-[#313244] justify-start'}
                `}
              >
                <span className="w-4.5 h-4.5 bg-crust rounded-full block shadow-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone / Factory Reset */}
      <div className="glass-card p-6 rounded-3xl border border-error/20 bg-error/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-4 items-center">
          <div className="p-3 bg-error/10 rounded-2xl border border-error/20 text-error">
            <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-error">EcoSphere Audit Recovery & Reset</h4>
            <p className="text-xs text-[#a6adc8] mt-0.5 max-w-xl">
              This will clear any custom audit logs, purchased offset project allocations, or changed governance incident statuses and revert the platform back to initial pristine design defaults.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Are you absolutely sure you want to reset all EcoSphere data? This cannot be undone.')) {
              onResetData();
              setSuccess('All platform metrics reset to default values!');
              setTimeout(() => setSuccess(''), 2000);
            }
          }}
          className="w-full sm:w-auto bg-error hover:bg-[#ff8a7d] text-[#11111b] font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm"
        >
          Reset All Data
        </button>
      </div>
    </div>
  );
}
