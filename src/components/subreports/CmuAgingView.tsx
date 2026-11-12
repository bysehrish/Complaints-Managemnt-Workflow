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
import { ClockAlert, ShieldAlert, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';

interface CmuAgingViewProps {
  data: CRMComplaint[];
  onSelectComplaint: (complaint: CRMComplaint) => void;
}

export const CmuAgingView: React.FC<CmuAgingViewProps> = ({
  data,
  onSelectComplaint,
}) => {
  // 1. Aging Buckets: <2 days, 3-5 days, >5 days overdue
  let under2Days = 0;
  let between3and5Days = 0;
  let over5Days = 0;

  data.forEach((c) => {
    const age = c.Aging || 1;
    if (age <= 2) under2Days += 1;
    else if (age <= 5) between3and5Days += 1;
    else over5Days += 1;
  });

  const AGING_BUCKET_DATA = [
    { name: '<2 Days (Nominal SLA)', value: under2Days, color: '#16a34a' },
    { name: '3-5 Days (Warning Window)', value: between3and5Days, color: '#f59e0b' },
    { name: '>5 Days (Overdue Alert)', value: over5Days, color: '#dc2626' },
  ];

  // 2. Workload by CMU Owner
  const ownerMap: Record<string, { total: number; overdue: number; open: number; resolved: number }> = {};
  data.forEach((c) => {
    const owner = c.cmu_owner_c || 'Operation';
    if (!ownerMap[owner]) {
      ownerMap[owner] = { total: 0, overdue: 0, open: 0, resolved: 0 };
    }
    ownerMap[owner].total += 1;
    if (c.Aging > 5) ownerMap[owner].overdue += 1;
    if (c.Status === 'Resolved' || c.Status === 'Closed') ownerMap[owner].resolved += 1;
    else ownerMap[owner].open += 1;
  });

  const OWNER_CHART_DATA = Object.entries(ownerMap)
    .map(([owner, stat]) => ({
      owner,
      total: stat.total,
      overdue: stat.overdue,
      open: stat.open,
      resolved: stat.resolved,
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center">
            <ClockAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0B2559]">
              CMU Owner & Case SLA Aging Sub-Report
            </h2>
            <p className="text-xs text-slate-500">
              Departmental case queue velocity, investigator capacity, and statutory SLA breach monitoring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Overdue Cases: {over5Days}</span>
          </div>
        </div>
      </div>

      {/* 2 Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Chart 1: SLA Aging Buckets */}
        <div className="border border-slate-300 rounded-xl p-4 sm:p-5 bg-white shadow-2xs flex flex-col">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 text-center mb-3">
            SLA Aging Day Tiers
          </h3>
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} cases`, name]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '11px' }}
                />
                <Pie
                  data={AGING_BUCKET_DATA}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={0}
                  labelLine={false}
                  label={(props: any) => {
                    const { value, x, y, cx, percent } = props;
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
                  {AGING_BUCKET_DATA.map((entry, idx) => (
                    <Cell key={`aging-cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center items-center gap-4 text-xs mt-1">
            {AGING_BUCKET_DATA.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-700 font-medium text-[11px]">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: CMU Owner Workload */}
        <div className="border border-slate-300 rounded-xl p-4 sm:p-5 bg-white shadow-2xs flex flex-col">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 text-center mb-3">
            Case Volume by CMU Owner (cmu_owner_c)
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={OWNER_CHART_DATA}
                margin={{ top: 15, right: 15, left: 0, bottom: 5 }}
              >
                <XAxis dataKey="owner" tick={{ fontSize: 10, fill: '#475569' }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '11px' }}
                />
                <Bar dataKey="open" name="Active Open" fill="#0091FF" radius={[2, 2, 0, 0]} />
                <Bar dataKey="overdue" name="Overdue >5d" fill="#dc2626" radius={[2, 2, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#16a34a" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-[10px] text-slate-400 mt-auto">
            Workload & velocity breakdown
          </div>
        </div>
      </div>

      {/* Case SLA Aging Table */}
      <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Detailed Aging Ledger & Escalation Flags
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Sorted by longest aging duration
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[#0B2559] font-bold bg-white">
                <th className="py-2.5 px-3 font-mono">Complaint #</th>
                <th className="py-2.5 px-3">CMU Owner</th>
                <th className="py-2.5 px-3 text-center font-mono">Aging (Days)</th>
                <th className="py-2.5 px-3 text-center">SLA Status</th>
                <th className="py-2.5 px-3 text-center">Priority</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 min-w-[200px]">Latest Activity Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {[...data]
                .sort((a, b) => (b.Aging || 0) - (a.Aging || 0))
                .slice(0, 15)
                .map((row) => {
                  const age = row.Aging || 1;
                  const isOverdue = age > 5;
                  const isWarning = age >= 3 && age <= 5;

                  return (
                    <tr
                      key={row['Complaint Number']}
                      onClick={() => onSelectComplaint(row)}
                      className="hover:bg-rose-50/20 cursor-pointer transition-colors"
                    >
                      <td className="py-2 px-3 font-mono font-bold text-slate-900">
                        {row['Complaint Number']}
                      </td>
                      <td className="py-2 px-3 font-semibold text-slate-800">
                        {row['cmu_owner_c']}
                      </td>
                      <td className="py-2 px-3 text-center font-mono font-bold">
                        <span className={`px-2 py-0.5 rounded text-[11px] ${
                          isOverdue ? 'bg-rose-100 text-rose-800' : isWarning ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {age} days
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        {isOverdue ? (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Overdue Alert
                          </span>
                        ) : isWarning ? (
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Warning Window
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Within SLA
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className="text-[10px] font-medium text-slate-700">
                          {row['Priority']}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-medium">
                        {row['Status']}
                      </td>
                      <td className="py-2 px-3 text-slate-600 line-clamp-1 leading-normal">
                        {row['Activity_notes']}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
