import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ContextForge AI — Transform Unstructured Data into Intelligent Decisions',
  description:
    'ContextForge AI collects, cleans, and structures knowledge from websites, PDFs, GitHub, APIs, and research papers — then uses multi-agent RAG to deliver grounded, cited answers.',
  generator: 'v0.app',
  keywords: [
    'AI agents',
    'RAG',
    'retrieval augmented generation',
    'knowledge graph',
    'semantic search',
    'vector database',
    'research automation',
  ],
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#030712',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${spaceGrotesk.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
