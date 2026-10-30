import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Deficiency } from '../../types'
import { AlertTriangle, X, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react'
import { mockApi } from '../../services/mockApi'
import { useToast } from '../../context/ToastContext'

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
  const { success } = useToast()
  const [reason, setReason] = useState('')
  const [category, setCategory] = useState<Deficiency['category']>('Document Validity')
  const [severity, setSeverity] = useState<Deficiency['severity']>('Critical')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      // Simulate network request
      await mockApi.returnForDeficiency(applicationNumber, reason.trim(), category, severity, 'Reviewing Officer')
      onSubmit(reason.trim(), category, severity)
      setIsSubmitting(false)
      setIsSubmitted(true)
      success(
        'Deficiency Notice Dispatched',
        `Regulatory return filed for ${applicationNumber}. 7-day cure window triggered.`
      )
      setTimeout(() => {
        setIsSubmitted(false)
        setReason('')
        onClose()
      }, 1200)
    } catch {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isSubmitting ? onClose : undefined}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="relative w-full max-w-lg bg-[#FAF9F5] border border-[#1A1E24] rounded-xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-[#1A1E24] text-white">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-[#E3432B] text-white">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm tracking-wide uppercase">
                    Return for Statutory Deficiency
                  </h3>
                  <p className="text-[11px] text-[#8C99AE] font-sans">Formal regulatory notice to applicant</p>
                </div>
              </div>
              {!isSubmitting && (
                <button
                  onClick={onClose}
                  className="p-1 text-[#8C99AE] hover:text-white rounded hover:bg-[#2E3541] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {isSubmitted ? (
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                  className="w-12 h-12 rounded-full bg-[#EBF7F0] text-[#166534] flex items-center justify-center border border-[#BBF7D0]"
                >
                  <CheckCircle2 className="w-6 h-6" />
                </motion.div>
                <h4 className="font-display text-base font-bold text-[#13161A] uppercase tracking-wider">
                  Deficiency Notice Recorded
                </h4>
                <p className="text-xs text-[#626F84] max-w-sm font-sans">
                  Application status updated and formal notice logged in the permanent audit trail.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Institution Context */}
                <div className="p-3 bg-white rounded-lg border border-[#E6E2D5] text-xs space-y-1">
                  <div className="text-[#626F84] font-sans">
                    Application: <span className="font-mono font-semibold text-[#13161A]">{applicationNumber}</span>
                  </div>
                  <div className="text-[#13161A] font-display font-bold truncate">{institutionName}</div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[11px] font-display font-semibold text-[#1A1E24] uppercase tracking-wider mb-1.5">
                    Deficiency Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Deficiency['category'])}
                    className="w-full px-3 py-2 text-xs bg-white rounded-md border border-[#D8D2C2] focus:outline-none focus:border-[#E3432B] font-sans"
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
                  <label className="block text-[11px] font-display font-semibold text-[#1A1E24] uppercase tracking-wider mb-1.5">
                    Deficiency Severity *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Minor', 'Major', 'Critical'] as const).map((sev) => (
                      <button
                        type="button"
                        key={sev}
                        onClick={() => setSeverity(sev)}
                        className={`px-3 py-2 text-xs font-display font-bold rounded-md border uppercase tracking-wider transition-all ${
                          severity === sev
                            ? sev === 'Critical'
                              ? 'bg-[#E3432B] text-white border-[#E3432B] shadow-sm'
                              : sev === 'Major'
                              ? 'bg-[#D97706] text-white border-[#D97706] shadow-sm'
                              : 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm'
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
                  <label className="block text-[11px] font-display font-semibold text-[#1A1E24] uppercase tracking-wider mb-1.5">
                    Deficiency Note / Justification *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Specify precise regulatory clause violation (e.g. APH 2026-27 Chapter II Clause 4.8), missing documents, and required corrective submission..."
                    className="w-full px-3 py-2 text-xs bg-white rounded-md border border-[#D8D2C2] focus:outline-none focus:border-[#E3432B] font-sans"
                  />
                  <span className="text-[10px] text-[#8C99AE] mt-1 block font-sans">
                    Recorded immutably in the permanent regulatory audit trail.
                  </span>
                </div>

                {/* Alert banner */}
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#FEECE9] border border-[#F8B6AB] text-[#B91C1C] text-xs">
                  <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0 text-[#E3432B]" />
                  <div className="font-sans">
                    Returning this case pauses stage deadlines and mandates applicant resubmission within 7 calendar days.
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E6E2D5]">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-xs font-display font-bold rounded-md border border-[#D8D2C2] bg-white text-[#424C5D] hover:bg-[#F1EFE8] disabled:opacity-50"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={!reason.trim() || isSubmitting}
                    className="px-5 py-2 text-xs font-display font-bold rounded-md bg-[#E3432B] hover:bg-[#C93520] text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>DISPATCHING NOTICE...</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>DISPATCH DEFICIENCY NOTICE</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
