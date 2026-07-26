import { AuditApp } from '@/components/audit-app'
import { SiteHeader } from '@/components/landing/site-header'
import { Hero } from '@/components/landing/hero'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Features } from '@/components/landing/features'
import { Audience } from '@/components/landing/audience'

export default function Page() {
  return (
    <main id="top" className="min-h-screen bg-background">
      <SiteHeader />
      <Hero />
      <HowItWorks />
      <Features />
      <Audience />

      {/* The working audit tool */}
      <section id="audit" className="scroll-mt-20 border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">
              Live demo
            </span>
            <h2 className="mt-2 text-balance font-display text-3xl font-bold text-foreground sm:text-4xl">
              Audit a sustainability page now
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              Paste a company&rsquo;s sustainability or ESG URL and watch the
              three agents extract, challenge, and score its claims.
            </p>
          </div>
          <div className="mt-10">
            <AuditApp />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center">
          <p className="font-display text-sm font-bold text-foreground">
            EcoVerify · The Greenwash Sentinel
          </p>
          <p className="text-xs text-muted-foreground">
            Adversarial sustainability auditing for ESG analysts, regulators,
            and journalists.
          </p>
        </div>
      </footer>
    </main>
  )
}
