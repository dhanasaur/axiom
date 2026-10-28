import React from 'react'
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
import { Download } from 'lucide-react'

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

export const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#1A1E24] text-white p-6 border border-[#2E3541] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#E3432B] text-white">
              Regulatory Analytics
            </span>
            <span className="text-xs text-[#8C99AE] font-mono">/ Executive Bureau Intelligence</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#FAF9F5] uppercase">
            AICTE Statutory Analytics & Pendency Reports
          </h1>
          <p className="text-xs text-[#8C99AE] mt-1">
            Cross-zonal statistical indicators across scrutiny turnarounds, EVC completion quotas, and compliance enforcement.
          </p>
        </div>

        <button
          onClick={() =>
            alert(
              '[Demo Export] Generating AICTE AY 2026-27 Executive Summary Dossier (PDF format) with charts and zonal statistics...'
            )
          }
          className="px-4 py-2.5 bg-[#E3432B] hover:bg-[#C93520] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Statutory Digest</span>
        </button>
      </div>

      {/* High-level statutory KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 bg-white border border-[#E6E2D5]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#626F84]">
            National Applications Total
          </span>
          <div className="mt-2 text-2xl font-extrabold font-mono text-[#13161A]">1,180</div>
          <span className="text-[11px] text-[#16A34A] font-bold mt-1 block">
            +14.2% YoY Growth
          </span>
        </div>

        <div className="p-4 bg-white border border-[#E6E2D5]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#626F84]">
            Median Scrutiny Turnaround
          </span>
          <div className="mt-2 text-2xl font-extrabold font-mono text-[#13161A]">11.4 Days</div>
          <span className="text-[11px] text-[#16A34A] font-bold mt-1 block">
            Target: &lt;14 Days (Compliant)
          </span>
        </div>

        <div className="p-4 bg-white border border-[#E6E2D5]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#626F84]">
            Overall EVC Success Rate
          </span>
          <div className="mt-2 text-2xl font-extrabold font-mono text-[#13161A]">94.2%</div>
          <span className="text-[11px] text-[#16A34A] font-bold mt-1 block">
            358 of 380 inspections completed
          </span>
        </div>

        <div className="p-4 bg-white border border-[#E6E2D5]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#626F84]">
            Overdue Undertakings Ratio
          </span>
          <div className="mt-2 text-2xl font-extrabold font-mono text-[#E3432B]">2.8%</div>
          <span className="text-[11px] text-[#16A34A] font-bold mt-1 block">
            Down from 8.1% in May
          </span>
        </div>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Application Pendency by Region */}
        <div className="bg-white p-5 border border-[#E6E2D5] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F1EFE8]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#13161A]">
                Application Pendency by Regional Office (RO)
              </h3>
              <p className="text-xs text-[#626F84]">On-track vs Approaching vs Overdue caseloads</p>
            </div>
            <span className="text-[10px] font-mono bg-[#FAF9F5] px-2 py-1 border border-[#E6E2D5]">
              ZONAL DATA
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionPendencyData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE8" />
                <XAxis
                  dataKey="region"
                  tick={{ fontSize: 10, fill: '#626F84' }}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11, fill: '#626F84' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1E24',
                    border: '1px solid #2E3541',
                    borderRadius: '0px',
                    color: '#FAF9F5',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="onTrack" name="On Track" fill="#16A34A" radius={[0, 0, 0, 0]} />
                <Bar dataKey="approaching" name="Approaching" fill="#D97706" radius={[0, 0, 0, 0]} />
                <Bar dataKey="overdue" name="Overdue" fill="#E3432B" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Overdue Undertakings Trend (Last 6 Months) */}
        <div className="bg-white p-5 border border-[#E6E2D5] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F1EFE8]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#13161A]">
                Overdue Undertakings & Resolution Trend
              </h3>
              <p className="text-xs text-[#626F84]">Last 6 Months (May – October 2026)</p>
            </div>
            <span className="text-[10px] font-mono bg-[#FAF9F5] px-2 py-1 border border-[#E6E2D5]">
              MONTHLY VELOCITY
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overdueTrendData} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE8" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#626F84' }} />
                <YAxis tick={{ fontSize: 11, fill: '#626F84' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1E24',
                    border: '1px solid #2E3541',
                    borderRadius: '0px',
                    color: '#FAF9F5',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="overdue"
                  name="Overdue Undertakings"
                  stroke="#E3432B"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  name="Resolved & Verified"
                  stroke="#16A34A"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: EVC Completion Quota Rate */}
        <div className="bg-white p-5 border border-[#E6E2D5] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F1EFE8]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#13161A]">
                EVC Completion Quota Rate (%)
              </h3>
              <p className="text-xs text-[#626F84]">Peer inspection turnarounds by month</p>
            </div>
            <span className="text-[10px] font-mono bg-[#FAF9F5] px-2 py-1 border border-[#E6E2D5]">
              EFFICIENCY %
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evcCompletionData} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE8" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#626F84' }} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#626F84' }} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1E24',
                    border: '1px solid #2E3541',
                    borderRadius: '0px',
                    color: '#FAF9F5',
                    fontSize: '11px',
                  }}
                  formatter={(value: any) => [`${value}%`, 'Completion Rate']}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  name="Completion Rate (%)"
                  stroke="#E3432B"
                  strokeWidth={2}
                  fillOpacity={0.2}
                  fill="#E3432B"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Stage Distribution Donut */}
        <div className="bg-white p-5 border border-[#E6E2D5] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F1EFE8]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#13161A]">
                National Workflow Stage Distribution (%)
              </h3>
              <p className="text-xs text-[#626F84]">Active share of cases per statutory stage</p>
            </div>
            <span className="text-[10px] font-mono bg-[#FAF9F5] px-2 py-1 border border-[#E6E2D5]">
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
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {stageDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1E24',
                    border: '1px solid #2E3541',
                    borderRadius: '0px',
                    color: '#FAF9F5',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
