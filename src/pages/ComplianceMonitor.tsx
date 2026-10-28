import React, { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import {
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  Clock,
  Search,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react'
import { DocumentUrgencyBadge, ObligationBadge } from '../components/Common/StatusBadge'
import { DocumentUrgency, ObligationStatus } from '../types'

export const ComplianceMonitor: React.FC = () => {
  const { documents, obligations, updateDocumentStatus, updateObligationStatus } = useApp()

  const [activeSubTab, setActiveSubTab] = useState<'documents' | 'obligations'>('documents')
  const [urgencyFilter, setUrgencyFilter] = useState<DocumentUrgency | 'All'>('All')
  const [obligationStatusFilter, setObligationStatusFilter] = useState<ObligationStatus | 'All'>('All')
  const [searchQuery, setSearchQuery] = useState('')

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-[#1A1E24] text-white p-6 border border-[#2E3541] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#E3432B] text-white">
              National Compliance Watch
            </span>
            <span className="text-xs text-[#8C99AE] font-mono">/ 90-60-30 Day Surveillance</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#FAF9F5] uppercase">
            Compliance & Document Validity Monitor
          </h1>
          <p className="text-xs text-[#8C99AE] mt-1">
            Centralized register across all technical institutions tracking statutory lease deeds, fire NOCs, 
            joint FDR renewals, and biometric faculty rosters.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-[#242B35] p-1 border border-[#2E3541]">
          <button
            onClick={() => setActiveSubTab('documents')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              activeSubTab === 'documents'
                ? 'bg-[#E3432B] text-white'
                : 'text-[#BAC3D2] hover:text-white'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Document Expiry ({documents.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('obligations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              activeSubTab === 'obligations'
                ? 'bg-[#E3432B] text-white'
                : 'text-[#BAC3D2] hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Undertakings ({obligations.length})</span>
          </button>
        </div>
      </div>

      {/* Countdown Urgency System Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          onClick={() => {
            setActiveSubTab('documents')
            setUrgencyFilter('Expired')
          }}
          className="p-4 bg-white border border-[#F8B6AB] border-l-4 border-l-[#E3432B] cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E3432B]">
              Expired Documents
            </span>
            <ShieldAlert className="w-4 h-4 text-[#E3432B]" />
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-[#E3432B]">
            {expiredDocsCount} Documents
          </div>
          <span className="text-[11px] text-[#8C99AE] mt-1 block">
            Immediate show-cause threshold
          </span>
        </div>

        <div
          onClick={() => {
            setActiveSubTab('documents')
            setUrgencyFilter('Critical (<30d)')
          }}
          className="p-4 bg-white border border-[#FDE68A] border-l-4 border-l-[#D97706] cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
              Critical Window (&lt;30 Days)
            </span>
            <AlertTriangle className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-[#13161A]">
            {critical30DocsCount} Documents
          </div>
          <span className="text-[11px] text-[#8C99AE] mt-1 block">
            Automated SMS alert dispatched
          </span>
        </div>

        <div
          onClick={() => {
            setActiveSubTab('documents')
            setUrgencyFilter('Approaching (30-60d)')
          }}
          className="p-4 bg-white border border-[#E6E2D5] border-l-4 border-l-[#CA8A04] cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#CA8A04]">
              Approaching (30–60 Days)
            </span>
            <Clock className="w-4 h-4 text-[#CA8A04]" />
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-[#13161A]">
            {approaching60DocsCount} Documents
          </div>
          <span className="text-[11px] text-[#8C99AE] mt-1 block">
            Pre-notice renewal stage
          </span>
        </div>

        <div
          onClick={() => {
            setActiveSubTab('obligations')
            setObligationStatusFilter('Overdue')
          }}
          className="p-4 bg-white border border-[#FCA5A5] border-l-4 border-l-[#E3432B] cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E3432B]">
              Overdue Undertakings
            </span>
            <AlertTriangle className="w-4 h-4 text-[#E3432B]" />
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-[#13161A]">
            {overdueObsCount} Undertakings
          </div>
          <span className="text-[11px] text-[#8C99AE] mt-1 block">
            FDR & AEBAS non-compliance
          </span>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-[#E6E2D5]">
        {/* Table Filters */}
        <div className="p-4 border-b border-[#F1EFE8] bg-[#FAF9F5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#8C99AE] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, institution, or reference..."
              className="w-full bg-white pl-9 pr-3 py-2 border border-[#D8D2C2] focus:outline-none focus:border-[#E3432B]"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {activeSubTab === 'documents' ? (
              <div className="flex items-center gap-2">
                <span className="text-[#626F84] font-bold uppercase tracking-wider text-[11px]">Urgency:</span>
                <select
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value as any)}
                  className="bg-white px-3 py-2 border border-[#D8D2C2] focus:outline-none focus:border-[#E3432B]"
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
                <span className="text-[#626F84] font-bold uppercase tracking-wider text-[11px]">Status:</span>
                <select
                  value={obligationStatusFilter}
                  onChange={(e) => setObligationStatusFilter(e.target.value as any)}
                  className="bg-white px-3 py-2 border border-[#D8D2C2] focus:outline-none focus:border-[#E3432B]"
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
                className="text-xs text-[#E3432B] hover:underline font-bold uppercase"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Documents Validity Table */}
        {activeSubTab === 'documents' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#E6E2D5] text-[11px] font-bold uppercase tracking-wider text-[#626F84]">
                  <th className="py-3.5 px-4">Institution Name</th>
                  <th className="py-3.5 px-4">Statutory Document & Ref</th>
                  <th className="py-3.5 px-4">Issuing Authority</th>
                  <th className="py-3.5 px-4">Expiry Date</th>
                  <th className="py-3.5 px-4">Validity Countdown</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
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
                  sortedDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-[#13161A] leading-snug">{doc.institutionName}</div>
                        <span className="font-mono text-[10px] text-[#8C99AE]">{doc.institutionId}</span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-[#13161A]">{doc.documentName}</div>
                        <div className="font-mono text-[10px] text-[#626F84] mt-0.5">
                          Ref: {doc.docReferenceNo} / {doc.category}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[#424C5D]">{doc.issuingAuthority}</td>

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
                          className={`inline-block px-2 py-0.5 text-xs font-semibold ${
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
                              onClick={() => updateDocumentStatus(doc.id, 'Verified')}
                              className="px-2.5 py-1 text-[11px] font-bold bg-[#16A34A] text-white hover:bg-[#15803D] uppercase"
                            >
                              Verify
                            </button>
                          )}
                          <button
                            onClick={() =>
                              alert(
                                `[Demo Preview] Statutory Document Dossier:\n\nDocument: ${doc.documentName}\nIssuing Authority: ${doc.issuingAuthority}\nValid Until: ${doc.expiryDate} (${doc.daysUntilExpiry} days)\nFile Size: ${doc.fileSize}`
                              )
                            }
                            className="p-1.5 text-[#626F84] hover:text-[#13161A] hover:bg-[#F1EFE8]"
                            title="Inspect file"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Compliance Undertakings Table */}
        {activeSubTab === 'obligations' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#E6E2D5] text-[11px] font-bold uppercase tracking-wider text-[#626F84]">
                  <th className="py-3.5 px-4">Institution Name</th>
                  <th className="py-3.5 px-4">Mandatory Undertaking</th>
                  <th className="py-3.5 px-4">Statutory Clause</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1EFE8]">
                {sortedObligations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#8C99AE]">
                      No statutory undertakings matched your filter criteria.
                    </td>
                  </tr>
                ) : (
                  sortedObligations.map((ob) => (
                    <tr key={ob.id} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-[#13161A] leading-snug">{ob.institutionName}</div>
                        <span className="font-mono text-[10px] text-[#8C99AE]">{ob.category}</span>
                      </td>

                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="font-bold text-[#13161A]">{ob.title}</div>
                        <p className="text-[11px] text-[#626F84] mt-0.5 line-clamp-1">{ob.description}</p>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#424C5D]">
                        {ob.mandateReference}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[#13161A] block">{ob.dueDate}</span>
                        <span
                          className={`text-[10px] font-bold uppercase ${
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
                      </td>

                      <td className="py-3.5 px-4">
                        <ObligationBadge status={ob.status} />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {ob.status === 'Open' && (
                            <button
                              onClick={() => updateObligationStatus(ob.id, 'Submitted')}
                              className="px-2.5 py-1 text-[11px] font-bold bg-[#2563EB] text-white hover:bg-[#1D4ED8] uppercase"
                            >
                              Submit
                            </button>
                          )}
                          {ob.status !== 'Verified' && (
                            <button
                              onClick={() => updateObligationStatus(ob.id, 'Verified')}
                              className="px-2.5 py-1 text-[11px] font-bold bg-[#16A34A] text-white hover:bg-[#15803D] uppercase"
                            >
                              Verify
                            </button>
                          )}
                          {ob.status === 'Verified' && (
                            <span className="text-[11px] text-[#16A34A] font-bold font-mono">
                              [VERIFIED]
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Legend / Info bar without bullet emojis */}
        <div className="p-3 bg-[#FAF9F5] border-t border-[#E6E2D5] flex flex-wrap items-center justify-between text-xs text-[#626F84] gap-2">
          <span className="font-mono text-[11px] uppercase">AICTE Statutory Validity Surveillance Engine</span>
          <div className="flex items-center gap-3 text-[11px] font-mono uppercase font-bold">
            <span className="text-[#E3432B]">[CRITICAL &lt;30D]</span>
            <span className="text-[#D97706]">[APPROACHING 30–60D]</span>
            <span className="text-[#CA8A04]">[MODERATE 60–90D]</span>
            <span className="text-[#16A34A]">[VALID &gt;90D]</span>
          </div>
        </div>
      </div>
    </div>
  )
}
