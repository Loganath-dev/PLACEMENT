import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/content/blocks"

const KEYWORDS = [
  "campus placement preparation",
  "placement preparation app",
  "placement preparation for freshers",
  "campus placement app India",
  "aptitude preparation for placements",
  "quantitative aptitude placement questions",
  "logical reasoning placement questions",
  "coding interview preparation for freshers",
  "company wise placement preparation",
  "placement previous year questions",
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
  title: `${SITE_NAME} | Placement Prep App for Freshers`,
  description:
    "StudyBench helps Indian students prepare for campus placements with company-wise learning tracks, aptitude, coding, CS core, mock tests, PYQs, interviews and readiness analytics.",
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
    foundingLocation: {
      "@type": "Country",
      name: "India",
    },
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
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
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
    inLanguage: "en-IN",
    audience: {
      "@type": "Audience",
      audienceType: "Indian undergraduate students and freshers preparing for campus placements",
    },
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
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
    },
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
