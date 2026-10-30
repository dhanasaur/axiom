import React from 'react'
import {
  ApplicationStatus,
  ApplicationStage,
  ObligationStatus,
  DocumentUrgency,
} from '../../types'
import { CheckCircle2, Clock, AlertTriangle, AlertCircle, ShieldAlert, ShieldCheck } from 'lucide-react'

interface StatusBadgeProps {
  status: ApplicationStatus | string
  size?: 'sm' | 'md'
  showIcon?: boolean
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs font-semibold'

  switch (status) {
    case 'On track':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#EBF7F0] text-[#166534] border border-[#BBF7D0] font-sans ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] shrink-0" />
          {showIcon && <CheckCircle2 className="w-3 h-3 text-[#16A34A] hidden" />}
          On track
        </span>
      )
    case 'Approaching deadline':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] font-sans ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
          {showIcon && <Clock className="w-3 h-3 text-[#D97706] hidden" />}
          Approaching deadline
        </span>
      )
    case 'Overdue':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#FEECE9] text-[#B91C1C] border border-[#FCA5A5] font-sans ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E3432B] pulse-ring-alert shrink-0" />
          {showIcon && <AlertTriangle className="w-3 h-3 text-[#E3432B] hidden" />}
          Overdue
        </span>
      )
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#F1EFE8] text-[#424C5D] border border-[#E6E2D5] font-sans ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#8C99AE] shrink-0" />
          {status}
        </span>
      )
  }
}

export const StageBadge: React.FC<{ stage: ApplicationStage; size?: 'sm' | 'md' }> = ({
  stage,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs font-semibold'

  const colorMap: Record<ApplicationStage, { bg: string; text: string; border: string; dot: string }> = {
    Scrutiny: { bg: 'bg-[#EBF3FB]', text: 'text-[#1E40AF]', border: 'border-[#BFDBFE]', dot: 'bg-[#2563EB]' },
    EVC: { bg: 'bg-[#F3E8FF]', text: 'text-[#6B21A8]', border: 'border-[#E9D5FF]', dot: 'bg-[#7C3AED]' },
    'SAC/SHC': { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]', border: 'border-[#FDE68A]', dot: 'bg-[#D97706]' },
    Decision: { bg: 'bg-[#E0F2FE]', text: 'text-[#0369A1]', border: 'border-[#BAE6FD]', dot: 'bg-[#0284C7]' },
    'Post-Approval': { bg: 'bg-[#ECFDF5]', text: 'text-[#065F46]', border: 'border-[#A7F3D0]', dot: 'bg-[#16A34A]' },
  }

  const current = colorMap[stage] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', dot: 'bg-gray-400' }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono font-medium ${current.bg} ${current.text} border ${current.border} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} shrink-0`} />
      {stage}
    </span>
  )
}

export const ObligationBadge: React.FC<{ status: ObligationStatus }> = ({ status }) => {
  switch (status) {
    case 'Verified':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#EBF7F0] text-[#166534] border border-[#BBF7D0]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
          Verified
        </span>
      )
    case 'Submitted':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
          Submitted
        </span>
      )
    case 'Open':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#F1EFE8] text-[#424C5D] border border-[#E6E2D5]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8C99AE]" />
          Open
        </span>
      )
    case 'Overdue':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#FEECE9] text-[#B91C1C] border border-[#FCA5A5]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E3432B] pulse-ring-alert" />
          Overdue
        </span>
      )
  }
}

export const DocumentUrgencyBadge: React.FC<{
  daysRemaining: number
  urgency?: DocumentUrgency
}> = ({ daysRemaining }) => {
  if (daysRemaining < 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-[#FEECE9] text-[#E3432B] border border-[#F8B6AB]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E3432B] pulse-ring-alert" />
        Expired (<span className="font-mono">{Math.abs(daysRemaining)}d</span> ago)
      </span>
    )
  }

  if (daysRemaining <= 30) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-[#FFF1F0] text-[#E3432B] border border-[#FCA5A5]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E3432B] pulse-ring-alert" />
        Critical (<span className="font-mono">{daysRemaining}d</span> left)
      </span>
    )
  }

  if (daysRemaining <= 60) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
        Approaching (<span className="font-mono">{daysRemaining}d</span> left)
      </span>
    )
  }

  if (daysRemaining <= 90) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-[#FEF9C3] text-[#854D0E] border border-[#FEF08A]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#CA8A04]" />
        Moderate (<span className="font-mono">{daysRemaining}d</span> left)
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-[#F1EFE8] text-[#222730] border border-[#E6E2D5]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
      Valid (<span className="font-mono">{daysRemaining}d</span>)
    </span>
  )
}

export const RiskBadge: React.FC<{
  score: number
  level: 'High' | 'Moderate' | 'Low'
}> = ({ score, level }) => {
  if (level === 'High') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-[#FEECE9] text-[#B91C1C] border border-[#F8B6AB]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E3432B] pulse-ring-alert" />
        <span className="font-mono">{score}%</span> / High Delay Risk
      </span>
    )
  }
  if (level === 'Moderate') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
        <span className="font-mono">{score}%</span> / Moderate Risk
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-[#EBF7F0] text-[#166534] border border-[#BBF7D0]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
      <span className="font-mono">{score}%</span> / Low Risk
    </span>
  )
}
