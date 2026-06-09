export type MockAnalysis = {
  scorePct: number
  cutoff: number
  weakTopics: { topic: string; total: number; wrong: number }[]
  carelessRisk: string
  nextTasks: string[]
}

export type MockResultItem = {
  topic: string
  correct: boolean
}

export function buildMockAnalysis(
  results: MockResultItem[],
  scorePct: number,
  cutoff: number,
): MockAnalysis {
  const topicMap = new Map<string, { topic: string; total: number; wrong: number }>()
  for (const result of results) {
    const item = topicMap.get(result.topic) ?? { topic: result.topic, total: 0, wrong: 0 }
    item.total += 1
    if (!result.correct) item.wrong += 1
    topicMap.set(result.topic, item)
  }
  const weakTopics = [...topicMap.values()]
    .filter((item) => item.wrong > 0)
    .sort((a, b) => b.wrong - a.wrong || b.total - a.total)
    .slice(0, 3)
  const gap = cutoff - scorePct
  return {
    scorePct,
    cutoff,
    weakTopics,
    carelessRisk:
      scorePct >= cutoff
        ? "You cleared the cutoff. Now reduce careless misses and repeat under full timer."
        : gap <= 8
          ? "You are close to cutoff. One weak topic or careless block is probably costing the attempt."
          : "There is a concept gap. Do not take another full mock before repairing the top weak topics.",
    nextTasks: [
      weakTopics[0] ? `Revise ${weakTopics[0].topic}` : "Redo the toughest wrong question",
      "Retake a timed section tomorrow",
      "Write one rule you missed into revision notes",
    ],
  }
}

export function mockPressureLabel(totalQuestions: number, timeLimitSec: number): "high" | "medium" | "warm-up" {
  const minutes = Math.max(1, Math.round(timeLimitSec / 60))
  const perQuestion = minutes / Math.max(1, totalQuestions)
  if (totalQuestions >= 70 || perQuestion < 1.2) return "high"
  if (totalQuestions >= 35 || perQuestion < 1.8) return "medium"
  return "warm-up"
}
