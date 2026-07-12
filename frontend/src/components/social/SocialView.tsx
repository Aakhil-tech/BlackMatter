import React, { useState } from "react";
import { useSocial } from "../../hooks/useSocial";
import { 
  Users, 
  Check, 
  X, 
  Droplet, 
  TreePine, 
  HeartHandshake, 
  BookOpen, 
  Loader2, 
  AlertCircle 
} from "lucide-react";

export default function SocialView() {
  const { activities, approvals, loading, error, joinActivity, resolveApproval } = useSocial();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleJoin = async (id: string) => {
    setLoadingAction(`join-${id}`);
    try {
      await joinActivity(id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleApproval = async (id: string, action: "Approved" | "Rejected") => {
    setLoadingAction(`approve-${id}`);
    try {
      await resolveApproval(id, action);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  };

  // Helper to map icons based on activity name
  const getActivityIcon = (name: string) => {
    switch (name) {
      case "Tree Plantation":
        return <TreePine className="w-6 h-6 text-green-env" />;
      case "Blood Donation":
        return <Droplet className="w-6 h-6 text-red-err" />;
      case "Beach Cleanup":
        return <Droplet className="w-6 h-6 text-sapphire" />;
      default:
        return <BookOpen className="w-6 h-6 text-mauve" />;
    }
  };

  const getAccentColor = (name: string) => {
    switch (name) {
      case "Tree Plantation":
        return "bg-green-env/10 border-green-env/20 text-green-env";
      case "Blood Donation":
        return "bg-red-err/10 border-red-err/20 text-red-err";
      case "Beach Cleanup":
        return "bg-sapphire/10 border-sapphire/20 text-sapphire";
      default:
        return "bg-mauve/10 border-mauve/20 text-mauve";
    }
  };

  const pendingCount = approvals.filter(a => a.status === "Pending").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Social: CSR & Employee Engagement</h2>
        <p className="text-on-surface-variant text-sm mt-1">
          Fostering community impact, ecological volunteering, and employee well-being.
        </p>
      </div>

      {/* Navigation tabs */}
      <div className="flex gap-2.5 border-b border-white/5 pb-1">
        <button className="px-5 py-2 bg-mauve text-crust font-bold rounded-full text-xs shadow-lg shadow-mauve/15 whitespace-nowrap">
          CSR Activities
        </button>
        <button className="px-5 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:text-white hover:bg-white/5 transition-all whitespace-nowrap">
          Employee Participation
        </button>
        <button className="px-5 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:text-white hover:bg-white/5 transition-all whitespace-nowrap">
          Diversity Dashboard
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-err/10 border border-red-err/20 rounded-xl flex items-center gap-2 text-red-err text-xs">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid of CSR Activities */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading && activities.length === 0 ? (
          <div className="col-span-full py-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-mauve animate-spin" />
          </div>
        ) : (
          activities.map((act) => {
            const isJoining = loadingAction === `join-${act.id}`;
            const glowClass = 
              act.name === "Tree Plantation" ? "group-hover:bg-green-env/10" :
              act.name === "Blood Donation" ? "group-hover:bg-red-err/10" :
              act.name === "Beach Cleanup" ? "group-hover:bg-sapphire/10" : "group-hover:bg-mauve/10";

            return (
              <div 
                key={act.id} 
                className="glass-panel p-6 flex flex-col justify-between h-full group relative overflow-hidden"
              >
                {/* Visual ambient pulse */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 ${glowClass}`} />
                
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${getAccentColor(act.name)}`}>
                    {getActivityIcon(act.name)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight">{act.name}</h3>
                    <p className="text-xs text-on-surface-variant mt-1">{act.category}</p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                  {/* Participant Avatars */}
                  <div className="flex items-center -space-x-2">
                    {act.avatars.map((av, idx) => (
                      <div key={idx} className="w-6 h-6 rounded-full border border-crust overflow-hidden bg-white/10">
                        <img src={av} alt="participant" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {act.participants_count > act.avatars.length && (
                      <div className="w-6 h-6 rounded-full bg-crust border border-white/5 flex items-center justify-center text-[9px] text-on-surface-variant font-bold">
                        +{act.participants_count - act.avatars.length}
                      </div>
                    )}
                    {act.participants_count === 0 && (
                      <span className="text-[10px] text-on-surface-variant font-medium pl-1">0 volunteers</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleJoin(act.id)}
                    disabled={act.joined || isJoining}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-300 ${
                      act.joined
                        ? "bg-green-env/10 border-green-env/20 text-green-env"
                        : "border-white/10 text-white hover:bg-mauve hover:text-crust hover:border-mauve"
                    }`}
                  >
                    {isJoining ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : act.joined ? (
                      "Joined"
                    ) : (
                      "Join"
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Approval Queue Section */}
      <section className="glass-panel p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 className="text-lg font-bold text-white">Approval Queue</h3>
          <span className="px-2.5 py-1 rounded-full bg-white/5 text-on-surface-variant text-xs font-bold">
            {pendingCount} Pending
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-on-surface-variant text-xs font-bold">
                <th className="py-2.5 px-4">Employee</th>
                <th className="py-2.5 px-4">Activity</th>
                <th className="py-2.5 px-4">Hours</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-white">
              {loading && approvals.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center">
                    <Loader2 className="w-5 h-5 text-mauve animate-spin mx-auto" />
                  </td>
                </tr>
              ) : approvals.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-on-surface-variant">
                    No approval requests found.
                  </td>
                </tr>
              ) : (
                approvals.map((appr) => {
                  const isBusy = loadingAction === `approve-${appr.id}`;
                  const isPending = appr.status === "Pending";

                  return (
                    <tr key={appr.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 overflow-hidden">
                            <img src={appr.employee_avatar} alt={appr.employee_name} className="w-full h-full object-cover" />
                          </div>
                          <span className="font-semibold text-white">{appr.employee_name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium">{appr.activity_name}</td>
                      <td className="py-4 px-4 font-mono text-on-surface-variant">{appr.hours.toFixed(1)} hrs</td>
                      <td className="py-4 px-4 text-right">
                        {isPending ? (
                          <div className="flex justify-end gap-2.5">
                            <button
                              onClick={() => handleApproval(appr.id, "Rejected")}
                              disabled={isBusy}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-red-err hover:bg-red-err/10 transition-colors"
                            >
                              <X className="w-4 h-4" />
                              <span className="text-xs font-semibold">Reject</span>
                            </button>
                            <button
                              onClick={() => handleApproval(appr.id, "Approved")}
                              disabled={isBusy}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sapphire bg-sapphire/10 border border-sapphire/20 hover:bg-sapphire/20 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                              <span className="text-xs font-semibold">Approve</span>
                            </button>
                          </div>
                        ) : (
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${
                            appr.status === "Approved" 
                              ? "bg-green-env/10 text-green-env" 
                              : "bg-red-err/10 text-red-err"
                          }`}>
                            {appr.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
