export type WorkflowStage = 'intake' | 'triage' | 'investigation' | 'resolution' | 'closed';

export type IssueCategory = 'Card' | 'Financial Statement' | 'Bank Account' | 'Mobile App' | 'Treasury Settlement';

export type TeamName = 'Frontdesk' | 'Operation' | 'Treasury';

export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Complaint {
  id: string; // e.g. "CM-4581"
  numericId: number; // 1 to 49
  category: IssueCategory;
  subCategory: string; // e.g. "Log In", "Virtual Card", "Download", "Saving Account", "Version Update", "Open Account"
  description: string;
  team: TeamName;
  stage: WorkflowStage;
  subStep: string; // e.g. "Intake New/Received", "Dynamic Prioritize", "Dynamic Drafting"
  priority: PriorityLevel;
  customerName: string;
  customerEmail: string;
  accountNumber: string; // e.g. "**** 8492"
  accountTier: 'Private Wealth' | 'Commercial Premier' | 'Retail Plus' | 'Standard Checking';
  slaHoursRemaining: number;
  slaTotalHours: number;
  createdAt: string;
  updatedAt: string;
  aiRiskScore: number; // 1-100
  aiRecommendedAction?: string;
  aiDraftResponse?: string;
  timeline: {
    stage: string;
    timestamp: string;
    author: string;
    note: string;
  }[];
}

export interface SubStepConfig {
  id: string;
  name: string;
  description: string;
  automatedRule: string;
  stage: WorkflowStage;
  count: number;
}

export interface AIActionItem {
  id: string;
  title: string;
  complaintId: string;
  type: 'review' | 'response' | 'kyc' | 'escalation';
  badge: string;
  severity: 'high' | 'medium' | 'low';
}

export interface PerformanceInsight {
  id: string;
  metric: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  isAlert?: boolean;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  code: string;
  category: string;
  description: string;
  body: string;
}
