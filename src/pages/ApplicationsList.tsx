import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import {
  Filter,
  Search,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Layers,
} from 'lucide-react'
import { StatusBadge, StageBadge } from '../components/Common/StatusBadge'
import { TableRowSkeleton } from '../components/Common/Skeleton'
import { Region, ApplicationStage, ApplicationStatus, Application } from '../types'

export const ApplicationsList: React.FC = () => {
  const {
    applications,
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

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 350)
    return () => clearTimeout(timer)
  }, [])

  const handleFilterChange = <T,>(setter: (val: T) => void, val: T) => {
    setIsLoading(true)
    setter(val)
    setTimeout(() => setIsLoading(false), 240)
  }

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
        if (!matchesName && !matchesId && !matchesOfficer) return false
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

  return (
    <div className="space-y-6">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-[#1A1E24] text-white p-6 rounded-xl border border-[#2E3541] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-display uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-[#E3432B] text-white">
              National Repository
            </span>
            <span className="text-xs text-[#8C99AE] font-mono">/ All Institutional Proposals</span>
          </div>
          <h1 className="text-xl md:text-2xl font-display font-extrabold tracking-tight text-[#FAF9F5] uppercase">
            Master Applications Caseload
          </h1>
          <p className="text-xs text-[#8C99AE] mt-1 font-sans">
            Browse, search, and inspect all {applications.length} active technical institution applications across India.
          </p>
        </div>

        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#242B35] text-[#BAC3D2] border border-[#2E3541] shrink-0">
          Showing <strong className="text-white">{filteredApplications.length}</strong> of {applications.length} cases
        </div>
      </motion.div>

      {/* Filter and Table Container */}
      <div className="bg-white rounded-xl border border-[#E6E2D5] shadow-xs overflow-hidden">
        {/* Table Filter Controls */}
        <div className="p-4 border-b border-[#F1EFE8] space-y-3 bg-[#FAF9F5]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#E3432B]" />
              <h2 className="text-xs font-display font-bold uppercase tracking-wider text-[#13161A]">
                Search & Filter Parameters
              </h2>
            </div>

            {(regionFilter !== 'All' || stageFilter !== 'All' || statusFilter !== 'All' || searchQuery !== '') && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#E3432B] hover:underline font-display font-bold uppercase tracking-wider"
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
                placeholder="Search institution or ID..."
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

        {/* Applications Table */}
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
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center space-y-3 max-w-sm mx-auto"
                    >
                      <div className="w-14 h-14 rounded-full bg-[#FAF9F5] border border-[#E6E2D5] flex items-center justify-center text-[#8C99AE]">
                        <Layers className="w-7 h-7 text-[#BAC3D2]" />
                      </div>
                      <h3 className="font-display font-bold text-base text-[#13161A] uppercase">
                        No Applications Found
                      </h3>
                      <p className="text-xs text-[#626F84] leading-relaxed font-sans">
                        No proposals matched the current filter combination.
                      </p>
                      <button
                        onClick={resetFilters}
                        className="px-4 py-2 rounded-lg bg-[#E3432B] text-white font-display text-xs font-bold uppercase tracking-wider hover:bg-[#C93520] transition-colors"
                      >
                        Clear Filters
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

                    <td className="py-3.5 px-4 text-[#303742] font-medium font-sans">
                      <div>{app.type}</div>
                      <div className="text-[10px] text-[#8C99AE] font-mono mt-0.5">
                        Intake: {app.proposedIntake} / {app.programCount} Progs
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <StageBadge stage={app.currentStage} />
                    </td>

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

                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} />
                    </td>

                    <td className="py-3.5 px-4 text-[#424C5D] font-medium font-sans">
                      <div>{app.assignedOfficer}</div>
                      <div className="text-[10px] text-[#8C99AE] font-mono mt-0.5">
                        Target: {app.targetCompletionDate}
                      </div>
                    </td>

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
      </div>
    </div>
  )
}
