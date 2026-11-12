export interface SubCategoryGrievance {
  issue: string;
  q1: number;
  q2: number;
  q3: number;
  isTopDriver?: boolean;
}

export interface ProductSubCategoryReport {
  id: string;
  product: string;
  channel: string;
  quarterTotals: { q1: number; q2: number; q3: number; ytd: number };
  subCategories: SubCategoryGrievance[];
}

export interface ComplaintsTrackingSummary {
  metric: string;
  q1: number;
  q2: number;
  q3: number;
  ytdTotal?: number | string;
}

export interface AccountStaticChange {
  quarter: string;
  varianceRate: string;
  statusColor: 'Red' | 'Yellow' | 'Green';
}

export const COMPLAINTS_TRACKING_SUMMARY: ComplaintsTrackingSummary[] = [
  { metric: 'Complaints Received', q1: 7006, q2: 5163, q3: 4801, ytdTotal: 16970 },
  { metric: 'Complaints Resolved', q1: 7029, q2: 5179, q3: 4799, ytdTotal: 17007 },
  { metric: 'Carry Forward', q1: 189, q2: 166, q3: 150, ytdTotal: '-----' },
  { metric: 'Brought Forward', q1: 166, q2: 150, q3: 152, ytdTotal: '-----' },
];

export const ACCOUNT_STATIC_CHANGES: AccountStaticChange[] = [
  { quarter: 'Q1', varianceRate: '50%', statusColor: 'Red' },
  { quarter: 'Q2', varianceRate: '47%', statusColor: 'Red' },
  { quarter: 'Q3', varianceRate: '49%', statusColor: 'Red' },
];

// Category 1: IB / Mobile Banking Digital Channel
export const IB_MOBILE_SUB_CATEGORIES: SubCategoryGrievance[] = [
  { issue: 'Bill payment dispute-Mobile Banking', q1: 478, q2: 340, q3: 214, isTopDriver: true },
  { issue: 'Not Being able to access-Mobile App', q1: 314, q2: 134, q3: 319, isTopDriver: true },
  { issue: 'IBFT dispute via Mobile Banking', q1: 108, q2: 120, q3: 162, isTopDriver: true },
  { issue: 'OTP not Received', q1: 98, q2: 58, q3: 69, isTopDriver: false },
  { issue: 'Fraud related issues', q1: 34, q2: 24, q3: 26, isTopDriver: false },
  { issue: 'Other Complaints', q1: 179, q2: 118, q3: 147, isTopDriver: false },
];

// Category 2: Debit Card Operations
export const DEBIT_CARD_SUB_CATEGORIES: SubCategoryGrievance[] = [
  { issue: 'POS(Local) Claim', q1: 1286, q2: 157, q3: 185, isTopDriver: true },
  { issue: 'ATM Transaction Claims- Other Bank', q1: 232, q2: 241, q3: 362, isTopDriver: true },
  { issue: 'Debit card not received', q1: 189, q2: 123, q3: 103, isTopDriver: true },
  { issue: 'Debit card not working', q1: 120, q2: 114, q3: 115, isTopDriver: true },
  { issue: 'POS Claim (Pay Pak)', q1: 69, q2: 100, q3: 137, isTopDriver: true },
  { issue: 'ATM Transaction Claims- MIB Bank', q1: 77, q2: 65, q3: 70, isTopDriver: false },
  { issue: 'Other Complaints', q1: 205, q2: 196, q3: 264, isTopDriver: false },
];

// Category 3: Branch Banking Complaints
export const BRANCH_BANKING_SUB_CATEGORIES: SubCategoryGrievance[] = [
  { issue: 'Account Activation Issue', q1: 89, q2: 54, q3: 97, isTopDriver: true },
  { issue: 'Email ID not Updated / Corrected', q1: 73, q2: 42, q3: 75, isTopDriver: true },
  { issue: 'Delay in account opening/Account Closing', q1: 41, q2: 35, q3: 65, isTopDriver: true },
  { issue: 'Contact Number Update Issue', q1: 72, q2: 31, q3: 37, isTopDriver: true },
  { issue: 'LOT not received', q1: 29, q2: 18, q3: 22, isTopDriver: false },
  { issue: 'Branch Staff Complaint', q1: 22, q2: 20, q3: 23, isTopDriver: false },
  { issue: 'Fraud related issues', q1: 23, q2: 27, q3: 15, isTopDriver: false },
  { issue: 'Account Maintenance Issue', q1: 41, q2: 16, q3: 7, isTopDriver: false },
  { issue: 'Account available balance issue', q1: 15, q2: 22, q3: 24, isTopDriver: false },
  { issue: 'Fresh Notes not provided by branch', q1: 53, q2: 6, q3: 1, isTopDriver: false },
  { issue: 'Charges Deduction Issue', q1: 21, q2: 8, q3: 22, isTopDriver: false },
  { issue: 'MMN not Updated / Corrected', q1: 15, q2: 12, q3: 13, isTopDriver: false },
  { issue: 'Other Complaints', q1: 231, q2: 148, q3: 247, isTopDriver: false },
];

// Category 4: SMS Alerts
export const SMS_ALERTS_SUB_CATEGORIES: SubCategoryGrievance[] = [
  { issue: 'SMS charges deduction', q1: 121, q2: 39, q3: 27, isTopDriver: true },
  { issue: 'Mis-Selling', q1: 40, q2: 48, q3: 57, isTopDriver: true },
  { issue: 'SMS Alerts not received', q1: 55, q2: 29, q3: 27, isTopDriver: true },
  { issue: 'Other Complaints', q1: 31, q2: 27, q3: 38, isTopDriver: false },
];

// Category 5: RAAST
export const RAAST_SUB_CATEGORIES: SubCategoryGrievance[] = [
  { issue: 'Raast Payment Dispute (Mobile Banking)', q1: 2185, q2: 2298, q3: 1171, isTopDriver: true },
  { issue: 'Person to Merchant (P2M) Payment Dispute', q1: 22, q2: 51, q3: 139, isTopDriver: true },
  { issue: 'Other Complaints', q1: 106, q2: 102, q3: 138, isTopDriver: false },
];

export const ALL_PRODUCT_SUB_CATEGORY_REPORTS: ProductSubCategoryReport[] = [
  {
    id: 'ib_mobile',
    product: 'IB / Mobile Banking',
    channel: 'Digital Channel',
    quarterTotals: { q1: 1211, q2: 794, q3: 937, ytd: 2942 },
    subCategories: IB_MOBILE_SUB_CATEGORIES,
  },
  {
    id: 'debit_card',
    product: 'Debit Card',
    channel: 'Card Operations',
    quarterTotals: { q1: 2178, q2: 996, q3: 1236, ytd: 4410 },
    subCategories: DEBIT_CARD_SUB_CATEGORIES,
  },
  {
    id: 'branch_banking',
    product: 'Branch Banking',
    channel: 'Branch Network',
    quarterTotals: { q1: 725, q2: 439, q3: 648, ytd: 1812 },
    subCategories: BRANCH_BANKING_SUB_CATEGORIES,
  },
  {
    id: 'sms_alerts',
    product: 'SMS Alerts',
    channel: 'Notification Services',
    quarterTotals: { q1: 247, q2: 143, q3: 149, ytd: 539 },
    subCategories: SMS_ALERTS_SUB_CATEGORIES,
  },
  {
    id: 'raast',
    product: 'RAAST',
    channel: 'Instant Payment Gateway',
    quarterTotals: { q1: 2313, q2: 2451, q3: 1448, ytd: 6212 },
    subCategories: RAAST_SUB_CATEGORIES,
  },
];
