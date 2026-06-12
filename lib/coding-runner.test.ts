import { describe, expect, it } from "vitest"
import {
  executeCodingSubmission,
  normalizeCodingOutput,
  parseCodingInput,
} from "@/lib/coding-runner"

describe("parseCodingInput", () => {
  it("parses count plus array input", () => {
    expect(parseCodingInput("5\n1 -2 3 0 4", 1)).toEqual([[1, -2, 3, 0, 4]])
  })

  it("parses n k plus array input", () => {
    expect(parseCodingInput("5 6\n1 2 3 0 4", 2)).toEqual([[1, 2, 3, 0, 4], 6])
  })

  it("parses matrix input", () => {
    expect(parseCodingInput("3 3\n1 2 3\n4 5 6\n7 8 9", 1)).toEqual([
      [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
    ])
  })

  it("parses separate primitive arguments", () => {
    expect(parseCodingInput("1 5 4 8", 4)).toEqual([1, 5, 4, 8])
    expect(parseCodingInput("listen\nsilent", 2)).toEqual(["listen", "silent"])
  })
})

describe("normalizeCodingOutput", () => {
  it("normalizes arrays and whitespace", () => {
    expect(normalizeCodingOutput([4, 5, 1, 2, 3])).toBe("4 5 1 2 3")
    expect(normalizeCodingOutput("4   5\n1")).toBe("4 5 1")
  })
})

describe("executeCodingSubmission", () => {
  it("accepts returned values from solve", () => {
    const result = executeCodingSubmission(
      "function solve(arr) { return arr.filter((n) => n > 0).reduce((a, b) => a + b, 0) }",
      "5\n1 -2 3 0 4",
    )
    expect(result).toEqual({ ok: true, output: "8" })
  })

  it("accepts console.log output for beginners", () => {
    const result = executeCodingSubmission(
      "function solve(arr) { console.log(arr[0] + arr[1]) }",
      "2\n4 9",
    )
    expect(result).toEqual({ ok: true, output: "13" })
  })

  it("normalizes array returns for printed array problems", () => {
    const result = executeCodingSubmission(
      "function solve(arr, k) { return arr.slice(-k).concat(arr.slice(0, -k)) }",
      "5 2\n1 2 3 4 5",
    )
    expect(result).toEqual({ ok: true, output: "4 5 1 2 3" })
  })

  it("supports matrix inputs", () => {
    const result = executeCodingSubmission(
      "function solve(matrix) { return matrix[0][0] + matrix[2][2] }",
      "3 3\n1 2 3\n4 5 6\n7 8 9",
    )
    expect(result).toEqual({ ok: true, output: "10" })
  })

  it("returns a clear error when solve is missing", () => {
    const result = executeCodingSubmission("const answer = 42", "1")
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toContain("Define function solve")
  })

  it("runs first non-repeating character solutions", () => {
    const code = `
function solve(s) {
  const freq = {};

  for (const ch of s) {
    freq[ch] = (freq[ch] || 0) + 1;
  }

  for (const ch of s) {
    if (freq[ch] === 1) return ch;
  }

  return "-1";
}`

    expect(executeCodingSubmission(code, "placement")).toEqual({ ok: true, output: "p" })
    expect(executeCodingSubmission(code, "aabbc")).toEqual({ ok: true, output: "c" })
  })
})
