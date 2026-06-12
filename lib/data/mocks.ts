import { generateDrills } from "@/lib/data/question-bank"
import { pyqsForCompany } from "@/lib/data/pyqs"
import type { CompanyId, MockTest, Question, SectionId } from "@/lib/types"

const review = {
  originalStatus: "reconstructed",
  status: "reviewed",
  reviewedBy: "StudyBench SME Review",
  lastReviewed: "2026-06-07",
} as const

const BASE_MOCKS: MockTest[] = [
  {
    id: "mock-tcs-nqt-core",
    companyId: "tcs",
    title: "TCS NQT Core Mock",
    description: "Numerical, verbal, reasoning and programming-logic mix for NQT readiness.",
    cutoffPercent: 70,
    sourceId: "tcs-nqt-official",
    sections: [
      { id: "quant", label: "Numerical Ability", questionCount: 5, durationMinutes: 7, source: "mixed" },
      { id: "reasoning", label: "Reasoning Ability", questionCount: 5, durationMinutes: 7, source: "mixed" },
      { id: "verbal", label: "Verbal Ability", questionCount: 4, durationMinutes: 5, source: "mixed" },
      { id: "coding", label: "Programming Logic", questionCount: 4, durationMinutes: 6, source: "mixed" },
    ],
    ...review,
  },
  {
    id: "mock-infosys-pseudocode-core",
    companyId: "infosys",
    title: "Infosys Aptitude + Pseudocode Mock",
    description: "A compact assessment covering aptitude, reasoning, verbal and pseudocode-style logic.",
    cutoffPercent: 70,
    sourceId: "infosys-careers",
    sections: [
      { id: "quant", label: "Quantitative Aptitude", questionCount: 5, durationMinutes: 7, source: "mixed" },
      { id: "reasoning", label: "Logical Reasoning", questionCount: 5, durationMinutes: 7, source: "mixed" },
      { id: "verbal", label: "Verbal Ability", questionCount: 4, durationMinutes: 5, source: "mixed" },
      { id: "coding", label: "Pseudocode", questionCount: 4, durationMinutes: 6, source: "mixed" },
    ],
    ...review,
  },
  {
    id: "mock-wipro-elite-core",
    companyId: "wipro",
    title: "Wipro Elite Core Mock",
    description: "Aptitude, verbal and coding readiness with written-communication emphasis handled in practice.",
    cutoffPercent: 68,
    sourceId: "wipro-careers",
    sections: [
      { id: "quant", label: "Quantitative Aptitude", questionCount: 5, durationMinutes: 7, source: "mixed" },
      { id: "reasoning", label: "Logical Ability", questionCount: 4, durationMinutes: 6, source: "mixed" },
      { id: "verbal", label: "Verbal Ability", questionCount: 5, durationMinutes: 6, source: "mixed" },
      { id: "coding", label: "Coding MCQ", questionCount: 4, durationMinutes: 6, source: "mixed" },
    ],
    ...review,
  },
  {
    id: "mock-accenture-cognitive-core",
    companyId: "accenture",
    title: "Accenture Cognitive + Technical Mock",
    description: "Cognitive and technical MCQ practice aligned to a consulting/technology fresher track.",
    cutoffPercent: 68,
    sourceId: "accenture-careers",
    sections: [
      { id: "quant", label: "Numerical Ability", questionCount: 4, durationMinutes: 6, source: "mixed" },
      { id: "reasoning", label: "Logical Ability", questionCount: 4, durationMinutes: 6, source: "mixed" },
      { id: "verbal", label: "Verbal Ability", questionCount: 4, durationMinutes: 5, source: "mixed" },
      { id: "cs-core", label: "Technical MCQ", questionCount: 6, durationMinutes: 8, source: "mixed" },
    ],
    ...review,
  },
  {
    id: "mock-cognizant-genc-core",
    companyId: "cognizant",
    title: "Cognizant GenC Core Mock",
    description: "Aptitude, communication-adjacent verbal and technical basics for GenC-style preparation.",
    cutoffPercent: 68,
    sourceId: "cognizant-careers",
    sections: [
      { id: "quant", label: "Quantitative Aptitude", questionCount: 5, durationMinutes: 7, source: "mixed" },
      { id: "reasoning", label: "Logical Ability", questionCount: 4, durationMinutes: 6, source: "mixed" },
      { id: "verbal", label: "Verbal Ability", questionCount: 5, durationMinutes: 6, source: "mixed" },
      { id: "cs-core", label: "Technical Basics", questionCount: 4, durationMinutes: 6, source: "mixed" },
    ],
    ...review,
  },
  {
    id: "mock-zoho-coding-core",
    companyId: "zoho",
    title: "Zoho Coding Logic Mock",
    description: "Programming-heavy MCQ simulation focused on arrays, strings, loops, debugging and matrix logic.",
    cutoffPercent: 75,
    sourceId: "zoho-careers",
    sections: [
      { id: "coding", label: "Programming Logic", questionCount: 10, durationMinutes: 15, source: "mixed" },
      { id: "cs-core", label: "Complexity + Fundamentals", questionCount: 4, durationMinutes: 6, source: "mixed" },
    ],
    ...review,
  },
  {
    id: "mock-general-diagnostic",
    companyId: "general",
    title: "Core Prep Diagnostic",
    description: "Broad diagnostic across aptitude, reasoning, verbal, coding and CS fundamentals.",
    cutoffPercent: 65,
    sourceId: "studybench-curriculum",
    sections: [
      { id: "quant", label: "Quantitative", questionCount: 4, durationMinutes: 6, source: "mixed" },
      { id: "reasoning", label: "Reasoning", questionCount: 4, durationMinutes: 6, source: "mixed" },
      { id: "verbal", label: "Verbal", questionCount: 4, durationMinutes: 5, source: "mixed" },
      { id: "coding", label: "Coding Logic", questionCount: 4, durationMinutes: 6, source: "mixed" },
      { id: "cs-core", label: "CS Core", questionCount: 4, durationMinutes: 6, source: "mixed" },
    ],
    ...review,
  },
]

function stableSeed(input: string): number {
  let hash = 2166136261
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash)
}

function miniSections(base: MockTest) {
  return base.sections.map((section) => ({
    ...section,
    questionCount:
      section.id === "coding"
        ? Math.max(section.questionCount * 2, 8)
        : Math.max(section.questionCount * 2, 10),
    durationMinutes:
      section.id === "coding"
        ? Math.max(section.durationMinutes * 2, 14)
        : Math.max(section.durationMinutes * 2, 12),
  }))
}

function fullLengthSections(base: MockTest) {
  return base.sections.map((section) => ({
    ...section,
    questionCount:
      section.id === "coding"
        ? Math.max(section.questionCount * 4, 16)
        : Math.max(section.questionCount * 5, 20),
    durationMinutes:
      section.id === "coding"
        ? Math.max(section.durationMinutes * 4, 35)
        : Math.max(section.durationMinutes * 4, 25),
  }))
}

function hardFullLengthSections(base: MockTest) {
  return fullLengthSections(base).map((section) => ({
    ...section,
    questionCount:
      section.id === "coding"
        ? Math.max(section.questionCount + 6, 22)
        : Math.max(section.questionCount + 8, 28),
    durationMinutes:
      section.id === "coding"
        ? Math.max(section.durationMinutes + 10, 45)
        : Math.max(section.durationMinutes + 8, 32),
  }))
}

export const MOCKS_PER_COMPANY = 20

function expandMock(base: MockTest): MockTest[] {
  return Array.from({ length: MOCKS_PER_COMPANY }, (_, index) => {
    const mockNo = index + 1
    const fullLength = mockNo >= 6
    const hard = mockNo >= 13
    return {
      ...base,
      id: `${base.id}-${String(mockNo).padStart(2, "0")}`,
      title: `${base.title} ${mockNo}${hard ? " - Hard Drive Simulation" : fullLength ? " - Full Length" : " - Mini"}`,
      description:
        mockNo === 1
          ? base.description
          : hard
            ? `${base.description} Hard variant ${mockNo - 12} adds more question volume and tighter review expectations for final placement pressure.`
            : fullLength
            ? `${base.description} Full-length variant ${mockNo - 5} increases section volume and timer pressure for final-drive simulation.`
            : `${base.description} Mini variant ${mockNo} uses a different question mix for warm-up practice.`,
      sections: hard ? hardFullLengthSections(base) : fullLength ? fullLengthSections(base) : miniSections(base),
    }
  })
}

export const MOCK_TESTS: MockTest[] = BASE_MOCKS.flatMap(expandMock)

const MOCKS_BY_COMPANY = MOCK_TESTS.reduce(
  (acc, mock) => {
    acc[mock.companyId].push(mock)
    return acc
  },
  {
    tcs: [],
    infosys: [],
    wipro: [],
    accenture: [],
    zoho: [],
    cognizant: [],
    general: [],
  } as Record<CompanyId, MockTest[]>,
)

export function mocksForCompany(companyId: CompanyId): MockTest[] {
  return MOCKS_BY_COMPANY[companyId]
}

const MOCK_QUESTION_CACHE = new Map<string, Question[]>()
const MOCK_QUESTION_CACHE_LIMIT = 280

export function buildMockQuestions(mock: MockTest, seed = 20260607): Question[] {
  const cacheKey = `${mock.id}:${seed}`
  const cached = MOCK_QUESTION_CACHE.get(cacheKey)
  if (cached) return cached

  const companyPyqs = pyqsForCompany(mock.companyId)
  const pyqsBySection = companyPyqs.reduce(
    (acc, question) => {
      acc[question.section].push(question)
      return acc
    },
    {
      quant: [],
      reasoning: [],
      verbal: [],
      coding: [],
      "cs-core": [],
      "comm-interview": [],
    } as Record<SectionId, Question[]>,
  )
  const out: Question[] = []
  const usedIds = new Set<string>()
  const usedPrompts = new Set<string>()
  // Per-section topic caps prevent the same concept (e.g. "unit digit") from
  // appearing more than once across PYQs and generated questions combined.
  // Reset each section so topic diversity is enforced independently per section.
  let sectionTopicCounts = new Map<string, number>()
  let sectionTopicCap = 1

  function add(q: Question, ignoreTopic = false) {
    const promptKey = q.prompt.trim().toLowerCase().replace(/\s+/g, " ")
    if (usedIds.has(q.id) || usedPrompts.has(promptKey)) return
    if (!ignoreTopic) {
      const tc = sectionTopicCounts.get(q.topic) ?? 0
      if (tc >= sectionTopicCap) return
      sectionTopicCounts.set(q.topic, tc + 1)
    }
    usedIds.add(q.id)
    usedPrompts.add(promptKey)
    out.push(q)
  }

  let expectedTotal = 0
  for (const [sectionIndex, section] of mock.sections.entries()) {
    expectedTotal += section.questionCount
    // Allow each topic at most ceil(sectionSize/8) appearances so short sections
    // enforce strict diversity and full-length sections allow gentle repetition.
    sectionTopicCap = Math.max(1, Math.ceil(section.questionCount / 8))
    sectionTopicCounts = new Map()

    const candidates = pyqsBySection[section.id]
    const offset = candidates.length ? stableSeed(`${mock.id}:${section.id}`) % candidates.length : 0
    for (let i = 0; i < Math.min(section.questionCount, candidates.length); i++) {
      add(candidates[(offset + i) % candidates.length])
    }

    const missing = expectedTotal - out.length
    if (missing > 0) {
      const generated = generateDrills(
        section.id as SectionId,
        missing * 3,
        seed + stableSeed(mock.id) + sectionIndex,
      )
      for (const q of generated) {
        if (out.length >= expectedTotal) break
        add(q)
      }
      const stillMissing = expectedTotal - out.length
      if (stillMissing > 0) {
        for (const q of generated) {
          if (out.length >= expectedTotal) break
          add(q, true)
        }
      }
    }
  }

  if (MOCK_QUESTION_CACHE.size >= MOCK_QUESTION_CACHE_LIMIT) {
    const oldestKey = MOCK_QUESTION_CACHE.keys().next().value
    if (oldestKey) MOCK_QUESTION_CACHE.delete(oldestKey)
  }
  MOCK_QUESTION_CACHE.set(cacheKey, out)
  return out
}
