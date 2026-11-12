import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList
} from 'recharts';
import { CRMComplaint } from '../../types/crm';

interface ExecutiveSummaryViewProps {
  data: CRMComplaint[];
  onSelectComplaint: (complaint: CRMComplaint) => void;
}

export const ExecutiveSummaryView: React.FC<ExecutiveSummaryViewProps> = ({
  data,
  onSelectComplaint,
}) => {
  // Dynamic KPIs calculated from the active dataset
  const totalCases = data.length;
  const resolvedCases = data.filter(
    (c) => c.Status === 'Resolved' || c.Status === 'Closed'
  ).length;
  const wipCases = totalCases - resolvedCases;
  const responseRate = totalCases > 0 ? Math.round((resolvedCases / totalCases) * 100) : 78;

  // 1. Status Data
  const statusCounts: Record<string, number> = {};
  data.forEach((c) => {
    let s = c.Status;
    if (s === 'Closed') s = 'Resolved';
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });

  const STATUS_CHART_DATA = [
    { name: 'In Progress', value: statusCounts['In Progress'] || 0, color: '#1034A6' },
    { name: 'Resolved', value: statusCounts['Resolved'] || 0, color: '#16a34a' },
    { name: 'Open', value: statusCounts['Open'] || 0, color: '#db2777' },
  ].filter((d) => d.value > 0);

  // 2. Category / Product Data
  const productCounts: Record<string, number> = {};
  data.forEach((c) => {
    const p = c.Product || 'Other';
    productCounts[p] = (productCounts[p] || 0) + 1;
  });

  const CATEGORY_CHART_DATA = Object.entries(productCounts)
    .map(([name, count]) => ({
      name: name.length > 16 ? `${name.slice(0, 14)}...` : name,
      fullName: name,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 3. Monthly Trend Data
  const monthlyCounts: Record<string, number> = {};
  data.forEach((c) => {
    const dateStr = c['Logging Date'];
    if (dateStr) {
      const monthKey = dateStr.slice(0, 7); // e.g. "2024-08"
      monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
    }
  });

  const MONTHLY_CHART_DATA = Object.keys(monthlyCounts)
    .sort()
    .map((mKey) => {
      const [year, month] = mKey.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const label = `${monthNames[parseInt(month, 10) - 1]} ${year}`;
      return {
        month: label,
        count: monthlyCounts[mKey],
      };
    });

  // 4. Team Distribution Data
  const teamCounts: Record<string, number> = {};
  data.forEach((c) => {
    const t = c.cmu_owner_c || 'Operation';
    teamCounts[t] = (teamCounts[t] || 0) + 1;
  });

  const TEAM_COLORS = ['#60a5fa', '#1034A6', '#64748b', '#a855f7', '#f59e0b'];
  const TEAM_CHART_DATA = Object.entries(teamCounts)
    .map(([name, value], idx) => ({
      name,
      value,
      color: TEAM_COLORS[idx % TEAM_COLORS.length],
    }))
    .sort((a, b) => b.value - a.value);

  const renderStatus = (status: string) => {
    if (status === 'Open') return <span className="font-semibold text-rose-500">Open</span>;
    if (status === 'In Progress') return <span className="font-semibold text-blue-600">In Progress</span>;
    return <span className="font-semibold text-emerald-600">Resolved</span>;
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards (Top Row) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="border border-slate-400 rounded-xl p-4 sm:p-5 text-center bg-white shadow-2xs">
          <div className="text-3xl sm:text-4xl font-extrabold text-[#0B2559] font-mono tabular-nums leading-none">
            {totalCases}
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-800 mt-2">
            Total Complaints #
          </div>
        </div>

        <div className="border border-slate-400 rounded-xl p-4 sm:p-5 text-center bg-white shadow-2xs">
          <div className="text-3xl sm:text-4xl font-extrabold text-[#0B2559] font-mono tabular-nums leading-none">
            {wipCases}
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-800 mt-2">
            WIP Complaints #
          </div>
        </div>

        <div className="border border-slate-400 rounded-xl p-4 sm:p-5 text-center bg-white shadow-2xs">
          <div className="text-3xl sm:text-4xl font-extrabold text-[#0B2559] font-mono tabular-nums leading-none">
            {resolvedCases}
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-800 mt-2">
            Resolved Complaints #
          </div>
        </div>

        <div className="border border-slate-400 rounded-xl p-4 sm:p-5 text-center bg-white shadow-2xs">
          <div className="text-3xl sm:text-4xl font-extrabold text-[#0B2559] font-mono tabular-nums leading-none">
            {responseRate}%
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-800 mt-2">
            Response Rate %
          </div>
        </div>
      </div>

      {/* 2x2 Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Chart 1: Status */}
        <div className="border border-slate-300 rounded-xl p-4 sm:p-5 bg-white shadow-2xs flex flex-col">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 text-center mb-3">
            Complaints # by Status
          </h2>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} cases`, name]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '11px' }}
                />
                <Pie
                  data={STATUS_CHART_DATA}
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
                    const pct = `${Math.round((percent || 0) * 100)}%`;
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#1e293b"
                        textAnchor={textAnchor}
                        dominantBaseline="central"
                        className="text-[10px] sm:text-[11px] font-medium"
                      >
                        {`${name} ${value} (${pct})`}
                      </text>
                    );
                  }}
                >
                  {STATUS_CHART_DATA.map((entry, idx) => (
                    <Cell key={`status-cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center items-center gap-4 text-xs mt-1">
            {STATUS_CHART_DATA.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-700 font-medium text-[11px]">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Category (Horizontal Bar Chart) */}
        <div className="border border-slate-300 rounded-xl p-4 sm:p-5 bg-white shadow-2xs flex flex-col">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 text-center mb-3">
            Complaints # by Category
          </h2>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={CATEGORY_CHART_DATA}
                margin={{ top: 8, right: 35, left: 25, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#334155', fontSize: 11, fontWeight: 500 }}
                  width={110}
                />
                <Tooltip
                  formatter={(val: any) => [`${val} complaints`, 'Total']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#0091FF" radius={[0, 4, 4, 0]} barSize={16}>
                  <LabelList
                    dataKey="count"
                    position="right"
                    style={{ fill: '#0f172a', fontSize: '11px', fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-[10px] text-slate-400 mt-auto">
            Categorical product breakdown
          </div>
        </div>

        {/* Chart 3: Monthly Trend */}
        <div className="border border-slate-300 rounded-xl p-4 sm:p-5 bg-white shadow-2xs flex flex-col">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 text-center mb-3">
            Complaints # Monthly Trend
          </h2>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={MONTHLY_CHART_DATA}
                margin={{ top: 15, right: 10, left: 10, bottom: 5 }}
              >
                <XAxis
                  dataKey="month"
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  tick={{ fill: '#475569', fontSize: 10, fontWeight: 500 }}
                />
                <YAxis hide />
                <Tooltip
                  formatter={(val: any) => [`${val} complaints`, 'Volume']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#0091FF" radius={[2, 2, 0, 0]} barSize={22}>
                  <LabelList
                    dataKey="count"
                    position="top"
                    style={{ fill: '#0f172a', fontSize: '11px', fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-[10px] text-slate-400 mt-auto">
            Ingestion timeline trend
          </div>
        </div>

        {/* Chart 4: Teams */}
        <div className="border border-slate-300 rounded-xl p-4 sm:p-5 bg-white shadow-2xs flex flex-col">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 text-center mb-3">
            Complaints # by Teams
          </h2>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} cases`, name]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '11px' }}
                />
                <Pie
                  data={TEAM_CHART_DATA}
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
                    const pct = `${Math.round((percent || 0) * 100)}%`;
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#1e293b"
                        textAnchor={textAnchor}
                        dominantBaseline="central"
                        className="text-[10px] sm:text-[11px] font-medium"
                      >
                        {`${name} ${value} (${pct})`}
                      </text>
                    );
                  }}
                >
                  {TEAM_CHART_DATA.map((entry, idx) => (
                    <Cell key={`team-cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center items-center gap-4 text-xs mt-1 flex-wrap">
            {TEAM_CHART_DATA.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-700 font-medium text-[11px]">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Registry Table: Lists Complaint Number, Product, ComplaintType, description_compaint, cmu_owner_c, Status */}
      <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[#0B2559] font-bold bg-white">
                <th className="py-2.5 px-3 w-28 font-mono">
                  <span className="flex items-center gap-0.5">
                    <span className="text-[10px] text-blue-900">▲</span> Complaint Number
                  </span>
                </th>
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3">ComplaintType</th>
                <th className="py-2.5 px-3 min-w-[280px]">Description</th>
                <th className="py-2.5 px-3">CMU Owner</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {data.slice(0, 15).map((row) => (
                <tr
                  key={row['Complaint Number']}
                  onClick={() => onSelectComplaint(row)}
                  className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                >
                  <td className="py-2 px-3 font-mono font-bold text-slate-900">
                    {row['Complaint Number']}
                  </td>
                  <td className="py-2 px-3 text-slate-900 font-medium">{row['Product']}</td>
                  <td className="py-2 px-3 text-slate-600">{row['ComplaintType']}</td>
                  <td className="py-2 px-3 text-slate-800 leading-normal line-clamp-1">
                    {row['description_compaint']}
                  </td>
                  <td className="py-2 px-3 font-mono text-slate-600 font-medium">{row['cmu_owner_c']}</td>
                  <td className="py-2 px-3 text-center">{renderStatus(row['Status'])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between font-mono">
          <span>Showing top {Math.min(15, data.length)} records · Click row to inspect CRM case</span>
          <span>Total: {data.length} records</span>
        </div>
      </div>
    </div>
  );
};
