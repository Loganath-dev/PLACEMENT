import type { CompanyId } from "@/lib/types"

export const FREE_COMPANY_CAP = 2
export const FREE_PYQ_LIMIT = 2
export const FREE_INTERVIEW_LIMIT = 5
export const FREE_CODING_PROBLEM_LIMIT = 2
export const FREE_CHAPTER_PRACTICE_LIMIT = 25
export const FREE_MOCK_COMPANY: CompanyId = "general"

export function visibleForPlan<T>(items: T[], premium: boolean, freeLimit: number): T[] {
  return premium ? items : items.slice(0, freeLimit)
}

export function lockedCount(total: number, visible: number): number {
  return Math.max(0, total - visible)
}
