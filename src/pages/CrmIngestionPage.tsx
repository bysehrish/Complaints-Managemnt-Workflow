import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  Filter,
  Search,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { CRMComplaint, SubReportView, DataValidationSummary } from '../types/crm';
import { exportCRMDataToExcel, downloadSampleCRMExcel } from '../utils/excelParser';
import { SubReportTabs } from '../components/subreports/SubReportTabs';
import { ExecutiveSummaryView } from '../components/subreports/ExecutiveSummaryView';
import { RegionalNetworkView } from '../components/subreports/RegionalNetworkView';
import { RootCauseMatrixView } from '../components/subreports/RootCauseMatrixView';
import { CustomerChannelsView } from '../components/subreports/CustomerChannelsView';
import { CmuAgingView } from '../components/subreports/CmuAgingView';

interface CrmIngestionPageProps {
  data: CRMComplaint[];
  onOpenUploadModal: () => void;
  onSelectComplaint: (complaint: CRMComplaint) => void;
  validationSummary: DataValidationSummary | null;
  onResetData: () => void;
}

export const CrmIngestionPage: React.FC<CrmIngestionPageProps> = ({
  data,
  onOpenUploadModal,
  onSelectComplaint,
  validationSummary,
  onResetData,
}) => {
  const [activeSubReport, setActiveSubReport] = useState<SubReportView>('executive');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<string>('All');
  const [selectedCircle, setSelectedCircle] = useState<string>('All');

  // Dynamic filter options
  const productOptions = useMemo(() => {
    const set = new Set<string>();
    data.forEach((c) => {
      if (c.Product) set.add(c.Product);
    });
    return Array.from(set);
  }, [data]);

  const circleOptions = useMemo(() => {
    const set = new Set<string>();
    data.forEach((c) => {
      if (c.Circle) set.add(c.Circle);
    });
    return Array.from(set);
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (selectedStatus !== 'All') {
        if (selectedStatus === 'Resolved') {
          if (item.Status !== 'Resolved' && item.Status !== 'Closed') return false;
        } else if (item.Status !== selectedStatus) {
          return false;
        }
      }

      if (selectedProduct !== 'All' && item.Product !== selectedProduct) {
        return false;
      }

      if (selectedCircle !== 'All' && item.Circle !== selectedCircle) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item['Complaint Number'].toLowerCase().includes(q) ||
          item.customer_name_c.toLowerCase().includes(q) ||
          item.description_compaint.toLowerCase().includes(q) ||
          item.ComplaintType.toLowerCase().includes(q) ||
          item.cmu_owner_c.toLowerCase().includes(q) ||
          item['Branch Code'].toLowerCase().includes(q) ||
          item.City_c.toLowerCase().includes(q) ||
          item.root_cause_c.toLowerCase().includes(q);

        if (!matches) return false;
      }

      return true;
    });
  }, [data, selectedStatus, selectedProduct, selectedCircle, searchQuery]);

  const handleExport = () => {
    exportCRMDataToExcel(filteredData, `CRM_SubReport_${activeSubReport}.xlsx`);
  };

  return (
    <div className="space-y-5">
      {/* 1. Ingestion Control Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Automated Data Processing Engine
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-[#0B2559] dark:text-white tracking-tight">
            CRM Ingestion & Multi-Dimensional Sub-Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ingest raw bank CRM files (.xlsx / .csv) and dynamically generate all 5 statutory governance sub-reports
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => downloadSampleCRMExcel(data)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 font-semibold text-xs text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sample Template (.xlsx)</span>
          </button>

          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Raw CRM Data</span>
          </button>
        </div>
      </div>

      {/* 2. Ingestion Status & Verification Card */}
      {validationSummary && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-emerald-900 dark:text-emerald-200">
                Active Source File: {validationSummary.filename}
              </span>
              <span className="text-emerald-800 dark:text-emerald-300 ml-2">
                ({validationSummary.validRows} CRM records parsed with 22 columns at {validationSummary.uploadTimestamp})
              </span>
            </div>
          </div>

          <button
            onClick={onResetData}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold text-xs transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Benchmark Dataset</span>
          </button>
        </div>
      )}

      {/* 3. Global Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-sm">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search across active sub-report..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-500 hover:text-slate-800 text-xs font-medium"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved / Closed</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">Product:</span>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium"
            >
              <option value="All">All Products</option>
              {productOptions.map((prod) => (
                <option key={prod} value={prod}>{prod}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">Circle:</span>
            <select
              value={selectedCircle}
              onChange={(e) => setSelectedCircle(e.target.value)}
              className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium"
            >
              <option value="All">All Circles</option>
              {circleOptions.map((circ) => (
                <option key={circ} value={circ}>{circ}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-semibold transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export View</span>
          </button>
        </div>
      </div>

      {/* 4. Sub-Report Tabs Switcher */}
      <SubReportTabs
        currentView={activeSubReport}
        onSelectView={setActiveSubReport}
        datasetCount={filteredData.length}
      />

      {/* 5. Sub-Report View Content */}
      <div className="pt-2">
        {filteredData.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white text-slate-400">
            No complaints match the selected filter criteria.
          </div>
        ) : (
          <>
            {activeSubReport === 'executive' && (
              <ExecutiveSummaryView
                data={filteredData}
                onSelectComplaint={onSelectComplaint}
              />
            )}
            {activeSubReport === 'regional' && (
              <RegionalNetworkView
                data={filteredData}
                onSelectComplaint={onSelectComplaint}
              />
            )}
            {activeSubReport === 'root_cause' && (
              <RootCauseMatrixView
                data={filteredData}
                onSelectComplaint={onSelectComplaint}
              />
            )}
            {activeSubReport === 'channels' && (
              <CustomerChannelsView
                data={filteredData}
                onSelectComplaint={onSelectComplaint}
              />
            )}
            {activeSubReport === 'cmu_aging' && (
              <CmuAgingView
                data={filteredData}
                onSelectComplaint={onSelectComplaint}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
