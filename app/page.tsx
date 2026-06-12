import type { Metadata } from "next"
import { JsonLd } from "@/components/app/json-ld"
import { LandingPage } from "@/components/app/landing-page"
import {
  courseJsonLd,
  organizationJsonLd,
  softwareApplicationJsonLd,
  websiteJsonLd,
} from "@/lib/seo"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={softwareApplicationJsonLd()} />
      <JsonLd data={courseJsonLd()} />
      <LandingPage />
    </>
  )
}

