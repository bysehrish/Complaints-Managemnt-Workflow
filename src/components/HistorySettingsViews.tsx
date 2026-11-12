import React, { useState } from 'react';
import {
  History,
  Sliders,
  Shield,
  Clock,
  CheckCircle2,
  Download,
  AlertTriangle,
  RotateCcw,
  Save
} from 'lucide-react';
import { Complaint } from '../types';

interface HistoryViewProps {
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
  onOpenWorkflow: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  complaints,
  onSelectComplaint,
  onOpenWorkflow,
}) => {
  return (
    <div className="flex-1 bg-slate-100/70 p-6 overflow-y-auto">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Case Resolution & Audit Trail History
              </h2>
              <p className="text-xs text-slate-500">
                Complete forensic ledger of state changes, redress actions, and compliance stamps.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenWorkflow}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Back to Workflow
          </button>
        </div>

        <div className="space-y-3">
          {complaints.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectComplaint(c)}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-slate-900">{c.id}</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-semibold text-slate-800 text-xs">{c.customerName}</span>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {c.category} - {c.subCategory}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-normal line-clamp-1">{c.description}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-xs">
                <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  Stage: {c.stage.toUpperCase()}
                </span>
                <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                  c.priority === 'Critical' ? 'bg-rose-100 text-rose-800' :
                  c.priority === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {c.priority}
                </span>
                <span className="text-indigo-600 hover:text-indigo-800 font-semibold underline text-xs">
                  Inspect
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface SettingsViewProps {
  onOpenWorkflow: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenWorkflow }) => {
  const [criticalSla, setCriticalSla] = useState(12);
  const [highSla, setHighSla] = useState(24);
  const [autoTriage, setAutoTriage] = useState(true);
  const [dualSignoffThreshold, setDualSignoffThreshold] = useState(500);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex-1 bg-slate-100/70 p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Governance & SLA Calibration Settings
              </h2>
              <p className="text-xs text-slate-500">
                Configure operational thresholds, compliance rules, and AI copilot escalation triggers.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenWorkflow}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Back to Workflow
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5 text-xs">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Statutory SLA Windows (Hours)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block font-bold text-slate-800 mb-1">Critical Tier SLA (Hours)</label>
                <input
                  type="number"
                  value={criticalSla}
                  onChange={(e) => setCriticalSla(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-xs bg-white"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Statutory CFPB maximum: 24h</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block font-bold text-slate-800 mb-1">High Tier SLA (Hours)</label>
                <input
                  type="number"
                  value={highSla}
                  onChange={(e) => setHighSla(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-xs bg-white"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Default bank standard: 48h</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Automated Governance Controls
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoTriage}
                  onChange={(e) => setAutoTriage(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <div>
                  <span className="font-bold text-slate-800 block">AI Automated Triage Routing</span>
                  <span className="text-[11px] text-slate-500">Auto-assign cases to Frontdesk, Operation, or Treasury based on semantic category.</span>
                </div>
              </label>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block font-bold text-slate-800 mb-1">Dual Supervisory Approval Redress Threshold ($)</label>
                <input
                  type="number"
                  value={dualSignoffThreshold}
                  onChange={(e) => setDualSignoffThreshold(Number(e.target.value))}
                  className="w-48 px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-xs bg-white"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Restitution amounts exceeding this limit require 2 senior officer signatures.</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                setCriticalSla(12);
                setHighSla(24);
                setAutoTriage(true);
                setDualSignoffThreshold(500);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-slate-900 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs transition-colors"
            >
              {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saved ? 'Configurations Saved!' : 'Save Calibration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
