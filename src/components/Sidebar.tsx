/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  LayoutDashboard,
  Leaf,
  Users,
  Scale,
  Trophy,
  FileText,
  Settings,
  X
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  isOpen = false,
  onClose
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'environmental', label: 'Environmental', icon: Leaf },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'governance', label: 'Governance', icon: Scale },
    { id: 'gamification', label: 'Gamification', icon: Trophy },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    if (onClose) {
      onClose();
    }
  };

  const navClasses = `
    fixed md:sticky top-0 left-0 z-40
    h-screen w-64
    bg-gradient-to-b from-[#181825]/90 to-[#11111b]/95 backdrop-blur-xl
    border-r border-white/5
    flex flex-col py-6 px-4
    transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
  `;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          id="sidebar-overlay"
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <nav id="eco-sidebar" className={navClasses}>
        {/* Header Branding */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-container to-tertiary-container flex items-center justify-center shadow-[0_0_15px_rgba(203,166,247,0.3)]">
              <Leaf className="w-5 h-5 text-surface-container-low fill-[#11111b]" />
            </div>
            <div>
              <h1 className="font-display font-bold text-primary-container tracking-tight text-xl">
                EcoSphere
              </h1>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant/70">
                ESG Management
              </p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            id="sidebar-close-btn"
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-white/5"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 space-y-1.5 overflow-y-auto mt-2 pr-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium text-sm transition-all duration-200 group
                  ${
                    isActive
                      ? 'text-on-primary-container bg-primary-container/20 border-r-2 border-primary-container shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
                  }
                `}
              >
                <IconComponent
                  className={`
                    w-4.5 h-4.5 transition-transform duration-200
                    ${isActive ? 'text-primary-container' : 'text-on-surface-variant group-hover:scale-110'}
                  `}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* User Card */}
        <div className="mt-auto pt-4 border-t border-white/5 px-2">
          <div className="flex items-center gap-3">
            <img
              id="user-avatar"
              alt="User Avatar"
              className="w-10 h-10 rounded-full border border-white/10 object-cover shadow-sm hover:border-primary-container/40 transition-colors"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAs1jwNsjPxTluFjEKbMQox5CwhpjLQEluPWL9oxkxn7yCiPMdqEcmS1fr1BrmOtalyRWob8ajJVY8Cw8wTWClaEFuTeoVv0e-TFpu2lyQGPKDrtuJE6ee-bDnWgkSdvJOyysV4QSw6_2d54x3KK9B1pMJEbhu42JMasryjCOp5tZ-Joi4mijjz487XPO4gvfvDa_LQeukF1O9uIy_LA7T6DHxtK1P2h9LsPDRAfcCM8pp4_wm4O8Ed"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <p className="text-sm text-on-surface font-semibold truncate leading-tight">
                Aakhil
              </p>
              <p className="text-[11px] text-on-surface-variant/70 font-medium leading-none mt-1">
                Admin
              </p>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
