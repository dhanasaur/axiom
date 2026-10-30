import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { mockApi } from '../services/mockApi'
import {
  ArrowLeft,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Shield,
  FileCheck,
  History,
  AlertCircle,
  ChevronRight,
  Download,
  MapPin,
  Activity,
  Loader2,
  Check,
} from 'lucide-react'
import { Stepper } from '../components/Common/Stepper'
import { StatusBadge, StageBadge, DocumentUrgencyBadge, ObligationBadge } from '../components/Common/StatusBadge'
import { DeficiencyModal } from '../components/Common/DeficiencyModal'
import { Deficiency, ApplicationStage } from '../types'

export const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { success, info } = useToast()
  const {
    getApplicationById,
    getAuditTrailForApp,
    getDeficienciesForApp,
    getEvcForApp,
    getDocumentsForApp,
    getObligationsForApp,
    returnForDeficiency,
    resolveDeficiency,
    advanceApplicationStage,
    updateObligationStatus,
    updateDocumentStatus,
  } = useApp()

  const [activeTab, setActiveTab] = useState<
    'overview' | 'documents' | 'deficiencies' | 'evc' | 'obligations' | 'audit'
  >('overview')

  const [isDeficiencyModalOpen, setIsDeficiencyModalOpen] = useState(false)
  const [resolutionNote, setResolutionNote] = useState('')
  const [selectedDefToResolve, setSelectedDefToResolve] = useState<string | null>(null)

  // Loading states for actions to simulate backend reality
  const [isAdvancing, setIsAdvancing] = useState(false)
  const [advanceCompleted, setAdvanceCompleted] = useState(false)
  const [loadingDocId, setLoadingDocId] = useState<string | null>(null)
  const [loadingObligationId, setLoadingObligationId] = useState<string | null>(null)
  const [isResolvingDef, setIsResolvingDef] = useState(false)

  const application = getApplicationById(id || '')

  if (!application) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-[#E6E2D5] max-w-lg mx-auto my-12 shadow-sm">
        <AlertTriangle className="w-10 h-10 text-[#E3432B] mx-auto mb-3" />
        <h2 className="text-lg font-display font-bold text-[#13161A] uppercase">Application Not Found</h2>
        <p className="text-xs text-[#626F84] mt-1 mb-6 font-sans">
          The requested case ID <span className="font-mono text-[#E3432B]">{id}</span> does not exist or has been archived.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1A1E24] text-white text-xs font-display font-bold uppercase hover:bg-[#E3432B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const auditEvents = getAuditTrailForApp(application.id)
  const appDeficiencies = getDeficienciesForApp(application.id)
  const evcSchedule = getEvcForApp(application.id)
  const appDocuments = getDocumentsForApp(application.institutionId)
  const appObligations = getObligationsForApp(application.institutionId)

  // Advance stage with deliberate realistic backend delay
  const handleAdvanceStage = async () => {
    if (isAdvancing || application.currentStage === 'Post-Approval') return
    setIsAdvancing(true)

    const stageOrder: ApplicationStage[] = ['Scrutiny', 'EVC', 'SAC/SHC', 'Decision', 'Post-Approval']
    const currentIndex = stageOrder.indexOf(application.currentStage)
    const nextStage = stageOrder[currentIndex + 1]

    try {
      await mockApi.advanceStage(application.id, application.currentStage, nextStage)
      advanceApplicationStage(application.id)
      setIsAdvancing(false)
      setAdvanceCompleted(true)
      success(
        'Workflow Stage Progressed',
        `Application ${application.applicationNumber} officially advanced to ${nextStage}.`
      )
      setTimeout(() => setAdvanceCompleted(false), 2000)
    } catch {
      setIsAdvancing(false)
    }
  }

  const handleReturnDeficiency = (
    reason: string,
    category: Deficiency['category'],
    severity: Deficiency['severity']
  ) => {
    returnForDeficiency(application.id, reason, category, severity)
    setActiveTab('audit')
  }

  const handleResolveDeficiencySubmit = async (defId: string) => {
    setIsResolvingDef(true)
    try {
      await mockApi.resolveDeficiency(defId, application.id, resolutionNote)
      resolveDeficiency(defId, resolutionNote || 'Remediation documents verified and accepted.')
      setSelectedDefToResolve(null)
      setResolutionNote('')
      setIsResolvingDef(false)
      success('Deficiency Remediation Accepted', `Deficiency ${defId} cleared from audit docket.`)
    } catch {
      setIsResolvingDef(false)
    }
  }

  const handleVerifyDocument = async (docId: string) => {
    setLoadingDocId(docId)
    try {
      await mockApi.verifyDocument(docId, 'Verified')
      updateDocumentStatus(docId, 'Verified')
      setLoadingDocId(null)
      success('Document Authenticated', 'Statutory compliance seal attached to document record.')
    } catch {
      setLoadingDocId(null)
    }
  }

  const handleUpdateObligation = async (obId: string, status: 'Submitted' | 'Verified') => {
    setLoadingObligationId(obId)
    try {
      await mockApi.updateObligation(obId, status)
      updateObligationStatus(obId, status)
      setLoadingObligationId(null)
      success(`Undertaking Marked ${status}`, 'Institutional compliance status updated in repository.')
    } catch {
      setLoadingObligationId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Back and Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-display font-semibold uppercase tracking-wider text-[#626F84] hover:text-[#E3432B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#8C99AE] uppercase text-[10px] font-display font-semibold">Case ID:</span>
          <span className="font-mono font-bold text-[#13161A] bg-white px-2 py-0.5 rounded border border-[#E6E2D5]">
            {application.applicationNumber}
          </span>
        </div>
      </div>

      {/* Case Header Card */}
      <div className="bg-white rounded-xl border border-[#E6E2D5] p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#F1EFE8] text-[#424C5D] border border-[#E6E2D5]">
                {application.region}
              </span>
              <StatusBadge status={application.status} />
              <StageBadge stage={application.currentStage} />
              {application.isFlaggedByAI && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full bg-[#FEECE9] text-[#E3432B] border border-[#F8B6AB] uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E3432B] pulse-ring-alert" />
                  Rule Discrepancy Flag
                </span>
              )}
            </div>

            <h1 className="text-xl md:text-2xl font-display font-extrabold text-[#13161A] leading-tight uppercase">
              {application.institutionName}
            </h1>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#626F84] font-sans">
              <span>
                Application Type: <strong className="text-[#13161A]">{application.type}</strong>
              </span>
              <span>/</span>
              <span>
                Assigned Officer: <strong className="text-[#13161A]">{application.assignedOfficer}</strong>
              </span>
              <span>/</span>
              <span>
                Submitted: <strong className="font-mono text-[#13161A]">{application.submissionDate}</strong>
              </span>
            </div>
          </div>

          {/* Quick Action Buttons with realistic loading states */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Return for Deficiency Button */}
            <button
              onClick={() => setIsDeficiencyModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-[#FEECE9] hover:bg-[#FCD8D2] text-[#E3432B] border border-[#F8B6AB] text-xs font-display font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Return for Deficiency</span>
            </button>

            {/* Advance Stage Button with deliberate delay */}
            {application.currentStage !== 'Post-Approval' && (
              <button
                onClick={handleAdvanceStage}
                disabled={isAdvancing}
                className="px-4 py-2 rounded-lg bg-[#1A1E24] hover:bg-[#2E3541] disabled:opacity-60 text-white text-xs font-display font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {isAdvancing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 text-[#E3432B] animate-spin" />
                    <span>Advancing Stage...</span>
                  </>
                ) : advanceCompleted ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Stage Advanced!</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Advance Stage</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Horizontal Stepper */}
      <Stepper
        currentStage={application.currentStage}
        daysInStage={application.daysInStage}
      />

      {/* Navigation Tabs */}
      <div className="rounded-xl border border-[#E6E2D5] bg-[#F1EFE8] p-1 flex items-center gap-1 overflow-x-auto shadow-xs">
        {[
          { key: 'overview', label: 'Overview', icon: Building2 },
          {
            key: 'documents',
            label: 'Documents',
            icon: FileCheck,
            count: appDocuments.length,
          },
          {
            key: 'deficiencies',
            label: 'Deficiencies',
            icon: AlertCircle,
            count: appDeficiencies.filter((d) => d.status === 'Open').length,
            alert: appDeficiencies.filter((d) => d.status === 'Open').length > 0,
          },
          {
            key: 'evc',
            label: 'EVC Schedule',
            icon: Calendar,
            badge: evcSchedule ? evcSchedule.status : 'None',
          },
          {
            key: 'obligations',
            label: 'Compliance Obligations',
            icon: Shield,
            count: appObligations.length,
          },
          {
            key: 'audit',
            label: 'Audit Trail',
            icon: History,
            count: auditEvents.length,
          },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-display font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#1A1E24] text-white shadow-sm'
                  : 'bg-transparent text-[#626F84] hover:text-[#13161A] hover:bg-white/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-2 py-0.2 rounded-full font-mono font-bold ${
                    tab.alert
                      ? 'bg-[#E3432B] text-white'
                      : isActive
                      ? 'bg-[#2E3541] text-[#E2E6EE]'
                      : 'bg-[#E6E2D5] text-[#424C5D]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Contents with Framer Motion Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Institution & Application Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl border border-[#E6E2D5] p-6 space-y-4 shadow-xs">
                  <h3 className="text-xs font-display font-bold uppercase tracking-wider text-[#13161A] flex items-center gap-2 border-b border-[#F1EFE8] pb-2.5">
                    <Building2 className="w-4 h-4 text-[#E3432B]" />
                    Institutional Dossier & Academic Scope
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 bg-[#FAF9F5] rounded-lg border border-[#F1EFE8]">
                      <span className="text-[#8C99AE] block text-[10px] font-display uppercase font-bold">
                        AICTE Permanent ID
                      </span>
                      <span className="font-mono font-bold text-[#13161A] text-sm mt-0.5 block">
                        {application.applicationNumber.split('/')[2] || '1-43289012'}
                      </span>
                    </div>
                    <div className="p-3.5 bg-[#FAF9F5] rounded-lg border border-[#F1EFE8]">
                      <span className="text-[#8C99AE] block text-[10px] font-display uppercase font-bold">
                        Academic Cycle
                      </span>
                      <span className="font-display font-bold text-[#13161A] text-sm mt-0.5 block">
                        {application.academicYear}
                      </span>
                    </div>
                    <div className="p-3.5 bg-[#FAF9F5] rounded-lg border border-[#F1EFE8]">
                      <span className="text-[#8C99AE] block text-[10px] font-display uppercase font-bold">
                        Proposed Total Intake
                      </span>
                      <span className="font-mono font-bold text-[#13161A] text-sm mt-0.5 block">
                        {application.proposedIntake} Students / Year
                      </span>
                    </div>
                    <div className="p-3.5 bg-[#FAF9F5] rounded-lg border border-[#F1EFE8]">
                      <span className="text-[#8C99AE] block text-[10px] font-display uppercase font-bold">
                        Active Academic Programmes
                      </span>
                      <span className="font-mono font-bold text-[#13161A] text-sm mt-0.5 block">
                        {application.programCount} Technical Programmes
                      </span>
                    </div>
                  </div>

                  {application.aiFlagReason && (
                    <div className="p-4 rounded-lg bg-[#FEECE9] border border-[#F8B6AB] space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-display font-bold text-[#E3432B] uppercase">
                        <AlertCircle className="w-4 h-4" />
                        Automated Scrutiny Rule Flag
                      </div>
                      <p className="text-xs text-[#991B1B] leading-relaxed font-sans">
                        {application.aiFlagReason}
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Status Timeline / Checklist */}
                <div className="bg-white rounded-xl border border-[#E6E2D5] p-6 space-y-4 shadow-xs">
                  <h3 className="text-xs font-display font-bold uppercase tracking-wider text-[#13161A] border-b border-[#F1EFE8] pb-2.5">
                    Regulatory Milestones
                  </h3>

                  <div className="space-y-2">
                    {[
                      {
                        stage: 'Online Application Filing & Fee Proof',
                        date: application.submissionDate,
                        status: 'Completed',
                        desc: 'Statutory fee and digital signatures authenticated.',
                      },
                      {
                        stage: 'Document Scrutiny (Zonal Committee)',
                        date: application.currentStage === 'Scrutiny' ? 'In Progress' : 'Completed',
                        status: application.currentStage === 'Scrutiny' ? 'Current' : 'Completed',
                        desc: 'Land title, fire NOC, building approval, and cadre ratio verification.',
                      },
                      {
                        stage: 'Expert Visit Committee (EVC)',
                        date: evcSchedule ? evcSchedule.scheduledDate : 'Pending Scrutiny Signoff',
                        status:
                          application.currentStage === 'Scrutiny'
                            ? 'Pending'
                            : application.currentStage === 'EVC'
                            ? 'Current'
                            : 'Completed',
                        desc: 'Physical verification of lab machinery, faculty biometric, and safety norms.',
                      },
                      {
                        stage: 'Standing Hearing / Appellate Committee (SAC)',
                        date: 'Scheduled on Appeal / Deficiency',
                        status:
                          application.currentStage === 'SAC/SHC'
                            ? 'Current'
                            : application.currentStage === 'Decision' || application.currentStage === 'Post-Approval'
                            ? 'Completed'
                            : 'Pending',
                        desc: 'Appellate hearing before retired high court justice and technical council.',
                      },
                      {
                        stage: 'Executive Approval Order & LoA',
                        date: application.targetCompletionDate,
                        status: application.currentStage === 'Post-Approval' ? 'Issued' : 'Pending',
                        desc: 'Official dispatch of AICTE Letter of Approval (LoA).',
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-[#FAF9F5] border border-[#F1EFE8]">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs font-mono shrink-0 mt-0.5 ${
                            item.status === 'Completed' || item.status === 'Issued'
                              ? 'bg-[#16A34A] text-white'
                              : item.status === 'Current'
                              ? 'bg-[#E3432B] text-white shadow-xs'
                              : 'bg-[#D8D2C2] text-[#626F84]'
                          }`}
                        >
                          {item.status === 'Completed' || item.status === 'Issued' ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-display font-bold text-xs text-[#13161A]">{item.stage}</span>
                            <span className="font-mono text-[11px] text-[#626F84]">{item.date}</span>
                          </div>
                          <p className="text-[11px] text-[#8C99AE] mt-0.5 font-sans">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Risk Forecast & Key Actions */}
              <div className="space-y-6">
                {/* Delay Risk Card with animated progress bar */}
                <div className="bg-[#1A1E24] text-white rounded-xl border border-[#2E3541] p-6 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#2E3541] pb-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#E3432B]" />
                      <span className="text-xs font-display uppercase font-bold tracking-wider text-[#BAC3D2]">
                        Delay Risk Forecast
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#E3432B] text-white">
                      RISK: {application.delayRiskScore}%
                    </span>
                  </div>

                  <div>
                    <div className="text-lg font-display font-bold text-[#FAF9F5] uppercase">
                      {application.delayRiskLevel} Delay Probability
                    </div>
                    {/* Animated Progress Bar */}
                    <div className="w-full bg-[#2E3541] h-2.5 rounded-full overflow-hidden mt-2.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${application.delayRiskScore}%` }}
                        transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
                        className={`h-full rounded-full ${
                          application.delayRiskScore > 70
                            ? 'bg-[#E3432B]'
                            : application.delayRiskScore > 40
                            ? 'bg-[#D97706]'
                            : 'bg-[#16A34A]'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#242B35] rounded-lg border border-[#2E3541] text-xs text-[#BAC3D2] leading-relaxed font-sans">
                    <strong className="block text-[#FAF9F5] font-display uppercase text-[10px] mb-1">
                      Likely Bottleneck:
                    </strong>
                    {application.predictedBottleneck}
                  </div>

                  <div className="text-[10px] text-[#8C99AE] uppercase tracking-wider border-t border-[#2E3541] pt-3 font-sans">
                    Statistical estimate — advisory only. Based on regional statutory historical medians.
                  </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="bg-white rounded-xl border border-[#E6E2D5] p-5 space-y-2 shadow-xs">
                  <h4 className="text-xs font-display font-bold uppercase tracking-wider text-[#13161A] border-b border-[#F1EFE8] pb-2">
                    Case Actions
                  </h4>

                  <button
                    onClick={() => setIsDeficiencyModalOpen(true)}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#F8B6AB] bg-[#FEECE9] hover:bg-[#FCD8D2] text-[#E3432B] text-xs font-display font-bold uppercase tracking-wider flex items-center justify-between transition-colors shadow-xs"
                  >
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Return for Deficiency
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTab('documents')}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#E6E2D5] bg-[#FAF9F5] hover:bg-[#F1EFE8] text-[#13161A] text-xs font-display font-bold uppercase tracking-wider flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-[#2563EB]" />
                      Uploaded Documents
                    </span>
                    <span className="text-[10px] bg-[#E6E2D5] px-2 py-0.5 rounded-full font-mono font-bold">
                      {appDocuments.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('audit')}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#E6E2D5] bg-[#FAF9F5] hover:bg-[#F1EFE8] text-[#13161A] text-xs font-display font-bold uppercase tracking-wider flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <History className="w-4 h-4 text-[#16A34A]" />
                      Audit Trail
                    </span>
                    <span className="text-[10px] bg-[#E6E2D5] px-2 py-0.5 rounded-full font-mono font-bold">
                      {auditEvents.length}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Documents */}
          {activeTab === 'documents' && (
            <div className="bg-white rounded-xl border border-[#E6E2D5] p-6 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1EFE8]">
                <div>
                  <h3 className="text-sm font-display font-bold uppercase tracking-wider text-[#13161A]">
                    Mandatory Uploaded Documents & Statutory Validity Countdown
                  </h3>
                  <p className="text-xs text-[#626F84] font-sans">
                    Proximity-based countdown (Critical &lt;30d, Approaching 30–60d, Valid &gt;90d)
                  </p>
                </div>
                <div className="text-xs text-[#8C99AE] font-mono">
                  Total Documents: <strong className="text-[#13161A]">{appDocuments.length}</strong>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF9F5] border-b border-[#E6E2D5] text-[11px] font-display font-semibold uppercase tracking-[0.08em] text-[#626F84]">
                      <th className="py-3 px-4">Document Title & Ref</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Issuing Authority</th>
                      <th className="py-3 px-4">Validity Countdown</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1EFE8]">
                    {appDocuments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-[#8C99AE]">
                          No statutory documents registered for this institution ID.
                        </td>
                      </tr>
                    ) : (
                      appDocuments.map((doc) => (
                        <tr key={doc.id} className="hover:bg-[#FAF9F5] transition-colors">
                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="font-display font-bold text-[#13161A]">{doc.documentName}</div>
                            <div className="font-mono text-[10px] text-[#8C99AE] mt-0.5">
                              Ref: {doc.docReferenceNo} / {doc.fileSize}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-[#424C5D] font-medium font-sans">{doc.category}</td>
                          <td className="py-3.5 px-4 text-[#626F84] font-sans">{doc.issuingAuthority}</td>
                          <td className="py-3.5 px-4">
                            <DocumentUrgencyBadge
                              urgency={doc.urgency}
                              daysRemaining={doc.daysUntilExpiry}
                            />
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                doc.verificationStatus === 'Verified'
                                  ? 'bg-[#EBF7F0] text-[#166534]'
                                  : doc.verificationStatus === 'Rejected'
                                  ? 'bg-[#FEECE9] text-[#B91C1C]'
                                  : 'bg-[#FEF3C7] text-[#92400E]'
                              }`}
                            >
                              {doc.verificationStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {doc.verificationStatus !== 'Verified' && (
                                <button
                                  onClick={() => handleVerifyDocument(doc.id)}
                                  disabled={loadingDocId === doc.id}
                                  className="px-3 py-1 rounded text-[11px] font-display font-bold bg-[#16A34A] text-white hover:bg-[#15803D] uppercase flex items-center gap-1 transition-colors"
                                >
                                  {loadingDocId === doc.id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    'Verify'
                                  )}
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  info(
                                    'Document Preview Loaded',
                                    `Opened ${doc.documentName} (Ref: ${doc.docReferenceNo})`
                                  )
                                }
                                className="p-1 rounded text-[#626F84] hover:text-[#13161A] hover:bg-[#F1EFE8] transition-colors"
                                title="Download document copy"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Deficiencies */}
          {activeTab === 'deficiencies' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#E6E2D5] shadow-xs">
                <div>
                  <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#13161A]">
                    Regulatory Deficiencies List
                  </h3>
                  <p className="text-xs text-[#626F84] font-sans">
                    Recorded deficits requiring applicant remediation before stage clearance
                  </p>
                </div>
                <button
                  onClick={() => setIsDeficiencyModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-[#E3432B] hover:bg-[#C93520] text-white text-xs font-display font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Issue New Deficiency</span>
                </button>
              </div>

              <div className="space-y-3">
                {appDeficiencies.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-xl border border-[#E6E2D5] text-[#8C99AE] shadow-xs">
                    <CheckCircle2 className="w-10 h-10 text-[#16A34A] mx-auto mb-2" />
                    <h4 className="font-display font-bold text-sm text-[#13161A] uppercase">
                      Zero Outstanding Deficiencies
                    </h4>
                    <p className="text-xs text-[#626F84] mt-1 font-sans">
                      All statutory norms currently met. No pending corrective items.
                    </p>
                  </div>
                ) : (
                  appDeficiencies.map((def) => (
                    <div
                      key={def.id}
                      className={`bg-white rounded-xl border p-5 transition-all shadow-xs ${
                        def.status === 'Open'
                          ? 'border-[#FCA5A5] bg-[#FFFBFB] border-l-4 border-l-[#E3432B]'
                          : 'border-[#E6E2D5]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#F1EFE8] text-[#13161A]">
                              {def.code}
                            </span>
                            <span
                              className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                def.severity === 'Critical'
                                  ? 'bg-[#FEECE9] text-[#E3432B] border border-[#F8B6AB]'
                                  : def.severity === 'Major'
                                  ? 'bg-[#FEF3C7] text-[#92400E]'
                                  : 'bg-[#EFF6FF] text-[#1E40AF]'
                              }`}
                            >
                              {def.severity} Severity
                            </span>
                            <span className="text-xs text-[#8C99AE] font-sans">/ {def.category}</span>
                          </div>
                          <h4 className="font-display text-sm font-bold text-[#13161A] mt-1">{def.description}</h4>
                          <p className="text-xs text-[#626F84] mt-1 font-sans">
                            <strong>Remediation:</strong> {def.remediationNote || 'Applicant upload required.'}
                          </p>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                              def.status === 'Resolved'
                                ? 'bg-[#EBF7F0] text-[#166534]'
                                : 'bg-[#FEECE9] text-[#E3432B]'
                            }`}
                          >
                            {def.status}
                          </span>
                          <span className="text-[10px] text-[#8C99AE] font-mono">
                            Issued: {def.issuedDate}
                          </span>
                        </div>
                      </div>

                      {def.status === 'Open' && (
                        <div className="mt-4 pt-4 border-t border-[#F1EFE8] flex items-center justify-between">
                          <span className="text-xs text-[#8C99AE] font-sans">Issued by: {def.issuedBy}</span>
                          {selectedDefToResolve === def.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={resolutionNote}
                                onChange={(e) => setResolutionNote(e.target.value)}
                                placeholder="Resolution verification note..."
                                className="text-xs px-3 py-1.5 rounded-md border border-[#1A1E24] w-64 font-sans"
                              />
                              <button
                                onClick={() => handleResolveDeficiencySubmit(def.id)}
                                disabled={isResolvingDef}
                                className="px-3 py-1.5 rounded-md bg-[#16A34A] text-white text-xs font-display font-bold uppercase hover:bg-[#15803D] flex items-center gap-1"
                              >
                                {isResolvingDef ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Confirm'}
                              </button>
                              <button
                                onClick={() => setSelectedDefToResolve(null)}
                                className="px-2 py-1.5 text-xs text-[#626F84] uppercase font-display font-semibold"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setSelectedDefToResolve(def.id)}
                              className="px-3 py-1.5 rounded-md bg-[#FAF9F5] hover:bg-[#F1EFE8] border border-[#D8D2C2] text-xs font-display font-bold uppercase text-[#13161A] transition-colors"
                            >
                              Mark as Resolved
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab 4: EVC Schedule */}
          {activeTab === 'evc' && (
            <div className="bg-white rounded-xl border border-[#E6E2D5] p-6 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F1EFE8]">
                <div>
                  <h3 className="text-sm font-display font-bold uppercase tracking-wider text-[#13161A]">
                    Expert Visit Committee (EVC) Dossier
                  </h3>
                  <p className="text-xs text-[#626F84] font-sans">
                    Peer inspection constitution, member roster, and deadline monitoring
                  </p>
                </div>
                {evcSchedule && (
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      evcSchedule.isEscalated
                        ? 'bg-[#E3432B] text-white'
                        : 'bg-[#EBF7F0] text-[#166534]'
                    }`}
                  >
                    {evcSchedule.isEscalated ? 'Escalated to Member Secretary' : evcSchedule.status}
                  </span>
                )}
              </div>

              {!evcSchedule ? (
                <div className="p-12 text-center text-[#8C99AE] space-y-2">
                  <Calendar className="w-10 h-10 text-[#D8D2C2] mx-auto" />
                  <h4 className="text-sm font-display font-bold text-[#13161A] uppercase">
                    EVC Not Yet Scheduled
                  </h4>
                  <p className="text-xs text-[#626F84] font-sans">
                    This case is currently at the {application.currentStage} stage. Committee scheduling initiates after Scrutiny clearance.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {evcSchedule.isEscalated && (
                    <div className="p-4 rounded-lg bg-[#FEECE9] border border-[#F8B6AB] flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-[#E3432B] shrink-0 mt-0.5" />
                      <div className="text-xs text-[#991B1B] font-sans">
                        <strong className="block font-bold uppercase font-display">Zonal Escalation Triggered</strong>
                        {evcSchedule.escalationReason}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-4 bg-[#FAF9F5] rounded-lg border border-[#F1EFE8]">
                      <span className="text-[#8C99AE] block text-[10px] font-display uppercase font-bold">
                        Scheduled Visit Date
                      </span>
                      <span className="font-mono font-bold text-base text-[#13161A] mt-1 block">
                        {evcSchedule.scheduledDate}
                      </span>
                      <span className="text-[11px] text-[#E3432B] font-bold mt-1 block uppercase">
                        {evcSchedule.daysUntilEvc >= 0
                          ? `${evcSchedule.daysUntilEvc} days remaining`
                          : `${Math.abs(evcSchedule.daysUntilEvc)} days overdue`}
                      </span>
                    </div>

                    <div className="p-4 bg-[#FAF9F5] rounded-lg border border-[#F1EFE8]">
                      <span className="text-[#8C99AE] block text-[10px] font-display uppercase font-bold">
                        Inspection Mode
                      </span>
                      <span className="font-display font-bold text-base text-[#13161A] mt-1 block uppercase">
                        {evcSchedule.mode}
                      </span>
                      <span className="text-[11px] text-[#626F84] mt-1 block font-sans">
                        Geo-fenced reporting mandatory
                      </span>
                    </div>

                    <div className="p-4 bg-[#FAF9F5] rounded-lg border border-[#F1EFE8]">
                      <span className="text-[#8C99AE] block text-[10px] font-display uppercase font-bold">
                        Report Submission Deadline
                      </span>
                      <span className="font-mono font-bold text-base text-[#13161A] mt-1 block">
                        {evcSchedule.reportSubmissionDeadline}
                      </span>
                      <span className="text-[11px] text-[#626F84] mt-1 block font-sans">
                        Nodal Officer: {evcSchedule.nodalOfficer}
                      </span>
                    </div>
                  </div>

                  {/* Committee Members Panel */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-display font-bold uppercase tracking-wider text-[#13161A]">
                      Constituted Peer Experts Panel
                    </h4>
                    <div className="p-4 bg-[#FAF9F5] rounded-lg border border-[#E6E2D5] space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-[#E3432B] uppercase font-display">Chairman:</span>
                        <span className="font-semibold text-[#13161A] font-sans">{evcSchedule.committeeChairman}</span>
                      </div>
                      {evcSchedule.committeeMembers.map((member, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#424C5D] pl-2 border-l-2 border-[#1A1E24]">
                          <span className="text-[#8C99AE] uppercase text-[10px] font-display">Member {i + 1}:</span>
                          <span className="font-sans">{member}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Venue Address */}
                  <div className="p-4 bg-[#FAF9F5] rounded-lg border border-[#E6E2D5] flex items-start gap-2.5 text-xs">
                    <MapPin className="w-4 h-4 text-[#E3432B] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#13161A] block uppercase text-[10px] font-display">Campus Inspection Location:</strong>
                      <span className="text-[#626F84] font-sans">{evcSchedule.venueAddress}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Compliance Obligations */}
          {activeTab === 'obligations' && (
            <div className="bg-white rounded-xl border border-[#E6E2D5] p-6 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1EFE8]">
                <div>
                  <h3 className="text-sm font-display font-bold uppercase tracking-wider text-[#13161A]">
                    Post-Approval Compliance & Statutory Undertakings
                  </h3>
                  <p className="text-xs text-[#626F84] font-sans">
                    Status chips (Open / Submitted / Verified / Overdue) with due dates
                  </p>
                </div>
                <div className="text-xs font-mono text-[#8C99AE]">
                  Obligations: <strong className="text-[#13161A]">{appObligations.length}</strong>
                </div>
              </div>

              <div className="space-y-3">
                {appObligations.length === 0 ? (
                  <div className="p-8 text-center text-[#8C99AE]">
                    No compliance obligations mapped for this institution.
                  </div>
                ) : (
                  appObligations.map((ob) => (
                    <div
                      key={ob.id}
                      className="p-4 bg-[#FAF9F5] rounded-lg border border-[#E6E2D5] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <ObligationBadge status={ob.status} />
                          <span className="text-[10px] uppercase font-bold text-[#8C99AE] bg-[#F1EFE8] px-2 py-0.5 rounded border border-[#E6E2D5]">
                            {ob.category}
                          </span>
                          <span className="text-[10px] font-mono text-[#626F84]">
                            Ref: {ob.mandateReference}
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-sm text-[#13161A]">{ob.title}</h4>
                        <p className="text-[#626F84] leading-relaxed font-sans">{ob.description}</p>
                        {ob.verifiedBy && (
                          <span className="text-[11px] text-[#16A34A] block font-mono">
                            Verified by: {ob.verifiedBy}
                          </span>
                        )}
                      </div>

                      <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0">
                        <div>
                          <span className="text-[10px] text-[#8C99AE] block text-right uppercase font-display">Due Date</span>
                          <span className="font-mono font-bold text-xs text-[#13161A] block">
                            {ob.dueDate}
                          </span>
                          <span
                            className={`text-[10px] font-bold block text-right uppercase ${
                              ob.daysRemaining < 0
                                ? 'text-[#E3432B]'
                                : ob.daysRemaining <= 10
                                ? 'text-[#D97706]'
                                : 'text-[#16A34A]'
                            }`}
                          >
                            {ob.daysRemaining < 0
                              ? `${Math.abs(ob.daysRemaining)}d overdue`
                              : `${ob.daysRemaining}d remaining`}
                          </span>
                        </div>

                        {ob.status !== 'Verified' && (
                          <div className="flex items-center gap-1.5 mt-2">
                            {ob.status === 'Open' && (
                              <button
                                onClick={() => handleUpdateObligation(ob.id, 'Submitted')}
                                disabled={loadingObligationId === ob.id}
                                className="px-3 py-1 rounded text-[11px] font-display font-bold bg-[#2563EB] text-white hover:bg-[#1D4ED8] uppercase flex items-center gap-1"
                              >
                                {loadingObligationId === ob.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Mark Submitted'}
                              </button>
                            )}
                            <button
                              onClick={() => handleUpdateObligation(ob.id, 'Verified')}
                              disabled={loadingObligationId === ob.id}
                              className="px-3 py-1 rounded text-[11px] font-display font-bold bg-[#16A34A] text-white hover:bg-[#15803D] uppercase flex items-center gap-1"
                            >
                              {loadingObligationId === ob.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Verify Proof'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab 6: Audit Trail */}
          {activeTab === 'audit' && (
            <div className="bg-white rounded-xl border border-[#E6E2D5] p-6 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1EFE8]">
                <div>
                  <h3 className="text-sm font-display font-bold uppercase tracking-wider text-[#13161A]">
                    Reverse-Chronological Statutory Audit Trail
                  </h3>
                  <p className="text-xs text-[#626F84] font-sans">
                    Immutable event stream of submissions, rule reviews, deficiency returns, and committee orders
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#1A1E24] text-white">
                  {auditEvents.length} Recorded Events
                </span>
              </div>

              <div className="space-y-3">
                {auditEvents.map((evt, idx) => (
                  <motion.div
                    key={evt.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.04 }}
                    className="bg-[#FAF9F5] p-4 rounded-lg border border-[#E6E2D5] text-xs space-y-1.5 border-l-4 border-l-[#1A1E24]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-[#13161A] text-sm">{evt.title}</span>
                        {evt.badgeText && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E6E2D5] text-[#303742] uppercase font-mono">
                            {evt.badgeText}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[11px] text-[#8C99AE]">{evt.timestamp}</span>
                    </div>

                    <p className="text-[#424C5D] leading-relaxed font-sans">{evt.description}</p>

                    <div className="pt-2 border-t border-[#F1EFE8] flex items-center justify-between text-[11px] text-[#8C99AE] font-sans">
                      <span>
                        Actor: <strong className="text-[#303742]">{evt.actorName}</strong> ({evt.actorRole})
                      </span>
                      <span className="font-mono text-[10px]">ID: {evt.id}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Deficiency Modal */}
      <DeficiencyModal
        isOpen={isDeficiencyModalOpen}
        onClose={() => setIsDeficiencyModalOpen(false)}
        applicationNumber={application.applicationNumber}
        institutionName={application.institutionName}
        onSubmit={handleReturnDeficiency}
      />
    </div>
  )
}
