import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Role } from '../../types'
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Activity,
} from 'lucide-react'

export const Navbar: React.FC = () => {
  const { currentRole, setRole, searchQuery, setSearchQuery, applications, obligations } = useApp()
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)
  const navigate = useNavigate()

  const overdueApps = applications.filter((a) => a.status === 'Overdue').length
  const overdueObs = obligations.filter((o) => o.status === 'Overdue').length
  const totalAlerts = overdueApps + overdueObs

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
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#E3432B] flex items-center justify-center font-bold text-white">
            <span className="font-mono text-lg">Λ</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-wider text-[#FAF9F5]">AXIOM</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.2 bg-[#E3432B] text-white">
                AICTE
              </span>
            </div>
            <p className="text-[10px] text-[#8C99AE] leading-none hidden sm:block">
              Approval Lifecycle & Compliance Platform
            </p>
          </div>
        </Link>

        {/* Cycle Pill without green dot */}
        <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-[#2E3541] text-xs text-[#8C99AE]">
          <span>Cycle: <strong className="text-[#E2E6EE] font-mono">AY 2026-27</strong></span>
        </div>
      </div>

      {/* Global Search */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-[#8C99AE] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by institution, application ID, or region..."
            className="w-full bg-[#242B35] text-white text-xs pl-9 pr-4 py-2 border border-[#2E3541] focus:outline-none focus:border-[#E3432B] placeholder-[#626F84]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8C99AE] hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right User & Role Switcher */}
      <div className="flex items-center gap-2">
        {/* Foresight Link */}
        <Link
          to="/foresight"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#242B35] hover:bg-[#2E3541] text-[#E2E6EE] text-xs border border-[#3B4454] transition-colors"
          title="Delay Risk Forecasting"
        >
          <Activity className="w-3.5 h-3.5 text-[#E3432B]" />
          <span className="font-semibold uppercase tracking-wider text-[11px]">Foresight</span>
        </Link>

        {/* Overdue alert indicator */}
        <Link
          to="/compliance"
          className="relative p-2 bg-[#242B35] hover:bg-[#2E3541] text-[#BAC3D2] border border-[#2E3541] transition-colors"
          title={`${totalAlerts} Overdue Items Across Institutions`}
        >
          <Bell className="w-4 h-4" />
          {totalAlerts > 0 && (
            <span className="absolute -top-1 -right-1 px-1 min-w-4 h-4 bg-[#E3432B] text-white text-[10px] font-bold flex items-center justify-center font-mono">
              {totalAlerts}
            </span>
          )}
        </Link>

        {/* Role Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#242B35] hover:bg-[#2E3541] border border-[#2E3541] text-xs transition-all text-left"
          >
            <div className="w-5 h-5 bg-[#E3432B] text-white font-bold flex items-center justify-center text-[10px] font-mono">
              {currentRole === 'Regional Officer'
                ? 'RO'
                : currentRole === 'Bureau Officer'
                ? 'BO'
                : currentRole === 'Committee Member'
                ? 'CM'
                : 'IN'}
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-white text-xs leading-none">{currentRole}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8C99AE]" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-1 w-72 bg-[#1A1E24] border-2 border-[#2E3541] shadow-2xl py-2 z-50">
              <div className="px-3 py-1.5 border-b border-[#2E3541] text-[10px] uppercase font-bold tracking-wider text-[#8C99AE]">
                Select Role Perspective
              </div>
              {roles.map((r) => (
                <button
                  key={r.role}
                  onClick={() => handleRoleChange(r.role)}
                  className={`w-full px-3 py-2.5 text-left flex items-start gap-3 hover:bg-[#242B35] transition-colors ${
                    currentRole === r.role ? 'bg-[#2E3541] text-[#FAF9F5]' : 'text-[#BAC3D2]'
                  }`}
                >
                  <span
                    className={`w-6 h-6 flex items-center justify-center text-xs font-bold font-mono shrink-0 mt-0.5 ${
                      currentRole === r.role
                        ? 'bg-[#E3432B] text-white'
                        : 'bg-[#2E3541] text-[#8C99AE]'
                    }`}
                  >
                    {r.icon}
                  </span>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      {r.role}
                      {currentRole === r.role && (
                        <span className="text-[9px] px-1 py-0.2 bg-[#E3432B] text-white">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#8C99AE] leading-snug mt-0.5">
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
                  className="w-full px-3 py-2 text-xs text-[#E3432B] hover:bg-[#2E3541] flex items-center gap-2 font-bold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Exit to Role Selection Landing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
