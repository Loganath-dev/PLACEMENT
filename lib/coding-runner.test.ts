import { describe, expect, it } from "vitest"
import { normalizeCodingOutput, parseCodingInput } from "@/lib/coding-runner"

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
