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
  Legend
} from 'recharts';
import { CRMComplaint } from '../../types/crm';
import { Users2, Smartphone, Building, PhoneCall, Globe, FileWarning } from 'lucide-react';

interface CustomerChannelsViewProps {
  data: CRMComplaint[];
  onSelectComplaint: (complaint: CRMComplaint) => void;
}

export const CustomerChannelsView: React.FC<CustomerChannelsViewProps> = ({
  data,
  onSelectComplaint,
}) => {
  // 1. Channel Distribution
  const channelMap: Record<string, number> = {};
  data.forEach((c) => {
    const ch = c['Lodgement Source'] || 'Mobile App';
    channelMap[ch] = (channelMap[ch] || 0) + 1;
  });

  const CHANNEL_COLORS = ['#0091FF', '#1034A6', '#10b981', '#f59e0b', '#ec4899'];
  const CHANNEL_CHART_DATA = Object.entries(channelMap).map(([name, value], idx) => ({
    name,
    value,
    color: CHANNEL_COLORS[idx % CHANNEL_COLORS.length],
  }));

  // 2. Priority cross-referenced with Product
  // Group by Product, and count Critical, High, Medium, Low
  const productPrioMap: Record<string, { Critical: number; High: number; Medium: number; Low: number }> = {};
  data.forEach((c) => {
    const prod = c.Product || 'Other';
    if (!productPrioMap[prod]) {
      productPrioMap[prod] = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    }
    const p = c.Priority;
    if (p === 'Critical') productPrioMap[prod].Critical += 1;
    else if (p === 'High') productPrioMap[prod].High += 1;
    else if (p === 'Medium') productPrioMap[prod].Medium += 1;
    else productPrioMap[prod].Low += 1;
  });

  const PRIORITY_CROSS_DATA = Object.entries(productPrioMap).map(([product, counts]) => ({
    product,
    Critical: counts.Critical,
    High: counts.High,
    Medium: counts.Medium,
    Low: counts.Low,
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
            <Users2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0B2559]">
              Customer Impact & Lodgement Channel Analysis
            </h2>
            <p className="text-xs text-slate-500">
              Ingest intake channels, customer account exposure, and cross-product priority severity distributions
            </p>
          </div>
        </div>

        <div className="text-xs font-mono bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700">
          Intake Channels: <span className="font-bold text-[#0B2559]">{CHANNEL_CHART_DATA.length} Active</span>
        </div>
      </div>

      {/* 2 Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Chart 1: Lodgement Source */}
        <div className="border border-slate-300 rounded-xl p-4 sm:p-5 bg-white shadow-2xs flex flex-col">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 text-center mb-3">
            Complaints # by Lodgement Source
          </h3>
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} cases`, name]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '11px' }}
                />
                <Pie
                  data={CHANNEL_CHART_DATA}
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
                  {CHANNEL_CHART_DATA.map((entry, idx) => (
                    <Cell key={`ch-cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center items-center gap-3 text-xs mt-1 flex-wrap">
            {CHANNEL_CHART_DATA.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-700 font-medium text-[11px]">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Priority by Product Matrix */}
        <div className="border border-slate-300 rounded-xl p-4 sm:p-5 bg-white shadow-2xs flex flex-col">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 text-center mb-3">
            Priority Severity by Product
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={PRIORITY_CROSS_DATA}
                margin={{ top: 15, right: 15, left: 0, bottom: 5 }}
              >
                <XAxis dataKey="product" tick={{ fontSize: 10, fill: '#475569' }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                <Bar dataKey="Critical" fill="#e11d48" stackId="a" />
                <Bar dataKey="High" fill="#f59e0b" stackId="a" />
                <Bar dataKey="Medium" fill="#3b82f6" stackId="a" />
                <Bar dataKey="Low" fill="#94a3b8" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-[10px] text-slate-400 mt-auto">
            Stacked severity matrix
          </div>
        </div>
      </div>

      {/* Customer Registry Table */}
      <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Customer KYC & Ingest Intake Log
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Masked PII Protection (12 CFR Part 1005)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[#0B2559] font-bold bg-white">
                <th className="py-2.5 px-3 font-mono">Complaint #</th>
                <th className="py-2.5 px-3">Customer Name</th>
                <th className="py-2.5 px-3 font-mono">CNIC (Masked)</th>
                <th className="py-2.5 px-3 font-mono">Account #</th>
                <th className="py-2.5 px-3">Lodgement Channel</th>
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3 text-center">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {data.slice(0, 15).map((row) => (
                <tr
                  key={row['Complaint Number']}
                  onClick={() => onSelectComplaint(row)}
                  className="hover:bg-emerald-50/30 cursor-pointer transition-colors"
                >
                  <td className="py-2 px-3 font-mono font-bold text-slate-900">
                    {row['Complaint Number']}
                  </td>
                  <td className="py-2 px-3 font-semibold text-slate-900">
                    {row['customer_name_c']}
                  </td>
                  <td className="py-2 px-3 font-mono text-slate-500 text-[11px]">
                    {row['cnic_c']}
                  </td>
                  <td className="py-2 px-3 font-mono text-slate-700 text-[11px]">
                    {row['customer_account_c']}
                  </td>
                  <td className="py-2 px-3 text-slate-600 font-medium">
                    {row['Lodgement Source']}
                  </td>
                  <td className="py-2 px-3 text-slate-800">{row['Product']}</td>
                  <td className="py-2 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      row['Priority'] === 'Critical' ? 'bg-rose-100 text-rose-800' :
                      row['Priority'] === 'High' ? 'bg-amber-100 text-amber-800' :
                      row['Priority'] === 'Medium' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {row['Priority']}
                    </span>
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
