import type { ReactNode } from 'react'
import { Reveal } from './reveal'

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'center' | 'left'
}) {
  return (
    <div
      className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'}`}
    >
      {eyebrow && (
        <Reveal
          as="span"
          className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-accent"
        >
          {eyebrow}
        </Reveal>
      )}
      <Reveal delay={1}>
        <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={2}>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  )
}
