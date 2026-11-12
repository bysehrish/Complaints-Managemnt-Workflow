export type PortalPage =
  | 'dashboard'
  | 'monthly_analysis'
  | 'quarterly_metrics'
  | 'sub_category_breakdown';

export interface NotificationAlert {
  id: string;
  complaintNumber: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  read: boolean;
}

export interface SLAThresholds {
  criticalHours: number;
  highHours: number;
  mediumHours: number;
  lowHours: number;
  autoEscalate: boolean;
  dualSignoffRequired: boolean;
}

export interface RoutingRule {
  id: string;
  name: string;
  triggerCategory: string;
  assignedTeam: string;
  targetCircle?: string;
  active: boolean;
}
