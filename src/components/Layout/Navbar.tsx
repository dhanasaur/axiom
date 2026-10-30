import React, { useState, useEffect, useTransition } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import { Role } from '../../types'
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Activity,
  Loader2,
  Radio,
} from 'lucide-react'

export const Navbar: React.FC = () => {
  const { currentRole, setRole, searchQuery, setSearchQuery, applications, obligations } = useApp()
  const { info } = useToast()
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [isSearching, setIsSearching] = useState(false)
  const [secondsAgo, setSecondsAgo] = useState(4)
  const [hasNewAlert, setHasNewAlert] = useState(false)
  const navigate = useNavigate()

  const overdueApps = applications.filter((a) => a.status === 'Overdue').length
  const overdueObs = obligations.filter((o) => o.status === 'Overdue').length
  const baseAlerts = overdueApps + overdueObs
  const totalAlerts = baseAlerts + (hasNewAlert ? 1 : 0)

  // Live "Last synced Xs ago" ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => {
        if (prev >= 60) return 3
        return prev + 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Simulate incoming notification ~20s after load
  useEffect(() => {
    const timeout = setTimeout(() => {
      setHasNewAlert(true)
      info(
        'AY 2026-27: Urgent EVC Advisory',
        'Zonal RO-ERO dispatched 1 high-priority inspection quorum alert for Kalinga Institute.'
      )
    }, 20000)
    return () => clearTimeout(timeout)
  }, [info])

  // Debounced search with loading indicator
  useEffect(() => {
    if (localSearch === searchQuery) return
    setIsSearching(true)
    const handler = setTimeout(() => {
      startTransition(() => {
        setSearchQuery(localSearch)
        setIsSearching(false)
      })
    }, 300)
    return () => clearTimeout(handler)
  }, [localSearch, searchQuery, setSearchQuery])

  const roles: { role: Role; desc: string; icon: string }[] = [
    { role: 'Regional Officer', desc: 'Regional scrutiny, EVC coordination & field visits', icon: 'RO' },
    { role: 'Bureau Officer', desc: 'National approval policy, final orders & LoA release', icon: 'BO' },
    { role: 'Committee Member', desc: 'SAC / SHC hearing, technical appraisals & EVC reports', icon: 'CM' },
    { role: 'Institution', desc: 'Application submission, deficiency compliance & document uploads', icon: 'IN' },
  ]

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole)
    setRoleMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#1A1E24] text-white border-b border-[#2E3541] px-4 md:px-6 flex items-center justify-between">
      {/* Brand & Left Section */}
      <div className="flex items-center gap-3 md:gap-5">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-md bg-[#E3432B] flex items-center justify-center font-bold text-white shadow-sm transition-transform group-hover:scale-105">
            <span className="font-mono text-lg leading-none">Λ</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-base tracking-wider text-[#FAF9F5]">AXIOM</span>
              <span className="text-[10px] uppercase font-display font-semibold tracking-widest px-1.5 py-0.5 rounded bg-[#E3432B] text-white">
                AICTE
              </span>
            </div>
            <p className="text-[10px] text-[#8C99AE] leading-none hidden sm:block font-sans">
              Approval Lifecycle & Compliance Platform
            </p>
          </div>
        </Link>

        {/* Cycle Pill with live sync indicator */}
        <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-[#2E3541] text-xs text-[#8C99AE]">
          <span className="font-sans">Cycle: <strong className="text-[#E2E6EE] font-mono">AY 2026-27</strong></span>
          
          {/* Live Synced Counter */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8C99AE]/80 bg-[#13161A] px-2 py-0.5 rounded border border-[#2E3541]/70">
            <Radio className="w-2.5 h-2.5 text-[#16A34A] animate-pulse" />
            <span>Synced {secondsAgo}s ago</span>
          </div>
        </div>
      </div>

      {/* Global Search with Debounce and Spinner */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          {isSearching || isPending ? (
            <Loader2 className="w-4 h-4 text-[#E3432B] animate-spin absolute left-3 top-1/2 -translate-y-1/2" />
          ) : (
            <Search className="w-4 h-4 text-[#8C99AE] absolute left-3 top-1/2 -translate-y-1/2" />
          )}
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search by institution, application ID, or region..."
            className="w-full bg-[#242B35] text-white text-xs pl-9 pr-8 py-2 rounded-md border border-[#2E3541] focus:outline-none focus:border-[#E3432B] focus:ring-1 focus:ring-[#E3432B]/30 placeholder-[#626F84] transition-all"
          />
          {localSearch && (
            <button
              onClick={() => {
                setLocalSearch('')
                setSearchQuery('')
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8C99AE] hover:text-white"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Right User & Role Switcher */}
      <div className="flex items-center gap-2">
        {/* Foresight Link */}
        <Link
          to="/foresight"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#242B35] hover:bg-[#2E3541] text-[#E2E6EE] text-xs border border-[#3B4454] transition-all hover:scale-[1.02] active:scale-[0.98]"
          title="Delay Risk Forecasting"
        >
          <Activity className="w-3.5 h-3.5 text-[#E3432B]" />
          <span className="font-display font-semibold uppercase tracking-wider text-[11px]">Foresight</span>
        </Link>

        {/* Overdue alert indicator with pulse when new */}
        <Link
          to="/compliance"
          className="relative p-2 rounded-md bg-[#242B35] hover:bg-[#2E3541] text-[#BAC3D2] border border-[#2E3541] transition-all hover:scale-[1.02] active:scale-[0.98]"
          title={`${totalAlerts} Overdue Items Across Institutions`}
        >
          <Bell className={`w-4 h-4 ${hasNewAlert ? 'text-[#E3432B] animate-bounce' : ''}`} />
          {totalAlerts > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
              className={`absolute -top-1 -right-1 px-1 min-w-4 h-4 rounded-full bg-[#E3432B] text-white text-[10px] font-bold flex items-center justify-center font-mono ${
                hasNewAlert ? 'pulse-ring-alert' : ''
              }`}
            >
              {totalAlerts}
            </motion.span>
          )}
        </Link>

        {/* Role Selector Dropdown */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#242B35] hover:bg-[#2E3541] border border-[#2E3541] text-xs transition-all text-left"
          >
            <div className="w-5 h-5 rounded bg-[#E3432B] text-white font-bold flex items-center justify-center text-[10px] font-mono">
              {currentRole === 'Regional Officer'
                ? 'RO'
                : currentRole === 'Bureau Officer'
                ? 'BO'
                : currentRole === 'Committee Member'
                ? 'CM'
                : 'IN'}
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-bold text-white text-xs leading-none">{currentRole}</div>
            </div>
            <motion.div
              animate={{ rotate: roleMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-3.5 h-3.5 text-[#8C99AE]" />
            </motion.div>
          </motion.button>

          {/* Animated Role Dropdown Menu */}
          <AnimatePresence>
            {roleMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-0 mt-1 w-72 bg-[#1A1E24] border border-[#2E3541] rounded-lg shadow-2xl py-2 z-50 overflow-hidden"
              >
                <div className="px-3 py-1.5 border-b border-[#2E3541] text-[10px] font-display uppercase font-semibold tracking-wider text-[#8C99AE]">
                  Select Role Perspective
                </div>
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => handleRoleChange(r.role)}
                    className={`w-full px-3 py-2.5 text-left flex items-start gap-3 hover:bg-[#242B35] transition-colors ${
                      currentRole === r.role ? 'bg-[#2E3541]/70 text-[#FAF9F5]' : 'text-[#BAC3D2]'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold font-mono shrink-0 mt-0.5 ${
                        currentRole === r.role
                          ? 'bg-[#E3432B] text-white'
                          : 'bg-[#2E3541] text-[#8C99AE]'
                      }`}
                    >
                      {r.icon}
                    </span>
                    <div>
                      <div className="text-xs font-bold font-display flex items-center gap-1.5">
                        {r.role}
                        {currentRole === r.role && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#E3432B] text-white font-mono">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#8C99AE] leading-snug mt-0.5 font-sans">
                        {r.desc}
                      </div>
                    </div>
                  </button>
                ))}

                <div className="border-t border-[#2E3541] mt-1 pt-1 px-2">
                  <button
                    onClick={() => {
                      setRoleMenuOpen(false)
                      navigate('/login')
                    }}
                    className="w-full px-3 py-2 text-xs rounded text-[#E3432B] hover:bg-[#2E3541] flex items-center gap-2 font-display font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Exit to Role Selection Landing
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
