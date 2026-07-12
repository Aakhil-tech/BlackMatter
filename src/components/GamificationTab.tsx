/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  Trophy,
  Leaf,
  Coins,
  ShieldCheck,
  Zap,
  Globe,
  PlusCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';
import { EcoChallenge, CarbonOffsetOffering, EcoBadge } from '../types';

interface GamificationTabProps {
  challenges: EcoChallenge[];
  offsetOfferings: CarbonOffsetOffering[];
  badges: EcoBadge[];
  onCompleteChallenge: (id: string) => void;
  onBuyOffset: (offeringId: string, tonnes: number) => void;
  totalCredits: number;
  totalOffsetsPurchasedTonnes: number;
}

export default function GamificationTab({
  challenges,
  offsetOfferings,
  badges,
  onCompleteChallenge,
  onBuyOffset,
  totalCredits,
  totalOffsetsPurchasedTonnes
}: GamificationTabProps) {
  const [purchaseQty, setPurchaseQty] = useState<{ [key: string]: number }>({});
  const [purchaseSuccess, setPurchaseSuccess] = useState('');

  const handleQtyChange = (offeringId: string, val: number) => {
    setPurchaseQty((prev) => ({ ...prev, [offeringId]: Math.max(1, val) }));
  };

  const handleBuy = (offering: CarbonOffsetOffering) => {
    const qty = purchaseQty[offering.id] || 10;
    const cost = qty * offering.costPerTonne;

    if (totalCredits < cost) {
      alert(`Insufficient Eco-Credits balance. You need ${cost} credits but have ${totalCredits}. Complete challenges to earn credits!`);
      return;
    }

    onBuyOffset(offering.id, qty);
    setPurchaseSuccess(`Successfully offset ${qty} tonnes of CO2 via ${offering.project}!`);
    setTimeout(() => setPurchaseSuccess(''), 2500);
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-6 h-6 text-green" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-primary-container" />;
      case 'Leaf':
        return <Leaf className="w-6 h-6 text-[#74c7ec]" />;
      case 'HeartHandshake':
        return <Trophy className="w-6 h-6 text-peach" />;
      default:
        return <Trophy className="w-6 h-6 text-[#a6adc8]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Status row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-3xl flex items-center justify-between bg-gradient-to-r from-peach/10 to-transparent">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-peach/10 rounded-2xl text-peach border border-peach/20">
              <Coins className="w-6 h-6 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Eco-Credits Balance</span>
              <span className="text-2xl font-bold text-white font-mono">{totalCredits.toLocaleString()}</span>
              <span className="text-[10px] text-[#a6adc8] block mt-0.5">Use credits to purchase carbon offsets</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl flex items-center justify-between bg-gradient-to-r from-green/10 to-transparent">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-green/10 rounded-2xl text-green border border-green/20">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Carbon Offsets Retained</span>
              <span className="text-2xl font-bold text-white font-mono">{totalOffsetsPurchasedTonnes} tCO2e</span>
              <span className="text-[10px] text-green font-semibold block mt-0.5">Directly lowers corporate Net Scope emissions</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-primary-container/10 rounded-2xl text-primary-container border border-primary-container/20">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Unlocked Eco-Badges</span>
              <span className="text-2xl font-bold text-white">
                {badges.filter((b) => b.unlocked).length} <span className="text-sm font-semibold text-[#a6adc8]">/ {badges.length}</span>
              </span>
              <span className="text-[10px] text-primary-container font-semibold block mt-0.5">Claimed from active challenges</span>
            </div>
          </div>
        </div>
      </div>

      {purchaseSuccess && (
        <div className="bg-green/10 border border-green/25 text-green px-4 py-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-green" />
          <span>{purchaseSuccess}</span>
        </div>
      )}

      {/* Main Grid split: Marketplace vs Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Carbon Offset Marketplace (Span 7) */}
        <div className="glass-card lg:col-span-7 p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Globe className="w-5 h-5 text-green" />
              <span>Verified Carbon Offset Marketplace</span>
            </h3>
            <p className="text-xs text-[#a6adc8] mt-1 mb-5">
              Acquire certified third-party offsets to immediately balance corporate emissions. Costs are in Eco-Credits.
            </p>
          </div>

          <div className="space-y-4 flex-1">
            {offsetOfferings.map((offering) => {
              const qty = purchaseQty[offering.id] || 10;
              const totalCost = qty * offering.costPerTonne;

              return (
                <div
                  key={offering.id}
                  id={`offering-${offering.id}`}
                  className="p-4 rounded-2xl bg-white/[0.015] border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-white/10 transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-bold text-[#a6e3a1] uppercase tracking-wider px-2 py-0.5 bg-[#a6e3a1]/10 rounded-md border border-[#a6e3a1]/15 w-fit block mb-1">
                      {offering.type} Project
                    </span>
                    <h4 className="text-sm font-bold text-white leading-tight">{offering.project}</h4>
                    <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">{offering.location}</p>
                    <p className="text-xs text-[#a6adc8] leading-relaxed mt-2 pr-2">
                      {offering.description}
                    </p>
                  </div>

                  {/* Operational controls */}
                  <div className="w-full sm:w-auto shrink-0 flex flex-col items-stretch sm:items-end gap-3.5 bg-white/[0.02] sm:bg-transparent p-3 sm:p-0 rounded-xl">
                    <div className="flex items-center gap-2.5 self-center sm:self-auto">
                      <span className="text-xs text-on-surface-variant font-semibold">Tonnage to Buy:</span>
                      <input
                        type="number"
                        min="1"
                        max="500"
                        value={qty}
                        onChange={(e) => handleQtyChange(offering.id, parseInt(e.target.value) || 1)}
                        className="w-16 bg-[#11111b] border border-white/10 rounded-lg px-2 py-1 text-xs text-on-surface text-center font-mono"
                      />
                    </div>

                    <div className="text-center sm:text-right">
                      <p className="text-xs text-on-surface-variant font-medium">Cost: <strong className="text-white font-mono">{totalCost.toLocaleString()}</strong> credits</p>
                      <p className="text-[10px] text-on-surface-variant/70 font-mono">({offering.costPerTonne} credits/tonne)</p>
                    </div>

                    <button
                      id={`buy-btn-${offering.id}`}
                      onClick={() => handleBuy(offering)}
                      className="bg-green hover:bg-[#8ee089] text-[#11111b] font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] w-full shadow-sm"
                    >
                      Allocate Credits
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Eco Challenges & Active Badges (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Challenges */}
          <div className="glass-card p-6 rounded-3xl">
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-peach" />
              <span>Operational Eco-Challenges</span>
            </h3>
            <p className="text-xs text-[#a6adc8] mb-5">Complete current goals to claim rewards and earn more Eco-Credits</p>

            <div className="space-y-4">
              {challenges.map((chal) => (
                <div
                  key={chal.id}
                  id={`challenge-${chal.id}`}
                  className="p-3.5 rounded-2xl bg-[#11111b]/80 border border-white/5 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div>
                      <h4 className="text-xs font-bold text-white">{chal.title}</h4>
                      <p className="text-[10px] text-on-surface-variant/80 mt-1 leading-relaxed">
                        {chal.description}
                      </p>
                    </div>

                    <span className="text-xs font-mono font-bold text-peach shrink-0 bg-peach/10 px-2 py-1 border border-peach/15 rounded-lg">
                      +{chal.points} pts
                    </span>
                  </div>

                  {/* Progress bar or Claim rewards */}
                  <div className="mt-3 flex items-center justify-between gap-4 pt-3 border-t border-white/[0.03]">
                    {chal.completed ? (
                      <span className="text-xs font-semibold text-green flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed & Claimed</span>
                      </span>
                    ) : (
                      <>
                        <div className="flex-1">
                          <div className="flex justify-between text-[10px] text-[#a6adc8] font-semibold mb-1">
                            <span>Goal progress</span>
                            <span>{chal.unit === 'weeks' ? `${(chal.progress * 100).toFixed(0)}%` : `${chal.progress}/${chal.target} ${chal.unit}`}</span>
                          </div>
                          <div className="h-1 w-full bg-[#313244] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-peach rounded-full"
                              style={{ width: `${Math.min(100, (chal.progress / chal.target) * 100)}%` }}
                            />
                          </div>
                        </div>

                        <button
                          id={`complete-btn-${chal.id}`}
                          onClick={() => onCompleteChallenge(chal.id)}
                          className="bg-peach/10 hover:bg-peach/25 text-peach hover:text-white border border-peach/25 font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all shrink-0"
                        >
                          Complete Quest
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unlocked Badges Cabinet */}
          <div className="glass-card p-6 rounded-3xl">
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-4">Eco-Badges Cabinet</h3>

            <div className="grid grid-cols-2 gap-3.5">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  id={`badge-card-${badge.id}`}
                  className={`
                    p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center transition-all duration-200
                    ${
                      badge.unlocked
                        ? 'bg-white/[0.015] border-white/5 hover:border-primary-container/20 hover:scale-[1.02]'
                        : 'bg-black/30 border-dashed border-white/5 opacity-50'
                    }
                  `}
                >
                  <div className={`p-2.5 rounded-xl mb-2.5 ${badge.unlocked ? 'bg-white/5' : 'bg-black/20'}`}>
                    {badge.unlocked ? getBadgeIcon(badge.icon) : <Lock className="w-6 h-6 text-on-surface-variant" />}
                  </div>
                  <h4 className="text-xs font-bold text-white">{badge.title}</h4>
                  <p className="text-[9px] text-[#a6adc8] mt-1 leading-snug">
                    {badge.description}
                  </p>
                  {badge.unlocked && badge.unlockedAt && (
                    <span className="text-[8px] font-mono text-[#a6adc8] block mt-2">
                      Unlocked: {badge.unlockedAt}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
