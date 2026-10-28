export type Role = 'Regional Officer' | 'Bureau Officer' | 'Committee Member' | 'Institution'

export type ApplicationStage = 'Scrutiny' | 'EVC' | 'SAC/SHC' | 'Decision' | 'Post-Approval'

export type ApplicationStatus = 'On track' | 'Approaching deadline' | 'Overdue'

export type Region = 'Northern (NRO)' | 'Southern (SRO)' | 'Western (WRO)' | 'Eastern (ERO)' | 'South-Western (SWRO)' | 'North-Western (NWRO)' | 'Central (CRO)'

export type ApplicationType = 
  | 'Extension of Approval (EoA)'
  | 'New Technical Institution'
  | 'Introduction of Emerging Courses'
  | 'Increase in Approved Intake'
  | 'Conversion to Co-ed'
  | 'Closure of Course/Programme'

export interface Institution {
  id: string
  name: string
  aictePermanentId: string
  region: Region
  state: string
  city: string
  type: 'University Constituent' | 'Autonomous Private' | 'Govt-Aided' | 'State Govt' | 'Private Unaided'
  establishedYear: number
  principalName: string
  contactEmail: string
  contactPhone: string
}

export interface Application {
  id: string
  applicationNumber: string
  institutionId: string
  institutionName: string
  region: Region
  academicYear: string
  type: ApplicationType
  currentStage: ApplicationStage
  daysInStage: number
  status: ApplicationStatus
  assignedOfficer: string
  submissionDate: string
  targetCompletionDate: string
  delayRiskScore: number // 0 - 100
  delayRiskLevel: 'High' | 'Moderate' | 'Low'
  predictedBottleneck: string
  historicalVarianceDays: number
  programCount: number
  proposedIntake: number
  deficienciesCount: number
  isFlaggedByAI: boolean
  aiFlagReason?: string
}

export type DocumentUrgency = 'Expired' | 'Critical (<30d)' | 'Approaching (30-60d)' | 'Moderate (60-90d)' | 'Valid (>90d)'

export interface ComplianceDocument {
  id: string
  institutionId: string
  institutionName: string
  documentName: string
  category: 'Land & Legal' | 'Building & Infrastructure' | 'Safety & Fire' | 'Statutory & Academic' | 'Financial & FDR'
  issuingAuthority: string
  issueDate: string
  expiryDate: string
  daysUntilExpiry: number
  urgency: DocumentUrgency
  verificationStatus: 'Verified' | 'Pending Verification' | 'Rejected'
  fileSize: string
  docReferenceNo: string
}

export type ObligationStatus = 'Open' | 'Submitted' | 'Verified' | 'Overdue'

export interface ComplianceObligation {
  id: string
  institutionId: string
  institutionName: string
  title: string
  description: string
  dueDate: string
  daysRemaining: number
  status: ObligationStatus
  category: 'Endowment/FDR' | 'Faculty/Cadre' | 'Campus Safety' | 'Statutory Committees' | 'Infrastructure'
  mandateReference: string
  submittedOn?: string
  verifiedBy?: string
}

export interface EvcScheduleItem {
  id: string
  applicationId: string
  applicationNumber: string
  institutionId: string
  institutionName: string
  region: Region
  scheduledDate: string
  daysUntilEvc: number // negative if overdue
  mode: 'Physical On-Site' | 'Hybrid / Remote Video'
  status: 'Scheduled' | 'Due This Week' | 'Overdue' | 'Completed'
  committeeChairman: string
  committeeMembers: string[]
  nodalOfficer: string
  venueAddress: string
  reportSubmissionDeadline: string
  isEscalated: boolean
  escalationReason?: string
}

export interface AuditTrailEvent {
  id: string
  applicationId: string
  applicationNumber: string
  timestamp: string
  eventType: 
    | 'submission'
    | 'ai_flag'
    | 'officer_review'
    | 'deficiency_issued'
    | 'deficiency_resolved'
    | 'stage_advanced'
    | 'evc_scheduled'
    | 'evc_report'
    | 'hearing_called'
    | 'reminder_sent'
    | 'decision_issued'
  actorName: string
  actorRole: string
  title: string
  description: string
  badgeText?: string
  metadata?: Record<string, string | number>
}

export interface Deficiency {
  id: string
  applicationId: string
  code: string
  category: 'Faculty Ratio' | 'Infrastructure Deficit' | 'Document Validity' | 'Legal/Land Discrepancy' | 'Financial Endowment'
  description: string
  severity: 'Major' | 'Minor' | 'Critical'
  issuedBy: string
  issuedDate: string
  resolvedDate?: string
  status: 'Open' | 'Resolved' | 'Under Review'
  remediationNote?: string
}
