export function normalizeCodingOutput(value: unknown) {
  if (Array.isArray(value)) return value.flat(Infinity).join(" ").trim()
  return String(value == null ? "" : value).trim().replace(/\s+/g, " ")
}

export function parseCodingInput(input: string, arity: number): unknown[] {
  const trimmed = String(input).trim()
  if (trimmed.length === 0) return arity === 0 ? [] : [""]

  const lines = trimmed.split(/\n+/).map((line) => line.trim()).filter(Boolean)
  const tokens = trimmed.split(/\s+/).filter(Boolean)
  const nums = tokens.map(Number)
  const allNums = tokens.length > 0 && nums.every((n) => Number.isFinite(n))
  const firstNums = (lines[0] || "").split(/\s+/).filter(Boolean).map(Number)
  const restLines = lines.slice(1)

  if (arity > 1 && !allNums) return lines.slice(0, arity)
  if (arity > 1 && lines.length === 1 && allNums) return nums.slice(0, arity)

  if (lines.length > 1) {
    if (allNums && arity === 2 && firstNums.length >= 2 && restLines.length === 1) {
      return [restLines[0].split(/\s+/).map(Number), firstNums[1]]
    }
    if (allNums && arity === 1 && firstNums.length === 2 && restLines.length === firstNums[0]) {
      return [restLines.map((line) => line.split(/\s+/).map(Number))]
    }
    if (allNums && arity === 1 && firstNums.length === 1 && restLines.length === firstNums[0]) {
      return [restLines.map((line) => line.split(/\s+/).map(Number))]
    }
    if (allNums && arity === 1 && firstNums.length === 1) return [nums.slice(1)]
    if (allNums && arity === 1) return [restLines.map((line) => line.split(/\s+/).map(Number))]
    if (!allNums && arity === 1) return [trimmed]
  }

  if (arity > 1 && allNums) return nums.slice(0, arity)
  if (tokens.length === 1) return [allNums ? nums[0] : tokens[0]]
  if (allNums) return [nums]
  return [trimmed]
}
