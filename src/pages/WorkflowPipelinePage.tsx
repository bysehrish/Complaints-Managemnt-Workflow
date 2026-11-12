import React, { useState } from 'react';
import {
  ChevronRight,
  Clock,
  User,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  AlertTriangle,
  MoveRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { CRMComplaint } from '../types/crm';
import { WorkflowStage } from '../types';

interface WorkflowPipelinePageProps {
  data: CRMComplaint[];
  onSelectComplaint: (complaint: CRMComplaint) => void;
  onMoveComplaint: (complaintNumber: string, targetStage: string) => void;
  copilotActive: boolean;
  onToggleCopilot: () => void;
}

interface KanbanColumn {
  id: string;
  title: string;
  stageName: string;
  badgeLabel: string;
  badgeColor: string;
  filterFn: (c: CRMComplaint) => boolean;
}

export const WorkflowPipelinePage: React.FC<WorkflowPipelinePageProps> = ({
  data,
  onSelectComplaint,
  onMoveComplaint,
  copilotActive,
  onToggleCopilot,
}) => {
  const [draggedComplaintNum, setDraggedComplaintNum] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('All');

  // Stages definition mapping CRM cases
  const COLUMNS: KanbanColumn[] = [
    {
      id: 'intake',
      title: 'INTAKE (New/Received)',
      stageName: 'Intake',
      badgeLabel: '15 New Cases',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      filterFn: (c) => (c.Status === 'Open' && (c.Aging <= 2 || c.ComplaintType.includes('Log In'))),
    },
    {
      id: 'triage',
      title: 'TRIAGE (Assign/Prioritize)',
      stageName: 'Triage',
      badgeLabel: '11 New Cases - AI Flagged',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      filterFn: (c) => (c.Status === 'Open' && c.Aging > 2),
    },
    {
      id: 'investigation',
      title: 'INVESTIGATION (In Progress)',
      stageName: 'Investigation',
      badgeLabel: '13 Active Cases',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      filterFn: (c) => (c.Status === 'In Progress' && c.Aging <= 4),
    },
    {
      id: 'resolution',
      title: 'RESOLUTION (Drafting/Approval)',
      stageName: 'Resolution',
      badgeLabel: '3 Drafting / 10 Approval',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      filterFn: (c) => (c.Status === 'In Progress' && c.Aging > 4),
    },
    {
      id: 'closed',
      title: 'CLOSED (Finalized)',
      stageName: 'Closed',
      badgeLabel: '5 Finalized',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      filterFn: (c) => (c.Status === 'Resolved' || c.Status === 'Closed'),
    },
  ];

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, complaintNum: string) => {
    e.dataTransfer.setData('text/plain', complaintNum);
    setDraggedComplaintNum(complaintNum);
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    if (dragOverStage !== colId) {
      setDragOverStage(colId);
    }
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, targetColId: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedComplaintNum;
    if (id) {
      onMoveComplaint(id, targetColId);
    }
    setDraggedComplaintNum(null);
    setDragOverStage(null);
  };

  const filteredData = data.filter((c) => {
    if (selectedFilterCategory !== 'All' && c.Product !== selectedFilterCategory) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Top Workflow Pipeline Banner with Step Connectors */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-base font-bold text-[#0B2559] dark:text-white flex items-center gap-2">
              <span>Interactive Workflow Pipeline (Kanban State Engine)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-700">
                Live Drag & Drop Enabled
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Automated routing rules enforce SLA triggers across the 5 regulatory complaint resolution milestones
            </p>
          </div>

          {/* Copilot Mode Toggle & Category Filter */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onToggleCopilot}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                copilotActive
                  ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-200 text-blue-700 dark:text-blue-300 shadow-2xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Complaints-Copilot:</span>
              <span className="font-bold">{copilotActive ? 'Active' : 'Standby'}</span>
            </button>

            <select
              value={selectedFilterCategory}
              onChange={(e) => setSelectedFilterCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
            >
              <option value="All">All Products</option>
              <option value="Card">Card</option>
              <option value="Financial Statement">Financial Statement</option>
              <option value="Bank Account">Bank Account</option>
              <option value="Mobile App">Mobile App</option>
            </select>
          </div>
        </div>

        {/* Phase ribbon connector */}
        <div className="grid grid-cols-5 gap-2 items-center text-xs">
          {COLUMNS.map((col, idx) => {
            const countInCol = filteredData.filter(col.filterFn).length;
            const isLast = idx === COLUMNS.length - 1;
            return (
              <div key={col.id} className="relative flex items-center">
                <div className="flex-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-slate-500">0{idx + 1}</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      {countInCol} cases
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs truncate">
                    {col.title.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {col.title.split(' ').slice(1).join(' ')}
                  </div>
                </div>
                {!isLast && (
                  <div className="hidden lg:flex items-center justify-center -mr-2 z-10 text-slate-400">
                    <ChevronRight className="w-4 h-4 text-blue-500 shrink-0" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 min-w-[1050px] overflow-x-auto pb-4 items-start">
        {COLUMNS.map((col) => {
          const colCases = filteredData.filter(col.filterFn);
          const isOver = dragOverStage === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`flex flex-col bg-slate-100/90 dark:bg-slate-800/60 rounded-2xl border transition-all duration-150 min-h-[580px] ${
                isOver
                  ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-t-2xl">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                  {col.title}
                </h3>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className={`inline-flex items-center text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${col.badgeColor}`}>
                    {colCases.length} Cases ({col.badgeLabel})
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="p-2.5 flex-1 space-y-2.5 overflow-y-auto max-h-[640px]">
                {colCases.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-400">
                    <Layers className="w-5 h-5 text-slate-300 mb-1" />
                    <span className="text-xs font-medium">No cases in stage</span>
                  </div>
                ) : (
                  colCases.map((row) => {
                    const isHighPriority = row.Priority === 'Critical' || row.Priority === 'High';

                    return (
                      <div
                        key={row['Complaint Number']}
                        draggable
                        onDragStart={(e) => handleDragStart(e, row['Complaint Number'])}
                        className={`group bg-white dark:bg-slate-900 rounded-xl p-3 border transition-all shadow-2xs hover:shadow-sm cursor-grab active:cursor-grabbing ${
                          isHighPriority
                            ? 'border-amber-300 dark:border-amber-600/60 ring-1 ring-amber-300/30'
                            : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {/* Top: Case ID & Priority */}
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600">
                            {row['Complaint Number']}
                          </span>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                            row.Priority === 'Critical' ? 'bg-rose-100 text-rose-800' :
                            row.Priority === 'High' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {row.Priority}
                          </span>
                        </div>

                        {/* Product & Subcategory */}
                        <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1">
                          <span className="text-blue-600 dark:text-blue-400">{row.Product}</span>
                          <span className="text-slate-300">/</span>
                          <span className="font-medium text-slate-600 dark:text-slate-400">{row.ComplaintType}</span>
                        </div>

                        {/* Description Statement */}
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 mb-2">
                          {row.description_compaint}
                        </p>

                        {/* Customer & CMU Owner */}
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-100 dark:border-slate-800 mb-2">
                          <span className="truncate max-w-[110px] font-medium text-slate-700 dark:text-slate-300">
                            {row.customer_name_c}
                          </span>
                          <span className="font-mono text-[10px] bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                            {row.cmu_owner_c}
                          </span>
                        </div>

                        {/* SLA Aging Indicator */}
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2.5 font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {row.Aging} days active
                          </span>
                          {row.City_c && (
                            <span className="text-slate-400">{row.City_c}</span>
                          )}
                        </div>

                        {/* Inspect & Action Button */}
                        <button
                          onClick={() => onSelectComplaint(row)}
                          className="w-full text-center py-1.5 px-2 bg-slate-50 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 hover:text-blue-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold text-[11px] transition-colors"
                        >
                          Inspect Case & AI Draft
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
