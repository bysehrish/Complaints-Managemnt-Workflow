import React from 'react';
import {
  Search,
  Filter,
  Plus,
  Download,
  SlidersHorizontal,
  RefreshCw,
  Sparkles,
  BarChart2,
  Workflow,
  ShieldAlert
} from 'lucide-react';
import { IssueCategory, PriorityLevel } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedPriority: string;
  onPriorityChange: (prio: string) => void;
  currentView: 'workflow' | 'analytics' | 'history' | 'playground' | 'settings';
  onViewChange: (view: 'workflow' | 'analytics') => void;
  onOpenNewComplaint: () => void;
  onExport: () => void;
  copilotActive: boolean;
  onToggleCopilot: () => void;
  highPriorityCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedPriority,
  onPriorityChange,
  currentView,
  onViewChange,
  onOpenNewComplaint,
  onExport,
  copilotActive,
  onToggleCopilot,
  highPriorityCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 sticky top-0 z-20 shadow-xs">
      {/* Top Row: Title & Action Suite */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Title & Breadcrumbs */}
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-0.5">
            <span>Governance Operations</span>
            <span className="text-slate-300">/</span>
            <span>Case Routing Engine</span>
            {highPriorityCount > 0 && (
              <>
                <span className="text-slate-300">/</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <ShieldAlert className="w-3 h-3 text-amber-600" />
                  {highPriorityCount} Escalated Priority
                </span>
              </>
            )}
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span>Complaints Management Workflow Dashboard</span>
          </h1>
        </div>

        {/* Right: Global Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Mode Switcher */}
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => onViewChange('workflow')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                currentView === 'workflow'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Workflow className="w-3.5 h-3.5 text-indigo-600" />
              <span>Workflow Engine</span>
            </button>
            <button
              onClick={() => onViewChange('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                currentView === 'analytics'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Financial Report</span>
            </button>
          </div>

          {/* AI Copilot Toggle */}
          <button
            onClick={onToggleCopilot}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              copilotActive
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Toggle live automated AI Copilot triage recommendations"
          >
            <Sparkles className={`w-3.5 h-3.5 ${copilotActive ? 'text-indigo-600 fill-indigo-200' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Copilot:</span>
            <span className="font-semibold">{copilotActive ? 'Active' : 'Standby'}</span>
          </button>

          {/* Export Report */}
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors bg-white shadow-2xs"
            title="Export CSV Audit Ledger"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* New Complaint CTA */}
          <button
            onClick={onOpenNewComplaint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all shadow-indigo-600/20 active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Log Complaint</span>
          </button>
        </div>
      </div>

      {/* Filter Bar (Second tier in header) */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by case ID (e.g. CM-4581), customer, keyword..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="text-xs text-slate-500 hover:text-slate-800 px-1 font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Dropdown Filters */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Category:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-700 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Card">Card</option>
            <option value="Financial Statement">Financial Statement</option>
            <option value="Bank Account">Bank Account</option>
            <option value="Mobile App">Mobile App</option>
            <option value="Treasury Settlement">Treasury Settlement</option>
          </select>

          <div className="flex items-center gap-1.5 text-slate-500 font-medium ml-2">
            <span>Priority:</span>
          </div>
          <select
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-700 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>
    </header>
  );
};
