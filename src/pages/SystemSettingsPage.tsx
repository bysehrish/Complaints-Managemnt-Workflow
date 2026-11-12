import React, { useState } from 'react';
import {
  Sliders,
  ShieldCheck,
  Clock,
  Users,
  Save,
  RotateCcw,
  CheckCircle2,
  Lock,
  GitBranch,
  ToggleLeft,
  ToggleRight,
  FileCheck
} from 'lucide-react';
import { SLAThresholds, RoutingRule } from '../types/portal';

export const SystemSettingsPage: React.FC = () => {
  const [thresholds, setThresholds] = useState<SLAThresholds>({
    criticalHours: 12,
    highHours: 24,
    mediumHours: 48,
    lowHours: 72,
    autoEscalate: true,
    dualSignoffRequired: true,
  });

  const [rules, setRules] = useState<RoutingRule[]>([
    {
      id: 'rule-1',
      name: 'Mobile Gateway & Biometric Timeouts',
      triggerCategory: 'Mobile App',
      assignedTeam: 'Operation',
      active: true,
    },
    {
      id: 'rule-2',
      name: 'Virtual Card & Tokenization Holds',
      triggerCategory: 'Card',
      assignedTeam: 'Frontdesk',
      active: true,
    },
    {
      id: 'rule-3',
      name: 'SWIFT MT103 Wire & FX Clearing',
      triggerCategory: 'Bank Account',
      assignedTeam: 'Treasury',
      active: true,
    },
    {
      id: 'rule-4',
      name: 'Tax Withholding & Audit Statements',
      triggerCategory: 'Financial Statement',
      assignedTeam: 'Operation',
      active: true,
    },
  ]);

  const [isoComplianceLock, setIsoComplianceLock] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const toggleRule = (id: string) => {
    setRules(
      rules.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-1">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Governance Configuration Console
          </span>
        </div>
        <h1 className="text-xl font-extrabold text-[#0B2559] dark:text-white tracking-tight">
          System Settings, SLA Thresholds & Routing Rules
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Calibrate statutory regulatory SLA windows, configure automated CMU triage dispatch, and govern supervisory signoffs
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
        {/* Section 1: Statutory SLA Windows */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Statutory SLA Windows (CFPB & ISO 10002)
              </h2>
            </div>
            <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-semibold">
              Live Enforcement
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Critical Priority SLA
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={thresholds.criticalHours}
                  onChange={(e) =>
                    setThresholds({ ...thresholds, criticalHours: Number(e.target.value) })
                  }
                  className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold text-slate-900 dark:text-white text-xs"
                />
                <span className="text-slate-500 font-mono">hrs</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Regulatory max: 24h</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                High Priority SLA
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={thresholds.highHours}
                  onChange={(e) =>
                    setThresholds({ ...thresholds, highHours: Number(e.target.value) })
                  }
                  className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold text-slate-900 dark:text-white text-xs"
                />
                <span className="text-slate-500 font-mono">hrs</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Target window: 24h</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Medium Priority SLA
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={thresholds.mediumHours}
                  onChange={(e) =>
                    setThresholds({ ...thresholds, mediumHours: Number(e.target.value) })
                  }
                  className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold text-slate-900 dark:text-white text-xs"
                />
                <span className="text-slate-500 font-mono">hrs</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Standard: 48h</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Low Priority SLA
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={thresholds.lowHours}
                  onChange={(e) =>
                    setThresholds({ ...thresholds, lowHours: Number(e.target.value) })
                  }
                  className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold text-slate-900 dark:text-white text-xs"
                />
                <span className="text-slate-500 font-mono">hrs</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Maximum: 72h</span>
            </div>
          </div>
        </div>

        {/* Section 2: Automated CMU Assignment Rules */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-purple-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Automated CMU Departmental Routing Rules
              </h2>
            </div>
            <span className="text-[10px] text-slate-500">Auto-routes newly ingested records</span>
          </div>

          <div className="space-y-2.5">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                      {rule.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                      Product: {rule.triggerCategory}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Target Department: <span className="font-semibold text-blue-600 dark:text-blue-400">{rule.assignedTeam}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleRule(rule.id)}
                  className={`px-3 py-1 rounded-lg font-semibold text-xs transition-colors ${
                    rule.active
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                  }`}
                >
                  {rule.active ? 'Active' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Governance Policies & Compliance Lock */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Supervisory Governance Policies
              </h2>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">ISO 10002 / Regulation E</span>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Automated Escalation on SLA 75% Window
                </span>
                <span className="text-[11px] text-slate-500">
                  Sends automated notifications to Supervisory Lead Sehrish Athar before statutory breach.
                </span>
              </div>
              <input
                type="checkbox"
                checked={thresholds.autoEscalate}
                onChange={(e) =>
                  setThresholds({ ...thresholds, autoEscalate: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Dual Supervisory Approval for Restitution & Fee Waivers
                </span>
                <span className="text-[11px] text-slate-500">
                  Requires two officer signatures for any financial redress exceeding $250.
                </span>
              </div>
              <input
                type="checkbox"
                checked={thresholds.dualSignoffRequired}
                onChange={(e) =>
                  setThresholds({ ...thresholds, dualSignoffRequired: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Tamper-Evident Audit Trail Logging
                </span>
                <span className="text-[11px] text-slate-500">
                  Logs all state changes and Activity_notes edits to a permanent compliance audit ledger.
                </span>
              </div>
              <input
                type="checkbox"
                checked={isoComplianceLock}
                onChange={(e) => setIsoComplianceLock(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              setThresholds({
                criticalHours: 12,
                highHours: 24,
                mediumHours: 48,
                lowHours: 72,
                autoEscalate: true,
                dualSignoffRequired: true,
              });
              setIsoComplianceLock(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Standard Governance Rules</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors"
          >
            {savedSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Settings Saved Successfully!' : 'Save Calibration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
