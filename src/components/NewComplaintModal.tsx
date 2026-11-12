import React, { useState } from 'react';
import { X, PlusCircle, Shield, AlertTriangle, Send } from 'lucide-react';
import { Complaint, IssueCategory, PriorityLevel, TeamName } from '../types';

interface NewComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddComplaint: (newComplaint: Partial<Complaint>) => void;
}

export const NewComplaintModal: React.FC<NewComplaintModalProps> = ({
  isOpen,
  onClose,
  onAddComplaint,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [accountTier, setAccountTier] = useState<Complaint['accountTier']>('Commercial Premier');
  const [category, setCategory] = useState<IssueCategory>('Card');
  const [subCategory, setSubCategory] = useState('Virtual Card');
  const [team, setTeam] = useState<TeamName>('Frontdesk');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [description, setDescription] = useState('');

  const subCategoryMap: Record<IssueCategory, string[]> = {
    'Card': ['Virtual Card', 'Card Dispute', 'Lost / Stolen', 'ATM Surcharge'],
    'Financial Statement': ['Download', 'Tax Report', 'Interest Calculation', 'Audit Reconciliation'],
    'Bank Account': ['Saving Account', 'Open Account', 'Language Preference', 'Wire Transfer Hold'],
    'Mobile App': ['Log In', 'Version Update', 'Biometric Timeout', 'Crash on Launch'],
    'Treasury Settlement': ['Wire Transfer', 'FX Conversion', 'Liquidity Hold', 'Interbank Settlement'],
  };

  const handleCategorySelect = (cat: IssueCategory) => {
    setCategory(cat);
    setSubCategory(subCategoryMap[cat][0] || 'General');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !description) return;

    onAddComplaint({
      customerName,
      customerEmail: customerEmail || `${customerName.toLowerCase().replace(/\s+/g, '.')}@client-corp.com`,
      accountNumber: `**** ${Math.floor(1000 + Math.random() * 9000)}`,
      accountTier,
      category,
      subCategory,
      team,
      priority,
      description,
      stage: 'intake',
      subStep: 'Intake New/Received',
      slaHoursRemaining: priority === 'Critical' ? 12 : priority === 'High' ? 24 : 48,
      slaTotalHours: priority === 'Critical' ? 12 : priority === 'High' ? 24 : 48,
      aiRiskScore: priority === 'Critical' ? 92 : priority === 'High' ? 75 : 40,
      aiRecommendedAction: `Automated intake parsed for ${category} (${subCategory}). Recommended assignment to ${team} with initial verification protocol.`,
      aiDraftResponse: `Dear ${customerName},\n\nWe have received your report regarding ${category} (${subCategory}). A dedicated specialist in our ${team} department has been assigned to investigate your case. You will receive an update within our statutory timeframe.\n\nSincerely,\nService Quality Governance`,
      timeline: [
        {
          stage: 'intake',
          timestamp: 'Just now',
          author: 'Sehrish Athar (Governance Officer)',
          note: `Manual complaint intake logged. Categorized under ${category} - ${subCategory}.`,
        },
      ],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Log New Service Complaint</h3>
              <p className="text-[11px] text-slate-500">Initiate automated workflow routing & SLA timers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Customer Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Jonathan Davis"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Customer Email</label>
              <input
                type="email"
                placeholder="e.g. j.davis@corp.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Account Tier</label>
              <select
                value={accountTier}
                onChange={(e) => setAccountTier(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
              >
                <option value="Private Wealth">Private Wealth</option>
                <option value="Commercial Premier">Commercial Premier</option>
                <option value="Retail Plus">Retail Plus</option>
                <option value="Standard Checking">Standard Checking</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Severity / Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
              >
                <option value="Critical">Critical (12h SLA)</option>
                <option value="High">High (24h SLA)</option>
                <option value="Medium">Medium (48h SLA)</option>
                <option value="Low">Low (72h SLA)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => handleCategorySelect(e.target.value as IssueCategory)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
              >
                <option value="Card">Card</option>
                <option value="Financial Statement">Financial Statement</option>
                <option value="Bank Account">Bank Account</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Treasury Settlement">Treasury Settlement</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Sub Category</label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
              >
                {subCategoryMap[category].map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Assigned Team</label>
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value as TeamName)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
              >
                <option value="Frontdesk">Frontdesk</option>
                <option value="Operation">Operation</option>
                <option value="Treasury">Treasury</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Issue Description & Client Statement</label>
            <textarea
              required
              rows={3}
              placeholder="State the customer incident, error code, or transaction context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit to Intake Pipeline</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
