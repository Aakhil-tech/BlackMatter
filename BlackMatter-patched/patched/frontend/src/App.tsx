import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  Leaf, 
  Users, 
  Scale, 
  Trophy, 
  FileText, 
  Settings, 
  Menu, 
  X, 
  Bell, 
  Search, 
  CheckCircle, 
  Database,
  Briefcase,
  ExternalLink
} from "lucide-react";

// Views
import DashboardView from "./components/dashboard/DashboardView";
import EnvironmentalView from "./components/environmental/EnvironmentalView";
import SocialView from "./components/social/SocialView";
import GovernanceView from "./components/governance/GovernanceView";
import GamificationView from "./components/gamification/GamificationView";
import ReportsView from "./components/reports/ReportsView";
import SettingsView from "./components/settings/SettingsView";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Sidebar Menu Items
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, color: "hover:text-mauve text-mauve" },
    { name: "Environmental", icon: <Leaf className="w-5 h-5" />, color: "hover:text-green-env text-green-env" },
    { name: "Social", icon: <Users className="w-5 h-5" />, color: "hover:text-mauve text-mauve" },
    { name: "Governance", icon: <Scale className="w-5 h-5" />, color: "hover:text-sapphire text-sapphire" },
    { name: "Gamification", icon: <Trophy className="w-5 h-5" />, color: "hover:text-mauve text-mauve" },
    { name: "Reports", icon: <FileText className="w-5 h-5" />, color: "hover:text-peach text-peach" },
    { name: "Settings", icon: <Settings className="w-5 h-5" />, color: "hover:text-sapphire text-sapphire" },
  ];

  // Render active view
  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardView />;
      case "Environmental":
        return <EnvironmentalView />;
      case "Social":
        return <SocialView />;
      case "Governance":
        return <GovernanceView />;
      case "Gamification":
        return <GamificationView />;
      case "Reports":
        return <ReportsView />;
      case "Settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-crust text-text-subtext flex relative overflow-hidden custom-scrollbar selection:bg-mauve/30 selection:text-white">
      {/* Film Grain Ambient overlay */}
      <div className="film-grain" />

      {/* Decorative Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-mauve/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-sapphire/5 blur-[120px] pointer-events-none" />

      {/* Sidebar - Mobile drawer backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-crust/85 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Navigation Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 w-72 bg-mantle border-r border-white/5 p-6 flex flex-col justify-between z-50 transition-transform duration-300 transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:h-screen shrink-0`}
      >
        <div className="space-y-8">
          {/* Brand Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-mauve via-sapphire to-green-env p-[2px] shadow-lg shadow-mauve/15">
                <div className="w-full h-full bg-mantle rounded-2xl flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-green-env animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight">EcoSphere</h1>
                <span className="text-[10px] font-mono text-on-surface-variant font-semibold tracking-widest uppercase">ESG Management</span>
              </div>
            </div>
            
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden p-2 text-on-surface-variant hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 relative group ${
                    isActive 
                      ? "text-white bg-white/5 border-l-4 border-mauve" 
                      : "text-on-surface-variant hover:text-white hover:bg-white/[0.02]"
                  }`}
                >
                  <span className={isActive ? item.color : "text-on-surface-variant group-hover:text-white transition-colors"}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card footer */}
        <div className="border-t border-white/5 pt-6 space-y-4">
          <div className="flex items-center gap-3 bg-white/[0.01] border border-white/5 p-3 rounded-2xl">
            <div className="w-10 h-10 rounded-full border border-white/10 bg-white/10 overflow-hidden shrink-0">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPW7UC5Cv0EYZ_FlfjAzklxdIRH0LaSfcYwrFf9yuQGDB1083yciI2REVx4jXfP48QWtpXm5EARORXtnzPtjmuUdKJQA3iF_bU85C2lcCZ_fLCrwC7PRdBamdH1bNbn8waPjr_lkBUC-AejYTFaKZE24Re8Z54G9E585ozncUnr2OFKYQ5g75jsve51c_yO3ATsbZn9yNcqm1Qyneiuqb86-EA9DMKcKz3YdHMXrYjsdfCRhH2nHnb" 
                alt="Kenji Tanaka" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-white truncate">Kenji Tanaka</h4>
              <p className="text-[10px] text-on-surface-variant font-medium truncate">ESG Enterprise Admin</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-on-surface-variant font-mono">
            <span className="flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-green-env" />
              <span>BLACKMATTER</span>
            </span>
            <span className="flex items-center gap-1 text-green-env bg-green-env/10 px-1.5 py-0.5 rounded border border-green-env/10 font-bold uppercase">
              ● SECURE
            </span>
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header Controls Bar */}
        <header className="h-20 border-b border-white/5 px-6 md:px-10 flex items-center justify-between bg-mantle/40 backdrop-blur-md shrink-0 relative z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-on-surface-variant hover:text-white bg-white/5 rounded-xl border border-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Context Breadcrumbs */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
              <span>EcoSphere Workspace</span>
              <span>/</span>
              <span className="text-white font-bold">{activeTab}</span>
            </div>
          </div>

          {/* Header Action Items */}
          <div className="flex items-center gap-4">
            {/* Simple static search placeholder for visual balance */}
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search metrics & policies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-crust border border-white/5 rounded-full py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-mauve transition-all"
              />
            </div>

            {/* Notification alert */}
            <button className="relative p-2.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 text-on-surface-variant hover:text-white transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-mauve rounded-full" />
            </button>

            {/* Live UTC indicator for Enterprise aura */}
            <div className="hidden xl:flex flex-col items-end text-right font-mono">
              <span className="text-xs text-white font-bold">UTC: ACTIVE</span>
              <span className="text-[9px] text-on-surface-variant">Secured via OAuth API</span>
            </div>
          </div>
        </header>

        {/* Content View viewport */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar relative z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>
    </div>
  );
}
