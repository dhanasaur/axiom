import React from 'react'
import { useNavigate } from 'react-router-dom'
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
    <div className="min-h-screen bg-[#F8F7F2] flex flex-col justify-between">
      {/* Top Banner */}
      <div className="bg-[#1A1E24] text-white py-3 px-6 border-b border-[#2E3541] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#E3432B] flex items-center justify-center font-bold text-white font-mono text-base">
            Λ
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-wider">AXIOM</span>
            <span className="text-[11px] text-[#8C99AE] ml-2 hidden sm:inline">
              All India Council for Technical Education (AICTE)
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#8C99AE] font-mono">
          <span>PORTAL ENVIRONMENT: AY 2026-27</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 w-full flex-1 flex flex-col justify-center">
        <div className="max-w-2xl mx-auto mb-10 text-center">
          <div className="inline-block px-3 py-1 bg-[#1A1E24] text-white text-xs font-mono uppercase tracking-widest border-l-2 border-[#E3432B] mb-3">
            Statutory Regulatory Platform
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#13161A] tracking-tight leading-tight uppercase">
            Select Role to Enter <span className="text-[#E3432B]">Axiom</span>
          </h1>
          <p className="mt-3 text-xs md:text-sm text-[#626F84]">
            Approval lifecycle workflow: Scrutiny verification, EVC schedules, 
            SAC/SHC hearings, and predictive delay intelligence.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rolesList.map((item) => (
            <div
              key={item.role}
              onClick={() => handleSelectRole(item.role)}
              className="group bg-white border-2 border-[#E6E2D5] hover:border-[#1A1E24] p-6 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3 border-b border-[#F1EFE8] pb-2">
                  <span className="text-[11px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 bg-[#F1EFE8] text-[#424C5D] border border-[#E6E2D5]">
                    {item.code}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 bg-[#1A1E24] text-white uppercase tracking-wider text-[10px]">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#13161A] group-hover:text-[#E3432B] transition-colors uppercase tracking-wide">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs text-[#626F84] leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-4 pt-4 border-t border-[#F1EFE8] space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C99AE] block mb-1">
                    Statutory Remit
                  </span>
                  {item.responsibilities.map((resp, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#303742]">
                      <span className="text-[#E3432B] font-mono text-[10px] font-bold">[{i + 1}]</span>
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F1EFE8] flex items-center justify-between">
                <span className="text-[11px] text-[#8C99AE] italic truncate max-w-[240px]">
                  {item.recommendedFor}
                </span>
                <button
                  type="button"
                  className="px-4 py-2 bg-[#1A1E24] group-hover:bg-[#E3432B] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <span>Launch Persona</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Security / Advisory Footer Note */}
        <div className="mt-8 p-4 bg-[#FAF9F5] border border-[#E6E2D5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#626F84]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#E3432B]" />
            <span>
              Mock Environment seeded with <strong>16 Institutions</strong>, <strong>25 Applications</strong>, and <strong>26 Audit Events</strong>.
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#8C99AE]">
            Build: Axiom v2.4-GovTech
          </span>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 border-t border-[#E6E2D5] bg-[#FAF9F5] text-center text-xs text-[#8C99AE]">
        All India Council for Technical Education (AICTE) • Statutory Autonomous Body of Govt of India
      </footer>
    </div>
  )
}
