import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  FileText,
  Filter,
  Search,
  ChevronRight,
  AlertCircle,
} from 'lucide-react'
import { StatusBadge, StageBadge } from '../components/Common/StatusBadge'
import { Region, ApplicationStage, ApplicationStatus } from '../types'

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

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
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

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#1A1E24] text-white p-6 border border-[#2E3541] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#E3432B] text-white">
              National Repository
            </span>
            <span className="text-xs text-[#8C99AE] font-mono">/ All Institutional Proposals</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#FAF9F5] uppercase">
            Master Applications Caseload
          </h1>
          <p className="text-xs text-[#8C99AE] mt-1">
            Browse, search, and inspect all {applications.length} active technical institution applications across India.
          </p>
        </div>

        <div className="text-xs font-mono px-3 py-1.5 bg-[#242B35] text-[#BAC3D2] border border-[#2E3541] shrink-0">
          Showing <strong>{filteredApplications.length}</strong> of {applications.length} cases
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-white border border-[#E6E2D5]">
        {/* Table Filter Controls */}
        <div className="p-4 border-b border-[#F1EFE8] space-y-3 bg-[#FAF9F5]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#E3432B]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#13161A]">
                Search & Filter Parameters
              </h2>
            </div>

            {(regionFilter !== 'All' || stageFilter !== 'All' || statusFilter !== 'All' || searchQuery !== '') && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#E3432B] hover:underline font-bold uppercase"
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

                    <td className="py-3.5 px-4 text-[#303742] font-medium">
                      <div>{app.type}</div>
                      <div className="text-[10px] text-[#8C99AE]">
                        Intake: {app.proposedIntake} / {app.programCount} Progs
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <StageBadge stage={app.currentStage} />
                    </td>

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

                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} />
                    </td>

                    <td className="py-3.5 px-4 text-[#424C5D] font-medium">
                      <div>{app.assignedOfficer}</div>
                      <div className="text-[10px] text-[#8C99AE] font-mono">Target: {app.targetCompletionDate}</div>
                    </td>

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
      </div>
    </div>
  )
}
