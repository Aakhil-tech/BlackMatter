/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  INITIAL_CARBON_LOGS,
  INITIAL_DEPARTMENTS,
  INITIAL_CSR_ALLOCATIONS,
  INITIAL_CHALLENGES,
  INITIAL_OFFSET_OFFERINGS,
  INITIAL_BADGES,
  INITIAL_COMPLIANCE_ITEMS,
  INITIAL_INCIDENTS,
  INITIAL_SOCIAL_METRICS,
  INITIAL_SETTINGS
} from './data';
import {
  CarbonLogEntry,
  DepartmentESG,
  CSRAllocation,
  EcoChallenge,
  CarbonOffsetOffering,
  EcoBadge,
  ComplianceItem,
  GovernanceIncident,
  SocialMetrics,
  ESGThresholdSettings
} from './types';

// Layout imports
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardTab from './components/DashboardTab';
import EnvironmentalTab from './components/EnvironmentalTab';
import SocialTab from './components/SocialTab';
import GovernanceTab from './components/GovernanceTab';
import GamificationTab from './components/GamificationTab';
import ReportsTab from './components/ReportsTab';
import SettingsTab from './components/SettingsTab';
import CarbonDataModal from './components/CarbonDataModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Persistent States
  const [carbonLogs, setCarbonLogs] = useState<CarbonLogEntry[]>(() => {
    const saved = localStorage.getItem('ecosphere_logs');
    return saved ? JSON.parse(saved) : INITIAL_CARBON_LOGS;
  });

  const [departments, setDepartments] = useState<DepartmentESG[]>(() => {
    const saved = localStorage.getItem('ecosphere_depts');
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
  });

  const [allocations, setAllocations] = useState<CSRAllocation[]>(() => {
    const saved = localStorage.getItem('ecosphere_allocations');
    return saved ? JSON.parse(saved) : INITIAL_CSR_ALLOCATIONS;
  });

  const [challenges, setChallenges] = useState<EcoChallenge[]>(() => {
    const saved = localStorage.getItem('ecosphere_challenges');
    return saved ? JSON.parse(saved) : INITIAL_CHALLENGES;
  });

  const [offsetOfferings, setOffsetOfferings] = useState<CarbonOffsetOffering[]>(() => {
    const saved = localStorage.getItem('ecosphere_offsets');
    return saved ? JSON.parse(saved) : INITIAL_OFFSET_OFFERINGS;
  });

  const [badges, setBadges] = useState<EcoBadge[]>(() => {
    const saved = localStorage.getItem('ecosphere_badges');
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>(() => {
    const saved = localStorage.getItem('ecosphere_compliance');
    return saved ? JSON.parse(saved) : INITIAL_COMPLIANCE_ITEMS;
  });

  const [incidents, setIncidents] = useState<GovernanceIncident[]>(() => {
    const saved = localStorage.getItem('ecosphere_incidents');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [socialMetrics, setSocialMetrics] = useState<SocialMetrics>(() => {
    const saved = localStorage.getItem('ecosphere_social');
    return saved ? JSON.parse(saved) : INITIAL_SOCIAL_METRICS;
  });

  const [settings, setSettings] = useState<ESGThresholdSettings>(() => {
    const saved = localStorage.getItem('ecosphere_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [totalCredits, setTotalCredits] = useState<number>(() => {
    const saved = localStorage.getItem('ecosphere_credits');
    return saved ? parseInt(saved) : 10000; // Starting with 10k credits
  });

  const [totalOffsetsPurchasedTonnes, setTotalOffsetsPurchasedTonnes] = useState<number>(() => {
    const saved = localStorage.getItem('ecosphere_purchased_offsets');
    return saved ? parseFloat(saved) : 0;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ecosphere_logs', JSON.stringify(carbonLogs));
  }, [carbonLogs]);

  useEffect(() => {
    localStorage.setItem('ecosphere_depts', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('ecosphere_allocations', JSON.stringify(allocations));
  }, [allocations]);

  useEffect(() => {
    localStorage.setItem('ecosphere_challenges', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem('ecosphere_offsets', JSON.stringify(offsetOfferings));
  }, [offsetOfferings]);

  useEffect(() => {
    localStorage.setItem('ecosphere_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('ecosphere_compliance', JSON.stringify(complianceItems));
  }, [complianceItems]);

  useEffect(() => {
    localStorage.setItem('ecosphere_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('ecosphere_social', JSON.stringify(socialMetrics));
  }, [socialMetrics]);

  useEffect(() => {
    localStorage.setItem('ecosphere_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('ecosphere_credits', totalCredits.toString());
  }, [totalCredits]);

  useEffect(() => {
    localStorage.setItem('ecosphere_purchased_offsets', totalOffsetsPurchasedTonnes.toString());
  }, [totalOffsetsPurchasedTonnes]);

  // Handlers
  const handleSaveCarbonLog = (entry: Omit<CarbonLogEntry, 'id'>) => {
    const newEntry: CarbonLogEntry = {
      ...entry,
      id: `log-${Date.now()}`
    };

    setCarbonLogs((prev) => [newEntry, ...prev]);

    // Dynamically adjust the department metrics
    setDepartments((prevDepts) =>
      prevDepts.map((d) => {
        if (d.name === entry.department) {
          // Add newly logged emissions YTD
          const updatedEmissions = d.emissionsYTD + entry.tco2e;
          // Calculate environmental score factor adjustment (lower carbon = better score)
          const carbonFactor = Math.max(30, 95 - updatedEmissions * 0.15);
          const newEnvironmentalScore = Math.min(100, Math.round(carbonFactor));
          const newOverall = Math.round(
            (newEnvironmentalScore + d.socialScore + d.governanceScore) / 3
          );

          return {
            ...d,
            emissionsYTD: parseFloat(updatedEmissions.toFixed(2)),
            environmentalScore: newEnvironmentalScore,
            overallScore: newOverall,
            targetProgress: newOverall
          };
        }
        return d;
      })
    );
  };

  const handleDeleteCarbonLog = (id: string) => {
    const target = carbonLogs.find((l) => l.id === id);
    if (!target) return;

    setCarbonLogs((prev) => prev.filter((l) => l.id !== id));

    // Reverse the emissions footprint calculations
    setDepartments((prevDepts) =>
      prevDepts.map((d) => {
        if (d.name === target.department) {
          const updatedEmissions = Math.max(0, d.emissionsYTD - target.tco2e);
          const carbonFactor = Math.max(30, 95 - updatedEmissions * 0.15);
          const newEnvironmentalScore = Math.min(100, Math.round(carbonFactor));
          const newOverall = Math.round(
            (newEnvironmentalScore + d.socialScore + d.governanceScore) / 3
          );

          return {
            ...d,
            emissionsYTD: parseFloat(updatedEmissions.toFixed(2)),
            environmentalScore: newEnvironmentalScore,
            overallScore: newOverall,
            targetProgress: newOverall
          };
        }
        return d;
      })
    );
  };

  const handleToggleComplianceStatus = (id: string) => {
    const STATUS_FLOW: ComplianceItem['status'][] = ['Compliant', 'In Progress', 'Action Required'];

    setComplianceItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const currentIdx = STATUS_FLOW.indexOf(item.status);
          const nextIdx = (currentIdx + 1) % STATUS_FLOW.length;
          const nextStatus = STATUS_FLOW[nextIdx];

          // Trigger department score changes based on compliance changes
          let scoreImpact = 0;
          if (nextStatus === 'Compliant') scoreImpact = 4;
          if (nextStatus === 'Action Required') scoreImpact = -6;

          setDepartments((prevDepts) =>
            prevDepts.map((d) => {
              const updatedGov = Math.min(100, Math.max(30, d.governanceScore + scoreImpact));
              const updatedOverall = Math.round((d.environmentalScore + d.socialScore + updatedGov) / 3);
              return {
                ...d,
                governanceScore: updatedGov,
                overallScore: updatedOverall,
                targetProgress: updatedOverall
              };
            })
          );

          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const handleAddIncident = (incident: Omit<GovernanceIncident, 'id'>) => {
    const newInc: GovernanceIncident = {
      ...incident,
      id: `inc-${Date.now()}`
    };

    setIncidents((prev) => [newInc, ...prev]);

    // Severity based Governance score penalty
    let penalty = 2;
    if (incident.severity === 'Medium') penalty = 5;
    if (incident.severity === 'High') penalty = 10;

    setDepartments((prevDepts) =>
      prevDepts.map((d) => {
        const updatedGov = Math.max(30, d.governanceScore - penalty);
        const updatedOverall = Math.round((d.environmentalScore + d.socialScore + updatedGov) / 3);
        return {
          ...d,
          governanceScore: updatedGov,
          overallScore: updatedOverall,
          targetProgress: updatedOverall
        };
      })
    );
  };

  const handleCompleteChallenge = (id: string) => {
    setChallenges((prevChals) =>
      prevChals.map((chal) => {
        if (chal.id === id) {
          // Award Eco points as credits
          setTotalCredits((prev) => prev + chal.points);

          // Unlock reward badge if exists
          if (chal.rewardBadge) {
            setBadges((prevBadges) =>
              prevBadges.map((badge) => {
                if (badge.title === chal.rewardBadge) {
                  return {
                    ...badge,
                    unlocked: true,
                    unlockedAt: new Date().toISOString().split('T')[0]
                  };
                }
                return badge;
              })
            );
          }

          return { ...chal, completed: true, progress: chal.target };
        }
        return chal;
      })
    );
  };

  const handleBuyOffset = (offeringId: string, tonnes: number) => {
    const offering = offsetOfferings.find((o) => o.id === offeringId);
    if (!offering) return;

    const totalCost = tonnes * offering.costPerTonne;

    // Deduct credits & allocate tonnes
    setTotalCredits((prev) => Math.max(0, prev - totalCost));
    setTotalOffsetsPurchasedTonnes((prev) => prev + tonnes);

    // Update offset offering capacity
    setOffsetOfferings((prevOfferings) =>
      prevOfferings.map((o) => {
        if (o.id === offeringId) {
          return { ...o, tco2eAvailable: Math.max(0, o.tco2eAvailable - tonnes) };
        }
        return o;
      })
    );

    // Unlock Green Investor Badge
    setBadges((prevBadges) =>
      prevBadges.map((badge) => {
        if (badge.id === 'badge-3') {
          return {
            ...badge,
            unlocked: true,
            unlockedAt: new Date().toISOString().split('T')[0]
          };
        }
        return badge;
      })
    );
  };

  const handleUpdateSocialMetrics = (updated: Partial<SocialMetrics>) => {
    setSocialMetrics((prev) => {
      const next = { ...prev, ...updated };

      // Impact overall department score based on Social Satisfaction parameter
      if (updated.employeeSatisfaction !== undefined) {
        setDepartments((prevDepts) =>
          prevDepts.map((d) => {
            const currentSoc = d.socialScore;
            const updatedSoc = Math.min(100, Math.max(30, Math.round(next.employeeSatisfaction * 1.05)));
            const updatedOverall = Math.round((d.environmentalScore + updatedSoc + d.governanceScore) / 3);
            return {
              ...d,
              socialScore: updatedSoc,
              overallScore: updatedOverall,
              targetProgress: updatedOverall
            };
          })
        );
      }

      return next;
    });
  };

  const handleUpdateSettings = (updated: Partial<ESGThresholdSettings>) => {
    setSettings((prev) => ({ ...prev, ...updated }));
  };

  const handleResetData = () => {
    localStorage.clear();
    setCarbonLogs(INITIAL_CARBON_LOGS);
    setDepartments(INITIAL_DEPARTMENTS);
    setAllocations(INITIAL_CSR_ALLOCATIONS);
    setChallenges(INITIAL_CHALLENGES);
    setOffsetOfferings(INITIAL_OFFSET_OFFERINGS);
    setBadges(INITIAL_BADGES);
    setComplianceItems(INITIAL_COMPLIANCE_ITEMS);
    setIncidents(INITIAL_INCIDENTS);
    setSocialMetrics(INITIAL_SOCIAL_METRICS);
    setSettings(INITIAL_SETTINGS);
    setTotalCredits(10000);
    setTotalOffsetsPurchasedTonnes(0);
    setCurrentTab('dashboard');
  };

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardTab
            carbonLogs={carbonLogs}
            departments={departments}
            allocations={allocations}
            onOpenLogModal={() => setLogModalOpen(true)}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        );
      case 'environmental':
        return (
          <EnvironmentalTab
            carbonLogs={carbonLogs}
            onAddLog={handleSaveCarbonLog}
            onDeleteLog={handleDeleteCarbonLog}
            departments={departments.map((d) => d.name)}
          />
        );
      case 'social':
        return (
          <SocialTab
            socialMetrics={socialMetrics}
            onUpdateMetrics={handleUpdateSocialMetrics}
          />
        );
      case 'governance':
        return (
          <GovernanceTab
            complianceItems={complianceItems}
            incidents={incidents}
            onToggleComplianceStatus={handleToggleComplianceStatus}
            onAddIncident={handleAddIncident}
          />
        );
      case 'gamification':
        return (
          <GamificationTab
            challenges={challenges}
            offsetOfferings={offsetOfferings}
            badges={badges}
            onCompleteChallenge={handleCompleteChallenge}
            onBuyOffset={handleBuyOffset}
            totalCredits={totalCredits}
            totalOffsetsPurchasedTonnes={totalOffsetsPurchasedTonnes}
          />
        );
      case 'reports':
        return (
          <ReportsTab
            carbonLogs={carbonLogs}
            departments={departments}
            socialMetrics={socialMetrics}
            complianceItems={complianceItems}
          />
        );
      case 'settings':
        return (
          <SettingsTab
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetData={handleResetData}
          />
        );
      default:
        return (
          <div className="py-20 text-center text-on-surface-variant">
            Section not found
          </div>
        );
    }
  };

  return (
    <div id="ecosphere-root-layout" className="flex min-h-screen">
      {/* Sidebar Nav */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header Bar */}
        <Header
          currentTab={currentTab}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenLogModal={() => setLogModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Dynamic View Canvas */}
        <main id="tab-canvas-container" className="flex-1 p-4 md:p-8">
          {renderActiveTab()}
        </main>
      </div>

      {/* Audit Logs Modal */}
      <CarbonDataModal
        isOpen={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        onSave={handleSaveCarbonLog}
        departments={departments.map((d) => d.name)}
      />

      {/* Mobile Sticky Action Bar */}
      <nav id="mobile-sticky-nav" className="md:hidden fixed bottom-0 left-0 w-full bg-[#1d1a20]/90 backdrop-blur-xl border-t border-white/5 flex justify-around items-center h-16 z-40">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-semibold w-12 transition-colors ${
            currentTab === 'dashboard' ? 'text-primary-container' : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-lg leading-none">dashboard</span>
          <span>Home</span>
        </button>

        <button
          onClick={() => setCurrentTab('environmental')}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-semibold w-12 transition-colors ${
            currentTab === 'environmental' ? 'text-green' : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-lg leading-none">eco</span>
          <span>Env</span>
        </button>

        <button
          onClick={() => setCurrentTab('social')}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-semibold w-12 transition-colors ${
            currentTab === 'social' ? 'text-peach' : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-lg leading-none">groups</span>
          <span>Social</span>
        </button>

        <button
          onClick={() => setCurrentTab('settings')}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-semibold w-12 transition-colors ${
            currentTab === 'settings' ? 'text-primary-container' : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-lg leading-none">settings</span>
          <span>Menu</span>
        </button>
      </nav>
    </div>
  );
}
