export interface CRMComplaint {
  // Core Fields
  'Complaint Number': string;
  'Logging Date': string;
  'Closing Date': string;
  'Aging': number;
  'Priority': 'Critical' | 'High' | 'Medium' | 'Low';
  'Type': string;
  'Status': 'Open' | 'In Progress' | 'Resolved' | 'Closed';

  // Location & Branch
  'Branch Code': string;
  'New Region': string;
  'region_c': string;
  'Circle': string;
  'City_c': string;

  // Classification & Root Cause
  'Product': string;
  'ComplaintType': string;
  'Lodgement Source': string;
  'root_cause_c': string;
  'decision_box_c': string;

  // Customer & Case Details
  'customer_name_c': string;
  'cnic_c': string;
  'customer_account_c': string;
  'description_compaint': string;
  'Activity_notes': string;
  'cmu_owner_c': string;
}

export type SubReportView =
  | 'executive'
  | 'regional'
  | 'root_cause'
  | 'channels'
  | 'cmu_aging';

export interface DataValidationSummary {
  totalRows: number;
  validRows: number;
  missingColumns: string[];
  recognizedColumns: string[];
  filename: string;
  uploadTimestamp: string;
}
