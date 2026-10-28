import React from 'react'
import { ApplicationStage } from '../../types'
import { ChevronRight, FileSearch, Users, Scale, Award, ShieldCheck } from 'lucide-react'

interface StepperProps {
  currentStage: ApplicationStage
  daysInStage?: number
  onStageClick?: (stage: ApplicationStage) => void
}

const STAGES: {
  key: ApplicationStage
  label: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  {
    key: 'Scrutiny',
    label: '1. Scrutiny',
    subtitle: 'Document verification',
    icon: FileSearch,
  },
  {
    key: 'EVC',
    label: '2. EVC',
    subtitle: 'Expert Visit Committee',
    icon: Users,
  },
  {
    key: 'SAC/SHC',
    label: '3. SAC / SHC',
    subtitle: 'Appellate & Hearing',
    icon: Scale,
  },
  {
    key: 'Decision',
    label: '4. Decision',
    subtitle: 'Approval Bureau / LoA',
    icon: Award,
  },
  {
    key: 'Post-Approval',
    label: '5. Post-Approval',
    subtitle: 'Endowment & Biometrics',
    icon: ShieldCheck,
  },
]

export const Stepper: React.FC<StepperProps> = ({
  currentStage,
  daysInStage,
  onStageClick,
}) => {
  const currentIndex = STAGES.findIndex((s) => s.key === currentStage)

  return (
    <div className="w-full bg-[#1A1E24] text-white p-5 border border-[#2E3541]">
      <div className="flex items-center justify-between mb-3 border-b border-[#2E3541] pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-bold text-[#BAC3D2]">
            AICTE Statutory Lifecycle
          </span>
          <span className="text-xs px-2 py-0.5 bg-[#2E3541] text-[#E2E6EE] font-mono">
            APH 2026-27 Standard
          </span>
        </div>
        {daysInStage !== undefined && (
          <div className="text-xs text-[#E6E2D5] flex items-center gap-1.5 bg-[#222730] px-3 py-1 border border-[#2E3541]">
            <span>Current Stage Ageing:</span>
            <strong className="text-[#E3432B] font-mono">{daysInStage} Days</strong>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 relative">
        {STAGES.map((stage, idx) => {
          const isCompleted = idx < currentIndex
          const isCurrent = idx === currentIndex
          const Icon = stage.icon

          let containerStyle = 'border-[#2E3541] bg-[#222730] text-[#8C99AE]'
          let badgeStyle = 'bg-[#2E3541] text-[#8C99AE]'

          if (isCompleted) {
            containerStyle = 'border-[#1E7E55] bg-[#163628]/40 text-[#BBF7D0]'
            badgeStyle = 'bg-[#1E7E55] text-white'
          } else if (isCurrent) {
            containerStyle = 'border-[#E3432B] bg-[#2A1D1B] text-white border-l-4 border-l-[#E3432B]'
            badgeStyle = 'bg-[#E3432B] text-white'
          }

          return (
            <div
              key={stage.key}
              onClick={() => onStageClick && onStageClick(stage.key)}
              className={`relative flex flex-col p-3 border transition-all cursor-pointer ${containerStyle} hover:bg-[#2A313C]`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div
                  className={`w-6 h-6 flex items-center justify-center font-bold text-xs font-mono ${badgeStyle}`}
                >
                  {isCompleted ? 'OK' : idx + 1}
                </div>
                <Icon
                  className={`w-4 h-4 ${
                    isCurrent ? 'text-[#E3432B]' : isCompleted ? 'text-[#16A34A]' : 'text-[#626F84]'
                  }`}
                />
              </div>

              <div className="font-bold text-xs leading-tight mb-0.5 truncate uppercase tracking-wider">
                {stage.label.split('. ')[1]}
              </div>
              <div className="text-[11px] text-[#8C99AE] truncate">{stage.subtitle}</div>

              {isCurrent && (
                <div className="mt-2 pt-2 border-t border-[#E3432B]/40 flex items-center justify-between text-[11px] text-[#F8B6AB] font-mono font-bold">
                  <span>[ACTIVE]</span>
                  <span>STAGE {idx + 1}/5</span>
                </div>
              )}

              {idx < STAGES.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#424C5D]">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
