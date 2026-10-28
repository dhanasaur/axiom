import React from 'react'
import { LucideIcon } from 'lucide-react'

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
  onClick?: () => void
  active?: boolean
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
  onClick,
  active = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative p-5 bg-white border transition-all ${
        active
          ? 'border-[#E3432B] border-t-4 border-t-[#E3432B]'
          : 'border-[#E6E2D5] hover:border-[#1A1E24]'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#626F84]">
            {title}
          </span>
          <div className="mt-2 text-2xl md:text-3xl font-extrabold text-[#13161A] font-mono tracking-tight">
            {value}
          </div>
        </div>
        <div className={`p-2.5 ${iconBg} ${iconColor} flex items-center justify-center border border-black/10`}>
          <Icon className="w-5 h-5 stroke-[2]" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-[#F1EFE8] flex items-center justify-between text-xs text-[#626F84]">
          {subtitle && <span className="truncate text-[11px]">{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold font-mono text-[11px] ml-auto ${
                trendDirection === 'up'
                  ? 'text-[#16A34A]'
                  : trendDirection === 'down'
                  ? 'text-[#E3432B]'
                  : 'text-[#626F84]'
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
