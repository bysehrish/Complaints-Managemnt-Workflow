import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Smartphone,
  Building2,
  Zap,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Printer,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  Activity,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ComposedChart,
  Line,
  Cell
} from 'recharts';
import * as XLSX from 'xlsx';
import {
  ProductQuarterMetric,
  QUARTERLY_PRODUCT_METRICS
} from '../types/quarterlyMetrics';
import { PortalPage } from '../types/portal';

interface QuarterlyProductMetricsPageProps {
  onNavigate: (page: PortalPage) => void;
}

export const QuarterlyProductMetricsPage: React.FC<QuarterlyProductMetricsPageProps> = ({
  onNavigate,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  // Overall totals across products scaled per 1,000 units
  const totals = useMemo(() => {
    let q1Complaints = 0;
    let q1Volume = 0;
    let q2Complaints = 0;
    let q2Volume = 0;
    let q3Complaints = 0;
    let q3Volume = 0;

    QUARTERLY_PRODUCT_METRICS.forEach((p) => {
      q1Complaints += p.q1.complaints;
      q1Volume += p.q1.volume;
      q2Complaints += p.q2.complaints;
      q2Volume += p.q2.volume;
      q3Complaints += p.q3.complaints;
      q3Volume += p.q3.volume;
    });

    const q1Cdr = Number(((q1Complaints / q1Volume) * 1000).toFixed(2));
    const q2Cdr = Number(((q2Complaints / q2Volume) * 1000).toFixed(2));
    const q3Cdr = Number(((q3Complaints / q3Volume) * 1000).toFixed(2));
    const totalComplaintsYTD = q1Complaints + q2Complaints + q3Complaints;

    return {
      q1Complaints,
      q1Volume,
      q1Cdr,
      q2Complaints,
      q2Volume,
      q2Cdr,
      q3Complaints,
      q3Volume,
      q3Cdr,
      totalComplaintsYTD,
    };
  }, []);

  // Helper to render product icon
  const getProductIcon = (product: string) => {
    switch (product) {
      case 'Debit Card':
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      case 'IB/Mobile banking':
        return <Smartphone className="w-4 h-4 text-indigo-500" />;
      case 'Branch Banking':
        return <Building2 className="w-4 h-4 text-emerald-500" />;
      case 'RAAST':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'SMS Alerts':
        return <MessageSquare className="w-4 h-4 text-purple-500" />;
      default:
        return <Activity className="w-4 h-4 text-slate-500" />;
    }
  };

  // Helper to render trend status badge
  const renderTrendStatus = (status: ProductQuarterMetric['trendStatus']) => {
    switch (status) {
      case 'RED_UP':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-700/60 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>RED_UP (Surging)</span>
          </span>
        );
      case 'YELLOW_RIGHT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700/60 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <ArrowRight className="w-3.5 h-3.5" />
            <span>YELLOW_RIGHT (Watch)</span>
          </span>
        );
      case 'GREEN_DOWN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700/60 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>GREEN_DOWN (Improving)</span>
          </span>
        );
    }
  };

  // Chart data for CDR comparison
  const chartData = QUARTERLY_PRODUCT_METRICS.map((p) => ({
    name: p.product,
    Q1: p.q1.cdr,
    Q2: p.q2.cdr,
    Q3: p.q3.cdr,
    q1Vol: p.q1.volume,
    q2Vol: p.q2.volume,
    q3Vol: p.q3.volume,
    q1Comp: p.q1.complaints,
    q2Comp: p.q2.complaints,
    q3Comp: p.q3.complaints,
    status: p.trendStatus,
  }));

  // Export Matrix to Excel (.xlsx) using SheetJS
  const handleExportExcel = () => {
    const headers = [
      'Product',
      'Unit of Measurement',
      'Q1 Complaints',
      'Q1 Volume',
      'Q1 CDR (per 1,000 units)',
      'Q2 Complaints',
      'Q2 Volume',
      'Q2 CDR (per 1,000 units)',
      'Q3 Complaints',
      'Q3 Volume',
      'Q3 CDR (per 1,000 units)',
      'QoQ CDR Variance (Q2 to Q3)',
      'Trend Status',
    ];

    const rows = QUARTERLY_PRODUCT_METRICS.map((p) => {
      const variance = Number((p.q3.cdr - p.q2.cdr).toFixed(2));
      const varianceFormatted = variance > 0 ? `+${variance}` : `${variance}`;
      return [
        p.product,
        p.unitType,
        p.q1.complaints,
        p.q1.volume,
        p.q1.cdr,
        p.q2.complaints,
        p.q2.volume,
        p.q2.cdr,
        p.q3.complaints,
        p.q3.volume,
        p.q3.cdr,
        varianceFormatted,
        p.trendStatus,
      ];
    });

    const totalRow = [
      'Total / Weighted Portfolio',
      'Aggregated Base',
      totals.q1Complaints,
      totals.q1Volume,
      totals.q1Cdr,
      totals.q2Complaints,
      totals.q2Volume,
      totals.q2Cdr,
      totals.q3Complaints,
      totals.q3Volume,
      totals.q3Cdr,
      Number((totals.q3Cdr - totals.q2Cdr).toFixed(2)),
      'PORTFOLIO_WATCH',
    ];

    const sheetData = [
      ['Service Quality Governance - Product Quarterly Metrics (CDR Analysis)'],
      ['Report Generated:', new Date().toLocaleString()],
      ['Standardized Formula:', 'Complaint Density Ratio (CDR) = (Complaints / Operating Volume) * 1,000'],
      [],
      headers,
      ...rows,
      totalRow,
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Product Quarterly CDR');
    XLSX.writeFile(workbook, `Product_Quarterly_Metrics_CDR_per_1000_${new Date().toISOString().slice(0, 10)}.xlsx`);
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
              <span>Product Quarterly Metrics – CDR Analysis</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
              Quarterly Complaint Density Ratio (CDR = Complaints per 1,000 units) performance matrix and trend classification (Q1–Q3 2026).
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 font-semibold text-xs transition-colors shadow-2xs"
            >
              <span>Executive Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('monthly_analysis')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 font-semibold text-xs transition-colors shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Monthly Complaints Analysis</span>
            </button>

            <button
              onClick={() => onNavigate('sub_category_breakdown')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-semibold text-xs transition-colors shadow-2xs"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sub-Category Breakdown</span>
            </button>

            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 font-semibold text-xs transition-colors shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export Excel</span>
            </button>

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
        {/* KPI 1: Inbound Complaints YTD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>In-Scope Complaints (Q1–Q3)</span>
            <span className="p-1 rounded-md bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <Activity className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {totals.totalComplaintsYTD.toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              -43.0% vs Q1
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Q1: 7,750 ➔ Q2: 4,823 ➔ Q3: <strong>4,418</strong>
          </div>
        </div>

        {/* KPI 2: Portfolio Q3 CDR */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Portfolio Q3 CDR</span>
            <span className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
              <Layers className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
              {totals.q3Cdr}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
              Per 1,000 Units
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Down from <strong className="font-semibold text-slate-700 dark:text-slate-300">0.93</strong> in Q1
          </div>
        </div>

        {/* KPI 3: Top Performer (GREEN_DOWN) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Best Improvement (GREEN)</span>
            <span className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              RAAST
            </span>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
              -55.9% CDR
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            CDR plunged: <span className="font-mono font-bold">1.36 ➔ 0.60</span>
          </div>
        </div>

        {/* KPI 4: Watchlist Alerts (RED_UP) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Critical Watch (RED_UP)</span>
            <span className="p-1 rounded-md bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
              2 Products
            </span>
            <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/40 px-1.5 py-0.5 rounded">
              Q3 Rebound
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Debit Card (<strong>0.56</strong>) & Branch (<strong>0.35</strong>)
          </div>
        </div>

        {/* KPI 5: Operating Base Size */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Operating Volume (Q3)</span>
            <span className="p-1 rounded-md bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
              <Building2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              10.04M
            </span>
            <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
              +19.9% vs Q1
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Txns, Accounts & Subscribers
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. CORE INSTITUTIONAL DATA MATRIX TABLE                   */}
      {/* ========================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
        {/* Table Banner */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Quarterly Product Complaint Density Ratio (CDR) Performance Matrix</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Audited quarterly complaints, baseline volumes, and Complaint Density Ratio per 1,000 units with trend classifications.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-rose-600" />
              RED_UP: Rising Density
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              YELLOW_RIGHT: Stable Watch
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              GREEN_DOWN: Improving
            </span>
          </div>
        </div>

        {/* Scrollable Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                <th className="p-3.5 font-bold min-w-[190px]">Product</th>
                <th className="p-3.5 font-bold min-w-[160px]">Unit of Measurement</th>
                {/* Q1 Header */}
                <th className="p-3 font-bold text-center bg-slate-100 dark:bg-slate-800/90 border-l border-slate-200 dark:border-slate-700" colSpan={3}>
                  <div className="text-blue-800 dark:text-blue-300 font-extrabold">Q1 2026</div>
                  <div className="text-[10px] text-slate-500 font-normal grid grid-cols-3 gap-1 mt-0.5">
                    <span>Complaints</span>
                    <span>Volume</span>
                    <span className="font-bold text-blue-700 dark:text-blue-400">CDR (1K)</span>
                  </div>
                </th>
                {/* Q2 Header */}
                <th className="p-3 font-bold text-center bg-slate-50 dark:bg-slate-800/60 border-l border-slate-200 dark:border-slate-700" colSpan={3}>
                  <div className="text-slate-800 dark:text-slate-200 font-extrabold">Q2 2026</div>
                  <div className="text-[10px] text-slate-500 font-normal grid grid-cols-3 gap-1 mt-0.5">
                    <span>Complaints</span>
                    <span>Volume</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">CDR (1K)</span>
                  </div>
                </th>
                {/* Q3 Header */}
                <th className="p-3 font-bold text-center bg-blue-50/70 dark:bg-blue-950/40 border-l border-slate-200 dark:border-slate-700" colSpan={3}>
                  <div className="text-blue-900 dark:text-blue-200 font-extrabold">Q3 2026</div>
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 font-normal grid grid-cols-3 gap-1 mt-0.5">
                    <span>Complaints</span>
                    <span>Volume</span>
                    <span className="font-bold text-blue-900 dark:text-blue-200">CDR (1K)</span>
                  </div>
                </th>
                <th className="p-3.5 font-bold text-center min-w-[130px] border-l border-slate-200 dark:border-slate-700">
                  QoQ CDR Variance
                  <div className="text-[10px] font-normal text-slate-400">(Q2 ➔ Q3)</div>
                </th>
                <th className="p-3.5 font-bold text-center min-w-[170px] border-l border-slate-200 dark:border-slate-700">
                  Trend Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
              {QUARTERLY_PRODUCT_METRICS.map((row) => {
                const variance = Number((row.q3.cdr - row.q2.cdr).toFixed(2));
                const percentChange = Number((((row.q3.cdr - row.q2.cdr) / row.q2.cdr) * 100).toFixed(1));
                const isSelected = selectedProduct === row.product;

                return (
                  <tr
                    key={row.product}
                    onClick={() => setSelectedProduct(isSelected ? null : row.product)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/30'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {/* Product */}
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                        {getProductIcon(row.product)}
                      </div>
                      <span className="font-extrabold">{row.product}</span>
                    </td>

                    {/* Unit Type */}
                    <td className="p-3.5 text-slate-500 dark:text-slate-400 font-normal">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono">
                        {row.unitType}
                      </span>
                    </td>

                    {/* Q1 Values */}
                    <td className="p-2.5 text-center font-mono text-slate-600 dark:text-slate-400 border-l border-slate-200 dark:border-slate-700">
                      {row.q1.complaints.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-center font-mono text-slate-500 dark:text-slate-400">
                      {row.q1.volume.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                        {row.q1.cdr.toFixed(2)}
                      </span>
                    </td>

                    {/* Q2 Values */}
                    <td className="p-2.5 text-center font-mono text-slate-600 dark:text-slate-400 border-l border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/30">
                      {row.q2.complaints.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-center font-mono text-slate-500 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-800/30">
                      {row.q2.volume.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-center font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-50/40 dark:bg-slate-800/30">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                        {row.q2.cdr.toFixed(2)}
                      </span>
                    </td>

                    {/* Q3 Values */}
                    <td className="p-2.5 text-center font-mono font-semibold text-blue-900 dark:text-blue-300 border-l border-slate-200 dark:border-slate-700 bg-blue-50/30 dark:bg-blue-950/20">
                      {row.q3.complaints.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-center font-mono text-slate-600 dark:text-slate-300 bg-blue-50/30 dark:bg-blue-950/20">
                      {row.q3.volume.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-center font-mono font-black text-blue-900 dark:text-blue-100 bg-blue-50/30 dark:bg-blue-950/20">
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-700">
                        {row.q3.cdr.toFixed(2)}
                      </span>
                    </td>

                    {/* QoQ Variance */}
                    <td className="p-2.5 text-center font-mono border-l border-slate-200 dark:border-slate-700">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold ${
                          variance > 0
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                            : variance < 0
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {variance > 0 ? `+${variance}` : variance} ({percentChange > 0 ? `+${percentChange}%` : `${percentChange}%`})
                      </span>
                    </td>

                    {/* Trend Status */}
                    <td className="p-3 text-center border-l border-slate-200 dark:border-slate-700">
                      {renderTrendStatus(row.trendStatus)}
                    </td>
                  </tr>
                );
              })}

              {/* Total Portfolio Summary Row */}
              <tr className="bg-slate-100/90 dark:bg-slate-800/90 font-extrabold border-t-2 border-slate-300 dark:border-slate-700">
                <td className="p-3.5 text-slate-900 dark:text-white">
                  Total / Weighted Portfolio
                </td>
                <td className="p-3.5 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  Aggregated Base
                </td>

                {/* Q1 Total */}
                <td className="p-2.5 text-center font-mono text-slate-900 dark:text-white border-l border-slate-200 dark:border-slate-700">
                  {totals.q1Complaints.toLocaleString()}
                </td>
                <td className="p-2.5 text-center font-mono text-slate-600 dark:text-slate-300">
                  {totals.q1Volume.toLocaleString()}
                </td>
                <td className="p-2.5 text-center font-mono text-blue-700 dark:text-blue-400 font-black">
                  {totals.q1Cdr}
                </td>

                {/* Q2 Total */}
                <td className="p-2.5 text-center font-mono text-slate-900 dark:text-white border-l border-slate-200 dark:border-slate-700">
                  {totals.q2Complaints.toLocaleString()}
                </td>
                <td className="p-2.5 text-center font-mono text-slate-600 dark:text-slate-300">
                  {totals.q2Volume.toLocaleString()}
                </td>
                <td className="p-2.5 text-center font-mono text-slate-900 dark:text-white font-black">
                  {totals.q2Cdr}
                </td>

                {/* Q3 Total */}
                <td className="p-2.5 text-center font-mono text-blue-900 dark:text-blue-200 border-l border-slate-200 dark:border-slate-700 bg-blue-100/40 dark:bg-blue-950/40">
                  {totals.q3Complaints.toLocaleString()}
                </td>
                <td className="p-2.5 text-center font-mono text-slate-800 dark:text-slate-200 bg-blue-100/40 dark:bg-blue-950/40">
                  {totals.q3Volume.toLocaleString()}
                </td>
                <td className="p-2.5 text-center font-mono text-blue-900 dark:text-blue-100 font-black bg-blue-100/40 dark:bg-blue-950/40 text-sm">
                  {totals.q3Cdr}
                </td>

                {/* QoQ Total Variance */}
                <td className="p-2.5 text-center font-mono border-l border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400">
                  {totals.q3Cdr - totals.q2Cdr > 0 ? `+${(totals.q3Cdr - totals.q2Cdr).toFixed(2)}` : (totals.q3Cdr - totals.q2Cdr).toFixed(2)}
                </td>

                {/* Portfolio Status */}
                <td className="p-3 text-center border-l border-slate-200 dark:border-slate-700">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                    Portfolio CDR: {totals.q3Cdr} / 1K
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. COMPARISON CHARTS ROW                                  */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: CDR Evolution by Product across Q1, Q2, Q3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>Product CDR Comparison (Q1 vs Q2 vs Q3 2026)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tracking complaints per 1,000 units. Notice Debit Card rise (0.45 ➔ 0.56) vs RAAST drop (1.36 ➔ 0.60).
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-slate-500 font-semibold">
                <span className="w-2.5 h-2.5 rounded-xs bg-slate-400 inline-block" />
                Q1
              </span>
              <span className="flex items-center gap-1 text-blue-500 font-semibold">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-400 inline-block" />
                Q2
              </span>
              <span className="flex items-center gap-1 text-indigo-700 dark:text-indigo-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600 inline-block" />
                Q3
              </span>
            </div>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700">
                          <div className="font-extrabold text-blue-400">{label}</div>
                          <div className="text-[10px] text-slate-400 mb-1">CDR per 1,000 Units:</div>
                          <div className="flex items-center justify-between gap-4 text-slate-300">
                            <span>Q1 CDR:</span>
                            <span className="font-mono font-bold">{payload[0]?.value}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-blue-300">
                            <span>Q2 CDR:</span>
                            <span className="font-mono font-bold">{payload[1]?.value}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-indigo-300">
                            <span>Q3 CDR:</span>
                            <span className="font-mono font-bold text-white">{payload[2]?.value}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="Q1" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Q1 CDR" maxBarSize={16} />
                <Bar dataKey="Q2" fill="#60a5fa" radius={[4, 4, 0, 0]} name="Q2 CDR" maxBarSize={16} />
                <Bar dataKey="Q3" fill="#4338ca" radius={[4, 4, 0, 0]} name="Q3 CDR" maxBarSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Product Complaint Share & Density Profile */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>Q3 Complaint Volume vs. CDR Benchmark</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Absolute complaint load in Q3 alongside Complaint Density Ratio (per 1,000 units).
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
              Total Q3 Complaints: 4,418
            </div>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 15, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} interval={0} angle={-15} textAnchor="end" />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700">
                          <div className="font-extrabold text-white">{label}</div>
                          <div className="flex items-center justify-between gap-4 text-blue-300">
                            <span>Q3 Complaints:</span>
                            <span className="font-mono font-bold">{payload[0]?.value}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-amber-400">
                            <span>Q3 CDR (per 1K):</span>
                            <span className="font-mono font-bold">{payload[1]?.value}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar yAxisId="left" dataKey="q3Comp" fill="#2563eb" radius={[4, 4, 0, 0]} name="Q3 Complaints" maxBarSize={24} />
                <Line yAxisId="right" type="monotone" dataKey="Q3" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} name="Q3 CDR (per 1K)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. PRODUCT GOVERNANCE DRILL-DOWN CARDS                    */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Debit Card */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Debit Card</h4>
                <div className="text-[10px] text-slate-400 font-mono">2,218,898 txns</div>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-300">
              RED_UP (0.56 CDR)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Complaints surged from 996 (Q2) to <strong>1,236 (Q3)</strong> with CDR climbing from 0.45 to 0.56 (+24.4%). Primary root causes: POS timeouts, card dip read errors, and international ATM rollback delays.
          </p>
          <div className="text-[10px] text-rose-700 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/20 p-2 rounded-lg border border-rose-200 dark:border-rose-900/40">
            Action: Mandate daily 1Link switch reconciliation and firmware patches across high-traffic branch ATMs.
          </div>
        </div>

        {/* Card 2: IB / Mobile Banking */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">IB / Mobile Banking</h4>
                <div className="text-[10px] text-slate-400 font-mono">2,789,714 txns</div>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300">
              YELLOW_RIGHT (0.34 CDR)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Volume expanded significantly from 2.51M to 2.78M. Complaints grew moderately from 794 to 937, maintaining a relatively stable density ratio (0.32 ➔ 0.34).
          </p>
          <div className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/20 p-2 rounded-lg border border-amber-200 dark:border-amber-900/40">
            Action: Biometric login enhancement and in-app self-service password reset workflow optimization.
          </div>
        </div>

        {/* Card 3: Branch Banking */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Branch Banking</h4>
                <div className="text-[10px] text-slate-400 font-mono">1,854,542 deposit accts</div>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-300">
              RED_UP (0.35 CDR)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Complaints rose from 439 to <strong>648</strong> (+47.6%), pushing CDR from 0.25 to 0.35 (+40.0%). Concentrated in turnaround time for account reactivation and cheque clearance hold queries.
          </p>
          <div className="text-[10px] text-rose-700 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/20 p-2 rounded-lg border border-rose-200 dark:border-rose-900/40">
            Action: Branch Operations review meeting and fast-track dormancy reactivation via mobile KYC.
          </div>
        </div>

        {/* Card 4: RAAST (Instant Payments) */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/40 text-amber-600">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">RAAST</h4>
                <div className="text-[10px] text-slate-400 font-mono">2,402,230 txns</div>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300">
              GREEN_DOWN (0.60 CDR)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Exceptional operational turnaround: CDR cut by more than half from 1.36 in Q1 to <strong>0.60 in Q3</strong> despite volume expanding to 2.4M transactions. Gateway stabilization achieved.
          </p>
          <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded-lg border border-emerald-200 dark:border-emerald-900/40">
            Recognition: Commended for infrastructure upgrade and automated reversal settlement mechanism.
          </div>
        </div>

        {/* Card 5: SMS Alerts */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/40 text-purple-600">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">SMS Alerts</h4>
                <div className="text-[10px] text-slate-400 font-mono">770,973 subscribers</div>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300">
              YELLOW_RIGHT (0.19 CDR)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Subscribers steadily grew to 770K with complaint volume remaining low (149 complaints, 0.19 CDR). Minor issues related to telco DND filters and roaming delivery latency.
          </p>
          <div className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/20 p-2 rounded-lg border border-amber-200 dark:border-amber-900/40">
            Action: Secondary telco SMS gateway redundancy and fallback WhatsApp push notification pilot.
          </div>
        </div>

        {/* Card 6: Regulatory Standards & Formula Callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white border border-slate-800 shadow-2xs space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>CDR Governance Standard</span>
            </div>
            <h4 className="text-xs font-extrabold text-white mt-1">Regulatory Calculation Formula</h4>
            <div className="mt-2 p-2.5 rounded-lg bg-blue-950/90 border border-blue-800 text-xs font-mono text-blue-200 font-bold">
              CDR = (Complaints / Base Volume) × 1,000
            </div>
            <p className="text-[10px] text-slate-300 mt-2 leading-relaxed">
              Standardized on a per 1,000 units baseline (Transactions, Accounts, or Subscribers) under central bank consumer protection standards to ensure defect density is evaluated proportionally against digital volume expansion.
            </p>
          </div>
          <div className="text-[10px] text-blue-300 font-semibold pt-1 border-t border-slate-800 flex items-center justify-between">
            <span>Audit Frequency: Quarterly</span>
            <span className="text-emerald-400">ISO 10002 Aligned</span>
          </div>
        </div>
      </div>
    </div>
  );
};
