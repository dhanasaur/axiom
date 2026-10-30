import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
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
  const location = useLocation()

  const pendingScrutinyCount = applications.filter((a) => a.currentStage === 'Scrutiny').length
  const evcDueCount = evcSchedules.filter((e) => e.status === 'Due This Week' || e.status === 'Overdue').length
  const overdueObsCount = obligations.filter((o) => o.status === 'Overdue').length

  const navSections = [
    {
      title: 'Core Casework',
      links: [
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
      ],
    },
    {
      title: 'Regulatory Scrutiny',
      links: [
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
      ],
    },
    {
      title: 'Intelligence & Audit',
      links: [
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
      ],
    },
  ]

  return (
    <aside className="w-64 bg-[#13161A] text-[#BAC3D2] border-r border-[#242B35] flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Top Menu Links */}
      <div className="p-3 space-y-5">
        {navSections.map((section, sIdx) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-display font-semibold uppercase tracking-[0.1em] text-[#626F84]">
              {section.title}
            </div>

            <div className="space-y-1">
              {section.links.map((link) => {
                const Icon = link.icon
                const isActive = location.pathname.startsWith(link.to)

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className="relative flex items-center justify-between px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.03em] transition-colors rounded-md group"
                  >
                    {/* Animated Sliding Active Indicator Pill */}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active-indicator"
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 32,
                        }}
                        className="absolute inset-0 bg-[#242B35] border-l-3 border-l-[#E3432B] rounded-md shadow-inner"
                      />
                    )}

                    <div className="relative z-10 flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-[#E3432B] stroke-[2]'
                            : 'text-[#8C99AE] group-hover:text-white stroke-[1.75]'
                        }`}
                      />
                      <span
                        className={
                          isActive
                            ? 'text-white font-bold'
                            : 'text-[#BAC3D2] group-hover:text-white'
                        }
                      >
                        {link.label}
                      </span>
                    </div>

                    {link.badge && (
                      <span
                        className={`relative z-10 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${link.badgeColor}`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Role Footprint & Gov Notice */}
      <div className="p-4 border-t border-[#242B35] space-y-3 bg-[#0D0F12]">
        <div className="p-3 bg-[#1A1E24] border border-[#2E3541] rounded-lg">
          <div className="text-[10px] font-display uppercase font-semibold text-[#8C99AE] tracking-[0.08em] mb-1">
            Active Persona
          </div>
          <div className="text-xs font-bold text-[#FAF9F5] flex items-center gap-1.5 uppercase tracking-wide">
            <UserCheck className="w-3.5 h-3.5 text-[#E3432B]" />
            {currentRole}
          </div>
          <div className="text-[11px] text-[#8C99AE] mt-1 leading-snug font-sans">
            {currentRole === 'Regional Officer' && 'Authorized to review Scrutiny & recommend EVC visits.'}
            {currentRole === 'Bureau Officer' && 'Statutory approval authority for final LoA issuance.'}
            {currentRole === 'Committee Member' && 'Expert panelist for physical EVCs and SHC hearings.'}
            {currentRole === 'Institution' && 'College nodal coordinator for compliance submissions.'}
          </div>
        </div>

        <div className="text-[10px] text-[#626F84] leading-relaxed font-sans">
          AICTE Approval Process Handbook (APH) 2026-27 Compliant Engine.
        </div>
      </div>
    </aside>
  )
}
