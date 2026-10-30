import React, { useId } from 'react'

interface SparklineProps {
  data?: number[]
  direction?: 'up' | 'down' | 'neutral'
  className?: string
  width?: number
  height?: number
}

export const Sparkline: React.FC<SparklineProps> = ({
  data = [12, 14, 11, 15, 18, 16, 22, 20, 26],
  direction = 'neutral',
  className = '',
  width = 72,
  height = 24,
}) => {
  const reactId = useId()
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * (width - 4) + 2
    const y = height - 4 - ((val - min) / range) * (height - 8)
    return `${x},${y}`
  })

  const pathData = `M ${points.join(' L ')}`
  const areaData = `${pathData} L ${width - 2},${height} L 2,${height} Z`

  const strokeColor =
    direction === 'up'
      ? '#16A34A'
      : direction === 'down'
      ? '#E3432B'
      : '#626F84'

  const gradientId = `sparkline-grad-${direction}-${reactId.replace(/:/g, '')}`

  return (
    <div className={`inline-block overflow-hidden ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <path d={areaData} fill={`url(#${gradientId})`} />
        <path
          d={pathData}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
