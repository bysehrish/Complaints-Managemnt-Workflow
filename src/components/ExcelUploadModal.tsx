import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Download,
  FileText,
  RefreshCw,
  HelpCircle,
  Eye,
  Check
} from 'lucide-react';
import { CRMComplaint, DataValidationSummary } from '../types/crm';
import { parseExcelCRMFile, downloadSampleCRMExcel, REQUIRED_COLUMNS } from '../utils/excelParser';
import { INITIAL_CRM_DATA } from '../data/crmMockData';

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (data: CRMComplaint[], summary: DataValidationSummary) => void;
}

export const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({
  isOpen,
  onClose,
  onDataLoaded,
}) => {
  if (!isOpen) return null;

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<CRMComplaint[] | null>(null);
  const [summary, setSummary] = useState<DataValidationSummary | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage(null);

    const result = await parseExcelCRMFile(file);
    setIsProcessing(false);

    if (result.error) {
      setErrorMessage(result.error);
      setParsedData(null);
      setSummary(result.summary);
    } else {
      setParsedData(result.data);
      setSummary(result.summary);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleApplyData = () => {
    if (parsedData && summary) {
      onDataLoaded(parsedData, summary);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Upload Raw CRM Data
              </h3>
              <p className="text-xs text-slate-500">
                Parse & ingest complaint records (.xlsx / .xls / .csv) into automated analytics
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50/60 scale-[0.99]'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />

            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              {isProcessing ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>

            <div>
              <span className="font-bold text-sm text-slate-800 block">
                {isProcessing
                  ? 'Analyzing & Parsing Spreadsheet...'
                  : 'Click to upload or drag & drop raw CRM spreadsheet'}
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Supports Microsoft Excel (.xlsx, .xls) and Comma-Separated Values (.csv)
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
              <span>Automatic column mapping across 22 CRM fields</span>
            </div>
          </div>

          {/* Sample File Download Option */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/70 border border-slate-200">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <span className="text-slate-700 font-medium">Need a formatted test file?</span>
            </div>
            <button
              onClick={() => downloadSampleCRMExcel(INITIAL_CRM_DATA)}
              className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-lg font-semibold text-xs transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Download Sample CRM Template (.xlsx)</span>
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Validation Warning</span>
                <span className="text-[11px]">{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Parsing Results & Column Validation */}
          {summary && !errorMessage && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-emerald-900">
                      File Verified: {summary.filename}
                    </span>
                    <span className="font-mono text-[10px] bg-emerald-200/60 px-2 py-0.5 rounded text-emerald-900 font-semibold">
                      {summary.validRows} Records
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-800 mt-1">
                    Successfully recognized {summary.recognizedColumns.length} of {REQUIRED_COLUMNS.length} standard CRM columns.
                  </div>
                </div>
              </div>

              {/* Missing Columns indicator if any */}
              {summary.missingColumns.length > 0 && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                  <span className="font-bold block mb-1">
                    Notice: {summary.missingColumns.length} Optional Columns Auto-Filled with Defaults:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {summary.missingColumns.map((col) => (
                      <span key={col} className="bg-white/80 px-1.5 py-0.2 rounded border border-amber-300 font-mono text-[10px]">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Preview Table of first 4 rows */}
              {parsedData && parsedData.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-800 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      Dataset Preview (First 4 Rows)
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {summary.validRows} total extracted
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto max-h-40">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 border-b border-slate-200">
                          <tr>
                            <th className="py-1.5 px-2.5 font-mono">Case #</th>
                            <th className="py-1.5 px-2.5">Product</th>
                            <th className="py-1.5 px-2.5">Category</th>
                            <th className="py-1.5 px-2.5">City</th>
                            <th className="py-1.5 px-2.5">Team</th>
                            <th className="py-1.5 px-2.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                          {parsedData.slice(0, 4).map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="py-1 px-2.5 font-mono font-bold text-slate-900">
                                {row['Complaint Number']}
                              </td>
                              <td className="py-1 px-2.5">{row['Product']}</td>
                              <td className="py-1 px-2.5">{row['ComplaintType']}</td>
                              <td className="py-1 px-2.5">{row['City_c']}</td>
                              <td className="py-1 px-2.5 font-mono text-[10px]">{row['cmu_owner_c']}</td>
                              <td className="py-1 px-2.5">
                                <span className={`font-semibold ${
                                  row['Status'] === 'Resolved' || row['Status'] === 'Closed'
                                    ? 'text-emerald-600'
                                    : row['Status'] === 'In Progress'
                                    ? 'text-blue-600'
                                    : 'text-rose-600'
                                }`}>
                                  {row['Status']}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-medium text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleApplyData}
            disabled={!parsedData || parsedData.length === 0}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-lg font-bold text-xs transition-all shadow-xs ${
              parsedData && parsedData.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Load Dataset to Dashboard ({parsedData ? parsedData.length : 0} Rows)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
