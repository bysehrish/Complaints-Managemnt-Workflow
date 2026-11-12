import React, { useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  FileSpreadsheet,
  AlertTriangle,
  Clock,
  ShieldAlert,
  CheckCircle2,
  X,
  ChevronRight
} from 'lucide-react';
import { PortalPage, NotificationAlert } from '../../types/portal';

interface TopHeaderProps {
  currentPage: PortalPage;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenLogModal: () => void;
  onOpenUploadModal: () => void;
  alerts: NotificationAlert[];
  onSelectAlert: (alert: NotificationAlert) => void;
  onClearAlerts: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentPage,
  searchQuery,
  onSearchChange,
  onOpenLogModal,
  onOpenUploadModal,
  alerts,
  onSelectAlert,
  onClearAlerts,
}) => {
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  const getBreadcrumbs = (page: PortalPage) => {
    switch (page) {
      case 'dashboard':
        return ['Portal', 'Analytics Overview', 'Executive Dashboard'];
      case 'monthly_analysis':
        return ['Portal', 'Governance Reports', 'Monthly Complaints Analysis – Jan To Dec - 2026'];
      case 'quarterly_metrics':
        return ['Portal', 'Product Governance', 'Product Quarterly Metrics (CDR Analysis)'];
      case 'sub_category_breakdown':
        return ['Portal', 'Product Governance', 'Top Product-Wise Complaints & Sub-Category Breakdown'];
      default:
        return ['Portal', 'Overview'];
    }
  };

  const breadcrumbs = getBreadcrumbs(currentPage);
  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-2xs">
      {/* 1. Page Title Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium min-w-0">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={crumb}>
            {idx > 0 && <span className="text-slate-300 dark:text-slate-700">/</span>}
            <span
              className={
                idx === breadcrumbs.length - 1
                  ? 'font-bold text-slate-900 dark:text-white truncate'
                  : 'truncate'
              }
            >
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* 2. Global Search Bar & Actions */}
      <div className="flex items-center gap-3">
        {/* Global Search */}
        <div className="relative w-64 md:w-80 hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Complaint #, CNIC, Account, City..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setIsAlertsOpen(!isAlertsOpen)}
            className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="SLA Breach & Priority Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {/* Notifications Popover */}
          {isAlertsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 text-xs animate-in fade-in duration-100">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                <span className="font-bold text-slate-900 dark:text-white">
                  Regulatory & SLA Alerts ({alerts.length})
                </span>
                <button
                  onClick={onClearAlerts}
                  className="text-[10px] text-blue-600 hover:underline font-semibold"
                >
                  Mark All Read
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {alerts.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                    <span>No pending SLA alerts</span>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        onSelectAlert(alert);
                        setIsAlertsOpen(false);
                      }}
                      className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {alert.severity === 'critical' ? (
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          )}
                          <span className="truncate">{alert.title}</span>
                        </span>
                        <span className="font-mono text-[9px] text-slate-400 shrink-0">
                          {alert.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal line-clamp-2">
                        {alert.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Button: Upload Raw CRM Data */}
        <button
          onClick={onOpenUploadModal}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
          <span>Upload CRM Data</span>
        </button>

        {/* Quick Action Button: + Log Complaint */}
        <button
          onClick={onOpenLogModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Log Complaint</span>
        </button>
      </div>
    </header>
  );
};
