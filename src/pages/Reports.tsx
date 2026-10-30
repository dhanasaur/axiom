import React, { useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts'
import { motion } from 'framer-motion'
import { Download, Loader2 } from 'lucide-react'
import { mockApi } from '../services/mockApi'
import { useToast } from '../context/ToastContext'
import { CountUp } from '../components/Common/CountUp'

// 1. Application Pendency by Region
const regionPendencyData = [
  { region: 'Northern (NRO)', onTrack: 142, approaching: 48, overdue: 19 },
  { region: 'Southern (SRO)', onTrack: 210, approaching: 62, overdue: 12 },
  { region: 'Western (WRO)', onTrack: 185, approaching: 54, overdue: 24 },
  { region: 'Eastern (ERO)', onTrack: 98, approaching: 39, overdue: 28 },
  { region: 'South-Western (SWRO)', onTrack: 165, approaching: 31, overdue: 8 },
  { region: 'North-Western (NWRO)', onTrack: 112, approaching: 44, overdue: 21 },
  { region: 'Central (CRO)', onTrack: 84, approaching: 26, overdue: 11 },
]

// 2. Overdue Undertakings Trend Over Last 6 Months
const overdueTrendData = [
  { month: 'May 2026', totalUndertakings: 520, overdue: 42, resolved: 38 },
  { month: 'Jun 2026', totalUndertakings: 610, overdue: 58, resolved: 49 },
  { month: 'Jul 2026', totalUndertakings: 780, overdue: 74, resolved: 65 },
  { month: 'Aug 2026', totalUndertakings: 920, overdue: 61, resolved: 82 },
  { month: 'Sep 2026', totalUndertakings: 1040, overdue: 47, resolved: 98 },
  { month: 'Oct 2026', totalUndertakings: 1180, overdue: 34, resolved: 112 },
]

// 3. EVC Completion Rate (%) by Month
const evcCompletionData = [
  { month: 'May', scheduled: 85, completed: 81, rate: 95.2 },
  { month: 'Jun', scheduled: 120, completed: 109, rate: 90.8 },
  { month: 'Jul', scheduled: 195, completed: 172, rate: 88.2 },
  { month: 'Aug', scheduled: 240, completed: 218, rate: 90.8 },
  { month: 'Sep', scheduled: 310, completed: 288, rate: 92.9 },
  { month: 'Oct', scheduled: 380, completed: 358, rate: 94.2 },
]

// 4. Stage Breakdown Distribution
const stageDistributionData = [
  { name: 'Scrutiny', value: 34, color: '#2563EB' },
  { name: 'EVC', value: 26, color: '#7C3AED' },
  { name: 'SAC/SHC', value: 14, color: '#D97706' },
  { name: 'Decision', value: 16, color: '#0284C7' },
  { name: 'Post-Approval', value: 10, color: '#16A34A' },
]

// Custom Recharts Dark Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#13161A] border border-[#2E3541] rounded-lg p-3 shadow-xl text-white text-xs min-w-36">
        <p className="font-display font-bold text-[#E2E6EE] border-b border-[#2E3541] pb-1 mb-2">
          {label}
        </p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-[#BAC3D2]">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color || entry.stroke || entry.fill }}
                />
                {entry.name}:
              </span>
              <span className="font-mono font-bold text-white">
                {entry.value}
                {entry.unit || ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export const Reports: React.FC = () => {
  const { success, error } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  // Export action calling mockApi with simulated network failure and retry
  const handleExportDigest = async () => {
    setIsExporting(true)
    try {
      const res = await mockApi.exportStatutoryDigest()
      setIsExporting(false)
      success(
        'Statutory Digest Generated',
        `File ${res.filename} is ready for download. PDF compiled with all zonal figures.`
      )
    } catch (err: any) {
      setIsExporting(false)
      error(
        'Export Gateway Exception',
        err.message || 'Failed to compile AICTE PDF Digest.',
        {
          label: 'Retry Export',
          onClick: () => handleExportDigest(),
        }
      )
    }
  }

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
              Regulatory Analytics
            </span>
            <span className="text-xs text-[#8C99AE] font-mono">/ Executive Bureau Intelligence</span>
          </div>
          <h1 className="text-xl md:text-2xl font-display font-extrabold tracking-tight text-[#FAF9F5] uppercase">
            AICTE Statutory Analytics & Pendency Reports
          </h1>
          <p className="text-xs text-[#8C99AE] mt-1 font-sans">
            Cross-zonal statistical indicators across scrutiny turnarounds, EVC completion quotas, and compliance enforcement.
          </p>
        </div>

        {/* Mutating Action Button with deliberate delay and error handling */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExportDigest}
          disabled={isExporting}
          className="px-4 py-2.5 rounded-lg bg-[#E3432B] hover:bg-[#C93520] disabled:opacity-60 text-white text-xs font-display font-bold uppercase tracking-wider flex items-center gap-2 transition-colors self-start md:self-auto shadow-sm"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Compiling PDF Digest...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Export Statutory Digest</span>
            </>
          )}
        </motion.button>
      </motion.div>

      {/* High-level statutory KPI cards with CountUp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-xl border border-[#E6E2D5] shadow-xs">
          <span className="text-[11px] font-display font-semibold uppercase tracking-wider text-[#626F84]">
            National Applications Total
          </span>
          <div className="mt-2 text-2xl font-extrabold font-mono text-[#13161A]">
            <CountUp value="1,180" />
          </div>
          <span className="text-[11px] text-[#16A34A] font-bold mt-1 block font-mono">
            +14.2% YoY Growth
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E6E2D5] shadow-xs">
          <span className="text-[11px] font-display font-semibold uppercase tracking-wider text-[#626F84]">
            Median Scrutiny Turnaround
          </span>
          <div className="mt-2 text-2xl font-extrabold font-mono text-[#13161A]">
            <CountUp value="11.4" /> Days
          </div>
          <span className="text-[11px] text-[#16A34A] font-bold mt-1 block font-mono">
            Target: &lt;14 Days (Compliant)
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E6E2D5] shadow-xs">
          <span className="text-[11px] font-display font-semibold uppercase tracking-wider text-[#626F84]">
            Overall EVC Success Rate
          </span>
          <div className="mt-2 text-2xl font-extrabold font-mono text-[#13161A]">
            <CountUp value="94.2" />%
          </div>
          <span className="text-[11px] text-[#16A34A] font-bold mt-1 block font-mono">
            358 of 380 inspections completed
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E6E2D5] shadow-xs">
          <span className="text-[11px] font-display font-semibold uppercase tracking-wider text-[#626F84]">
            Overdue Undertakings Ratio
          </span>
          <div className="mt-2 text-2xl font-extrabold font-mono text-[#E3432B]">
            <CountUp value="2.8" />%
          </div>
          <span className="text-[11px] text-[#16A34A] font-bold mt-1 block font-mono">
            Down from 8.1% in May
          </span>
        </div>
      </div>

      {/* Grid of Animated Charts with Custom Tooltips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Application Pendency by Region */}
        <div className="bg-white p-5 rounded-xl border border-[#E6E2D5] space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#F1EFE8]">
            <div>
              <h3 className="text-xs font-display font-bold uppercase tracking-wider text-[#13161A]">
                Application Pendency by Regional Office (RO)
              </h3>
              <p className="text-xs text-[#626F84] font-sans">On-track vs Approaching vs Overdue caseloads</p>
            </div>
            <span className="text-[10px] font-mono bg-[#FAF9F5] px-2 py-1 rounded border border-[#E6E2D5]">
              ZONAL DATA
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionPendencyData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE8" />
                <XAxis
                  dataKey="region"
                  tick={{ fontSize: 10, fill: '#626F84', fontFamily: 'Inter' }}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11, fill: '#626F84', fontFamily: 'JetBrains Mono' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', fontFamily: 'Inter' }} />
                <Bar dataKey="onTrack" name="On Track" fill="#16A34A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approaching" name="Approaching" fill="#D97706" radius={[4, 4, 0, 0]} />
                <Bar dataKey="overdue" name="Overdue" fill="#E3432B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Overdue Undertakings Trend (Last 6 Months) */}
        <div className="bg-white p-5 rounded-xl border border-[#E6E2D5] space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#F1EFE8]">
            <div>
              <h3 className="text-xs font-display font-bold uppercase tracking-wider text-[#13161A]">
                Overdue Undertakings & Resolution Trend
              </h3>
              <p className="text-xs text-[#626F84] font-sans">Last 6 Months (May – October 2026)</p>
            </div>
            <span className="text-[10px] font-mono bg-[#FAF9F5] px-2 py-1 rounded border border-[#E6E2D5]">
              MONTHLY VELOCITY
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overdueTrendData} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE8" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#626F84', fontFamily: 'Inter' }} />
                <YAxis tick={{ fontSize: 11, fill: '#626F84', fontFamily: 'JetBrains Mono' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', fontFamily: 'Inter' }} />
                <Line
                  type="monotone"
                  dataKey="overdue"
                  name="Overdue Undertakings"
                  stroke="#E3432B"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, strokeWidth: 1 }}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  name="Resolved & Verified"
                  stroke="#16A34A"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, strokeWidth: 1 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: EVC Completion Quota Rate */}
        <div className="bg-white p-5 rounded-xl border border-[#E6E2D5] space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#F1EFE8]">
            <div>
              <h3 className="text-xs font-display font-bold uppercase tracking-wider text-[#13161A]">
                EVC Completion Quota Rate (%)
              </h3>
              <p className="text-xs text-[#626F84] font-sans">Peer inspection turnarounds by month</p>
            </div>
            <span className="text-[10px] font-mono bg-[#FAF9F5] px-2 py-1 rounded border border-[#E6E2D5]">
              EFFICIENCY %
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evcCompletionData} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
                <defs>
                  <linearGradient id="evcGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E3432B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#E3432B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE8" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#626F84', fontFamily: 'Inter' }} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#626F84', fontFamily: 'JetBrains Mono' }} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="rate"
                  name="Completion Rate (%)"
                  stroke="#E3432B"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#evcGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Stage Distribution Donut */}
        <div className="bg-white p-5 rounded-xl border border-[#E6E2D5] space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#F1EFE8]">
            <div>
              <h3 className="text-xs font-display font-bold uppercase tracking-wider text-[#13161A]">
                National Workflow Stage Distribution (%)
              </h3>
              <p className="text-xs text-[#626F84] font-sans">Active share of cases per statutory stage</p>
            </div>
            <span className="text-[10px] font-mono bg-[#FAF9F5] px-2 py-1 rounded border border-[#E6E2D5]">
              100% TOTAL
            </span>
          </div>

          <div className="h-72 w-full pt-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stageDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {stageDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
