import type { Chapter, CompanyId, Lesson, Question, Section, SectionId } from "@/lib/types"
import { getCompany } from "@/lib/data/companies"
import { generateDrills } from "@/lib/data/question-bank"

/**
 * Seeded curriculum. Content is ORIGINAL, authored in our own words by the
 * StudyBench trainer team; each lesson/question cites a sourceId for internal
 * provenance only. We never reproduce copyrighted text or proprietary
 * papers, and we do not display third-party book or author names.
 *
 * Lessons are written to teach FAST: intuition first, then the method, a worked
 * example, the common mistake, and a quick exam tip. Progress is namespaced per
 * company in the store, so the same chapter ids are reused across tracks while
 * each company's progress stays independent.
 */

export const SECTION_META: {
  id: SectionId
  name: string
  short: string
  icon: string
  blurb: string
}[] = [
  { id: "quant", name: "Quantitative Aptitude", short: "Quant", icon: "Calculator", blurb: "Numbers, arithmetic & data interpretation." },
  { id: "reasoning", name: "Logical Reasoning", short: "Reasoning", icon: "Puzzle", blurb: "Patterns, deductions & analytical puzzles." },
  { id: "verbal", name: "Verbal Ability", short: "Verbal", icon: "BookOpenText", blurb: "Grammar, vocabulary & comprehension." },
  { id: "coding", name: "Coding & DSA", short: "Coding", icon: "Code2", blurb: "Data structures, algorithms & problem solving." },
  { id: "cs-core", name: "CS Core", short: "CS Core", icon: "Cpu", blurb: "DBMS, OS, Networks & OOP fundamentals." },
  { id: "comm-interview", name: "Communication & Interview", short: "Comm & Interview", icon: "MessagesSquare", blurb: "Self-intro, GD, HR answers & the final round." },
]

let qc = 0
function q(
  topic: string,
  difficulty: Question["difficulty"],
  prompt: string,
  options: string[],
  answer: number,
  explanation: string,
  sourceId: string,
): Question {
  qc += 1
  return { id: `q${qc}`, topic, difficulty, prompt, options, answer, explanation, sourceId }
}

// ============================================================================
// QUANT
// ============================================================================
const quant: Section = {
  ...SECTION_META[0],
  chapters: [
    {
      id: "quant-percentages",
      title: "Percentages & Ratios",
      summary: "The backbone of aptitude. Convert fast, handle change, and split in ratios.",
      lessons: [
        {
          id: "l-pct-1",
          title: "Think in percentages",
          minutes: 6,
          body:
            "A percentage is simply a fraction out of 100. So **30% = 30/100 = 0.30**, and \"x% of N\" just means multiply: x% of N = (x/100) x N.\n\n**Memorise these fraction-percent pairs** so you can compute in your head:\n- 1/2 = 50%   - 1/4 = 25%   - 1/5 = 20%\n- 1/8 = 12.5%   - 1/3 ~ 33.33%   - 1/10 = 10%\n\n**Worked example:** 12.5% of 800. Since 12.5% = 1/8, just do 800 / 8 = **100**. Much faster than long multiplication.\n\n**To find \"what percent A is of B\"**, use A/B x 100. Example: 18 is what % of 72? -> 18/72 x 100 = **25%**.\n\n**Exam tip:** convert every \"% of\" into a multiplication, and reach for the fraction shortcut before multiplying.",
          sourceIds: ["rs-aggarwal-quant"],
        },
        {
          id: "l-pct-2",
          title: "Percentage change, successive change & ratios",
          minutes: 6,
          body:
            "**Percentage change = (new - old) / old x 100.** The base is always the OLD value, which is why a rise and a fall of the same percent are NOT symmetric.\n\n**Two successive changes of a% then b%** combine as: net = a + b + (a x b)/100 (keep the signs).\n\n**Worked example:** a price rises 20% then falls 20%. net = 20 - 20 + (20 x -20)/100 = **-4%**. So Rs 100 -> Rs 120 -> Rs 96, not back to Rs 100.\n\n**Ratios:** a : b just means the fraction a/b. To combine a : b and b : c, scale them so the common term b matches, then read a : c directly.\n\n**Common mistake:** averaging two percentages that sit on different bases. You cannot. Always bring them to a common base first.",
          sourceIds: ["rs-aggarwal-quant"],
        },
      ],
      quiz: [
        q("Percentages", "easy", "What is 30% of 250?", ["70", "75", "80", "65"], 1, "30% of 250 = 0.30 x 250 = 75. (10% is 25, so 30% is 75.)", "rs-aggarwal-quant"),
        q("Percentages", "easy", "Express 0.6 as a percentage.", ["6%", "60%", "0.6%", "600%"], 1, "Multiply by 100: 0.6 x 100 = 60%.", "rs-aggarwal-quant"),
        q("Percentages", "medium", "A number is increased by 25% and then decreased by 20%. The net change is:", ["+5%", "0%", "-5%", "+1%"], 1, "Net = 25 - 20 + (25 x -20)/100 = 5 - 5 = 0%.", "rs-aggarwal-quant"),
        q("Percentages", "medium", "If 60% of a class are boys and there are 18 girls, how many students are there?", ["30", "45", "36", "40"], 1, "Girls are 40% of the class = 18, so 1% = 0.45 and total = 45.", "rs-aggarwal-quant"),
        q("Ratios", "medium", "Divide Rs 600 in the ratio 2 : 3. The larger share is:", ["Rs 240", "Rs 360", "Rs 300", "Rs 400"], 1, "Total parts = 5; larger share = 3/5 x 600 = Rs 360.", "indiabix-aptitude"),
        q("Percentages", "hard", "x is 25% more than y. Then y is what percent less than x?", ["20%", "25%", "33.3%", "16.67%"], 0, "y = x / 1.25 = 0.8x, so y is 20% less than x. (Bigger base means a smaller percent.)", "rs-aggarwal-quant"),
      ],
    },
    {
      id: "quant-tsd",
      title: "Time, Speed & Distance",
      summary: "One core formula, the right units, and relative speed for trains and boats.",
      lessons: [
        {
          id: "l-tsd-1",
          title: "The core relation and units",
          minutes: 6,
          body:
            "Everything comes from one relation: **Distance = Speed x Time.** Rearrange as needed (Speed = D/T, Time = D/S). The only trap is mixing units, so fix them first.\n\n**Unit conversion:** km/h -> m/s, multiply by **5/18**; m/s -> km/h, multiply by **18/5**. Example: 72 km/h x 5/18 = **20 m/s**.\n\n**Average speed (equal distances)** at speeds u and v is the **harmonic mean 2uv/(u+v)**, NOT the simple average (u+v)/2.\n\n**Worked example:** half a trip at 40 km/h, half at 60 km/h. Average = 2 x 40 x 60 / (40 + 60) = 4800/100 = **48 km/h** (not 50).\n\n**Common mistake:** averaging speeds directly. Only works when the TIME is equal, not the distance.",
          sourceIds: ["rs-aggarwal-quant", "careerride-yt"],
        },
        {
          id: "l-tsd-2",
          title: "Relative speed: trains and boats",
          minutes: 6,
          body:
            "When two bodies move in the **same direction**, their relative speed is the **difference** of speeds; in **opposite directions**, it is the **sum**.\n\n**Trains:** crossing a pole or person, a train covers its **own length**. Crossing a platform/bridge, it covers **train length + platform length**. Then time = total length / speed.\n\n**Worked example:** a 120 m train at 36 km/h crosses a pole. 36 km/h = 10 m/s, time = 120/10 = **12 s**.\n\n**Boats and streams:** downstream speed = boat + stream; upstream speed = boat - stream.\n\n**Exam tip:** convert km/h to m/s the moment a question mentions metres and seconds.",
          sourceIds: ["rs-aggarwal-quant"],
        },
      ],
      quiz: [
        q("Time-Speed-Distance", "easy", "A car travels 150 km in 2.5 hours. Its speed is:", ["50 km/h", "60 km/h", "75 km/h", "65 km/h"], 1, "Speed = 150 / 2.5 = 60 km/h.", "rs-aggarwal-quant"),
        q("Time-Speed-Distance", "easy", "Convert 72 km/h to m/s.", ["18 m/s", "20 m/s", "25 m/s", "15 m/s"], 1, "72 x 5/18 = 20 m/s.", "rs-aggarwal-quant"),
        q("Time-Speed-Distance", "hard", "A person covers half a journey at 40 km/h and the other half at 60 km/h. Average speed is:", ["50 km/h", "48 km/h", "52 km/h", "45 km/h"], 1, "Equal distances -> harmonic mean = 2 x 40 x 60 / (40 + 60) = 48 km/h.", "rs-aggarwal-quant"),
        q("Trains", "medium", "A 120 m train at 36 km/h crosses a pole in:", ["10 s", "12 s", "15 s", "20 s"], 1, "36 km/h = 10 m/s; time = 120 / 10 = 12 s.", "indiabix-aptitude"),
        q("Boats & Streams", "medium", "A boat's speed is 10 km/h and the stream is 2 km/h. Time to go 30 km downstream:", ["2.5 h", "3 h", "2 h", "3.75 h"], 0, "Downstream speed = 10 + 2 = 12 km/h; time = 30 / 12 = 2.5 h.", "rs-aggarwal-quant"),
      ],
    },
    {
      id: "quant-profit-loss",
      title: "Profit, Loss, Discount & Interest",
      summary: "Know which base each percentage sits on, and the simple-vs-compound gap.",
      lessons: [
        {
          id: "l-pl-1",
          title: "Profit, loss and discount",
          minutes: 6,
          body:
            "The whole topic is about **which base a percentage sits on**.\n\n**Profit% and Loss% are always on the COST PRICE (CP).** Profit% = (SP - CP)/CP x 100. So SP = CP x (1 + profit%/100).\n\n**Discount is always on the MARKED PRICE (MP).** SP = MP x (1 - discount%/100). Shops mark up high, then \"discount\", and still profit.\n\n**Worked example:** CP = Rs 400 at 25% profit -> SP = 400 x 1.25 = **Rs 500**. A Rs 1200 item at 10% discount -> SP = 1200 x 0.90 = **Rs 1080**.\n\n**To find CP from SP:** if SP = Rs 575 at 15% profit, CP = 575 / 1.15 = **Rs 500**.\n\n**Common mistake:** taking profit% on the selling price. It is on cost price.",
          sourceIds: ["rs-aggarwal-quant"],
        },
        {
          id: "l-pl-2",
          title: "Simple vs compound interest",
          minutes: 6,
          body:
            "**Simple Interest (SI)** earns only on the original principal: **SI = P x R x T / 100.**\n\n**Compound Interest (CI)** earns interest on interest: **CI = P x (1 + R/100)^T - P.** For the same P, R, T, CI is always >= SI, and the gap grows with time.\n\n**Handy shortcut for 2 years:** CI - SI = P x (R/100)^2.\n\n**Worked example:** P = Rs 1000, R = 10%, T = 2 years. SI = 1000 x 10 x 2 / 100 = Rs 200. CI - SI = 1000 x (0.1)^2 = **Rs 10**, so CI = Rs 210.\n\n**Exam tip:** if T = 2 or 3 years, the (R/100)^2 shortcut saves you the full power calculation.",
          sourceIds: ["rs-aggarwal-quant", "indiabix-aptitude"],
        },
      ],
      quiz: [
        q("Profit & Loss", "easy", "An item costs Rs 400 and is sold at 25% profit. The selling price is:", ["Rs 450", "Rs 500", "Rs 520", "Rs 480"], 1, "SP = 400 x 1.25 = Rs 500.", "rs-aggarwal-quant"),
        q("Profit & Loss", "medium", "An article is sold for Rs 575 at 15% profit. Its cost price is:", ["Rs 480", "Rs 500", "Rs 525", "Rs 490"], 1, "CP = 575 / 1.15 = Rs 500.", "rs-aggarwal-quant"),
        q("Discount", "medium", "A shirt marked Rs 1200 is sold at a 10% discount. The selling price is:", ["Rs 1080", "Rs 1100", "Rs 1020", "Rs 1000"], 0, "SP = 1200 x 0.90 = Rs 1080.", "indiabix-aptitude"),
        q("Simple Interest", "medium", "Simple interest on Rs 5000 at 8% per annum for 3 years is:", ["Rs 1000", "Rs 1200", "Rs 1400", "Rs 1500"], 1, "SI = 5000 x 8 x 3 / 100 = Rs 1200.", "rs-aggarwal-quant"),
        q("Compound Interest", "hard", "For Rs 1000 at 10% per annum, CI - SI over 2 years is:", ["Rs 10", "Rs 20", "Rs 5", "Rs 100"], 0, "CI - SI (2 yrs) = P x (R/100)^2 = 1000 x 0.01 = Rs 10.", "rs-aggarwal-quant"),
      ],
    },
    {
      id: "quant-numbers",
      title: "Number System & HCF-LCM",
      summary: "Divisibility rules, unit-digit cycles, and the HCF x LCM identity.",
      lessons: [
        {
          id: "l-num-1",
          title: "Divisibility and unit digits",
          minutes: 6,
          body:
            "**Divisibility shortcuts:** a number is divisible by\n- 3 or 9 - if its digit sum is\n- 4 - if its last two digits are\n- 8 - if its last three digits are\n- 11 - if the alternating digit sum is\n\n**Worked example:** is 729 divisible by 9? Digit sum = 7 + 2 + 9 = 18, divisible by 9, so **yes**.\n\n**Unit digit of powers** repeats in a cycle of length <= 4. For 7 the cycle is **7, 9, 3, 1**. Take the exponent mod 4 (treat a remainder of 0 as the 4th term).\n\n**Worked example:** unit digit of 7^35. 35 mod 4 = 3 -> third term in the cycle = **3**.\n\n**Exam tip:** use the unit digit to eliminate wrong options before doing any heavy multiplication.",
          sourceIds: ["rs-aggarwal-quant"],
        },
        {
          id: "l-num-2",
          title: "HCF and LCM the easy way",
          minutes: 6,
          body:
            "Write each number as a product of primes.\n\n**HCF (greatest common factor)** takes the **lowest** power of each common prime. **LCM (least common multiple)** takes the **highest** power of every prime that appears.\n\n**Worked example:** 36 = 2^2 x 3^2, 48 = 2^4 x 3. HCF = 2^2 x 3 = **12**; LCM = 2^4 x 3^2 = **144**.\n\n**The identity you must remember (two numbers only):** HCF x LCM = product of the two numbers. Check: 12 x 144 = 1728 = 36 x 48. \n\n**Common mistake:** swapping the rules. HCF takes the smaller powers, LCM the larger ones.",
          sourceIds: ["gfg-dsa", "rs-aggarwal-quant"],
        },
      ],
      quiz: [
        q("Number System", "medium", "The unit digit of 7^35 is:", ["1", "3", "7", "9"], 1, "Cycle of 7 is 7, 9, 3, 1 (period 4). 35 mod 4 = 3 -> third term = 3.", "rs-aggarwal-quant"),
        q("HCF-LCM", "easy", "The HCF of 36 and 48 is:", ["6", "12", "18", "24"], 1, "36 = 2^2 x 3^2, 48 = 2^4 x 3 -> HCF = 2^2 x 3 = 12.", "rs-aggarwal-quant"),
        q("HCF-LCM", "medium", "The LCM of 4, 6 and 8 is:", ["12", "24", "48", "16"], 1, "Highest powers: 2^3 and 3 -> 8 x 3 = 24.", "rs-aggarwal-quant"),
        q("Divisibility", "easy", "Which number is divisible by 9?", ["730", "729", "728", "731"], 1, "Digit sum of 729 = 18, divisible by 9.", "indiabix-aptitude"),
        q("HCF-LCM", "hard", "If two numbers are 12 and 18, then HCF x LCM equals:", ["216", "72", "36", "108"], 0, "HCF x LCM = product of the numbers = 12 x 18 = 216.", "rs-aggarwal-quant"),
      ],
    },
  ],
}

// ============================================================================
// REASONING
// ============================================================================
const reasoning: Section = {
  ...SECTION_META[1],
  chapters: [
    {
      id: "reason-series",
      title: "Number & Letter Series",
      summary: "A fixed checklist that cracks almost any sequence.",
      lessons: [
        {
          id: "l-ser-1",
          title: "A checklist for any series",
          minutes: 6,
          body:
            "Run this checklist in order and you will spot the rule in seconds:\n1. **Constant difference?** (add the same number)\n2. **Constant ratio?** (multiply by the same number)\n3. **Differences of differences?** (the gaps themselves form a pattern)\n4. **Alternating?** (two series interleaved)\n5. **Squares / cubes / primes / Fibonacci?**\n\n**Worked example:** 2, 6, 12, 20, 30, ? The gaps are 4, 6, 8, 10, so the next gap is 12 -> 30 + 12 = **42**.\n\n**For letter series**, map A = 1 ... Z = 26 and apply the same number checks to the positions.\n\n**Exam tip:** always write the gaps under the numbers. The pattern usually jumps out from the second row.",
          sourceIds: ["rs-aggarwal-reasoning"],
        },
        {
          id: "l-ser-2",
          title: "Patterns worth memorising",
          minutes: 5,
          body:
            "A few families show up again and again:\n- **Perfect squares:** 1, 4, 9, 16, 25, ... (n^2)\n- **Primes:** 2, 3, 5, 7, 11, 13, ... (no factors but 1 and itself)\n- **Fibonacci-style:** each term is the sum of the previous two (1, 1, 2, 3, 5, 8, ...)\n- **Mixed rule:** x2 then +1, or x3 then -2, etc.\n\n**Worked example:** 3, 6, 11, 18, 27, ? Gaps are 3, 5, 7, 9 (odd numbers), next is 11 -> 27 + 11 = **38**.\n\n**Common mistake:** forcing a single arithmetic rule when the series is actually two interleaved series. If alternate terms look related, split them.",
          sourceIds: ["rs-aggarwal-reasoning", "indiabix-aptitude"],
        },
      ],
      quiz: [
        q("Series", "easy", "Find the next term: 2, 6, 12, 20, 30, ?", ["38", "42", "40", "36"], 1, "Differences are 4, 6, 8, 10; next is 12 -> 30 + 12 = 42.", "rs-aggarwal-reasoning"),
        q("Series", "medium", "Find the next term: 3, 6, 11, 18, 27, ?", ["36", "38", "40", "34"], 1, "Differences 3, 5, 7, 9; next is 11 -> 27 + 11 = 38.", "rs-aggarwal-reasoning"),
        q("Series", "medium", "Complete: AZ, BY, CX, ?", ["DV", "DW", "EW", "DX"], 1, "First letter +1 (A,B,C,D); second letter -1 from Z (Z,Y,X,W) -> DW.", "rs-aggarwal-reasoning"),
        q("Series", "easy", "Find the next term: 1, 4, 9, 16, 25, ?", ["30", "36", "49", "35"], 1, "Perfect squares 1^2..5^2; next is 6^2 = 36.", "indiabix-aptitude"),
        q("Series", "medium", "Find the next term: 2, 3, 5, 7, 11, ?", ["12", "13", "14", "15"], 1, "These are prime numbers; the next prime after 11 is 13.", "rs-aggarwal-reasoning"),
      ],
    },
    {
      id: "reason-blood",
      title: "Blood Relations & Directions",
      summary: "Draw the family tree, redraw the path, and the answer appears.",
      lessons: [
        {
          id: "l-br-1",
          title: "Solve relations by drawing",
          minutes: 6,
          body:
            "Never solve blood relations in your head. **Draw a quick family tree.** Use + for male, - for female, a horizontal line for spouse/sibling, and a vertical line for parent-child.\n\n**Decode statements from the speaker outward.** \"The only daughter of my mother\" - the only daughter of the speaker's mother is the **speaker herself** (assuming the speaker is female).\n\n**Worked example:** A woman says, \"His mother is the only daughter of my mother.\" The only daughter of her mother is the woman herself, so the man's mother is the woman -> she is **his mother**.\n\n**Exam tip:** replace every phrase with the simplest relation before drawing (\"father's father\" = grandfather).",
          sourceIds: ["rs-aggarwal-reasoning"],
        },
        {
          id: "l-br-2",
          title: "Directions and turns",
          minutes: 5,
          body:
            "Redraw the journey on a compass. **Each left or right turn rotates your facing by 90 degrees.** North -> right = East -> right = South, and so on.\n\n**Shortest distance** from start to finish is the straight line: if you went a units along one axis and b along the perpendicular axis, the distance is **sqrt(a^2 + b^2)** (Pythagoras).\n\n**Worked example:** walk 3 km North, then turn right and walk 4 km East. Distance from start = sqrt(3^2 + 4^2) = sqrt25 = **5 km**.\n\n**Common mistake:** confusing the person's left/right with the page's left/right. Rotate the page if it helps.",
          sourceIds: ["rs-aggarwal-reasoning"],
        },
      ],
      quiz: [
        q("Blood Relations", "medium", "Pointing to a man, a woman said, 'His mother is the only daughter of my mother.' How is the woman related to the man?", ["Sister", "Mother", "Aunt", "Grandmother"], 1, "The only daughter of the woman's mother is the woman herself, so the man's mother is the woman -> she is his mother.", "rs-aggarwal-reasoning"),
        q("Direction", "easy", "A man walks 3 km North, turns right and walks 4 km. How far is he from the start?", ["5 km", "7 km", "1 km", "4 km"], 0, "North 3, East 4 -> straight-line distance sqrt(3^2 + 4^2) = 5 km.", "rs-aggarwal-reasoning"),
        q("Syllogism", "medium", "All pens are books. All books are red. Conclusion: All pens are red?", ["Follows", "Does not follow", "Cannot say", "Partially"], 0, "Pens  is a subset of  books  is a subset of  red, so all pens are red - the conclusion follows.", "rs-aggarwal-reasoning"),
        q("Direction", "medium", "Facing North, you turn right, then right again. You now face:", ["East", "West", "South", "North"], 2, "North -> right = East -> right = South.", "rs-aggarwal-reasoning"),
        q("Blood Relations", "medium", "A is B's father and B is C's sister. How is A related to C?", ["Father", "Mother", "Uncle", "Brother"], 0, "A is the father of B, and C is B's sibling, so A is also C's father.", "indiabix-aptitude"),
      ],
    },
    {
      id: "reason-coding-decoding",
      title: "Coding-Decoding",
      summary: "Three code types and a single systematic way to break them.",
      lessons: [
        {
          id: "l-cd-1",
          title: "The three code types",
          minutes: 6,
          body:
            "Almost every coding question is one of three types:\n\n**1. Letter-shift:** each letter moves a fixed amount. CAT -> DBU is +1 (C->D, A->B, T->U). Find the shift on one pair, then apply it.\n\n**2. Number coding:** letters map to positions A = 1 ... Z = 26. The code may be a sum, a product, or just the positions.\n\n**3. Reversal / substitution:** the word is reversed (WORD -> DROW) or each word is replaced by another word (track the mapping).\n\n**Worked example:** if CAT -> DBU (shift +1), then DOG -> **EPH** (D->E, O->P, G->H).",
          sourceIds: ["rs-aggarwal-reasoning", "indiabix-aptitude"],
        },
        {
          id: "l-cd-2",
          title: "A systematic method",
          minutes: 5,
          body:
            "Write the alphabet with positions once at the top of your rough sheet: A1 B2 C3 ... Z26. Now every code becomes arithmetic.\n\n**Check the shift is consistent** across all letters before trusting it. If one letter shifts +1 but another shifts +2, the rule is positional, not a fixed shift.\n\n**Worked example:** if FACE is coded 6-1-3-5, the code is simply the letter positions (F=6, A=1, C=3, E=5). So HEAD = H8, E5, A1, D4 = **8-5-1-4**.\n\n**Exam tip:** for reversal codes, just write the word backwards. Do not overthink it.",
          sourceIds: ["rs-aggarwal-reasoning"],
        },
      ],
      quiz: [
        q("Coding-Decoding", "easy", "If CAT is coded as DBU, then DOG is coded as:", ["EPH", "EPG", "DPH", "FPH"], 0, "Each letter shifts +1: D->E, O->P, G->H -> EPH.", "rs-aggarwal-reasoning"),
        q("Coding-Decoding", "medium", "If A = 1 ... Z = 26, the value of B + A + D is:", ["5", "6", "7", "8"], 2, "B=2, A=1, D=4 -> 2 + 1 + 4 = 7.", "indiabix-aptitude"),
        q("Coding-Decoding", "medium", "If WORD is written as DROW, then CODE is written as:", ["EDOC", "DEOC", "ECOD", "EDCO"], 0, "The word is reversed: CODE -> EDOC.", "rs-aggarwal-reasoning"),
        q("Coding-Decoding", "medium", "If FACE is coded by letter position as 6-1-3-5, then HEAD is:", ["8-5-1-4", "8-5-4-1", "6-5-1-4", "8-1-5-4"], 0, "Positions: H=8, E=5, A=1, D=4 -> 8-5-1-4.", "indiabix-aptitude"),
        q("Coding-Decoding", "hard", "In a code each letter shifts +1 (so CAT -> DBU). What is the code for SUN?", ["TVO", "TVN", "RUM", "TUO"], 0, "S->T, U->V, N->O -> TVO.", "rs-aggarwal-reasoning"),
      ],
    },
    {
      id: "reason-arrangement",
      title: "Seating, Ranking & Puzzles",
      summary: "Pin the fixed clues first, then everything else falls into place.",
      lessons: [
        {
          id: "l-arr-1",
          title: "Seating arrangements",
          minutes: 6,
          body:
            "Draw the seats first. **Place the absolute clues (extreme ends, fixed seats) before the relative ones** (\"X is to the left of Y\").\n\n**Linear vs circular:** in a circle, note whether people face the **centre** or **outward** - it flips left and right. In a circle of n people, the person directly opposite seat k is seat **k + n/2**.\n\n**Worked example:** 6 people sit around a circular table facing the centre. Opposite seat 2 is seat 2 + 6/2 = seat **5**.\n\n**Exam tip:** keep two diagrams if facing direction is unclear, and discard the one that breaks a clue.",
          sourceIds: ["rs-aggarwal-reasoning"],
        },
        {
          id: "l-arr-2",
          title: "Ranking and ordering",
          minutes: 5,
          body:
            "**The ranking identity:** in a row of N, position-from-top + position-from-bottom = **N + 1**. So if you know two of the three, you know the third.\n\n**Worked example:** Ravi is 7th from the top and 26th from the bottom. Total = 7 + 26 - 1 = **32**. (Subtract 1 because Ravi is counted in both.)\n\n**For \"taller/older than\" puzzles**, build a single ordered line from the comparisons, e.g. C > A > B > D, then read off the answer.\n\n**Common mistake:** forgetting the -1 when both counts include the same person.",
          sourceIds: ["rs-aggarwal-reasoning"],
        },
      ],
      quiz: [
        q("Ranking", "easy", "Ravi is 7th from the top and 26th from the bottom in a class. Total students:", ["31", "32", "33", "34"], 1, "Total = 7 + 26 - 1 = 32.", "rs-aggarwal-reasoning"),
        q("Seating", "medium", "Six people sit in a row; A is at the extreme left, F at the extreme right. People between A and F:", ["3", "4", "5", "2"], 1, "Seats 2, 3, 4, 5 lie between the ends -> 4 people.", "indiabix-aptitude"),
        q("Seating", "medium", "Six people sit around a circular table facing the centre. The seat directly opposite seat 2 is:", ["seat 4", "seat 5", "seat 6", "seat 3"], 1, "Opposite seat = 2 + 6/2 = 5.", "rs-aggarwal-reasoning"),
        q("Ranking", "medium", "In a row of 40 students, a boy is 15th from the left. His position from the right is:", ["25th", "26th", "27th", "24th"], 1, "From right = 40 - 15 + 1 = 26th.", "indiabix-aptitude"),
        q("Ordering", "hard", "Heights: A > B, C > A, D < B. Who is the tallest?", ["A", "B", "C", "D"], 2, "Combine: C > A > B > D, so C is tallest.", "rs-aggarwal-reasoning"),
      ],
    },
  ],
}

// ============================================================================
// VERBAL
// ============================================================================
const verbal: Section = {
  ...SECTION_META[2],
  chapters: [
    {
      id: "verbal-grammar",
      title: "Error Spotting & Grammar",
      summary: "Agreement, tense and the confusable words that cost easy marks.",
      lessons: [
        {
          id: "l-gr-1",
          title: "Subject-verb agreement",
          minutes: 6,
          body:
            "The verb must agree with the **subject**, not the nearest noun. \"The **list** of items **is** on the desk\" (list is singular, even though \"items\" sits next to the verb).\n\n**Singular by rule:** each, every, one of, either, neither -> take a singular verb. \"**Each** of the boys **has** a book.\"\n\n**Neither ... nor / either ... or:** the verb agrees with the **nearer** subject. \"Neither the manager nor the **employees were** present.\"\n\n**Common mistake:** letting a long phrase between subject and verb pull the agreement. Cover the phrase and check subject-to-verb directly.",
          sourceIds: ["high-agg-verbal"],
        },
        {
          id: "l-gr-2",
          title: "Tenses and confusable words",
          minutes: 5,
          body:
            "Keep tense consistent within a sentence unless time genuinely changes.\n\n**Confusables that recruiters love to test:**\n- its (possessive) vs it's (it is)\n- their / there / they're\n- affect (verb, to influence) vs effect (noun, a result)\n- fewer (countable) vs less (uncountable)\n- since (a point in time) vs for (a duration)\n\n**Worked example:** \"He has worked here **since** 2015\" (a point in time), but \"for five years\" (a duration).\n\n**Exam tip:** when two options differ by only one word, the test is almost always one of these confusables.",
          sourceIds: ["high-agg-verbal"],
        },
      ],
      quiz: [
        q("Error spotting", "easy", "Choose the correct sentence.", ["Each of the boys have a book.", "Each of the boys has a book.", "Each of the boys are having book.", "Each of the boys have books."], 1, "'Each' is singular and takes 'has'.", "high-agg-verbal"),
        q("Sentence correction", "medium", "Pick the right option: 'Neither the manager nor the employees ___ present.'", ["was", "were", "is", "has been"], 1, "With 'neither ... nor', the verb agrees with the nearer subject 'employees' (plural) -> 'were'.", "high-agg-verbal"),
        q("Agreement", "medium", "Choose the correct sentence.", ["The list of items are on the desk.", "The list of items is on the desk.", "The list of items were on the desk.", "The list of items have been on the desk."], 1, "The subject is 'list' (singular), so the verb is 'is'.", "high-agg-verbal"),
        q("Confusables", "medium", "'He has worked here ___ 2015.'", ["for", "since", "from", "during"], 1, "'Since' is used with a point in time (2015); 'for' is used with a duration.", "high-agg-verbal"),
        q("Vocabulary", "easy", "Choose the synonym of 'Diligent'.", ["Lazy", "Hard-working", "Careless", "Rude"], 1, "'Diligent' means showing careful, persistent effort - hard-working.", "high-agg-verbal"),
      ],
    },
    {
      id: "verbal-rc",
      title: "Reading Comprehension",
      summary: "Read for the main idea, answer only from the passage, and beat the clock.",
      lessons: [
        {
          id: "l-rc-1",
          title: "A method that saves time",
          minutes: 6,
          body:
            "**Skim for the central idea first** (one sentence: what is this passage about and what is the author's view?). Then read the question, then scan back for the exact lines.\n\n**Answer only from the passage**, never from your own knowledge. The \"correct\" option is the one the text supports, even if another option is true in real life.\n\n**Be suspicious of extreme words** (always, never, none, only) unless the passage clearly states them.\n\n**Worked example:** a passage says remote work cut commute time but blurred home/office boundaries. The main idea is that remote work has **trade-offs**, not that it is simply good or bad.",
          sourceIds: ["high-agg-verbal"],
        },
        {
          id: "l-rc-2",
          title: "Fact, inference and tone",
          minutes: 5,
          body:
            "There are three common question types:\n- **Fact / detail:** the answer is stated explicitly. Locate the line.\n- **Inference:** the answer is a logical conclusion the passage supports, not stated word for word. Avoid wild leaps.\n- **Tone / attitude:** read the author's word choices (\"sadly\", \"remarkable\", \"unfortunately\") to judge feeling.\n\n**Worked example:** \"Sadly, the ancient forest was cleared for a car park.\" The tone is **regretful**, signalled by \"sadly\".\n\n**Exam tip:** for tone questions, one strong adjective in the passage usually decides the answer.",
          sourceIds: ["high-agg-verbal"],
        },
      ],
      quiz: [
        q("Reading comprehension", "medium", "Passage: 'Remote work cut commute time but blurred the line between home and office, leaving many working longer.' The main idea is:", ["Remote work is always better", "Remote work has trade-offs", "Offices should close", "Commuting is healthy"], 1, "The passage gives a benefit and a drawback - it presents trade-offs.", "high-agg-verbal"),
        q("Para jumble", "medium", "Best opening sentence of a paragraph about photosynthesis:", ["As a result, oxygen is released.", "Plants make food using sunlight.", "This sugar is then stored.", "Therefore animals benefit."], 1, "The general topic sentence introduces the subject; the others are continuations (As a result / This / Therefore).", "high-agg-verbal"),
        q("Vocabulary", "medium", "Antonym of 'Scarce':", ["Rare", "Abundant", "Limited", "Few"], 1, "'Scarce' means in short supply; its opposite is 'abundant'.", "high-agg-verbal"),
        q("Tone", "medium", "'Sadly, the ancient forest was cleared for a car park.' The author's tone is:", ["Joyful", "Regretful", "Neutral", "Excited"], 1, "The word 'sadly' signals a regretful tone.", "high-agg-verbal"),
      ],
    },
    {
      id: "verbal-vocab",
      title: "Vocabulary & Idioms",
      summary: "Learn roots, not lists. Decode unseen words and figurative idioms.",
      lessons: [
        {
          id: "l-vc-1",
          title: "Build word power with roots",
          minutes: 6,
          body:
            "Learn words in families using **roots, prefixes and suffixes** so you can decode words you have never seen.\n- **bene-** = good -> benevolent, benefit\n- **mal-** = bad -> malevolent, malfunction\n- **trans-** = across -> transparent, transfer\n- **-phile** = lover of -> bibliophile (books)\n\n**Worked example:** you do not know \"malevolent\", but \"mal-\" means bad and \"-volent\" relates to wishing, so it means **wishing harm**.\n\n**Exam tip:** when stuck on a synonym/antonym, break the word into its root and guess the sense (positive or negative) first.",
          sourceIds: ["high-agg-verbal", "indiabix-aptitude"],
        },
        {
          id: "l-vc-2",
          title: "One-word substitutions and idioms",
          minutes: 5,
          body:
            "**One-word substitution** compresses a phrase into a single word: \"a person who knows many languages\" = **polyglot**; \"fear of heights\" = acrophobia.\n\n**Idioms are figurative**, not literal. \"To **bite the bullet**\" means to face something difficult with courage, not to chew metal. \"A **blessing in disguise**\" is a good thing that first seemed bad.\n\n**Common mistake:** reading idioms literally. If a phrase makes no literal sense in context, it is almost certainly an idiom.",
          sourceIds: ["high-agg-verbal"],
        },
      ],
      quiz: [
        q("Synonyms", "easy", "Choose the synonym of 'Benevolent':", ["Cruel", "Kind", "Weak", "Wealthy"], 1, "'Benevolent' means well-meaning and kindly.", "high-agg-verbal"),
        q("Antonyms", "easy", "Choose the antonym of 'Transparent':", ["Clear", "Opaque", "Visible", "Glassy"], 1, "'Transparent' lets light through; its opposite is 'opaque'.", "high-agg-verbal"),
        q("One-word", "medium", "A person who can speak many languages is a:", ["Linguist", "Polyglot", "Orator", "Narrator"], 1, "'Polyglot' means one who knows or uses several languages.", "indiabix-aptitude"),
        q("Idioms", "medium", "'To bite the bullet' means to:", ["Eat quickly", "Face a hard situation bravely", "Stay silent", "Give up"], 1, "It means to endure something painful or difficult with courage.", "high-agg-verbal"),
        q("Roots", "medium", "The prefix 'mal-' (as in malfunction) means:", ["Good", "Bad", "Many", "Small"], 1, "'mal-' means bad or wrong, as in malfunction or malnutrition.", "high-agg-verbal"),
      ],
    },
    {
      id: "verbal-sentence",
      title: "Sentence Completion & Jumbles",
      summary: "Fixed prepositions and a reliable way to order jumbled sentences.",
      lessons: [
        {
          id: "l-sc-1",
          title: "Prepositions and fixed phrases",
          minutes: 5,
          body:
            "Many blanks simply test a **fixed preposition** that goes with a word. Memorise the common ones:\n- good **at** (a skill) - fond **of** - married **to**\n- afraid **of** - interested **in** - depend **on**\n\n**Worked example:** \"I am very fond ___ music\" -> **of** (the phrase is always 'fond of').\n\n**Time words:** **since** marks a point in time (since Monday); **for** marks a duration (for two hours).\n\n**Exam tip:** read the whole sentence aloud in your head. The wrong preposition usually sounds off immediately.",
          sourceIds: ["high-agg-verbal"],
        },
        {
          id: "l-sc-2",
          title: "Para jumbles, made simple",
          minutes: 5,
          body:
            "To order jumbled sentences:\n1. **Find the opening sentence** - it introduces the topic and contains no pronoun pointing back (no \"this\", \"therefore\", \"it\" referring to something earlier).\n2. **Chain the rest using linking words** (this, then, however, as a result) and references.\n3. **The closing sentence** often draws a conclusion (so, thus, in short).\n\n**Common mistake:** starting with a sentence that begins with \"However\" or \"This\" - those must follow something, so they cannot be first.\n\n**Exam tip:** if two sentences clearly come as a pair (cause then effect), lock them together before ordering the rest.",
          sourceIds: ["high-agg-verbal", "indiabix-aptitude"],
        },
      ],
      quiz: [
        q("Prepositions", "easy", "'He has been working here ___ 2015.'", ["for", "since", "from", "at"], 1, "'Since' is used with a point in time (2015); 'for' is used with a duration.", "high-agg-verbal"),
        q("Prepositions", "easy", "'I am very fond ___ music.'", ["of", "with", "for", "in"], 0, "The fixed phrase is 'fond of'.", "high-agg-verbal"),
        q("Sentence improvement", "medium", "Choose the correct sentence:", ["One of the student has come.", "One of the students has come.", "One of the students have come.", "One of student has come."], 1, "'One of the' + plural noun + singular verb -> 'One of the students has come.'", "indiabix-aptitude"),
        q("Prepositions", "medium", "'She is good ___ mathematics.'", ["in", "at", "on", "with"], 1, "The idiom is 'good at' a subject or skill.", "high-agg-verbal"),
      ],
    },
  ],
}

// ============================================================================
// CODING & DSA
// ============================================================================
const coding: Section = {
  ...SECTION_META[3],
  chapters: [
    {
      id: "coding-arrays",
      title: "Arrays & Complexity (Big-O)",
      summary: "Reason about speed first, then turn brute force into linear time.",
      lessons: [
        {
          id: "l-arr-1",
          title: "Big-O in plain English",
          minutes: 6,
          body:
            "Big-O describes **how the running time grows as the input n grows** - it ignores constants and focuses on the shape.\n\nFrom fastest to slowest: **O(1) < O(log n) < O(n) < O(n log n) < O(n^2)**.\n- O(1): one step regardless of n (array access by index).\n- O(n): one pass over the data (a single loop).\n- O(n^2): a loop inside a loop over n (compare every pair).\n\n**Worked example:** two nested loops each running n times do n x n = n^2 work -> **O(n^2)**.\n\n**Exam tip:** count the deepest level of nested loops over n. That exponent is usually your Big-O.",
          sourceIds: ["gfg-dsa"],
        },
        {
          id: "l-arr-2",
          title: "Hashing: trade memory for speed",
          minutes: 6,
          body:
            "A **hash set / hash map** answers \"have I seen this value?\" in **O(1) average** time. That single idea turns many O(n^2) brute-force solutions into O(n).\n\n**Two-Sum example:** to find two numbers that add to a target, loop once and keep seen values in a set. For each x, check if (target - x) is already in the set. That is **O(n)** time and O(n) space, versus the O(n^2) double loop.\n\n**The trade-off:** you spend extra memory (the set) to save time. That is usually a good deal in interviews.\n\n**Common mistake:** using nested loops when a single pass with a hash set would do.",
          sourceIds: ["gfg-dsa"],
        },
      ],
      quiz: [
        q("Arrays", "easy", "Worst-case time to access an element by index in an array:", ["O(n)", "O(1)", "O(log n)", "O(n log n)"], 1, "Arrays give constant-time O(1) random access by index.", "gfg-dsa"),
        q("Complexity", "medium", "Time complexity of two nested loops, each running n times:", ["O(n)", "O(n log n)", "O(n^2)", "O(2n)"], 2, "n iterations inside n iterations -> n x n = O(n^2).", "gfg-dsa"),
        q("Hashing", "medium", "Best average time to check if a value exists using a hash set:", ["O(n)", "O(log n)", "O(1)", "O(n^2)"], 2, "Hash set lookups are O(1) on average.", "gfg-dsa"),
        q("Complexity", "easy", "Which of these grows the fastest as n increases?", ["O(log n)", "O(n)", "O(n log n)", "O(n^2)"], 3, "O(n^2) grows fastest among these.", "gfg-dsa"),
        q("Hashing", "medium", "Best average time to find a duplicate in an array using hashing:", ["O(n^2)", "O(n log n)", "O(n)", "O(1)"], 2, "One pass storing seen values in a set is O(n) on average.", "gfg-dsa"),
      ],
    },
    {
      id: "coding-strings",
      title: "Strings & Recursion",
      summary: "Recursion as base-case-plus-smaller-problem, and core string moves.",
      lessons: [
        {
          id: "l-str-1",
          title: "Recursion = base case + smaller problem",
          minutes: 6,
          body:
            "Every recursion needs two things: a **base case** (when to stop) and a **recursive step** that moves toward it.\n\n**Factorial:** fact(0) = 1 (base); fact(n) = n x fact(n - 1) (step). So fact(4) = 4 x 3 x 2 x 1 = **24**.\n\n**Sum to n:** f(0) = 0; f(n) = n + f(n - 1). So f(3) = 3 + 2 + 1 + 0 = **6**.\n\n**Trace recursion** by writing the calls top-down, then resolving bottom-up.\n\n**Common mistake:** forgetting the base case (causes infinite recursion / stack overflow) or not reducing the problem toward it.",
          sourceIds: ["gfg-dsa"],
        },
        {
          id: "l-str-2",
          title: "String fundamentals",
          minutes: 5,
          body:
            "**A palindrome** reads the same forwards and backwards (level, madam). Check it with two pointers moving inward from both ends.\n\n**Reversing a string** also uses two pointers (swap ends, move inward) or simply read it backwards: reverse of \"abc\" is \"cba\".\n\n**Counting characters** (vowels, frequencies) is a single pass with a counter or a map. Vowels in \"PLACEMENT\" are A, E, E -> **3**.\n\n**Exam tip:** \"same forwards and backwards\", \"first non-repeating character\", and \"anagram\" are classic string warm-ups. Know them cold.",
          sourceIds: ["gfg-dsa"],
        },
      ],
      quiz: [
        q("Strings", "easy", "Which string is a palindrome?", ["level", "world", "code", "apple"], 0, "'level' reads the same forwards and backwards.", "gfg-dsa"),
        q("Recursion", "medium", "What does fact(4) return if fact(0)=1 and fact(n)=nxfact(n-1)?", ["12", "24", "16", "20"], 1, "4 x 3 x 2 x 1 = 24.", "gfg-dsa"),
        q("Strings", "medium", "Number of vowels in 'PLACEMENT':", ["2", "3", "4", "5"], 1, "A, E, E -> 3 vowels.", "gfg-dsa"),
        q("Recursion", "hard", "If f(0)=0 and f(n)=n+f(n-1), what is f(3)?", ["3", "6", "9", "0"], 1, "f(3) = 3 + 2 + 1 + 0 = 6.", "gfg-dsa"),
        q("Strings", "easy", "The reverse of the string 'abc' is:", ["abc", "cba", "bca", "acb"], 1, "Read it backwards: c, b, a -> 'cba'.", "gfg-dsa"),
      ],
    },
    {
      id: "coding-sorting-searching",
      title: "Sorting & Searching",
      summary: "Binary search, sort complexities, and when each one applies.",
      lessons: [
        {
          id: "l-sort-1",
          title: "Searching: linear vs binary",
          minutes: 6,
          body:
            "**Linear search** checks every element -> O(n), works on any order.\n\n**Binary search** repeatedly halves the search space -> **O(log n)**, but it requires a **sorted** array. Compare the target with the middle: if smaller, search the left half; if larger, the right half.\n\n**Worked intuition:** searching 1,000,000 sorted items takes about 20 comparisons (log₂ of a million), versus up to a million for linear search.\n\n**Common mistake:** using binary search on an unsorted array. Sort first (or it gives wrong answers).",
          sourceIds: ["gfg-dsa"],
        },
        {
          id: "l-sort-2",
          title: "Sorting complexities",
          minutes: 5,
          body:
            "Know these by heart:\n- **Bubble, Insertion, Selection:** O(n^2) - simple but slow.\n- **Merge Sort:** O(n log n) always, and stable (keeps equal items in order).\n- **Quick Sort:** O(n log n) on average, but O(n^2) worst case (bad pivots); fastest in practice.\n\n**When to use what:** Merge Sort when you need guaranteed O(n log n) or stability; Quick Sort for typical fast in-memory sorting.\n\n**Exam tip:** if asked the worst case, remember Quick Sort can degrade to O(n^2), while Merge Sort stays O(n log n).",
          sourceIds: ["gfg-dsa"],
        },
      ],
      quiz: [
        q("Searching", "easy", "Time complexity of binary search on n elements:", ["O(n)", "O(log n)", "O(n log n)", "O(1)"], 1, "Each step halves the range -> O(log n).", "gfg-dsa"),
        q("Searching", "medium", "Binary search requires the input array to be:", ["Reversed", "Sorted", "Of even length", "All unique"], 1, "Binary search only works on a sorted array.", "gfg-dsa"),
        q("Sorting", "medium", "Worst-case time complexity of Bubble Sort:", ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"], 2, "Bubble Sort compares all pairs in the worst case -> O(n^2).", "gfg-dsa"),
        q("Sorting", "medium", "Average time complexity of Quick Sort:", ["O(n^2)", "O(n log n)", "O(n)", "O(log n)"], 1, "Quick Sort averages O(n log n); its worst case is O(n^2).", "gfg-dsa"),
        q("Sorting", "medium", "Worst-case time complexity of Merge Sort:", ["O(n^2)", "O(n log n)", "O(n)", "O(log n)"], 1, "Merge Sort is O(n log n) in all cases.", "gfg-dsa"),
      ],
    },
    {
      id: "coding-linear-ds",
      title: "Linked Lists, Stacks & Queues",
      summary: "Linear structures and the O(1) operations interviewers expect you to know.",
      lessons: [
        {
          id: "l-lds-1",
          title: "Linked lists and pointers",
          minutes: 6,
          body:
            "A **linked list** stores nodes, each holding a value and a pointer to the next node.\n\n**Costs:** inserting or deleting at the **head is O(1)** (just rewire a couple of pointers), but **random access is O(n)** (you must walk from the start). This is the opposite trade-off to arrays, which give O(1) access but O(n) insert in the middle.\n\n**Worked intuition:** to add to the front, point the new node at the old head, then move head to the new node - two steps, no shifting.\n\n**Common mistake:** assuming linked lists allow fast index access. They do not.",
          sourceIds: ["gfg-dsa"],
        },
        {
          id: "l-lds-2",
          title: "Stacks (LIFO) and queues (FIFO)",
          minutes: 5,
          body:
            "A **stack** is **LIFO** - Last In, First Out. You push and pop at one end. Stacks model the function-call/recursion stack, undo history, and balanced-parentheses checks.\n\nA **queue** is **FIFO** - First In, First Out. You enqueue at the rear and dequeue at the **front**. Queues model scheduling and breadth-first search (BFS).\n\n**Worked intuition:** to check if brackets like ()[]{} are balanced, push every opening bracket and pop on each closing bracket; if it ever mismatches or the stack is non-empty at the end, it is unbalanced.\n\n**Exam tip:** \"undo\", \"recursion\", \"matching brackets\" -> stack. \"scheduling\", \"BFS\", \"print queue\" -> queue.",
          sourceIds: ["gfg-dsa"],
        },
      ],
      quiz: [
        q("Stacks", "easy", "A stack follows which order?", ["FIFO", "LIFO", "Random", "Sorted"], 1, "Stack = Last In, First Out (LIFO).", "gfg-dsa"),
        q("Linked List", "medium", "Inserting a node at the head of a singly linked list is:", ["O(n)", "O(log n)", "O(1)", "O(n^2)"], 2, "Only a couple of pointer updates -> O(1).", "gfg-dsa"),
        q("Queues", "easy", "A queue removes elements from the:", ["Rear", "Front", "Middle", "Top"], 1, "FIFO: elements leave from the front.", "gfg-dsa"),
        q("Stacks", "medium", "Which structure best models recursive function calls?", ["Queue", "Stack", "Heap", "Graph"], 1, "The call stack is a stack - the last call returns first.", "gfg-dsa"),
        q("Stacks", "medium", "Which data structure is best for checking balanced parentheses?", ["Queue", "Stack", "Heap", "Array"], 1, "Push opening brackets and pop on closing brackets - a stack.", "gfg-dsa"),
      ],
    },
    {
      id: "coding-patterns",
      title: "Patterns: Two-Pointer & Sliding Window",
      summary: "High-yield techniques that turn O(n^2) into O(n).",
      lessons: [
        {
          id: "l-pat-1",
          title: "Two-pointer and sliding window",
          minutes: 7,
          body:
            "**Two-pointer:** on a **sorted** array, place one pointer at each end and move them inward. If the pair sum is too big, move the right pointer left; too small, move the left pointer right. This finds a target pair in **O(n)** instead of O(n^2).\n\n**Sliding window:** keep a moving window over the array to answer \"best subarray/substring of size k\" or \"longest substring with a property\". Expand the window, and shrink from the left when a rule breaks. Also **O(n)**.\n\n**Worked example:** maximum sum of a contiguous subarray of size k - slide a size-k window, add the new element and subtract the one leaving, updating the sum in O(1) per step.",
          sourceIds: ["gfg-dsa", "careerride-yt"],
        },
        {
          id: "l-pat-2",
          title: "Prefix sums",
          minutes: 5,
          body:
            "A **prefix-sum array** stores the running total: prefix[i] = sum of the first i elements. Build it once in O(n).\n\nAfter that, the sum of any range l...r is **prefix[r] - prefix[l - 1]**, answered in **O(1)** per query. This beats re-adding the range every time.\n\n**Worked intuition:** for array [2, 4, 1, 3], prefix = [2, 6, 7, 10]. Sum of indices 2...4 (the last three) = 10 - 2 = 8.\n\n**Exam tip:** any problem with many \"sum between two indices\" queries is a prefix-sum problem.",
          sourceIds: ["gfg-dsa"],
        },
      ],
      quiz: [
        q("Sliding Window", "medium", "Best technique for the maximum sum of a contiguous subarray of fixed size k:", ["Two nested loops", "Sliding window", "Sorting first", "Recursion"], 1, "Slide a size-k window, updating the sum in O(1) per step -> O(n) overall.", "gfg-dsa"),
        q("Two Pointer", "medium", "The classic two-pointer pair-sum technique assumes the array is:", ["Empty", "Sorted", "All negative", "A linked list"], 1, "Sorted order lets you move pointers based on whether the sum is too high or low.", "gfg-dsa"),
        q("Prefix Sum", "medium", "After building a prefix-sum array, a range-sum query takes:", ["O(n)", "O(log n)", "O(1)", "O(n^2)"], 2, "sum(l..r) = prefix[r] - prefix[l-1] -> O(1).", "gfg-dsa"),
        q("Sliding Window", "medium", "Best technique for the longest substring without repeating characters:", ["Sorting", "Sliding window", "Recursion", "Binary search"], 1, "Grow a window and shrink from the left when a repeat appears - sliding window.", "gfg-dsa"),
      ],
    },
  ],
}

// ============================================================================
// CS CORE
// ============================================================================
const csCore: Section = {
  ...SECTION_META[4],
  chapters: [
    {
      id: "cs-dbms",
      title: "DBMS Essentials",
      summary: "Keys, normalization and joins - the most-asked DBMS interview topics.",
      lessons: [
        {
          id: "l-db-1",
          title: "Keys and normalization",
          minutes: 6,
          body:
            "A **primary key** uniquely identifies each row and cannot be null. A **foreign key** in one table references the primary key of another, linking the two.\n\n**Normalization** removes redundancy step by step:\n- **1NF:** every cell holds a single (atomic) value.\n- **2NF:** 1NF and no non-key column depends on only part of a composite key.\n- **3NF:** 2NF and no non-key column depends on another non-key column (no transitive dependency).\n\n**Worked intuition:** if 'city' depends on 'zip' which depends on the key, that transitive link breaks 3NF; move zip->city into its own table.\n\n**Exam tip:** \"removes transitive dependency\" is the standard one-line answer for 3NF.",
          sourceIds: ["gfg-cs-core"],
        },
        {
          id: "l-db-2",
          title: "Joins you must know",
          minutes: 5,
          body:
            "Joins combine rows from two tables on a matching column.\n- **INNER JOIN:** only rows that match in both tables.\n- **LEFT JOIN:** all rows from the left table, plus matches from the right (nulls where none).\n- **RIGHT JOIN:** all rows from the right table, plus matches from the left.\n- **FULL OUTER JOIN:** all rows from both, matched where possible.\n\n**Worked intuition:** to list every customer and their orders including customers with no orders, use a LEFT JOIN from customers to orders.\n\n**Common mistake:** using INNER JOIN when you need rows that have no match - that silently drops them.",
          sourceIds: ["gfg-cs-core"],
        },
      ],
      quiz: [
        q("DBMS", "easy", "Which constraint uniquely identifies each row in a table?", ["Foreign key", "Primary key", "Check", "Index"], 1, "The primary key uniquely identifies each row and cannot be null.", "gfg-cs-core"),
        q("DBMS", "medium", "A table is in 3NF when it is in 2NF and has no:", ["Atomic values", "Partial dependency", "Transitive dependency", "Foreign keys"], 2, "3NF removes transitive dependencies (a non-key attribute depending on another non-key attribute).", "gfg-cs-core"),
        q("DBMS", "medium", "Which join returns only rows with matches in both tables?", ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL OUTER JOIN"], 2, "INNER JOIN returns only matching rows from both tables.", "gfg-cs-core"),
        q("DBMS", "easy", "A foreign key references:", ["The same table only", "Another table's primary key", "An index", "A view"], 1, "A foreign key points to the primary key of another table.", "gfg-cs-core"),
        q("DBMS", "medium", "Which join keeps all rows from the left table even when there is no match?", ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "CROSS JOIN"], 1, "LEFT JOIN returns all left rows, filling nulls where the right has no match.", "gfg-cs-core"),
      ],
    },
    {
      id: "cs-os-oop",
      title: "Operating Systems & OOP",
      summary: "Process vs thread, deadlock conditions, and the four pillars of OOP.",
      lessons: [
        {
          id: "l-os-1",
          title: "Process, thread and deadlock",
          minutes: 6,
          body:
            "A **process** is a running program with its **own memory**. A **thread** is a lighter unit of execution **inside** a process that **shares** the process's memory, so switching between threads is cheaper.\n\n**Deadlock** happens when processes wait on each other forever. It needs **all four** of these conditions at once:\n1. Mutual exclusion 2. Hold and wait 3. No preemption 4. Circular wait.\nBreak any one and deadlock cannot occur.\n\n**Common mistake:** thinking threads have separate memory - they share it (which is why you need synchronisation).",
          sourceIds: ["gfg-cs-core"],
        },
        {
          id: "l-oop-1",
          title: "The four pillars of OOP",
          minutes: 5,
          body:
            "**Encapsulation:** bundle data with the methods that use it and hide the internals behind a clean interface (private fields, public methods).\n\n**Abstraction:** expose only what matters and hide the complexity (a 'drive()' method hides the engine details).\n\n**Inheritance:** a child class acquires the properties and methods of a parent class and can extend them.\n\n**Polymorphism:** the same method name behaves differently for different types (a 'draw()' that works for Circle and Square).\n\n**Worked intuition:** \"hiding internal state behind methods\" = encapsulation; \"same call, different behaviour\" = polymorphism.",
          sourceIds: ["gfg-cs-core"],
        },
      ],
      quiz: [
        q("OS", "medium", "Which is NOT one of the four necessary conditions for deadlock?", ["Mutual exclusion", "Hold and wait", "Preemption allowed", "Circular wait"], 2, "Deadlock requires NO preemption; allowing preemption breaks a condition.", "gfg-cs-core"),
        q("OOP", "easy", "Hiding internal state and requiring access through methods is called:", ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction"], 1, "Encapsulation bundles data with methods and restricts direct access.", "gfg-cs-core"),
        q("OOP", "medium", "The same method name behaving differently across types is:", ["Encapsulation", "Polymorphism", "Abstraction", "Inheritance"], 1, "Polymorphism lets one interface work with different underlying types.", "gfg-cs-core"),
        q("OS", "easy", "How do threads differ from processes?", ["Threads have fully separate memory", "Threads share their process's memory", "Threads are heavier than processes", "Processes share memory by default"], 1, "Threads share the memory of their parent process; processes have their own.", "gfg-cs-core"),
        q("OOP", "medium", "Inheritance is best described as:", ["Hiding data fields", "A child class acquiring a parent class's properties", "Overloading an operator", "Managing memory"], 1, "Inheritance lets a child class reuse and extend a parent class.", "gfg-cs-core"),
      ],
    },
    {
      id: "cs-networks",
      title: "Computer Networks",
      summary: "OSI layers, TCP vs UDP, and the protocols behind the web.",
      lessons: [
        {
          id: "l-cn-1",
          title: "OSI model and TCP vs UDP",
          minutes: 6,
          body:
            "The **OSI model has 7 layers**: Physical, Data Link, Network, Transport, Session, Presentation, Application. (A common memory aid: 'Please Do Not Throw Sausage Pizza Away'.)\n\n**TCP** is **connection-oriented and reliable**: it sets up a connection (handshake), delivers data in order, and retransmits anything lost. Used for the web, email, file transfer.\n\n**UDP** is **connectionless and fast**: no handshake, no guarantee of order or delivery, but lower overhead. Used for live video, voice calls, and online games.\n\n**Exam tip:** reliable and ordered = TCP; fast and lightweight = UDP.",
          sourceIds: ["gfg-cs-core"],
        },
        {
          id: "l-cn-2",
          title: "Protocols and ports",
          minutes: 5,
          body:
            "Common application protocols and their default ports:\n- **DNS** resolves a domain name (example.com) to an IP address.\n- **HTTP** serves web pages on port **80**.\n- **HTTPS** is encrypted HTTP on port **443**.\n- **SMTP** (port 25) sends email.\n\n**Worked intuition:** when you type a site name, DNS finds its IP, then HTTPS (443) fetches the page securely.\n\n**Common mistake:** swapping the ports - remember 80 for HTTP, 443 for HTTPS.",
          sourceIds: ["gfg-cs-core"],
        },
      ],
      quiz: [
        q("Networks", "easy", "How many layers are in the OSI model?", ["5", "6", "7", "4"], 2, "The OSI model has 7 layers (Physical -> Application).", "gfg-cs-core"),
        q("Networks", "medium", "TCP is best described as:", ["Connectionless and unreliable", "Connection-oriented and reliable", "Only for streaming", "A routing protocol"], 1, "TCP sets up a connection and guarantees ordered, reliable delivery.", "gfg-cs-core"),
        q("Networks", "easy", "Which protocol resolves a domain name to an IP address?", ["HTTP", "DNS", "FTP", "SMTP"], 1, "DNS (Domain Name System) maps names to IP addresses.", "gfg-cs-core"),
        q("Networks", "medium", "HTTPS communicates over port:", ["21", "80", "443", "25"], 2, "HTTPS uses port 443; plain HTTP uses port 80.", "gfg-cs-core"),
        q("Networks", "medium", "UDP is best described as:", ["Reliable and ordered", "Connection-oriented", "Connectionless and fast", "Always encrypted"], 2, "UDP has no handshake or delivery guarantee, which makes it fast and lightweight.", "gfg-cs-core"),
      ],
    },
    {
      id: "cs-sql",
      title: "Practical SQL",
      summary: "Clause order, WHERE vs HAVING, and the aggregates you'll be quizzed on.",
      lessons: [
        {
          id: "l-sql-1",
          title: "Clauses and execution order",
          minutes: 6,
          body:
            "A query is **written** as: SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY.\n\nBut it **executes** roughly in this order: **FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY.** Knowing this explains the next rule.\n\n**WHERE filters individual rows** (before grouping). **HAVING filters groups** (after aggregation). So you cannot use an aggregate like COUNT() in WHERE, but you can in HAVING.\n\n**Worked intuition:** \"customers with more than 5 orders\" needs HAVING COUNT(*) > 5, because the count exists only after GROUP BY.\n\n**Exam tip:** WHERE runs before HAVING.",
          sourceIds: ["gfg-cs-core"],
        },
        {
          id: "l-sql-2",
          title: "Aggregates and DISTINCT",
          minutes: 5,
          body:
            "**Aggregate functions** summarise many rows into one value:\n- COUNT() - number of rows\n- SUM() - total\n- AVG() - average\n- MIN() / MAX() - smallest / largest\n\n**DISTINCT** removes duplicate rows from a result: SELECT DISTINCT city returns each city once.\n\n**GROUP BY** lets you aggregate per category: SELECT city, COUNT(*) FROM users GROUP BY city counts users in each city.\n\n**Common mistake:** forgetting that every non-aggregated column in the SELECT must appear in GROUP BY.",
          sourceIds: ["gfg-cs-core"],
        },
      ],
      quiz: [
        q("SQL", "medium", "Which clause filters groups after aggregation?", ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], 1, "HAVING filters aggregated groups; WHERE filters individual rows before grouping.", "gfg-cs-core"),
        q("SQL", "easy", "Which keyword removes duplicate rows from a result?", ["UNIQUE", "DISTINCT", "ONLY", "FILTER"], 1, "SELECT DISTINCT returns unique rows.", "gfg-cs-core"),
        q("SQL", "easy", "Which aggregate function counts rows?", ["SUM()", "COUNT()", "AVG()", "TOTAL()"], 1, "COUNT() returns the number of rows.", "gfg-cs-core"),
        q("SQL", "medium", "Between WHERE and HAVING, which is applied first?", ["HAVING", "WHERE", "They are equal", "Neither"], 1, "WHERE filters rows before grouping; HAVING runs after aggregation.", "gfg-cs-core"),
        q("SQL", "easy", "Which aggregate function returns the average of a column?", ["SUM()", "AVG()", "COUNT()", "MAX()"], 1, "AVG() computes the mean of the column's values.", "gfg-cs-core"),
      ],
    },
  ],
}

// ============================================================================
// COMMUNICATION & INTERVIEW
// ============================================================================
const commInterview: Section = {
  ...SECTION_META[5],
  chapters: [
    {
      id: "comm-intro",
      title: "Self-Introduction & Group Discussion",
      summary: "A crisp 60-second intro and how to stand out in a GD without dominating.",
      lessons: [
        {
          id: "l-ci-1",
          title: "The 60-second self-introduction",
          minutes: 6,
          body:
            "A strong intro is short and structured. Use this arc:\n**Name -> background (college, branch) -> 2 relevant strengths or projects -> why this role/company -> a confident close.**\n\nKeep it under a minute. Tailor the strengths to the role, and end on genuine enthusiasm rather than trailing off.\n\n**Worked example opener:** \"I'm Aarav, a final-year CSE student. I enjoy backend problem-solving, and I recently built a ticket-booking API that handles concurrent bookings. I'm keen on this role because...\"\n\n**Common mistake:** reciting your resume line by line, or opening with weaknesses or salary. Lead with who you are and what you are good at.",
          sourceIds: ["studybench-curriculum"],
        },
        {
          id: "l-ci-2",
          title: "Group discussion strategy",
          minutes: 5,
          body:
            "Evaluators score **clarity, listening and leadership**, not who is loudest.\n\n**Enter early** with one clear point backed by a reason or example. If the topic is abstract, structure it (pros vs cons, or social/economic/technical angles).\n\n**Bring others in** (\"Building on what she said...\") and never talk over people or get aggressive.\n\n**Worked example:** to enter a heated GD, acknowledge the last point, then add yours: \"That's a fair point on cost; I'd add that it also affects long-term retention.\"\n\n**Exam tip:** a calm, well-structured summary at the end is a strong and often-overlooked way to lead.",
          sourceIds: ["studybench-curriculum"],
        },
      ],
      quiz: [
        q("Communication", "easy", "What is the ideal length of a self-introduction in an interview?", ["5+ minutes", "About 30-60 seconds", "As long as possible", "One word"], 1, "A focused 30-60 second intro respects time and keeps attention.", "studybench-curriculum"),
        q("Communication", "medium", "In a group discussion, the strongest contribution is one that:", ["Is the loudest", "Repeats others", "Adds a reasoned new point", "Interrupts often"], 2, "Evaluators reward clear, reasoned, novel contributions over volume.", "studybench-curriculum"),
        q("Communication", "medium", "A good way to enter a heated group discussion is to:", ["Shout over others", "Wait until it ends", "Acknowledge a point, then add yours", "Change the topic"], 2, "Bridging ('Building on that...') gets you in politely while showing you listen.", "studybench-curriculum"),
        q("Communication", "medium", "A self-introduction is best started with:", ["Your salary expectation", "Your name and background", "Your weaknesses", "A long joke"], 1, "Open with who you are (name, background), then strengths and fit.", "studybench-curriculum"),
      ],
    },
    {
      id: "comm-written",
      title: "Written & Email Communication",
      summary: "Clear professional email and a simple essay structure that scores.",
      lessons: [
        {
          id: "l-cw-1",
          title: "Professional email",
          minutes: 5,
          body:
            "A good email has four parts: a **clear subject line**, a **greeting**, a **short purposeful body**, and a **polite sign-off**.\n\nBe **specific** rather than vague. \"Could we meet on Tuesday at 3pm?\" beats \"please revert asap\". State the action you want and the deadline.\n\n**Worked example subject:** \"Request: 15-minute call on the internship offer (Tue/Wed)\". The reader knows the purpose before opening it.\n\n**Common mistake:** long, rambling emails with no clear ask. Put the request near the top.",
          sourceIds: ["studybench-curriculum"],
        },
        {
          id: "l-cw-2",
          title: "Essay structure",
          minutes: 5,
          body:
            "Many drives include a short written essay. Plan for one minute, then write:\n**Introduction (state your stance) -> 2-3 body paragraphs (one idea each, with an example) -> conclusion (restate and close).**\n\nKeep sentences short and clear, and watch spelling and grammar - they are scored.\n\n**Worked intuition:** for \"Is remote work good?\", paragraph 1 = your stance, paragraph 2 = one benefit with an example, paragraph 3 = one drawback, conclusion = balanced verdict.\n\n**Common mistake:** writing one long paragraph with no structure. Use clear paragraph breaks.",
          sourceIds: ["studybench-curriculum", "wipro-careers"],
        },
      ],
      quiz: [
        q("Written Communication", "easy", "A professional email should begin with:", ["The attachment", "A clear subject line and greeting", "An apology", "Your life story"], 1, "A specific subject and greeting set context immediately.", "studybench-curriculum"),
        q("Essay Writing", "medium", "The opening paragraph of an essay should:", ["List references", "State your main idea or stance", "Be the conclusion", "Be left blank"], 1, "Lead with a clear thesis so the reader knows your position.", "studybench-curriculum"),
        q("Written Communication", "medium", "Which is the clearer, more professional phrasing?", ["Please do the needful asap", "Kindly revert back", "Could you confirm by Tuesday 3pm?", "Update me whenever"], 2, "Specific, time-bound requests are clearer than vague phrases.", "studybench-curriculum"),
        q("Essay Writing", "medium", "A well-structured essay is:", ["As long as possible", "Built from intro, body and conclusion", "Only bullet points", "One long paragraph"], 1, "Structure (intro, body, conclusion) makes the argument easy to follow and score.", "studybench-curriculum"),
      ],
    },
    {
      id: "comm-hr",
      title: "HR Questions, Deep Dive",
      summary: "Answer the classics with structure: strengths, 'why us', goals and salary.",
      lessons: [
        {
          id: "l-hr-1",
          title: "Answering the classic HR questions",
          minutes: 7,
          body:
            "**\"Why this company?\"** Cite 1-2 specific, researched facts (a product, a value, a technology) and connect them to your goals. Never a generic \"it's a good company\".\n\n**\"Where in 5 years?\"** Show realistic growth aligned to the role and a willingness to take on more responsibility.\n\n**\"Your weakness?\"** Name a real one and the concrete steps you are taking to improve. Self-awareness beats a fake \"I work too hard\".\n\n**\"Salary expectation (fresher)?\"** It is fine to say you are flexible and open to the company's standard for the role.\n\n**Common mistake:** vague, rehearsed answers. Specifics show genuine interest.",
          sourceIds: ["studybench-curriculum"],
        },
        {
          id: "l-hr-2",
          title: "STAR for behavioural questions",
          minutes: 5,
          body:
            "For \"Tell me about a time...\" questions, structure your answer with **STAR**:\n- **Situation** - the context (briefly).\n- **Task** - what you were responsible for.\n- **Action** - what YOU did (the bulk of the answer).\n- **Result** - the outcome, ideally measurable.\n\n**Worked example (teamwork):** Situation - a group project running late; Task - coordinate the backend; Action - split tasks, set daily check-ins; Result - delivered two days early.\n\n**Exam tip:** spend most of your words on Action and end with a concrete Result.",
          sourceIds: ["studybench-curriculum"],
        },
      ],
      quiz: [
        q("HR", "medium", "Best framing for 'What is your weakness?'", ["I have none", "A real weakness plus how you are improving it", "Blame others", "A strength in disguise only"], 1, "Show self-awareness: name a genuine area and the concrete steps you take to improve.", "studybench-curriculum"),
        q("HR", "medium", "For 'Why do you want to join us?', the strongest answer:", ["Says 'it's a good company'", "Cites specific researched facts about the company", "Talks only about salary", "Says you applied everywhere"], 1, "Specific, researched reasons show genuine interest and effort.", "studybench-curriculum"),
        q("HR", "medium", "Asked about salary as a fresher, a sensible response is:", ["Demand a high number", "Refuse to answer", "Say you're flexible and open to the role's standard", "Quote a competitor"], 2, "Flexibility plus market awareness is the mature stance for a fresher.", "studybench-curriculum"),
        q("HR", "easy", "STAR in behavioural interviews stands for:", ["Stop, Think, Act, Review", "Situation, Task, Action, Result", "Skill, Talent, Aptitude, Role", "Start, Try, Adapt, Repeat"], 1, "STAR = Situation, Task, Action, Result.", "studybench-curriculum"),
      ],
    },
    {
      id: "comm-body-virtual",
      title: "Body Language & Virtual Interviews",
      summary: "Small habits that signal confidence, in person and on camera.",
      lessons: [
        {
          id: "l-bv-1",
          title: "Presence in the room",
          minutes: 5,
          body:
            "Confidence is read from your body before you speak. **Sit upright, make natural eye contact, offer a calm greeting, and keep your hands steady.**\n\n**Minimise filler words** (um, like, you know). A brief, silent pause sounds far more composed than a filler.\n\n**Worked intuition:** if you need a moment to think, pause and breathe rather than filling the gap with \"um\". Interviewers read the pause as thoughtfulness.\n\n**Common mistake:** slouching, fidgeting, or avoiding eye contact, which reads as nervousness even when your answers are good.",
          sourceIds: ["studybench-curriculum", "careerride-yt"],
        },
        {
          id: "l-bv-2",
          title: "On camera",
          minutes: 5,
          body:
            "Virtual interviews add a few rules:\n- **Look at the camera**, not the screen, so you appear to make eye contact.\n- Ensure **good lighting** (face a window or lamp) and a **tidy background**.\n- Test your **mic and audio**, and **join a couple of minutes early** to fix any glitches.\n\n**Worked intuition:** placing your notes just beside the webcam keeps your eyes near the camera line.\n\n**Common mistake:** a dark room, a noisy background, or joining late while troubleshooting audio. Treat the setup as part of the interview.",
          sourceIds: ["studybench-curriculum"],
        },
      ],
      quiz: [
        q("Interview", "easy", "In a video interview, to appear to make eye contact you should look at:", ["The keyboard", "The camera", "Your own video", "The window"], 1, "Looking into the camera reads as eye contact to the interviewer.", "studybench-curriculum"),
        q("Interview", "easy", "Good in-person body language includes:", ["Slouching", "Avoiding eye contact", "Upright posture and natural eye contact", "Crossed arms throughout"], 2, "Upright posture and steady eye contact convey confidence.", "studybench-curriculum"),
        q("Communication", "medium", "Filler words like 'um' and 'like' should be:", ["Used often", "Minimised, using brief pauses instead", "Added for emphasis", "Ignored entirely"], 1, "A short pause sounds more composed than a filler word.", "studybench-curriculum"),
        q("Interview", "medium", "Before a video interview you should:", ["Join late", "Test your audio and video early", "Turn the camera off", "Sit in a noisy room"], 1, "Joining early to test audio and video avoids glitches during the interview.", "studybench-curriculum"),
      ],
    },
    {
      id: "comm-final-round",
      title: "Final Interview Round",
      summary: "Think aloud on technical questions and close the interview strongly.",
      lessons: [
        {
          id: "l-ci-3",
          title: "Handling the panel",
          minutes: 6,
          body:
            "On technical questions, **think aloud** - interviewers score your approach, not just the final answer. If you are stuck, **state your assumptions and a brute-force idea first, then optimise**.\n\nFor behavioural questions, use **STAR** (Situation, Task, Action, Result).\n\n**Worked intuition:** asked to find duplicates, say \"the simple way is to compare every pair, O(n^2); I can do better with a hash set in O(n)\" - that shows range.\n\n**Common mistake:** going silent when stuck. Narrate your thinking so the panel can follow and nudge you.",
          sourceIds: ["studybench-curriculum"],
        },
        {
          id: "l-ci-4",
          title: "Closing strong",
          minutes: 4,
          body:
            "End the interview deliberately. **Ask one thoughtful, forward-looking question** and thank the panel.\n\nGood closing questions: \"What does success look like in this role in the first six months?\" or \"What does the team value most in new joiners?\"\n\n**Worked intuition:** a forward-looking question signals genuine interest and maturity, and leaves a strong final impression.\n\n**Common mistake:** saying \"No, I have no questions.\" It reads as low interest. Always have one ready.",
          sourceIds: ["studybench-curriculum"],
        },
      ],
      quiz: [
        q("Interview", "medium", "When you don't know a technical answer, the best move is to:", ["Stay silent", "Guess randomly", "State your assumptions and reason aloud", "Change the topic"], 2, "Reasoning aloud and stating assumptions shows problem-solving even without the final answer.", "studybench-curriculum"),
        q("HR", "easy", "STAR in behavioural interviews stands for:", ["Stop, Think, Act, Review", "Situation, Task, Action, Result", "Skill, Talent, Aptitude, Role", "Start, Try, Adapt, Repeat"], 1, "STAR = Situation, Task, Action, Result - a structure for behavioural answers.", "studybench-curriculum"),
        q("Interview", "medium", "A good question to ask the interviewer at the end is:", ["What does this company do?", "When can I leave?", "What does success look like in this role in 6 months?", "Nothing"], 2, "A thoughtful forward-looking question signals genuine interest and maturity.", "studybench-curriculum"),
        q("Interview", "medium", "When stuck on a coding question, you should:", ["Stay silent", "Give up", "State a brute-force idea, then optimise", "Change the subject"], 2, "Start with a working brute-force approach and improve it; the panel scores your reasoning.", "studybench-curriculum"),
      ],
    },
  ],
}

const BASE_SECTIONS: Section[] = [quant, reasoning, verbal, coding, csCore, commInterview]

// Company-specific extra chapter: Zoho is coding-heavy.
const ZOHO_EXTRA = {
  id: "coding-zoho-design",
  title: "Program Design (Machine Round)",
  summary: "Machine-round style: design and debug a small program end to end.",
  lessons: [
    {
      id: "l-zoho-1",
      title: "Designing under pressure",
      minutes: 7,
      body:
        "Programming-heavy recruiters give a real problem to build on a machine. Work in this order:\n1. **Clarify the input and output** and the edge cases before writing code.\n2. **Break the problem into small functions**, each doing one thing.\n3. **Handle edge cases** explicitly: empty input, a single element, very large values / overflow.\n4. **Test with your own examples** before declaring done.\n\n**Worked intuition:** for \"sum of an array\", the robust version returns 0 for an empty array instead of crashing.\n\n**Common mistake:** writing the whole program then testing once at the end. Build and test in small pieces.",
      sourceIds: ["zoho-careers", "gfg-dsa"],
    },
  ],
  quiz: [
    q("Coding", "hard", "When designing a program in a timed machine round, you should FIRST:", ["Write the whole thing then test", "Clarify input/output and edge cases", "Optimise prematurely", "Pick the fanciest data structure"], 1, "Clarify I/O and edge cases first; correctness on edges wins these rounds.", "zoho-careers"),
    q("Coding", "medium", "A robust function for 'sum of array' must handle:", ["Only positive numbers", "An empty array", "Only sorted arrays", "Only size 10"], 1, "Empty input is the classic edge case - return 0 rather than crashing.", "gfg-dsa"),
    q("Coding", "medium", "The best way to build a solution in a timed coding round is to:", ["Write everything, then test once", "Build and test in small pieces", "Skip edge cases", "Avoid functions"], 1, "Building and testing incrementally catches bugs early and saves time.", "gfg-dsa"),
  ],
}

// ============================================================================
// EXTRA CHAPTERS - broaden coverage for serious placement prep (all tracks)
// ============================================================================

// ---- QUANT ----
const quantTimeWork: Chapter = {
  id: "quant-time-work",
  title: "Time & Work, Pipes & Cisterns",
  summary: "Think in work-per-day rates and combine them - the fast way to solve work problems.",
  lessons: [
    {
      id: "l-tw-1",
      title: "The work-rate method",
      minutes: 6,
      body:
        "Never think in days first - think in **work done per day**. If A finishes a job in 'a' days, A's rate is **1/a per day**. To work together, simply **add the rates**, then invert for the time.\n\n**The LCM trick (fastest):** let total work = LCM of the times, in 'units'. Then each person's rate = total / their time, in units per day.\n\n**Worked example:** A finishes in 12 days, B in 24. Take total = LCM(12, 24) = 24 units. A does 2 units/day, B does 1 unit/day, together 3 units/day -> 24 / 3 = **8 days**.\n\n**Common mistake:** averaging the days (12 and 24 -> 18). You add rates, not days.",
      sourceIds: ["rs-aggarwal-quant"],
    },
    {
      id: "l-tw-2",
      title: "Pipes and cisterns (negative work)",
      minutes: 5,
      body:
        "Pipes are just work in disguise. A **filling** pipe has a positive rate; a **draining** pipe has a negative rate. Add them up.\n\n**Worked example:** pipe A fills a tank in 6 hours (rate 1/6), pipe B empties it in 12 hours (rate -1/12). Both open: 1/6 - 1/12 = 1/12 -> the tank fills in **12 hours**.\n\n**Worked example (find one rate):** A and B together finish in 8 days; A alone in 12 days. B's rate = 1/8 - 1/12 = 1/24, so B alone takes **24 days**.\n\n**Exam tip:** if 'm' people take 'd' days, then more or fewer people scale inversely (men and days are inversely proportional for the same work).",
      sourceIds: ["rs-aggarwal-quant"],
    },
  ],
  quiz: [
    q("Time & Work", "easy", "A finishes a job in 10 days, B in 15 days. Together they finish in:", ["5 days", "6 days", "7.5 days", "12 days"], 1, "1/10 + 1/15 = 1/6 per day -> 6 days.", "rs-aggarwal-quant"),
    q("Time & Work", "medium", "A does a job in 20 days, B in 30 days. Working together they finish in:", ["10 days", "12 days", "15 days", "25 days"], 1, "1/20 + 1/30 = 1/12 per day -> 12 days.", "rs-aggarwal-quant"),
    q("Pipes & Cisterns", "medium", "Pipe A fills a tank in 6 h, pipe B in 12 h. With both open the tank fills in:", ["3 h", "4 h", "8 h", "9 h"], 1, "1/6 + 1/12 = 1/4 per hour -> 4 hours.", "rs-aggarwal-quant"),
    q("Time & Work", "hard", "A and B together finish a job in 8 days; A alone takes 12 days. B alone takes:", ["16 days", "20 days", "24 days", "18 days"], 2, "B's rate = 1/8 - 1/12 = 1/24 -> 24 days.", "rs-aggarwal-quant"),
    q("Time & Work", "medium", "If 6 men build a wall in 10 days, then 12 men (same rate) take:", ["5 days", "15 days", "20 days", "4 days"], 0, "Men and days are inversely proportional: 6 x 10 = 12 x d -> d = 5 days.", "indiabix-aptitude"),
  ],
}

const quantAveragesAges: Chapter = {
  id: "quant-averages-ages",
  title: "Averages, Ages & Mixtures",
  summary: "Sum = average x count, and a clean way to set up age and mixture problems.",
  lessons: [
    {
      id: "l-aa-1",
      title: "Averages without tears",
      minutes: 5,
      body:
        "**Average = sum / count**, so **sum = average x count.** That one rearrangement solves most average questions.\n\n**For consecutive numbers**, the average is just the **middle term** (or (first + last)/2). Average of 1...10 = (1 + 10)/2 = **5.5**.\n\n**Worked example (new member shifts the average):** 5 numbers average 20, so sum = 100. A 6th number, 26, joins -> new sum 126, new average 126/6 = **21**.\n\n**Common mistake:** averaging two averages directly when the group sizes differ. Recover the sums first, add them, divide by the total count.",
      sourceIds: ["rs-aggarwal-quant"],
    },
    {
      id: "l-aa-2",
      title: "Ages and mixtures",
      minutes: 6,
      body:
        "**Ages:** let the present age be x and translate the words. 'Five years ago' = x - 5; 'after 4 years' = x + 4. Form one equation and solve.\n\n**Worked example:** a father is 3 times his son's age; in 12 years he will be twice as old. Let son = x. 3x + 12 = 2(x + 12) -> 3x + 12 = 2x + 24 -> x = 12, so the father is **36**.\n\n**Mixtures (alligation):** to mix two things at prices/strengths to hit a mean, the **ratio of quantities = (difference from the other side)** crossed. Cheaper:dearer = (dearer - mean) : (mean - cheaper).\n\n**Exam tip:** write down what each phrase means in symbols before forming the equation; most age errors are translation errors.",
      sourceIds: ["rs-aggarwal-quant"],
    },
  ],
  quiz: [
    q("Averages", "easy", "The average of 10, 20, 30, 40 and 50 is:", ["25", "30", "35", "40"], 1, "Sum = 150, count = 5 -> 150 / 5 = 30.", "rs-aggarwal-quant"),
    q("Averages", "easy", "The average of the first 10 natural numbers (1-10) is:", ["5", "5.5", "6", "55"], 1, "(1 + 10) / 2 = 5.5.", "rs-aggarwal-quant"),
    q("Averages", "medium", "If the average of 6 numbers is 25, their sum is:", ["120", "150", "156", "100"], 1, "Sum = average x count = 25 x 6 = 150.", "rs-aggarwal-quant"),
    q("Ages", "medium", "A is 5 years older than B, and the sum of their ages is 35. A's age is:", ["18", "20", "22", "15"], 1, "A = B + 5, so 2B + 5 = 35 -> B = 15, A = 20.", "indiabix-aptitude"),
    q("Averages", "hard", "The average age of 30 students is 12. Including the teacher, the average becomes 13. The teacher's age is:", ["42", "43", "44", "40"], 1, "Students' total = 360; with teacher (31 people) total = 403; teacher = 403 - 360 = 43.", "rs-aggarwal-quant"),
  ],
}

const quantPermutations: Chapter = {
  id: "quant-permutations",
  title: "Permutations, Combinations & Probability",
  summary: "Count arrangements and selections, then turn counts into probabilities.",
  lessons: [
    {
      id: "l-pc-1",
      title: "Permutations vs combinations",
      minutes: 6,
      body:
        "The only question to ask: **does order matter?**\n\n**Permutation (order matters):** nPr = n! / (n - r)!. Arranging 3 books on a shelf = 3! = **6** ways.\n\n**Combination (order does not matter):** nCr = n! / (r! (n - r)!). Choosing 2 people from 4 = 4C2 = **6** ways.\n\n**Factorial:** n! = n x (n - 1) x ... x 1, and 0! = 1.\n\n**Worked example:** arrangements of the letters of 'CAT' (all different) = 3! = 6.\n\n**Common mistake:** using permutation when picking a team (order does not matter -> use combination).",
      sourceIds: ["rs-aggarwal-quant"],
    },
    {
      id: "l-pc-2",
      title: "Probability basics",
      minutes: 5,
      body:
        "**Probability = favourable outcomes / total outcomes**, always between 0 and 1.\n\n**Complement:** P(not E) = 1 - P(E). Useful when 'at least one' is easier to count as 1 - P(none).\n\n**Independent events multiply:** P(A and B) = P(A) x P(B).\n\n**Worked examples:** a fair die, P(even) = 3/6 = **1/2**. Two coins, P(both heads) = 1/2 x 1/2 = **1/4**. A standard deck, P(a red card) = 26/52 = **1/2**.\n\n**Exam tip:** count the total outcomes carefully first; most probability mistakes come from a wrong denominator.",
      sourceIds: ["rs-aggarwal-quant", "indiabix-aptitude"],
    },
  ],
  quiz: [
    q("Factorials", "easy", "The value of 5! is:", ["60", "100", "120", "24"], 2, "5! = 5 x 4 x 3 x 2 x 1 = 120.", "rs-aggarwal-quant"),
    q("Combinations", "medium", "The value of 4C2 (choose 2 from 4) is:", ["4", "6", "8", "12"], 1, "4C2 = 4! / (2! - 2!) = 6.", "rs-aggarwal-quant"),
    q("Permutations", "easy", "Number of ways to arrange the 3 letters of 'CAT':", ["3", "6", "9", "12"], 1, "All letters differ -> 3! = 6.", "indiabix-aptitude"),
    q("Probability", "medium", "A fair die is rolled. Probability of getting an even number:", ["1/6", "1/3", "1/2", "2/3"], 2, "Even numbers are 2, 4, 6 -> 3/6 = 1/2.", "rs-aggarwal-quant"),
    q("Probability", "medium", "Two fair coins are tossed. Probability of two heads:", ["1/2", "1/4", "1/3", "1/8"], 1, "Independent events: 1/2 x 1/2 = 1/4.", "rs-aggarwal-quant"),
  ],
}

// ---- REASONING ----
const reasonSyllogism: Chapter = {
  id: "reason-syllogism",
  title: "Syllogisms & Statements",
  summary: "Draw the Venn diagram. A conclusion follows only if it is true in every diagram.",
  lessons: [
    {
      id: "l-syl-1",
      title: "The Venn-diagram method",
      minutes: 6,
      body:
        "Translate each statement into circles:\n- **All A are B** -> circle A sits fully inside circle B.\n- **Some A are B** -> circles A and B overlap.\n- **No A are B** -> circles A and B are completely separate.\n\n**The golden rule:** a conclusion **follows only if it is true in EVERY possible diagram** you can draw from the statements.\n\n**Worked example:** All cats are animals; all animals are living. Cats  is a subset of  animals  is a subset of  living, so 'all cats are living' is forced -> it **follows**.\n\n**Common mistake:** accepting a conclusion that is merely possible. If even one valid diagram breaks it, it does not follow.",
      sourceIds: ["rs-aggarwal-reasoning"],
    },
    {
      id: "l-syl-2",
      title: "The 'some' traps",
      minutes: 5,
      body:
        "'Some' statements are where students slip.\n- 'Some A are B' does **not** guarantee 'some A are not B'.\n- 'Some A are B' does **not** reverse into 'all'.\n- 'No A are B' plus 'all B are C' does **not** force 'no A are C' (A might still overlap C through another route).\n\n**Worked example (follows):** Some books are pens; all pens are red. The books that are pens must be red, so 'some books are red' **follows**.\n\n**Worked example (does not follow):** All cats are animals; some animals are wild. No statement ties cats to 'wild', so 'some cats are wild' **does not follow**.\n\n**Exam tip:** test the tricky conclusions by trying to draw a diagram that breaks them.",
      sourceIds: ["rs-aggarwal-reasoning"],
    },
  ],
  quiz: [
    q("Syllogism", "easy", "All pens are books. All books are red. Conclusion: All pens are red.", ["Follows", "Does not follow", "Cannot say", "Partially"], 0, "Pens  is a subset of  books  is a subset of  red, so all pens are red.", "rs-aggarwal-reasoning"),
    q("Syllogism", "medium", "All cats are animals. Some animals are wild. Conclusion: Some cats are wild.", ["Follows", "Does not follow", "Always true", "Definite"], 1, "Nothing ties cats specifically to 'wild', so it does not follow.", "rs-aggarwal-reasoning"),
    q("Syllogism", "medium", "Some books are pens. All pens are red. Conclusion: Some books are red.", ["Follows", "Does not follow", "Cannot say", "False"], 0, "The books that are pens are red, so some books are red - it follows.", "rs-aggarwal-reasoning"),
    q("Syllogism", "hard", "No dog is a cat. All cats are pets. Conclusion: No dog is a pet.", ["Follows", "Does not follow", "Always true", "Definite"], 1, "Dogs could still be pets through another route; it does not follow.", "rs-aggarwal-reasoning"),
    q("Syllogism", "medium", "All roses are flowers. Some flowers fade quickly. Conclusion: Some roses fade quickly.", ["Follows", "Does not follow", "Certain", "True"], 1, "The fading flowers need not include any rose, so it does not follow.", "rs-aggarwal-reasoning"),
  ],
}

const reasonClocksCalendars: Chapter = {
  id: "reason-clocks-calendars",
  title: "Clocks & Calendars",
  summary: "One angle formula for clocks, and odd-days plus leap-year rules for calendars.",
  lessons: [
    {
      id: "l-cc-1",
      title: "Clock angles",
      minutes: 5,
      body:
        "Each hand moves at a fixed speed:\n- **Minute hand:** 360 degrees / 60 min = **6 degrees per minute**.\n- **Hour hand:** 360 degrees / 12 h = 30 degrees per hour = **0.5 degrees per minute**.\n\n**Angle between the hands = |30H - 5.5M|**, where H is the hour and M the minutes. If it exceeds 180 degrees, subtract from 360 degrees.\n\n**Worked example:** at 3:00, angle = |30 x 3 - 5.5 x 0| = **90 degrees**. At 6:00, angle = |180 - 0| = **180 degrees**.\n\n**Useful fact:** the hands overlap **11 times every 12 hours** (not 12), because the minute hand laps the hour hand.",
      sourceIds: ["rs-aggarwal-reasoning"],
    },
    {
      id: "l-cc-2",
      title: "Calendars and leap years",
      minutes: 5,
      body:
        "Calendar problems run on **odd days** (days left over after counting complete weeks).\n- An ordinary year has **1 odd day**; a leap year has **2 odd days**.\n- The day of the week repeats every 7 days, so add odd days to step forward.\n\n**Leap-year rule:** a year is a leap year if divisible by 4, **except** century years, which must be divisible by **400**. So 2024 is a leap year; 1900 is **not** (divisible by 100 but not 400); 2000 **is**.\n\n**Exam tip:** for 'what day was it' questions, count the odd days between the known date and the target.",
      sourceIds: ["rs-aggarwal-reasoning"],
    },
  ],
  quiz: [
    q("Clocks", "easy", "The angle between the hour and minute hands at 3:00 is:", ["30 degrees", "45 degrees", "90 degrees", "120 degrees"], 2, "|30 x 3 - 5.5 x 0| = 90 degrees.", "rs-aggarwal-reasoning"),
    q("Clocks", "easy", "The angle between the hands at 6:00 is:", ["90 degrees", "180 degrees", "150 degrees", "120 degrees"], 1, "|30 x 6 - 0| = 180 degrees.", "rs-aggarwal-reasoning"),
    q("Clocks", "medium", "How many times do the clock's hands overlap in 12 hours?", ["10", "11", "12", "24"], 1, "They overlap 11 times in 12 hours.", "rs-aggarwal-reasoning"),
    q("Calendars", "easy", "Is the year 2024 a leap year?", ["Yes", "No", "Only in February", "Cannot say"], 0, "2024 is divisible by 4 and is not a century year, so it is a leap year.", "rs-aggarwal-reasoning"),
    q("Calendars", "medium", "Is the year 1900 a leap year?", ["Yes", "No", "Sometimes", "Cannot say"], 1, "1900 is a century year divisible by 100 but not by 400, so it is NOT a leap year.", "rs-aggarwal-reasoning"),
  ],
}

// ---- CODING ----
const codingTreesGraphs: Chapter = {
  id: "coding-trees-graphs",
  title: "Trees, Graphs & Traversals",
  summary: "BSTs, tree traversals, and BFS vs DFS - frequent interview territory.",
  lessons: [
    {
      id: "l-tg-1",
      title: "Trees and BSTs",
      minutes: 6,
      body:
        "A **tree** is a hierarchy: a root at the top, child nodes below, and leaves at the bottom. A **binary tree** allows at most **2 children** per node.\n\nA **Binary Search Tree (BST)** keeps left < node < right, so searching, inserting and deleting are **O(log n)** when the tree is balanced (height ~ log n).\n\n**Traversals:**\n- **In-order (Left, Node, Right)** of a BST gives values in **sorted order**.\n- **Pre-order (Node, Left, Right)** is used to copy a tree.\n- **Post-order (Left, Right, Node)** is used to delete a tree.\n\n**Exam tip:** 'in-order of a BST is sorted' is a classic one-line answer.",
      sourceIds: ["gfg-dsa"],
    },
    {
      id: "l-tg-2",
      title: "Graphs: BFS and DFS",
      minutes: 6,
      body:
        "A **graph** is nodes connected by edges; edges can be directed or undirected.\n\nTwo core traversals:\n- **BFS (Breadth-First Search)** explores level by level using a **queue**. In an unweighted graph it finds the **shortest path**.\n- **DFS (Depth-First Search)** goes as deep as possible first, using a **stack** (or recursion).\n\n**Worked intuition:** to find the fewest hops between two people in a friend network, use BFS.\n\n**Common mistake:** using DFS to find a shortest path in an unweighted graph - that is BFS's job.",
      sourceIds: ["gfg-dsa"],
    },
  ],
  quiz: [
    q("Trees", "medium", "In-order traversal of a Binary Search Tree visits values in:", ["reverse order", "sorted order", "random order", "level order"], 1, "In-order (Left, Node, Right) of a BST yields sorted values.", "gfg-dsa"),
    q("Graphs", "medium", "Breadth-First Search (BFS) uses which data structure?", ["Stack", "Queue", "Heap", "Tree"], 1, "BFS explores level by level using a queue.", "gfg-dsa"),
    q("Graphs", "medium", "Depth-First Search (DFS) is typically implemented with:", ["A queue", "A stack or recursion", "A sorted array", "A hash map"], 1, "DFS goes deep first, naturally using a stack or recursion.", "gfg-dsa"),
    q("Trees", "easy", "The maximum number of children a node can have in a binary tree is:", ["1", "2", "3", "Unlimited"], 1, "A binary tree allows at most 2 children per node.", "gfg-dsa"),
    q("Trees", "medium", "Search in a balanced Binary Search Tree takes:", ["O(n)", "O(log n)", "O(n^2)", "O(1)"], 1, "A balanced BST has height ~ log n, so search is O(log n).", "gfg-dsa"),
  ],
}

const codingDpGreedy: Chapter = {
  id: "coding-dp-greedy",
  title: "Recursion, DP & Greedy",
  summary: "Remember subproblems (DP) and make locally optimal choices (greedy).",
  lessons: [
    {
      id: "l-dp-1",
      title: "Dynamic programming = remember subproblems",
      minutes: 6,
      body:
        "**Dynamic programming (DP)** applies when a problem has **overlapping subproblems** (the same smaller problem is solved many times) and **optimal substructure** (the best overall answer is built from best sub-answers).\n\n**Memoization** stores each subproblem's result the first time, so you never recompute it.\n\n**Worked example:** naive recursive Fibonacci recomputes the same values and runs in **O(2ⁿ)**. Add memoization and it drops to **O(n)** because each Fib(k) is computed once.\n\n**Common mistake:** using DP where subproblems do not overlap - then plain recursion or a greedy approach is enough.",
      sourceIds: ["gfg-dsa"],
    },
    {
      id: "l-dp-2",
      title: "Greedy algorithms",
      minutes: 5,
      body:
        "A **greedy** algorithm makes the **locally optimal choice at each step**, hoping it leads to a global optimum. It is simple and fast, but only correct when local choices truly build the global best.\n\n**Where greedy works:** activity selection (pick the earliest-finishing task), making change with standard coin systems, Huffman coding.\n\n**Worked intuition:** to give change with the fewest standard coins, repeatedly take the largest coin that fits.\n\n**Common mistake:** assuming greedy always works. For some problems (like the 0/1 knapsack), greedy fails and you need DP.",
      sourceIds: ["gfg-dsa"],
    },
  ],
  quiz: [
    q("Dynamic Programming", "medium", "Dynamic programming is most useful when a problem has:", ["no repetition", "overlapping subproblems", "only sorted input", "random data"], 1, "DP shines with overlapping subproblems plus optimal substructure.", "gfg-dsa"),
    q("Recursion", "medium", "The time complexity of naive recursive Fibonacci is:", ["O(n)", "O(n^2)", "O(2ⁿ)", "O(log n)"], 2, "It recomputes values exponentially -> O(2ⁿ).", "gfg-dsa"),
    q("Dynamic Programming", "medium", "Adding memoization improves recursive Fibonacci to:", ["O(1)", "O(n)", "O(n^2)", "O(2ⁿ)"], 1, "Each Fib(k) is computed once -> O(n).", "gfg-dsa"),
    q("Greedy", "easy", "A greedy algorithm makes:", ["a random choice", "the locally optimal choice each step", "all choices at once", "no choice"], 1, "Greedy picks the best option available at each step.", "gfg-dsa"),
    q("Dynamic Programming", "medium", "Memoization stores subproblem results mainly to avoid:", ["using memory", "recomputation", "sorting", "recursion"], 1, "Storing results avoids recomputing the same subproblem.", "gfg-dsa"),
  ],
}

// ---- CS CORE ----
const csFundamentals: Chapter = {
  id: "cs-fundamentals",
  title: "Computer Fundamentals & Number Systems",
  summary: "Binary/decimal/hex, bits and bytes, and volatile vs non-volatile memory.",
  lessons: [
    {
      id: "l-cf-1",
      title: "Number systems",
      minutes: 5,
      body:
        "Computers count in **binary (base 2)** using only 0 and 1. We usually write **decimal (base 10)**, and programmers often use **hexadecimal (base 16)**.\n\n**Binary to decimal:** each digit is a power of 2. 101₂ = 1x4 + 0x2 + 1x1 = **5**. 1010₂ = 8 + 0 + 2 + 0 = **10**.\n\n**Decimal to binary:** repeatedly divide by 2 and read the remainders bottom-up.\n\n**Sizes:** 1 **byte** = 8 **bits**; 1 KB = 1024 bytes.\n\n**Exam tip:** memorise the powers of 2 up to 1024 - they make conversions instant.",
      sourceIds: ["gfg-cs-core"],
    },
    {
      id: "l-cf-2",
      title: "Memory and software",
      minutes: 5,
      body:
        "**Memory types:**\n- **RAM** is **volatile** - fast working memory whose contents vanish when power is lost.\n- **ROM / hard disk / SSD** are **non-volatile** - they keep data without power.\n\n**Software types:**\n- **System software** (the operating system, drivers) runs and manages the machine.\n- **Application software** (a browser, an editor) does user tasks.\n\n**Compiler vs interpreter:** a compiler translates the whole program to machine code once; an interpreter runs it line by line.\n\n**Common mistake:** calling RAM 'permanent' storage. It is temporary and volatile.",
      sourceIds: ["gfg-cs-core"],
    },
  ],
  quiz: [
    q("Number Systems", "easy", "The binary number 101 in decimal is:", ["4", "5", "6", "7"], 1, "1x4 + 0x2 + 1x1 = 5.", "gfg-cs-core"),
    q("Number Systems", "easy", "One byte equals how many bits?", ["4", "8", "16", "32"], 1, "1 byte = 8 bits.", "gfg-cs-core"),
    q("Memory", "easy", "RAM is best described as:", ["Permanent storage", "Volatile memory", "A hard disk", "A CPU"], 1, "RAM is volatile - its contents are lost when power is off.", "gfg-cs-core"),
    q("Number Systems", "medium", "The decimal number 10 in binary is:", ["1000", "1010", "1100", "1001"], 1, "10 = 8 + 2 = 1010 in binary.", "gfg-cs-core"),
    q("Software", "easy", "An operating system is an example of:", ["Application software", "System software", "Hardware", "A web browser"], 1, "The OS is system software that manages the machine.", "gfg-cs-core"),
  ],
}

const quantDataInterpretation: Chapter = {
  id: "quant-data-interpretation",
  title: "Data Interpretation & Tables",
  summary: "Read tables, charts and percentages quickly without losing the base value.",
  lessons: [
    {
      id: "l-di-1",
      title: "Read the table before calculating",
      minutes: 6,
      body:
        "Data Interpretation is not hard math; it is careful reading under time pressure. First identify **what each row and column means**, the unit, and whether values are absolute numbers, percentages or ratios.\n\n**Fast method:** circle the requested category, write the formula, then calculate. For percent change, the base is the old value: (new - old) / old x 100.\n\n**Worked example:** sales go from 200 to 250. Increase = 50 on base 200, so increase percent = 50/200 x 100 = **25%**.\n\n**Common mistake:** using the new value as the base for percent increase. The base is the original value.",
      sourceIds: ["rs-aggarwal-quant", "indiabix-aptitude"],
    },
    {
      id: "l-di-2",
      title: "Ratios inside charts",
      minutes: 6,
      body:
        "Many chart questions ask for a comparison, not a long calculation. Use ratios and fractions to avoid heavy arithmetic.\n\n**Share of total:** part / total x 100. If A sells 80 units out of a total 400, A's share is 80/400 x 100 = **20%**.\n\n**Average from a table:** add the required values only, then divide by the count. Do not include rows or columns the question did not ask for.\n\n**Exam tip:** before solving, underline whether the question asks for total, average, difference, ratio or percentage. That one word decides the method.",
      sourceIds: ["rs-aggarwal-quant", "indiabix-aptitude"],
    },
  ],
  quiz: [
    q("Data Interpretation", "easy", "Sales rise from 200 to 250. The percentage increase is:", ["20%", "25%", "30%", "50%"], 1, "Increase = 50 on the old base 200 -> 50/200 x 100 = 25%.", "rs-aggarwal-quant"),
    q("Data Interpretation", "easy", "A category has 80 units out of a total 400. Its share is:", ["10%", "15%", "20%", "25%"], 2, "Share = 80/400 x 100 = 20%.", "indiabix-aptitude"),
    q("Data Interpretation", "medium", "The values 12, 18, 24 and 30 have an average of:", ["20", "21", "22", "24"], 1, "Sum = 84 and count = 4, so average = 21.", "rs-aggarwal-quant"),
    q("Data Interpretation", "medium", "If total revenue is Rs 900 and product A contributes Rs 225, A's contribution is:", ["20%", "25%", "30%", "35%"], 1, "225/900 x 100 = 25%.", "indiabix-aptitude"),
    q("Data Interpretation", "hard", "A value falls from 500 to 400. The percentage decrease is:", ["10%", "20%", "25%", "40%"], 1, "Decrease = 100 on base 500 -> 100/500 x 100 = 20%.", "rs-aggarwal-quant"),
  ],
}

const reasonSeatingPuzzles: Chapter = {
  id: "reason-seating-puzzles",
  title: "Seating Arrangement & Puzzles",
  summary: "Turn wordy constraints into positions, slots and eliminations.",
  lessons: [
    {
      id: "l-seat-1",
      title: "Linear seating",
      minutes: 6,
      body:
        "For seating puzzles, draw slots first. If five people sit in a row, draw five boxes. Mark left and right clearly.\n\nUse fixed clues first: **A sits at an end**, **B is third from the left**, or **C sits immediately right of D**. Then add flexible clues.\n\n**Immediate right** means the next seat to the person's right; **somewhere right** means any later seat. Do not mix them.\n\n**Common mistake:** solving only in the head. Draw the boxes, place confirmed facts, and keep possible cases separate.",
      sourceIds: ["rs-aggarwal-reasoning"],
    },
    {
      id: "l-seat-2",
      title: "Puzzle casework",
      minutes: 6,
      body:
        "When a clue has two possible placements, split into Case 1 and Case 2. Continue each case until one contradicts a clue.\n\n**Useful signals:** 'not adjacent' eliminates neighbor seats; 'between' usually creates a block; 'exactly two people between' fixes a distance.\n\n**Worked intuition:** if exactly two people sit between A and B in five seats, possible pairs are (1,4), (2,5), (4,1), and (5,2).\n\n**Exam tip:** after finishing, re-check every clue against your final arrangement before selecting the option.",
      sourceIds: ["rs-aggarwal-reasoning"],
    },
  ],
  quiz: [
    q("Seating", "easy", "In a row, 'B sits immediately right of A' means:", ["B is anywhere right of A", "B is next to A on A's right", "A is next to B on B's right", "They are not adjacent"], 1, "Immediately right means the very next seat on the right.", "rs-aggarwal-reasoning"),
    q("Seating", "medium", "Five seats are numbered 1 to 5 from left. If A is third from the left, A is in seat:", ["2", "3", "4", "5"], 1, "Third from the left is seat 3.", "rs-aggarwal-reasoning"),
    q("Puzzles", "medium", "Exactly two people sit between A and B in five seats. Which pair is possible?", ["1 and 2", "1 and 4", "2 and 4", "3 and 5"], 1, "Seats 1 and 4 have exactly seats 2 and 3 between them.", "rs-aggarwal-reasoning"),
    q("Seating", "medium", "If A and B are not adjacent, they cannot be in seats:", ["1 and 3", "2 and 4", "3 and 5", "4 and 5"], 3, "Seats 4 and 5 are adjacent, so that violates the clue.", "rs-aggarwal-reasoning"),
    q("Puzzles", "hard", "The safest first step in a seating puzzle is to:", ["Guess an option", "Draw slots and place fixed clues", "Memorise all names", "Skip all negative clues"], 1, "Slots and fixed clues turn the word problem into a visible arrangement.", "rs-aggarwal-reasoning"),
  ],
}

const verbalWrittenEnglish: Chapter = {
  id: "verbal-written-english",
  title: "Essay, Email & Cloze Test",
  summary: "Written communication for Wipro-style tests and grammar-in-context questions.",
  lessons: [
    {
      id: "l-we-1",
      title: "Essay structure that scores",
      minutes: 6,
      body:
        "A placement essay should be clear, balanced and structured. Use four parts: **intro -> two body points -> counterpoint or example -> conclusion**.\n\nKeep sentences short. One paragraph should carry one idea. Avoid slang, extreme claims and memorised quotes that do not fit the topic.\n\n**Worked outline:** topic: online learning. Intro defines it; body 1 gives access benefits; body 2 explains self-discipline challenges; conclusion says blended learning is strongest.\n\n**Exam tip:** write a rough 4-line outline before the final answer. It prevents repetition.",
      sourceIds: ["high-agg-verbal", "studybench-curriculum"],
    },
    {
      id: "l-we-2",
      title: "Cloze tests and email tone",
      minutes: 6,
      body:
        "A **cloze test** asks you to fill blanks inside a passage. Read the full sentence, check grammar, then check meaning. The right word must fit both.\n\nFor professional email, use a clear subject, polite greeting, short request, and specific next step. Avoid slang and pressure words like 'ASAP' unless the context truly demands urgency.\n\n**Worked example:** 'She is interested ___ data analytics' takes **in**, because the fixed phrase is 'interested in'.\n\n**Common mistake:** choosing a word that sounds good alone but does not fit the passage tone.",
      sourceIds: ["high-agg-verbal", "studybench-curriculum"],
    },
  ],
  quiz: [
    q("Written English", "medium", "A strong placement essay should usually have:", ["Only one long paragraph", "Intro, body points and conclusion", "Only quotes", "Only bullet points"], 1, "A clear intro-body-conclusion structure is easiest to read and score.", "studybench-curriculum"),
    q("Email Writing", "easy", "A professional email subject should be:", ["Blank", "Clear and specific", "Only emojis", "Very vague"], 1, "A specific subject tells the reader the purpose before opening.", "studybench-curriculum"),
    q("Cloze Test", "medium", "'She is interested ___ data analytics.'", ["on", "in", "at", "with"], 1, "The fixed phrase is 'interested in'.", "high-agg-verbal"),
    q("Written English", "medium", "Before writing an essay, the best first step is to:", ["Start immediately without thinking", "Create a short outline", "Copy a memorised quote", "Use only complex words"], 1, "A quick outline prevents repetition and keeps the answer structured.", "studybench-curriculum"),
    q("Email Writing", "hard", "The best closing line for a recruiter follow-up email is:", ["Reply fast.", "I demand selection.", "Thank you for your time. I look forward to your response.", "No subject needed."], 2, "The line is polite, specific and professional.", "studybench-curriculum"),
  ],
}

const csCloudWeb: Chapter = {
  id: "cs-cloud-web-apis",
  title: "Cloud, Web & API Basics",
  summary: "Freshers increasingly get asked about APIs, HTTP, cloud models and deployment basics.",
  lessons: [
    {
      id: "l-cloud-1",
      title: "Cloud service models",
      minutes: 6,
      body:
        "Cloud models differ by how much you manage.\n\n**IaaS:** rented infrastructure; you manage OS and apps. **PaaS:** you deploy code; the platform manages servers. **SaaS:** you use a ready application.\n\n**Worked examples:** a virtual machine is IaaS, a managed app platform is PaaS, and a mail or CRM product is SaaS.\n\n**Exam tip:** if the user only logs in and uses software, it is usually SaaS.",
      sourceIds: ["gfg-cs-core", "accenture-careers"],
    },
    {
      id: "l-cloud-2",
      title: "APIs and deployment basics",
      minutes: 6,
      body:
        "An **API** is a contract between software systems. A frontend sends a request; the backend returns a response, often JSON.\n\n**GET** usually reads data. **POST** usually creates or submits data. **Status codes** explain the result: 200 success, 400 bad request, 401 unauthorized, 404 not found, 500 server error.\n\n**Deployment** means making the application available to users. A basic deployment flow is build, configure environment variables, release, then monitor errors.\n\n**Common mistake:** saying an API is only a URL. The method, request body, response shape and status codes are part of the contract too.",
      sourceIds: ["gfg-cs-core", "mdn-http"],
    },
  ],
  quiz: [
    q("Cloud", "easy", "Which cloud model gives users a ready-to-use application?", ["IaaS", "PaaS", "SaaS", "LAN"], 2, "SaaS means Software as a Service - users consume the application directly.", "gfg-cs-core"),
    q("Web", "easy", "A common format for API responses is:", ["JSON", "DVD", "BIOS", "PNG only"], 0, "JSON is commonly used for structured API responses.", "gfg-cs-core"),
    q("HTTP", "medium", "HTTP status code 404 means:", ["Success", "Unauthorized", "Not found", "Server error"], 2, "404 means the requested resource was not found.", "mdn-http"),
    q("HTTP", "medium", "GET is usually used to:", ["Read data", "Delete every record", "Format a disk", "Compile code"], 0, "GET commonly retrieves data from a server.", "mdn-http"),
    q("Cloud", "medium", "In PaaS, the platform mainly manages:", ["Only your resume", "Server/runtime infrastructure", "Your keyboard", "Nothing"], 1, "PaaS lets developers deploy code while the platform handles much of the runtime infrastructure.", "gfg-cs-core"),
  ],
}

const csSecurityBasics: Chapter = {
  id: "cs-security-basics",
  title: "Cybersecurity & Access Control",
  summary: "Authentication, authorization, encryption, hashing and common web-security risks.",
  lessons: [
    {
      id: "l-sec-1",
      title: "Authentication vs authorization",
      minutes: 6,
      body:
        "**Authentication** verifies who a user is. **Authorization** decides what that verified user can access.\n\n**Worked example:** logging in with email and password authenticates you. Being allowed to open the admin dashboard is authorization.\n\n**Passwords should be hashed**, not stored as plain text. Hashing is one-way; encryption is reversible with a key.\n\n**Exam tip:** if the question asks 'who are you?', think authentication. If it asks 'what can you access?', think authorization.",
      sourceIds: ["gfg-cs-core", "studybench-curriculum"],
    },
    {
      id: "l-sec-2",
      title: "Web security signals",
      minutes: 6,
      body:
        "Freshers are often asked the basics of safe web applications.\n\n**HTTPS** protects data in transit. **Input validation** rejects malformed or unsafe data. **Least privilege** means users and services get only the permissions they need.\n\n**Common risks:** SQL injection (unsafe query building), XSS (untrusted script in a page), weak passwords, and exposed secrets.\n\n**Placement tip:** in interviews, connect security to user trust: a small bug can leak data or break access control.",
      sourceIds: ["gfg-cs-core", "mdn-http"],
    },
  ],
  quiz: [
    q("Security", "easy", "Authentication mainly verifies:", ["Identity", "Table size", "CPU speed", "Screen width"], 0, "Authentication proves who the user is.", "gfg-cs-core"),
    q("Security", "medium", "Authorization mainly decides:", ["Who the user is", "What the user can access", "Which browser is used", "How fast DNS works"], 1, "Authorization controls permissions after identity is verified.", "gfg-cs-core"),
    q("Security", "medium", "Passwords should usually be stored as:", ["Plain text", "Hashed values", "Screenshots", "Comments"], 1, "Passwords should be stored using strong one-way hashing.", "gfg-cs-core"),
    q("Security", "hard", "The principle of least privilege means:", ["Give all access to everyone", "Give only necessary access", "Disable all accounts", "Avoid authentication"], 1, "Least privilege reduces risk by granting only required permissions.", "studybench-curriculum"),
    q("Security", "medium", "SQL injection is mainly caused by:", ["Unsafe query construction", "Too much RAM", "A sorted array", "A slow monitor"], 0, "Unsafe query construction can let attacker input change the query.", "gfg-cs-core"),
  ],
}

const csAiDataBasics: Chapter = {
  id: "cs-ai-data-basics",
  title: "AI, Data & Analytics Basics",
  summary: "Data cleaning, metrics, model basics and analytics terms now common in fresher roles.",
  lessons: [
    {
      id: "l-ai-1",
      title: "Data pipeline basics",
      minutes: 6,
      body:
        "A simple data pipeline has four steps: **collect -> clean -> transform -> analyse/report**.\n\nBad data creates bad decisions. Cleaning handles missing values, duplicates, wrong formats and outliers.\n\n**Worked example:** if a salary column contains 'five lakh' and '500000', cleaning converts them into one consistent numeric format.\n\n**Exam tip:** analytics questions reward clarity: name the input, transformation and output.",
      sourceIds: ["studybench-curriculum", "gfg-cs-core"],
    },
    {
      id: "l-ai-2",
      title: "Machine learning vocabulary",
      minutes: 6,
      body:
        "**Training data** teaches a model patterns. **Features** are input variables. **Labels** are known answers used in supervised learning.\n\n**Overfitting** happens when a model memorizes training data but performs poorly on new data. **Accuracy** is useful, but for imbalanced data you may also need precision and recall.\n\n**Placement tip:** do not oversell AI knowledge. A clean fresher answer is: data quality, model choice, evaluation and real-world constraints all matter.",
      sourceIds: ["studybench-curriculum", "gfg-cs-core"],
    },
  ],
  quiz: [
    q("Data", "easy", "The first step in most data pipelines is:", ["Collect data", "Delete all data", "Deploy UI", "Compile CSS"], 0, "A pipeline begins by collecting or receiving data.", "studybench-curriculum"),
    q("Data", "medium", "Removing duplicates and fixing formats is part of:", ["Data cleaning", "Encryption only", "Routing", "Thread scheduling"], 0, "Data cleaning improves consistency and reliability.", "studybench-curriculum"),
    q("AI Basics", "medium", "In supervised learning, labels are:", ["Known answers", "Network ports", "SQL joins", "CSS classes"], 0, "Labels are the known outputs used for training.", "studybench-curriculum"),
    q("AI Basics", "hard", "Overfitting means the model:", ["Learns general patterns only", "Memorizes training data and fails on new data", "Uses no data", "Cannot be evaluated"], 1, "Overfitting gives poor generalization to unseen data.", "studybench-curriculum"),
    q("Analytics", "medium", "For imbalanced data, accuracy alone can be misleading because:", ["It ignores class distribution issues", "It is always zero", "It measures RAM", "It sorts rows"], 0, "A high accuracy can hide poor performance on a minority class.", "studybench-curriculum"),
  ],
}

const csTestingSdlc: Chapter = {
  id: "cs-testing-sdlc",
  title: "Software Testing & SDLC",
  summary: "Testing types, bug reports, SDLC phases and quality habits expected from freshers.",
  lessons: [
    {
      id: "l-test-1",
      title: "Testing levels",
      minutes: 6,
      body:
        "**Unit testing** checks a small function or module. **Integration testing** checks modules working together. **System testing** checks the whole application. **User acceptance testing** checks whether it meets user needs.\n\n**Regression testing** ensures a new change did not break old behavior.\n\n**Worked example:** testing a login validation function is unit testing; checking login plus dashboard redirect is integration testing.\n\n**Exam tip:** name the scope of the test: function, modules, whole system or user acceptance.",
      sourceIds: ["studybench-curriculum", "gfg-cs-core"],
    },
    {
      id: "l-test-2",
      title: "SDLC and bug reports",
      minutes: 6,
      body:
        "A common SDLC flow is **requirements -> design -> implementation -> testing -> deployment -> maintenance**.\n\nA useful bug report includes: title, environment, steps to reproduce, expected result, actual result and evidence.\n\n**Placement tip:** companies value freshers who can communicate bugs clearly. 'It is not working' is weak; 'Login fails with 401 after password reset on Chrome' is useful.",
      sourceIds: ["studybench-curriculum"],
    },
  ],
  quiz: [
    q("Testing", "easy", "Testing a single function is usually:", ["Unit testing", "System testing", "UAT", "Deployment"], 0, "Unit testing checks small units of code.", "studybench-curriculum"),
    q("Testing", "medium", "Regression testing checks whether:", ["Old features still work after changes", "RAM is volatile", "DNS resolves names", "A table has a primary key"], 0, "Regression testing catches breaks introduced by new changes.", "studybench-curriculum"),
    q("SDLC", "easy", "A common SDLC phase after implementation is:", ["Testing", "Deleting requirements", "Ignoring users", "Buying hardware only"], 0, "Testing typically follows implementation.", "studybench-curriculum"),
    q("Testing", "medium", "A good bug report should include:", ["Steps to reproduce", "Only anger", "No expected result", "No environment"], 0, "Steps to reproduce make the bug actionable.", "studybench-curriculum"),
    q("Testing", "hard", "Testing two modules working together is:", ["Integration testing", "Unit testing only", "Syntax checking", "Authentication"], 0, "Integration testing checks interactions between modules.", "studybench-curriculum"),
  ],
}

const csDevopsBasics: Chapter = {
  id: "cs-devops-basics",
  title: "Git, Deployment & DevOps Basics",
  summary: "Version control, CI/CD, environment variables and deployment vocabulary.",
  lessons: [
    {
      id: "l-devops-1",
      title: "Git and collaboration",
      minutes: 6,
      body:
        "**Git** tracks code history. A **commit** records a snapshot. A **branch** lets you work separately. A **merge** combines changes.\n\n**Pull requests** are used to review code before merging. They reduce bugs and help teams discuss trade-offs.\n\n**Common mistake:** saying GitHub and Git are the same. Git is the version-control tool; GitHub hosts repositories and collaboration features.",
      sourceIds: ["studybench-curriculum", "gfg-cs-core"],
    },
    {
      id: "l-devops-2",
      title: "CI/CD and environments",
      minutes: 6,
      body:
        "**CI** runs checks automatically when code changes. **CD** automates release/deployment.\n\n**Environment variables** store configuration like API URLs and secrets outside the code. Never hardcode secrets into a public repository.\n\n**Deployment flow:** build the app, run checks, configure environment, release, monitor logs.\n\n**Placement tip:** even freshers should understand that shipping code includes testing, deployment and monitoring, not only writing functions.",
      sourceIds: ["studybench-curriculum"],
    },
  ],
  quiz: [
    q("Git", "easy", "A Git commit is:", ["A recorded code snapshot", "A database key", "A network cable", "A CSS color"], 0, "A commit records a snapshot of changes.", "studybench-curriculum"),
    q("Git", "medium", "A branch is useful because it:", ["Lets work happen separately", "Deletes all files", "Stops testing", "Changes CPU speed"], 0, "Branches isolate work until it is ready to merge.", "studybench-curriculum"),
    q("DevOps", "medium", "CI commonly means:", ["Continuous Integration", "Computer Internet", "Code Ignore", "Cloud Image"], 0, "CI automates checks during integration.", "studybench-curriculum"),
    q("DevOps", "hard", "Secrets should usually be stored in:", ["Environment variables or secret managers", "Public source code", "Comments", "Screenshots"], 0, "Secrets should not be hardcoded into public code.", "studybench-curriculum"),
    q("DevOps", "medium", "Monitoring after deployment mainly helps teams:", ["Detect errors and performance issues", "Avoid users", "Remove all logs", "Skip testing"], 0, "Monitoring shows whether the released app is healthy.", "studybench-curriculum"),
  ],
}

const csSystemDesignBasics: Chapter = {
  id: "cs-system-design-basics",
  title: "System Design for Freshers",
  summary: "Requirements, APIs, databases, caching and scaling vocabulary for project discussions.",
  lessons: [
    {
      id: "l-sd-1",
      title: "Think in components",
      minutes: 6,
      body:
        "A basic system design answer starts with **requirements**: what users need, scale, data and constraints.\n\nThen describe components: frontend, backend/API, database, authentication, storage and notifications if needed.\n\n**Worked example:** a placement-prep app needs users, progress tracking, question bank, quiz results and analytics. That suggests user auth, content tables, progress records and scoring logic.\n\n**Exam tip:** do not jump into technology names first. Clarify requirements first.",
      sourceIds: ["studybench-curriculum", "gfg-cs-core"],
    },
    {
      id: "l-sd-2",
      title: "Scaling vocabulary",
      minutes: 6,
      body:
        "**Caching** stores frequently used data for faster access. **Load balancing** distributes traffic across servers. **Database indexing** speeds lookups but costs write overhead and storage.\n\nFor freshers, interviewers usually expect concepts, not enterprise architecture. Explain trade-offs simply.\n\n**Common mistake:** saying every problem needs microservices. Many fresher projects are better explained as a clean monolith with good database design.",
      sourceIds: ["studybench-curriculum", "gfg-cs-core"],
    },
  ],
  quiz: [
    q("System Design", "easy", "The first step in system design should be:", ["Clarify requirements", "Pick random tech", "Ignore users", "Write CSS"], 0, "Requirements define what the system must solve.", "studybench-curriculum"),
    q("System Design", "medium", "Caching mainly improves:", ["Repeated data access speed", "Grammar accuracy", "Keyboard layout", "CGPA"], 0, "Caching stores frequently accessed data closer/faster.", "gfg-cs-core"),
    q("System Design", "medium", "A load balancer distributes:", ["Traffic across servers", "Marks across students", "Rows into columns", "Passwords publicly"], 0, "Load balancing spreads requests across available servers.", "gfg-cs-core"),
    q("DBMS", "hard", "Database indexes speed reads but can slow:", ["Writes", "The monitor", "All authentication", "HTML rendering only"], 0, "Indexes must be updated during writes, so they add write overhead.", "gfg-cs-core"),
    q("System Design", "medium", "For many fresher projects, a clean monolith is:", ["Often acceptable", "Always illegal", "Not software", "The same as DNS"], 0, "A clear monolith can be suitable before scale requires more complexity.", "studybench-curriculum"),
  ],
}

/** Extra chapters appended to every track to broaden real placement coverage. */
const EXTRA_CHAPTERS: Partial<Record<SectionId, Chapter[]>> = {
  quant: [quantTimeWork, quantAveragesAges, quantPermutations, quantDataInterpretation],
  reasoning: [reasonSyllogism, reasonClocksCalendars, reasonSeatingPuzzles],
  verbal: [verbalWrittenEnglish],
  coding: [codingTreesGraphs, codingDpGreedy],
  "cs-core": [
    csFundamentals,
    csCloudWeb,
    csSecurityBasics,
    csAiDataBasics,
    csTestingSdlc,
    csDevopsBasics,
    csSystemDesignBasics,
  ],
}

const CHAPTER_QUIZ_TARGET = 150
export const CHAPTER_PRACTICE_TARGET = 400

function stableSeed(input: string): number {
  let hash = 2166136261
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash)
}

function communicationSupplements(
  companyId: CompanyId,
  chapter: Chapter,
  count: number,
): Question[] {
  const templates = [
    {
      topic: "Interview Structure",
      prompt: `For "${chapter.title}", which answer structure is strongest in an interview?`,
      options: ["Memorise a long script", "Use a clear point, evidence and closing line", "Avoid examples", "Speak until interrupted"],
      explanation: "Strong interview answers are structured, specific and concise: point, evidence, and a closing link to the role.",
    },
    {
      topic: "Communication",
      prompt: `While practising "${chapter.title}", what should you prioritise first?`,
      options: ["Fast speaking", "Clarity and relevant examples", "A fake accent", "Technical jargon only"],
      explanation: "Recruiters reward clarity, relevance and evidence more than speed or jargon.",
    },
    {
      topic: "HR Readiness",
      prompt: `Which response is safest for a behavioural question in "${chapter.title}"?`,
      options: ["A generic claim", "A short STAR example", "Blaming teammates", "Changing the topic"],
      explanation: "STAR keeps behavioural answers grounded: situation, task, action and result.",
    },
    {
      topic: "Project Explanation",
      prompt: `When explaining a project during "${chapter.title}", what should you include?`,
      options: ["Only the tech stack", "Problem, your role, challenge and result", "Only team achievements", "Only screenshots"],
      explanation: "A good project answer makes your ownership visible: problem, role, challenge, result and learning.",
    },
  ]

  return Array.from({ length: count }, (_, i) => {
    const t = templates[i % templates.length]
    return {
      id: `supp-${companyId}-${chapter.id}-${i + 1}`,
      topic: t.topic,
      difficulty: i % 3 === 2 ? "medium" : "easy",
      prompt: `${getCompany(companyId).short} ${chapter.title} practice ${i + 1}: ${t.prompt}`,
      options: t.options,
      answer: 1,
      explanation: `${t.explanation} This practice item is aligned to ${getCompany(companyId).short}.`,
      sourceId: "studybench-curriculum",
    }
  })
}

const GENERAL_SECTION_SOURCE: Record<SectionId, string> = {
  quant: "rs-aggarwal-quant",
  reasoning: "rs-aggarwal-reasoning",
  verbal: "high-agg-verbal",
  coding: "gfg-dsa",
  "cs-core": "gfg-cs-core",
  "comm-interview": "studybench-curriculum",
}

const SECTION_BOOSTER_COPY: Record<SectionId, { hard: string; revise: string; mock: string }> = {
  quant: {
    hard:
      "For hard aptitude questions, first identify the base value and formula, then estimate the answer before doing exact arithmetic. If the calculation is long, use options to eliminate impossible values.",
    revise:
      "Build a one-page sheet with formulas, shortcut fractions, unit conversions and your top mistakes. Revise it before every mock so recall becomes automatic under time pressure.",
    mock:
      "In mocks, do not spend more than 90 seconds on a stuck quant question. Mark it mentally, move on, and return only if the section timer leaves room.",
  },
  reasoning: {
    hard:
      "For hard reasoning, convert words into diagrams: slots, circles, arrows, tables or cases. A messy diagram is still better than solving a puzzle only in your head.",
    revise:
      "Your revision sheet should contain common clue translations: immediately right, somewhere right, all/some/no, exactly two between, clockwise and anticlockwise.",
    mock:
      "In mocks, solve fixed-clue puzzles first and leave case-heavy puzzles for later. Reasoning rewards clean setup more than speed guessing.",
  },
  verbal: {
    hard:
      "For hard verbal questions, check grammar and meaning together. In RC, select only what the passage supports; avoid answers that are true in real life but not stated or implied.",
    revise:
      "Keep a revision sheet of agreement rules, fixed prepositions, confusable words, tone words and RC traps. Re-read wrong explanations instead of memorising word lists.",
    mock:
      "In verbal mocks, answer direct grammar first, then RC. Do not reread the entire passage for every question; scan back to the relevant line.",
  },
  coding: {
    hard:
      "For hard coding, state inputs, constraints, brute force, optimized idea, edge cases and complexity before writing code. Hidden tests usually target edge cases, not the sample path.",
    revise:
      "Keep a revision sheet of patterns: hashing, two pointers, sliding window, prefix sums, stack, queue, BFS, DFS and recursion base cases.",
    mock:
      "In coding mocks, solve for correctness first, then optimize. Test empty input, one item, duplicates, negatives and large values before submission.",
  },
  "cs-core": {
    hard:
      "For hard CS-core questions, answer with definition, example and trade-off. Recruiters want proof that you understand the concept beyond a keyword.",
    revise:
      "Create flash notes for DBMS, OS, CN, OOP, SQL, web, cloud, security and testing. Each note should have one example and one common trap.",
    mock:
      "In technical mocks, do not over-explain the first concept. Give a crisp answer, then add a practical example if the interviewer asks deeper.",
  },
  "comm-interview": {
    hard:
      "For hard communication questions, stay specific and evidence-based. Use STAR for behavioural answers and avoid blaming teammates or giving memorised slogans.",
    revise:
      "Keep a sheet with self-intro points, project highlights, strengths, weakness-improvement example, GD openers and closing questions for the interviewer.",
    mock:
      "In interview mocks, record yourself once. Check clarity, filler words, answer length and whether each answer has one concrete example.",
  },
}

function enrichChapterForPlacement(sectionId: SectionId, chapter: Chapter): Chapter {
  if (chapter.lessons.some((lesson) => lesson.id === `boost-${chapter.id}-hard`)) return chapter

  const copy = SECTION_BOOSTER_COPY[sectionId]
  const sourceId = GENERAL_SECTION_SOURCE[sectionId]
  const boosterLessons: Lesson[] = [
    {
      id: `boost-${chapter.id}-hard`,
      title: `Hard-question playbook for ${chapter.title}`,
      minutes: 4,
      body:
        `${copy.hard}\n\n**Why recruiters test this:** hard questions measure whether you can slow down, structure the problem and avoid panic, not only whether you remember a formula.`,
      sourceIds: [sourceId],
    },
    {
      id: `boost-${chapter.id}-revision`,
      title: `Revision sheet for ${chapter.title}`,
      minutes: 4,
      body:
        `${copy.revise}\n\n**Fast revision loop:** before a mock, revise formulas or rules for 5 minutes, solve 5 mixed questions, then review only mistakes.`,
      sourceIds: [sourceId],
    },
    {
      id: `boost-${chapter.id}-mock-transfer`,
      title: `Mock-test transfer for ${chapter.title}`,
      minutes: 4,
      body:
        `${copy.mock}\n\n**Practice like a topper:** after every mock, write one line for why each wrong answer happened: concept gap, calculation error, misread question or time pressure.`,
      sourceIds: [sourceId],
    },
  ]

  const boosterQuiz: Question[] = [
    {
      id: `boost-q-${chapter.id}-hard`,
      topic: `${chapter.title} Strategy`,
      difficulty: "hard",
      prompt: `While solving a hard ${chapter.title} question, what should you do first?`,
      options: [
        "Identify the question type, constraints and safest method",
        "Guess the longest option",
        "Ignore all edge cases",
        "Skip the explanation after solving",
      ],
      answer: 0,
      explanation: "Hard questions become manageable when you classify the type, constraints and method before calculating or coding.",
      sourceId,
    },
    {
      id: `boost-q-${chapter.id}-revision`,
      topic: `${chapter.title} Revision`,
      difficulty: "medium",
      prompt: `What belongs in a useful ${chapter.title} revision sheet?`,
      options: [
        "Key rules, formulas, traps and personal mistakes",
        "Only motivational quotes",
        "Only solved questions with no notes",
        "Random topics from other sections",
      ],
      answer: 0,
      explanation: "A good revision sheet compresses rules, formulas, traps and mistakes so recall is fast before mocks.",
      sourceId,
    },
    {
      id: `boost-q-${chapter.id}-mock`,
      topic: `${chapter.title} Mock Strategy`,
      difficulty: "medium",
      prompt: `After a mock mistake in ${chapter.title}, the best review action is to:`,
      options: [
        "Label the cause and redo a similar question",
        "Forget it immediately",
        "Blame the timer only",
        "Memorise the option letter",
      ],
      answer: 0,
      explanation: "Mistake review works when you identify the cause and practise a related question to close the gap.",
      sourceId,
    },
  ]

  return {
    ...chapter,
    lessons: [...chapter.lessons, ...boosterLessons],
    quiz: [...chapter.quiz, ...boosterQuiz],
  }
}

function enrichGeneralChapter(chapter: Chapter): Chapter {
  return {
    ...chapter,
    summary: `${chapter.summary} Includes examples, shortcuts and 100 practice questions.`,
  }
}

function fallbackCompanyQuestion(
  companyId: CompanyId,
  sectionId: SectionId,
  chapter: Chapter,
  index: number,
  difficulty: Question["difficulty"] = "medium",
): Question {
  const company = getCompany(companyId).short
  const sourceId = GENERAL_SECTION_SOURCE[sectionId] ?? "studybench-curriculum"
  const sectionTemplates: Record<SectionId, Omit<Question, "id" | "sourceId">[]> = {
    quant: [
      {
        topic: "Quant Review",
        difficulty,
        prompt: `${company} ${chapter.title} ${difficulty} quantitative review ${index + 1}: what is the safest first step in a calculation question?`,
        options: ["Write the formula and identify the base", "Guess from the largest option", "Skip unit conversion", "Use all options equally"],
        answer: 0,
        explanation: "A correct formula and base prevent most aptitude mistakes, especially in percentages, ratios, speed and work problems.",
      },
    ],
    reasoning: [
      {
        topic: "Reasoning Review",
        difficulty,
        prompt: `${company} ${chapter.title} ${difficulty} reasoning review ${index + 1}: what should you do before answering a pattern question?`,
        options: ["List the rule or draw the relation", "Pick the middle option", "Ignore alternate terms", "Avoid checking the sequence"],
        answer: 0,
        explanation: "Writing the rule, gap, relation or diagram makes the pattern visible and reduces guessing.",
      },
    ],
    verbal: [
      {
        topic: "Verbal Review",
        difficulty,
        prompt: `${company} ${chapter.title} ${difficulty} verbal review ${index + 1}: what improves accuracy in grammar and comprehension questions?`,
        options: ["Read the complete sentence and context", "Choose the shortest option", "Ignore tense and subject", "Answer before reading"],
        answer: 0,
        explanation: "Grammar and comprehension depend on context, subject-verb agreement, tense and the intended meaning.",
      },
    ],
    coding: [
      {
        topic: "Coding Review",
        difficulty,
        prompt: `${company} ${chapter.title} ${difficulty} coding review ${index + 1}: what should you state before writing code?`,
        options: ["Inputs, constraints, edge cases and complexity", "Only the final answer", "Only the language name", "Nothing until the code is complete"],
        answer: 0,
        explanation: "Interviewers and coding rounds reward a clear approach: inputs, constraints, edge cases, algorithm and complexity.",
      },
    ],
    "cs-core": [
      {
        topic: "CS Core Review",
        difficulty,
        prompt: `${company} ${chapter.title} ${difficulty} CS-core review ${index + 1}: what makes a technical answer stronger?`,
        options: ["Definition plus practical example", "Only a memorized keyword", "A vague one-word answer", "Changing the topic"],
        answer: 0,
        explanation: "A definition plus a practical example proves you understand the concept beyond memorization.",
      },
    ],
    "comm-interview": [
      {
        topic: "Interview Review",
        difficulty,
        prompt: `${company} ${chapter.title} ${difficulty} interview review ${index + 1}: what is the best structure for a behavioural answer?`,
        options: ["Situation, task, action and result", "A long memorized speech", "Only blaming others", "No example"],
        answer: 0,
        explanation: "STAR keeps behavioural answers concise, truthful and evidence-based.",
      },
    ],
  }
  const template = sectionTemplates[sectionId][0]
  return {
    ...template,
    id: `supp-${companyId}-${chapter.id}-fallback-${index + 1}`,
    sourceId,
  }
}

function generatedSupplements(
  companyId: CompanyId,
  sectionId: SectionId,
  chapter: Chapter,
  count: number,
): Question[] {
  const seed = stableSeed(`${companyId}:${sectionId}:${chapter.id}`)
  const company = getCompany(companyId)
  const candidates = generateDrills(sectionId, count * 5, seed)
  const used = new Set(chapter.quiz.map((question) => question.prompt.trim().toLowerCase()))
  const out: Question[] = []

  for (const question of candidates) {
    const scopedPrompt = `${company.short} ${chapter.title} pattern practice: ${question.prompt}`
    const key = scopedPrompt.trim().toLowerCase()
    if (used.has(key)) continue
    used.add(key)
    out.push({
      ...question,
      id: `supp-${companyId}-${chapter.id}-${out.length + 1}`,
      prompt: scopedPrompt,
      explanation: `${question.explanation} This item is aligned to the ${company.short} track's expected topic mix.`,
    })
    if (out.length === count) break
  }

  while (out.length < count) {
    const fallback = fallbackCompanyQuestion(companyId, sectionId, chapter, out.length)
    const key = fallback.prompt.trim().toLowerCase()
    if (!used.has(key)) {
      used.add(key)
      out.push(fallback)
    }
  }

  return out
}

function ensureUniqueChapterQuiz(
  companyId: CompanyId,
  sectionId: SectionId,
  chapter: Chapter,
  quiz: Question[],
): Question[] {
  const usedPrompts = new Set<string>()
  const usedIds = new Set<string>()
  return quiz.map((question, index) => {
    const promptKey = question.prompt.trim().toLowerCase()
    const idKey = question.id.trim().toLowerCase()
    if (!usedPrompts.has(promptKey) && !usedIds.has(idKey)) {
      usedPrompts.add(promptKey)
      usedIds.add(idKey)
      return question
    }

    let replacement = fallbackCompanyQuestion(companyId, sectionId, chapter, index + 1000)
    let guard = 0
    while (
      (usedPrompts.has(replacement.prompt.trim().toLowerCase()) ||
        usedIds.has(replacement.id.trim().toLowerCase())) &&
      guard < 100
    ) {
      replacement = fallbackCompanyQuestion(companyId, sectionId, chapter, index + 1000 + guard)
      guard += 1
    }
    usedPrompts.add(replacement.prompt.trim().toLowerCase())
    usedIds.add(replacement.id.trim().toLowerCase())
    return replacement
  })
}

function ensureDifficultyCoverage(
  companyId: CompanyId,
  sectionId: SectionId,
  chapter: Chapter,
  quiz: Question[],
): Question[] {
  const requiredPerDifficulty = chapter.lessons.length
  const difficulties: Question["difficulty"][] = ["easy", "medium", "hard"]
  const next = [...quiz]
  const counts = () =>
    difficulties.reduce(
      (acc, difficulty) => ({
        ...acc,
        [difficulty]: next.filter((question) => question.difficulty === difficulty).length,
      }),
      {} as Record<Question["difficulty"], number>,
    )
  const usedPrompts = new Set(next.map((question) => question.prompt.trim().toLowerCase()))
  const usedIds = new Set(next.map((question) => question.id.trim().toLowerCase()))

  for (const difficulty of difficulties) {
    let currentCounts = counts()
    while (currentCounts[difficulty] < requiredPerDifficulty) {
      const replacementIndex = next.findIndex(
        (question) =>
          question.difficulty !== difficulty &&
          currentCounts[question.difficulty] > requiredPerDifficulty,
      )
      if (replacementIndex === -1) break

      let replacement = fallbackCompanyQuestion(
        companyId,
        sectionId,
        chapter,
        3000 + replacementIndex + currentCounts[difficulty],
        difficulty,
      )
      let guard = 0
      while (
        (usedPrompts.has(replacement.prompt.trim().toLowerCase()) ||
          usedIds.has(replacement.id.trim().toLowerCase())) &&
        guard < 100
      ) {
        replacement = fallbackCompanyQuestion(
          companyId,
          sectionId,
          chapter,
          3100 + replacementIndex + guard,
          difficulty,
        )
        guard += 1
      }

      usedPrompts.delete(next[replacementIndex].prompt.trim().toLowerCase())
      usedIds.delete(next[replacementIndex].id.trim().toLowerCase())
      next[replacementIndex] = replacement
      usedPrompts.add(replacement.prompt.trim().toLowerCase())
      usedIds.add(replacement.id.trim().toLowerCase())
      currentCounts = counts()
    }
  }

  return next
}

function expandChapterQuiz(companyId: CompanyId, sectionId: SectionId, chapter: Chapter): Chapter {
  const target = CHAPTER_QUIZ_TARGET
  const missing = Math.max(0, target - chapter.quiz.length)
  if (missing === 0) {
    return {
      ...chapter,
      quiz: ensureDifficultyCoverage(
        companyId,
        sectionId,
        chapter,
        ensureUniqueChapterQuiz(companyId, sectionId, chapter, chapter.quiz),
      ),
    }
  }

  const generated =
    sectionId === "comm-interview"
      ? communicationSupplements(companyId, chapter, missing)
      : generatedSupplements(companyId, sectionId, chapter, missing)

  const quiz = ensureDifficultyCoverage(
    companyId,
    sectionId,
    chapter,
    ensureUniqueChapterQuiz(companyId, sectionId, chapter, [...chapter.quiz, ...generated]),
  )
  return { ...chapter, quiz }
}

function withExtras(sections: Section[]): Section[] {
  return sections.map((s) => {
    const extra = EXTRA_CHAPTERS[s.id]
    return extra ? { ...s, chapters: [...s.chapters, ...extra] } : s
  })
}

const sectionCache = new Map<CompanyId, Section[]>()

/** Returns the section list (with chapters) for a company track. */
export function getSections(companyId: CompanyId): Section[] {
  const cached = sectionCache.get(companyId)
  if (cached) return cached

  const base = withExtras(BASE_SECTIONS)
  const companySections =
    companyId === "zoho"
      ? base.map((s) =>
          s.id === "coding" ? { ...s, chapters: [...s.chapters, ZOHO_EXTRA] } : s,
        )
      : base

  const sections = companySections.map((section) => ({
    ...section,
    chapters: section.chapters.map((chapter) => {
      const baseChapter = companyId === "general" ? enrichGeneralChapter(chapter) : chapter
      return expandChapterQuiz(companyId, section.id, enrichChapterForPlacement(section.id, baseChapter))
    }),
  }))
  sectionCache.set(companyId, sections)
  return sections
}

export function getSection(companyId: CompanyId, sectionId: SectionId): Section | undefined {
  return getSections(companyId).find((s) => s.id === sectionId)
}

export function getChapter(companyId: CompanyId, sectionId: SectionId, chapterId: string) {
  return getSection(companyId, sectionId)?.chapters.find((c) => c.id === chapterId)
}

export function chapterPracticeQuestions(
  companyId: CompanyId,
  sectionId: SectionId,
  chapterId: string,
): Question[] {
  const chapter = getChapter(companyId, sectionId, chapterId)
  if (!chapter) return []

  const usedPrompts = new Set<string>()
  const usedIds = new Set<string>()
  const out: Question[] = []

  function add(question: Question) {
    const promptKey = question.prompt.trim().toLowerCase()
    const idKey = question.id.trim().toLowerCase()
    if (usedPrompts.has(promptKey) || usedIds.has(idKey)) return
    usedPrompts.add(promptKey)
    usedIds.add(idKey)
    out.push(question)
  }

  for (const question of chapter.quiz) {
    add({
      ...question,
      id: `chapter-practice-${companyId}-${chapter.id}-${out.length}`,
    })
  }

  const missing = Math.max(0, CHAPTER_PRACTICE_TARGET - out.length)
  const generated =
    sectionId === "comm-interview"
      ? communicationSupplements(companyId, chapter, missing)
      : generateDrills(sectionId, missing, stableSeed(`${companyId}:${sectionId}:${chapterId}:practice`)).map(
          (question, index) => ({
            ...question,
            prompt: `${getCompany(companyId).short} ${chapter.title} practice ${index + 1}: ${question.prompt}`,
            explanation: `${question.explanation} This original practice question is scoped to ${getCompany(companyId).short} ${chapter.title}.`,
          }),
        )

  for (const question of generated) {
    add({
      ...question,
      id: `chapter-practice-${companyId}-${chapter.id}-${out.length}`,
    })
    if (out.length >= CHAPTER_PRACTICE_TARGET) break
  }

  while (out.length < CHAPTER_PRACTICE_TARGET) {
    add(fallbackCompanyQuestion(companyId, sectionId, chapter, out.length + 2000))
  }

  return out.slice(0, CHAPTER_PRACTICE_TARGET)
}

export function totalChapters(companyId: CompanyId): number {
  return getSections(companyId).reduce((n, s) => n + s.chapters.length, 0)
}

export function companyTagline(companyId: CompanyId): string {
  return getCompany(companyId).blurb
}



