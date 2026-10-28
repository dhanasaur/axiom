import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  FileText,
  Clock,
  CalendarDays,
  AlertTriangle,
  FileCheck,
  Filter,
  Search,
  ChevronRight,
  Activity,
  AlertCircle,
} from 'lucide-react'
import { StatCard } from '../components/Common/StatCard'
import { StatusBadge, StageBadge } from '../components/Common/StatusBadge'
import { Region, ApplicationStage, ApplicationStatus } from '../types'

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

  // Summary Metrics
  const totalAppsCount = applications.length
  const pendingScrutinyCount = applications.filter((a) => a.currentStage === 'Scrutiny').length
  const evcDueThisWeekCount = evcSchedules.filter(
    (e) => e.status === 'Due This Week' || e.status === 'Overdue'
  ).length
  const overdueUndertakingsCount = obligations.filter((o) => o.status === 'Overdue').length
  const expiringDocumentsCount = documents.filter(
    (d) => d.daysUntilExpiry <= 60
  ).length

  // Filtered Applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Region filter
      if (regionFilter !== 'All' && app.region !== regionFilter) {
        return false
      }
      // Stage filter
      if (stageFilter !== 'All' && app.currentStage !== stageFilter) {
        return false
      }
      // Status filter
      if (statusFilter !== 'All' && app.status !== statusFilter) {
        return false
      }
      // Search query
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
  }, [applications, regionFilter, stageFilter, statusFilter, searchQuery])

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
    setRegionFilter('All')
    setStageFilter('All')
    setStatusFilter('All')
    setSearchQuery('')
  }

  const hasActiveFilters =
    regionFilter !== 'All' || stageFilter !== 'All' || statusFilter !== 'All' || searchQuery !== ''

  return (
    <div className="space-y-6">
      {/* Role Banner / Context */}
      <div className="bg-[#1A1E24] text-white p-5 border border-[#2E3541] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#E3432B] text-white">
              ROLE: {currentRole}
            </span>
            <span className="text-xs text-[#8C99AE] font-mono">/ APPROVAL CYCLE 2026-27</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#FAF9F5] uppercase">
            Statutory Lifecycle & Compliance Monitor
          </h1>
          <p className="text-xs text-[#8C99AE] mt-1">
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/foresight')}
            className="px-3.5 py-2 bg-[#2E3541] hover:bg-[#3B4454] text-[#FAF9F5] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors border border-[#424C5D]"
          >
            <Activity className="w-3.5 h-3.5 text-[#E3432B]" />
            <span>Delay Foresight</span>
          </button>
          <button
            onClick={() => navigate('/evc-schedule')}
            className="px-3.5 py-2 bg-[#E3432B] hover:bg-[#C93520] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>EVC Calendar</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          title="Total Applications"
          value={totalAppsCount}
          subtitle="2026-27 Active Cycle"
          trend="+18% YoY"
          trendDirection="up"
          icon={FileText}
          iconColor="text-[#13161A]"
          iconBg="bg-[#E6E2D5]"
          accentColor="charcoal"
          onClick={() => resetFilters()}
        />

        <StatCard
          title="Pending Scrutiny"
          value={pendingScrutinyCount}
          subtitle="Awaiting officer sign-off"
          trend="Median: 12.4d"
          trendDirection="neutral"
          icon={Clock}
          iconColor="text-[#1E40AF]"
          iconBg="bg-[#DBEAFE]"
          accentColor="blue"
          onClick={() => {
            resetFilters()
            setStageFilter('Scrutiny')
          }}
          active={stageFilter === 'Scrutiny'}
        />

        <StatCard
          title="EVC Due This Week"
          value={evcDueThisWeekCount}
          subtitle="Visits requiring quorum"
          trend="2 Escalated"
          trendDirection="down"
          icon={CalendarDays}
          iconColor="text-[#6B21A8]"
          iconBg="bg-[#F3E8FF]"
          accentColor="amber"
          onClick={() => navigate('/evc-schedule')}
        />

        <StatCard
          title="Overdue Undertakings"
          value={overdueUndertakingsCount}
          subtitle="FDR / AEBAS / Safety"
          trend="Non-compliant"
          trendDirection="down"
          icon={AlertTriangle}
          iconColor="text-[#E3432B]"
          iconBg="bg-[#FEECE9]"
          accentColor="vermilion"
          onClick={() => navigate('/compliance')}
        />

        <StatCard
          title="Expiring Documents"
          value={expiringDocumentsCount}
          subtitle="Within 60-day window"
          trend="Renewal Required"
          trendDirection="down"
          icon={FileCheck}
          iconColor="text-[#D97706]"
          iconBg="bg-[#FEF3C7]"
          accentColor="amber"
          onClick={() => navigate('/compliance')}
        />
      </div>

      {/* Filter and Table Container */}
      <div className="bg-white border border-[#E6E2D5]">
        {/* Table Filter Controls */}
        <div className="p-4 border-b border-[#F1EFE8] space-y-3 bg-[#FAF9F5]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#E3432B]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#13161A]">
                Applications Caseload
              </h2>
              <span className="text-xs px-2 py-0.5 bg-[#1A1E24] text-white font-mono font-semibold">
                {filteredApplications.length} cases
              </span>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#E3432B] hover:underline font-bold uppercase tracking-wider"
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
                className="w-full bg-white text-[#13161A] text-xs pl-9 pr-3 py-2 border border-[#D8D2C2] focus:outline-none focus:border-[#E3432B]"
              />
            </div>

            {/* Region Filter */}
            <div>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value as Region | 'All')}
                className="w-full bg-white text-[#13161A] text-xs px-3 py-2 border border-[#D8D2C2] focus:outline-none focus:border-[#E3432B]"
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
                onChange={(e) => setStageFilter(e.target.value as ApplicationStage | 'All')}
                className="w-full bg-white text-[#13161A] text-xs px-3 py-2 border border-[#D8D2C2] focus:outline-none focus:border-[#E3432B]"
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
                onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | 'All')}
                className="w-full bg-white text-[#13161A] text-xs px-3 py-2 border border-[#D8D2C2] focus:outline-none focus:border-[#E3432B]"
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

        {/* Applications Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E6E2D5] text-[11px] font-bold uppercase tracking-wider text-[#626F84]">
                <th className="py-3.5 px-4">Institution Name & ID</th>
                <th className="py-3.5 px-4">Application Type</th>
                <th className="py-3.5 px-4">Current Stage</th>
                <th className="py-3.5 px-4 text-center">Days in Stage</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Assigned Officer</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1EFE8] text-xs">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8C99AE]">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FileText className="w-8 h-8 text-[#D8D2C2]" />
                      <p className="font-bold text-sm text-[#424C5D] uppercase">No applications match the selected filters.</p>
                      <button
                        onClick={resetFilters}
                        className="text-xs text-[#E3432B] hover:underline font-bold uppercase"
                      >
                        Clear filters to see all cases
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => navigate(`/applications/${app.id}`)}
                    className="hover:bg-[#FBFBF8] transition-colors cursor-pointer group"
                  >
                    {/* Institution Name & ID */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-[#13161A] group-hover:text-[#E3432B] transition-colors leading-snug">
                        {app.institutionName}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[10px] text-[#8C99AE] bg-[#F1EFE8] px-1.5 py-0.5 border border-[#E6E2D5]">
                          {app.applicationNumber}
                        </span>
                        <span className="text-[10px] text-[#626F84]">
                          {app.region.split(' ')[0]}
                        </span>
                        {app.isFlaggedByAI && (
                          <span
                            className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.2 bg-[#FEECE9] text-[#E3432B] border border-[#F8B6AB] uppercase"
                            title={app.aiFlagReason}
                          >
                            <AlertCircle className="w-2.5 h-2.5" /> Rule Flag
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Application Type */}
                    <td className="py-3.5 px-4 text-[#303742] font-medium">
                      <div>{app.type}</div>
                      <div className="text-[10px] text-[#8C99AE]">
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
                        className={`inline-block font-mono font-bold px-2 py-0.5 text-xs ${
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
                    <td className="py-3.5 px-4 text-[#424C5D] font-medium">
                      <div>{app.assignedOfficer}</div>
                      <div className="text-[10px] text-[#8C99AE] font-mono">Target: {app.targetCompletionDate}</div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/applications/${app.id}`)
                        }}
                        className="p-1.5 text-[#626F84] hover:text-[#E3432B] hover:bg-[#FEECE9]"
                        title="Open Case File"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar without colored circles/dots */}
        <div className="p-3 bg-[#FAF9F5] border-t border-[#E6E2D5] flex items-center justify-between text-xs text-[#626F84]">
          <div>
            Showing <strong className="text-[#13161A] font-mono">{filteredApplications.length}</strong> of{' '}
            <strong className="text-[#13161A] font-mono">{applications.length}</strong> total active cases
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono uppercase">
            <span className="text-[#166534] font-bold">[ON TRACK]</span>
            <span className="text-[#92400E] font-bold">[APPROACHING]</span>
            <span className="text-[#B91C1C] font-bold">[OVERDUE]</span>
          </div>
        </div>
      </div>
    </div>
  )
}
