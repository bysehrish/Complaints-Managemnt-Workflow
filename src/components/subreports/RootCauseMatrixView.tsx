import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LabelList
} from 'recharts';
import { CRMComplaint } from '../../types/crm';
import { GitBranch, CheckCircle2, ShieldAlert } from 'lucide-react';

interface RootCauseMatrixViewProps {
  data: CRMComplaint[];
  onSelectComplaint: (complaint: CRMComplaint) => void;
}

export const RootCauseMatrixView: React.FC<RootCauseMatrixViewProps> = ({
  data,
  onSelectComplaint,
}) => {
  // 1. Root Cause Counts
  const rootCauseMap: Record<string, number> = {};
  data.forEach((c) => {
    const rc = c.root_cause_c || 'General System Delay';
    rootCauseMap[rc] = (rootCauseMap[rc] || 0) + 1;
  });

  const ROOT_CAUSE_CHART_DATA = Object.entries(rootCauseMap)
    .map(([name, count]) => ({
      name: name.length > 20 ? `${name.slice(0, 18)}...` : name,
      fullName: name,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // 2. Decision Box Counts
  const decisionMap: Record<string, number> = {};
  data.forEach((c) => {
    const dec = c.decision_box_c || 'Under Investigation';
    decisionMap[dec] = (decisionMap[dec] || 0) + 1;
  });

  const DECISION_COLORS = ['#10b981', '#0091FF', '#1034A6', '#f59e0b', '#ec4899', '#64748b'];
  const DECISION_CHART_DATA = Object.entries(decisionMap).map(([name, value], idx) => ({
    name: name.length > 22 ? `${name.slice(0, 20)}...` : name,
    fullName: name,
    value,
    color: DECISION_COLORS[idx % DECISION_COLORS.length],
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0B2559]">
              Root Cause & Supervisory Decision Matrix
            </h2>
            <p className="text-xs text-slate-500">
              Systemic defect categorization, technical diagnostics, and formal customer remedy outcome ledger
            </p>
          </div>
        </div>

        <div className="text-xs font-mono bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700">
          Distinct Root Causes: <span className="font-bold text-[#0B2559]">{ROOT_CAUSE_CHART_DATA.length}</span>
        </div>
      </div>

      {/* 2 Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Chart 1: Root Cause Breakdown */}
        <div className="border border-slate-300 rounded-xl p-4 sm:p-5 bg-white shadow-2xs flex flex-col">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 text-center mb-3">
            Complaints by Root Cause (root_cause_c)
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={ROOT_CAUSE_CHART_DATA}
                margin={{ top: 8, right: 35, left: 25, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#334155', fontSize: 10, fontWeight: 500 }}
                  width={130}
                />
                <Tooltip
                  formatter={(val: any, _, item: any) => [`${val} cases`, item.payload.fullName]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={16}>
                  <LabelList
                    dataKey="count"
                    position="right"
                    style={{ fill: '#0f172a', fontSize: '11px', fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Decision Box Distribution */}
        <div className="border border-slate-300 rounded-xl p-4 sm:p-5 bg-white shadow-2xs flex flex-col">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 text-center mb-3">
            Supervisory Outcomes (decision_box_c)
          </h3>
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(val: any, _, item: any) => [`${val} cases`, item.payload.fullName]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '11px' }}
                />
                <Pie
                  data={DECISION_CHART_DATA}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={0}
                  labelLine={false}
                  label={(props: any) => {
                    const { name, value, x, y, cx, percent } = props;
                    const textAnchor = x > cx ? 'start' : 'end';
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#1e293b"
                        textAnchor={textAnchor}
                        dominantBaseline="central"
                        className="text-[10px] font-medium"
                      >
                        {`${value} (${Math.round(percent * 100)}%)`}
                      </text>
                    );
                  }}
                >
                  {DECISION_CHART_DATA.map((entry, idx) => (
                    <Cell key={`decision-cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center items-center gap-3 text-xs mt-1 flex-wrap">
            {DECISION_CHART_DATA.map((item) => (
              <div key={item.fullName} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-700 font-medium text-[11px] truncate max-w-[140px]">{item.fullName} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* In-depth Root Cause & Activity Notes Table */}
      <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Root Cause Investigation & Operational Remedy Trail
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Audit trail of verified technical causes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[#0B2559] font-bold bg-white">
                <th className="py-2.5 px-3 font-mono w-24">Complaint #</th>
                <th className="py-2.5 px-3 min-w-[200px]">Complaint Description</th>
                <th className="py-2.5 px-3 font-medium">Assigned Root Cause</th>
                <th className="py-2.5 px-3 font-medium">Decision Outcome</th>
                <th className="py-2.5 px-3 min-w-[250px]">Activity & Remedy Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {data.slice(0, 15).map((row) => (
                <tr
                  key={row['Complaint Number']}
                  onClick={() => onSelectComplaint(row)}
                  className="hover:bg-purple-50/30 cursor-pointer transition-colors"
                >
                  <td className="py-2 px-3 font-mono font-bold text-slate-900">
                    {row['Complaint Number']}
                  </td>
                  <td className="py-2 px-3 text-slate-800 leading-normal line-clamp-2">
                    {row['description_compaint']}
                  </td>
                  <td className="py-2 px-3">
                    <span className="text-[11px] font-medium text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {row['root_cause_c']}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {row['decision_box_c']}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-600 leading-normal">
                    {row['Activity_notes']}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
