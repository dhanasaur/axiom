import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import {
  FileText,
  Clock,
  CalendarDays,
  AlertTriangle,
  Filter,
  Search,
  ChevronRight,
  Activity,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Layers,
} from 'lucide-react'
import { StatCard } from '../components/Common/StatCard'
import { StatusBadge, StageBadge } from '../components/Common/StatusBadge'
import { TableRowSkeleton, StatCardSkeleton } from '../components/Common/Skeleton'
import { Region, ApplicationStage, ApplicationStatus, Application } from '../types'

export const Dashboard: React.FC = () => {
  const {
    currentRole,
    applications,
    documents,
    obligations,
    evcSchedules,
    regionFilter,
    setRegionFilter,
    stageFilter,
    setStageFilter,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
  } = useApp()

  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [sortField, setSortField] = useState<keyof Application>('daysInStage')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Simulate initial data loading with skeleton for perceived backend realism
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 450)
    return () => clearTimeout(timer)
  }, [])

  // Brief shimmer on filter change
  const handleFilterChange = <T,>(setter: (val: T) => void, val: T) => {
    setIsLoading(true)
    setter(val)
    setTimeout(() => setIsLoading(false), 260)
  }

  // Summary Metrics
  const totalAppsCount = applications.length
  const pendingScrutinyCount = applications.filter((a) => a.currentStage === 'Scrutiny').length
  const evcDueThisWeekCount = evcSchedules.filter(
    (e) => e.status === 'Due This Week' || e.status === 'Overdue'
  ).length
  const overdueUndertakingsCount = obligations.filter((o) => o.status === 'Overdue').length
  const expiringDocumentsCount = documents.filter((d) => d.daysUntilExpiry <= 60).length

  // Filtered & Sorted Applications
  const filteredApplications = useMemo(() => {
    const list = applications.filter((app) => {
      if (regionFilter !== 'All' && app.region !== regionFilter) return false
      if (stageFilter !== 'All' && app.currentStage !== stageFilter) return false
      if (statusFilter !== 'All' && app.status !== statusFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesName = app.institutionName.toLowerCase().includes(q)
        const matchesId = app.applicationNumber.toLowerCase().includes(q)
        const matchesOfficer = app.assignedOfficer.toLowerCase().includes(q)
        const matchesRegion = app.region.toLowerCase().includes(q)
        if (!matchesName && !matchesId && !matchesOfficer && !matchesRegion) {
          return false
        }
      }
      return true
    })

    return list.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]
      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string)
      }
      if (typeof aVal === 'number') {
        return sortDirection === 'asc'
          ? (aVal as number) - (bVal as number)
          : (bVal as number) - (aVal as number)
      }
      return 0
    })
  }, [applications, regionFilter, stageFilter, statusFilter, searchQuery, sortField, sortDirection])

  const regions: (Region | 'All')[] = [
    'All',
    'Northern (NRO)',
    'Southern (SRO)',
    'Western (WRO)',
    'Eastern (ERO)',
    'South-Western (SWRO)',
    'North-Western (NWRO)',
    'Central (CRO)',
  ]

  const stages: (ApplicationStage | 'All')[] = [
    'All',
    'Scrutiny',
    'EVC',
    'SAC/SHC',
    'Decision',
    'Post-Approval',
  ]

  const statuses: (ApplicationStatus | 'All')[] = [
    'All',
    'On track',
    'Approaching deadline',
    'Overdue',
  ]

  const resetFilters = () => {
    setIsLoading(true)
    setRegionFilter('All')
    setStageFilter('All')
    setStatusFilter('All')
    setSearchQuery('')
    setTimeout(() => setIsLoading(false), 240)
  }

  const handleSort = (field: keyof Application) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const hasActiveFilters =
    regionFilter !== 'All' || stageFilter !== 'All' || statusFilter !== 'All' || searchQuery !== ''

  return (
    <div className="space-y-6">
      {/* Role Banner / Context */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-[#1A1E24] text-white p-5 rounded-xl border border-[#2E3541] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-display uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-[#E3432B] text-white">
              ROLE: {currentRole}
            </span>
            <span className="text-xs text-[#8C99AE] font-mono">/ APPROVAL CYCLE 2026-27</span>
          </div>
          <h1 className="text-xl md:text-2xl font-display font-extrabold tracking-tight text-[#FAF9F5] uppercase">
            Statutory Lifecycle & Compliance Monitor
          </h1>
          <p className="text-xs text-[#8C99AE] mt-1 font-sans max-w-2xl">
            {currentRole === 'Regional Officer' &&
              'Monitoring zonal applications, scrutiny verification, and organizing EVC panels.'}
            {currentRole === 'Bureau Officer' &&
              'National executive oversight, pending clearances, and final approval letters.'}
            {currentRole === 'Committee Member' &&
              'Appellate hearings schedule, EVC inspection assignments, and expert evaluations.'}
            {currentRole === 'Institution' &&
              'Managing institution applications, resolving scrutiny deficiencies, and uploading statutory undertakings.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/foresight')}
            className="px-3.5 py-2 rounded-lg bg-[#2E3541] hover:bg-[#3B4454] text-[#FAF9F5] text-xs font-display font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors border border-[#424C5D]"
          >
            <Activity className="w-3.5 h-3.5 text-[#E3432B]" />
            <span>Delay Foresight</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/evc-schedule')}
            className="px-3.5 py-2 rounded-lg bg-[#E3432B] hover:bg-[#C93520] text-white text-xs font-display font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>EVC Calendar</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Summary Stat Cards with Asymmetric Hero sizing */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className="sm:col-span-2 lg:col-span-2">
            <StatCardSkeleton />
          </div>
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.05 },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5"
        >
          {/* Asymmetric Hero Card */}
          <StatCard
            isHero={true}
            title="Total Active Caseload"
            value={totalAppsCount}
            subtitle="AY 2026-27 National Technical Proposals"
            trend="+18% YoY"
            trendDirection="up"
            icon={FileText}
            iconColor="text-[#13161A]"
            iconBg="bg-[#E6E2D5]"
            accentColor="charcoal"
            sparklineData={[18, 20, 22, 21, 23, 24, 25]}
            onClick={() => resetFilters()}
          />

          <StatCard
            title="Pending Scrutiny"
            value={pendingScrutinyCount}
            subtitle="Awaiting officer sign-off"
            trend="12.4d Med."
            trendDirection="neutral"
            icon={Clock}
            iconColor="text-[#1E40AF]"
            iconBg="bg-[#DBEAFE]"
            accentColor="blue"
            urgency="normal"
            sparklineData={[6, 7, 5, 8, 9, 8, 7]}
            onClick={() => {
              resetFilters()
              handleFilterChange(setStageFilter, 'Scrutiny')
            }}
            active={stageFilter === 'Scrutiny'}
          />

          <StatCard
            title="EVC Due This Week"
            value={evcDueThisWeekCount}
            subtitle="Quorum verification required"
            trend="2 Escalated"
            trendDirection="down"
            icon={CalendarDays}
            iconColor="text-[#6B21A8]"
            iconBg="bg-[#F3E8FF]"
            accentColor="amber"
            urgency="moderate"
            sparklineData={[3, 4, 2, 5, 4, 3, 4]}
            onClick={() => navigate('/evc-schedule')}
          />

          <StatCard
            title="Overdue Items"
            value={overdueUndertakingsCount}
            subtitle="FDR / AEBAS non-compliant"
            trend="Immediate"
            trendDirection="down"
            icon={AlertTriangle}
            iconColor="text-[#E3432B]"
            iconBg="bg-[#FEECE9]"
            accentColor="vermilion"
            urgency="critical"
            sparklineData={[8, 7, 6, 8, 5, 4, 3]}
            onClick={() => navigate('/compliance')}
          />
        </motion.div>
      )}

      {/* Filter and Table Container */}
      <div className="bg-white rounded-xl border border-[#E6E2D5] shadow-xs overflow-hidden">
        {/* Table Filter Controls */}
        <div className="p-4 border-b border-[#F1EFE8] space-y-3 bg-[#FAF9F5]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#E3432B]" />
              <h2 className="text-xs font-display font-bold uppercase tracking-wider text-[#13161A]">
                Applications Caseload
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1E24] text-white font-mono font-semibold">
                {filteredApplications.length} cases
              </span>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#E3432B] hover:underline font-display font-bold uppercase tracking-wider transition-colors"
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#8C99AE] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter institution or ID..."
                className="w-full bg-white text-[#13161A] text-xs pl-9 pr-3 py-2 rounded-lg border border-[#D8D2C2] focus:outline-none focus:border-[#E3432B] font-sans"
              />
            </div>

            {/* Region Filter */}
            <div>
              <select
                value={regionFilter}
                onChange={(e) => handleFilterChange(setRegionFilter, e.target.value as Region | 'All')}
                className="w-full bg-white text-[#13161A] text-xs px-3 py-2 rounded-lg border border-[#D8D2C2] focus:outline-none focus:border-[#E3432B] font-sans"
              >
                <option value="All">All Regions (National)</option>
                {regions.filter((r) => r !== 'All').map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Stage Filter */}
            <div>
              <select
                value={stageFilter}
                onChange={(e) => handleFilterChange(setStageFilter, e.target.value as ApplicationStage | 'All')}
                className="w-full bg-white text-[#13161A] text-xs px-3 py-2 rounded-lg border border-[#D8D2C2] focus:outline-none focus:border-[#E3432B] font-sans"
              >
                <option value="All">All Workflow Stages</option>
                {stages.filter((s) => s !== 'All').map((s) => (
                  <option key={s} value={s}>
                    Stage: {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange(setStatusFilter, e.target.value as ApplicationStatus | 'All')}
                className="w-full bg-white text-[#13161A] text-xs px-3 py-2 rounded-lg border border-[#D8D2C2] focus:outline-none focus:border-[#E3432B] font-sans"
              >
                <option value="All">All Statuses (Track/Overdue)</option>
                {statuses.filter((st) => st !== 'All').map((st) => (
                  <option key={st} value={st}>
                    Status: {st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Applications Table with Sticky Header */}
        <div className="overflow-x-auto max-h-[640px]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[#FAF9F5] border-b border-[#E6E2D5] shadow-xs">
              <tr className="text-[11px] font-display font-semibold uppercase tracking-[0.08em] text-[#626F84]">
                <th
                  onClick={() => handleSort('institutionName')}
                  className="py-3 px-4 cursor-pointer hover:text-[#13161A] select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Institution Name & ID</span>
                    {sortField === 'institutionName' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-[#E3432B]" /> : <ArrowDown className="w-3.5 h-3.5 text-[#E3432B]" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-[#BAC3D2]" />
                    )}
                  </div>
                </th>
                <th className="py-3 px-4">Application Type</th>
                <th
                  onClick={() => handleSort('currentStage')}
                  className="py-3 px-4 cursor-pointer hover:text-[#13161A] select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Current Stage</span>
                    {sortField === 'currentStage' && (
                      sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-[#E3432B]" /> : <ArrowDown className="w-3.5 h-3.5 text-[#E3432B]" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('daysInStage')}
                  className="py-3 px-4 text-center cursor-pointer hover:text-[#13161A] select-none"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Days in Stage</span>
                    {sortField === 'daysInStage' && (
                      sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-[#E3432B]" /> : <ArrowDown className="w-3.5 h-3.5 text-[#E3432B]" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-4 cursor-pointer hover:text-[#13161A] select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    {sortField === 'status' && (
                      sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-[#E3432B]" /> : <ArrowDown className="w-3.5 h-3.5 text-[#E3432B]" />
                    )}
                  </div>
                </th>
                <th className="py-3 px-4">Assigned Officer</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1EFE8] text-xs">
              {isLoading ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[#8C99AE]">
                    {/* Empty state illustration */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center space-y-3 max-w-sm mx-auto"
                    >
                      <div className="w-14 h-14 rounded-full bg-[#FAF9F5] border border-[#E6E2D5] flex items-center justify-center text-[#8C99AE]">
                        <Layers className="w-7 h-7 text-[#BAC3D2]" />
                      </div>
                      <h3 className="font-display font-bold text-base text-[#13161A] uppercase tracking-wide">
                        No Matching Applications
                      </h3>
                      <p className="text-xs text-[#626F84] leading-relaxed font-sans">
                        No cases match the active filter criteria. Try adjusting regional boundaries or stage parameters.
                      </p>
                      <button
                        onClick={resetFilters}
                        className="px-4 py-2 rounded-lg bg-[#E3432B] text-white font-display text-xs font-bold uppercase tracking-wider hover:bg-[#C93520] transition-colors"
                      >
                        Reset All Filters
                      </button>
                    </motion.div>
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app, index) => (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
                    onClick={() => navigate(`/applications/${app.id}`)}
                    className="hover:bg-[#FBFBF8] hover:shadow-xs transition-all cursor-pointer group"
                  >
                    {/* Institution Name & ID */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-display font-bold text-[#13161A] group-hover:text-[#E3432B] transition-colors leading-snug">
                        {app.institutionName}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[10px] text-[#626F84] bg-[#F1EFE8] px-1.5 py-0.5 rounded border border-[#E6E2D5]">
                          {app.applicationNumber}
                        </span>
                        <span className="text-[10px] text-[#626F84] font-sans">
                          {app.region.split(' ')[0]}
                        </span>
                        {app.isFlaggedByAI && (
                          <span
                            className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FEECE9] text-[#E3432B] border border-[#F8B6AB] uppercase"
                            title={app.aiFlagReason}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E3432B] pulse-ring-alert" />
                            Rule Flag
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Application Type */}
                    <td className="py-3.5 px-4 text-[#303742] font-medium font-sans">
                      <div>{app.type}</div>
                      <div className="text-[10px] text-[#8C99AE] font-mono mt-0.5">
                        Intake: {app.proposedIntake} seats / {app.programCount} Progs
                      </div>
                    </td>

                    {/* Current Stage */}
                    <td className="py-3.5 px-4">
                      <StageBadge stage={app.currentStage} />
                    </td>

                    {/* Days in Stage */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block font-mono font-bold px-2.5 py-0.5 rounded-full text-xs ${
                          app.daysInStage > 20
                            ? 'bg-[#FEECE9] text-[#E3432B] border border-[#F8B6AB]'
                            : app.daysInStage > 10
                            ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                            : 'bg-[#F1EFE8] text-[#303742]'
                        }`}
                      >
                        {app.daysInStage} d
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} />
                    </td>

                    {/* Assigned Officer */}
                    <td className="py-3.5 px-4 text-[#424C5D] font-medium font-sans">
                      <div>{app.assignedOfficer}</div>
                      <div className="text-[10px] text-[#8C99AE] font-mono mt-0.5">
                        Target: {app.targetCompletionDate}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/applications/${app.id}`)
                        }}
                        className="p-1.5 rounded-md text-[#626F84] hover:text-[#E3432B] hover:bg-[#FEECE9] transition-colors"
                        title="Open Case File"
                      >
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="p-3.5 bg-[#FAF9F5] border-t border-[#E6E2D5] flex items-center justify-between text-xs text-[#626F84]">
          <div className="font-sans">
            Showing <strong className="text-[#13161A] font-mono">{filteredApplications.length}</strong> of{' '}
            <strong className="text-[#13161A] font-mono">{applications.length}</strong> total active cases
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono uppercase">
            <span className="flex items-center gap-1.5 text-[#166534] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" /> ON TRACK
            </span>
            <span className="flex items-center gap-1.5 text-[#92400E] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" /> APPROACHING
            </span>
            <span className="flex items-center gap-1.5 text-[#B91C1C] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E3432B] pulse-ring-alert" /> OVERDUE
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
