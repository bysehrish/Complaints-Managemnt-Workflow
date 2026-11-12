import React, { useState, useMemo } from 'react';
import {
  Landmark,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Layers,
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';
import { CRMComplaint, SubReportView, DataValidationSummary } from '../types/crm';
import { INITIAL_CRM_DATA } from '../data/crmMockData';
import { exportCRMDataToExcel, downloadSampleCRMExcel } from '../utils/excelParser';
import { ExcelUploadModal } from './ExcelUploadModal';
import { SubReportTabs } from './subreports/SubReportTabs';
import { ExecutiveSummaryView } from './subreports/ExecutiveSummaryView';
import { RegionalNetworkView } from './subreports/RegionalNetworkView';
import { RootCauseMatrixView } from './subreports/RootCauseMatrixView';
import { CustomerChannelsView } from './subreports/CustomerChannelsView';
import { CmuAgingView } from './subreports/CmuAgingView';
import { CRMCaseDetailModal } from './subreports/CRMCaseDetailModal';

export const FinancialDashboard: React.FC = () => {
  // Master CRM Dataset
  const [crmData, setCrmData] = useState<CRMComplaint[]>(INITIAL_CRM_DATA);
  const [activeSubReport, setActiveSubReport] = useState<SubReportView>('executive');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<string>('All');
  const [selectedCircle, setSelectedCircle] = useState<string>('All');

  // Modals & UI States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CRMComplaint | null>(null);
  const [validationBanner, setValidationBanner] = useState<DataValidationSummary | null>(null);

  // Derived filter options
  const productOptions = useMemo(() => {
    const set = new Set<string>();
    crmData.forEach((c) => {
      if (c.Product) set.add(c.Product);
    });
    return Array.from(set);
  }, [crmData]);

  const circleOptions = useMemo(() => {
    const set = new Set<string>();
    crmData.forEach((c) => {
      if (c.Circle) set.add(c.Circle);
    });
    return Array.from(set);
  }, [crmData]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return crmData.filter((item) => {
      // Status
      if (selectedStatus !== 'All') {
        if (selectedStatus === 'Resolved') {
          if (item.Status !== 'Resolved' && item.Status !== 'Closed') return false;
        } else if (item.Status !== selectedStatus) {
          return false;
        }
      }

      // Product
      if (selectedProduct !== 'All' && item.Product !== selectedProduct) {
        return false;
      }

      // Circle
      if (selectedCircle !== 'All' && item.Circle !== selectedCircle) {
        return false;
      }

      // Search Query
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
  }, [crmData, selectedStatus, selectedProduct, selectedCircle, searchQuery]);

  const handleDataLoaded = (parsed: CRMComplaint[], summary: DataValidationSummary) => {
    setCrmData(parsed);
    setValidationBanner(summary);
    // Reset filters
    setSelectedStatus('All');
    setSelectedProduct('All');
    setSelectedCircle('All');
    setSearchQuery('');
  };

  const handleResetToDefault = () => {
    setCrmData(INITIAL_CRM_DATA);
    setValidationBanner(null);
    setSelectedStatus('All');
    setSelectedProduct('All');
    setSelectedCircle('All');
    setSearchQuery('');
  };

  const handleExportFiltered = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    exportCRMDataToExcel(filteredData, `Filtered_Complaints_Report_${activeSubReport}_${timestamp}.xlsx`);
  };

  const handleUpdateComplaint = (updated: CRMComplaint) => {
    setCrmData((prev) =>
      prev.map((item) =>
        item['Complaint Number'] === updated['Complaint Number'] ? updated : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6 flex justify-center">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-md border border-slate-300 p-6 sm:p-8 flex flex-col space-y-6">
        
        {/* ========================================================= */}
        {/* 1. PAGE HEADER                                            */}
        {/* ========================================================= */}
        <div className="relative flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="w-36 hidden sm:block" />
          
          <div className="text-center flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2559] tracking-tight">
              Financial Complaint Report
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Automated CRM Ingestion & Multi-Dimensional Governance Analytics
            </p>
          </div>

          {/* Top-Right Bank Logo / Icon */}
          <div className="w-36 flex flex-col items-end">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-[#0B2559] tracking-widest leading-none mb-0.5">
                BANK
              </span>
              <div className="w-10 h-8 text-[#0B2559] flex items-center justify-center">
                <Landmark className="w-8 h-8 text-[#0B2559]" strokeWidth={2.2} />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* DATA INGESTION & VALIDATION BANNER                        */}
        {/* ========================================================= */}
        {validationBanner ? (
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold">
                  Active Ingested Dataset: {validationBanner.filename}
                </span>
                <span className="text-emerald-800 ml-2">
                  ({validationBanner.validRows} CRM records parsed at {validationBanner.uploadTimestamp})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-2.5 py-1 bg-white hover:bg-emerald-100 border border-emerald-300 rounded font-semibold text-emerald-900 transition-colors"
              >
                Upload Another File
              </button>
              <button
                onClick={handleResetToDefault}
                className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded font-semibold transition-colors flex items-center gap-1"
                title="Restore default benchmark dataset"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Default</span>
              </button>
            </div>
          </div>
        ) : null}

        {/* ========================================================= */}
        {/* GLOBAL TOOLBAR (Upload Excel, Export, Filters, Search)   */}
        {/* ========================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
          {/* Search */}
          <div className="flex items-center gap-2 flex-1 min-w-[220px] max-w-sm">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by case #, customer, city, root cause..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-blue-600"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-500 hover:text-slate-800 shrink-0 font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Dropdown Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-medium">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-700 font-medium focus:outline-none"
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
                className="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-700 font-medium focus:outline-none"
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
                className="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-700 font-medium focus:outline-none"
              >
                <option value="All">All Circles</option>
                {circleOptions.map((circ) => (
                  <option key={circ} value={circ}>{circ}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons: Upload Excel & Export Filtered */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-semibold transition-colors shadow-2xs"
              title="Upload and parse raw CRM spreadsheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Upload Raw CRM Data</span>
            </button>

            <button
              onClick={handleExportFiltered}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-md font-semibold transition-colors shadow-2xs"
              title="Export current filtered view to Excel"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Filtered Excel</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. SUB-REPORT TABS NAVIGATION (5 AUTOMATED GENERATORS)     */}
        {/* ========================================================= */}
        <SubReportTabs
          currentView={activeSubReport}
          onSelectView={setActiveSubReport}
          datasetCount={filteredData.length}
        />

        {/* ========================================================= */}
        {/* 3. DYNAMIC SUB-REPORT VIEW CONTENT                        */}
        {/* ========================================================= */}
        {filteredData.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-500 space-y-2">
            <Filter className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="font-bold text-sm text-slate-700">No complaints match active filter criteria</div>
            <div className="text-xs text-slate-400">Try clearing filters or search query to view all records</div>
            <button
              onClick={() => {
                setSelectedStatus('All');
                setSelectedProduct('All');
                setSelectedCircle('All');
                setSearchQuery('');
              }}
              className="mt-2 px-3 py-1 bg-white border border-slate-300 rounded font-semibold text-xs text-slate-700 hover:bg-slate-100"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            {activeSubReport === 'executive' && (
              <ExecutiveSummaryView
                data={filteredData}
                onSelectComplaint={setSelectedCase}
              />
            )}

            {activeSubReport === 'regional' && (
              <RegionalNetworkView
                data={filteredData}
                onSelectComplaint={setSelectedCase}
              />
            )}

            {activeSubReport === 'root_cause' && (
              <RootCauseMatrixView
                data={filteredData}
                onSelectComplaint={setSelectedCase}
              />
            )}

            {activeSubReport === 'channels' && (
              <CustomerChannelsView
                data={filteredData}
                onSelectComplaint={setSelectedCase}
              />
            )}

            {activeSubReport === 'cmu_aging' && (
              <CmuAgingView
                data={filteredData}
                onSelectComplaint={setSelectedCase}
              />
            )}
          </>
        )}

        {/* Footer info tag */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-200 gap-1 font-mono">
          <span>Enterprise Financial Governance Standard ISO 10002 / Regulation E</span>
          <span>Complaints Analytics Core Engine · XLSX Excel Parser Active</span>
        </div>

      </div>

      {/* Excel Upload Modal */}
      <ExcelUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDataLoaded={handleDataLoaded}
      />

      {/* CRM Case Detail Modal */}
      {selectedCase && (
        <CRMCaseDetailModal
          complaint={selectedCase}
          onClose={() => setSelectedCase(null)}
          onUpdateComplaint={handleUpdateComplaint}
        />
      )}
    </div>
  );
};
