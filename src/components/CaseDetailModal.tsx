import React, { useState } from 'react';
import {
  X,
  Clock,
  User,
  Shield,
  Sparkles,
  Send,
  Copy,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText,
  CornerDownRight,
  RefreshCw,
  Mail,
  Building,
  Check
} from 'lucide-react';
import { Complaint, WorkflowStage } from '../types';

interface CaseDetailModalProps {
  complaint: Complaint | null;
  onClose: () => void;
  onUpdateStage: (id: string, stage: WorkflowStage) => void;
  onSaveDraftResponse: (id: string, draft: string) => void;
  onAddNote: (id: string, note: string) => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  complaint,
  onClose,
  onUpdateStage,
  onSaveDraftResponse,
  onAddNote,
}) => {
  if (!complaint) return null;

  const [draftText, setDraftText] = useState(complaint.aiDraftResponse || '');
  const [tone, setTone] = useState<'formal' | 'empathic' | 'concise'>('formal');
  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const STAGES: { id: WorkflowStage; label: string }[] = [
    { id: 'intake', label: '1. Intake' },
    { id: 'triage', label: '2. Triage' },
    { id: 'investigation', label: '3. Investigation' },
    { id: 'resolution', label: '4. Resolution' },
    { id: 'closed', label: '5. Closed' },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(draftText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendResponse = () => {
    onSaveDraftResponse(complaint.id, draftText);
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 2500);
  };

  const handleAddInternalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    onAddNote(complaint.id, noteInput.trim());
    setNoteInput('');
  };

  const handleRegenerateTone = (selectedTone: 'formal' | 'empathic' | 'concise') => {
    setTone(selectedTone);
    setIsGenerating(true);
    setTimeout(() => {
      let updated = '';
      if (selectedTone === 'formal') {
        updated = `Dear ${complaint.customerName},\n\nOur Governance Committee has completed the technical audit regarding your ${complaint.category} incident (${complaint.subCategory}). Pursuant to regulatory compliance guidelines, our engineering unit has verified the ledger anomaly and remediated your access. A full service statement has been deposited in your portal.\n\nSincerely,\nService Quality Governance`;
      } else if (selectedTone === 'empathic') {
        updated = `Hello ${complaint.customerName},\n\nWe sincerely apologize for the inconvenience you experienced with your ${complaint.category}. We completely understand how frustrating this disruption is, and we made resolving this our utmost priority. Our senior specialist has directly cleared the issue, and your service is now running smoothly.\n\nWarm regards,\nClient Care Directorate`;
      } else {
        updated = `Hi ${complaint.customerName}, the reported issue regarding ${complaint.category} (${complaint.subCategory}) on account ${complaint.accountNumber} has been resolved. You can now use your account without restrictions. Thank you for your patience.`;
      }
      setDraftText(updated);
      setIsGenerating(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-y-auto">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
              {complaint.id}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              {complaint.category}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ {complaint.subCategory}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1 text-xs">
          {/* Workflow Stage Advancement Strip */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
              Current Workflow Stage
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {STAGES.map((s) => {
                const isActive = complaint.stage === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => onUpdateStage(complaint.id, s.id)}
                    className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold transition-all text-center ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer & Incident Overview */}
          <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Customer Profile</div>
              <div className="font-bold text-slate-900 text-sm">{complaint.customerName}</div>
              <div className="text-slate-500 flex items-center gap-1 mt-0.5">
                <Mail className="w-3 h-3 text-slate-400" />
                <span>{complaint.customerEmail}</span>
              </div>
              <div className="text-slate-500 font-mono mt-0.5">
                Account: {complaint.accountNumber} ({complaint.accountTier})
              </div>
            </div>

            <div className="border-l border-slate-100 pl-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Department:</span>
                <span className="font-semibold text-slate-800 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                  {complaint.team}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Priority:</span>
                <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                  complaint.priority === 'Critical' ? 'bg-rose-100 text-rose-800' :
                  complaint.priority === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {complaint.priority}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">SLA Status:</span>
                <span className="font-mono font-bold text-indigo-700 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {complaint.slaHoursRemaining > 0 ? `${complaint.slaHoursRemaining}h remaining` : 'Breached'}
                </span>
              </div>
            </div>
          </div>

          {/* Issue Description */}
          <div>
            <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wide mb-1.5">
              Issue Statement
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed text-xs">
              {complaint.description}
            </div>
          </div>

          {/* AI Copilot Recommendation */}
          {complaint.aiRecommendedAction && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-slate-50 border border-indigo-200">
              <div className="flex items-center gap-2 mb-1.5 text-indigo-900 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>AI Copilot Diagnostic & Recommended Action</span>
                <span className="ml-auto text-[10px] font-mono bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-semibold">
                  Risk Score: {complaint.aiRiskScore}/100
                </span>
              </div>
              <p className="text-xs text-indigo-950 leading-relaxed">
                {complaint.aiRecommendedAction}
              </p>
            </div>
          )}

          {/* AI-Suggested Customer Draft Response */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI-Assisted Customer Resolution Response</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleRegenerateTone('formal')}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                    tone === 'formal' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Formal
                </button>
                <button
                  onClick={() => handleRegenerateTone('empathic')}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                    tone === 'empathic' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Empathic
                </button>
                <button
                  onClick={() => handleRegenerateTone('concise')}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                    tone === 'concise' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Concise
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                rows={6}
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                placeholder="AI draft resolution response..."
                className="w-full p-3 rounded-lg border border-slate-300 font-sans text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed bg-white shadow-2xs"
              />
              {isGenerating && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
                  <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Regenerating tailored response...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
              </button>

              <button
                onClick={handleSendResponse}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors shadow-xs"
              >
                {sentSuccess ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                <span>{sentSuccess ? 'Response Logged!' : 'Send & Save to Case'}</span>
              </button>
            </div>
          </div>

          {/* Audit History & Internal Notes */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wide">
              Timeline & Governance Trail
            </div>

            <div className="space-y-2">
              {complaint.timeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <CornerDownRight className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                      <span className="font-semibold text-slate-800">{item.author}</span>
                      <span className="font-mono">{item.timestamp}</span>
                    </div>
                    <p className="text-slate-600 leading-normal">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add note input */}
            <form onSubmit={handleAddInternalNote} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add an internal governance note..."
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium text-xs transition-colors"
              >
                Post Note
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
