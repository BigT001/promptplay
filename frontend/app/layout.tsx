import type { Metadata } from "next"
import { Inter as InterFont } from "next/font/google"
import "./globals.css"
import "@/styles/vscode.css"

const inter = InterFont({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "PromptPlay",
  description: "AI-driven script and video generation platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head />
      <body>{children}</body>
    </html>
  )
}
