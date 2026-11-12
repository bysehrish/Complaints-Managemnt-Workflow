import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Smartphone,
  CreditCard,
  Building2,
  MessageSquare,
  Zap,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  ShieldAlert,
  ShieldCheck,
  Calendar,
  Layers,
  Activity,
  CheckCircle2,
  BarChart3,
  Flame,
  Minus,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import * as XLSX from 'xlsx';
import {
  COMPLAINTS_TRACKING_SUMMARY,
  ACCOUNT_STATIC_CHANGES,
  IB_MOBILE_SUB_CATEGORIES,
  DEBIT_CARD_SUB_CATEGORIES,
  BRANCH_BANKING_SUB_CATEGORIES,
  SMS_ALERTS_SUB_CATEGORIES,
  RAAST_SUB_CATEGORIES,
  ALL_PRODUCT_SUB_CATEGORY_REPORTS,
  SubCategoryGrievance,
  ProductSubCategoryReport
} from '../types/subCategoryMetrics';
import { PortalPage } from '../types/portal';

interface SubCategoryBreakdownPageProps {
  onNavigate: (page: PortalPage) => void;
}

export const SubCategoryBreakdownPage: React.FC<SubCategoryBreakdownPageProps> = ({
  onNavigate,
}) => {
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<'all' | string>('all');
  const [highlightDriversOnly, setHighlightDriversOnly] = useState(false);
  const [activeChartChannel, setActiveChartChannel] = useState<string>('ib_mobile');

  // Helper for QoQ Delta calculation (Q2 -> Q3)
  const getQoQDelta = (q2: number, q3: number) => {
    const diff = q3 - q2;
    const pct = q2 === 0 ? (q3 > 0 ? 100 : 0) : Number(((diff / q2) * 100).toFixed(1));
    return { diff, pct };
  };

  // Helper for Product Icon
  const getProductIcon = (id: string) => {
    switch (id) {
      case 'ib_mobile':
        return <Smartphone className="w-4 h-4 text-indigo-500" />;
      case 'debit_card':
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      case 'branch_banking':
        return <Building2 className="w-4 h-4 text-emerald-500" />;
      case 'sms_alerts':
        return <MessageSquare className="w-4 h-4 text-amber-500" />;
      case 'raast':
        return <Zap className="w-4 h-4 text-cyan-500" />;
      default:
        return <Layers className="w-4 h-4 text-slate-500" />;
    }
  };

  // Helper for Product Theme Colors
  const getProductColorConfig = (id: string) => {
    switch (id) {
      case 'ib_mobile':
        return {
          bgBadge: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
          accent: 'text-indigo-600 dark:text-indigo-400',
          barColor: '#4f46e5',
          q2Color: '#818cf8',
          q1Color: '#c7d2fe',
        };
      case 'debit_card':
        return {
          bgBadge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
          accent: 'text-blue-600 dark:text-blue-400',
          barColor: '#2563eb',
          q2Color: '#60a5fa',
          q1Color: '#bfdbfe',
        };
      case 'branch_banking':
        return {
          bgBadge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          accent: 'text-emerald-600 dark:text-emerald-400',
          barColor: '#059669',
          q2Color: '#34d399',
          q1Color: '#a7f3d0',
        };
      case 'sms_alerts':
        return {
          bgBadge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          accent: 'text-amber-600 dark:text-amber-400',
          barColor: '#d97706',
          q2Color: '#fbbf24',
          q1Color: '#fde68a',
        };
      case 'raast':
        return {
          bgBadge: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
          accent: 'text-cyan-600 dark:text-cyan-400',
          barColor: '#0891b2',
          q2Color: '#22d3ee',
          q1Color: '#a5f3fc',
        };
      default:
        return {
          bgBadge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          accent: 'text-blue-600 dark:text-blue-400',
          barColor: '#3b82f6',
          q2Color: '#93c5fd',
          q1Color: '#e2e8f0',
        };
    }
  };

  // Comprehensive Multi-Sheet Excel Export
  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();

    // 1. Complaints Tracking Summary Sheet
    const trackingRows = [
      ['SERVICE QUALITY GOVERNANCE'],
      ['Top Product-Wise Complaints & Sub-Category Breakdown - Master Tracking Summary'],
      ['Exported on:', new Date().toLocaleString()],
      [],
      ['Tracking Metric', 'Q1 2026', 'Q2 2026', 'Q3 2026', 'YTD Total'],
      ...COMPLAINTS_TRACKING_SUMMARY.map((row) => [
        row.metric,
        row.q1,
        row.q2,
        row.q3,
        row.ytdTotal || '',
      ]),
    ];
    const trackingSheet = XLSX.utils.aoa_to_sheet(trackingRows);
    XLSX.utils.book_append_sheet(workbook, trackingSheet, 'Tracking Summary');

    // 2. Account Static Changes Sheet
    const staticRows = [
      ['SERVICE QUALITY GOVERNANCE'],
      ['Account Static Changes - Quarterly Friction Variance'],
      ['Exported on:', new Date().toLocaleString()],
      [],
      ['Quarter', 'Variance Rate', 'Governance Rating'],
      ...ACCOUNT_STATIC_CHANGES.map((row) => [
        row.quarter,
        row.varianceRate,
        `${row.statusColor} Friction (Operational Risk)`,
      ]),
    ];
    const staticSheet = XLSX.utils.aoa_to_sheet(staticRows);
    XLSX.utils.book_append_sheet(workbook, staticSheet, 'Static Changes');

    // 3. Consolidated Master Sheet for all 5 Categories
    const masterRows: any[][] = [
      ['SERVICE QUALITY GOVERNANCE'],
      ['Master 5-Channel Product & Sub-Category Breakdown (Q1–Q3 2026)'],
      ['Report Generated:', new Date().toLocaleString()],
      [],
      [
        'Product Category',
        'Channel Domain',
        'Sub-Category Grievance',
        'Key Driver (*)',
        'Q1 Count',
        'Q1 Share %',
        'Q2 Count',
        'Q2 Share %',
        'Q3 Count',
        'Q3 Share %',
        'YTD Total',
        'QoQ Variance (Q2 to Q3)',
        'QoQ % Delta',
      ],
    ];

    ALL_PRODUCT_SUB_CATEGORY_REPORTS.forEach((report) => {
      report.subCategories.forEach((sc) => {
        const delta = getQoQDelta(sc.q2, sc.q3);
        const q1Share = report.quarterTotals.q1 > 0 ? ((sc.q1 / report.quarterTotals.q1) * 100).toFixed(1) + '%' : '0%';
        const q2Share = report.quarterTotals.q2 > 0 ? ((sc.q2 / report.quarterTotals.q2) * 100).toFixed(1) + '%' : '0%';
        const q3Share = report.quarterTotals.q3 > 0 ? ((sc.q3 / report.quarterTotals.q3) * 100).toFixed(1) + '%' : '0%';
        masterRows.push([
          report.product,
          report.channel,
          sc.issue + (sc.isTopDriver ? ' *' : ''),
          sc.isTopDriver ? 'YES (*)' : 'NO',
          sc.q1,
          q1Share,
          sc.q2,
          q2Share,
          sc.q3,
          q3Share,
          sc.q1 + sc.q2 + sc.q3,
          delta.diff,
          `${delta.pct}%`,
        ]);
      });
      // Subtotal row
      const subtotalDelta = getQoQDelta(report.quarterTotals.q2, report.quarterTotals.q3);
      masterRows.push([
        `${report.product} TOTAL`,
        report.channel,
        'TOTAL',
        '',
        report.quarterTotals.q1,
        '100%',
        report.quarterTotals.q2,
        '100%',
        report.quarterTotals.q3,
        '100%',
        report.quarterTotals.ytd,
        subtotalDelta.diff,
        `${subtotalDelta.pct}%`,
      ]);
      masterRows.push([]); // blank separator
    });

    const masterSheet = XLSX.utils.aoa_to_sheet(masterRows);
    XLSX.utils.book_append_sheet(workbook, masterSheet, 'All 5 Categories Master');

    // 4. Individual Sheets for each of the 5 Categories
    ALL_PRODUCT_SUB_CATEGORY_REPORTS.forEach((report) => {
      const sheetData = [
        ['SERVICE QUALITY GOVERNANCE'],
        [`${report.product} (${report.channel}) - Granular Sub-Category Grievance Breakdown`],
        [`Quarterly Totals: Q1 = ${report.quarterTotals.q1.toLocaleString()} | Q2 = ${report.quarterTotals.q2.toLocaleString()} | Q3 = ${report.quarterTotals.q3.toLocaleString()} | YTD = ${report.quarterTotals.ytd.toLocaleString()}`],
        [],
        ['Sub-Category Issue', 'Priority Driver (*)', 'Q1 Count', 'Q1 Share %', 'Q2 Count', 'Q2 Share %', 'Q3 Count', 'Q3 Share %', 'YTD Total', 'QoQ Variance', 'QoQ % Delta'],
        ...report.subCategories.map((sc) => {
          const delta = getQoQDelta(sc.q2, sc.q3);
          const q1Share = report.quarterTotals.q1 > 0 ? ((sc.q1 / report.quarterTotals.q1) * 100).toFixed(1) + '%' : '0%';
          const q2Share = report.quarterTotals.q2 > 0 ? ((sc.q2 / report.quarterTotals.q2) * 100).toFixed(1) + '%' : '0%';
          const q3Share = report.quarterTotals.q3 > 0 ? ((sc.q3 / report.quarterTotals.q3) * 100).toFixed(1) + '%' : '0%';
          return [
            sc.issue + (sc.isTopDriver ? ' *' : ''),
            sc.isTopDriver ? 'YES (*)' : 'NO',
            sc.q1,
            q1Share,
            sc.q2,
            q2Share,
            sc.q3,
            q3Share,
            sc.q1 + sc.q2 + sc.q3,
            delta.diff,
            `${delta.pct}%`,
          ];
        }),
        [
          'Grand Total',
          '',
          report.quarterTotals.q1,
          '100%',
          report.quarterTotals.q2,
          '100%',
          report.quarterTotals.q3,
          '100%',
          report.quarterTotals.ytd,
          report.quarterTotals.q3 - report.quarterTotals.q2,
          `${getQoQDelta(report.quarterTotals.q2, report.quarterTotals.q3).pct}%`,
        ],
      ];
      const sheet = XLSX.utils.aoa_to_sheet(sheetData);
      // Clean sheet name: max 31 chars
      const safeSheetName = report.product.substring(0, 28);
      XLSX.utils.book_append_sheet(workbook, sheet, safeSheetName);
    });

    // Save Workbook
    XLSX.writeFile(
      workbook,
      `Top_Product_Wise_Complaints_All_5_Categories_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const handlePrint = () => {
    window.print();
  };

  // Filtered reports list for display
  const displayedReports = useMemo(() => {
    if (selectedChannelFilter === 'all') return ALL_PRODUCT_SUB_CATEGORY_REPORTS;
    return ALL_PRODUCT_SUB_CATEGORY_REPORTS.filter((r) => r.id === selectedChannelFilter);
  }, [selectedChannelFilter]);

  // Active chart report data
  const currentChartReport = useMemo(() => {
    return (
      ALL_PRODUCT_SUB_CATEGORY_REPORTS.find((r) => r.id === activeChartChannel) ||
      ALL_PRODUCT_SUB_CATEGORY_REPORTS[0]
    );
  }, [activeChartChannel]);

  const chartData = useMemo(() => {
    return currentChartReport.subCategories.map((c) => ({
      name: c.issue.length > 20 ? c.issue.substring(0, 18) + '...' : c.issue,
      fullName: c.issue,
      Q1: c.q1,
      Q2: c.q2,
      Q3: c.q3,
      isTopDriver: c.isTopDriver,
    }));
  }, [currentChartReport]);

  const activeColorConfig = getProductColorConfig(currentChartReport.id);

  // Render a detailed category breakdown table
  const renderCategoryTable = (report: ProductSubCategoryReport) => {
    const colorConfig = getProductColorConfig(report.id);
    const subCategories = highlightDriversOnly
      ? report.subCategories.filter((sc) => sc.isTopDriver)
      : report.subCategories;

    const totalDelta = getQoQDelta(report.quarterTotals.q2, report.quarterTotals.q3);

    return (
      <div
        key={report.id}
        id={`category-${report.id}`}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col justify-between"
      >
        <div>
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 mb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-xs">
                {getProductIcon(report.id)}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                  <span>{report.product}</span>
                  <span className={`text-[10px] font-semibold font-mono px-2 py-0.5 rounded border ${colorConfig.bgBadge}`}>
                    {report.channel}
                  </span>
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono mt-0.5 flex-wrap">
                  <span>
                    Q1: <strong className="text-slate-800 dark:text-slate-200">{report.quarterTotals.q1.toLocaleString()}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Q2: <strong className="text-slate-800 dark:text-slate-200">{report.quarterTotals.q2.toLocaleString()}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Q3: <strong className={`font-bold ${colorConfig.accent}`}>{report.quarterTotals.q3.toLocaleString()}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    YTD: <strong className="text-blue-600 font-bold">{report.quarterTotals.ytd.toLocaleString()}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Chart View Selector */}
            <button
              onClick={() => setActiveChartChannel(report.id)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1.5 self-start sm:self-auto ${
                activeChartChannel === report.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-2xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              <span>{activeChartChannel === report.id ? 'Viewing Chart' : 'Inspect Chart'}</span>
            </button>
          </div>

          {/* Sub-Category Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                  <th className="py-2.5 text-left font-bold text-slate-700 dark:text-slate-300">
                    Sub-Category Grievance
                  </th>
                  <th className="py-2.5 text-right font-bold text-slate-700 dark:text-slate-300">Q1 Count (Share)</th>
                  <th className="py-2.5 text-right font-bold text-slate-700 dark:text-slate-300">Q2 Count (Share)</th>
                  <th className="py-2.5 text-right font-bold text-slate-700 dark:text-slate-300">Q3 Count (Share)</th>
                  <th className="py-2.5 text-right font-bold text-slate-700 dark:text-slate-300">QoQ Δ</th>
                  <th className="py-2.5 text-right font-bold text-slate-700 dark:text-slate-300">Q3 Distribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {subCategories.map((item) => {
                  const delta = getQoQDelta(item.q2, item.q3);
                  const q1Pct = report.quarterTotals.q1 > 0 ? Math.round((item.q1 / report.quarterTotals.q1) * 100) : 0;
                  const q2Pct = report.quarterTotals.q2 > 0 ? Math.round((item.q2 / report.quarterTotals.q2) * 100) : 0;
                  const q3Pct = report.quarterTotals.q3 > 0 ? Math.round((item.q3 / report.quarterTotals.q3) * 100) : 0;

                  return (
                    <tr
                      key={item.issue}
                      className={`transition-colors ${
                        item.isTopDriver
                          ? 'bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-50/80 dark:hover:bg-amber-950/40'
                          : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Sub-Category Title */}
                      <td className="py-2.5 text-left font-sans text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-1.5">
                          {item.isTopDriver ? (
                            <span
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shrink-0"
                              title="Key Priority Driver / Top Grievance Contributor"
                            >
                              <Flame className="w-3 h-3 text-amber-500" />
                              <span>* Driver</span>
                            </span>
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0 ml-1" />
                          )}
                          <span className="font-semibold">{item.issue}</span>
                        </div>
                      </td>

                      {/* Q1 Count + Share */}
                      <td className="py-2.5 text-right font-semibold text-slate-700 dark:text-slate-300">
                        <span>{item.q1.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400 font-sans ml-1">({q1Pct}%)</span>
                        {item.isTopDriver && <span className="text-amber-500 ml-0.5">*</span>}
                      </td>

                      {/* Q2 Count + Share */}
                      <td className="py-2.5 text-right font-semibold text-slate-700 dark:text-slate-300">
                        <span>{item.q2.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400 font-sans ml-1">({q2Pct}%)</span>
                        {item.isTopDriver && <span className="text-amber-500 ml-0.5">*</span>}
                      </td>

                      {/* Q3 Count + Share */}
                      <td className="py-2.5 text-right font-bold text-slate-900 dark:text-white">
                        <span>{item.q3.toLocaleString()}</span>
                        <span className="text-[10px] text-indigo-500 font-sans ml-1 font-bold">({q3Pct}%)</span>
                        {item.isTopDriver && <span className="text-amber-500 ml-0.5">*</span>}
                      </td>

                      {/* QoQ Delta */}
                      <td className="py-2.5 text-right text-[11px]">
                        {delta.diff === 0 ? (
                          <span className="text-slate-400 flex items-center justify-end gap-0.5">
                            <Minus className="w-3 h-3" /> 0%
                          </span>
                        ) : delta.diff > 0 ? (
                          <span className="text-rose-600 font-bold flex items-center justify-end gap-0.5">
                            <ArrowUpRight className="w-3.5 h-3.5" /> +{delta.diff} ({delta.pct}%)
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                            <ArrowDownRight className="w-3.5 h-3.5" /> {delta.diff} ({delta.pct}%)
                          </span>
                        )}
                      </td>

                      {/* Q3 Share Visual Bar */}
                      <td className="py-2.5 text-right font-bold">
                        <div className="flex items-center justify-end gap-1.5">
                          <div className="w-14 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${Math.min(100, q3Pct * 2)}%`,
                                backgroundColor: colorConfig.barColor,
                              }}
                            />
                          </div>
                          <span className={colorConfig.accent}>{q3Pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300 dark:border-slate-700 font-bold bg-slate-50 dark:bg-slate-800/60 font-mono">
                  <td className="py-2.5 text-left font-sans text-slate-900 dark:text-white">
                    {report.product} Total Grievances
                  </td>
                  <td className="py-2.5 text-right text-slate-900 dark:text-white">
                    {report.quarterTotals.q1.toLocaleString()} <span className="text-[10px] font-sans text-slate-500">(100%)</span>
                  </td>
                  <td className="py-2.5 text-right text-slate-900 dark:text-white">
                    {report.quarterTotals.q2.toLocaleString()} <span className="text-[10px] font-sans text-slate-500">(100%)</span>
                  </td>
                  <td className={`py-2.5 text-right font-bold ${colorConfig.accent}`}>
                    {report.quarterTotals.q3.toLocaleString()} <span className="text-[10px] font-sans text-slate-500">(100%)</span>
                  </td>
                  <td className="py-2.5 text-right font-bold">
                    {totalDelta.diff > 0 ? (
                      <span className="text-rose-600 flex items-center justify-end gap-0.5">
                        <ArrowUpRight className="w-3.5 h-3.5" /> +{totalDelta.diff} ({totalDelta.pct}%)
                      </span>
                    ) : totalDelta.diff < 0 ? (
                      <span className="text-emerald-600 flex items-center justify-end gap-0.5">
                        <ArrowDownRight className="w-3.5 h-3.5" /> {totalDelta.diff} ({totalDelta.pct}%)
                      </span>
                    ) : (
                      <span className="text-slate-400">0%</span>
                    )}
                  </td>
                  <td className={`py-2.5 text-right font-bold ${colorConfig.accent}`}>100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Card Footer Key Observation */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between flex-wrap gap-2">
          <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>
              {report.subCategories.filter((s) => s.isTopDriver).length} Key Priority Driver(s) tagged (*).
            </span>
          </span>
          <span className="font-mono text-[10px] text-slate-400">
            YTD Cumulative: {report.quarterTotals.ytd.toLocaleString()} Cases
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 print:p-0">
      {/* ========================================================= */}
      {/* 1. VIEW HEADER & GOVERNANCE TITLE                         */}
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
              <span>Top Product-Wise Complaints & Sub-Category Breakdown</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
              Granular Q1, Q2, and Q3 grievance distribution across all core banking channels. Comprehensive breakdown across Digital Banking, Card Operations, Branch Network, SMS Alerts, and RAAST.
            </p>
          </div>

          {/* Controls (Right) */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
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
              onClick={() => onNavigate('quarterly_metrics')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 font-semibold text-xs transition-colors shadow-2xs"
            >
              <Activity className="w-3.5 h-3.5 text-indigo-600" />
              <span>Product Quarterly Metrics</span>
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
      {/* 2. HIGH-LEVEL SUMMARY GRID                                */}
      {/*    - Left: Complaints Tracking Summary (Q1 - Q3)          */}
      {/*    - Right: Account Static Changes                        */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Complaints Tracking Summary (Q1 – Q3) - 7 cols */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Complaints Tracking Summary (Q1 – Q3)
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Track inflow, resolution, and carry-forward inventory.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold">
                YTD 2026 Audit
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                    <th className="py-2.5 text-left font-bold text-slate-700 dark:text-slate-300">Tracking Metric</th>
                    <th className="py-2.5 text-right font-bold text-slate-700 dark:text-slate-300">Q1</th>
                    <th className="py-2.5 text-right font-bold text-slate-700 dark:text-slate-300">Q2</th>
                    <th className="py-2.5 text-right font-bold text-slate-700 dark:text-slate-300">Q3</th>
                    <th className="py-2.5 text-right font-bold text-blue-600 dark:text-blue-400">YTD Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                  {COMPLAINTS_TRACKING_SUMMARY.map((row) => (
                    <tr
                      key={row.metric}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-2.5 text-left font-sans font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        {row.metric === 'Complaints Received' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        )}
                        {row.metric === 'Complaints Resolved' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        )}
                        {row.metric === 'Carry Forward' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        )}
                        {row.metric === 'Brought Forward' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        )}
                        <span>{row.metric}</span>
                      </td>
                      <td className="py-2.5 text-right font-bold text-slate-800 dark:text-slate-200">
                        {row.q1.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right font-bold text-slate-800 dark:text-slate-200">
                        {row.q2.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right font-bold text-slate-800 dark:text-slate-200">
                        {row.q3.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right font-bold text-blue-700 dark:text-blue-300">
                        {typeof row.ytdTotal === 'number'
                          ? row.ytdTotal.toLocaleString()
                          : row.ytdTotal || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Resolution Velocity</span>
              <span className="text-xs font-extrabold text-emerald-600 font-mono">100.2%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Q3 Carry Forward</span>
              <span className="text-xs font-extrabold text-emerald-600 font-mono flex items-center justify-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5" /> 150 Cases (-20.6%)
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">YTD Disposed</span>
              <span className="text-xs font-extrabold text-blue-600 font-mono">17,007</span>
            </div>
          </div>
        </div>

        {/* Account Static Changes - 5 cols */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Account Static Changes
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Audit quarterly friction rates.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-600" /> Red Alert
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                    <th className="py-2.5 text-left font-bold text-slate-700 dark:text-slate-300">Quarter</th>
                    <th className="py-2.5 text-center font-bold text-slate-700 dark:text-slate-300">Variance Rate</th>
                    <th className="py-2.5 text-right font-bold text-slate-700 dark:text-slate-300">Friction Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                  {ACCOUNT_STATIC_CHANGES.map((item) => (
                    <tr
                      key={item.quarter}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-2.5 text-left font-sans font-bold text-slate-800 dark:text-slate-200">
                        {item.quarter} 2026
                      </td>
                      <td className="py-2.5 text-center font-bold text-rose-600 dark:text-rose-400">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          {item.varianceRate}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-sans">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white shadow-2xs">
                          {item.statusColor} Friction
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-900 dark:text-rose-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <span className="font-bold">Friction Bottleneck:</span> Persistent ~49% variance rate across Q1–Q3 underscores critical operational friction in account KYC & static profile changes, mandating straight-through-processing (STP) digitization.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. CHANNEL FILTER & TOP DRIVER TOOLBAR                    */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            <span>Channel Focus:</span>
          </span>
          <button
            onClick={() => setSelectedChannelFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              selectedChannelFilter === 'all'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All 5 Categories
          </button>
          {ALL_PRODUCT_SUB_CATEGORY_REPORTS.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedChannelFilter(r.id)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedChannelFilter === r.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {getProductIcon(r.id)}
              <span>{r.product}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setHighlightDriversOnly(!highlightDriversOnly)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
              highlightDriversOnly
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{highlightDriversOnly ? 'Showing Key Priority Drivers (*)' : 'Highlight Key Drivers (*)'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. DETAILED SUB-CATEGORY BREAKDOWN (ALL 5 CATEGORIES)      */}
      {/* ========================================================= */}

      {/* Row 1: Category 1 (IB / Mobile) & Category 2 (Debit Card) */}
      {(selectedChannelFilter === 'all' || selectedChannelFilter === 'ib_mobile' || selectedChannelFilter === 'debit_card') && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {(selectedChannelFilter === 'all' || selectedChannelFilter === 'ib_mobile') &&
            renderCategoryTable(ALL_PRODUCT_SUB_CATEGORY_REPORTS[0])}
          {(selectedChannelFilter === 'all' || selectedChannelFilter === 'debit_card') &&
            renderCategoryTable(ALL_PRODUCT_SUB_CATEGORY_REPORTS[1])}
        </div>
      )}

      {/* Row 2: Category 3 (Branch Banking Complaints - 13 Sub-Categories) */}
      {(selectedChannelFilter === 'all' || selectedChannelFilter === 'branch_banking') && (
        <div className="grid grid-cols-1 gap-6">
          {renderCategoryTable(ALL_PRODUCT_SUB_CATEGORY_REPORTS[2])}
        </div>
      )}

      {/* Row 3: Category 4 (SMS Alerts) & Category 5 (RAAST) */}
      {(selectedChannelFilter === 'all' || selectedChannelFilter === 'sms_alerts' || selectedChannelFilter === 'raast') && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {(selectedChannelFilter === 'all' || selectedChannelFilter === 'sms_alerts') &&
            renderCategoryTable(ALL_PRODUCT_SUB_CATEGORY_REPORTS[3])}
          {(selectedChannelFilter === 'all' || selectedChannelFilter === 'raast') &&
            renderCategoryTable(ALL_PRODUCT_SUB_CATEGORY_REPORTS[4])}
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. INTERACTIVE QUARTERLY TRAJECTORY VISUALIZATION         */}
      {/* ========================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Quarterly Grievance Trajectory:</span>
                <span className={activeColorConfig.accent}>{currentChartReport.product}</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Visualizing sub-category volume shift across Q1, Q2, and Q3 2026.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold overflow-x-auto">
            {ALL_PRODUCT_SUB_CATEGORY_REPORTS.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveChartChannel(r.id)}
                className={`px-2.5 py-1 rounded-lg transition-colors shrink-0 ${
                  activeChartChannel === r.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {r.product}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 35 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
              <XAxis dataKey="name" angle={-16} textAnchor="end" tick={{ fontSize: 10 }} interval={0} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl text-xs shadow-xl border border-slate-700">
                        <p className="font-bold flex items-center gap-1 mb-1">
                          <span>{data.fullName}</span>
                          {data.isTopDriver && <span className="text-amber-400 font-extrabold">* (Driver)</span>}
                        </p>
                        <div className="space-y-0.5 font-mono text-[11px]">
                          <p className="text-slate-300">Q1: {data.Q1.toLocaleString()}</p>
                          <p className="text-blue-300">Q2: {data.Q2.toLocaleString()}</p>
                          <p className="text-emerald-300 font-bold">Q3: {data.Q3.toLocaleString()}</p>
                          <p className="text-amber-300 font-semibold pt-1 border-t border-slate-700">
                            Total: {(data.Q1 + data.Q2 + data.Q3).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
              <Bar dataKey="Q1" name="Q1 Volume" fill={activeColorConfig.q1Color} radius={[3, 3, 0, 0]} />
              <Bar dataKey="Q2" name="Q2 Volume" fill={activeColorConfig.q2Color} radius={[3, 3, 0, 0]} />
              <Bar dataKey="Q3" name="Q3 Volume" fill={activeColorConfig.barColor} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 6. INSTITUTIONAL EXECUTIVE OBSERVATIONS                   */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">RAAST Volume Normalization</h4>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            RAAST disputes dropped substantially in Q3 to <strong>1,448</strong> (-40.9% vs Q2), reflecting API gateway rate-limit improvements, though P2M disputes saw a counter-trend rise to 139.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Branch Account Turnaround</h4>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Branch banking complaints rose in Q3 to <strong>648</strong> (+47.6%), driven primarily by account activation delays (97) and email ID correction backlogs (75).
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">SMS Alerts & Mis-Selling</h4>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            SMS fee dispute volumes stabilized at <strong>149 in Q3</strong>, with fee deductions declining (-77.7% vs Q1) while alert mis-selling inquiries rose to 57 cases.
          </p>
        </div>
      </div>
    </div>
  );
};
