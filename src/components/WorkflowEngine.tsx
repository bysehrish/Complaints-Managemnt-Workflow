import React, { useState } from 'react';
import {
  ChevronRight,
  Clock,
  User,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  Layers,
  CheckCircle2,
  AlertTriangle,
  MoveRight,
  Sliders,
  FileText
} from 'lucide-react';
import { Complaint, WorkflowStage, SubStepConfig } from '../types';

interface WorkflowEngineProps {
  complaints: Complaint[];
  subSteps: SubStepConfig[];
  onSelectComplaint: (complaint: Complaint) => void;
  onSelectSubStep: (subStep: SubStepConfig) => void;
  onMoveComplaint: (complaintId: string, targetStage: WorkflowStage, targetSubStep?: string) => void;
  copilotActive: boolean;
}

interface StageColumnDef {
  id: WorkflowStage;
  title: string;
  badgeLabel: string;
  badgeColor: string;
  subStepNames: string[];
  description: string;
}

export const WorkflowEngine: React.FC<WorkflowEngineProps> = ({
  complaints,
  subSteps,
  onSelectComplaint,
  onSelectSubStep,
  onMoveComplaint,
  copilotActive,
}) => {
  const [draggedComplaintId, setDraggedComplaintId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<WorkflowStage | null>(null);

  const STAGES: StageColumnDef[] = [
    {
      id: 'intake',
      title: 'INTAKE (New/Received)',
      badgeLabel: '15 New Cases',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      subStepNames: ['Intake New/Received', 'Dynamic Assign/Pestion', 'Dynamic Cases'],
      description: 'Multi-channel automated capture, payload parsing & triage intake routing.',
    },
    {
      id: 'triage',
      title: 'TRIAGE (Assign/Prioritize)',
      badgeLabel: '11 New Cases',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      subStepNames: ['Dynamic Prioritize', 'Dynamic Approval'],
      description: 'Severity calibration, regulatory exposure tagging & departmental dispatch.',
    },
    {
      id: 'investigation',
      title: 'INVESTIGATION (In Progress)',
      badgeLabel: '13 Active',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      subStepNames: ['Dynamic Status', 'Dynamic In Progress'],
      description: 'Forensic ledger check, transaction tracing & root-cause technical diagnosis.',
    },
    {
      id: 'resolution',
      title: 'RESOLUTION (Drafting/Approval)',
      badgeLabel: '3 Cases / 10 Cases',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      subStepNames: ['Dynamic Drafting', 'Dynamic Approval'],
      description: 'AI customer remedy formulation, compensation sign-off & governance audit.',
    },
    {
      id: 'closed',
      title: 'CLOSED (Finalized)',
      badgeLabel: '5 Finalized',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      subStepNames: ['Dynamic Finalized'],
      description: 'Customer notification confirmed, satisfaction telemetry logged & archived.',
    },
  ];

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedComplaintId(id);
  };

  const handleDragOver = (e: React.DragEvent, stageId: WorkflowStage) => {
    e.preventDefault();
    if (dragOverStage !== stageId) {
      setDragOverStage(stageId);
    }
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, stageId: WorkflowStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedComplaintId;
    if (id) {
      // Find default substep for target stage
      const defaultSub = STAGES.find(s => s.id === stageId)?.subStepNames[0];
      onMoveComplaint(id, stageId, defaultSub);
    }
    setDraggedComplaintId(null);
    setDragOverStage(null);
  };

  // Sequential progression helpers
  const getNextStage = (current: WorkflowStage): WorkflowStage | null => {
    const sequence: WorkflowStage[] = ['intake', 'triage', 'investigation', 'resolution', 'closed'];
    const idx = sequence.indexOf(current);
    return idx < sequence.length - 1 ? sequence[idx + 1] : null;
  };

  const getPrevStage = (current: WorkflowStage): WorkflowStage | null => {
    const sequence: WorkflowStage[] = ['intake', 'triage', 'investigation', 'resolution', 'closed'];
    const idx = sequence.indexOf(current);
    return idx > 0 ? sequence[idx - 1] : null;
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50/70 p-5 overflow-x-auto">
      {/* Visual Workflow Pipeline Banner with Step Connectors */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 mb-5 shadow-2xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            <span className="text-xs font-bold text-slate-800 tracking-tight uppercase">Automated Pipeline Routing Architecture</span>
            <span className="text-slate-400 text-xs">·</span>
            <span className="text-[11px] text-slate-500 font-medium">State transitions execute continuous SLA countdowns and audit checkpoints</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            5 Stages · Drag-and-drop or 1-click advance
          </div>
        </div>

        {/* Phase flow arrow step ribbon */}
        <div className="grid grid-cols-5 gap-2 items-center text-xs">
          {STAGES.map((stage, idx) => {
            const countInStage = complaints.filter(c => c.stage === stage.id).length;
            const isLast = idx === STAGES.length - 1;
            return (
              <div key={stage.id} className="relative flex items-center">
                <div className="flex-1 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg p-2 transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-slate-500 font-bold">0{idx + 1}</span>
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-700">
                      {countInStage} cases
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 text-[11px] truncate">{stage.title.split(' ')[0]}</div>
                  <div className="text-[10px] text-slate-500 truncate">{stage.title.split(' ').slice(1).join(' ')}</div>
                </div>
                {!isLast && (
                  <div className="hidden lg:flex items-center justify-center -mr-2.5 z-10 text-slate-400">
                    <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Kanban Multi-Stage Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 min-w-[1100px] flex-1 items-start">
        {STAGES.map((stage) => {
          const stageComplaints = complaints.filter((c) => c.stage === stage.id);
          const isOver = dragOverStage === stage.id;

          return (
            <div
              key={stage.id}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
              className={`flex flex-col bg-slate-100/90 rounded-xl border transition-all duration-150 min-h-[580px] ${
                isOver
                  ? 'border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Stage Header */}
              <div className="p-3.5 border-b border-slate-200 bg-white rounded-t-xl">
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <h3 className="text-xs font-bold text-slate-900 tracking-tight leading-snug">
                    {stage.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-xs mb-2">
                  <span className={`inline-flex items-center text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${stage.badgeColor}`}>
                    {stageComplaints.length} Active ({stage.badgeLabel})
                  </span>
                </div>

                {/* Sub-steps in this stage (Interactive cards per user prompt) */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Interactive Sub-Steps:
                  </div>
                  <div className="flex flex-col gap-1">
                    {stage.subStepNames.map((subName) => {
                      const matchedConfig = subSteps.find((s) => s.name === subName);
                      const subCount = complaints.filter(c => c.stage === stage.id && c.subStep === subName).length;

                      return (
                        <button
                          key={subName}
                          onClick={() => {
                            if (matchedConfig) onSelectSubStep(matchedConfig);
                          }}
                          className="group w-full flex items-center justify-between px-2 py-1.5 rounded-md bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-left transition-all"
                          title="Click to view automated rule set & sub-step governance"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform shrink-0" />
                            <span className="text-[11px] font-medium text-slate-700 group-hover:text-indigo-900 truncate">
                              {subName}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 group-hover:text-indigo-600 bg-white group-hover:bg-indigo-100/60 px-1.5 py-0.2 rounded border border-slate-200 group-hover:border-indigo-200">
                            {subCount}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Complaints Cards Container */}
              <div className="p-2.5 flex-1 space-y-2.5 overflow-y-auto max-h-[700px]">
                {stageComplaints.length === 0 ? (
                  <div className="h-36 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-300 rounded-lg text-slate-400">
                    <Layers className="w-6 h-6 text-slate-300 mb-1" />
                    <span className="text-xs font-medium">No complaints in stage</span>
                    <span className="text-[11px] text-slate-400">Drag items here or advance from previous</span>
                  </div>
                ) : (
                  stageComplaints.map((complaint) => {
                    const isUrgent = complaint.priority === 'Critical' || complaint.priority === 'High';
                    const next = getNextStage(complaint.stage);
                    const prev = getPrevStage(complaint.stage);

                    return (
                      <div
                        key={complaint.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, complaint.id)}
                        className={`group bg-white rounded-lg p-3 border transition-all shadow-2xs hover:shadow-sm cursor-grab active:cursor-grabbing relative ${
                          isUrgent ? 'border-amber-300/80 hover:border-amber-400 ring-1 ring-amber-300/30' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Top row: Case ID & Priority & AI Risk */}
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {complaint.id}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {complaint.priority === 'Critical' && (
                              <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 flex items-center gap-0.5">
                                <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />
                                Critical
                              </span>
                            )}
                            {complaint.priority === 'High' && (
                              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                High
                              </span>
                            )}
                            {complaint.priority === 'Medium' && (
                              <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                                Med
                              </span>
                            )}
                            {complaint.priority === 'Low' && (
                              <span className="text-[10px] font-medium text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                                Low
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Category & SubCategory */}
                        <div className="text-[11px] font-semibold text-slate-800 mb-1 flex items-center gap-1">
                          <span className="text-indigo-600 font-bold">{complaint.category}</span>
                          <span className="text-slate-300">/</span>
                          <span className="text-slate-600 font-normal">{complaint.subCategory}</span>
                        </div>

                        {/* Description snippet */}
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2.5">
                          {complaint.description}
                        </p>

                        {/* Customer & Team row */}
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 mb-2">
                          <div className="flex items-center gap-1.5 truncate max-w-[120px]" title={complaint.customerName}>
                            <User className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate font-medium text-slate-700">{complaint.customerName}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                            {complaint.team}
                          </span>
                        </div>

                        {/* SLA timer indicator & Copilot badge */}
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-3">
                          <div className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className={complaint.slaHoursRemaining <= 4 && complaint.slaHoursRemaining > 0 ? 'text-rose-600 font-bold' : ''}>
                              {complaint.stage === 'closed'
                                ? 'Resolved'
                                : complaint.slaHoursRemaining > 0
                                ? `${complaint.slaHoursRemaining}h left`
                                : 'SLA Breached'}
                            </span>
                          </div>
                          {copilotActive && complaint.aiRiskScore >= 70 && (
                            <span className="flex items-center gap-0.5 text-indigo-700 font-semibold bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                              <Sparkles className="w-2.5 h-2.5 text-indigo-600" />
                              AI {complaint.aiRiskScore}%
                            </span>
                          )}
                        </div>

                        {/* Action buttons footer */}
                        <div className="flex items-center justify-between gap-1 pt-1">
                          <button
                            onClick={() => onSelectComplaint(complaint)}
                            className="flex-1 text-[11px] font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 py-1 px-2 rounded border border-slate-200 transition-colors text-center"
                          >
                            Inspect & Draft
                          </button>

                          {/* Quick 1-click stage advancement */}
                          {prev && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onMoveComplaint(complaint.id, prev);
                              }}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
                              title={`Move back to ${prev}`}
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}

                          {next && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onMoveComplaint(complaint.id, next);
                              }}
                              className="p-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors flex items-center justify-center"
                              title={`Advance to ${next}`}
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
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
