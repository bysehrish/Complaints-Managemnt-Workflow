import React, { useState, useMemo } from 'react';
import {
  FileSearch,
  Search,
  Filter,
  Download,
  ArrowUpDown,
  Shield,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Eye,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { CRMComplaint } from '../types/crm';
import { exportCRMDataToExcel } from '../utils/excelParser';

interface IssueRegistryPageProps {
  data: CRMComplaint[];
  onSelectComplaint: (complaint: CRMComplaint) => void;
}

type SortField = 'Complaint Number' | 'Logging Date' | 'Aging' | 'Priority' | 'Status';

export const IssueRegistryPage: React.FC<IssueRegistryPageProps> = ({
  data,
  onSelectComplaint,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterProduct, setFilterProduct] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterCircle, setFilterCircle] = useState<string>('All');

  // Sorting
  const [sortField, setSortField] = useState<SortField>('Complaint Number');
  const [sortAsc, setSortAsc] = useState(true);

  // Pagination
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const rowsPerPage = 12;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Filtered & Sorted Data
  const processedData = useMemo(() => {
    const filtered = data.filter((item) => {
      if (filterStatus !== 'All') {
        if (filterStatus === 'Resolved') {
          if (item.Status !== 'Resolved' && item.Status !== 'Closed') return false;
        } else if (item.Status !== filterStatus) {
          return false;
        }
      }

      if (filterProduct !== 'All' && item.Product !== filterProduct) return false;
      if (filterPriority !== 'All' && item.Priority !== filterPriority) return false;
      if (filterCircle !== 'All' && item.Circle !== filterCircle) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item['Complaint Number'].toLowerCase().includes(q) ||
          item.customer_name_c.toLowerCase().includes(q) ||
          item.cnic_c.toLowerCase().includes(q) ||
          item.customer_account_c.toLowerCase().includes(q) ||
          item.City_c.toLowerCase().includes(q) ||
          item.description_compaint.toLowerCase().includes(q) ||
          item['Branch Code'].toLowerCase().includes(q);

        if (!matches) return false;
      }

      return true;
    });

    return filtered.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'Aging') {
        valA = a.Aging || 0;
        valB = b.Aging || 0;
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [data, filterStatus, filterProduct, filterPriority, filterCircle, searchQuery, sortField, sortAsc]);

  // Paginated rows
  const totalPages = Math.ceil(processedData.length / rowsPerPage) || 1;
  const paginatedRows = processedData.slice(
    (currentPageNum - 1) * rowsPerPage,
    currentPageNum * rowsPerPage
  );

  const handleExport = () => {
    exportCRMDataToExcel(processedData, `Complaints_Master_Registry_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const renderStatus = (status: string) => {
    if (status === 'Open') return <span className="font-semibold text-rose-500">Open</span>;
    if (status === 'In Progress') return <span className="font-semibold text-blue-600">In Progress</span>;
    return <span className="font-semibold text-emerald-600">Resolved</span>;
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileSearch className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Statutory Master Directory
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-[#0B2559] dark:text-white tracking-tight">
            Issue Registry & Compliance Audit Log
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Full-spectrum searchable case repository compliant with ISO 10002 customer redress guidelines
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Formatted Excel ({processedData.length} Records)</span>
        </button>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 space-y-3 text-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Complaint #, Customer, CNIC, Account, City..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 text-xs"
            />
          </div>

          {/* Quick Clear */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setFilterStatus('All');
                setFilterProduct('All');
                setFilterPriority('All');
                setFilterCircle('All');
                setSearchQuery('');
              }}
              className="px-2.5 py-1 text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters Grid */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200/80 dark:border-slate-700/60">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved / Closed</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Product:</span>
            <select
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium cursor-pointer"
            >
              <option value="All">All Products</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Card">Card</option>
              <option value="Financial Statement">Financial Statement</option>
              <option value="Bank Account">Bank Account</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Circle:</span>
            <select
              value={filterCircle}
              onChange={(e) => setFilterCircle(e.target.value)}
              className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium cursor-pointer"
            >
              <option value="All">All Circles</option>
              <option value="South Circle">South Circle</option>
              <option value="Central Circle">Central Circle</option>
              <option value="North Circle">North Circle</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Data Grid */}
      <div className="border border-slate-300 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[#0B2559] dark:text-blue-400 font-bold bg-slate-50 dark:bg-slate-800/80">
                <th
                  onClick={() => handleSort('Complaint Number')}
                  className="py-3 px-3 w-28 font-mono cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-1">
                    <span>Case #</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Customer Name</th>
                <th className="py-3 px-3 font-mono">Account / CNIC</th>
                <th className="py-3 px-3">Product / Category</th>
                <th className="py-3 px-3 min-w-[260px]">Description Statement</th>
                <th className="py-3 px-3">Branch & City</th>
                <th
                  onClick={() => handleSort('Aging')}
                  className="py-3 px-3 text-center font-mono cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Aging</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('Priority')}
                  className="py-3 px-3 text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Priority</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('Status')}
                  className="py-3 px-3 text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No complaint records found matching current query.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row) => (
                  <tr
                    key={row['Complaint Number']}
                    onClick={() => onSelectComplaint(row)}
                    className="hover:bg-blue-50/50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      {row['Complaint Number']}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-200">
                      {row.customer_name_c}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                      <div>{row.customer_account_c}</div>
                      <div className="text-[10px] text-slate-400">{row.cnic_c}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{row.Product}</div>
                      <div className="text-[10px] text-slate-500">{row.ComplaintType}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 dark:text-slate-300 leading-normal line-clamp-2">
                      {row.description_compaint}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                      <div>{row['Branch Code']}</div>
                      <div className="text-[10px] text-slate-400">{row.City_c}</div>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        row.Aging > 5 ? 'bg-rose-100 text-rose-800' :
                        row.Aging >= 3 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {row.Aging}d
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        row.Priority === 'Critical' ? 'bg-rose-100 text-rose-800' :
                        row.Priority === 'High' ? 'bg-amber-100 text-amber-800' :
                        row.Priority === 'Medium' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {row.Priority}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-medium">
                      {renderStatus(row.Status)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectComplaint(row);
                        }}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-semibold underline text-xs"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Table Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="text-slate-500 font-mono">
            Showing {(currentPageNum - 1) * rowsPerPage + 1} to{' '}
            {Math.min(currentPageNum * rowsPerPage, processedData.length)} of{' '}
            {processedData.length} records
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPageNum((p) => Math.max(1, p - 1))}
              disabled={currentPageNum === 1}
              className="px-2.5 py-1 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-2 font-mono text-slate-600 dark:text-slate-400">
              Page {currentPageNum} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPageNum((p) => Math.min(totalPages, p + 1))}
              disabled={currentPageNum === totalPages}
              className="px-2.5 py-1 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
