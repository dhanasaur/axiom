import React from 'react'
import { NavLink } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  ShieldCheck,
  BarChart3,
  Activity,
  UserCheck,
} from 'lucide-react'

export const Sidebar: React.FC = () => {
  const { currentRole, applications, obligations, evcSchedules } = useApp()

  const pendingScrutinyCount = applications.filter((a) => a.currentStage === 'Scrutiny').length
  const evcDueCount = evcSchedules.filter((e) => e.status === 'Due This Week' || e.status === 'Overdue').length
  const overdueObsCount = obligations.filter((o) => o.status === 'Overdue').length

  const navLinks = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/applications',
      label: 'Applications',
      icon: FileText,
      badge: pendingScrutinyCount > 0 ? `${pendingScrutinyCount}` : null,
      badgeColor: 'bg-[#2E3541] text-[#E2E6EE]',
    },
    {
      to: '/evc-schedule',
      label: 'EVC Scheduling',
      icon: CalendarDays,
      badge: evcDueCount > 0 ? `${evcDueCount} Due` : null,
      badgeColor: 'bg-[#E3432B] text-white',
    },
    {
      to: '/compliance',
      label: 'Compliance & Validity',
      icon: ShieldCheck,
      badge: overdueObsCount > 0 ? `${overdueObsCount} Alert` : null,
      badgeColor: 'bg-[#E3432B] text-white',
    },
    {
      to: '/foresight',
      label: 'Delay Risk Foresight',
      icon: Activity,
      badge: 'RISK',
      badgeColor: 'bg-[#1A1E24] text-[#F8B6AB] border border-[#E3432B]/50',
    },
    {
      to: '/reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      badge: null,
    },
  ]

  return (
    <aside className="w-64 bg-[#13161A] text-[#BAC3D2] border-r border-[#242B35] flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Top Menu Links */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#626F84]">
          Navigation
        </div>

        {navLinks.map((link) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border ${
                  isActive
                    ? 'bg-[#E3432B] text-white border-[#E3432B]'
                    : 'text-[#BAC3D2] border-transparent hover:bg-[#1A1E24] hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 ${link.badgeColor}`}
                >
                  {link.badge}
                </span>
              )}
            </NavLink>
          )
        })}
      </div>

      {/* Role Footprint & Gov Notice */}
      <div className="p-4 border-t border-[#242B35] space-y-3 bg-[#0D0F12]">
        <div className="p-3 bg-[#1A1E24] border border-[#2E3541]">
          <div className="text-[10px] uppercase font-bold text-[#8C99AE] tracking-wider mb-1">
            Active Persona
          </div>
          <div className="text-xs font-bold text-[#FAF9F5] flex items-center gap-1.5 uppercase">
            <UserCheck className="w-3.5 h-3.5 text-[#E3432B]" />
            {currentRole}
          </div>
          <div className="text-[11px] text-[#8C99AE] mt-1 leading-tight">
            {currentRole === 'Regional Officer' && 'Authorized to review Scrutiny & recommend EVC visits.'}
            {currentRole === 'Bureau Officer' && 'Statutory approval authority for final LoA issuance.'}
            {currentRole === 'Committee Member' && 'Expert panelist for physical EVCs and SHC hearings.'}
            {currentRole === 'Institution' && 'College nodal coordinator for compliance submissions.'}
          </div>
        </div>

        <div className="text-[10px] text-[#626F84] leading-relaxed">
          AICTE Approval Process Handbook (APH) 2026-27 Compliant Engine.
        </div>
      </div>
    </aside>
  )
}
