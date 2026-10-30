import React, { useEffect, useState } from 'react'

interface CountUpProps {
  value: string | number
  duration?: number
  className?: string
}

export const CountUp: React.FC<CountUpProps> = ({
  value,
  duration = 800,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<string>(() => {
    return typeof value === 'number' ? '0' : String(value)
  })

  useEffect(() => {
    // If value is a plain number or contains a numeric part with units/symbols
    const strVal = String(value)
    const match = strVal.match(/^([^0-9.-]*)([0-9.,]+)(.*)$/)

    if (!match) {
      setDisplayValue(strVal)
      return
    }

    const prefix = match[1]
    const numPart = match[2].replace(/,/g, '')
    const suffix = match[3]

    const targetNumber = parseFloat(numPart)
    if (isNaN(targetNumber)) {
      setDisplayValue(strVal)
      return
    }

    const isDecimal = numPart.includes('.')
    const decimals = isDecimal ? numPart.split('.')[1].length : 0

    let startTimestamp: number | null = null
    const startValue = 0

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)

      // Ease-out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (targetNumber - startValue) * easedProgress

      const formattedCurrent = isDecimal
        ? current.toFixed(decimals)
        : Math.round(current).toLocaleString('en-US')

      setDisplayValue(`${prefix}${formattedCurrent}${suffix}`)

      if (progress < 1) {
        window.requestAnimationFrame(step)
      } else {
        setDisplayValue(strVal)
      }
    }

    const animId = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(animId)
  }, [value, duration])

  return <span className={className}>{displayValue}</span>
}

