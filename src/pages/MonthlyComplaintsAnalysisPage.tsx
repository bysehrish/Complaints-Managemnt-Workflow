import React, { useState, useMemo } from 'react';
import {
  CalendarRange,
  Download,
  Printer,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  BarChart3,
  Layers,
  ArrowUpRight,
  Activity,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
  Area
} from 'recharts';
import * as XLSX from 'xlsx';
import { CRMComplaint } from '../types/crm';
import { PortalPage } from '../types/portal';

interface MonthlyComplaintsAnalysisPageProps {
  data: CRMComplaint[];
  onNavigate: (page: PortalPage) => void;
}

interface MonthDataPoint {
  month: string;
  shortMonth: string;
  isProjected: boolean;
  received: number;
  resolved: number;
  caf: number;
  cafPercent: number; // in %
  resolutionRate: number; // in %
  netVariance: number;
}

const MONTHLY_MATRIX: MonthDataPoint[] = [
  {
    month: 'Jan-26',
    shortMonth: 'Jan',
    isProjected: false,
    received: 3360,
    resolved: 3249,
    caf: 300,
    cafPercent: 8.93,
    resolutionRate: 96.7,
    netVariance: -111,
  },
  {
    month: 'Feb-26',
    shortMonth: 'Feb',
    isProjected: false,
    received: 1677,
    resolved: 1773,
    caf: 204,
    cafPercent: 12.16,
    resolutionRate: 105.7,
    netVariance: 96,
  },
  {
    month: 'Mar-26',
    shortMonth: 'Mar',
    isProjected: false,
    received: 1969,
    resolved: 2007,
    caf: 166,
    cafPercent: 8.43,
    resolutionRate: 101.9,
    netVariance: 38,
  },
  {
    month: 'Apr-26',
    shortMonth: 'Apr',
    isProjected: false,
    received: 2155,
    resolved: 2126,
    caf: 195,
    cafPercent: 9.05,
    resolutionRate: 98.7,
    netVariance: -29,
  },
  {
    month: 'May-26',
    shortMonth: 'May',
    isProjected: false,
    received: 1819,
    resolved: 1841,
    caf: 173,
    cafPercent: 9.51,
    resolutionRate: 101.2,
    netVariance: 22,
  },
  {
    month: 'Jun-26',
    shortMonth: 'Jun',
    isProjected: false,
    received: 1189,
    resolved: 1212,
    caf: 150,
    cafPercent: 12.61,
    resolutionRate: 101.9,
    netVariance: 23,
  },
  {
    month: 'Jul-26',
    shortMonth: 'Jul',
    isProjected: false,
    received: 1981,
    resolved: 1882,
    caf: 249,
    cafPercent: 12.57,
    resolutionRate: 95.0,
    netVariance: -99,
  },
  {
    month: 'Aug-26',
    shortMonth: 'Aug',
    isProjected: false,
    received: 1393,
    resolved: 1507,
    caf: 135,
    cafPercent: 9.69,
    resolutionRate: 108.2,
    netVariance: 114,
  },
  {
    month: 'Sep-26',
    shortMonth: 'Sep',
    isProjected: false,
    received: 1427,
    resolved: 1410,
    caf: 152,
    cafPercent: 10.65,
    resolutionRate: 98.8,
    netVariance: -17,
  },
  {
    month: 'Oct-26',
    shortMonth: 'Oct',
    isProjected: true,
    received: 1450,
    resolved: 1430,
    caf: 162,
    cafPercent: 11.20,
    resolutionRate: 98.6,
    netVariance: -20,
  },
  {
    month: 'Nov-26',
    shortMonth: 'Nov',
    isProjected: true,
    received: 1510,
    resolved: 1490,
    caf: 172,
    cafPercent: 11.40,
    resolutionRate: 98.7,
    netVariance: -20,
  },
  {
    month: 'Dec-26',
    shortMonth: 'Dec',
    isProjected: true,
    received: 1480,
    resolved: 1475,
    caf: 160,
    cafPercent: 10.80,
    resolutionRate: 99.7,
    netVariance: -5,
  },
];

export const MonthlyComplaintsAnalysisPage: React.FC<MonthlyComplaintsAnalysisPageProps> = ({
  onNavigate,
}) => {
  const [showProjections, setShowProjections] = useState<boolean>(true);
  const [selectedHighlightMonth, setSelectedHighlightMonth] = useState<string | null>('Sep-26');

  // Filtered dataset for display based on toggle
  const activeMonths = useMemo(() => {
    return showProjections ? MONTHLY_MATRIX : MONTHLY_MATRIX.filter((m) => !m.isProjected);
  }, [showProjections]);

  // Actuals (Jan-Sep) aggregates matching exact user specifications
  const actuals = useMemo(() => {
    const subset = MONTHLY_MATRIX.filter((m) => !m.isProjected);
    const totalReceived = subset.reduce((acc, curr) => acc + curr.received, 0); // 16,970
    const totalResolved = subset.reduce((acc, curr) => acc + curr.resolved, 0); // 17,007
    const totalCaf = subset.reduce((acc, curr) => acc + curr.caf, 0); // 1,724
    const avgCafPercent = 10.40; // Fixed official YTD weighted benchmark
    const avgResolutionRate = ((totalResolved / totalReceived) * 100);
    const netVariance = totalResolved - totalReceived; // +37

    return {
      totalReceived,
      totalResolved,
      totalCaf,
      avgCafPercent,
      avgResolutionRate,
      netVariance,
    };
  }, []);

  // Helper function to return zone styling
  const getCafZone = (percent: number) => {
    if (percent < 10) {
      return {
        zone: 'Green Zone',
        badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700/60',
        text: 'text-emerald-700 dark:text-emerald-400 font-bold',
        indicator: 'bg-emerald-500',
      };
    }
    if (percent <= 15) {
      return {
        zone: 'Yellow Zone',
        badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700/60',
        text: 'text-amber-700 dark:text-amber-400 font-bold',
        indicator: 'bg-amber-500',
      };
    }
    return {
      zone: 'Red Zone',
      badge: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-700/60',
      text: 'text-rose-700 dark:text-rose-400 font-bold',
      indicator: 'bg-rose-500',
    };
  };

  // Export Matrix to Excel (.xlsx) using SheetJS
  const handleExportExcel = () => {
    const headers = [
      'Performance Metric / Indicator',
      ...MONTHLY_MATRIX.map((m) => m.month + (m.isProjected ? ' (Proj)' : '')),
      'YTD Total / Avg (2026)',
    ];

    const rowCafPercent = [
      '% CAF Status',
      ...MONTHLY_MATRIX.map((m) => `${m.cafPercent.toFixed(2)}%`),
      '10.40% (Yellow Zone)',
    ];

    const rowReceived = [
      'Complaints Received',
      ...MONTHLY_MATRIX.map((m) => m.received),
      actuals.totalReceived,
    ];

    const rowResolved = [
      'Complaints Resolved',
      ...MONTHLY_MATRIX.map((m) => m.resolved),
      actuals.totalResolved,
    ];

    const rowCaf = [
      'Carry Forward (CAF)',
      ...MONTHLY_MATRIX.map((m) => m.caf),
      '-----',
    ];

    const rowResolutionRate = [
      'Resolution Rate %',
      ...MONTHLY_MATRIX.map((m) => `${m.resolutionRate.toFixed(1)}%`),
      `${actuals.avgResolutionRate.toFixed(1)}%`,
    ];

    const rowNetVariance = [
      'Net Monthly Variance (+/-)',
      ...MONTHLY_MATRIX.map((m) => (m.netVariance >= 0 ? `+${m.netVariance}` : `${m.netVariance}`)),
      `+${actuals.netVariance}`,
    ];

    const sheetData = [
      ['Service Quality Governance - Monthly Complaints Analysis – Jan To Dec - 2026'],
      ['Report Generated:', new Date().toLocaleString()],
      [],
      headers,
      rowCafPercent,
      rowReceived,
      rowResolved,
      rowCaf,
      rowResolutionRate,
      rowNetVariance,
      [],
      ['Compliance Guidelines:'],
      ['Green Zone: < 10% carry-forward complaints'],
      ['Yellow Zone: 10% - 15% carry-forward complaints (Current Status: Sep 2026 CAF is 10.65% - Yellow Zone)'],
      ['Red Zone: > 15% carry-forward complaints'],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Monthly Analysis 2026');
    XLSX.writeFile(workbook, `Monthly_Complaints_Analysis_2026_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:p-0">
      {/* ========================================================= */}
      {/* 1. PAGE HEADER                                            */}
      {/* ========================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-[11px] font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-widest">
                SERVICE QUALITY GOVERNANCE
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1 mb-1 flex items-center gap-2.5">
              <span>Monthly Complaints Analysis – Jan To Dec - 2026</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
              YTD Carry Forward (CAF) status, monthly received vs. resolved volume tracking, and threshold zonal compliance.
            </p>
          </div>

          {/* Action buttons & View toggles */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              onClick={() => onNavigate('quarterly_metrics')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 font-semibold text-xs transition-colors shadow-2xs"
            >
              <Activity className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Product Quarterly CDR</span>
            </button>

            <button
              onClick={() => onNavigate('sub_category_breakdown')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-semibold text-xs transition-colors shadow-2xs"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Sub-Category Breakdown</span>
            </button>

            {/* Projection toggle */}
            <button
              onClick={() => setShowProjections(!showProjections)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                showProjections
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
              }`}
              title="Toggle Oct-Dec 2026 Projections"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{showProjections ? 'Showing: Jan-Dec (Inc. Projections)' : 'Showing: Jan-Sep (Actuals Only)'}</span>
            </button>

            {/* Export Excel Button */}
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 font-semibold text-xs transition-colors shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export Excel</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 font-semibold text-xs transition-colors shadow-2xs print:hidden"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. EXECUTIVE KPI CARDS ROW                                */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Complaints Received */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Complaints Received (YTD)</span>
            <span className="p-1 rounded-md bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <CalendarRange className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {actuals.totalReceived.toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              Jan - Sep Actuals
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Full year projected: <strong className="font-semibold text-slate-700 dark:text-slate-300">21,410</strong>
          </div>
        </div>

        {/* KPI 2: Complaints Resolved */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Complaints Resolved (YTD)</span>
            <span className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {actuals.totalResolved.toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              100.2% Net
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Full year projected: <strong className="font-semibold text-slate-700 dark:text-slate-300">21,402</strong>
          </div>
        </div>

        {/* KPI 3: YTD Average CAF Status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>YTD Average % CAF</span>
            <span className="p-1 rounded-md bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              10.40%
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700">
              Yellow Zone
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Target benchmark: &lt;10.0% (Green)
          </div>
        </div>

        {/* KPI 4: Latest Sep-26 Status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Latest Month CAF (Sep-26)</span>
            <span className="p-1 rounded-md bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
              <ShieldAlert className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              10.65%
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700">
              Yellow Zone
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Carry forward volume: <strong className="font-semibold text-slate-700 dark:text-slate-300">152 cases</strong>
          </div>
        </div>

        {/* KPI 5: Net Cleared Margin */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Net Resolved Surplus</span>
            <span className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              +{actuals.netVariance}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Resolved &gt; Received
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            YTD Resolution: <strong className="font-semibold text-slate-700 dark:text-slate-300">{actuals.avgResolutionRate.toFixed(1)}%</strong>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN DATA MATRIX TABLE (Jan-26 to Dec-26)               */}
      {/* ========================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
        {/* Table Banner / Action Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Month-wise Performance Breakdown (Jan 2026 – Dec 2026)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Audited institutional metrics across volume receipt, resolution velocity, and monthly carry-forward percentages.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              &lt;10% Green
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              10-15% Yellow
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              &gt;15% Red
            </span>
          </div>
        </div>

        {/* Scrollable Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                <th className="p-3.5 font-bold sticky left-0 bg-slate-100 dark:bg-slate-800 z-10 min-w-[210px] shadow-[2px_0_5px_rgba(0,0,0,0.03)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                  Performance Metric / Indicator
                </th>
                {activeMonths.map((m) => {
                  const isHighlighted = selectedHighlightMonth === m.month;
                  return (
                    <th
                      key={m.month}
                      onClick={() => setSelectedHighlightMonth(m.month)}
                      className={`p-3 font-bold text-center min-w-[82px] cursor-pointer transition-colors ${
                        isHighlighted
                          ? 'bg-blue-100/70 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200'
                          : 'hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      <div className="font-extrabold tracking-tight">{m.month}</div>
                      {m.isProjected ? (
                        <span className="text-[9px] font-normal uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          Proj
                        </span>
                      ) : (
                        <span className="text-[9px] font-normal uppercase tracking-wider text-slate-400">
                          Actual
                        </span>
                      )}
                    </th>
                  );
                })}
                <th className="p-3 font-extrabold text-center bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-300 min-w-[130px] border-l border-slate-200 dark:border-slate-700">
                  <div>YTD Average 2026</div>
                  <span className="text-[9px] font-medium text-blue-600 dark:text-blue-400 uppercase">
                    (Jan - Sep Benchmark)
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {/* Row 1: % CAF Status */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors font-medium">
                <td className="p-3.5 font-extrabold text-slate-900 dark:text-white sticky left-0 bg-white dark:bg-slate-900 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.03)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.3)] flex items-center justify-between">
                  <span>% CAF Status</span>
                  <span className="text-[10px] font-normal text-slate-400">Carry Forward Rate</span>
                </td>
                {activeMonths.map((m) => {
                  const zone = getCafZone(m.cafPercent);
                  const isHighlighted = selectedHighlightMonth === m.month;
                  return (
                    <td
                      key={m.month}
                      onClick={() => setSelectedHighlightMonth(m.month)}
                      className={`p-2.5 text-center cursor-pointer transition-colors ${
                        isHighlighted ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <span
                        className={`inline-block px-2 py-1 rounded-md text-xs font-mono font-bold border ${zone.badge}`}
                        title={`${m.month}: ${m.cafPercent}% (${zone.zone})`}
                      >
                        {m.cafPercent.toFixed(2)}%
                      </span>
                    </td>
                  );
                })}
                <td className="p-2.5 text-center bg-blue-50/60 dark:bg-blue-950/40 border-l border-slate-200 dark:border-slate-700 font-bold">
                  <span className="inline-block px-2.5 py-1 rounded-md text-xs font-mono font-extrabold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-400 dark:border-amber-600">
                    10.40%
                  </span>
                  <div className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold mt-0.5">
                    Yellow Zone
                  </div>
                </td>
              </tr>

              {/* Row 2: Complaints Received */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-3.5 font-bold text-slate-900 dark:text-white sticky left-0 bg-white dark:bg-slate-900 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.03)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.3)] flex items-center justify-between">
                  <span>Complaints Received</span>
                  <span className="text-[10px] font-normal text-slate-400">Inbound Logged</span>
                </td>
                {activeMonths.map((m) => {
                  const isHighlighted = selectedHighlightMonth === m.month;
                  return (
                    <td
                      key={m.month}
                      onClick={() => setSelectedHighlightMonth(m.month)}
                      className={`p-3 text-center font-mono font-medium text-slate-700 dark:text-slate-300 cursor-pointer ${
                        isHighlighted ? 'bg-blue-50/50 dark:bg-blue-950/20 font-bold text-blue-700 dark:text-blue-300' : ''
                      }`}
                    >
                      {m.received.toLocaleString()}
                    </td>
                  );
                })}
                <td className="p-3 text-center bg-blue-50/60 dark:bg-blue-950/40 border-l border-slate-200 dark:border-slate-700 font-mono font-extrabold text-blue-900 dark:text-blue-200 text-sm">
                  {actuals.totalReceived.toLocaleString()}
                  <div className="text-[10px] font-normal text-slate-500 dark:text-slate-400">
                    Total YTD
                  </div>
                </td>
              </tr>

              {/* Row 3: Complaints Resolved */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-3.5 font-bold text-slate-900 dark:text-white sticky left-0 bg-white dark:bg-slate-900 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.03)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.3)] flex items-center justify-between">
                  <span>Complaints Resolved</span>
                  <span className="text-[10px] font-normal text-slate-400">Settled / Closed</span>
                </td>
                {activeMonths.map((m) => {
                  const isHighlighted = selectedHighlightMonth === m.month;
                  return (
                    <td
                      key={m.month}
                      onClick={() => setSelectedHighlightMonth(m.month)}
                      className={`p-3 text-center font-mono font-semibold text-emerald-700 dark:text-emerald-400 cursor-pointer ${
                        isHighlighted ? 'bg-blue-50/50 dark:bg-blue-950/20 font-extrabold' : ''
                      }`}
                    >
                      {m.resolved.toLocaleString()}
                    </td>
                  );
                })}
                <td className="p-3 text-center bg-blue-50/60 dark:bg-blue-950/40 border-l border-slate-200 dark:border-slate-700 font-mono font-extrabold text-emerald-700 dark:text-emerald-300 text-sm">
                  {actuals.totalResolved.toLocaleString()}
                  <div className="text-[10px] font-normal text-slate-500 dark:text-slate-400">
                    Total YTD
                  </div>
                </td>
              </tr>

              {/* Row 4: Carry Forward (CAF) */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-3.5 font-bold text-slate-900 dark:text-white sticky left-0 bg-white dark:bg-slate-900 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.03)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.3)] flex items-center justify-between">
                  <span>Carry Forward (CAF)</span>
                  <span className="text-[10px] font-normal text-slate-400">Backlog Cases</span>
                </td>
                {activeMonths.map((m) => {
                  const isHighlighted = selectedHighlightMonth === m.month;
                  return (
                    <td
                      key={m.month}
                      onClick={() => setSelectedHighlightMonth(m.month)}
                      className={`p-3 text-center font-mono font-semibold text-amber-700 dark:text-amber-400 cursor-pointer ${
                        isHighlighted ? 'bg-blue-50/50 dark:bg-blue-950/20 font-extrabold' : ''
                      }`}
                    >
                      {m.caf}
                    </td>
                  );
                })}
                <td className="p-3 text-center bg-blue-50/60 dark:bg-blue-950/40 border-l border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-500 dark:text-slate-400">
                  -----
                  <div className="text-[10px] font-normal text-slate-400">
                    YTD Total
                  </div>
                </td>
              </tr>

              {/* Row 5: Resolution Velocity Rate % */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors bg-slate-50/30 dark:bg-slate-800/20">
                <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300 sticky left-0 bg-slate-50/90 dark:bg-slate-900/90 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.03)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.3)] flex items-center justify-between">
                  <span>Resolution Velocity %</span>
                  <span className="text-[10px] font-normal text-slate-400">Resolved / Received</span>
                </td>
                {activeMonths.map((m) => {
                  const isHigher = m.resolutionRate >= 100;
                  return (
                    <td key={m.month} className="p-3 text-center font-mono text-[11px]">
                      <span className={isHigher ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-400'}>
                        {m.resolutionRate.toFixed(1)}%
                      </span>
                    </td>
                  );
                })}
                <td className="p-3 text-center bg-blue-50/60 dark:bg-blue-950/40 border-l border-slate-200 dark:border-slate-700 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {actuals.avgResolutionRate.toFixed(1)}%
                  <div className="text-[10px] font-normal text-slate-500">
                    Surplus Ratio
                  </div>
                </td>
              </tr>

              {/* Row 6: Net Monthly Flow (+ / -) */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors bg-slate-50/30 dark:bg-slate-800/20">
                <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300 sticky left-0 bg-slate-50/90 dark:bg-slate-900/90 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.03)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.3)] flex items-center justify-between">
                  <span>Net Volume Flow (+/-)</span>
                  <span className="text-[10px] font-normal text-slate-400">Variance Surplus</span>
                </td>
                {activeMonths.map((m) => {
                  const isPositive = m.netVariance >= 0;
                  return (
                    <td key={m.month} className="p-3 text-center font-mono text-[11px]">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded ${
                          isPositive
                            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 font-semibold'
                            : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30'
                        }`}
                      >
                        {isPositive ? `+${m.netVariance}` : m.netVariance}
                      </span>
                    </td>
                  );
                })}
                <td className="p-3 text-center bg-blue-50/60 dark:bg-blue-950/40 border-l border-slate-200 dark:border-slate-700 font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                  +{actuals.netVariance}
                  <div className="text-[10px] font-normal text-slate-500">
                    Net Cleared
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. VISUALIZATION CARDS (RECEIVED VS RESOLVED & CAF TREND) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Volume Trend (Received vs Resolved) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>Monthly Received vs. Resolved Volume (2026)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tracking inflow vs resolution throughput across months with projection horizon.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-blue-600 font-semibold">
                <span className="w-3 h-3 rounded-xs bg-blue-600 inline-block" />
                Received
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" />
                Resolved
              </span>
            </div>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={activeMonths} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
                <XAxis dataKey="shortMonth" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const dataPoint = payload[0].payload as MonthDataPoint;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700">
                          <div className="font-bold flex items-center justify-between gap-4">
                            <span>{dataPoint.month} {dataPoint.isProjected ? '(Projected)' : ''}</span>
                            <span className="text-blue-400 font-mono">{dataPoint.resolutionRate.toFixed(1)}% Velocity</span>
                          </div>
                          <div className="flex items-center justify-between text-blue-300 gap-4">
                            <span>Complaints Received:</span>
                            <span className="font-mono font-bold">{dataPoint.received.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-emerald-400 gap-4">
                            <span>Complaints Resolved:</span>
                            <span className="font-mono font-bold">{dataPoint.resolved.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-amber-300 gap-4">
                            <span>Carry Forward (CAF):</span>
                            <span className="font-mono font-bold">{dataPoint.caf}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="received" fill="#2563eb" radius={[4, 4, 0, 0]} name="Received" maxBarSize={22} />
                <Bar dataKey="resolved" fill="#10b981" radius={[4, 4, 0, 0]} name="Resolved" maxBarSize={22} />
                <Line type="monotone" dataKey="caf" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3, fill: '#f59e0b' }} name="CAF Volume" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: % CAF Status vs Zonal Compliance Thresholds */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>% CAF Trend vs. Compliance Threshold Zones</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Green Zone (&lt;10%), Yellow Zone (10-15%), and Red Zone (&gt;15%) benchmark tracking.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-extrabold text-amber-600 dark:text-amber-400">
                YTD Avg: 10.40%
              </span>
            </div>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={activeMonths} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
                <XAxis dataKey="shortMonth" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis
                  domain={[5, 16]}
                  tickFormatter={(val) => `${val}%`}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const dataPoint = payload[0].payload as MonthDataPoint;
                      const zone = getCafZone(dataPoint.cafPercent);
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
                          <div className="font-bold">{dataPoint.month} {dataPoint.isProjected ? '(Projected)' : ''}</div>
                          <div className="flex items-center gap-2">
                            <span>CAF Rate:</span>
                            <span className="font-mono font-bold text-amber-300">{dataPoint.cafPercent.toFixed(2)}%</span>
                          </div>
                          <div className={`text-[11px] font-bold ${zone.text}`}>
                            Status: {zone.zone}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* 10% Green/Yellow boundary */}
                <ReferenceLine y={10} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: '10% Max Green Zone', fill: '#10b981', fontSize: 10, position: 'insideTopLeft' }} />
                {/* 15% Yellow/Red boundary */}
                <ReferenceLine y={15} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: '15% Red Zone Alert', fill: '#ef4444', fontSize: 10, position: 'insideTopLeft' }} />
                {/* 10.40% YTD Average Reference */}
                <ReferenceLine y={10.4} stroke="#f59e0b" strokeWidth={2} label={{ value: '10.40% YTD Avg', fill: '#d97706', fontSize: 10, position: 'insideBottomRight' }} />
                <Line
                  type="monotone"
                  dataKey="cafPercent"
                  stroke="#1034A6"
                  strokeWidth={3}
                  dot={{ r: 4, stroke: '#1034A6', strokeWidth: 2, fill: '#ffffff' }}
                  name="% CAF Status"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. CAF COMPLIANCE GUIDELINES FOOTER BANNER                */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-extrabold tracking-wide uppercase text-blue-300">
                CAF Compliance Guidelines & Threshold Governance
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Carry Forward (CAF) percentage measures the ratio of unresolved backlog complaints rolling into the subsequent operational period relative to total volume. Adherence to institutional service recovery standards is enforced through three zonal classifications:
            </p>

            {/* Threshold Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Green Zone */}
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-emerald-500/30 flex items-start gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
                    <span>Green Zone: &lt;10%</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Acceptable carry-forward threshold. Routine SLA settlement cadence maintained across branches and digital channels.
                  </div>
                  <div className="text-[10px] text-emerald-400/80 font-mono mt-1 font-semibold">
                    Jan (8.93%), Mar (8.43%), Apr (9.05%), May (9.51%), Aug (9.69%)
                  </div>
                </div>
              </div>

              {/* Yellow Zone */}
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-amber-500/50 flex items-start gap-3 relative overflow-hidden">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs font-extrabold text-amber-400 flex items-center justify-between gap-2">
                    <span>Yellow Zone: 10% – 15%</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase">
                      Current Active
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Elevated carry-forward volume requiring CMU owner escalation and daily resolution velocity tracking.
                  </div>
                  <div className="text-[10px] text-amber-300 font-bold mt-1.5 bg-amber-950/60 p-1.5 rounded-lg border border-amber-500/30">
                    Current Status: Sep 2026 CAF is <span className="underline font-black text-amber-200">10.65% - Yellow Zone</span>
                  </div>
                </div>
              </div>

              {/* Red Zone */}
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-rose-500/30 flex items-start gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold text-rose-400 flex items-center gap-1.5">
                    <span>Red Zone: &gt;15%</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Critical compliance breach triggering immediate Service Quality Head alert, root-cause committee audit, and rapid taskforce deployment.
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    No months breached &gt;15% in FY 2026.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Callout: Governance Audit Badge */}
          <div className="p-4 rounded-xl bg-blue-900/40 border border-blue-700/50 text-center shrink-0 w-full md:w-56 space-y-2">
            <div className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">
              FY 2026 Audit Status
            </div>
            <div className="text-xl font-black text-white font-mono">
              10.40% CAF
            </div>
            <div className="inline-block px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
              Zonal Status: Yellow Zone
            </div>
            <p className="text-[10px] text-blue-200/80 pt-1 leading-snug">
              Governance review frequency: Bi-weekly CMU committee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
