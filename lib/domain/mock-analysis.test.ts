import { describe, expect, it } from "vitest"
import { buildMockAnalysis, mockPressureLabel } from "@/lib/domain/mock-analysis"

describe("mock analysis domain", () => {
  it("summarizes weak topics and next tasks", () => {
    const analysis = buildMockAnalysis(
      [
        { topic: "Percentages", correct: false },
        { topic: "Percentages", correct: true },
        { topic: "Series", correct: false },
      ],
      62,
      70,
    )

    expect(analysis.weakTopics[0]).toEqual({ topic: "Percentages", total: 2, wrong: 1 })
    expect(analysis.nextTasks[0]).toBe("Revise Percentages")
    expect(analysis.carelessRisk).toContain("close to cutoff")
  })

  it("labels mock pressure from question count and timer", () => {
    expect(mockPressureLabel(80, 90 * 60)).toBe("high")
    expect(mockPressureLabel(40, 75 * 60)).toBe("medium")
    expect(mockPressureLabel(10, 30 * 60)).toBe("warm-up")
  })
})
