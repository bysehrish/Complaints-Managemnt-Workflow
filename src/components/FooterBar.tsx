import React from 'react';
import { Sparkles, Shield, Cpu, RefreshCw, CheckCircle2 } from 'lucide-react';

interface FooterBarProps {
  copilotActive: boolean;
  onToggleCopilot: () => void;
  onRunBatchTriage: () => void;
  totalComplaints: number;
}

export const FooterBar: React.FC<FooterBarProps> = ({
  copilotActive,
  onToggleCopilot,
  onRunBatchTriage,
  totalComplaints,
}) => {
  return (
    <footer className="h-8 bg-slate-900 border-t border-slate-800 text-slate-400 text-[11px] px-4 flex items-center justify-between shrink-0 select-none z-10">
      {/* Left: AI Copilot Active Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-medium">
          <span className={`w-2 h-2 rounded-full ${copilotActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
          <span className="text-slate-300 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            AI Insights: Model &apos;Complaints-Copilot&apos; {copilotActive ? 'Active' : 'Standby'}
          </span>
        </div>

        <span className="text-slate-600">|</span>

        {/* Toggle Copilot */}
        <button
          onClick={onToggleCopilot}
          className="text-[10px] text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer"
        >
          {copilotActive ? 'Disable live triage' : 'Enable live triage'}
        </button>

        <span className="text-slate-600 hidden md:inline">|</span>

        <button
          onClick={onRunBatchTriage}
          className="text-[10px] text-slate-300 hover:text-white flex items-center gap-1 hidden md:flex"
        >
          <RefreshCw className="w-2.5 h-2.5 text-slate-400" />
          <span>Simulate Batch Re-triage</span>
        </button>
      </div>

      {/* Right: Governance System Telemetry */}
      <div className="flex items-center gap-3 font-mono text-[10px] text-slate-500">
        <span className="hidden sm:inline">CFPB & FDIC Rule Set v4.2</span>
        <span className="text-slate-700 hidden sm:inline">·</span>
        <span className="text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> SLA Engine 100% Up
        </span>
        <span className="text-slate-700">·</span>
        <span className="text-slate-400">{totalComplaints} Active Records</span>
      </div>
    </footer>
  );
};
