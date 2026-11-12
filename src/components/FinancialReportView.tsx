import React, { useState } from 'react';
import {
  Landmark,
  Download,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  ArrowUpDown
} from 'lucide-react';
import { Complaint } from '../types';

interface FinancialReportViewProps {
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
  onOpenWorkflow: () => void;
}

export const FinancialReportView: React.FC<FinancialReportViewProps> = ({
  complaints,
  onSelectComplaint,
  onOpenWorkflow,
}) => {
  const [tableFilter, setTableFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Metrics matching the uploaded Financial Complaint Report image
  const totalComplaints = 49;
  const wipComplaints = 25;
  const resolvedComplaints = 13;
  const responseRate = '78%';

  // Filtered rows for the table
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(c.numericId).includes(searchTerm);

    if (!matchesSearch) return false;

    if (tableFilter === 'open') {
      return c.stage === 'intake' || c.stage === 'triage';
    }
    if (tableFilter === 'in_progress') {
      return c.stage === 'investigation' || c.stage === 'resolution';
    }
    if (tableFilter === 'resolved') {
      return c.stage === 'closed';
    }
    return true;
  });

  return (
    <div className="flex-1 bg-slate-100/70 p-6 overflow-y-auto">
      {/* Maximum width container styled cleanly */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6">
        {/* Top Report Header with Bank Icon */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex-1" />
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-blue-950 tracking-tight">
              Financial Complaint Report
            </h2>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              Service Quality & Regulatory Oversight Governance
            </div>
          </div>
          <div className="flex-1 flex justify-end items-center gap-2">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-blue-950 text-white flex items-center justify-center shadow-xs">
                <Landmark className="w-6 h-6 text-blue-100" />
              </div>
              <span className="text-[10px] font-bold text-blue-950 tracking-wider uppercase mt-0.5">BANK</span>
            </div>
          </div>
        </div>

        {/* 4 Primary Top KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Complaints */}
          <div className="bg-white border-2 border-slate-300 rounded-xl p-4 text-center shadow-2xs hover:border-blue-900 transition-colors">
            <div className="text-3xl font-extrabold text-blue-950 font-mono tabular-nums">
              {totalComplaints}
            </div>
            <div className="text-xs font-bold text-slate-700 mt-1">
              Total Complaints #
            </div>
          </div>

          {/* WIP Complaints */}
          <div className="bg-white border-2 border-slate-300 rounded-xl p-4 text-center shadow-2xs hover:border-blue-900 transition-colors">
            <div className="text-3xl font-extrabold text-blue-950 font-mono tabular-nums">
              {wipComplaints}
            </div>
            <div className="text-xs font-bold text-slate-700 mt-1">
              WIP Complaints #
            </div>
          </div>

          {/* Resolved Complaints */}
          <div className="bg-white border-2 border-slate-300 rounded-xl p-4 text-center shadow-2xs hover:border-blue-900 transition-colors">
            <div className="text-3xl font-extrabold text-blue-950 font-mono tabular-nums">
              {resolvedComplaints}
            </div>
            <div className="text-xs font-bold text-slate-700 mt-1">
              Resolved Complaints #
            </div>
          </div>

          {/* Response Rate */}
          <div className="bg-white border-2 border-slate-300 rounded-xl p-4 text-center shadow-2xs hover:border-blue-900 transition-colors">
            <div className="text-3xl font-extrabold text-blue-950 font-mono tabular-nums">
              {responseRate}
            </div>
            <div className="text-xs font-bold text-slate-700 mt-1">
              Response Rate %
            </div>
          </div>
        </div>

        {/* 4 Interactive Visual Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Chart 1: Complaints # by Status */}
          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-2xs flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 text-center mb-3">
              Complaints # by Status
            </h3>
            <div className="flex-1 flex items-center justify-around gap-4">
              {/* Donut Chart SVG */}
              <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Circle segments: In Progress 51% (blue), Resolved 27% (green), Open 22% (pink) */}
                  {/* Total circumference = 2 * PI * 40 = ~251.3 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#1e3a8a"
                    strokeWidth="24"
                    strokeDasharray="128.1 251.3"
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="24"
                    strokeDasharray="67.8 251.3"
                    strokeDashoffset="-128.1"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#ec4899"
                    strokeWidth="24"
                    strokeDasharray="55.4 251.3"
                    strokeDashoffset="-195.9"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xs font-bold font-mono text-slate-800">49 Total</span>
                </div>
              </div>

              {/* Legend & Percentages */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#1e3a8a]" />
                  <span className="font-semibold text-slate-800">In Progress:</span>
                  <span className="font-mono text-slate-600">25 (51%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#10b981]" />
                  <span className="font-semibold text-slate-800">Resolved:</span>
                  <span className="font-mono text-slate-600">13 (27%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ec4899]" />
                  <span className="font-semibold text-slate-800">Open:</span>
                  <span className="font-mono text-slate-600">11 (22%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart 2: Complaints # by Category */}
          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-900 text-center mb-3">
              Complaints # by Category
            </h3>
            <div className="space-y-3 pt-1">
              {/* Card: 15 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Card</span>
                  <span className="font-mono font-bold text-blue-600">15</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: '100%' }} />
                </div>
              </div>

              {/* Financial Statement: 13 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Financial Statement</span>
                  <span className="font-mono font-bold text-blue-600">13</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: '86.6%' }} />
                </div>
              </div>

              {/* Bank Account: 12 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Bank Account</span>
                  <span className="font-mono font-bold text-blue-600">12</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: '80%' }} />
                </div>
              </div>

              {/* Mobile App: 9 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Mobile App</span>
                  <span className="font-mono font-bold text-blue-600">9</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Chart 3: Complaints # Monthly Trend */}
          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-900 text-center mb-3">
              Complaints # Monthly Trend
            </h3>
            <div className="h-40 flex items-end justify-between gap-1.5 px-2 pt-4">
              {[
                { month: 'Jan 2024', val: 7 },
                { month: 'Feb 2024', val: 5 },
                { month: 'Mar 2024', val: 4 },
                { month: 'Apr 2024', val: 4 },
                { month: 'May 2024', val: 4 },
                { month: 'Jun 2024', val: 5 },
                { month: 'Jul 2024', val: 4 },
                { month: 'Aug 2024', val: 7 },
                { month: 'Sep 2024', val: 1 },
              ].map((m) => {
                const heightPct = (m.val / 7) * 100;
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-[10px] font-bold font-mono text-blue-700">{m.val}</span>
                    <div className="w-full bg-slate-100 rounded-t h-24 flex items-end">
                      <div
                        className="w-full bg-blue-500 hover:bg-blue-600 rounded-t transition-all"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-medium text-slate-500 truncate w-full text-center">
                      {m.month.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 4: Complaints # by Teams */}
          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-2xs flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 text-center mb-3">
              Complaints # by Teams
            </h3>
            <div className="flex-1 flex items-center justify-around gap-4">
              {/* Donut Chart SVG */}
              <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Frontdesk: 24 (49%) - light blue */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#60a5fa"
                    strokeWidth="24"
                    strokeDasharray="123 251.3"
                    strokeDashoffset="0"
                  />
                  {/* Operation: 18 (37%) - dark navy */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#1e3a8a"
                    strokeWidth="24"
                    strokeDasharray="93 251.3"
                    strokeDashoffset="-123"
                  />
                  {/* Treasury: 4 (8%) - gray */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#64748b"
                    strokeWidth="24"
                    strokeDasharray="20 251.3"
                    strokeDashoffset="-216"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-[11px] font-bold font-mono text-slate-800">46 Staff</span>
                </div>
              </div>

              {/* Legend & Percentages */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#60a5fa]" />
                  <span className="font-semibold text-slate-800">Frontdesk:</span>
                  <span className="font-mono text-slate-600">24 (49%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#1e3a8a]" />
                  <span className="font-semibold text-slate-800">Operation:</span>
                  <span className="font-mono text-slate-600">18 (37%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#64748b]" />
                  <span className="font-semibold text-slate-800">Treasury:</span>
                  <span className="font-mono text-slate-600">4 (8%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Data Table: Exactly matches the attachment layout */}
        <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
          {/* Table Controls */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Issue Registry & Resolution Audit
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-mono">
                Showing {filteredComplaints.length} of {complaints.length} records
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter table rows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-2.5 py-1 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center gap-1 bg-white p-0.5 border border-slate-200 rounded-md text-xs">
                <button
                  onClick={() => setTableFilter('all')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    tableFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTableFilter('open')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    tableFilter === 'open' ? 'bg-pink-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Open
                </button>
                <button
                  onClick={() => setTableFilter('in_progress')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    tableFilter === 'in_progress' ? 'bg-blue-900 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setTableFilter('resolved')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    tableFilter === 'resolved' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Resolved
                </button>
              </div>

              <button
                onClick={onOpenWorkflow}
                className="px-2.5 py-1 text-xs font-semibold bg-blue-950 hover:bg-blue-900 text-white rounded-md transition-colors"
              >
                Go to Pipeline
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700 font-bold">
                  <th className="py-2.5 px-3 font-mono text-center w-16">Issue ID</th>
                  <th className="py-2.5 px-3">Issue Category</th>
                  <th className="py-2.5 px-3">Issue Sub Category</th>
                  <th className="py-2.5 px-4 min-w-[260px]">Issue Description</th>
                  <th className="py-2.5 px-3">Team</th>
                  <th className="py-2.5 px-3 text-center">Issue Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredComplaints.map((item) => {
                  let statusLabel = 'Open';
                  let statusColor = 'text-pink-600 font-semibold';
                  if (item.stage === 'investigation' || item.stage === 'resolution') {
                    statusLabel = 'In Progress';
                    statusColor = 'text-blue-900 font-semibold';
                  } else if (item.stage === 'closed') {
                    statusLabel = 'Resolved';
                    statusColor = 'text-emerald-600 font-semibold';
                  }

                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelectComplaint(item)}
                      className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 px-3 font-mono text-center font-bold text-slate-900">
                        {item.numericId}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900">
                        {item.category}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {item.subCategory}
                      </td>
                      <td className="py-2.5 px-4 text-slate-800 leading-normal">
                        {item.description}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                        {item.team}
                      </td>
                      <td className={`py-2.5 px-3 text-center ${statusColor}`}>
                        {statusLabel}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold underline">
                          Inspect
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
