import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CodeReview AI — Instant Code Analysis',
  description: 'AI-powered code review tool that finds bugs, security issues, and suggests improvements in seconds.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
