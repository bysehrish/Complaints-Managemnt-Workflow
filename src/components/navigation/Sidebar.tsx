import React from 'react';
import {
  LayoutDashboard,
  CalendarRange,
  Activity,
  Layers,
  Landmark,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { PortalPage } from '../../types/portal';

interface SidebarProps {
  currentPage: PortalPage;
  onNavigate: (page: PortalPage) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  totalCasesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  isDarkMode,
  onToggleDarkMode,
  totalCasesCount,
}) => {
  const MENU_ITEMS = [
    {
      id: 'dashboard' as PortalPage,
      label: 'Executive Dashboard',
      shortLabel: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
      badge: `${totalCasesCount}`,
    },
    {
      id: 'monthly_analysis' as PortalPage,
      label: 'Monthly Complaints Analysis – Jan To Dec - 2026',
      shortLabel: 'Monthly Analysis',
      icon: <CalendarRange className="w-5 h-5 shrink-0" />,
      badge: '10.4% CAF',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    {
      id: 'quarterly_metrics' as PortalPage,
      label: 'Product Quarterly Metrics (CDR)',
      shortLabel: 'Quarterly CDR',
      icon: <Activity className="w-5 h-5 shrink-0" />,
      badge: 'Q1–Q3 2026',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    },
    {
      id: 'sub_category_breakdown' as PortalPage,
      label: 'Top Product-Wise & Sub-Category Breakdown',
      shortLabel: 'Sub-Categories',
      icon: <Layers className="w-5 h-5 shrink-0" />,
      badge: 'Granular Q1–Q3',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
  ];

  return (
    <aside
      className={`h-screen bg-[#0F172A] text-slate-300 flex flex-col shrink-0 border-r border-slate-800 transition-all duration-200 select-none z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* ========================================================= */}
      {/* 1. TOP BRANDING BLOCK                                     */}
      {/* ========================================================= */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-900/40 shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-white tracking-tight truncate leading-tight flex items-center gap-1.5">
                <span>Complaints Dashboard</span>
              </div>
              <div className="text-[10px] text-blue-400 font-medium tracking-wide truncate">
                Service Quality
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Landmark className="w-5 h-5" />
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-auto"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* ========================================================= */}
      {/* 2. NAVIGATION MENU (GOVERNANCE CONSOLE)                    */}
      {/* ========================================================= */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {!isCollapsed && (
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            GOVERNANCE CONSOLE
          </div>
        )}

        {MENU_ITEMS.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all group text-left relative ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}>
                {item.icon}
              </div>

              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="truncate leading-snug">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border shrink-0 ml-1.5 ${
                        item.badgeColor
                          ? item.badgeColor
                          : isActive
                          ? 'bg-blue-700/80 text-blue-100 border-blue-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* ========================================================= */}
      {/* 3. SIDEBAR FOOTER BLOCK                                   */}
      {/*    - Dark / Light Mode Switch (🌙 / ☀️) ONLY              */}
      {/* ========================================================= */}
      <div className="p-3 border-t border-slate-800 bg-[#0B1120]">
        {!isCollapsed ? (
          <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 font-medium text-slate-400">
              {isDarkMode ? 'Dark Theme' : 'Light Theme'}
            </span>
            <button
              onClick={onToggleDarkMode}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-semibold text-amber-300">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] font-semibold text-blue-300">Dark</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-blue-400" />
              )}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
