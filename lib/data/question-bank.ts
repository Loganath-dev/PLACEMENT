import type { Question, SectionId } from "@/lib/types"

/**
 * Parametric question generator. Every question is ORIGINAL and its answer is
 * computed in code (computed), so the bank scales to thousands of correct,
 * varied MCQs without copying any third-party paper. Used to deepen practice,
 * mocks and daily challenges.
 *
 * Capacity is effectively unlimited: each generator draws fresh numbers/words,
 * so students never run out of practice.
 */

// ---- deterministic PRNG (mulberry32) ---------------------------------------
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type R = () => number
function int(r: R, lo: number, hi: number) {
  return lo + Math.floor(r() * (hi - lo + 1))
}
function pick<T>(r: R, arr: readonly T[]): T {
  return arr[Math.floor(r() * arr.length)]
}

interface Choice {
  options: string[]
  answer: number
}

/** Build 4 unique numeric options including the correct one, shuffled. */
function numChoices(
  r: R,
  correct: number,
  distractors: number[],
  fmt: (n: number) => string = (n) => String(n),
): Choice {
  const seen = new Set<number>([correct])
  const ds: number[] = []
  for (const d of distractors) {
    if (d >= 0 && !seen.has(d)) {
      seen.add(d)
      ds.push(d)
    }
  }
  let k = 1
  while (ds.length < 3 && k < 200) {
    for (const cand of [correct + k, correct - k]) {
      if (ds.length < 3 && cand >= 0 && !seen.has(cand)) {
        seen.add(cand)
        ds.push(cand)
      }
    }
    k++
  }
  const all = [correct, ...ds.slice(0, 3)]
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  return { options: all.map(fmt), answer: all.indexOf(correct) }
}

/** Build 4 unique string options including the correct one, shuffled. */
function strChoices(r: R, correct: string, distractors: string[]): Choice {
  const seen = new Set<string>([correct])
  const ds: string[] = []
  for (const d of distractors) {
    if (d && !seen.has(d)) {
      seen.add(d)
      ds.push(d)
    }
  }
  const all = [correct, ...ds.slice(0, 3)]
  let n = 1
  while (all.length < 4) all.push(`${correct} (${n++})`)
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  return { options: all, answer: all.indexOf(correct) }
}

type Gen = (r: R) => Omit<Question, "id">
function make(
  topic: string,
  difficulty: Question["difficulty"],
  prompt: string,
  explanation: string,
  ch: Choice,
): Omit<Question, "id"> {
  return {
    topic,
    difficulty,
    prompt,
    options: ch.options,
    answer: ch.answer,
    explanation,
    sourceId: "studybench-curriculum",
  }
}

const rupee = (n: number) => `Rs ${n}`

// ============================================================================
// QUANT generators
// ============================================================================
const gPercentOf: Gen = (r) => {
  const x = pick(r, [5, 10, 15, 20, 25, 30, 40, 50, 60, 75])
  const N = pick(r, [20, 40, 60, 80, 120, 160, 200, 240, 400, 500])
  const correct = (x * N) / 100
  return make(
    "Percentages",
    "easy",
    `What is ${x}% of ${N}?`,
    `${x}% of ${N} = ${x}/100 x ${N} = ${correct}.`,
    numChoices(r, correct, [correct + N / 10, correct - N / 20, (x * N) / 50]),
  )
}

const gProfit: Gen = (r) => {
  const CP = pick(r, [100, 200, 300, 400, 500, 600, 800])
  const p = pick(r, [10, 15, 20, 25])
  const SP = CP + (CP * p) / 100
  return make(
    "Profit & Loss",
    "medium",
    `An item costs Rs ${CP} and is sold at ${p}% profit. The selling price is:`,
    `SP = ${CP} x (1 + ${p}/100) = Rs ${SP}.`,
    numChoices(r, SP, [CP, CP - (CP * p) / 100, SP + CP / 10], rupee),
  )
}

const gSI: Gen = (r) => {
  const P = pick(r, [1000, 2000, 3000, 4000, 5000, 6000])
  const Rt = pick(r, [5, 8, 10, 12])
  const T = pick(r, [2, 3, 4])
  const SI = (P * Rt * T) / 100
  return make(
    "Simple Interest",
    "medium",
    `Simple interest on Rs ${P} at ${Rt}% per annum for ${T} years is:`,
    `SI = P x R x T / 100 = ${P} x ${Rt} x ${T} / 100 = Rs ${SI}.`,
    numChoices(r, SI, [SI + P / 10, SI - 100, (P * Rt) / 100], rupee),
  )
}

const gRatio: Gen = (r) => {
  const a = int(r, 1, 5)
  let b = int(r, 1, 6)
  if (a === b) b += 1
  const k = int(r, 5, 15)
  const total = (a + b) * k
  const larger = Math.max(a, b) * k
  return make(
    "Ratio",
    "easy",
    `Divide Rs ${total} in the ratio ${a} : ${b}. The larger share is:`,
    `Total parts = ${a + b}; larger share = ${Math.max(a, b)}/${a + b} x ${total} = Rs ${larger}.`,
    numChoices(r, larger, [Math.min(a, b) * k, total / 2, larger + k], rupee),
  )
}

const gAverage: Gen = (r) => {
  const b = int(r, 2, 12)
  const d = pick(r, [2, 3, 4, 5])
  const terms = [b, b + d, b + 2 * d, b + 3 * d, b + 4 * d]
  const avg = b + 2 * d
  return make(
    "Averages",
    "easy",
    `The average of ${terms.join(", ")} is:`,
    `For equally spaced numbers the average is the middle term = ${avg}.`,
    numChoices(r, avg, [avg + d, avg - d, terms[4]]),
  )
}

const gSpeed: Gen = (r) => {
  const s = pick(r, [40, 45, 50, 60, 72, 80])
  const t = pick(r, [2, 3, 4, 5])
  const d = s * t
  return make(
    "Time-Speed-Distance",
    "easy",
    `A vehicle covers ${d} km in ${t} hours. Its speed is:`,
    `Speed = distance / time = ${d} / ${t} = ${s} km/h.`,
    numChoices(r, s, [d / (t + 1), s + 10, s - 5], (n) => `${n} km/h`),
  )
}

const WORK_PAIRS: readonly [number, number, number][] = [
  [10, 15, 6],
  [20, 30, 12],
  [12, 24, 8],
  [6, 12, 4],
  [15, 30, 10],
  [10, 40, 8],
  [9, 18, 6],
  [12, 6, 4],
]
const gWork: Gen = (r) => {
  const [A, B, tog] = pick(r, WORK_PAIRS)
  return make(
    "Time & Work",
    "medium",
    `A finishes a job in ${A} days and B in ${B} days. Working together they take:`,
    `Rate = 1/${A} + 1/${B} per day -> ${tog} days.`,
    numChoices(r, tog, [A, B, tog + 2], (n) => `${n} days`),
  )
}

const UNIT_CYCLES: Record<number, number[]> = {
  2: [2, 4, 8, 6],
  3: [3, 9, 7, 1],
  7: [7, 9, 3, 1],
  8: [8, 4, 2, 6],
}
const gUnitDigit: Gen = (r) => {
  const base = pick(r, [2, 3, 7, 8])
  const exp = int(r, 2, 40)
  const cycle = UNIT_CYCLES[base]
  const correct = cycle[(exp - 1) % 4]
  const distractors = cycle.filter((d) => d !== correct)
  return make(
    "Number System",
    "medium",
    `The unit digit of ${base}^${exp} is:`,
    `The unit digit of ${base} repeats every 4 powers as ${cycle.join(", ")}. ${exp} mod 4 selects ${correct}.`,
    numChoices(r, correct, distractors),
  )
}

const gPercentChangeHard: Gen = (r) => {
  const oldValue = pick(r, [120, 160, 200, 240, 300, 400, 500])
  const change = pick(r, [24, 40, 48, 60, 75, 80, 100])
  const up = r() > 0.45
  const next = up ? oldValue + change : oldValue - change
  const pct = Math.round((change / oldValue) * 100)
  return make(
    "Data Interpretation",
    "hard",
    `A chart value ${up ? "rises" : "falls"} from ${oldValue} to ${next}. What is the percentage ${up ? "increase" : "decrease"}?`,
    `Change = ${change} on the original base ${oldValue}. Percentage = ${change}/${oldValue} x 100 = ${pct}%.`,
    numChoices(r, pct, [Math.round((change / next) * 100), pct + 5, Math.max(1, pct - 5)], (n) => `${n}%`),
  )
}

const gWeightedAverageHard: Gen = (r) => {
  const aCount = pick(r, [20, 30, 40])
  const bCount = pick(r, [10, 20, 30])
  const aAvg = pick(r, [60, 65, 70])
  const bAvg = pick(r, [75, 80, 85])
  const total = aCount + bCount
  const combined = Math.round((aCount * aAvg + bCount * bAvg) / total)
  return make(
    "Averages",
    "hard",
    `Group A has ${aCount} students with average ${aAvg}, and Group B has ${bCount} students with average ${bAvg}. The combined average is closest to:`,
    `Combined average = (${aCount} x ${aAvg} + ${bCount} x ${bAvg}) / ${total} = ${combined}.`,
    numChoices(r, combined, [Math.round((aAvg + bAvg) / 2), combined + 3, combined - 3]),
  )
}

// ============================================================================
// REASONING generators
// ============================================================================
const gSeriesArith: Gen = (r) => {
  const start = int(r, 1, 9)
  const diff = int(r, 2, 9)
  const terms = [0, 1, 2, 3, 4].map((i) => start + i * diff)
  const next = start + 5 * diff
  return make(
    "Series",
    "easy",
    `Find the next term: ${terms.join(", ")}, ?`,
    `The series increases by ${diff} each time -> ${terms[4]} + ${diff} = ${next}.`,
    numChoices(r, next, [next + diff, next - diff, next + 1]),
  )
}

const gSeriesGeo: Gen = (r) => {
  const start = int(r, 1, 5)
  const ratio = pick(r, [2, 3])
  const terms = [0, 1, 2, 3].map((i) => start * ratio ** i)
  const next = start * ratio ** 4
  return make(
    "Series",
    "medium",
    `Find the next term: ${terms.join(", ")}, ?`,
    `Each term is multiplied by ${ratio} -> ${terms[3]} x ${ratio} = ${next}.`,
    numChoices(r, next, [next + terms[3], terms[3] + ratio, next - terms[3]]),
  )
}

const DIRS = ["North", "East", "South", "West"] as const
const gDirection: Gen = (r) => {
  const start = int(r, 0, 3)
  const turn = pick(r, ["left", "right"] as const)
  const end = turn === "right" ? (start + 1) % 4 : (start + 3) % 4
  const correct = DIRS[end]
  return make(
    "Direction",
    "easy",
    `Facing ${DIRS[start]}, you turn ${turn}. You now face:`,
    `A ${turn} turn rotates your facing by 90 degrees -> ${correct}.`,
    strChoices(
      r,
      correct,
      DIRS.filter((d) => d !== correct),
    ),
  )
}

function shiftWord(word: string, k: number) {
  return word
    .split("")
    .map((ch) => String.fromCharCode(((ch.charCodeAt(0) - 65 + k) % 26) + 65))
    .join("")
}
const SHIFT_WORDS = ["CAT", "DOG", "SUN", "BAT", "MAP", "PEN", "CUP", "BUS", "FOX", "ICE", "RED", "TOP"]
const gCodingShift: Gen = (r) => {
  const word = pick(r, SHIFT_WORDS)
  const k = int(r, 1, 4)
  const correct = shiftWord(word, k)
  return make(
    "Coding-Decoding",
    "medium",
    `If each letter is shifted forward by ${k}, then '${word}' is coded as:`,
    `Shift every letter ${k} place(s) forward -> ${correct}.`,
    strChoices(r, correct, [shiftWord(word, k + 1), shiftWord(word, k + 2), shiftWord(word, Math.max(1, k - 1))]),
  )
}

const gOddOneOut: Gen = (r) => {
  const m = int(r, 2, 6)
  const mults = new Set<number>()
  while (mults.size < 3) mults.add(m * int(r, 2, 9))
  const arr = [...mults]
  const odd = m * int(r, 3, 9) + int(r, 1, m - 1) // not divisible by m
  const pos = int(r, 0, 3)
  arr.splice(pos, 0, odd)
  return make(
    "Classification",
    "medium",
    `Find the odd one out: ${arr.join(", ")}`,
    `${[...mults].join(", ")} are multiples of ${m}; ${odd} is not.`,
    { options: arr.map(String), answer: pos },
  )
}

const gSeatingGapHard: Gen = (r) => {
  const seats = pick(r, [5, 6, 7])
  const gap = pick(r, [1, 2, 3])
  const possible = seats - gap - 1
  return make(
    "Seating Arrangement",
    "hard",
    `In a row of ${seats} seats, how many ordered placements are possible for A and B if exactly ${gap} ${gap === 1 ? "person sits" : "people sit"} between them?`,
    `A and B must be ${gap + 1} seat positions apart. There are ${possible} left-to-right pairs and ${possible} reverse pairs, so total = ${possible * 2}.`,
    numChoices(r, possible * 2, [possible, possible * 2 + 2, Math.max(1, possible * 2 - 2)]),
  )
}

const gDataSufficiencyHard: Gen = (r) => {
  const value = pick(r, [12, 15, 18, 20])
  return make(
    "Data Sufficiency",
    "hard",
    `Question: Is x greater than ${value}? Statement I: x > ${value - 2}. Statement II: x > ${value + 1}. Which is sufficient?`,
    `Statement I allows x = ${value - 1}, so it is not enough. Statement II directly implies x > ${value}, so II alone is sufficient.`,
    strChoices(r, "II alone is sufficient", ["I alone is sufficient", "Both together are needed", "Neither is sufficient"]),
  )
}

// ============================================================================
// VERBAL generators (curated original word lists)
// ============================================================================
const SYNONYMS: readonly [string, string, string[]][] = [
  ["Abundant", "Plentiful", ["Scarce", "Rare", "Empty"]],
  ["Brave", "Courageous", ["Cowardly", "Timid", "Weak"]],
  ["Rapid", "Quick", ["Slow", "Late", "Calm"]],
  ["Happy", "Joyful", ["Sad", "Angry", "Tired"]],
  ["Diligent", "Hard-working", ["Lazy", "Careless", "Rude"]],
  ["Eager", "Keen", ["Reluctant", "Bored", "Indifferent"]],
  ["Generous", "Liberal", ["Stingy", "Selfish", "Mean"]],
  ["Concise", "Brief", ["Lengthy", "Vague", "Wordy"]],
  ["Benevolent", "Kind", ["Cruel", "Hostile", "Harsh"]],
  ["Tedious", "Boring", ["Exciting", "Brief", "Lively"]],
  ["Vivid", "Bright", ["Dull", "Faint", "Pale"]],
  ["Wealthy", "Rich", ["Poor", "Broke", "Needy"]],
  ["Fragile", "Delicate", ["Strong", "Tough", "Sturdy"]],
  ["Honest", "Truthful", ["Deceitful", "False", "Sly"]],
  ["Enormous", "Huge", ["Tiny", "Small", "Little"]],
  ["Furious", "Angry", ["Calm", "Pleased", "Happy"]],
  ["Wise", "Sensible", ["Foolish", "Silly", "Naive"]],
  ["Courteous", "Polite", ["Rude", "Impolite", "Harsh"]],
  ["Famous", "Renowned", ["Unknown", "Obscure", "Hidden"]],
  ["Brief", "Short", ["Long", "Endless", "Lengthy"]],
]
const gSynonym: Gen = (r) => {
  const [word, syn, ds] = pick(r, SYNONYMS)
  return make(
    "Synonyms",
    "easy",
    `Choose the word closest in meaning to '${word}':`,
    `'${word}' means ${syn.toLowerCase()}.`,
    strChoices(r, syn, ds),
  )
}

const ANTONYMS: readonly [string, string, string[]][] = [
  ["Expand", "Contract", ["Grow", "Stretch", "Widen"]],
  ["Victory", "Defeat", ["Win", "Success", "Triumph"]],
  ["Increase", "Decrease", ["Rise", "Grow", "Expand"]],
  ["Transparent", "Opaque", ["Clear", "Visible", "Glassy"]],
  ["Begin", "End", ["Start", "Open", "Launch"]],
  ["Scarce", "Abundant", ["Rare", "Few", "Limited"]],
  ["Generous", "Stingy", ["Kind", "Giving", "Liberal"]],
  ["Ancient", "Modern", ["Old", "Aged", "Historic"]],
  ["Brave", "Cowardly", ["Bold", "Daring", "Heroic"]],
  ["Praise", "Criticize", ["Admire", "Applaud", "Commend"]],
  ["Accept", "Reject", ["Agree", "Approve", "Allow"]],
  ["Artificial", "Natural", ["Fake", "Synthetic", "Man-made"]],
  ["Permanent", "Temporary", ["Lasting", "Fixed", "Stable"]],
  ["Humble", "Arrogant", ["Modest", "Meek", "Shy"]],
  ["Friend", "Enemy", ["Ally", "Companion", "Mate"]],
  ["Strengthen", "Weaken", ["Boost", "Reinforce", "Fortify"]],
  ["Wise", "Foolish", ["Smart", "Clever", "Sensible"]],
  ["Bright", "Dull", ["Vivid", "Shiny", "Radiant"]],
  ["Cheap", "Expensive", ["Affordable", "Low-cost", "Budget"]],
  ["Difficult", "Easy", ["Hard", "Tough", "Complex"]],
]
const gAntonym: Gen = (r) => {
  const [word, ant, ds] = pick(r, ANTONYMS)
  return make(
    "Antonyms",
    "easy",
    `Choose the word opposite in meaning to '${word}':`,
    `The opposite of '${word}' is '${ant.toLowerCase()}'.`,
    strChoices(r, ant, ds),
  )
}

const gRcInferenceHard: Gen = (r) => {
  const topic = pick(r, [
    ["A startup reduced meetings, but teams needed clearer written updates to stay aligned.", "Fewer meetings require stronger written communication."],
    ["The new tool saved time for experts, but beginners made more mistakes until they were trained.", "Tools still need user training to be effective."],
    ["Remote interviews widened access, but candidates with poor connectivity faced unfair interruptions.", "Remote hiring improves reach but can create new barriers."],
  ] as const)
  return make(
    "Reading Comprehension",
    "hard",
    `Passage: '${topic[0]}' Best inference:`,
    `The passage gives a benefit plus a condition or drawback. The supported inference is: ${topic[1]}`,
    strChoices(r, topic[1], ["The change has no drawbacks.", "The old method was always better.", "The passage supports no conclusion."]),
  )
}

const gParaJumbleHard: Gen = (r) => {
  return make(
    "Para Jumble",
    "hard",
    "Which sentence is most likely to come first in a paragraph?",
    "An opening sentence introduces the topic without depending on words like 'this', 'therefore' or 'however'.",
    strChoices(r, "Campus placements require steady preparation across aptitude, coding and communication.", [
      "Therefore, students should revise mistakes daily.",
      "This is why mock tests matter.",
      "However, many students ignore revision.",
    ]),
  )
}

// ============================================================================
// CODING generators
// ============================================================================
const gMod: Gen = (r) => {
  const a = int(r, 5, 50)
  const b = int(r, 2, 9)
  const correct = a % b
  return make(
    "C Output",
    "easy",
    `In C, what is ${a} % ${b}?`,
    `${a} divided by ${b} leaves a remainder of ${correct}.`,
    numChoices(r, correct, [Math.floor(a / b), correct + 1, b - 1]),
  )
}

const gIntDiv: Gen = (r) => {
  const b = int(r, 2, 9)
  const correct = int(r, 2, 9)
  const a = b * correct + int(r, 0, b - 1)
  return make(
    "C Output",
    "easy",
    `In C (integer division), what is ${a} / ${b}?`,
    `Integer division discards the remainder: ${a} / ${b} = ${correct}.`,
    numChoices(r, correct, [correct + 1, a % b, correct - 1]),
  )
}

const gBitwise: Gen = (r) => {
  const op = pick(r, ["&", "|", "^"] as const)
  const x = int(r, 1, 15)
  const y = int(r, 1, 15)
  const correct = op === "&" ? x & y : op === "|" ? x | y : x ^ y
  const name = op === "&" ? "AND" : op === "|" ? "OR" : "XOR"
  return make(
    "Bit Manipulation",
    "medium",
    `What is ${x} ${op} ${y} (bitwise ${name})?`,
    `${x} ${op} ${y} = ${correct}.`,
    numChoices(r, correct, [x & y, x | y, x ^ y].filter((v) => v !== correct).concat(correct + 1)),
  )
}

const gLoopCount: Gen = (r) => {
  const a = int(r, 0, 3)
  const s = int(r, 1, 3)
  const count = int(r, 3, 8)
  const b = a + s * count
  return make(
    "Loops",
    "easy",
    `How many times does this loop run?  for(i=${a}; i<${b}; i+=${s})`,
    `i goes ${a}, ${a + s}, ... up to below ${b} in steps of ${s} -> ${count} iterations.`,
    numChoices(r, count, [count + 1, count - 1, b]),
  )
}

const gPower: Gen = (r) => {
  const base = int(r, 2, 5)
  const exp = int(r, 2, 4)
  const correct = base ** exp
  return make(
    "Operators",
    "easy",
    `What is ${base} to the power ${exp}?`,
    `${base}^${exp} = ${correct}.`,
    numChoices(r, correct, [base * exp, correct + base, correct - base]),
  )
}

const COMPLEXITY: readonly [string, string, string[]][] = [
  ["Time to access an array element by index:", "O(1)", ["O(n)", "O(log n)", "O(n^2)"]],
  ["Time complexity of binary search:", "O(log n)", ["O(n)", "O(n log n)", "O(1)"]],
  ["Two nested loops over n elements:", "O(n^2)", ["O(n)", "O(n log n)", "O(2n)"]],
  ["Best average sorting time complexity:", "O(n log n)", ["O(n^2)", "O(n)", "O(log n)"]],
  ["Average hash table lookup:", "O(1)", ["O(n)", "O(log n)", "O(n^2)"]],
  ["Inserting at the head of a linked list:", "O(1)", ["O(n)", "O(log n)", "O(n^2)"]],
]
const gComplexity: Gen = (r) => {
  const [prompt, correct, ds] = pick(r, COMPLEXITY)
  return make("Complexity", "medium", prompt, `The answer is ${correct}.`, strChoices(r, correct, ds))
}

const gEdgeCaseHard: Gen = (r) => {
  const problem = pick(r, [
    ["first non-repeating character", "all characters repeat"],
    ["maximum element in an array", "array has only negative numbers"],
    ["two-sum using two pointers", "array is not sorted"],
    ["string compression", "input has one character"],
  ] as const)
  return make(
    "Edge Cases",
    "hard",
    `Which hidden test is most important for a '${problem[0]}' solution?`,
    `The edge case '${problem[1]}' commonly breaks incomplete solutions for this problem type.`,
    strChoices(r, problem[1], ["only the sample input", "only very small positive numbers", "a random happy path"]),
  )
}

const gOptimizationHard: Gen = (r) => {
  return make(
    "Optimization",
    "hard",
    "A pair-sum solution uses two nested loops over n elements. Which improvement is usually best?",
    "A hash set tracks seen values and checks complements in one pass, reducing average time from O(n^2) to O(n).",
    strChoices(r, "Use a hash set to check complements in O(n)", [
      "Add a third nested loop",
      "Convert every number to a string",
      "Ignore time complexity",
    ]),
  )
}

// ============================================================================
// CS-CORE generators (curated facts)
// ============================================================================
const CS_FACTS: readonly [string, string, string[]][] = [
  ["Which data structure uses FIFO order?", "Queue", ["Stack", "Tree", "Graph"]],
  ["Which data structure uses LIFO order?", "Stack", ["Queue", "Array", "Heap"]],
  ["Which key uniquely identifies a row in a table?", "Primary key", ["Foreign key", "Index", "Check"]],
  ["How many layers are in the OSI model?", "7", ["5", "6", "4"]],
  ["Which protocol resolves domain names to IP addresses?", "DNS", ["HTTP", "FTP", "SMTP"]],
  ["Which protocol is connection-oriented and reliable?", "TCP", ["UDP", "IP", "ICMP"]],
  ["HTTPS communicates over which port?", "443", ["80", "21", "25"]],
  ["RAM is best described as:", "Volatile memory", ["Permanent storage", "A disk", "A CPU"]],
  ["Which SQL clause filters groups after aggregation?", "HAVING", ["WHERE", "GROUP BY", "ORDER BY"]],
  ["Which SQL keyword removes duplicate rows?", "DISTINCT", ["UNIQUE", "FILTER", "ONLY"]],
  ["In-order traversal of a BST gives values in:", "Sorted order", ["Reverse order", "Random order", "Level order"]],
  ["Which traversal uses a queue?", "BFS", ["DFS", "In-order", "Pre-order"]],
  ["Hiding internal state behind methods is called:", "Encapsulation", ["Inheritance", "Polymorphism", "Abstraction"]],
  ["1 byte equals how many bits?", "8", ["4", "16", "32"]],
  ["Binary search requires the array to be:", "Sorted", ["Reversed", "Empty", "Of even length"]],
  ["Which CPU scheduling can cause starvation?", "Priority", ["FCFS", "Round Robin", "None"]],
  ["3NF removes which kind of dependency?", "Transitive", ["Partial", "Functional", "Total"]],
  ["An operating system is an example of:", "System software", ["Application software", "Hardware", "A browser"]],
  ["Which protocol sends email?", "SMTP", ["HTTP", "DNS", "FTP"]],
  ["A foreign key references:", "Another table's primary key", ["The same row", "An index", "A view"]],
]
const gCsFact: Gen = (r) => {
  const [prompt, correct, ds] = pick(r, CS_FACTS)
  return make("CS Fundamentals", "easy", prompt, `The correct answer is ${correct}.`, strChoices(r, correct, ds))
}

const gSecurityCloudHard: Gen = (r) => {
  const fact = pick(r, [
    ["Authentication mainly verifies:", "Identity", ["Database speed", "Screen size", "Compiler version"]],
    ["Authorization mainly decides:", "What an authenticated user can access", ["Whether RAM is volatile", "How many rows a table has", "The HTTP port number"]],
    ["A 401 HTTP response usually means:", "Unauthorized", ["Not found", "Server crashed", "Successful request"]],
    ["In SaaS, the user mainly:", "Uses the application", ["Manages the physical server", "Writes the operating system", "Builds the CPU"]],
  ] as const)
  return make("Security & Cloud", "hard", fact[0], `The correct answer is ${fact[1]}.`, strChoices(r, fact[1], [...fact[2]]))
}

// ============================================================================
// Registry & public API
// ============================================================================
const GEN_BY_SECTION: Record<SectionId, Gen[]> = {
  quant: [gPercentOf, gProfit, gSI, gRatio, gAverage, gSpeed, gWork, gUnitDigit, gPercentChangeHard, gWeightedAverageHard],
  reasoning: [gSeriesArith, gSeriesGeo, gDirection, gCodingShift, gOddOneOut, gSeatingGapHard, gDataSufficiencyHard],
  verbal: [gSynonym, gAntonym, gRcInferenceHard, gParaJumbleHard],
  coding: [gMod, gIntDiv, gBitwise, gLoopCount, gPower, gComplexity, gEdgeCaseHard, gOptimizationHard],
  "cs-core": [gCsFact, gSecurityCloudHard],
  "comm-interview": [], // communication is practised via lessons, not auto-MCQs
}

const ALL_GENS: Gen[] = Object.values(GEN_BY_SECTION).flat()

export type DrillSection = SectionId | "mixed"

export const DRILL_SECTIONS: { id: DrillSection; label: string }[] = [
  { id: "mixed", label: "Mixed" },
  { id: "quant", label: "Quantitative" },
  { id: "reasoning", label: "Reasoning" },
  { id: "verbal", label: "Verbal" },
  { id: "coding", label: "Coding" },
  { id: "cs-core", label: "CS Core" },
]

/**
 * Generate `count` fresh, computed questions for a section (or mixed).
 * `seed` makes a set reproducible (e.g. seed by day for daily challenges).
 */
export function generateDrills(
  section: DrillSection,
  count: number,
  seed: number = Date.now(),
): Question[] {
  const r = mulberry32(seed)
  const gens = section === "mixed" ? ALL_GENS : GEN_BY_SECTION[section]
  if (!gens || gens.length === 0) return []
  const out: Question[] = []
  const usedPrompts = new Set<string>()
  let attempts = 0
  while (out.length < count && attempts < count * 80) {
    attempts += 1
    const g = gens[Math.floor(r() * gens.length)]
    const next = g(r)
    const promptKey = next.prompt.trim().toLowerCase()
    if (usedPrompts.has(promptKey)) continue
    usedPrompts.add(promptKey)
    out.push({ ...next, id: `gen-${section}-${seed}-${out.length}` })
  }

  while (out.length < count) {
    const g = gens[out.length % gens.length]
    const next = g(r)
    const prompt = `Practice variant ${out.length + 1}: ${next.prompt}`
    const promptKey = prompt.trim().toLowerCase()
    if (usedPrompts.has(promptKey)) continue
    usedPrompts.add(promptKey)
    out.push({
      ...next,
      id: `gen-${section}-${seed}-variant-${out.length}`,
      prompt,
      explanation: next.explanation,
    })
  }
  return out
}

/** A stable daily seed (yyyymmdd) so a given day's set is consistent. */
export function todaySeed(): number {
  return Number(new Date().toISOString().slice(0, 10).replace(/-/g, ""))
}



