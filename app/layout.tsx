import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "张波 & 邓芮 婚礼邀请函 | 2025年11月29日",
  description:
    "诚挚邀请您和您的家人参加我们的婚礼，分享我们的幸福和喜悦！2025年11月29日 农历十月初十 洛阳孟津区富豪大酒店",
  keywords: ["婚礼", "邀请函", "张波", "邓芮", "洛阳", "孟津", "富豪大酒店"],
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "张波 & 邓芮 婚礼邀请函",
    description: "诚挚邀请您参加我们的婚礼 - 2025年11月29日 洛阳孟津富豪大酒店",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#d4a847",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  // Keep zooming available for accessibility. Do not disable user scaling.
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`font-sans antialiased`}>
        <main id="main" role="main">{children}</main>
        <Analytics />
      </body>
    </html>
  )
}
