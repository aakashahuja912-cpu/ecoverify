import { jsPDF } from 'jspdf'
import type { AuditState } from '@/lib/use-audit'
import {
  CATEGORY_LABELS,
  SOURCE_TYPE_LABELS,
  VERDICT_LABELS,
} from '@/lib/audit-types'

// Brand palette (RGB) mirroring the app's design tokens.
const INK: [number, number, number] = [28, 32, 30]
const MUTED: [number, number, number] = [110, 120, 114]
const BRAND: [number, number, number] = [21, 92, 58]
const HAIRLINE: [number, number, number] = [222, 226, 223]

const VERDICT_COLOR: Record<string, [number, number, number]> = {
  verified: [21, 122, 71],
  needs_context: [176, 122, 20],
  misleading: [176, 58, 46],
  unsubstantiated: [120, 90, 30],
}

const PAGE_W = 210 // A4 mm
const PAGE_H = 297
const MARGIN = 16
const CONTENT_W = PAGE_W - MARGIN * 2

/**
 * Renders the full EcoVerify audit as a multi-page PDF and triggers a download.
 * Runs entirely client-side.
 */
export function generateAuditReport(state: AuditState, sourceUrl: string) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  let y = MARGIN

  const ensureSpace = (needed: number) => {
    if (y + needed > PAGE_H - MARGIN) {
      doc.addPage()
      y = MARGIN
    }
  }

  const setColor = ([r, g, b]: [number, number, number]) =>
    doc.setTextColor(r, g, b)

  const text = (
    value: string,
    opts: {
      size?: number
      color?: [number, number, number]
      bold?: boolean
      gap?: number
      indent?: number
    } = {},
  ) => {
    const { size = 10, color = INK, bold = false, gap = 1.5, indent = 0 } = opts
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setFontSize(size)
    setColor(color)
    const lines = doc.splitTextToSize(value, CONTENT_W - indent) as string[]
    const lineH = size * 0.44
    ensureSpace(lines.length * lineH)
    doc.text(lines, MARGIN + indent, y)
    y += lines.length * lineH + gap
  }

  const rule = (gap = 4) => {
    ensureSpace(gap)
    doc.setDrawColor(...HAIRLINE)
    doc.setLineWidth(0.2)
    doc.line(MARGIN, y, PAGE_W - MARGIN, y)
    y += gap
  }

  // Header band
  doc.setFillColor(...BRAND)
  doc.rect(0, 0, PAGE_W, 20, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(255, 255, 255)
  doc.text('EcoVerify', MARGIN, 13)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('Greenwash Audit Report', PAGE_W - MARGIN, 13, { align: 'right' })
  y = 28

  // Meta
  text(state.company || 'Unknown company', { size: 18, bold: true, gap: 1 })
  text(sourceUrl, { size: 9, color: MUTED, gap: 1 })
  text(
    `Generated ${new Date().toLocaleString()}${
      state.fetched ? '' : ' · analyzed from knowledge base'
    }`,
    { size: 8, color: MUTED, gap: 3 },
  )
  rule()

  // Verdict summary
  if (state.result) {
    text('GREENWASH VERDICT', { size: 9, bold: true, color: MUTED, gap: 2 })
    text(`Risk score: ${state.result.score}/100  ·  Grade ${state.result.grade}`, {
      size: 13,
      bold: true,
      color: BRAND,
      gap: 2,
    })
    text(state.result.headline, { size: 12, bold: true, gap: 1.5 })
    text(state.result.summary, { size: 10, color: INK, gap: 3 })
    rule()
  }

  // Verification cards
  text(
    `VERIFICATION CARDS · ${state.claims.length} claim${
      state.claims.length === 1 ? '' : 's'
    } examined`,
    { size: 9, bold: true, color: MUTED, gap: 3 },
  )

  state.claims.forEach((claim, i) => {
    const verdict = state.verdicts[claim.id]
    const evidence = state.evidence[claim.id] ?? []
    ensureSpace(22)

    text(`${i + 1}. ${claim.text}`, { size: 11, bold: true, gap: 1.5 })

    const metaBits = [CATEGORY_LABELS[claim.category]]
    if (claim.metric) metaBits.push(claim.metric)
    if (claim.timeframe) metaBits.push(claim.timeframe)
    if (claim.isVague) metaBits.push('flagged as vague')
    text(metaBits.join('  ·  '), { size: 8, color: MUTED, gap: 2 })

    if (verdict) {
      const vc = VERDICT_COLOR[verdict.verdict] ?? INK
      text(
        `Verdict: ${VERDICT_LABELS[verdict.verdict]}  ·  ${verdict.riskLevel.toUpperCase()} risk  ·  ${verdict.confidence}% confidence`,
        { size: 9.5, bold: true, color: vc, gap: 1.5 },
      )
      text(verdict.reasoning, { size: 9, color: INK, gap: 2 })
    }

    if (evidence.length) {
      text('Evidence', { size: 8.5, bold: true, color: MUTED, gap: 1.5, indent: 3 })
      evidence.forEach((ev) => {
        text(
          `[${SOURCE_TYPE_LABELS[ev.sourceType]} · ${ev.stance} · ${ev.credibility}%] ${ev.source}`,
          { size: 8.5, bold: true, gap: 1, indent: 3 },
        )
        text(ev.summary, { size: 8.5, color: MUTED, gap: 2, indent: 3 })
      })
    }

    if (i < state.claims.length - 1) rule(3)
  })

  // Footer with page numbers
  const total = doc.getNumberOfPages()
  for (let p = 1; p <= total; p++) {
    doc.setPage(p)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...MUTED)
    doc.text(
      'EcoVerify · Adversarial sustainability auditing. Evidence reflects model knowledge of public records; verify against primary sources.',
      MARGIN,
      PAGE_H - 8,
    )
    doc.text(`${p} / ${total}`, PAGE_W - MARGIN, PAGE_H - 8, { align: 'right' })
  }

  const slug =
    (state.company || 'company')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'company'
  doc.save(`ecoverify-audit-${slug}.pdf`)
}
