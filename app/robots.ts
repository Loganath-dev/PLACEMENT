import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/content/blocks"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/blog", "/faq", "/privacy", "/terms"],
        // Keep the authenticated app out of the index.
        disallow: ["/dashboard", "/learn", "/practice", "/mock", "/interview", "/analytics", "/readiness", "/profile", "/settings", "/onboarding", "/auth/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}


