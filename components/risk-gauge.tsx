'use client'

import { scoreVarColor } from '@/lib/risk-style'

interface RiskGaugeProps {
  score: number
  grade: string
  size?: number
}

export function RiskGauge({ score, grade, size = 200 }: RiskGaugeProps) {
  const stroke = 14
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  // Use 75% of the circle as the gauge sweep (270deg), starting from bottom-left.
  const sweep = 0.75
  const arcLength = circumference * sweep
  const progress = Math.min(Math.max(score, 0), 100) / 100
  const color = scoreVarColor(score)

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-[135deg]"
        role="img"
        aria-label={`Greenwash risk score ${score} out of 100, ${grade}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arcLength * progress} ${circumference}`}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-display text-5xl font-bold tabular-nums"
          style={{ color }}
        >
          {score}
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          / 100 risk
        </span>
        <span
          className="mt-1 text-sm font-semibold"
          style={{ color }}
        >
          {grade}
        </span>
      </div>
    </div>
  )
}
