import type { Metadata } from "next"
import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { SITE_NAME, SITE_URL } from "@/lib/content/blocks"
import { SEO } from "@/lib/seo"
import { AppStoreProvider } from "@/lib/store"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const heading = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"],
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: SEO.title,
    template: `%s | ${SITE_NAME}`,
  },
  description: SEO.description,
  keywords: SEO.keywords,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "education",
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [{ url: "/icon", sizes: "512x512", type: "image/png" }],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
    shortcut: ["/icon"],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: SEO.title,
    description: SEO.description,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "StudyBench campus placement preparation app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.title,
    description: SEO.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        inter.variable,
        heading.variable,
        "font-sans",
      )}
    >
      <body>
        <ThemeProvider>
          <AppStoreProvider>
            <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
            <Toaster richColors position="top-center" />
          </AppStoreProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}


