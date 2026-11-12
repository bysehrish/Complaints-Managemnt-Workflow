import React from 'react';
import {
  X,
  Layers,
  Sparkles,
  Sliders,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Play
} from 'lucide-react';
import { SubStepConfig, Complaint } from '../types';

interface SubStepModalProps {
  subStep: SubStepConfig | null;
  onClose: () => void;
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
}

export const SubStepModal: React.FC<SubStepModalProps> = ({
  subStep,
  onClose,
  complaints,
  onSelectComplaint,
}) => {
  if (!subStep) return null;

  const relevantComplaints = complaints.filter(
    (c) => c.stage === subStep.stage && c.subStep === subStep.name
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">{subStep.name}</h3>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                  Stage: {subStep.stage}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">Automated Pipeline Rule Engine</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Sub-step overview description */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
            {subStep.description}
          </div>

          {/* Active Automated Rule Card */}
          <div className="p-3.5 bg-gradient-to-r from-indigo-50/80 to-purple-50/50 rounded-xl border border-indigo-200">
            <div className="flex items-center gap-1.5 text-indigo-900 font-bold mb-1">
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Active Governance Rule Set</span>
            </div>
            <p className="text-[11px] font-mono text-indigo-950 bg-white/70 p-2 rounded border border-indigo-200 leading-relaxed">
              {subStep.automatedRule}
            </p>
          </div>

          {/* Batch Actions & Execution Toolbar */}
          <div>
            <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wide mb-2">
              Automated Batch Actions
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => alert(`Batch rule validation executed for ${subStep.name}. All SLA timers recalibrated.`)}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Execute Automation</span>
              </button>
              <button
                onClick={() => alert(`SLA escalation sweep triggered across ${subStep.name} queue.`)}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold transition-colors bg-white"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span>Calibrate Thresholds</span>
              </button>
            </div>
          </div>

          {/* Queue of complaints assigned to this substep */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wide">
                Active Cases In This Sub-Step ({relevantComplaints.length})
              </span>
            </div>

            {relevantComplaints.length === 0 ? (
              <div className="p-4 text-center border border-dashed border-slate-200 rounded-lg text-slate-400">
                No cases currently pending in this specific sub-step.
              </div>
            ) : (
              <div className="space-y-2">
                {relevantComplaints.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onClose();
                      onSelectComplaint(c);
                    }}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer flex items-center justify-between bg-white"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono font-bold text-slate-900">{c.id}</span>
                        <span className="text-slate-400">·</span>
                        <span className="font-semibold text-slate-700">{c.customerName}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                          {c.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{c.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {c.slaHoursRemaining}h
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
