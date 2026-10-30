import {
  Application,
  ComplianceDocument,
  ComplianceObligation,
  EvcScheduleItem,
  AuditTrailEvent,
  Deficiency,
  Region,
  ApplicationStage,
  ApplicationStatus,
} from '../types'
import {
  mockApplications,
  mockComplianceDocuments,
  mockComplianceObligations,
  mockEvcSchedules,
} from '../data/mockData'

// Helpers for deliberate realistic delays
export const sleep = (minMs: number, maxMs: number = minMs): Promise<void> => {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Track failure count for export simulation so first time can fail and retry succeeds
let exportAttempts = 0

export const mockApi = {
  // Read operations (400 - 900ms simulated latency)
  async getApplications(filters?: {
    region?: Region | 'All'
    stage?: ApplicationStage | 'All'
    status?: ApplicationStatus | 'All'
    search?: string
  }): Promise<Application[]> {
    await sleep(350, 750)
    let list = [...mockApplications]

    if (filters) {
      if (filters.region && filters.region !== 'All') {
        list = list.filter((a) => a.region === filters.region)
      }
      if (filters.stage && filters.stage !== 'All') {
        list = list.filter((a) => a.currentStage === filters.stage)
      }
      if (filters.status && filters.status !== 'All') {
        list = list.filter((a) => a.status === filters.status)
      }
      if (filters.search && filters.search.trim()) {
        const q = filters.search.toLowerCase()
        list = list.filter(
          (a) =>
            a.institutionName.toLowerCase().includes(q) ||
            a.applicationNumber.toLowerCase().includes(q) ||
            a.assignedOfficer.toLowerCase().includes(q)
        )
      }
    }
    return list
  },

  async getApplicationById(id: string): Promise<Application | null> {
    await sleep(300, 600)
    const app = mockApplications.find((a) => a.id === id || a.applicationNumber === id)
    return app ? { ...app } : null
  },

  async getEvcSchedules(): Promise<EvcScheduleItem[]> {
    await sleep(350, 700)
    return [...mockEvcSchedules]
  },

  async getComplianceData(): Promise<{
    documents: ComplianceDocument[]
    obligations: ComplianceObligation[]
  }> {
    await sleep(400, 800)
    return {
      documents: [...mockComplianceDocuments],
      obligations: [...mockComplianceObligations],
    }
  },

  // Write operations (800 - 1600ms simulated latency)
  async advanceStage(applicationId: string, currentStage: ApplicationStage, nextStage: ApplicationStage): Promise<{ success: boolean; newStage: ApplicationStage; event: AuditTrailEvent }> {
    await sleep(900, 1500)
    const now = new Date()
    const timestampStr = now.toISOString().replace('T', ' ').substring(0, 19)

    const event: AuditTrailEvent = {
      id: `evt-${Date.now()}`,
      applicationId,
      applicationNumber: applicationId,
      timestamp: timestampStr,
      eventType: 'stage_advanced',
      actorName: 'Statutory Review Panel',
      actorRole: 'Reviewing Authority',
      title: `Workflow Stage Advanced to ${nextStage}`,
      description: `Application progressed from ${currentStage} to ${nextStage} stage upon committee review.`,
      badgeText: 'Stage Advanced',
    }
    return { success: true, newStage: nextStage, event }
  },

  async returnForDeficiency(
    applicationId: string,
    reason: string,
    category: Deficiency['category'],
    severity: Deficiency['severity'],
    role: string
  ): Promise<{ success: boolean; deficiency: Deficiency; event: AuditTrailEvent }> {
    await sleep(1000, 1600)
    const now = new Date()
    const timestampStr = now.toISOString().replace('T', ' ').substring(0, 19)

    const deficiency: Deficiency = {
      id: `def-${Date.now()}`,
      applicationId,
      code: `DEF-${category.substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      category,
      description: reason,
      severity,
      issuedBy: `${role} (Review Session)`,
      issuedDate: timestampStr.substring(0, 10),
      status: 'Open',
    }

    const event: AuditTrailEvent = {
      id: `evt-${Date.now()}`,
      applicationId,
      applicationNumber: applicationId,
      timestamp: timestampStr,
      eventType: 'deficiency_issued',
      actorName: `${role} Action`,
      actorRole: role,
      title: `Returned for Deficiency: ${category}`,
      description: reason,
      badgeText: 'Deficiency Issued',
    }

    return { success: true, deficiency, event }
  },

  async resolveDeficiency(
    deficiencyId: string,
    appId: string,
    note?: string
  ): Promise<{ success: boolean; resolvedDate: string; event: AuditTrailEvent }> {
    await sleep(800, 1400)
    const now = new Date()
    const timestampStr = now.toISOString().replace('T', ' ').substring(0, 19)

    const event: AuditTrailEvent = {
      id: `evt-${Date.now()}`,
      applicationId: appId,
      applicationNumber: appId,
      timestamp: timestampStr,
      eventType: 'deficiency_resolved',
      actorName: 'Verification Officer',
      actorRole: 'Regional Officer',
      title: `Deficiency Rectification Accepted: ${deficiencyId}`,
      description: note || 'Remediation documentation submitted and verified compliant.',
      badgeText: 'Resolved',
    }

    return { success: true, resolvedDate: timestampStr.substring(0, 10), event }
  },

  async updateObligation(
    obligationId: string,
    status: ComplianceObligation['status']
  ): Promise<{ success: boolean; status: ComplianceObligation['status'] }> {
    await sleep(700, 1300)
    return { success: true, status }
  },

  async verifyDocument(
    documentId: string,
    status: ComplianceDocument['verificationStatus']
  ): Promise<{ success: boolean; status: ComplianceDocument['verificationStatus'] }> {
    await sleep(650, 1200)
    return { success: true, status }
  },

  async scheduleEvcVisit(
    evcId: string,
    data: Partial<EvcScheduleItem>
  ): Promise<{ success: boolean; schedule: Partial<EvcScheduleItem> }> {
    await sleep(800, 1500)
    return { success: true, schedule: data }
  },

  // Export Statutory Digest with simulated transient failure
  async exportStatutoryDigest(): Promise<{ success: boolean; downloadUrl?: string; filename?: string }> {
    await sleep(1100, 1800)
    exportAttempts++
    // Fail on 1st attempt to simulate realistic backend failure with retry, then succeed
    if (exportAttempts === 1) {
      throw new Error('AICTE PDF Compilation Gateway timeout (Code 504: Gateway Busy). Please retry.')
    }
    return {
      success: true,
      downloadUrl: '#',
      filename: `AICTE-Statutory-Digest-AY2026-27-${new Date().toISOString().substring(0, 10)}.pdf`,
    }
  },
}
