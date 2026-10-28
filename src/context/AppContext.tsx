import React, { createContext, useContext, useState } from 'react'
import {
  Role,
  Application,
  ComplianceDocument,
  ComplianceObligation,
  EvcScheduleItem,
  AuditTrailEvent,
  Deficiency,
  ApplicationStage,
  ApplicationStatus,
  Region,
} from '../types'
import {
  mockApplications,
  mockComplianceDocuments,
  mockComplianceObligations,
  mockEvcSchedules,
  mockAuditTrailEvents,
  mockDeficiencies,
} from '../data/mockData'

interface AppContextType {
  currentRole: Role
  setRole: (role: Role) => void
  applications: Application[]
  documents: ComplianceDocument[]
  obligations: ComplianceObligation[]
  evcSchedules: EvcScheduleItem[]
  auditTrail: AuditTrailEvent[]
  deficiencies: Deficiency[]
  // Filters
  regionFilter: Region | 'All'
  setRegionFilter: (region: Region | 'All') => void
  stageFilter: ApplicationStage | 'All'
  setStageFilter: (stage: ApplicationStage | 'All') => void
  statusFilter: ApplicationStatus | 'All'
  setStatusFilter: (status: ApplicationStatus | 'All') => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  // Actions
  returnForDeficiency: (
    applicationId: string,
    reason: string,
    category: Deficiency['category'],
    severity: Deficiency['severity']
  ) => void
  resolveDeficiency: (deficiencyId: string, note?: string) => void
  advanceApplicationStage: (applicationId: string) => void
  updateObligationStatus: (obligationId: string, status: ComplianceObligation['status']) => void
  updateDocumentStatus: (documentId: string, status: ComplianceDocument['verificationStatus']) => void
  // Helpers
  getApplicationById: (id: string) => Application | undefined
  getAuditTrailForApp: (appId: string) => AuditTrailEvent[]
  getDeficienciesForApp: (appId: string) => Deficiency[]
  getEvcForApp: (appId: string) => EvcScheduleItem | undefined
  getDocumentsForApp: (institutionId: string) => ComplianceDocument[]
  getObligationsForApp: (institutionId: string) => ComplianceObligation[]
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setRole] = useState<Role>('Regional Officer')
  const [applications, setApplications] = useState<Application[]>(mockApplications)
  const [documents, setDocuments] = useState<ComplianceDocument[]>(mockComplianceDocuments)
  const [obligations, setObligations] = useState<ComplianceObligation[]>(mockComplianceObligations)
  const [evcSchedules, setEvcSchedules] = useState<EvcScheduleItem[]>(mockEvcSchedules)
  const [auditTrail, setAuditTrail] = useState<AuditTrailEvent[]>(mockAuditTrailEvents)
  const [deficiencies, setDeficiencies] = useState<Deficiency[]>(mockDeficiencies)

  // Filters
  const [regionFilter, setRegionFilter] = useState<Region | 'All'>('All')
  const [stageFilter, setStageFilter] = useState<ApplicationStage | 'All'>('All')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'All'>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const getApplicationById = (id: string) => {
    return applications.find((app) => app.id === id || app.applicationNumber === id)
  }

  const getAuditTrailForApp = (appId: string) => {
    return auditTrail
      .filter((evt) => evt.applicationId === appId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  const getDeficienciesForApp = (appId: string) => {
    return deficiencies.filter((def) => def.applicationId === appId)
  }

  const getEvcForApp = (appId: string) => {
    return evcSchedules.find((item) => item.applicationId === appId)
  }

  const getDocumentsForApp = (institutionId: string) => {
    return documents.filter((doc) => doc.institutionId === institutionId)
  }

  const getObligationsForApp = (institutionId: string) => {
    return obligations.filter((ob) => ob.institutionId === institutionId)
  }

  const returnForDeficiency = (
    applicationId: string,
    reason: string,
    category: Deficiency['category'],
    severity: Deficiency['severity']
  ) => {
    const app = applications.find((a) => a.id === applicationId)
    if (!app) return

    const now = new Date()
    const timestampStr = now.toISOString().replace('T', ' ').substring(0, 19)

    const newDeficiency: Deficiency = {
      id: `def-${Date.now()}`,
      applicationId,
      code: `DEF-${category.substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      category,
      description: reason,
      severity,
      issuedBy: `${currentRole} (Review Session)`,
      issuedDate: timestampStr.substring(0, 10),
      status: 'Open',
    }

    const newAuditEvent: AuditTrailEvent = {
      id: `evt-${Date.now()}`,
      applicationId,
      applicationNumber: app.applicationNumber,
      timestamp: timestampStr,
      eventType: 'deficiency_issued',
      actorName: `${currentRole} Action`,
      actorRole: currentRole,
      title: `Returned for Deficiency: ${category}`,
      description: reason,
      badgeText: 'Deficiency Issued',
    }

    setDeficiencies((prev) => [newDeficiency, ...prev])
    setAuditTrail((prev) => [newAuditEvent, ...prev])
    setApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? {
              ...a,
              deficienciesCount: a.deficienciesCount + 1,
              status: 'Approaching deadline',
            }
          : a
      )
    )
  }

  const resolveDeficiency = (deficiencyId: string, note?: string) => {
    const targetDef = deficiencies.find((d) => d.id === deficiencyId)
    if (!targetDef) return

    const now = new Date()
    const timestampStr = now.toISOString().replace('T', ' ').substring(0, 19)

    setDeficiencies((prev) =>
      prev.map((d) =>
        d.id === deficiencyId
          ? {
              ...d,
              status: 'Resolved',
              resolvedDate: timestampStr.substring(0, 10),
              remediationNote: note || d.remediationNote,
            }
          : d
      )
    )

    const targetApp = applications.find((a) => a.id === targetDef.applicationId)
    if (targetApp) {
      const newAuditEvent: AuditTrailEvent = {
        id: `evt-${Date.now()}`,
        applicationId: targetApp.id,
        applicationNumber: targetApp.applicationNumber,
        timestamp: timestampStr,
        eventType: 'deficiency_resolved',
        actorName: `${currentRole} Verification`,
        actorRole: currentRole,
        title: `Deficiency Resolved: ${targetDef.code}`,
        description: note || `Deficiency in category '${targetDef.category}' marked as resolved.`,
        badgeText: 'Resolved',
      }
      setAuditTrail((prev) => [newAuditEvent, ...prev])
      setApplications((prev) =>
        prev.map((a) =>
          a.id === targetApp.id
            ? {
                ...a,
                deficienciesCount: Math.max(0, a.deficienciesCount - 1),
                status: a.deficienciesCount <= 1 ? 'On track' : a.status,
              }
            : a
        )
      )
    }
  }

  const advanceApplicationStage = (applicationId: string) => {
    const app = applications.find((a) => a.id === applicationId)
    if (!app) return

    const stageOrder: ApplicationStage[] = ['Scrutiny', 'EVC', 'SAC/SHC', 'Decision', 'Post-Approval']
    const currentIndex = stageOrder.indexOf(app.currentStage)
    if (currentIndex >= stageOrder.length - 1) return

    const nextStage = stageOrder[currentIndex + 1]
    const now = new Date()
    const timestampStr = now.toISOString().replace('T', ' ').substring(0, 19)

    const newAuditEvent: AuditTrailEvent = {
      id: `evt-${Date.now()}`,
      applicationId,
      applicationNumber: app.applicationNumber,
      timestamp: timestampStr,
      eventType: 'stage_advanced',
      actorName: `${currentRole} Approval`,
      actorRole: currentRole,
      title: `Workflow Stage Advanced to ${nextStage}`,
      description: `Application progressed from ${app.currentStage} to ${nextStage} stage upon committee review.`,
      badgeText: 'Stage Advanced',
    }

    setAuditTrail((prev) => [newAuditEvent, ...prev])
    setApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? {
              ...a,
              currentStage: nextStage,
              daysInStage: 1,
              status: 'On track',
            }
          : a
      )
    )
  }

  const updateObligationStatus = (obligationId: string, status: ComplianceObligation['status']) => {
    setObligations((prev) =>
      prev.map((ob) =>
        ob.id === obligationId
          ? {
              ...ob,
              status,
              verifiedBy: status === 'Verified' ? `${currentRole} (Portal Auth)` : ob.verifiedBy,
            }
          : ob
      )
    )
  }

  const updateDocumentStatus = (documentId: string, status: ComplianceDocument['verificationStatus']) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? {
              ...doc,
              verificationStatus: status,
            }
          : doc
      )
    )
  }

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setRole,
        applications,
        documents,
        obligations,
        evcSchedules,
        auditTrail,
        deficiencies,
        regionFilter,
        setRegionFilter,
        stageFilter,
        setStageFilter,
        statusFilter,
        setStatusFilter,
        searchQuery,
        setSearchQuery,
        returnForDeficiency,
        resolveDeficiency,
        advanceApplicationStage,
        updateObligationStatus,
        updateDocumentStatus,
        getApplicationById,
        getAuditTrailForApp,
        getDeficienciesForApp,
        getEvcForApp,
        getDocumentsForApp,
        getObligationsForApp,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
