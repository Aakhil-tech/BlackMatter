import React, { useState } from "react";
import { useGamification } from "../../hooks/useGamification";
import { 
  Check, 
  Bolt, 
  Eye, 
  Award, 
  Star, 
  Calendar, 
  Loader2, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  Users
} from "lucide-react";

export default function GamificationView() {
  const { challenges, loading, error, joinChallenge } = useGamification();
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleJoin = async (id: string) => {
    setBusyId(id);
    try {
      await joinChallenge(id);
    } catch (err) {
      console.error(err);
    } finally {
      setBusyId(null);
    }
  };

  const getAccentColors = (category: string) => {
    switch (category) {
      case "Environmental":
        return "bg-green-env/10 border-green-env/20 text-green-env";
      case "Social":
        return "bg-sapphire/10 border-sapphire/20 text-sapphire";
      default:
        return "bg-mauve/10 border-mauve/20 text-mauve";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Engagement Initiatives</h2>
        <p className="text-on-surface-variant text-sm mt-1">
          Drive corporate sustainability and compliance through active peer participation.
        </p>
      </div>

      {/* Navigation sub-tabs */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar border-b border-white/5">
        <button className="px-5 py-2 rounded-full text-xs font-bold text-crust bg-mauve hover:bg-mauve/90 shadow-lg shadow-mauve/15 flex items-center gap-1.5 whitespace-nowrap">
          <Star className="w-3.5 h-3.5" />
          <span>Challenges</span>
        </button>
        <button className="px-5 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:text-white hover:bg-white/5 transition-all whitespace-nowrap">
          Participation
        </button>
        <button className="px-5 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:text-white hover:bg-white/5 transition-all whitespace-nowrap">
          Badges
        </button>
        <button className="px-5 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:text-white hover:bg-white/5 transition-all whitespace-nowrap">
          Rewards
        </button>
        <button className="px-5 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:text-white hover:bg-white/5 transition-all whitespace-nowrap">
          Leaderboard
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-err/10 border border-red-err/20 rounded-xl flex items-center gap-2 text-red-err text-xs">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Pipeline Overview Banner */}
      <section className="glass-panel p-6 md:p-8 relative overflow-hidden">
        <h3 className="text-lg font-bold text-white mb-8">Pipeline Overview</h3>
        <div className="relative max-w-4xl mx-auto py-4">
          
          {/* Background tracks */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2 z-0" />
          <div className="absolute top-1/2 left-0 w-[45%] h-[2px] bg-mauve/40 -translate-y-1/2 z-0 shadow-[0_0_8px_rgba(203,166,247,0.5)]" />

          {/* Steps */}
          <div className="relative z-10 flex justify-between items-center">
            
            {/* Step 1: Draft (Completed) */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-mauve text-crust flex items-center justify-center shadow-[0_0_15px_rgba(203,166,247,0.3)]">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <span className="text-xs font-semibold text-white">Draft</span>
            </div>

            {/* Step 2: Active */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-mauve text-crust flex items-center justify-center shadow-[0_0_15px_rgba(203,166,247,0.3)] relative group">
                <Bolt className="w-5 h-5 fill-current" />
                <div className="absolute -inset-1 rounded-full border border-mauve/50 animate-ping opacity-20" />
              </div>
              <span className="text-xs font-semibold text-mauve">Active</span>
            </div>

            {/* Step 3: Under Review */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-surface-container border-2 border-mauve text-mauve flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-white">Under Review</span>
            </div>

            {/* Step 4: Completed */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-surface-container border border-white/10 text-on-surface-variant flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-on-surface-variant">Completed</span>
            </div>

          </div>
        </div>
      </section>

      {/* Available Challenges Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-white">Available Challenges</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading && challenges.length === 0 ? (
            <div className="col-span-full py-12 flex justify-center">
              <Loader2 className="w-8 h-8 text-mauve animate-spin" />
            </div>
          ) : (
            challenges.map((c) => {
              const isJoining = busyId === c.id;
              // Check custom loaded state
              const isJoined = (c as any).joined;

              return (
                <div 
                  key={c.id} 
                  className="glass-panel p-6 flex flex-col justify-between h-full group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${getAccentColors(c.category)}`}>
                        {c.category === "Environmental" ? (
                          <Sparkles className="w-5 h-5 text-green-env" />
                        ) : c.category === "Social" ? (
                          <Users className="w-5 h-5 text-sapphire" />
                        ) : (
                          <Star className="w-5 h-5 text-mauve" />
                        )}
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getAccentColors(c.category)}`}>
                        {c.category}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-white leading-tight mb-2 group-hover:text-mauve transition-colors">
                        {c.name}
                      </h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                        {c.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/5 space-y-4">
                    <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-peach fill-current" />
                        <span>{c.xp_reward} XP</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{c.days_left} Days Left</span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleJoin(c.id)}
                      disabled={isJoined || isJoining}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-1.5 ${
                        isJoined 
                          ? "bg-green-env/10 text-green-env border border-green-env/20"
                          : "bg-gradient-to-r from-mauve to-mauve/80 text-crust hover:shadow-lg hover:shadow-mauve/20 font-extrabold"
                      }`}
                    >
                      {isJoining ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isJoined ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Joined Challenge</span>
                        </>
                      ) : (
                        "Join Challenge"
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
