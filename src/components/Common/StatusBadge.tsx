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
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold'

  switch (status) {
    case 'On track':
      return (
        <span
          className={`inline-flex items-center gap-1.5 bg-[#EBF7F0] text-[#166534] border border-[#BBF7D0] ${sizeClasses}`}
        >
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />}
          On track
        </span>
      )
    case 'Approaching deadline':
      return (
        <span
          className={`inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] ${sizeClasses}`}
        >
          {showIcon && <Clock className="w-3.5 h-3.5 text-[#D97706]" />}
          Approaching deadline
        </span>
      )
    case 'Overdue':
      return (
        <span
          className={`inline-flex items-center gap-1.5 bg-[#FEECE9] text-[#B91C1C] border border-[#FCA5A5] ${sizeClasses}`}
        >
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-[#E3432B]" />}
          Overdue
        </span>
      )
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 bg-[#F1EFE8] text-[#424C5D] border border-[#E6E2D5] ${sizeClasses}`}
        >
          {status}
        </span>
      )
  }
}

export const StageBadge: React.FC<{ stage: ApplicationStage; size?: 'sm' | 'md' }> = ({
  stage,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium'

  const colorMap: Record<ApplicationStage, { bg: string; text: string; border: string }> = {
    Scrutiny: { bg: 'bg-[#EBF3FB]', text: 'text-[#1E40AF]', border: 'border-[#BFDBFE]' },
    EVC: { bg: 'bg-[#F3E8FF]', text: 'text-[#6B21A8]', border: 'border-[#E9D5FF]' },
    'SAC/SHC': { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]', border: 'border-[#FDE68A]' },
    Decision: { bg: 'bg-[#E0F2FE]', text: 'text-[#0369A1]', border: 'border-[#BAE6FD]' },
    'Post-Approval': { bg: 'bg-[#ECFDF5]', text: 'text-[#065F46]', border: 'border-[#A7F3D0]' },
  }

  const current = colorMap[stage] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' }

  return (
    <span
      className={`inline-flex items-center font-mono ${current.bg} ${current.text} border ${current.border} ${sizeClasses}`}
    >
      {stage}
    </span>
  )
}

export const ObligationBadge: React.FC<{ status: ObligationStatus }> = ({ status }) => {
  switch (status) {
    case 'Verified':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-[#EBF7F0] text-[#166534] border border-[#BBF7D0]">
          <CheckCircle2 className="w-3 h-3 text-[#16A34A]" />
          Verified
        </span>
      )
    case 'Submitted':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]">
          <Clock className="w-3 h-3 text-[#2563EB]" />
          Submitted
        </span>
      )
    case 'Open':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-[#F1EFE8] text-[#424C5D] border border-[#E6E2D5]">
          <AlertCircle className="w-3 h-3 text-[#626F84]" />
          Open
        </span>
      )
    case 'Overdue':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-[#FEECE9] text-[#B91C1C] border border-[#FCA5A5]">
          <AlertTriangle className="w-3 h-3 text-[#E3432B]" />
          Overdue
        </span>
      )
  }
}

export const DocumentUrgencyBadge: React.FC<{
  urgency: DocumentUrgency
  daysRemaining: number
}> = ({ urgency, daysRemaining }) => {
  if (daysRemaining < 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-[#FEECE9] text-[#E3432B] border border-[#F8B6AB]">
        <ShieldAlert className="w-3.5 h-3.5 text-[#E3432B]" />
        Expired ({Math.abs(daysRemaining)}d ago)
      </span>
    )
  }

  if (daysRemaining <= 30) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-[#FFF1F0] text-[#E3432B] border border-[#FCA5A5]">
        <AlertTriangle className="w-3.5 h-3.5 text-[#E3432B]" />
        Critical ({daysRemaining}d left)
      </span>
    )
  }

  if (daysRemaining <= 60) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
        <Clock className="w-3.5 h-3.5 text-[#D97706]" />
        Approaching ({daysRemaining}d left)
      </span>
    )
  }

  if (daysRemaining <= 90) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-[#FEF9C3] text-[#854D0E] border border-[#FEF08A]">
        <Clock className="w-3.5 h-3.5 text-[#CA8A04]" />
        Moderate ({daysRemaining}d left)
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-[#F1EFE8] text-[#222730] border border-[#E6E2D5]">
      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
      Valid ({daysRemaining}d)
    </span>
  )
}

export const RiskBadge: React.FC<{
  score: number
  level: 'High' | 'Moderate' | 'Low'
}> = ({ score, level }) => {
  if (level === 'High') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-[#FEECE9] text-[#B91C1C] border border-[#F8B6AB]">
        <AlertTriangle className="w-3.5 h-3.5 text-[#E3432B]" />
        {score}% / High Delay Risk
      </span>
    )
  }
  if (level === 'Moderate') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
        <Clock className="w-3.5 h-3.5 text-[#D97706]" />
        {score}% / Moderate Risk
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-[#EBF7F0] text-[#166534] border border-[#BBF7D0]">
      <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
      {score}% / Low Risk
    </span>
  )
}
