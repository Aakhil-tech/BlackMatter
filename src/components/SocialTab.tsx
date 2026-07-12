/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  Users,
  Award,
  ShieldAlert,
  HeartHandshake,
  TrendingUp,
  UserCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { SocialMetrics } from '../types';

interface SocialTabProps {
  socialMetrics: SocialMetrics;
  onUpdateMetrics: (updated: Partial<SocialMetrics>) => void;
}

export default function SocialTab({
  socialMetrics,
  onUpdateMetrics
}: SocialTabProps) {
  const [successMsg, setSuccessMsg] = useState('');

  const handleSliderChange = (key: keyof SocialMetrics, val: number) => {
    onUpdateMetrics({ [key]: val });
  };

  const handleGenderChange = (gender: 'female' | 'male' | 'nonbinary', val: number) => {
    const updatedRatio = { ...socialMetrics.genderDiversity, [gender]: val };

    // Standardize total to 100%
    const sum = updatedRatio.female + updatedRatio.male + updatedRatio.nonbinary;
    if (sum > 0) {
      updatedRatio.female = Math.round((updatedRatio.female / sum) * 100);
      updatedRatio.male = Math.round((updatedRatio.male / sum) * 100);
      updatedRatio.nonbinary = 100 - updatedRatio.female - updatedRatio.male;
    }

    onUpdateMetrics({ genderDiversity: updatedRatio });
  };

  const triggerSaveNotification = () => {
    setSuccessMsg('Social parameters optimized and computed!');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Visual Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Satisf */}
        <div className="glass-card p-5 rounded-3xl flex items-center gap-4">
          <div className="p-3 bg-primary-container/10 rounded-2xl text-primary-container border border-primary-container/20">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#a6adc8] uppercase tracking-wider block">Employee Satisfaction</span>
            <span className="text-2xl font-bold text-white">{socialMetrics.employeeSatisfaction}%</span>
            <span className="text-[10px] text-green font-semibold block mt-0.5">YTD Target Achieved</span>
          </div>
        </div>

        {/* Community Invest */}
        <div className="glass-card p-5 rounded-3xl flex items-center gap-4">
          <div className="p-3 bg-peach/10 rounded-2xl text-peach border border-peach/20">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#a6adc8] uppercase tracking-wider block">Community outreach</span>
            <span className="text-2xl font-bold text-white">${(socialMetrics.communityInvestmentUSD / 1000000).toFixed(2)}M</span>
            <span className="text-[10px] text-on-surface-variant block mt-0.5">Active Fund allocations</span>
          </div>
        </div>

        {/* Training hours */}
        <div className="glass-card p-5 rounded-3xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#a6adc8] uppercase tracking-wider block">Training Hours / Staff</span>
            <span className="text-2xl font-bold text-white">{socialMetrics.trainingHoursPerEmployee} hrs</span>
            <span className="text-[10px] text-green font-semibold block mt-0.5">Compliances & Ethics</span>
          </div>
        </div>

        {/* Workplace safety */}
        <div className="glass-card p-5 rounded-3xl flex items-center gap-4">
          <div className="p-3 bg-error/10 rounded-2xl text-error border border-error/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#a6adc8] uppercase tracking-wider block">Workplace Incidents</span>
            <span className="text-2xl font-bold text-error">{socialMetrics.workplaceSafetyIncidents} YTD</span>
            <span className="text-[10px] text-error-container font-semibold block mt-0.5">Regulatory Safe Level</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Management Controls & Diversity ratios */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gender diversity distribution (Span 5) */}
        <div className="glass-card lg:col-span-5 p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-container" />
              <span>Staff Gender Distribution</span>
            </h3>
            <p className="text-xs text-[#a6adc8] mt-1 mb-6">
              Workplace composition split reflecting active, salary-based corporate headcount
            </p>
          </div>

          {/* Graphical Split Segment */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-on-surface-variant block">Segment Ratio split</span>
              <div className="h-6 w-full rounded-xl overflow-hidden flex">
                <div
                  className="h-full bg-primary-container transition-all flex items-center justify-center text-[10px] font-bold text-crust"
                  style={{ width: `${socialMetrics.genderDiversity.female}%` }}
                  title={`Female: ${socialMetrics.genderDiversity.female}%`}
                >
                  {socialMetrics.genderDiversity.female >= 15 && `${socialMetrics.genderDiversity.female}%`}
                </div>
                <div
                  className="h-full bg-peach transition-all flex items-center justify-center text-[10px] font-bold text-crust"
                  style={{ width: `${socialMetrics.genderDiversity.male}%` }}
                  title={`Male: ${socialMetrics.genderDiversity.male}%`}
                >
                  {socialMetrics.genderDiversity.male >= 15 && `${socialMetrics.genderDiversity.male}%`}
                </div>
                <div
                  className="h-full bg-green transition-all flex items-center justify-center text-[10px] font-bold text-crust"
                  style={{ width: `${socialMetrics.genderDiversity.nonbinary}%` }}
                  title={`Non-Binary: ${socialMetrics.genderDiversity.nonbinary}%`}
                >
                  {socialMetrics.genderDiversity.nonbinary >= 15 && `${socialMetrics.genderDiversity.nonbinary}%`}
                </div>
              </div>
              <div className="flex justify-between text-xs font-semibold mt-2 text-[#a6adc8]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                  <span>Female ({socialMetrics.genderDiversity.female}%)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-peach" />
                  <span>Male ({socialMetrics.genderDiversity.male}%)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-green" />
                  <span>Non-Binary ({socialMetrics.genderDiversity.nonbinary}%)</span>
                </span>
              </div>
            </div>

            {/* Diversity optimization triggers */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider block">Adjust Demographics (Simulate)</span>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-on-surface-variant block mb-1">Female %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={socialMetrics.genderDiversity.female}
                    onChange={(e) => handleGenderChange('female', parseInt(e.target.value) || 0)}
                    className="w-full bg-[#11111b] border border-white/5 rounded-lg px-2 py-1.5 text-xs text-on-surface font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-on-surface-variant block mb-1">Male %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={socialMetrics.genderDiversity.male}
                    onChange={(e) => handleGenderChange('male', parseInt(e.target.value) || 0)}
                    className="w-full bg-[#11111b] border border-white/5 rounded-lg px-2 py-1.5 text-xs text-on-surface font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-on-surface-variant block mb-1">Non-Bin %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={socialMetrics.genderDiversity.nonbinary}
                    disabled
                    className="w-full bg-[#11111b]/50 border border-white/5 rounded-lg px-2 py-1.5 text-xs text-on-surface-variant/70 font-mono cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Metrics Sliders (Span 7) */}
        <div className="glass-card lg:col-span-7 p-6 rounded-3xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green" />
                <span>Optimize Social Parameters</span>
              </h3>
              <p className="text-xs text-[#a6adc8] mt-1 mb-5">
                Adjust corporate social values to model impacts on workforce safety and local outreach totals
              </p>
            </div>
            {successMsg && (
              <span className="px-3 py-1 bg-green/10 text-green border border-green/20 text-xs rounded-xl flex items-center gap-1.5 animate-fade-in font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{successMsg}</span>
              </span>
            )}
          </div>

          <div className="space-y-4">
            {/* Satisfaction Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-on-surface">Target Employee Satisfaction Index</span>
                <span className="font-mono text-primary-container">{socialMetrics.employeeSatisfaction}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={socialMetrics.employeeSatisfaction}
                onChange={(e) => handleSliderChange('employeeSatisfaction', parseInt(e.target.value))}
                className="w-full accent-primary-container cursor-pointer"
              />
            </div>

            {/* Minority representation */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-on-surface">Minority / Underrepresented Representation</span>
                <span className="font-mono text-peach">{socialMetrics.minorityRepresentation}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                value={socialMetrics.minorityRepresentation}
                onChange={(e) => handleSliderChange('minorityRepresentation', parseInt(e.target.value))}
                className="w-full accent-peach cursor-pointer"
              />
            </div>

            {/* Training hours */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-on-surface">Annual Compliance & Technical Training</span>
                <span className="font-mono text-blue-400">{socialMetrics.trainingHoursPerEmployee} hrs/staff</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                value={socialMetrics.trainingHoursPerEmployee}
                onChange={(e) => handleSliderChange('trainingHoursPerEmployee', parseInt(e.target.value))}
                className="w-full accent-blue-400 cursor-pointer"
              />
            </div>

            {/* Community Investment Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-on-surface">Community Grant Investments (USD)</span>
                <span className="font-mono text-green">
                  ${(socialMetrics.communityInvestmentUSD).toLocaleString()} USD
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="5000000"
                step="50000"
                value={socialMetrics.communityInvestmentUSD}
                onChange={(e) => handleSliderChange('communityInvestmentUSD', parseInt(e.target.value))}
                className="w-full accent-green cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={triggerSaveNotification}
              className="bg-primary-container text-crust font-bold px-5 py-2.5 rounded-xl text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(203,166,247,0.2)]"
            >
              Recalculate Social Indices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
