import React, { useState } from 'react'
import { Deficiency } from '../../types'
import { AlertTriangle, X, ShieldAlert, CheckCircle2 } from 'lucide-react'

interface DeficiencyModalProps {
  isOpen: boolean
  onClose: () => void
  applicationNumber: string
  institutionName: string
  onSubmit: (reason: string, category: Deficiency['category'], severity: Deficiency['severity']) => void
}

export const DeficiencyModal: React.FC<DeficiencyModalProps> = ({
  isOpen,
  onClose,
  applicationNumber,
  institutionName,
  onSubmit,
}) => {
  const [reason, setReason] = useState('')
  const [category, setCategory] = useState<Deficiency['category']>('Document Validity')
  const [severity, setSeverity] = useState<Deficiency['severity']>('Critical')
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) return

    onSubmit(reason.trim(), category, severity)
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setReason('')
      onClose()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="relative w-full max-w-lg bg-[#FAF9F5] border-2 border-[#1A1E24] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1A1E24] text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#E3432B] text-white">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide uppercase">Return for Statutory Deficiency</h3>
              <p className="text-[11px] text-[#8C99AE]">Formal regulatory notice to applicant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8C99AE] hover:text-white hover:bg-[#2E3541]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 bg-[#EBF7F0] text-[#166534] flex items-center justify-center border border-[#BBF7D0]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#13161A] uppercase tracking-wider">Deficiency Notice Recorded</h4>
            <p className="text-xs text-[#626F84] max-w-sm">
              Application status updated and formal notice logged in the permanent audit trail.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Institution Context */}
            <div className="p-3 bg-white border border-[#E6E2D5] text-xs space-y-1">
              <div className="text-[#626F84]">
                Application: <span className="font-mono font-semibold text-[#13161A]">{applicationNumber}</span>
              </div>
              <div className="text-[#13161A] font-bold truncate">{institutionName}</div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[11px] font-bold text-[#1A1E24] uppercase tracking-wider mb-1">
                Deficiency Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Deficiency['category'])}
                className="w-full px-3 py-2 text-xs bg-white border border-[#1A1E24] focus:outline-none focus:ring-1 focus:ring-[#E3432B]"
              >
                <option value="Document Validity">Document Validity (Expired / Unattested)</option>
                <option value="Faculty Ratio">Faculty Ratio & Cadre Deficit</option>
                <option value="Infrastructure Deficit">Infrastructure & Lab Equipment Deficit</option>
                <option value="Legal/Land Discrepancy">Legal / Land Title / Lease Discrepancy</option>
                <option value="Financial Endowment">Financial Endowment / Joint FDR Non-compliance</option>
              </select>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-[11px] font-bold text-[#1A1E24] uppercase tracking-wider mb-1">
                Deficiency Severity *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Minor', 'Major', 'Critical'] as const).map((sev) => (
                  <button
                    type="button"
                    key={sev}
                    onClick={() => setSeverity(sev)}
                    className={`px-3 py-2 text-xs font-bold border uppercase tracking-wider ${
                      severity === sev
                        ? sev === 'Critical'
                          ? 'bg-[#E3432B] text-white border-[#E3432B]'
                          : sev === 'Major'
                          ? 'bg-[#D97706] text-white border-[#D97706]'
                          : 'bg-[#2563EB] text-white border-[#2563EB]'
                        : 'bg-white text-[#424C5D] border-[#D8D2C2] hover:bg-[#F1EFE8]'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-[11px] font-bold text-[#1A1E24] uppercase tracking-wider mb-1">
                Deficiency Note / Justification *
              </label>
              <textarea
                required
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Specify precise regulatory clause violation (e.g. APH 2026-27 Chapter II Clause 4.8), missing documents, and required corrective submission..."
                className="w-full px-3 py-2 text-xs bg-white border border-[#1A1E24] focus:outline-none focus:ring-1 focus:ring-[#E3432B]"
              />
              <span className="text-[10px] text-[#8C99AE] mt-1 block">
                Recorded immutably in the permanent regulatory audit trail.
              </span>
            </div>

            {/* Alert banner */}
            <div className="flex items-start gap-2.5 p-3 bg-[#FEECE9] border border-[#F8B6AB] text-[#B91C1C] text-xs">
              <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0 text-[#E3432B]" />
              <div>
                Returning this case pauses stage deadlines and mandates applicant resubmission within 7 calendar days.
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E6E2D5]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold border border-[#D8D2C2] bg-white text-[#424C5D] hover:bg-[#F1EFE8]"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={!reason.trim()}
                className="px-5 py-2 text-xs font-bold bg-[#E3432B] hover:bg-[#C93520] text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                DISPATCH DEFICIENCY NOTICE
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
