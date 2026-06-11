// Core domain types for StudyBench.

export type CompanyId =
  | "tcs"
  | "infosys"
  | "wipro"
  | "accenture"
  | "zoho"
  | "cognizant"
  | "general"

export type SectionId =
  | "quant"
  | "reasoning"
  | "verbal"
  | "coding"
  | "cs-core"
  | "comm-interview"

export type Difficulty = "easy" | "medium" | "hard"
export type ContentStatus = "draft" | "reviewed" | "live" | "needs_revision"
export type OriginalStatus = "original" | "licensed" | "reconstructed"

export interface ContentSource {
  id: string
  title: string
  publisher: string
  url?: string
  kind: "official" | "book" | "youtube" | "reference"
  note: string
}

export interface Question {
  id: string
  topic: string
  difficulty: Difficulty
  prompt: string
  options: string[]
  answer: number // index into options
  explanation: string
  sourceId?: string
}

export interface ContentReviewMeta {
  sourceId: string
  originalStatus: OriginalStatus
  status: ContentStatus
  reviewedBy: string
  lastReviewed: string
}

export interface Lesson {
  id: string
  title: string
  minutes: number
  /** Lightweight markdown-ish body rendered by <Prose />. */
  body: string
  sourceIds?: string[]
}

export interface Chapter {
  id: string
  title: string
  summary: string
  lessons: Lesson[]
  quiz: Question[]
}

export interface Section {
  id: SectionId
  name: string
  short: string
  icon: string // lucide-react icon name
  blurb: string
  chapters: Chapter[]
}

export interface Eligibility {
  cgpa: string
  backlogs: string
  tenthTwelfth: string
  pattern: string[]
  rounds: string[]
  sourceId: string
  lastVerified: string
}

export interface Company {
  id: CompanyId
  name: string
  short: string
  /** Brand-ish accent (oklch) used for rings/badges. */
  accent: string
  sector: string
  blurb: string
  /** Probability tuning — how strong (PRI) you typically need to be. */
  cutoffPRI: number
  slope: number
  eligibility?: Eligibility
  isGeneral?: boolean
}

export interface ChapterProgress {
  bestScore: number // 0-100, best chapter-quiz score
  passed: boolean // >= 70%
  skipped: boolean
  attempts: number
}

export interface CompanyProgress {
  chapters: Record<string, ChapterProgress>
  mockScores: number[]
}

export interface CodingAttempt {
  problemId: string
  title: string
  companyId: CompanyId
  passed: number
  total: number
  ts: number
}

export interface TopicStat {
  correct: number
  total: number
}

export interface Profile {
  name: string
  college: string
  branch: string
  gradYear: string
  cgpa: string
  backlogs: string
}

export interface DailyChallengeState {
  date: string // yyyy-mm-dd
  general: boolean
  aptitude: boolean
  coding: boolean
}

// ---- Interview prep ---------------------------------------------------------

export type InterviewCategory =
  | "technical"
  | "hr"
  | "managerial"
  | "coding"
  | "domain"

export interface InterviewQuestion {
  id: string
  company: CompanyId
  category: InterviewCategory
  question: string
  /** How a senior trainer would coach the answer (approach, not a script). */
  guidance: string
  difficulty: Difficulty
  tags: string[]
  sourceId?: string
}

// ---- Full-scale practice content -------------------------------------------

export interface CodingTestCase {
  input: string
  output: string
  hidden?: boolean
}

export interface CodingProblem extends ContentReviewMeta {
  id: string
  companyId: CompanyId
  title: string
  level: "beginner" | "easy" | "medium" | "advanced" | "machine-round"
  difficulty: Difficulty
  topics: string[]
  prompt: string
  inputFormat: string
  outputFormat: string
  constraints: string[]
  starterCode: string
  testCases: CodingTestCase[]
  editorial: string
  estimatedMinutes: number
}

export interface MockSection {
  id: SectionId
  label: string
  questionCount: number
  durationMinutes: number
  source: "lesson-quiz" | "pyq" | "drill-generator" | "mixed"
}

export interface MockTest extends ContentReviewMeta {
  id: string
  companyId: CompanyId
  title: string
  description: string
  sections: MockSection[]
  cutoffPercent: number
}

// ---- Mistake notebook -------------------------------------------------------

/** A question the student answered incorrectly, saved for focused review. */
export interface Mistake {
  questionId: string
  prompt: string
  options: string[]
  answer: number // index of the correct option
  chosen: number // index the student picked
  explanation: string
  topic: string
  difficulty: Difficulty
  ts: number // when it was saved (epoch ms)
}

export interface AppState {
  onboarded: boolean
  premium: boolean
  premiumUntil?: string
  profile: Profile
  interested: CompanyId[]
  primary: CompanyId
  xp: number
  streak: { count: number; lastActive: string }
  badges: string[]
  progress: Record<string, CompanyProgress>
  /** Topic accuracy aggregated across all quizzes — powers weak/strong topics. */
  topicStats: Record<string, TopicStat>
  daily: DailyChallengeState
  codingAttempts: CodingAttempt[]
  /** Auto-saved wrong answers for review (most-recent first, capped). */
  mistakes: Mistake[]
}
