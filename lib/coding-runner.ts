export function normalizeCodingOutput(value: unknown) {
  if (Array.isArray(value)) return value.flat(Infinity).join(" ").trim()
  return String(value == null ? "" : value).trim().replace(/\s+/g, " ")
}

export type CodingExecutionResult =
  | { ok: true; output: string }
  | { ok: false; error: string }

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

const MAX_CODE_LENGTH = 8_000

export function executeCodingSubmission(code: string, input: string): CodingExecutionResult {
  if (typeof code !== "string" || code.length > MAX_CODE_LENGTH) {
    return { ok: false, error: `Code must be under ${MAX_CODE_LENGTH} characters.` }
  }

  const logs: string[] = []
  const studentConsole = {
    log: (...parts: unknown[]) => {
      logs.push(parts.map((part) => normalizeCodingOutput(part)).join(" "))
    },
    __output: () => logs.join("\n"),
  }

  try {
    const runner = new Function(
      "input",
      "parseCodingInput",
      "normalizeCodingOutput",
      "console",
      // Best-effort friction, NOT a security sandbox. Shadowing these names makes
      // the obvious globals (fetch, setTimeout, process, require) read as undefined,
      // which catches accidental misuse and most copy-pasted snippets. It is NOT a
      // real boundary: constructor chains such as [].constructor.constructor(...)
      // still reach the true global scope. This is acceptable ONLY because the code
      // runs client-side in the student's own browser, where they already control
      // the page. Do NOT reuse this runner on the server without a real sandbox
      // (isolated worker / VM with no network and a hard timeout).
      // ('eval' is intentionally not shadowed — it cannot be redeclared in strict
      // mode, but strict mode keeps its declarations out of the surrounding scope.)
      `"use strict";
const globalThis = undefined, window = undefined, self = undefined,
      fetch = undefined, XMLHttpRequest = undefined,
      Function = undefined, setTimeout = undefined, setInterval = undefined,
      clearTimeout = undefined, clearInterval = undefined,
      process = undefined, require = undefined, module = undefined,
      exports = undefined, __dirname = undefined, __filename = undefined;
${code}
if (typeof solve !== 'function') throw new Error('Define function solve(...) first.');
const args = parseCodingInput(input, solve.length);
const value = solve.apply(null, args);
return value === undefined ? console.__output() : value;`,
    )
    const value = runner(input, parseCodingInput, normalizeCodingOutput, studentConsole)
    return { ok: true, output: normalizeCodingOutput(value) }
  } catch (error) {
    return {
      ok: false,
      error: String(error && error instanceof Error ? error.message : error),
    }
  }
}
