import React, { useState } from 'react';
import {
  X,
  User,
  Shield,
  Clock,
  MapPin,
  Building,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Send,
  Save,
  Check
} from 'lucide-react';
import { CRMComplaint } from '../../types/crm';

interface CRMCaseDetailModalProps {
  complaint: CRMComplaint | null;
  onClose: () => void;
  onUpdateComplaint: (updated: CRMComplaint) => void;
}

export const CRMCaseDetailModal: React.FC<CRMCaseDetailModalProps> = ({
  complaint,
  onClose,
  onUpdateComplaint,
}) => {
  if (!complaint) return null;

  const [status, setStatus] = useState(complaint.Status);
  const [priority, setPriority] = useState(complaint.Priority);
  const [activityNotes, setActivityNotes] = useState(complaint.Activity_notes);
  const [newNote, setNewNote] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    const combinedNotes = newNote.trim()
      ? `${activityNotes ? activityNotes + ' | ' : ''}[${new Date().toLocaleDateString()}] ${newNote.trim()}`
      : activityNotes;

    const updated: CRMComplaint = {
      ...complaint,
      Status: status,
      Priority: priority,
      Activity_notes: combinedNotes,
      'Closing Date': (status === 'Resolved' || status === 'Closed') && !complaint['Closing Date']
        ? new Date().toISOString().slice(0, 10)
        : complaint['Closing Date'],
    };

    onUpdateComplaint(updated);
    setActivityNotes(combinedNotes);
    setNewNote('');
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-[#0B2559] bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
              {complaint['Complaint Number']}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs font-semibold text-slate-800">
              {complaint.Product} / {complaint.ComplaintType}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Top Status & SLA pill bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="mt-0.5 w-full bg-white border border-slate-300 rounded px-1.5 py-1 font-semibold text-slate-800"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Priority</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="mt-0.5 w-full bg-white border border-slate-300 rounded px-1.5 py-1 font-semibold text-slate-800"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Aging Duration</span>
              <span className="text-xs font-mono font-bold text-slate-800 block mt-1">
                {complaint.Aging} days active
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">CMU Owner</span>
              <span className="text-xs font-mono font-bold text-slate-800 block mt-1">
                {complaint.cmu_owner_c}
              </span>
            </div>
          </div>

          {/* Customer & Location Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Customer & Account
              </span>
              <div className="text-xs font-bold text-slate-900">{complaint.customer_name_c}</div>
              <div className="text-[11px] text-slate-600 font-mono">
                CNIC: {complaint.cnic_c}
              </div>
              <div className="text-[11px] text-slate-600 font-mono">
                Account: {complaint.customer_account_c}
              </div>
              <div className="text-[11px] text-slate-500">
                Channel: <span className="font-semibold">{complaint['Lodgement Source']}</span>
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Branch & Regional Jurisdiction
              </span>
              <div className="text-xs font-bold text-slate-900 font-mono">
                Branch {complaint['Branch Code']} ({complaint.City_c})
              </div>
              <div className="text-[11px] text-slate-600">
                New Region: {complaint['New Region']}
              </div>
              <div className="text-[11px] text-slate-600">
                Circle: {complaint.Circle}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Logged: {complaint['Logging Date']} {complaint['Closing Date'] && `· Closed: ${complaint['Closing Date']}`}
              </div>
            </div>
          </div>

          {/* Description statement */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
              Complaint Statement (description_compaint)
            </label>
            <p className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed text-xs">
              {complaint.description_compaint}
            </p>
          </div>

          {/* Root cause and decision box */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl">
              <span className="text-[10px] font-bold text-purple-900 uppercase block mb-0.5">
                Root Cause Classification
              </span>
              <span className="text-xs font-semibold text-purple-950">
                {complaint.root_cause_c}
              </span>
            </div>

            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
              <span className="text-[10px] font-bold text-emerald-900 uppercase block mb-0.5">
                Supervisory Decision Box
              </span>
              <span className="text-xs font-semibold text-emerald-950">
                {complaint.decision_box_c}
              </span>
            </div>
          </div>

          {/* Activity Notes History */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
              Operational Activity & Audit Trail (Activity_notes)
            </label>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs leading-relaxed max-h-24 overflow-y-auto">
              {activityNotes || 'No previous activity notes logged.'}
            </div>
          </div>

          {/* Append New Note Form */}
          <div className="pt-2">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
              Add New Case Action Note
            </label>
            <input
              type="text"
              placeholder="e.g. Completed verification call, customer satisfied with fee reversal..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-600 bg-white"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-medium text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 bg-[#0B2559] hover:bg-blue-900 text-white rounded-lg font-bold text-xs transition-all shadow-xs"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Changes Saved!' : 'Save CRM Record'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
