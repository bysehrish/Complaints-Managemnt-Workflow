import { Complaint, DocumentTemplate, AIActionItem, PerformanceInsight, SubStepConfig } from '../types';

export const INITIAL_SUBSTEPS: SubStepConfig[] = [
  // Intake
  {
    id: 'intake-received',
    name: 'Intake New/Received',
    description: 'Automated multi-channel ingestion from mobile app, web banking portal, branch desk, and hotline.',
    automatedRule: 'Rule IN-01: Auto-parsing of customer ID, sentiment scoring, and routing stamp applied upon webhook ingest.',
    stage: 'intake',
    count: 7,
  },
  {
    id: 'intake-assign',
    name: 'Dynamic Assign/Pestion',
    description: 'Dynamic load balancing across Frontdesk, Operations, and Treasury queues based on category matching.',
    automatedRule: 'Rule IN-02: Natural language intent classification maps keywords directly to departmental owner.',
    stage: 'intake',
    count: 5,
  },
  {
    id: 'intake-cases',
    name: 'Dynamic Cases',
    description: 'Validation queue for high-value accounts (Private Wealth) requiring immediate supervisory notification.',
    automatedRule: 'Rule IN-03: Escalate to Tier-1 Officer if customer tier is Private Wealth or dispute amount exceeds $2,500.',
    stage: 'intake',
    count: 3,
  },

  // Triage
  {
    id: 'triage-prioritize',
    name: 'Dynamic Prioritize',
    description: 'SLA countdown calibration and automated impact calculation based on customer impact and regulatory exposure.',
    automatedRule: 'Rule TR-01: Auto-tag Critical priority if potential financial loss is flagged or login vulnerability exists.',
    stage: 'triage',
    count: 6,
  },
  {
    id: 'triage-approval',
    name: 'Dynamic Approval',
    description: 'Compliance governance sign-off before formal departmental investigation opens.',
    automatedRule: 'Rule TR-02: Triage Officer confirmation required for multi-department claims before dispatch.',
    stage: 'triage',
    count: 5,
  },

  // Investigation
  {
    id: 'investigation-status',
    name: 'Dynamic Status',
    description: 'Automated ledger verification, core banking system log retrieval, and security audit check.',
    automatedRule: 'Rule INV-01: Core API query triggered to verify transaction hashes, device tokens, and session errors.',
    stage: 'investigation',
    count: 6,
  },
  {
    id: 'investigation-progress',
    name: 'Dynamic In Progress',
    description: 'Specialist root-cause analysis, merchant dispute outreach, and technical diagnosis.',
    automatedRule: 'Rule INV-02: Daily SLA ping dispatched to assigned case investigator at 24h milestone.',
    stage: 'investigation',
    count: 7,
  },

  // Resolution
  {
    id: 'resolution-drafting',
    name: 'Dynamic Drafting',
    description: 'AI-assisted drafting of customer remedy letter, compensation calculations, and fee waivers.',
    automatedRule: 'Rule RES-01: Pre-populate approved regulatory response template with verified findings and redress amount.',
    stage: 'resolution',
    count: 3,
  },
  {
    id: 'resolution-approval',
    name: 'Dynamic Approval',
    description: 'Supervisory sign-off and Treasury fund release authorization before sending finalized response.',
    automatedRule: 'Rule RES-02: Dual signature required if monetary restitution exceeds $500.',
    stage: 'resolution',
    count: 7,
  },

  // Closed
  {
    id: 'closed-finalized',
    name: 'Dynamic Finalized',
    description: 'Customer notification dispatched, satisfaction survey delivered, and compliance audit archive logged.',
    automatedRule: 'Rule CL-01: Case permanently archived with tamper-evident audit trail and CFPB compliance metadata.',
    stage: 'closed',
    count: 5,
  },
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  // Issue 1 from screenshot
  {
    id: 'CM-4581',
    numericId: 1,
    category: 'Mobile App',
    subCategory: 'Log In',
    description: 'Cannot login to Bank App, it says running out of time during biometric handshake.',
    team: 'Operation',
    stage: 'intake',
    subStep: 'Intake New/Received',
    priority: 'Critical',
    customerName: 'Sarah Jenkins',
    customerEmail: 's.jenkins@enterprise-corp.com',
    accountNumber: '**** 8492',
    accountTier: 'Private Wealth',
    slaHoursRemaining: 3.5,
    slaTotalHours: 24,
    createdAt: '2026-10-29T18:40:00Z',
    updatedAt: '2026-10-29T21:15:00Z',
    aiRiskScore: 92,
    aiRecommendedAction: 'High Priority: Session handshake timeout indicates potential OAuth token expiration or gateway degradation. Recommend immediate priority escalation.',
    aiDraftResponse: 'Dear Ms. Jenkins,\n\nWe have identified a temporary session timeout issue affecting our authentication gateway for our Private Wealth mobile portal. Our engineering infrastructure team has refreshed your session token pool. Please force close the application and re-authenticate. If this persists, your dedicated relationship manager is on standby.\n\nSincerely,\nService Quality Governance',
    timeline: [
      { stage: 'intake', timestamp: 'Oct 29, 18:40', author: 'Automated Mobile Gateway', note: 'Ingested via App Error Telemetry webhook' },
      { stage: 'intake', timestamp: 'Oct 29, 18:45', author: 'AI Copilot', note: 'Flagged Critical severity due to Private Wealth tier' },
    ],
  },
  // Issue 2 from screenshot
  {
    id: 'CM-3920',
    numericId: 2,
    category: 'Card',
    subCategory: 'Virtual Card',
    description: "Can't open a virtual card in client portal; receives cryptic error 504 on instant card generation.",
    team: 'Frontdesk',
    stage: 'investigation',
    subStep: 'Dynamic In Progress',
    priority: 'High',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@vancetech.io',
    accountNumber: '**** 3901',
    accountTier: 'Commercial Premier',
    slaHoursRemaining: 8.0,
    slaTotalHours: 48,
    createdAt: '2026-10-28T14:20:00Z',
    updatedAt: '2026-10-29T20:10:00Z',
    aiRiskScore: 78,
    aiRecommendedAction: 'Generate initial response: Card provisioning microservice queue requires card cache rebuild. Initial workaround available via web console.',
    aiDraftResponse: 'Dear Mr. Vance,\n\nThank you for reaching out regarding your virtual card issuance request. Our card processing gateway experienced a temporary latency spike during your token generation. We have manually provisioned your virtual card ending in 7741. You can now view and activate it directly within your security card controls.\n\nWarm regards,\nFrontdesk Governance Team',
    timeline: [
      { stage: 'intake', timestamp: 'Oct 28, 14:20', author: 'Customer Portal', note: 'Case submitted by customer' },
      { stage: 'triage', timestamp: 'Oct 28, 15:00', author: 'Triage Officer Chen', note: 'Assigned to Frontdesk card operations' },
      { stage: 'investigation', timestamp: 'Oct 29, 09:30', author: 'Officer Rodriguez', note: 'Card tokenization verified in Mastercard sandbox' },
    ],
  },
  // Issue 3 from screenshot
  {
    id: 'CM-3104',
    numericId: 3,
    category: 'Financial Statement',
    subCategory: 'Download',
    description: 'Failed to download financial report for Q3 auditing; PDF export hangs at 99%.',
    team: 'Operation',
    stage: 'closed',
    subStep: 'Dynamic Finalized',
    priority: 'Medium',
    customerName: 'Elena Rostova',
    customerEmail: 'elena@rostovagroup.com',
    accountNumber: '**** 1184',
    accountTier: 'Commercial Premier',
    slaHoursRemaining: 0,
    slaTotalHours: 48,
    createdAt: '2026-10-25T11:00:00Z',
    updatedAt: '2026-10-27T16:30:00Z',
    aiRiskScore: 35,
    aiRecommendedAction: 'Case resolved: PDF generator worker memory limit adjusted. Customer provided secure direct download link.',
    aiDraftResponse: 'Dear Ms. Rostova,\n\nWe have resolved the statement generation failure. The Q3 audited statements for accounts ending in 1184 and 1185 have been regenerated and encrypted securely. An updated download link has been sent to your verified corporate email.\n\nSincerely,\nOperations Governance',
    timeline: [
      { stage: 'intake', timestamp: 'Oct 25, 11:00', author: 'Web Ingest', note: 'Customer ticket created' },
      { stage: 'investigation', timestamp: 'Oct 26, 10:15', author: 'Operation Tech', note: 'Identified large payload rendering bottleneck' },
      { stage: 'resolution', timestamp: 'Oct 27, 14:00', author: 'Lead Officer Diaz', note: 'Signed off compensation credit of $25 fee waiver' },
      { stage: 'closed', timestamp: 'Oct 27, 16:30', author: 'System', note: 'Customer confirmed successful download' },
    ],
  },
  // Issue 4 from screenshot
  {
    id: 'CM-4102',
    numericId: 4,
    category: 'Mobile App',
    subCategory: 'Log In',
    description: 'I forgot my password, what should I do? SMS reset passcode is not arriving on international roaming number.',
    team: 'Operation',
    stage: 'triage',
    subStep: 'Dynamic Prioritize',
    priority: 'High',
    customerName: 'Tariq Al-Mansoor',
    customerEmail: 'tariq.mansoor@globaltrade.ae',
    accountNumber: '**** 5520',
    accountTier: 'Private Wealth',
    slaHoursRemaining: 14.5,
    slaTotalHours: 24,
    createdAt: '2026-10-29T16:10:00Z',
    updatedAt: '2026-10-29T19:40:00Z',
    aiRiskScore: 84,
    aiRecommendedAction: 'Verify KYC flag: International carrier SMS routing blocked by telecom spam filter. Initiate secondary email OTP + video identity verification.',
    aiDraftResponse: 'Dear Mr. Al-Mansoor,\n\nTo ensure maximum security while travelling internationally, our dual-factor authentication system can route your verification code via encrypted email or push notification to your registered tablet. Our international support desk has initiated a temporary secure bypass link valid for 60 minutes.\n\nWarm regards,\nClient Security Governance',
    timeline: [
      { stage: 'intake', timestamp: 'Oct 29, 16:10', author: 'Mobile App', note: 'Password reset failure auto-escalated' },
      { stage: 'triage', timestamp: 'Oct 29, 17:00', author: 'Triage Officer Chen', note: 'Queued for priority international dispatch' },
    ],
  },
  // Issue 5 from screenshot
  {
    id: 'CM-4288',
    numericId: 5,
    category: 'Bank Account',
    subCategory: 'Saving Account',
    description: 'How to change bank account language? Preferred interface language resets back to default on logout.',
    team: 'Frontdesk',
    stage: 'intake',
    subStep: 'Dynamic Assign/Pestion',
    priority: 'Low',
    customerName: 'Claire Dubois',
    customerEmail: 'c.dubois@paris-creatives.fr',
    accountNumber: '**** 9043',
    accountTier: 'Retail Plus',
    slaHoursRemaining: 36.0,
    slaTotalHours: 72,
    createdAt: '2026-10-29T12:00:00Z',
    updatedAt: '2026-10-29T14:10:00Z',
    aiRiskScore: 18,
    aiRecommendedAction: 'Quick self-service response: Cookie consent preference must be accepted to persist profile locale setting.',
    aiDraftResponse: 'Bonjour Ms. Dubois,\n\nYou can set your preferred language permanently under Settings > Profile > Regional Preferences. Please ensure that "Functional Preferences" cookies are allowed in your browser so your language preference persists across sessions.\n\nCordialement,\nFrontdesk Support',
    timeline: [
      { stage: 'intake', timestamp: 'Oct 29, 12:00', author: 'Chat Widget', note: 'Routine customer inquiry' },
    ],
  },
  // Issue 6 from screenshot
  {
    id: 'CM-4309',
    numericId: 6,
    category: 'Mobile App',
    subCategory: 'Version Update',
    description: 'How to update to the latest version? App Store shows update available but crashes on initial asset load.',
    team: 'Operation',
    stage: 'investigation',
    subStep: 'Dynamic Status',
    priority: 'Medium',
    customerName: 'Liam O’Connor',
    customerEmail: 'liam.oconnor@dublin-craft.ie',
    accountNumber: '**** 6612',
    accountTier: 'Standard Checking',
    slaHoursRemaining: 21.0,
    slaTotalHours: 48,
    createdAt: '2026-10-29T08:30:00Z',
    updatedAt: '2026-10-29T15:00:00Z',
    aiRiskScore: 42,
    aiRecommendedAction: 'Asset CDN sync check: European CDN edge node delivered corrupted checksum for iOS build 4.9.1. Rollback in progress.',
    aiDraftResponse: 'Dear Mr. O’Connor,\n\nWe recently deployed version 4.9.2 to address compatibility with newer iOS updates. A localized cache clear resolves the startup crash immediately. If you delete and reinstall the app, all your settings will automatically restore from your secure cloud profile.\n\nSincerely,\nMobile Operations Team',
    timeline: [
      { stage: 'intake', timestamp: 'Oct 29, 08:30', author: 'App Store Review Feed', note: 'Customer ticket generated' },
      { stage: 'investigation', timestamp: 'Oct 29, 11:00', author: 'Mobile QA Specialist', note: 'Confirmed CDN checksum issue' },
    ],
  },
  // Issue 7 from screenshot
  {
    id: 'CM-4315',
    numericId: 7,
    category: 'Bank Account',
    subCategory: 'Open Account',
    description: "It says I'm not old enough to open an account, but I am 24 years old with verified national identity card.",
    team: 'Frontdesk',
    stage: 'resolution',
    subStep: 'Dynamic Drafting',
    priority: 'High',
    customerName: 'Aisha Patel',
    customerEmail: 'aisha.patel@oxford-research.ac.uk',
    accountNumber: '**** 2940',
    accountTier: 'Retail Plus',
    slaHoursRemaining: 6.2,
    slaTotalHours: 24,
    createdAt: '2026-10-28T19:00:00Z',
    updatedAt: '2026-10-29T18:00:00Z',
    aiRiskScore: 71,
    aiRecommendedAction: 'Draft resolution: OCR scan inverted day and month (MM/DD/YYYY vs DD/MM/YYYY) during automated KYC parsing. Ready for manual override sign-off.',
    aiDraftResponse: 'Dear Ms. Patel,\n\nThank you for your patience while we investigated your account opening application. We found that our optical character reader misread the date format on your national identity document. Our Compliance Officer has reviewed and approved your verified date of birth. Your High-Yield Savings Account has been opened successfully, and your welcome packet is ready in your portal.\n\nBest regards,\nService Quality Governance',
    timeline: [
      { stage: 'intake', timestamp: 'Oct 28, 19:00', author: 'Onboarding Portal', note: 'Application rejection auto-escalated' },
      { stage: 'triage', timestamp: 'Oct 29, 08:00', author: 'Triage Officer Chen', note: 'Fast-tracked KYC correction' },
      { stage: 'resolution', timestamp: 'Oct 29, 14:00', author: 'Compliance Lead', note: 'Manual KYC verification completed' },
    ],
  },
  // Additional complaints to populate realistic pipeline matching the 49 complaints in the user's report
  {
    id: 'CM-4601',
    numericId: 8,
    category: 'Card',
    subCategory: 'Virtual Card',
    description: 'Double charge on international merchant transaction while using virtual one-time card.',
    team: 'Frontdesk',
    stage: 'intake',
    subStep: 'Intake New/Received',
    priority: 'High',
    customerName: 'David Kim',
    customerEmail: 'david.kim@seoul-venture.kr',
    accountNumber: '**** 7711',
    accountTier: 'Commercial Premier',
    slaHoursRemaining: 22.0,
    slaTotalHours: 24,
    createdAt: '2026-10-29T21:00:00Z',
    updatedAt: '2026-10-29T21:00:00Z',
    aiRiskScore: 68,
    aiRecommendedAction: 'Pre-auth duplicate hold: Merchant processor submitted duplicate authorization. Provisional credit advised.',
    aiDraftResponse: 'Dear Mr. Kim, we have noted the pending duplicate authorization from merchant Tokyo Express. A provisional credit of $184.50 has been placed on your card while the settlement clearing completes.',
    timeline: [{ stage: 'intake', timestamp: 'Oct 29, 21:00', author: 'Card Transaction Monitor', note: 'Anomaly auto-flagged' }],
  },
  {
    id: 'CM-4602',
    numericId: 9,
    category: 'Card',
    subCategory: 'Card Dispute',
    description: 'Atmospheric fee surcharge charged at partner ATM network without pre-warning screen.',
    team: 'Frontdesk',
    stage: 'intake',
    subStep: 'Dynamic Cases',
    priority: 'Medium',
    customerName: 'Robert Langdon',
    customerEmail: 'rlangdon@harvard-inst.edu',
    accountNumber: '**** 4099',
    accountTier: 'Private Wealth',
    slaHoursRemaining: 40.0,
    slaTotalHours: 48,
    createdAt: '2026-10-29T20:30:00Z',
    updatedAt: '2026-10-29T20:30:00Z',
    aiRiskScore: 45,
    aiRecommendedAction: 'Refund fee: Private Wealth tiers receive unlimited worldwide ATM reimbursement. Auto-approve $4.50 refund.',
    timeline: [{ stage: 'intake', timestamp: 'Oct 29, 20:30', author: 'Customer Service', note: 'Logged during concierge call' }],
  },
  {
    id: 'CM-4603',
    numericId: 10,
    category: 'Financial Statement',
    subCategory: 'Download',
    description: 'Interest earnings column missing from October consolidated wealth portfolio statement.',
    team: 'Operation',
    stage: 'triage',
    subStep: 'Dynamic Approval',
    priority: 'Medium',
    customerName: 'Helena Berg',
    customerEmail: 'hberg@stockholm-capital.se',
    accountNumber: '**** 8831',
    accountTier: 'Commercial Premier',
    slaHoursRemaining: 18.0,
    slaTotalHours: 48,
    createdAt: '2026-10-29T15:10:00Z',
    updatedAt: '2026-10-29T19:00:00Z',
    aiRiskScore: 50,
    aiRecommendedAction: 'Re-generate batch statements: Fiscal month-end accrued interest table had delayed sync with portfolio ledger.',
    timeline: [{ stage: 'triage', timestamp: 'Oct 29, 15:10', author: 'Triage System', note: 'Assigned to Ops Reporting' }],
  },
  {
    id: 'CM-4604',
    numericId: 11,
    category: 'Treasury Settlement',
    subCategory: 'Wire Transfer',
    description: 'SWIFT MT103 confirmation message delayed by 6 hours for $120k supplier settlement.',
    team: 'Treasury',
    stage: 'investigation',
    subStep: 'Dynamic In Progress',
    priority: 'Critical',
    customerName: 'Global Commodities Ltd',
    customerEmail: 'treasury@globalcom.com',
    accountNumber: '**** 9900',
    accountTier: 'Commercial Premier',
    slaHoursRemaining: 2.0,
    slaTotalHours: 12,
    createdAt: '2026-10-29T16:00:00Z',
    updatedAt: '2026-10-29T20:45:00Z',
    aiRiskScore: 95,
    aiRecommendedAction: 'High financial risk: Corresponding bank compliance hold in Frankfurt. Swift UETR tracking active, prompt response required.',
    aiDraftResponse: 'Dear Treasury Team,\n\nThe cross-border payment (UETR: 9e3f-4882-aa01) is currently undergoing standard intermediary screening at Deutsche Bank Frankfurt. We have submitted the supporting commercial invoice documentation. Release confirmation expected within 45 minutes.',
    timeline: [
      { stage: 'intake', timestamp: 'Oct 29, 16:00', author: 'Treasury Desk', note: 'Escalated by corporate client' },
      { stage: 'investigation', timestamp: 'Oct 29, 17:30', author: 'Treasury Officer Mueller', note: 'SWIFT wire trace executed' },
    ],
  },
  {
    id: 'CM-4605',
    numericId: 12,
    category: 'Financial Statement',
    subCategory: 'Tax Report',
    description: '1099-INT form showing discrepancy in tax withholding amount for secondary joint account.',
    team: 'Operation',
    stage: 'resolution',
    subStep: 'Dynamic Approval',
    priority: 'High',
    customerName: 'Thomas Wright',
    customerEmail: 'twright@wright-legal.com',
    accountNumber: '**** 1542',
    accountTier: 'Private Wealth',
    slaHoursRemaining: 5.0,
    slaTotalHours: 48,
    createdAt: '2026-10-28T10:00:00Z',
    updatedAt: '2026-10-29T18:30:00Z',
    aiRiskScore: 65,
    aiRecommendedAction: 'Tax revision approved: Corrected 1099-INT generated and signed off by Tax Compliance officer.',
    timeline: [
      { stage: 'intake', timestamp: 'Oct 28, 10:00', author: 'Tax portal', note: 'Customer query' },
      { stage: 'investigation', timestamp: 'Oct 28, 14:00', author: 'Tax Accounting', note: 'Discrepancy confirmed' },
      { stage: 'resolution', timestamp: 'Oct 29, 18:30', author: 'Supervisor Athar', note: 'Drafting resolution notice' },
    ],
  },
  {
    id: 'CM-4606',
    numericId: 13,
    category: 'Bank Account',
    subCategory: 'Saving Account',
    description: 'Tiered bonus interest rate not credited to High Yield account for September cycle.',
    team: 'Frontdesk',
    stage: 'closed',
    subStep: 'Dynamic Finalized',
    priority: 'Medium',
    customerName: 'Samantha Green',
    customerEmail: 'sgreen@greentech.ca',
    accountNumber: '**** 3021',
    accountTier: 'Retail Plus',
    slaHoursRemaining: 0,
    slaTotalHours: 48,
    createdAt: '2026-10-26T09:00:00Z',
    updatedAt: '2026-10-28T11:00:00Z',
    aiRiskScore: 30,
    aiRecommendedAction: 'Resolved: Interest adjustment of $142.18 posted and apology letter dispatched.',
    timeline: [
      { stage: 'intake', timestamp: 'Oct 26, 09:00', author: 'Frontdesk', note: 'Customer email' },
      { stage: 'closed', timestamp: 'Oct 28, 11:00', author: 'Frontdesk Lead', note: 'Credited and closed' },
    ],
  },
  {
    id: 'CM-4607',
    numericId: 14,
    category: 'Card',
    subCategory: 'Card Dispute',
    description: 'Fraudulent transaction of $430 from ride-hailing app abroad while physical card was in possession.',
    team: 'Operation',
    stage: 'investigation',
    subStep: 'Dynamic Status',
    priority: 'Critical',
    customerName: 'Arthur Pendelton',
    customerEmail: 'apendelton@heritage-estates.co.uk',
    accountNumber: '**** 8841',
    accountTier: 'Private Wealth',
    slaHoursRemaining: 4.0,
    slaTotalHours: 24,
    createdAt: '2026-10-29T14:00:00Z',
    updatedAt: '2026-10-29T19:00:00Z',
    aiRiskScore: 91,
    aiRecommendedAction: 'Card compromised: Merchant token cloned. Block card immediately, reissue titanium replacement, and file Visa dispute chargeback.',
    timeline: [
      { stage: 'intake', timestamp: 'Oct 29, 14:00', author: 'Fraud Shield Bot', note: 'Suspicious location flag triggered' },
      { stage: 'investigation', timestamp: 'Oct 29, 15:30', author: 'Fraud Investigator Ortiz', note: 'Customer confirmed unauthorized ride in Sao Paulo' },
    ],
  },
  {
    id: 'CM-4608',
    numericId: 15,
    category: 'Treasury Settlement',
    subCategory: 'FX Conversion',
    description: 'Disputed foreign exchange spread applied on commercial currency swap contract.',
    team: 'Treasury',
    stage: 'resolution',
    subStep: 'Dynamic Approval',
    priority: 'High',
    customerName: 'Nordic Import Co.',
    customerEmail: 'fx-desk@nordicimport.no',
    accountNumber: '**** 5122',
    accountTier: 'Commercial Premier',
    slaHoursRemaining: 7.5,
    slaTotalHours: 36,
    createdAt: '2026-10-28T16:00:00Z',
    updatedAt: '2026-10-29T17:00:00Z',
    aiRiskScore: 76,
    aiRecommendedAction: 'FX desk concession: Market rate adjustment of 15 basis points approved under volume relationship agreement.',
    timeline: [
      { stage: 'intake', timestamp: 'Oct 28, 16:00', author: 'FX Trading Desk', note: 'Ticket logged' },
      { stage: 'resolution', timestamp: 'Oct 29, 17:00', author: 'Treasury Chief', note: 'Signed discount approval memo' },
    ],
  },
];

export const AI_ACTION_ITEMS: AIActionItem[] = [
  {
    id: 'act-1',
    complaintId: 'CM-4581',
    title: 'Review urgent case CM-4581 (High Priority)',
    type: 'review',
    badge: 'High Priority',
    severity: 'high',
  },
  {
    id: 'act-2',
    complaintId: 'CM-3920',
    title: 'Generate initial response for case CM-3920',
    type: 'response',
    badge: 'Action Needed',
    severity: 'medium',
  },
  {
    id: 'act-3',
    complaintId: 'CM-4102',
    title: 'Verify KYC authentication flag on CM-4102',
    type: 'kyc',
    badge: 'Security Review',
    severity: 'high',
  },
  {
    id: 'act-4',
    complaintId: 'CM-4604',
    title: 'Expedite SWIFT wire hold clearance for CM-4604',
    type: 'escalation',
    badge: 'SLA Risk',
    severity: 'high',
  },
];

export const PERFORMANCE_INSIGHTS: PerformanceInsight[] = [
  {
    id: 'ins-1',
    metric: 'Investigation Phase Avg Duration',
    value: '18.4 hrs',
    change: '+12% this week',
    trend: 'up',
    isAlert: true,
  },
  {
    id: 'ins-2',
    metric: 'Overall Response Rate',
    value: '78.2%',
    change: '+3.4% vs monthly target',
    trend: 'up',
  },
  {
    id: 'ins-3',
    metric: 'First-Contact Resolution',
    value: '42.8%',
    change: '+1.5% improvement',
    trend: 'up',
  },
  {
    id: 'ins-4',
    metric: 'AI Triage Accuracy',
    value: '96.4%',
    change: 'Zero false negatives on Tier 1',
    trend: 'neutral',
  },
];

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'tmpl-investigation',
    title: 'Investigation Report Template',
    code: 'BANK-IR-2026',
    category: 'Internal Audit',
    description: 'Standard Banking Root Cause & Transaction Tracing documentation for operations and compliance review.',
    body: `BANK INVESTIGATION & ROOT-CAUSE REPORT
Case Reference: [CASE_ID]
Date of Incident: [INCIDENT_DATE]
Customer: [CUSTOMER_NAME] (Account: [ACCOUNT_NUM])
Account Classification: [ACCOUNT_TIER]
Investigating Officer: [OFFICER_NAME], Service Quality Governance

1. INCIDENT SUMMARY
A formal service quality exception was recorded regarding: [ISSUE_DESCRIPTION].
System logs and telemetry have been retrieved from core ledger endpoints.

2. TECHNICAL & OPERATIONAL FINDINGS
- Core Banking Ledger Status: Checked and timestamp-correlated.
- Telemetry & Gateway Logs: Confirmed latency/packet drop during authentication/settlement sequence.
- Compliance Assessment: Case falls under CFPB Regulation E / Banking Governance Standard ISO 10002.

3. REMEDIAL ACTIONS & REDRESS
- Operational correction executed: [REMEDIAL_ACTION]
- Restitution/Fee Waiver: [COMPENSATION_DETAILS]
- Preventive fix scheduled for core sprint release.

Investigating Officer Signature: _______________________
Supervisory Approval: _______________________`,
  },
  {
    id: 'tmpl-resolution',
    title: 'Final Resolution Letter',
    code: 'CUST-RES-04',
    category: 'Customer Correspondence',
    description: 'Official formal client remedy letter adhering to banking regulatory consumer disclosure standards.',
    body: `PRIVATE & CONFIDENTIAL

Date: [CURRENT_DATE]
To: [CUSTOMER_NAME]
Reference: Formal Resolution Notice — Case [CASE_ID]

Dear [CUSTOMER_NAME],

Thank you for your patience while our Service Quality Governance Committee conducted an exhaustive review into your recent complaint regarding [CATEGORY_NAME] ([SUB_CATEGORY]).

Following our internal audit and diagnostic verification with our banking operations team, we have completed our investigation and arrived at the following final resolution:

[AI_DRAFT_RESOLUTION]

We deeply value your banking relationship with our institution and regret any frustration this delay may have caused. As a demonstration of our commitment to excellence, any associated service charges have been credited back to your account ending in [ACCOUNT_NUM].

Should you have any further questions, you may contact your assigned case officer directly through the secure customer portal.

Yours sincerely,

Sehrish Athar
Head of Service Quality Governance & Customer Redress`,
  },
  {
    id: 'tmpl-regulatory',
    title: 'Regulatory Notice Response',
    code: 'REG-FDIC-CFPB',
    category: 'Regulatory Governance',
    description: 'Formal submission dossier for Central Bank, FDIC, and CFPB statutory complaint inquiries.',
    body: `REGULATORY SUPERVISORY INQUIRY RESPONSE
To: Consumer Financial Protection & Banking Regulatory Authority
From: Office of Chief Compliance & Governance
Subject: Response to Consumer Ingestion Case Reference [CASE_ID]

1. REGULATORY TIMELINE ADHERENCE
- Initial Intake Timestamp: [CREATED_DATE] (Compliant with 24-hour statutory acknowledgment requirement)
- Substantive Investigation Concluded: [UPDATED_DATE]
- Final Consumer Communication Dispatched: Within statutory 15-day ceiling.

2. INSTITUTIONAL STATEMENT OF FACTS & REMEDY
The institution conducted a forensic log analysis regarding [ISSUE_DESCRIPTION]. The transaction was reconciled, and the consumer has received full redress in accordance with 12 CFR Part 1005 (Regulation E).

Submitted by:
Service Quality Governance Directorate
Aegis Banking & Trust Corp.`,
  },
];
