import { Leaf, ShieldCheck } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <a href="#top" className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="size-5" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-base font-bold text-foreground">
              EcoVerify
            </p>
            <p className="text-xs text-muted-foreground">
              The Greenwash Sentinel
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          <a href="#how" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#audience" className="transition-colors hover:text-foreground">
            Who it&rsquo;s for
          </a>
        </nav>

        <a
          href="#audit"
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ShieldCheck className="size-4" />
          Run an audit
        </a>
      </div>
    </header>
  )
}
