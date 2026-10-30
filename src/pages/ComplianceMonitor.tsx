import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { mockApi } from '../services/mockApi'
import {
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  Clock,
  Search,
  ShieldAlert,
  Loader2,
} from 'lucide-react'
import { DocumentUrgencyBadge, ObligationBadge } from '../components/Common/StatusBadge'
import { CountUp } from '../components/Common/CountUp'
import { DocumentUrgency, ObligationStatus } from '../types'

export const ComplianceMonitor: React.FC = () => {
  const { documents, obligations, updateDocumentStatus, updateObligationStatus } = useApp()
  const { success } = useToast()

  const [activeSubTab, setActiveSubTab] = useState<'documents' | 'obligations'>('documents')
  const [urgencyFilter, setUrgencyFilter] = useState<DocumentUrgency | 'All'>('All')
  const [obligationStatusFilter, setObligationStatusFilter] = useState<ObligationStatus | 'All'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null)

  // Documents sorted by urgency: Expired first, then lowest daysUntilExpiry
  const sortedDocuments = useMemo(() => {
    return [...documents]
      .filter((doc) => {
        if (urgencyFilter !== 'All' && doc.urgency !== urgencyFilter) return false
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          return (
            doc.documentName.toLowerCase().includes(q) ||
            doc.institutionName.toLowerCase().includes(q) ||
            doc.docReferenceNo.toLowerCase().includes(q)
          )
        }
        return true
      })
      .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)
  }, [documents, urgencyFilter, searchQuery])

  // Obligations sorted by urgency: Overdue first, then lowest daysRemaining
  const sortedObligations = useMemo(() => {
    return [...obligations]
      .filter((ob) => {
        if (obligationStatusFilter !== 'All' && ob.status !== obligationStatusFilter) return false
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          return (
            ob.title.toLowerCase().includes(q) ||
            ob.institutionName.toLowerCase().includes(q) ||
            ob.mandateReference.toLowerCase().includes(q)
          )
        }
        return true
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining)
  }, [obligations, obligationStatusFilter, searchQuery])

  const expiredDocsCount = documents.filter((d) => d.daysUntilExpiry < 0).length
  const critical30DocsCount = documents.filter(
    (d) => d.daysUntilExpiry >= 0 && d.daysUntilExpiry <= 30
  ).length
  const approaching60DocsCount = documents.filter(
    (d) => d.daysUntilExpiry > 30 && d.daysUntilExpiry <= 60
  ).length
  const overdueObsCount = obligations.filter((o) => o.status === 'Overdue').length

  const handleVerifyDoc = async (id: string, name: string) => {
    setLoadingActionId(id)
    try {
      await mockApi.verifyDocument(id, 'Verified')
      updateDocumentStatus(id, 'Verified')
      setLoadingActionId(null)
      success('Statutory Document Verified', `${name} verified and approved.`)
    } catch {
      setLoadingActionId(null)
    }
  }

  const handleUpdateObligation = async (id: string, title: string, status: ObligationStatus) => {
    setLoadingActionId(id)
    try {
      await mockApi.updateObligation(id, status)
      updateObligationStatus(id, status)
      setLoadingActionId(null)
      success(`Undertaking Marked ${status}`, `${title} compliance status updated.`)
    } catch {
      setLoadingActionId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-[#1A1E24] text-white p-6 rounded-xl border border-[#2E3541] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-display uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-[#E3432B] text-white">
              National Compliance Watch
            </span>
            <span className="text-xs text-[#8C99AE] font-mono">/ 90-60-30 Day Surveillance</span>
          </div>
          <h1 className="text-xl md:text-2xl font-display font-extrabold tracking-tight text-[#FAF9F5] uppercase">
            Compliance & Document Validity Monitor
          </h1>
          <p className="text-xs text-[#8C99AE] mt-1 font-sans">
            Centralized register across all technical institutions tracking statutory lease deeds, fire NOCs, 
            joint FDR renewals, and biometric faculty rosters.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-[#242B35] p-1 rounded-lg border border-[#2E3541] shadow-inner">
          <button
            onClick={() => setActiveSubTab('documents')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-display font-bold uppercase tracking-wider transition-all ${
              activeSubTab === 'documents'
                ? 'bg-[#E3432B] text-white shadow-sm'
                : 'text-[#BAC3D2] hover:text-white'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Document Expiry ({documents.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('obligations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-display font-bold uppercase tracking-wider transition-all ${
              activeSubTab === 'obligations'
                ? 'bg-[#E3432B] text-white shadow-sm'
                : 'text-[#BAC3D2] hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Undertakings ({obligations.length})</span>
          </button>
        </div>
      </motion.div>

      {/* Countdown Urgency System Metric Cards with CountUp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => {
            setActiveSubTab('documents')
            setUrgencyFilter('Expired')
          }}
          className="p-4 bg-white rounded-xl border border-[#F8B6AB] border-l-4 border-l-[#E3432B] cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-bold uppercase tracking-wider text-[#E3432B]">
              Expired Documents
            </span>
            <span className="p-1.5 rounded-md bg-[#FEECE9] text-[#E3432B]">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-[#E3432B]">
            <CountUp value={expiredDocsCount} /> Documents
          </div>
          <span className="text-[11px] text-[#8C99AE] mt-1 block font-sans">
            Immediate show-cause threshold
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => {
            setActiveSubTab('documents')
            setUrgencyFilter('Critical (<30d)')
          }}
          className="p-4 bg-white rounded-xl border border-[#FDE68A] border-l-4 border-l-[#D97706] cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-bold uppercase tracking-wider text-[#D97706]">
              Critical Window (&lt;30 Days)
            </span>
            <span className="p-1.5 rounded-md bg-[#FEF3C7] text-[#D97706]">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-[#13161A]">
            <CountUp value={critical30DocsCount} /> Documents
          </div>
          <span className="text-[11px] text-[#8C99AE] mt-1 block font-sans">
            Automated SMS alert dispatched
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => {
            setActiveSubTab('documents')
            setUrgencyFilter('Approaching (30-60d)')
          }}
          className="p-4 bg-white rounded-xl border border-[#E6E2D5] border-l-4 border-l-[#CA8A04] cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-bold uppercase tracking-wider text-[#CA8A04]">
              Approaching (30–60 Days)
            </span>
            <span className="p-1.5 rounded-md bg-[#FEF9C3] text-[#CA8A04]">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-[#13161A]">
            <CountUp value={approaching60DocsCount} /> Documents
          </div>
          <span className="text-[11px] text-[#8C99AE] mt-1 block font-sans">
            Pre-notice renewal stage
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => {
            setActiveSubTab('obligations')
            setObligationStatusFilter('Overdue')
          }}
          className="p-4 bg-white rounded-xl border border-[#FCA5A5] border-l-4 border-l-[#E3432B] cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-bold uppercase tracking-wider text-[#E3432B]">
              Overdue Undertakings
            </span>
            <span className="p-1.5 rounded-md bg-[#FEECE9] text-[#E3432B]">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-[#13161A]">
            <CountUp value={overdueObsCount} /> Undertakings
          </div>
          <span className="text-[11px] text-[#8C99AE] mt-1 block font-sans">
            FDR & AEBAS non-compliance
          </span>
        </motion.div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl border border-[#E6E2D5] shadow-xs overflow-hidden">
        {/* Table Filters */}
        <div className="p-4 border-b border-[#F1EFE8] bg-[#FAF9F5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#8C99AE] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, institution, or reference..."
              className="w-full bg-white pl-9 pr-3 py-2 rounded-lg border border-[#D8D2C2] focus:outline-none focus:border-[#E3432B] font-sans"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {activeSubTab === 'documents' ? (
              <div className="flex items-center gap-2">
                <span className="text-[#626F84] font-display font-bold uppercase tracking-wider text-[11px]">Urgency:</span>
                <select
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value as any)}
                  className="bg-white px-3 py-2 rounded-lg border border-[#D8D2C2] focus:outline-none focus:border-[#E3432B] font-sans"
                >
                  <option value="All">All Validity Tiers</option>
                  <option value="Expired">Expired (&lt;0d)</option>
                  <option value="Critical (<30d)">Critical (&lt;30d)</option>
                  <option value="Approaching (30-60d)">Approaching (30–60d)</option>
                  <option value="Moderate (60-90d)">Moderate (60–90d)</option>
                  <option value="Valid (>90d)">Valid (&gt;90d)</option>
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[#626F84] font-display font-bold uppercase tracking-wider text-[11px]">Status:</span>
                <select
                  value={obligationStatusFilter}
                  onChange={(e) => setObligationStatusFilter(e.target.value as any)}
                  className="bg-white px-3 py-2 rounded-lg border border-[#D8D2C2] focus:outline-none focus:border-[#E3432B] font-sans"
                >
                  <option value="All">All Statuses</option>
                  <option value="Open">Open</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Verified">Verified</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            )}

            {(urgencyFilter !== 'All' || obligationStatusFilter !== 'All' || searchQuery !== '') && (
              <button
                onClick={() => {
                  setUrgencyFilter('All')
                  setObligationStatusFilter('All')
                  setSearchQuery('')
                }}
                className="text-xs text-[#E3432B] hover:underline font-display font-bold uppercase tracking-wider"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Documents Validity Table */}
        {activeSubTab === 'documents' && (
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 z-10 bg-[#FAF9F5] border-b border-[#E6E2D5] shadow-xs">
                <tr className="text-[11px] font-display font-semibold uppercase tracking-[0.08em] text-[#626F84]">
                  <th className="py-3 px-4">Institution Name</th>
                  <th className="py-3 px-4">Statutory Document & Ref</th>
                  <th className="py-3 px-4">Issuing Authority</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Validity Countdown</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1EFE8]">
                {sortedDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#8C99AE]">
                      No statutory documents matched your current criteria.
                    </td>
                  </tr>
                ) : (
                  sortedDocuments.map((doc, idx) => (
                    <motion.tr
                      key={doc.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18, delay: idx * 0.02 }}
                      className="hover:bg-[#FAF9F5] transition-colors"
                    >
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-display font-bold text-[#13161A] leading-snug">{doc.institutionName}</div>
                        <span className="font-mono text-[10px] text-[#8C99AE]">{doc.institutionId}</span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-[#13161A] font-sans">{doc.documentName}</div>
                        <div className="font-mono text-[10px] text-[#626F84] mt-0.5">
                          Ref: {doc.docReferenceNo} / {doc.category}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[#424C5D] font-sans">{doc.issuingAuthority}</td>

                      <td className="py-3.5 px-4 font-mono font-medium text-[#13161A]">
                        {doc.expiryDate}
                      </td>

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
                        {doc.verificationStatus !== 'Verified' && (
                          <button
                            onClick={() => handleVerifyDoc(doc.id, doc.documentName)}
                            disabled={loadingActionId === doc.id}
                            className="px-3 py-1 rounded text-[11px] font-display font-bold bg-[#16A34A] text-white hover:bg-[#15803D] uppercase flex items-center gap-1 ml-auto"
                          >
                            {loadingActionId === doc.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              'Verify'
                            )}
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Obligations Table */}
        {activeSubTab === 'obligations' && (
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 z-10 bg-[#FAF9F5] border-b border-[#E6E2D5] shadow-xs">
                <tr className="text-[11px] font-display font-semibold uppercase tracking-[0.08em] text-[#626F84]">
                  <th className="py-3 px-4">Institution Name</th>
                  <th className="py-3 px-4">Statutory Mandate</th>
                  <th className="py-3 px-4">Mandate Reference</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1EFE8]">
                {sortedObligations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#8C99AE]">
                      No statutory undertakings matched your current criteria.
                    </td>
                  </tr>
                ) : (
                  sortedObligations.map((ob, idx) => (
                    <motion.tr
                      key={ob.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18, delay: idx * 0.02 }}
                      className="hover:bg-[#FAF9F5] transition-colors"
                    >
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-display font-bold text-[#13161A] leading-snug">{ob.institutionName}</div>
                        <span className="font-mono text-[10px] text-[#8C99AE]">{ob.institutionId}</span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-[#13161A] font-sans">{ob.title}</div>
                        <div className="text-[11px] text-[#626F84] mt-0.5 font-sans">{ob.description}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs text-[#424C5D]">
                        {ob.mandateReference}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono font-medium text-[#13161A] block">{ob.dueDate}</span>
                        <span
                          className={`text-[10px] font-bold block uppercase ${
                            ob.daysRemaining < 0
                              ? 'text-[#E3432B]'
                              : ob.daysRemaining <= 10
                              ? 'text-[#D97706]'
                              : 'text-[#16A34A]'
                          }`}
                        >
                          {ob.daysRemaining < 0
                            ? `${Math.abs(ob.daysRemaining)}d overdue`
                            : `${ob.daysRemaining}d left`}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <ObligationBadge status={ob.status} />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {ob.status !== 'Verified' && (
                          <button
                            onClick={() => handleUpdateObligation(ob.id, ob.title, 'Verified')}
                            disabled={loadingActionId === ob.id}
                            className="px-3 py-1 rounded text-[11px] font-display font-bold bg-[#16A34A] text-white hover:bg-[#15803D] uppercase flex items-center gap-1 ml-auto"
                          >
                            {loadingActionId === ob.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              'Verify Proof'
                            )}
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
