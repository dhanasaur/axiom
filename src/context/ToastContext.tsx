import React, { createContext, useContext, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: string
  title: string
  message?: string
  type: ToastType
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: ToastItem[]
  showToast: (toast: Omit<ToastItem, 'id'>) => string
  dismissToast: (id: string) => void
  success: (title: string, message?: string) => string
  error: (title: string, message?: string, action?: ToastItem['action']) => string
  warning: (title: string, message?: string) => string
  info: (title: string, message?: string) => string
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
      const duration = toast.duration ?? (toast.type === 'error' ? 6000 : 4500)
      const newToast: ToastItem = { ...toast, id, duration }

      setToasts((prev) => [newToast, ...prev].slice(0, 5)) // max 5 visible toasts

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id)
        }, duration)
      }

      return id
    },
    [dismissToast]
  )

  const success = useCallback((title: string, message?: string) => showToast({ title, message, type: 'success' }), [showToast])
  const error = useCallback((title: string, message?: string, action?: ToastItem['action']) => showToast({ title, message, type: 'error', action }), [showToast])
  const warning = useCallback((title: string, message?: string) => showToast({ title, message, type: 'warning' }), [showToast])
  const info = useCallback((title: string, message?: string) => showToast({ title, message, type: 'info' }), [showToast])

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast, success, error, warning, info }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              className={`pointer-events-auto relative overflow-hidden rounded-lg border shadow-xl p-3.5 backdrop-blur-md ${
                toast.type === 'success'
                  ? 'bg-[#0D1F16]/95 border-[#1E7E55] text-white'
                  : toast.type === 'error'
                  ? 'bg-[#260E0A]/95 border-[#E3432B] text-white'
                  : toast.type === 'warning'
                  ? 'bg-[#2A1D0B]/95 border-[#D97706] text-white'
                  : 'bg-[#13161A]/95 border-[#2E3541] text-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />}
                  {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#F87171]" />}
                  {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-[#FBBF24]" />}
                  {toast.type === 'info' && <Info className="w-4 h-4 text-[#60A5FA]" />}
                </div>

                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="font-display text-xs font-bold leading-snug tracking-tight text-white">
                    {toast.title}
                  </h4>
                  {toast.message && (
                    <p className="mt-1 text-[11px] leading-relaxed text-[#BAC3D2] font-sans">
                      {toast.message}
                    </p>
                  )}
                  {toast.action && (
                    <button
                      onClick={() => {
                        toast.action?.onClick()
                        dismissToast(toast.id)
                      }}
                      className="mt-2 text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#E3432B] hover:bg-[#C93520] text-white rounded transition-colors"
                    >
                      {toast.action.label}
                    </button>
                  )}
                </div>

                <button
                  onClick={() => dismissToast(toast.id)}
                  className="shrink-0 p-1 text-[#8C99AE] hover:text-white rounded transition-colors"
                  aria-label="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Shrinking progress bar */}
              {toast.duration && toast.duration > 0 && (
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                  className={`absolute bottom-0 left-0 h-0.5 ${
                    toast.type === 'success'
                      ? 'bg-[#4ADE80]'
                      : toast.type === 'error'
                      ? 'bg-[#F87171]'
                      : toast.type === 'warning'
                      ? 'bg-[#FBBF24]'
                      : 'bg-[#60A5FA]'
                  }`}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

