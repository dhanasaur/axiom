import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { Role } from '../types'
import {
  ArrowRight,
  Lock,
  Check,
} from 'lucide-react'

export const Login: React.FC = () => {
  const { setRole } = useApp()
  const navigate = useNavigate()

  const rolesList: {
    role: Role
    title: string
    code: string
    badge: string
    description: string
    responsibilities: string[]
    recommendedFor: string
  }[] = [
    {
      role: 'Regional Officer',
      title: 'Regional Officer (RO)',
      code: 'REGIONAL-AUTH',
      badge: 'Zonal Jurisdiction',
      description:
        'Oversees regional jurisdiction applications, coordinates Expert Visit Committees (EVC), evaluates initial document scrutiny, and addresses deficiencies.',
      responsibilities: [
        'Document Scrutiny Review',
        'EVC Expert Constitution & Field Orders',
        'Zonal Deficiency Notices',
      ],
      recommendedFor: 'Recommended for day-to-day approval flow inspection',
    },
    {
      role: 'Bureau Officer',
      title: 'Bureau Officer (Approval Bureau)',
      code: 'CENTRAL-AUTH',
      badge: 'National Headquarters',
      description:
        'Central authority overseeing national policy adherence, high-stake escalations, executive approvals, and official Letter of Approval (LoA) dispatches.',
      responsibilities: [
        'Final Executive Committee Sign-offs',
        'Policy Override & Inter-Council Concordance',
        'National Pendency Oversight',
      ],
      recommendedFor: 'Recommended for executive decision tracking & analytics',
    },
    {
      role: 'Committee Member',
      title: 'Committee Member (SAC / SHC / EVC)',
      code: 'EXPERT-PANEL',
      badge: 'Independent Appraisal',
      description:
        'Academic and domain specialists evaluating infrastructure, hearing appeals under the Standing Appellate Committee, and conducting physical on-site EVCs.',
      responsibilities: [
        'Standing Hearing Committee (SHC) Reviews',
        'On-site EVC Lab & Faculty Appraisals',
        'Technical Due-Diligence Reports',
      ],
      recommendedFor: 'Recommended for EVC schedules & appellate hearings',
    },
    {
      role: 'Institution',
      title: 'Technical Institution Registrar',
      code: 'APPLICANT-PORTAL',
      badge: 'Applicant College',
      description:
        'Authorized representative of the technical university or college submitting Extension of Approval (EoA), answering deficiencies, and uploading compliance proofs.',
      responsibilities: [
        'Mandatory Undertakings & FDR Uploads',
        'Deficiency Rectification Submissions',
        'Document Validity Tracking (Fire, Land, Biometrics)',
      ],
      recommendedFor: 'Recommended for applicant compliance perspective',
    },
  ]

  const handleSelectRole = (role: Role) => {
    setRole(role)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#F8F7F2] flex flex-col justify-between font-sans">
      {/* Top Banner */}
      <div className="bg-[#1A1E24] text-white py-3.5 px-6 border-b border-[#2E3541] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#E3432B] flex items-center justify-center font-bold text-white font-mono text-base shadow-sm">
            Λ
          </div>
          <div>
            <span className="font-display font-bold text-sm tracking-wider">AXIOM</span>
            <span className="text-[11px] text-[#8C99AE] ml-2 hidden sm:inline font-sans">
              All India Council for Technical Education (AICTE)
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#8C99AE] font-mono">
          <Lock className="w-3.5 h-3.5 text-[#E3432B]" />
          <span>STATUTORY ROLE-BASED ACCESS GATEWAY</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-5xl mx-auto px-4 py-8 md:py-12 w-full space-y-8">
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-display font-semibold uppercase tracking-[0.1em] text-[#E3432B] px-3 py-1 rounded-full bg-[#FEECE9] border border-[#F8B6AB] inline-block">
            AICTE APPROVAL PROCESS HANDBOOK 2026-27
          </span>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold text-[#13161A] tracking-tight uppercase">
            Select Your Statutory Regulatory Persona
          </h1>
          <p className="text-xs text-[#626F84] leading-relaxed font-sans">
            Axiom configures role-specific views, permission gates, and statutory timelines based on the chosen portal persona. Experience the lifecycle from your vantage point.
          </p>
        </div>

        {/* Roles 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rolesList.map((item, index) => (
            <motion.div
              key={item.role}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.06 }}
              whileHover={{ y: -3 }}
              className="bg-white rounded-xl border border-[#E6E2D5] hover:border-[#E3432B] p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Header row */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-[#8C99AE] bg-[#FAF9F5] px-2 py-0.5 rounded border border-[#E6E2D5] block w-fit mb-1">
                      {item.code}
                    </span>
                    <h3 className="text-base font-display font-bold text-[#13161A] group-hover:text-[#E3432B] transition-colors uppercase">
                      {item.title}
                    </h3>
                  </div>
                  <span className="text-[10px] uppercase font-display font-semibold tracking-wider px-2 py-0.5 rounded-full bg-[#F1EFE8] text-[#424C5D] border border-[#E6E2D5]">
                    {item.badge}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-[#424C5D] leading-relaxed font-sans">
                  {item.description}
                </p>

                {/* Statutory Responsibilities */}
                <div className="pt-3 border-t border-[#F1EFE8] space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider font-display font-semibold text-[#8C99AE] block">
                    Statutory Scope:
                  </span>
                  {item.responsibilities.map((resp, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#303742] font-sans">
                      <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0 stroke-[2.5]" />
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-[#F1EFE8]">
                <div className="text-[10px] text-[#626F84] mb-2 font-mono">
                  {item.recommendedFor}
                </div>
                <button
                  onClick={() => handleSelectRole(item.role)}
                  className="w-full py-2.5 rounded-lg px-4 bg-[#1A1E24] group-hover:bg-[#E3432B] text-white text-xs font-display font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <span>Launch {item.role} Persona</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-[#13161A] text-[#8C99AE] text-center text-[11px] py-4 border-t border-[#242B35] px-4 font-sans">
        <p>AICTE Approval Lifecycle & Compliance Management Platform (AXIOM) — AY 2026-27 Regulatory Engine</p>
        <p className="text-[10px] text-[#626F84] mt-0.5">
          Government of India • Ministry of Education • AICTE Statutory Operations Directive
        </p>
      </div>
    </div>
  )
}
