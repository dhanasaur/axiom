import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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
  Gauge,
  Sliders,
} from 'lucide-react'
import { StageBadge, StatusBadge, RiskBadge } from '../components/Common/StatusBadge'
import { CountUp } from '../components/Common/CountUp'

// Radial Gauge Component for Risk
const RadialRiskGauge: React.FC<{ score: number }> = ({ score }) => {
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference
  const color = score > 70 ? '#E3432B' : score > 40 ? '#D97706' : '#16A34A'

  return (
    <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
      <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 72 72">
        <circle
          cx="36"
          cy="36"
          r={radius}
          stroke="#E6E2D5"
          strokeWidth="5"
          fill="transparent"
        />
        <motion.circle
          cx="36"
          cy="36"
          r={radius}
          stroke={color}
          strokeWidth="5.5"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-mono font-bold text-xs text-[#13161A] leading-none">
          {score}%
        </span>
        <span className="text-[8px] font-display uppercase font-semibold text-[#8C99AE] mt-0.5">
          RISK
        </span>
      </div>
    </div>
  )
}

export const AxiomForesight: React.FC = () => {
  const { applications } = useApp()
  const navigate = useNavigate()

  const [riskFilter, setRiskFilter] = useState<'All' | 'High' | 'Moderate' | 'Low'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [gaugeMode, setGaugeMode] = useState<'bar' | 'radial'>('bar')

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
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-[#1A1E24] text-white p-6 rounded-xl border border-[#2E3541] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-display uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-[#E3432B] text-white flex items-center gap-1 font-mono">
              <Activity className="w-3.5 h-3.5" />
              STATUTORY FORESIGHT ENGINE
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#242B35] text-[#BAC3D2] border border-[#3B4454] flex items-center gap-1 font-mono">
              <Info className="w-3 h-3 text-[#E3432B]" />
              Statistical estimate — advisory only
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-display font-extrabold tracking-tight text-[#FAF9F5] uppercase">
            Predictive Statutory Delay & Bottleneck Analysis
          </h1>
          <p className="text-xs text-[#8C99AE] mt-1 max-w-2xl font-sans">
            Empirical turnaround indicators based on regional approval datasets. Identifies potential 
            deadlocks in Scrutiny, EVC quorum availability, and SAC/SHC appellate queues before statutory deadlines lapse.
          </p>
        </div>

        <div className="text-right bg-[#242B35] p-3.5 rounded-lg border border-[#2E3541] shrink-0 shadow-inner">
          <span className="text-[10px] text-[#8C99AE] font-display uppercase font-bold tracking-wider block">
            National Caseload Average
          </span>
          <span className="text-2xl font-mono font-extrabold text-[#FAF9F5] block">
            <CountUp value={averageRisk} />% INDEX
          </span>
          <span className="text-[11px] text-[#D97706] font-semibold uppercase font-sans">Moderate Pipeline Friction</span>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setRiskFilter(riskFilter === 'High' ? 'All' : 'High')}
          className={`p-5 bg-white rounded-xl border cursor-pointer transition-all shadow-xs ${
            riskFilter === 'High'
              ? 'border-[#E3432B] border-l-4 border-l-[#E3432B] ring-1 ring-[#E3432B]/20'
              : 'border-[#F8B6AB] hover:border-[#E3432B]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-bold uppercase tracking-wider text-[#E3432B]">
              High Delay Probability (&gt;70%)
            </span>
            <span className="p-1.5 rounded-md bg-[#FEECE9] text-[#E3432B]">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-extrabold font-mono text-[#13161A]">
            <CountUp value={highRiskCount} /> Cases
          </div>
          <p className="text-xs text-[#626F84] mt-1 font-sans">
            Expected to exceed statutory median by +12 to +19 days.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setRiskFilter(riskFilter === 'Moderate' ? 'All' : 'Moderate')}
          className={`p-5 bg-white rounded-xl border cursor-pointer transition-all shadow-xs ${
            riskFilter === 'Moderate'
              ? 'border-[#D97706] border-l-4 border-l-[#D97706] ring-1 ring-[#D97706]/20'
              : 'border-[#FDE68A] hover:border-[#D97706]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-bold uppercase tracking-wider text-[#D97706]">
              Moderate Delay Risk (40–70%)
            </span>
            <span className="p-1.5 rounded-md bg-[#FEF3C7] text-[#D97706]">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-extrabold font-mono text-[#13161A]">
            <CountUp value={modRiskCount} /> Cases
          </div>
          <p className="text-xs text-[#626F84] mt-1 font-sans">
            Turnaround friction resolvable via applicant clarification.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setRiskFilter(riskFilter === 'Low' ? 'All' : 'Low')}
          className={`p-5 bg-white rounded-xl border cursor-pointer transition-all shadow-xs ${
            riskFilter === 'Low'
              ? 'border-[#16A34A] border-l-4 border-l-[#16A34A] ring-1 ring-[#16A34A]/20'
              : 'border-[#BBF7D0] hover:border-[#16A34A]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-bold uppercase tracking-wider text-[#16A34A]">
              Low Delay Risk (&lt;40%)
            </span>
            <span className="p-1.5 rounded-md bg-[#EBF7F0] text-[#16A34A]">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-extrabold font-mono text-[#13161A]">
            <CountUp value={lowRiskCount} /> Cases
          </div>
          <p className="text-xs text-[#626F84] mt-1 font-sans">
            Clean track record; tracking within or ahead of schedule.
          </p>
        </motion.div>
      </div>

      {/* Filter and Search Bar with View Toggle */}
      <div className="bg-white p-4 rounded-xl border border-[#E6E2D5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8C99AE] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search institution or predicted bottleneck..."
            className="w-full bg-[#FAF9F5] pl-9 pr-3 py-2 rounded-lg border border-[#D8D2C2] focus:outline-none focus:border-[#E3432B] font-sans"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Radial / Bar Visualization Toggle */}
          <div className="flex items-center bg-[#FAF9F5] p-1 rounded-lg border border-[#D8D2C2]">
            <button
              onClick={() => setGaugeMode('bar')}
              title="Horizontal Bar Gauge"
              className={`p-1.5 rounded text-xs transition-all ${
                gaugeMode === 'bar' ? 'bg-[#1A1E24] text-white' : 'text-[#626F84]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setGaugeMode('radial')}
              title="Radial Circular Gauge"
              className={`p-1.5 rounded text-xs transition-all ${
                gaugeMode === 'radial' ? 'bg-[#1A1E24] text-white' : 'text-[#626F84]'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-[#626F84] font-display font-bold uppercase tracking-wider text-[11px]">Risk:</span>
          <div className="flex items-center bg-[#FAF9F5] p-1 rounded-lg border border-[#D8D2C2]">
            {(['All', 'High', 'Moderate', 'Low'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setRiskFilter(lvl)}
                className={`px-3 py-1 rounded text-xs font-display font-bold uppercase tracking-wider transition-all ${
                  riskFilter === lvl
                    ? 'bg-[#1A1E24] text-white shadow-xs'
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
          <div className="p-12 text-center bg-white rounded-xl border border-[#E6E2D5] text-[#8C99AE]">
            <Activity className="w-10 h-10 text-[#D8D2C2] mx-auto mb-2" />
            <p className="font-display font-bold text-[#13161A] uppercase">No cases match this risk filter.</p>
          </div>
        ) : (
          sortedApplications.map((app, idx) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
              onClick={() => navigate(`/applications/${app.id}`)}
              className="bg-white rounded-xl border border-[#E6E2D5] hover:border-[#1A1E24] p-5 transition-all cursor-pointer group shadow-xs hover:shadow-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Section: Details & Bottleneck String */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <RiskBadge score={app.delayRiskScore} level={app.delayRiskLevel} />
                    <StageBadge stage={app.currentStage} size="sm" />
                    <StatusBadge status={app.status} size="sm" />
                    <span className="font-mono text-[10px] text-[#8C99AE] bg-[#F1EFE8] px-2 py-0.5 rounded border border-[#E6E2D5]">
                      {app.applicationNumber}
                    </span>
                  </div>

                  <h3 className="text-base font-display font-bold text-[#13161A] group-hover:text-[#E3432B] transition-colors uppercase">
                    {app.institutionName}
                  </h3>

                  {/* Bottleneck Explanation String */}
                  <div className="p-3.5 bg-[#FAF9F5] rounded-lg border border-[#F1EFE8] text-xs">
                    <div className="flex items-center gap-1.5 font-display font-bold text-[#13161A] mb-0.5 uppercase text-[10px]">
                      <Layers className="w-3.5 h-3.5 text-[#E3432B]" />
                      <span>Delay Bottleneck Diagnosis:</span>
                    </div>
                    <p className="text-[#424C5D] leading-relaxed font-sans">
                      {app.predictedBottleneck}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8C99AE] font-sans">
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

                {/* Right Section: Visual Progress Gauge & Primary CTA */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#F1EFE8] lg:w-56">
                  {gaugeMode === 'radial' ? (
                    <RadialRiskGauge score={app.delayRiskScore} />
                  ) : (
                    <div className="w-full text-left lg:text-right">
                      <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5">
                        <span className="text-[#626F84] font-display uppercase text-[10px]">Risk Factor:</span>
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

                      <div className="w-full bg-[#E6E2D5] h-2.5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${app.delayRiskScore}%` }}
                          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                          className={`h-full rounded-full ${
                            app.delayRiskScore > 70
                              ? 'bg-[#E3432B]'
                              : app.delayRiskScore > 40
                              ? 'bg-[#D97706]'
                              : 'bg-[#16A34A]'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Primary CTA: Elevated visual presence */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/applications/${app.id}`)
                    }}
                    className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#E3432B] to-[#C93520] hover:from-[#C93520] hover:to-[#B02B18] text-white text-xs font-display font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
                  >
                    <span>INSPECT CASE</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Advisory Bottom Banner */}
      <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#E6E2D5] flex items-center justify-between text-xs text-[#626F84]">
        <div className="flex items-center gap-2 font-sans">
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
