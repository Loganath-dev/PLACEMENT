import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/content/blocks"

const KEYWORDS = [
  "campus placement preparation",
  "placement preparation app",
  "aptitude preparation for placements",
  "coding interview preparation for freshers",
  "TCS NQT preparation",
  "Infosys placement preparation",
  "Wipro Elite NTH preparation",
  "Accenture assessment preparation",
  "Zoho interview preparation",
  "Cognizant GenC preparation",
  "mock tests for placements",
  "interview preparation for freshers",
]

export const SEO = {
  title: `${SITE_NAME} - Campus Placement Preparation App for Freshers`,
  description:
    "StudyBench helps Indian students prepare for campus placements with company-wise tracks, aptitude, coding, CS core, mock tests, PYQs, interviews and readiness analytics.",
  keywords: KEYWORDS,
  image: `${SITE_URL}/opengraph-image`,
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon`,
    description: SITE_TAGLINE,
    sameAs: [SITE_URL],
  }
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SEO.description,
  }
}

export function softwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    description: SEO.description,
    offers: {
      "@type": "Offer",
      price: "399",
      priceCurrency: "INR",
      category: "subscription",
    },
  }
}

export function courseJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Campus Placement Preparation for Freshers",
    description:
      "A structured placement preparation course covering aptitude, reasoning, verbal ability, coding, CS fundamentals, mock tests, PYQs and interview readiness.",
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      sameAs: SITE_URL,
    },
    url: SITE_URL,
    educationalLevel: "Undergraduate",
    teaches: [
      "Quantitative aptitude",
      "Logical reasoning",
      "Verbal ability",
      "Data structures and algorithms",
      "CS fundamentals",
      "Mock test strategy",
      "Interview readiness",
    ],
  }
}
