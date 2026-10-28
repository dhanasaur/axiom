import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  AlertTriangle,
  Clock,
  ShieldCheck,
  Info,
  Search,
  ArrowRight,
  Activity,
  Layers,
} from 'lucide-react'
import { StageBadge, StatusBadge, RiskBadge } from '../components/Common/StatusBadge'

export const AxiomForesight: React.FC = () => {
  const { applications } = useApp()
  const navigate = useNavigate()

  const [riskFilter, setRiskFilter] = useState<'All' | 'High' | 'Moderate' | 'Low'>('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Sorted by Delay Risk Score descending
  const sortedApplications = useMemo(() => {
    return [...applications]
      .filter((app) => {
        if (riskFilter !== 'All' && app.delayRiskLevel !== riskFilter) return false
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          return (
            app.institutionName.toLowerCase().includes(q) ||
            app.applicationNumber.toLowerCase().includes(q) ||
            app.predictedBottleneck.toLowerCase().includes(q)
          )
        }
        return true
      })
      .sort((a, b) => b.delayRiskScore - a.delayRiskScore)
  }, [applications, riskFilter, searchQuery])

  const highRiskCount = applications.filter((a) => a.delayRiskLevel === 'High').length
  const modRiskCount = applications.filter((a) => a.delayRiskLevel === 'Moderate').length
  const lowRiskCount = applications.filter((a) => a.delayRiskLevel === 'Low').length
  const averageRisk = Math.round(
    applications.reduce((acc, a) => acc + a.delayRiskScore, 0) / applications.length
  )

  return (
    <div className="space-y-6">
      {/* Foresight Header Banner */}
      <div className="bg-[#1A1E24] text-white p-6 border border-[#2E3541] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#E3432B] text-white flex items-center gap-1 font-mono">
              <Activity className="w-3.5 h-3.5" />
              STATUTORY FORESIGHT ENGINE
            </span>
            {/* Disclaimer Badge */}
            <span className="text-xs px-2 py-0.5 bg-[#242B35] text-[#BAC3D2] border border-[#3B4454] flex items-center gap-1 font-mono">
              <Info className="w-3 h-3 text-[#E3432B]" />
              Statistical estimate — advisory only
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#FAF9F5] uppercase">
            Predictive Statutory Delay & Bottleneck Analysis
          </h1>
          <p className="text-xs text-[#8C99AE] mt-1 max-w-2xl">
            Empirical turnaround indicators based on regional approval datasets. Identifies potential 
            deadlocks in Scrutiny, EVC quorum availability, and SAC/SHC appellate queues before statutory deadlines lapse.
          </p>
        </div>

        <div className="text-right bg-[#242B35] p-3 border border-[#2E3541] shrink-0">
          <span className="text-[10px] text-[#8C99AE] uppercase font-bold tracking-wider block">
            National Caseload Average
          </span>
          <span className="text-2xl font-mono font-extrabold text-[#FAF9F5] block">
            {averageRisk}% INDEX
          </span>
          <span className="text-[11px] text-[#D97706] font-semibold uppercase">Moderate Pipeline Friction</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          onClick={() => setRiskFilter(riskFilter === 'High' ? 'All' : 'High')}
          className={`p-5 bg-white border cursor-pointer transition-all ${
            riskFilter === 'High'
              ? 'border-[#E3432B] border-l-4 border-l-[#E3432B]'
              : 'border-[#F8B6AB] hover:border-[#E3432B]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E3432B]">
              High Delay Probability (&gt;70%)
            </span>
            <AlertTriangle className="w-4 h-4 text-[#E3432B]" />
          </div>
          <div className="mt-2 text-3xl font-extrabold font-mono text-[#13161A]">
            {highRiskCount} Cases
          </div>
          <p className="text-xs text-[#626F84] mt-1">
            Expected to exceed statutory median by +12 to +19 days.
          </p>
        </div>

        <div
          onClick={() => setRiskFilter(riskFilter === 'Moderate' ? 'All' : 'Moderate')}
          className={`p-5 bg-white border cursor-pointer transition-all ${
            riskFilter === 'Moderate'
              ? 'border-[#D97706] border-l-4 border-l-[#D97706]'
              : 'border-[#FDE68A] hover:border-[#D97706]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
              Moderate Delay Risk (40–70%)
            </span>
            <Clock className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="mt-2 text-3xl font-extrabold font-mono text-[#13161A]">
            {modRiskCount} Cases
          </div>
          <p className="text-xs text-[#626F84] mt-1">
            Turnaround friction resolvable via applicant clarification.
          </p>
        </div>

        <div
          onClick={() => setRiskFilter(riskFilter === 'Low' ? 'All' : 'Low')}
          className={`p-5 bg-white border cursor-pointer transition-all ${
            riskFilter === 'Low'
              ? 'border-[#16A34A] border-l-4 border-l-[#16A34A]'
              : 'border-[#BBF7D0] hover:border-[#16A34A]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">
              Low Delay Risk (&lt;40%)
            </span>
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
          </div>
          <div className="mt-2 text-3xl font-extrabold font-mono text-[#13161A]">
            {lowRiskCount} Cases
          </div>
          <p className="text-xs text-[#626F84] mt-1">
            Clean track record; tracking within or ahead of schedule.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-[#E6E2D5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8C99AE] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search institution or predicted bottleneck..."
            className="w-full bg-[#FAF9F5] pl-9 pr-3 py-2 border border-[#D8D2C2] focus:outline-none focus:border-[#E3432B]"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#626F84] font-bold uppercase tracking-wider text-[11px]">Risk Filter:</span>
          <div className="flex items-center bg-[#FAF9F5] p-1 border border-[#D8D2C2]">
            {(['All', 'High', 'Moderate', 'Low'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setRiskFilter(lvl)}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all ${
                  riskFilter === lvl
                    ? 'bg-[#1A1E24] text-white'
                    : 'text-[#626F84] hover:text-[#13161A]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Predictive Applications List */}
      <div className="space-y-3">
        {sortedApplications.length === 0 ? (
          <div className="p-12 text-center bg-white border border-[#E6E2D5] text-[#8C99AE]">
            <Activity className="w-10 h-10 text-[#D8D2C2] mx-auto mb-2" />
            <p className="font-bold text-[#13161A] uppercase">No cases match this risk filter.</p>
          </div>
        ) : (
          sortedApplications.map((app) => (
            <div
              key={app.id}
              onClick={() => navigate(`/applications/${app.id}`)}
              className="bg-white border border-[#E6E2D5] hover:border-[#1A1E24] p-5 transition-all cursor-pointer group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Section: Details & Bottleneck String */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <RiskBadge score={app.delayRiskScore} level={app.delayRiskLevel} />
                    <StageBadge stage={app.currentStage} size="sm" />
                    <StatusBadge status={app.status} size="sm" />
                    <span className="font-mono text-[10px] text-[#8C99AE] bg-[#F1EFE8] px-1.5 py-0.5 border border-[#E6E2D5]">
                      {app.applicationNumber}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#13161A] group-hover:text-[#E3432B] transition-colors uppercase">
                    {app.institutionName}
                  </h3>

                  {/* Bottleneck Explanation String */}
                  <div className="p-3 bg-[#FAF9F5] border border-[#F1EFE8] text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#13161A] mb-0.5 uppercase text-[10px]">
                      <Layers className="w-3.5 h-3.5 text-[#E3432B]" />
                      <span>Delay Bottleneck Diagnosis:</span>
                    </div>
                    <p className="text-[#424C5D] leading-relaxed">
                      {app.predictedBottleneck}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8C99AE]">
                    <span>
                      Historical Regional Variance:{' '}
                      <strong
                        className={`font-mono ${
                          app.historicalVarianceDays > 0 ? 'text-[#E3432B]' : 'text-[#16A34A]'
                        }`}
                      >
                        {app.historicalVarianceDays > 0
                          ? `+${app.historicalVarianceDays} days longer than median`
                          : `${app.historicalVarianceDays} days faster than median`}
                      </strong>
                    </span>
                    <span>/</span>
                    <span>Assigned Officer: {app.assignedOfficer}</span>
                  </div>
                </div>

                {/* Right Section: Visual Progress Gauge & Action */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#F1EFE8] lg:w-48">
                  <div className="w-full text-left lg:text-right">
                    <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                      <span className="text-[#626F84] uppercase text-[10px]">Risk Factor:</span>
                      <span
                        className={
                          app.delayRiskScore > 70
                            ? 'text-[#E3432B]'
                            : app.delayRiskScore > 40
                            ? 'text-[#D97706]'
                            : 'text-[#16A34A]'
                        }
                      >
                        {app.delayRiskScore}%
                      </span>
                    </div>

                    <div className="w-full bg-[#E6E2D5] h-2">
                      <div
                        className={`h-full ${
                          app.delayRiskScore > 70
                            ? 'bg-[#E3432B]'
                            : app.delayRiskScore > 40
                            ? 'bg-[#D97706]'
                            : 'bg-[#16A34A]'
                        }`}
                        style={{ width: `${app.delayRiskScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/applications/${app.id}`)
                    }}
                    className="px-3.5 py-2 bg-[#1A1E24] group-hover:bg-[#E3432B] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    <span>Inspect Case</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Advisory Bottom Banner */}
      <div className="p-4 bg-[#FAF9F5] border border-[#E6E2D5] flex items-center justify-between text-xs text-[#626F84]">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#E3432B]" />
          <span>
            <strong>Disclaimer:</strong> Statutory Foresight indicators are econometric guidelines intended to support human officer prioritization, not statutory determinations.
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#8C99AE] hidden md:inline">
          APH-FORESIGHT-V2
        </span>
      </div>
    </div>
  )
}
