import React from 'react'

export const Skeleton: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => {
  return (
    <div
      style={style}
      className={`rounded bg-[#E2E6EE]/50 animate-shimmer relative overflow-hidden ${className}`}
    />
  )
}

export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="p-4 bg-white rounded-lg border border-[#E6E2D5] shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-7 rounded-md" />
      </div>
      <Skeleton className="h-7 w-16" />
      <div className="pt-2 border-t border-[#F1EFE8] flex items-center justify-between">
        <Skeleton className="h-2.5 w-28" />
        <Skeleton className="h-2.5 w-12" />
      </div>
    </div>
  )
}

export const TableRowSkeleton: React.FC = () => {
  return (
    <tr className="border-b border-[#F1EFE8]">
      <td className="py-3 px-4">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-2.5 w-20 mt-1" />
      </td>
      <td className="py-3 px-4">
        <Skeleton className="h-5 w-20 rounded-full" />
      </td>
      <td className="py-3 px-4 text-center">
        <Skeleton className="h-4 w-10 mx-auto" />
      </td>
      <td className="py-3 px-4">
        <Skeleton className="h-5 w-24 rounded-full" />
      </td>
      <td className="py-3 px-4">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-2.5 w-20 mt-1" />
      </td>
      <td className="py-3 px-4 text-right">
        <Skeleton className="h-6 w-6 rounded ml-auto" />
      </td>
    </tr>
  )
}

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-5 rounded-lg border border-[#E6E2D5] space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#F1EFE8]">
        <div className="space-y-1">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="h-64 flex items-end gap-3 pt-6 px-4">
        {[40, 70, 55, 85, 60, 95, 75].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <Skeleton className="w-full" style={{ height: `${h}%` }} />
            <Skeleton className="h-2.5 w-8" />
          </div>
        ))}
      </div>
    </div>
  )
}
