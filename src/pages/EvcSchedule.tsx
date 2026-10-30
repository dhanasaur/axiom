import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import {
  CalendarDays,
  Clock,
  AlertTriangle,
  Users,
  MapPin,
  ExternalLink,
  ShieldAlert,
  Search,
  Calendar as CalendarIcon,
  List,
  Video,
} from 'lucide-react'
import { CountUp } from '../components/Common/CountUp'

export const EvcSchedule: React.FC = () => {
  const { evcSchedules } = useApp()
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Due This Week' | 'Overdue' | 'Scheduled' | 'Completed'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  const filteredSchedules = useMemo(() => {
    return evcSchedules.filter((item) => {
      if (statusFilter !== 'All' && item.status !== statusFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesName = item.institutionName.toLowerCase().includes(q)
        const matchesApp = item.applicationNumber.toLowerCase().includes(q)
        const matchesChair = item.committeeChairman.toLowerCase().includes(q)
        if (!matchesName && !matchesApp && !matchesChair) return false
      }
      return true
    })
  }, [evcSchedules, statusFilter, searchQuery])

  // Count summaries
  const overdueCount = evcSchedules.filter((e) => e.status === 'Overdue').length
  const dueThisWeekCount = evcSchedules.filter((e) => e.status === 'Due This Week').length
  const scheduledCount = evcSchedules.filter((e) => e.status === 'Scheduled').length

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-[#1A1E24] text-white p-6 rounded-xl border border-[#2E3541] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-display uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-[#E3432B] text-white">
              Expert Visit Committee (EVC)
            </span>
            <span className="text-xs text-[#8C99AE] font-mono">/ Peer Inspection Oversight</span>
          </div>
          <h1 className="text-xl md:text-2xl font-display font-extrabold tracking-tight text-[#FAF9F5] uppercase">
            EVC Schedule & On-Site Inspection Tracker
          </h1>
          <p className="text-xs text-[#8C99AE] mt-1 font-sans">
            Tracking peer evaluations, geo-tagged verification, and automated escalation flags for delayed committee reports.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-[#242B35] p-1 rounded-lg border border-[#2E3541] shadow-inner">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-display font-bold uppercase tracking-wider transition-all ${
              viewMode === 'list'
                ? 'bg-[#E3432B] text-white shadow-sm'
                : 'text-[#BAC3D2] hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
            <span>List View</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-display font-bold uppercase tracking-wider transition-all ${
              viewMode === 'calendar'
                ? 'bg-[#E3432B] text-white shadow-sm'
                : 'text-[#BAC3D2] hover:text-white'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Timeline</span>
          </button>
        </div>
      </motion.div>

      {/* Summary Chips with Staggered Count-Ups */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setStatusFilter(statusFilter === 'Overdue' ? 'All' : 'Overdue')}
          className={`p-4 bg-white rounded-xl border cursor-pointer transition-all shadow-xs ${
            statusFilter === 'Overdue'
              ? 'border-[#E3432B] border-l-4 border-l-[#E3432B] ring-1 ring-[#E3432B]/20'
              : 'border-[#E6E2D5] hover:border-[#E3432B]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-bold uppercase tracking-wider text-[#E3432B]">
              Overdue Inspections
            </span>
            <span className="p-1.5 rounded-md bg-[#FEECE9] text-[#E3432B]">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-[#13161A]">
            <CountUp value={overdueCount} /> Committees
          </div>
          <span className="text-[11px] text-[#8C99AE] mt-1 block font-sans">
            Escalation dispatched to Zonal RO
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setStatusFilter(statusFilter === 'Due This Week' ? 'All' : 'Due This Week')}
          className={`p-4 bg-white rounded-xl border cursor-pointer transition-all shadow-xs ${
            statusFilter === 'Due This Week'
              ? 'border-[#D97706] border-l-4 border-l-[#D97706] ring-1 ring-[#D97706]/20'
              : 'border-[#E6E2D5] hover:border-[#D97706]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-bold uppercase tracking-wider text-[#D97706]">
              Due This Week
            </span>
            <span className="p-1.5 rounded-md bg-[#FEF3C7] text-[#D97706]">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-[#13161A]">
            <CountUp value={dueThisWeekCount} /> Visits Active
          </div>
          <span className="text-[11px] text-[#8C99AE] mt-1 block font-sans">
            Quorum and logistics verified
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setStatusFilter(statusFilter === 'Scheduled' ? 'All' : 'Scheduled')}
          className={`p-4 bg-white rounded-xl border cursor-pointer transition-all shadow-xs ${
            statusFilter === 'Scheduled'
              ? 'border-[#2563EB] border-l-4 border-l-[#2563EB] ring-1 ring-[#2563EB]/20'
              : 'border-[#E6E2D5] hover:border-[#2563EB]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-bold uppercase tracking-wider text-[#2563EB]">
              Upcoming Scheduled
            </span>
            <span className="p-1.5 rounded-md bg-[#DBEAFE] text-[#2563EB]">
              <CalendarDays className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-[#13161A]">
            <CountUp value={scheduledCount} /> Pipelines
          </div>
          <span className="text-[11px] text-[#8C99AE] mt-1 block font-sans">
            Next 14 business days
          </span>
        </motion.div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#E6E2D5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8C99AE] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search institution, committee chair..."
            className="w-full bg-[#FAF9F5] pl-9 pr-3 py-2 rounded-lg border border-[#D8D2C2] focus:outline-none focus:border-[#E3432B] font-sans"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[#626F84] font-display font-bold uppercase tracking-wider text-[11px]">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#FAF9F5] px-3 py-2 rounded-lg border border-[#D8D2C2] focus:outline-none focus:border-[#E3432B] font-sans"
          >
            <option value="All">All Schedules</option>
            <option value="Due This Week">Due This Week</option>
            <option value="Overdue">Overdue / Escalated</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredSchedules.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-[#E6E2D5] text-[#8C99AE]">
              <CalendarDays className="w-10 h-10 text-[#D8D2C2] mx-auto mb-2" />
              <p className="font-display font-bold text-[#13161A] uppercase">No EVC schedules matching your criteria.</p>
            </div>
          ) : (
            filteredSchedules.map((evc, idx) => (
              <motion.div
                key={evc.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.04 }}
                className={`bg-white rounded-xl border p-5 transition-all shadow-xs hover:shadow-md ${
                  evc.isEscalated
                    ? 'border-[#FCA5A5] bg-[#FFFBFB] border-l-4 border-l-[#E3432B]'
                    : evc.status === 'Due This Week'
                    ? 'border-[#FDE68A] border-l-4 border-l-[#D97706]'
                    : 'border-[#E6E2D5]'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left: Institution and EVC Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#F1EFE8] text-[#13161A] border border-[#E6E2D5]">
                        {evc.applicationNumber}
                      </span>
                      <span className="text-[10px] text-[#626F84] font-sans">{evc.region}</span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          evc.status === 'Completed'
                            ? 'bg-[#EBF7F0] text-[#166534]'
                            : evc.status === 'Overdue'
                            ? 'bg-[#FEECE9] text-[#E3432B]'
                            : evc.status === 'Due This Week'
                            ? 'bg-[#FEF3C7] text-[#92400E]'
                            : 'bg-[#EFF6FF] text-[#1E40AF]'
                        }`}
                      >
                        {evc.status}
                      </span>
                      {evc.isEscalated && (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E3432B] text-white uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-white pulse-ring-alert" />
                          Escalated
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-display font-bold text-[#13161A] uppercase">
                      {evc.institutionName}
                    </h3>

                    {/* Mode and Campus Address */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#626F84] font-sans">
                      <span className="flex items-center gap-1">
                        {evc.mode === 'Physical On-Site' ? (
                          <MapPin className="w-3.5 h-3.5 text-[#E3432B]" />
                        ) : (
                          <Video className="w-3.5 h-3.5 text-[#2563EB]" />
                        )}
                        <strong>{evc.mode}</strong>
                      </span>
                      <span>/</span>
                      <span className="truncate max-w-md">{evc.venueAddress}</span>
                    </div>

                    {/* Committee roster */}
                    <div className="mt-3 p-3.5 bg-[#FAF9F5] rounded-lg border border-[#F1EFE8] text-xs space-y-1">
                      <div className="text-[11px] font-display font-bold text-[#13161A] flex items-center gap-1.5 uppercase">
                        <Users className="w-3.5 h-3.5 text-[#E3432B]" />
                        Chairman: {evc.committeeChairman}
                      </div>
                      <div className="text-[11px] text-[#626F84] pl-5 font-sans">
                        {evc.committeeMembers.join(' / ')}
                      </div>
                    </div>

                    {evc.isEscalated && evc.escalationReason && (
                      <div className="p-3.5 rounded-lg bg-[#FEECE9] border border-[#F8B6AB] text-xs text-[#991B1B] font-sans">
                        <strong className="font-display uppercase">Escalation Note:</strong> {evc.escalationReason}
                      </div>
                    )}
                  </div>

                  {/* Right: Date and Action */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#F1EFE8]">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] text-[#8C99AE] block uppercase tracking-wider font-display font-bold">
                        Scheduled Date
                      </span>
                      <span className="font-mono font-extrabold text-lg text-[#13161A] block">
                        {evc.scheduledDate}
                      </span>
                      <span
                        className={`text-xs font-bold block uppercase ${
                          evc.daysUntilEvc < 0
                            ? 'text-[#E3432B]'
                            : evc.daysUntilEvc <= 3
                            ? 'text-[#D97706]'
                            : 'text-[#16A34A]'
                        }`}
                      >
                        {evc.daysUntilEvc < 0
                          ? `${Math.abs(evc.daysUntilEvc)} days overdue`
                          : evc.daysUntilEvc === 0
                          ? 'Today'
                          : `${evc.daysUntilEvc} days until EVC`}
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(`/applications/${evc.applicationId}`)}
                      className="px-4 py-2 rounded-lg bg-[#1A1E24] hover:bg-[#E3432B] text-white text-xs font-display font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <span>Open Case</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Calendar View Mode */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-xl border border-[#E6E2D5] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1EFE8]">
            <h3 className="text-xs font-display font-bold uppercase tracking-wider text-[#13161A]">
              Inspection Timeline (October – November 2026)
            </h3>
            <span className="text-xs text-[#8C99AE] font-mono">APH 3-day report window</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {filteredSchedules.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/applications/${item.applicationId}`)}
                className={`p-4 rounded-xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
                  item.isEscalated
                    ? 'border-[#FCA5A5] bg-[#FFFBFB] border-t-4 border-t-[#E3432B]'
                    : item.status === 'Completed'
                    ? 'border-[#BBF7D0] bg-[#F7FDF9]'
                    : 'border-[#E6E2D5] bg-[#FAF9F5]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-[#E3432B]">{item.scheduledDate}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      item.daysUntilEvc < 0
                        ? 'bg-[#FEECE9] text-[#E3432B]'
                        : item.daysUntilEvc <= 3
                        ? 'bg-[#FEF3C7] text-[#92400E]'
                        : 'bg-[#EBF7F0] text-[#166534]'
                    }`}
                  >
                    {item.daysUntilEvc < 0 ? `${Math.abs(item.daysUntilEvc)}d Overdue` : `${item.daysUntilEvc}d Left`}
                  </span>
                </div>

                <h4 className="font-display font-bold text-xs text-[#13161A] line-clamp-2 leading-tight uppercase">
                  {item.institutionName}
                </h4>

                <div className="mt-3 pt-2.5 border-t border-[#E6E2D5] text-[11px] text-[#626F84] space-y-1 font-sans">
                  <div className="truncate">Chair: {item.committeeChairman.split(' (')[0]}</div>
                  <div className="text-[10px] text-[#8C99AE] font-mono">{item.mode}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
