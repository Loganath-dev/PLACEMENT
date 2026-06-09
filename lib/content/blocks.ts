/** Shared rich-content block type used by blogs and other marketing pages. */
export type ContentBlock =
  | { k: "p"; text: string }
  | { k: "sub"; text: string }
  | { k: "list"; items: string[] }
  | { k: "ol"; items: string[] }
  | { k: "quote"; text: string }

/** Site constants for SEO/AEO metadata and JSON-LD. */
export const SITE_URL = "https://studybench.in"
export const SITE_NAME = "StudyBench"
export const SITE_TAGLINE = "Campus placement preparation for Indian students"

