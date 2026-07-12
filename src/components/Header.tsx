/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, Bell, Plus, Menu } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onOpenSidebar: () => void;
  onOpenLogModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({
  currentTab,
  onOpenSidebar,
  onOpenLogModal,
  searchQuery,
  setSearchQuery
}: HeaderProps) {
  const getPageTitle = (tabId: string) => {
    switch (tabId) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'environmental':
        return 'Environmental Sustainability';
      case 'social':
        return 'Social Equity & Diversity';
      case 'governance':
        return 'Corporate Governance';
      case 'gamification':
        return 'ESG Offsets & Gamification';
      case 'reports':
        return 'ESG Audit Reports';
      case 'settings':
        return 'System Settings';
      default:
        return 'EcoSphere ESG';
    }
  };

  return (
    <header
      id="eco-header"
      className="bg-transparent flex justify-between items-center px-4 md:px-8 py-5 sticky top-0 z-30 backdrop-blur-md bg-[#11111b]/40 border-b border-white/[0.03]"
    >
      {/* Title & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          id="mobile-menu-toggle"
          onClick={onOpenSidebar}
          className="md:hidden p-2 rounded-lg text-on-surface hover:bg-white/5 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">
            {getPageTitle(currentTab)}
          </h2>
          <p className="text-xs text-on-surface-variant hidden sm:block">
            EcoSphere Platform &bull; Live ESG Audit Intelligence
          </p>
        </div>
      </div>

      {/* Actions & Search */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Search Input */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
          <input
            id="metrics-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-surface-container-lowest/70 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm text-on-surface placeholder-on-surface-variant/50 focus:ring-1 focus:ring-primary-container/30 focus:border-primary-container/50 outline-none w-64 transition-all"
            placeholder="Search logs & metrics..."
          />
        </div>

        {/* Notifications and Add Data Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            id="notification-bell"
            className="relative p-2.5 rounded-full bg-white/[0.02] border border-white/5 hover:bg-white/5 text-on-surface-variant hover:text-primary-container transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-peach rounded-full shadow-[0_0_8px_#fab387]" />
          </button>

          <button
            id="log-carbon-data-header-btn"
            onClick={onOpenLogModal}
            className="bg-peach text-crust font-semibold px-4 md:px-5 py-2.5 rounded-full text-xs md:text-sm hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_15px_rgba(250,179,135,0.2)] hover:shadow-[0_4px_20px_rgba(250,179,135,0.35)] flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Log Carbon Data</span>
            <span className="sm:hidden">Log</span>
          </button>
        </div>
      </div>
    </header>
  );
}
