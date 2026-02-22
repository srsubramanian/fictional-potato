import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AgentFlow Docs',
  description: 'Documentation for AgentFlow — a React + FastAPI agentic workflow builder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
