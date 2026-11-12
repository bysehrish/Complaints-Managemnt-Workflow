import React from 'react';
import {
  Compass,
  History,
  PlusCircle,
  FolderGit2,
  LayoutGrid,
  BarChart3,
  Sliders,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Workflow
} from 'lucide-react';

interface SidebarProps {
  currentView: 'workflow' | 'analytics' | 'history' | 'playground' | 'settings';
  onSelectView: (view: 'workflow' | 'analytics' | 'history' | 'playground' | 'settings') => void;
  openNewComplaint: () => void;
  totalComplaintsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  openNewComplaint,
  totalComplaintsCount,
}) => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 h-screen border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-900/40">
            <ShieldCheck className="w-5 h-5 text-indigo-100" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>Aegis Bank</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/60">OS</span>
            </div>
            <div className="text-[11px] text-slate-400 truncate font-medium">Complaints Engine</div>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs">
        {/* EXPLORE SECTION */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider uppercase text-slate-400">
            EXPLORE
          </div>
          <nav className="space-y-0.5">
            <button
              onClick={() => onSelectView('playground')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                currentView === 'playground'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4 text-slate-400" />
              <span>Playground</span>
            </button>
            <button
              onClick={() => onSelectView('history')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                currentView === 'history'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <History className="w-4 h-4 text-slate-400" />
              <span>History</span>
              <span className="ml-auto font-mono text-[10px] text-slate-300">49 logs</span>
            </button>
          </nav>
        </div>

        {/* BUILD SECTION */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider uppercase text-slate-400">
            BUILD
          </div>
          <nav className="space-y-0.5">
            <button
              onClick={openNewComplaint}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left text-slate-300 hover:bg-slate-800/60 hover:text-white group"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
              <span>New app / Ingest</span>
              <span className="ml-auto text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono">+ Case</span>
            </button>
            <button
              onClick={() => onSelectView('workflow')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                currentView === 'workflow'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Workflow className="w-4 h-4 text-slate-400" />
              <span>My apps (Workflows)</span>
              <span className="ml-auto font-mono text-[10px] text-slate-300">5 stages</span>
            </button>
            <button
              onClick={() => onSelectView('history')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left text-slate-300 hover:bg-slate-800/60 hover:text-white"
            >
              <LayoutGrid className="w-4 h-4 text-slate-400" />
              <span>Gallery (Rule Sets)</span>
            </button>
          </nav>
        </div>

        {/* MANAGE SECTION */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider uppercase text-slate-400">
            MANAGE
          </div>
          <nav className="space-y-0.5">
            <button
              onClick={() => onSelectView('workflow')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                currentView === 'workflow'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <FolderGit2 className="w-4 h-4 text-slate-400" />
              <span>Dashboard</span>
              <span className="ml-auto font-mono text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">
                {totalComplaintsCount}
              </span>
            </button>
            <button
              onClick={() => onSelectView('analytics')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                currentView === 'analytics'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-slate-400" />
              <span>Analytics</span>
              <span className="ml-auto text-[10px] text-emerald-400 font-mono">Report</span>
            </button>
            <button
              onClick={() => onSelectView('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                currentView === 'settings'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Promotional Card: Unlock Gemini 4 Argon */}
        <div className="pt-2">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900/60 border border-indigo-800/40 text-left relative overflow-hidden">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span className="text-xs font-bold text-white">Unlock Gemini 4 Argon</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Upgrade governance automation to 4 Argon for predictive dispute settlement & instant regulatory filings.
            </p>
            <button
              onClick={() => alert('Gemini 4 Argon Enterprise Copilot module initialized with automated CFPB & FDIC policy compliance checkers.')}
              className="w-full flex items-center justify-between px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-semibold transition-colors"
            >
              <span>Explore Capabilities</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-900 transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-slate-800">
            SA
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-white truncate">Sehrish Athar</div>
            <div className="text-[10px] text-slate-400 truncate">Governance View</div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400" title="Active Governance Officer" />
        </div>
      </div>
    </aside>
  );
};
