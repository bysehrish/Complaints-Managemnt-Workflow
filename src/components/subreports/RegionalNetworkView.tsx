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
import { Building2, MapPin, AlertTriangle, ShieldCheck } from 'lucide-react';

interface RegionalNetworkViewProps {
  data: CRMComplaint[];
  onSelectComplaint: (complaint: CRMComplaint) => void;
}

export const RegionalNetworkView: React.FC<RegionalNetworkViewProps> = ({
  data,
  onSelectComplaint,
}) => {
  // 1. Circle Breakdown
  const circleMap: Record<string, number> = {};
  data.forEach((c) => {
    const circle = c.Circle || 'Other';
    circleMap[circle] = (circleMap[circle] || 0) + 1;
  });

  const CIRCLE_COLORS = ['#0091FF', '#1034A6', '#64748b', '#10b981', '#f59e0b'];
  const CIRCLE_CHART_DATA = Object.entries(circleMap).map(([name, value], idx) => ({
    name,
    value,
    color: CIRCLE_COLORS[idx % CIRCLE_COLORS.length],
  }));

  // 2. City & New Region breakdown
  const cityMap: Record<string, number> = {};
  data.forEach((c) => {
    const city = c.City_c || 'Unknown';
    cityMap[city] = (cityMap[city] || 0) + 1;
  });

  const CITY_CHART_DATA = Object.entries(cityMap)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count);

  // 3. Branch Performance Aggregation (ranked by total volume)
  interface BranchStat {
    branchCode: string;
    city: string;
    region: string;
    circle: string;
    totalCases: number;
    avgAging: number;
    highPriorityCount: number;
  }

  const branchAgg: Record<string, { total: number; totalAging: number; highPrio: number; city: string; region: string; circle: string }> = {};

  data.forEach((c) => {
    const code = c['Branch Code'] || 'General';
    if (!branchAgg[code]) {
      branchAgg[code] = {
        total: 0,
        totalAging: 0,
        highPrio: 0,
        city: c.City_c,
        region: c['New Region'],
        circle: c.Circle,
      };
    }
    branchAgg[code].total += 1;
    branchAgg[code].totalAging += c.Aging || 1;
    if (c.Priority === 'Critical' || c.Priority === 'High') {
      branchAgg[code].highPrio += 1;
    }
  });

  const rankedBranches: BranchStat[] = Object.entries(branchAgg)
    .map(([branchCode, stat]) => ({
      branchCode,
      city: stat.city,
      region: stat.region,
      circle: stat.circle,
      totalCases: stat.total,
      avgAging: Number((stat.totalAging / stat.total).toFixed(1)),
      highPriorityCount: stat.highPrio,
    }))
    .sort((a, b) => b.totalCases - a.totalCases);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0B2559]">
              Branch & Regional Network Analysis
            </h2>
            <p className="text-xs text-slate-500">
              Cross-circle distribution, municipal incident hotspots, and branch SLA velocity rankings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700">
            Active Circles: <span className="font-bold text-[#0B2559]">{CIRCLE_CHART_DATA.length}</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700">
            Monitored Branches: <span className="font-bold text-[#0B2559]">{rankedBranches.length}</span>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Chart 1: Circle Distribution */}
        <div className="border border-slate-300 rounded-xl p-4 sm:p-5 bg-white shadow-2xs flex flex-col">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 text-center mb-3">
            Complaints # by Circle
          </h3>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} cases`, name]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '11px' }}
                />
                <Pie
                  data={CIRCLE_CHART_DATA}
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
                        {`${name}: ${value} (${Math.round(percent * 100)}%)`}
                      </text>
                    );
                  }}
                >
                  {CIRCLE_CHART_DATA.map((entry, idx) => (
                    <Cell key={`circle-cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center items-center gap-3 text-xs mt-1 flex-wrap">
            {CIRCLE_CHART_DATA.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-700 font-medium text-[11px]">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Complaints by City (Ranked Bar Chart) */}
        <div className="border border-slate-300 rounded-xl p-4 sm:p-5 bg-white shadow-2xs flex flex-col">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 text-center mb-3">
            Complaints # by City
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={CITY_CHART_DATA}
                margin={{ top: 8, right: 35, left: 25, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="city"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#334155', fontSize: 11, fontWeight: 500 }}
                  width={90}
                />
                <Tooltip
                  formatter={(val: any) => [`${val} cases`, 'Total']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#1034A6" radius={[0, 4, 4, 0]} barSize={16}>
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
            Metropolitan volume ranking
          </div>
        </div>
      </div>

      {/* Branch Performance Table */}
      <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Branch Incident & SLA Aging Performance Table
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {rankedBranches.length} Branches Indexed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[#0B2559] font-bold bg-white">
                <th className="py-2.5 px-3 font-mono">Branch Code</th>
                <th className="py-2.5 px-3">City</th>
                <th className="py-2.5 px-3">New Region</th>
                <th className="py-2.5 px-3">Circle</th>
                <th className="py-2.5 px-3 text-center">Total Volume</th>
                <th className="py-2.5 px-3 text-center font-mono">Avg Aging (Days)</th>
                <th className="py-2.5 px-3 text-center">High-Priority Alerts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {rankedBranches.map((b) => (
                <tr key={b.branchCode} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-2 px-3 font-mono font-bold text-slate-900">
                    {b.branchCode}
                  </td>
                  <td className="py-2 px-3 text-slate-800 font-medium">{b.city}</td>
                  <td className="py-2 px-3 text-slate-600">{b.region}</td>
                  <td className="py-2 px-3 text-slate-600">{b.circle}</td>
                  <td className="py-2 px-3 text-center font-bold font-mono text-[#0B2559]">
                    {b.totalCases}
                  </td>
                  <td className="py-2 px-3 text-center font-mono">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      b.avgAging > 4 ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {b.avgAging} d
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    {b.highPriorityCount > 0 ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        {b.highPriorityCount} High Prio
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono text-[11px]">—</span>
                    )}
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
