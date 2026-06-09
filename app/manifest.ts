import type { MetadataRoute } from "next"
import { SITE_NAME, SITE_URL } from "@/lib/content/blocks"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} - Campus Placement Preparation`,
    short_name: SITE_NAME,
    description:
      "Company-wise campus placement preparation with aptitude, coding, CS core, mocks, PYQs, interviews and readiness analytics.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#2563eb",
    categories: ["education", "productivity"],
    lang: "en-IN",
    icons: [
      {
        src: `${SITE_URL}/icon`,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}

