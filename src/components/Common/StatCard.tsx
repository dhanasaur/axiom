import React from 'react'
import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { CountUp } from './CountUp'
import { Sparkline } from './Sparkline'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: string
  trendDirection?: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  accentColor?: 'vermilion' | 'amber' | 'emerald' | 'charcoal' | 'blue'
  urgency?: 'normal' | 'moderate' | 'critical'
  sparklineData?: number[]
  onClick?: () => void
  active?: boolean
  isHero?: boolean
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendDirection = 'neutral',
  icon: Icon,
  iconColor = 'text-[#E3432B]',
  iconBg = 'bg-[#FEECE9]',
  accentColor = 'charcoal',
  urgency = 'normal',
  sparklineData,
  onClick,
  active = false,
  isHero = false,
}) => {
  // Edge border and glow based on urgency or accent
  const urgencyStyles = {
    critical: 'border-l-4 border-l-[#E3432B] shadow-[0_2px_12px_rgba(227,67,43,0.08)]',
    moderate: 'border-l-4 border-l-[#D97706] shadow-[0_2px_12px_rgba(217,119,6,0.06)]',
    normal: active ? 'border-l-4 border-l-[#E3432B]' : 'border-l-4 border-l-transparent',
  }

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      whileTap={onClick ? { scale: 0.985 } : undefined}
      onClick={onClick}
      className={`relative overflow-hidden p-4 rounded-lg bg-white border transition-all ${
        active
          ? 'border-[#E3432B] shadow-md ring-1 ring-[#E3432B]/30'
          : 'border-[#E6E2D5] hover:border-[#BAC3D2] shadow-xs'
      } ${urgencyStyles[urgency]} ${onClick ? 'cursor-pointer select-none' : ''} ${
        isHero ? 'sm:col-span-2 lg:col-span-2' : ''
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <span className="font-display text-[11px] font-semibold uppercase tracking-[0.08em] text-[#626F84]">
            {title}
          </span>
          <div
            className={`font-mono font-bold tracking-tight text-[#13161A] ${
              isHero ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'
            }`}
          >
            <CountUp value={value} />
          </div>
        </div>

        {/* Restyled Icon: duotone with accent dot */}
        <div className="relative p-2.5 rounded-md bg-[#F8F7F2] border border-[#E6E2D5] flex items-center justify-center shrink-0">
          <Icon className={`w-5 h-5 ${iconColor} stroke-[1.75]`} />
          <span
            className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${
              urgency === 'critical'
                ? 'bg-[#E3432B] pulse-ring-alert'
                : urgency === 'moderate'
                ? 'bg-[#D97706]'
                : active
                ? 'bg-[#E3432B]'
                : 'bg-transparent'
            }`}
          />
        </div>
      </div>

      {/* Sparkline & Footer Section */}
      <div className="mt-3 pt-2.5 border-t border-[#F1EFE8] flex items-center justify-between text-xs">
        <div className="truncate pr-2">
          {subtitle && (
            <span className="text-[11px] text-[#8C99AE] font-sans truncate block">
              {subtitle}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Sparkline
            data={
              sparklineData ||
              (trendDirection === 'up'
                ? [10, 12, 14, 13, 17, 19, 23]
                : trendDirection === 'down'
                ? [24, 22, 19, 20, 16, 14, 11]
                : [15, 14, 16, 15, 17, 15, 16])
            }
            direction={trendDirection}
            width={54}
            height={18}
          />

          {trend && (
            <span
              className={`font-mono font-semibold text-[11px] px-1.5 py-0.5 rounded ${
                trendDirection === 'up'
                  ? 'bg-[#EBF7F0] text-[#166534]'
                  : trendDirection === 'down'
                  ? 'bg-[#FEECE9] text-[#B91C1C]'
                  : 'bg-[#F1EFE8] text-[#424C5D]'
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
