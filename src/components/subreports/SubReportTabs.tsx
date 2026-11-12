import React from 'react';
import {
  LayoutDashboard,
  Building2,
  GitBranch,
  Users2,
  ClockAlert,
  Sparkles
} from 'lucide-react';
import { SubReportView } from '../../types/crm';

interface SubReportTabsProps {
  currentView: SubReportView;
  onSelectView: (view: SubReportView) => void;
  datasetCount: number;
}

export const SubReportTabs: React.FC<SubReportTabsProps> = ({
  currentView,
  onSelectView,
  datasetCount,
}) => {
  const TABS: { id: SubReportView; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'executive',
      label: '1. Executive Summary',
      icon: <LayoutDashboard className="w-3.5 h-3.5" />,
      badge: 'Core Report',
    },
    {
      id: 'regional',
      label: '2. Regional & Branches',
      icon: <Building2 className="w-3.5 h-3.5" />,
    },
    {
      id: 'root_cause',
      label: '3. Root Cause & Decision',
      icon: <GitBranch className="w-3.5 h-3.5" />,
    },
    {
      id: 'channels',
      label: '4. Channels & Impact',
      icon: <Users2 className="w-3.5 h-3.5" />,
    },
    {
      id: 'cmu_aging',
      label: '5. CMU & SLA Aging',
      icon: <ClockAlert className="w-3.5 h-3.5" />,
      badge: 'SLA Guard',
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
      {/* Sub-report Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto py-0.5">
        {TABS.map((tab) => {
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectView(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#0B2559] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              <span className={isActive ? 'text-blue-200' : 'text-slate-500'}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] font-mono px-1 py-0.2 rounded font-semibold ${
                    isActive
                      ? 'bg-blue-800 text-blue-200'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-700">
          Dataset: {datasetCount} Loaded CRM Records
        </span>
      </div>
    </div>
  );
};
