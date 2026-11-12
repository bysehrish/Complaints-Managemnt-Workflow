import React, { useState } from 'react';
import {
  Compass,
  Play,
  Sparkles,
  Sliders,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Send,
  Cpu
} from 'lucide-react';
import { Complaint, IssueCategory, PriorityLevel } from '../types';

interface PlaygroundViewProps {
  onSimulateInject: (complaint: Partial<Complaint>) => void;
  onOpenWorkflow: () => void;
}

export const PlaygroundView: React.FC<PlaygroundViewProps> = ({
  onSimulateInject,
  onOpenWorkflow,
}) => {
  const [testPayload, setTestPayload] = useState(
    JSON.stringify(
      {
        channel: 'MobileApp_BiometricAPI',
        clientTier: 'Private Wealth',
        issueSummary: 'Customer received error 500 during high-value wire authorization of $75,000.',
        detectedCategory: 'Treasury Settlement',
        detectedTeam: 'Treasury',
        estimatedLossRisk: 'High',
      },
      null,
      2
    )
  );

  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  const handleRunSimulation = () => {
    try {
      const parsed = JSON.parse(testPayload);
      setSimulationResult(
        `AI Triage Engine evaluated payload:
✓ Automated Priority assigned: Critical (12h SLA enforced)
✓ Regulatory flag: CFPB Regulation E (Statutory fast-track)
✓ Department routing: ${parsed.detectedTeam || 'Treasury'}
✓ Risk severity score: 94/100
✓ Pre-generated remedy draft prepared.`
      );
    } catch {
      setSimulationResult('Error: Invalid JSON payload format.');
    }
  };

  const handlePushToLive = () => {
    try {
      const parsed = JSON.parse(testPayload);
      onSimulateInject({
        customerName: 'Marcus Sterling (Simulated)',
        customerEmail: 'm.sterling@capital-holdings.co',
        accountNumber: '**** 9942',
        accountTier: 'Private Wealth',
        category: (parsed.detectedCategory as any) || 'Card',
        subCategory: 'Wire Authorization',
        team: (parsed.detectedTeam as any) || 'Treasury',
        priority: 'Critical',
        description: parsed.issueSummary || 'Simulated playground test complaint',
        stage: 'intake',
        subStep: 'Intake New/Received',
        slaHoursRemaining: 12,
        slaTotalHours: 12,
        aiRiskScore: 94,
        aiRecommendedAction: 'Playground test case: High financial exposure on wire settlement. Escalate immediately to Treasury desk.',
        aiDraftResponse: 'Dear Mr. Sterling,\n\nOur Treasury Governance unit has received your high-value wire inquiry. A senior wire officer has placed a provisional confirmation trace.\n\nSincerely,\nTreasury Oversight Directorate',
        timeline: [
          { stage: 'intake', timestamp: 'Just now', author: 'Playground Simulator', note: 'Injected via developer playground' }
        ]
      });
      onOpenWorkflow();
    } catch (e) {
      alert('Invalid JSON');
    }
  };

  return (
    <div className="flex-1 bg-slate-100/70 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Governance Rule Playground
              </h2>
              <p className="text-xs text-slate-500">
                Test automated routing logic, SLA triggers, and AI response generation against mock payloads.
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* JSON Payload Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Incoming Complaint Ingest Payload (JSON)
              </label>
            </div>
            <textarea
              rows={12}
              value={testPayload}
              onChange={(e) => setTestPayload(e.target.value)}
              className="w-full p-3 font-mono text-xs bg-slate-900 text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleRunSimulation}
                className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Evaluate Rule Pipeline</span>
              </button>
              <button
                onClick={handlePushToLive}
                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Inject into Pipeline</span>
              </button>
            </div>
          </div>

          {/* Evaluation Diagnostics */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Automated Pipeline Diagnostic Output
            </label>
            <div className="h-64 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 overflow-y-auto whitespace-pre-line leading-relaxed">
              {simulationResult || 'Click "Evaluate Rule Pipeline" to simulate intake processing against our rule sets.'}
            </div>
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200 text-xs text-indigo-950">
              <span className="font-bold">Active Engine Model:</span> Complaints-Copilot v4.2 with sub-second semantic categorization and CFPB Regulation E auto-matching.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
