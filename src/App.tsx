import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/navigation/Sidebar';
import { ExecutiveDashboardPage } from './pages/ExecutiveDashboardPage';
import { MonthlyComplaintsAnalysisPage } from './pages/MonthlyComplaintsAnalysisPage';
import { QuarterlyProductMetricsPage } from './pages/QuarterlyProductMetricsPage';
import { SubCategoryBreakdownPage } from './pages/SubCategoryBreakdownPage';
import { ExcelUploadModal } from './components/ExcelUploadModal';
import { CRMCaseDetailModal } from './components/subreports/CRMCaseDetailModal';
import { NewComplaintModal } from './components/NewComplaintModal';
import { INITIAL_CRM_DATA } from './data/crmMockData';
import { CRMComplaint, DataValidationSummary } from './types/crm';
import { PortalPage, NotificationAlert } from './types/portal';
import { Complaint } from './types';

export default function App() {
  // Helper to parse page from hash or search param (e.g. redirected by GitHub Pages 404.html)
  const getInitialPage = (): PortalPage => {
    if (typeof window === 'undefined') return 'dashboard';
    const rawHash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
    const validPages: PortalPage[] = ['dashboard', 'monthly_analysis', 'quarterly_metrics', 'sub_category_breakdown'];
    if (validPages.includes(rawHash as PortalPage)) {
      return rawHash as PortalPage;
    }

    const params = new URLSearchParams(window.location.search);
    const p = params.get('p')?.replace(/^\//, '').trim().toLowerCase();
    if (p && validPages.includes(p as PortalPage)) {
      return p as PortalPage;
    }

    return 'dashboard';
  };

  // Page Routing State (Default: hash-aware or 'dashboard')
  const [currentPage, setCurrentPage] = useState<PortalPage>(getInitialPage);

  // Sync state to hash on navigate
  const handleNavigate = (page: PortalPage) => {
    setCurrentPage(page);
    if (window.location.hash !== `#/${page}`) {
      window.location.hash = `#/${page}`;
    }
  };

  // Listen to browser Back/Forward and hash changes
  useEffect(() => {
    const onHashChange = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
      const validPages: PortalPage[] = ['dashboard', 'monthly_analysis', 'quarterly_metrics', 'sub_category_breakdown'];
      if (validPages.includes(rawHash as PortalPage)) {
        setCurrentPage(rawHash as PortalPage);
      }
    };

    window.addEventListener('hashchange', onHashChange);
    if (!window.location.hash) {
      window.location.hash = `#/${currentPage}`;
    }

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Master CRM Dataset shared globally across all 5 pages
  const [crmData, setCrmData] = useState<CRMComplaint[]>(INITIAL_CRM_DATA);
  const [validationSummary, setValidationSummary] = useState<DataValidationSummary | null>(null);

  // Layout & Theme State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [copilotActive, setCopilotActive] = useState(true);

  // Modals State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CRMComplaint | null>(null);

  // Dynamic Alerts generated from cases
  const [alerts, setAlerts] = useState<NotificationAlert[]>([]);

  // Calculate dynamic alerts on data change
  useEffect(() => {
    const newAlerts: NotificationAlert[] = [];
    crmData.forEach((c) => {
      if (c.Priority === 'Critical' && c.Status !== 'Resolved' && c.Status !== 'Closed') {
        newAlerts.push({
          id: `alert-${c['Complaint Number']}`,
          complaintNumber: c['Complaint Number'],
          title: `Critical Incident Flag: ${c['Complaint Number']}`,
          description: `${c.Product} - ${c.description_compaint.slice(0, 60)}... (${c.cmu_owner_c})`,
          severity: 'critical',
          timestamp: 'Just now',
          read: false,
        });
      } else if (c.Aging > 5 && c.Status !== 'Resolved' && c.Status !== 'Closed') {
        newAlerts.push({
          id: `aging-${c['Complaint Number']}`,
          complaintNumber: c['Complaint Number'],
          title: `SLA Breach Overdue: ${c['Complaint Number']}`,
          description: `Case has exceeded 5 days SLA threshold (Current: ${c.Aging} days active).`,
          severity: 'warning',
          timestamp: `${c.Aging}d ago`,
          read: false,
        });
      }
    });
    setAlerts(newAlerts.slice(0, 8));
  }, [crmData]);

  // Handle Dark Mode toggle
  const handleToggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Master counts
  const openCasesCount = useMemo(() => {
    return crmData.filter((c) => c.Status !== 'Resolved' && c.Status !== 'Closed').length;
  }, [crmData]);

  // Global search filtering applied to dataset for pages that accept search
  const filteredData = useMemo(() => {
    if (!globalSearch.trim()) return crmData;
    const q = globalSearch.toLowerCase();
    return crmData.filter(
      (c) =>
        c['Complaint Number'].toLowerCase().includes(q) ||
        c.customer_name_c.toLowerCase().includes(q) ||
        c.cnic_c.toLowerCase().includes(q) ||
        c.customer_account_c.toLowerCase().includes(q) ||
        c.City_c.toLowerCase().includes(q) ||
        c.description_compaint.toLowerCase().includes(q)
    );
  }, [crmData, globalSearch]);

  // Handlers for dataset updates
  const handleDataLoadedFromExcel = (
    parsed: CRMComplaint[],
    summary: DataValidationSummary
  ) => {
    setCrmData(parsed);
    setValidationSummary(summary);
  };

  const handleUpdateComplaint = (updated: CRMComplaint) => {
    setCrmData((prev) =>
      prev.map((c) =>
        c['Complaint Number'] === updated['Complaint Number'] ? updated : c
      )
    );
  };

  const handleMoveComplaintStage = (complaintNumber: string, targetStage: string) => {
    setCrmData((prev) =>
      prev.map((c) => {
        if (c['Complaint Number'] === complaintNumber) {
          let nextStatus: CRMComplaint['Status'] = c.Status;
          if (targetStage === 'intake' || targetStage === 'triage') {
            nextStatus = 'Open';
          } else if (targetStage === 'investigation' || targetStage === 'resolution') {
            nextStatus = 'In Progress';
          } else if (targetStage === 'closed') {
            nextStatus = 'Closed';
          }
          return {
            ...c,
            Status: nextStatus,
            Activity_notes: `${c.Activity_notes ? c.Activity_notes + ' | ' : ''}Advanced to ${targetStage} stage on ${new Date().toLocaleDateString()}.`,
          };
        }
        return c;
      })
    );
  };

  const handleAddManualComplaint = (newComp: Partial<Complaint>) => {
    const nextId = `CM-${4700 + crmData.length + 1}`;
    const newRecord: CRMComplaint = {
      'Complaint Number': nextId,
      'Logging Date': new Date().toISOString().slice(0, 10),
      'Closing Date': '',
      'Aging': 1,
      'Priority': (newComp.priority as any) || 'High',
      'Type': newComp.category || 'Mobile App',
      'Status': 'Open',
      'Branch Code': 'BR-101',
      'New Region': 'Karachi Metro',
      'region_c': 'South',
      'Circle': 'South Circle',
      'City_c': 'Karachi',
      'Product': newComp.category || 'Mobile App',
      'ComplaintType': newComp.subCategory || 'General Issue',
      'Lodgement Source': 'Portal Ingest',
      'root_cause_c': 'Under Initial Investigation',
      'decision_box_c': 'In Triage Queue',
      'customer_name_c': newComp.customerName || 'Anonymous Customer',
      'cnic_c': '42101-*******-9',
      'customer_account_c': newComp.accountNumber || '**** 9000',
      'description_compaint': newComp.description || 'New service complaint logged via executive portal.',
      'Activity_notes': `Logged manually by Sehrish Athar on ${new Date().toLocaleString()}.`,
      'cmu_owner_c': (newComp.team as any) || 'Operation',
    };

    setCrmData([newRecord, ...crmData]);
    handleNavigate('dashboard');
  };

  return (
    <div className={`h-screen w-screen overflow-hidden flex bg-slate-100 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased ${isDarkMode ? 'dark' : ''}`}>
      {/* 1. Collapsible Left Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        totalCasesCount={crmData.length}
      />

      {/* 2. Main Executive Center */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Multi-Page View Routing Port */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-100/80 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto">
            {/* Page 1: Executive Dashboard */}
            {currentPage === 'dashboard' && (
              <ExecutiveDashboardPage
                data={crmData}
                onSelectComplaint={setSelectedCase}
                onNavigate={handleNavigate}
                onOpenUpload={() => setIsUploadModalOpen(true)}
                onOpenLogModal={() => setIsLogModalOpen(true)}
              />
            )}

            {/* Page 2: Monthly Complaints Analysis – Jan To Dec - 2026 */}
            {currentPage === 'monthly_analysis' && (
              <MonthlyComplaintsAnalysisPage
                data={crmData}
                onNavigate={handleNavigate}
              />
            )}

            {/* Page 3: Product Quarterly Metrics (CDR Analysis) */}
            {currentPage === 'quarterly_metrics' && (
              <QuarterlyProductMetricsPage
                onNavigate={handleNavigate}
              />
            )}

            {/* Page 4: Top Product-Wise Complaints & Sub-Category Breakdown */}
            {currentPage === 'sub_category_breakdown' && (
              <SubCategoryBreakdownPage
                onNavigate={handleNavigate}
              />
            )}
          </div>
        </main>
      </div>

      {/* Excel Upload Modal */}
      <ExcelUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDataLoaded={handleDataLoadedFromExcel}
      />

      {/* Case Action Drawer / Modal */}
      {selectedCase && (
        <CRMCaseDetailModal
          complaint={selectedCase}
          onClose={() => setSelectedCase(null)}
          onUpdateComplaint={handleUpdateComplaint}
        />
      )}

      {/* New Complaint Logging Modal */}
      {isLogModalOpen && (
        <NewComplaintModal
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          onAddComplaint={handleAddManualComplaint}
        />
      )}
    </div>
  );
}
