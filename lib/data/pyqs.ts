import type { CompanyId, Question, SectionId } from "@/lib/types"
import { generateDrills, todaySeed } from "@/lib/data/question-bank"

/**
 * Previous-Year-Question bank. These are ORIGINAL reconstructions in
 * the style/pattern of each company's test - never verbatim copies of any real or
 * proprietary paper. `year` marks the pattern era, not a leaked paper.
 */
export interface PYQ extends Question {
  section: SectionId
  year: number
  frequentlyAsked: boolean
  /**
   * The OFFICIAL source whose published TEST PATTERN this question is modeled on.
   * Distinct from `sourceId` (the content author). The question text itself is
   * always original StudyBench content - never copied from the company.
   */
  patternSourceId?: string
}

let pc = 0
function p(
  company: CompanyId,
  section: SectionId,
  topic: string,
  year: number,
  frequentlyAsked: boolean,
  difficulty: Question["difficulty"],
  prompt: string,
  options: string[],
  answer: number,
  explanation: string,
): PYQ & { company: CompanyId } {
  pc += 1
  return {
    id: `pyq${pc}`,
    company,
    section,
    topic,
    year,
    frequentlyAsked,
    difficulty,
    prompt,
    options,
    answer,
    explanation,
    sourceId: "studybench-curriculum",
  }
}

export const PYQS: (PYQ & { company: CompanyId })[] = [
  // ===================== TCS =====================
  p("tcs", "quant", "Profit & Loss", 2024, true, "medium", "A shopkeeper sells an item at 20% profit. If the cost price is Rs 450, the selling price is:", ["Rs 520", "Rs 540", "Rs 560", "Rs 500"], 1, "SP = 450 x 1.20 = Rs 540."),
  p("tcs", "quant", "Number System", 2023, true, "medium", "The remainder when 7^100 is divided by 5 is:", ["1", "2", "3", "4"], 0, "7 is congruent to 2 (mod 5); powers of 2 mod 5 cycle 2,4,3,1 with period 4. 100 mod 4 = 0 -> last in cycle = 1."),
  p("tcs", "quant", "Time & Work", 2024, true, "medium", "A alone finishes a task in 12 days, B alone in 24 days. Together they finish in:", ["6 days", "8 days", "9 days", "16 days"], 1, "1/12 + 1/24 = 3/24 = 1/8 per day -> 8 days."),
  p("tcs", "reasoning", "Series", 2024, true, "easy", "Find the odd one out: 4, 9, 16, 25, 35", ["9", "16", "25", "35"], 3, "4,9,16,25 are perfect squares (2^2,3^2,4^2,5^2); 35 is not."),
  p("tcs", "reasoning", "Classification", 2023, false, "easy", "Find the odd one out: 3, 5, 9, 11", ["3", "5", "9", "11"], 2, "3, 5, 11 are prime; 9 = 3x3 is composite."),
  p("tcs", "verbal", "Vocabulary", 2024, false, "easy", "Choose the synonym of 'Abundant':", ["Scarce", "Plentiful", "Empty", "Rare"], 1, "'Abundant' means existing in large quantity - plentiful."),
  p("tcs", "coding", "C Output", 2023, false, "medium", "In C, what is the value of 5 & 3 (bitwise AND)?", ["1", "7", "8", "15"], 0, "0101 & 0011 = 0001 = 1."),
  p("tcs", "coding", "C Output", 2024, true, "easy", "In C, printf(\"%d\", 10 / 3) prints:", ["3", "3.33", "4", "0"], 0, "Integer division truncates -> 3."),

  // ===================== Infosys =====================
  p("infosys", "quant", "Time & Work", 2024, true, "medium", "A can do a job in 10 days, B in 15 days. Together they finish in:", ["5 days", "6 days", "7.5 days", "12.5 days"], 1, "Rates 1/10 + 1/15 = 1/6 per day -> 6 days."),
  p("infosys", "quant", "Percentages", 2023, true, "medium", "20% of 20% of 500 is:", ["20", "40", "50", "100"], 0, "0.2 x 0.2 x 500 = 20."),
  p("infosys", "reasoning", "Syllogism", 2023, true, "medium", "All cats are animals. Some animals are wild. Conclusion: Some cats are wild?", ["Follows", "Does not follow", "Definitely true", "Always"], 1, "'Some animals are wild' does not force any cat to be wild - it does not follow."),
  p("infosys", "reasoning", "Series", 2024, false, "easy", "Find the next term: 2, 4, 8, 16, ?", ["24", "32", "30", "20"], 1, "Each term doubles -> 16 x 2 = 32."),
  p("infosys", "verbal", "Sentence correction", 2024, false, "easy", "Choose the correct form: 'She is good ___ mathematics.'", ["in", "at", "on", "with"], 1, "The idiom is 'good at' a subject/skill."),
  p("infosys", "coding", "Pseudocode", 2024, true, "medium", "for i in 1..3: for j in 1..3: print('*') - how many stars are printed?", ["6", "9", "3", "12"], 1, "3 outer x 3 inner = 9 stars."),

  // ===================== Wipro =====================
  p("wipro", "quant", "Averages", 2024, true, "easy", "The average of 5 consecutive integers starting from 8 is:", ["9", "10", "11", "12"], 1, "8,9,10,11,12 -> average is the middle term, 10."),
  p("wipro", "quant", "Simple Interest", 2023, true, "medium", "SI on Rs 2000 at 5% per annum for 2 years is:", ["Rs 100", "Rs 200", "Rs 250", "Rs 400"], 1, "SI = 2000 x 5 x 2 / 100 = Rs 200."),
  p("wipro", "verbal", "Vocabulary", 2023, true, "medium", "Pick the word closest in meaning to 'Concise':", ["Lengthy", "Brief", "Vague", "Complex"], 1, "'Concise' means brief and to the point."),
  p("wipro", "verbal", "Antonyms", 2024, false, "easy", "Choose the antonym of 'Ancient':", ["Old", "Modern", "Historic", "Aged"], 1, "'Ancient' (very old) is the opposite of 'modern'."),
  p("wipro", "reasoning", "Blood Relations", 2024, false, "easy", "A is the father of B. How is B related to A?", ["Father", "Son or daughter", "Brother", "Uncle"], 1, "B is A's child - son or daughter."),
  p("wipro", "coding", "Loops", 2024, false, "medium", "How many times does this loop print? for(i=1;i<=10;i+=2) print(i)", ["10", "5", "4", "6"], 1, "i = 1,3,5,7,9 -> 5 times."),

  // ===================== Accenture =====================
  p("accenture", "reasoning", "Coding-Decoding", 2024, true, "medium", "If CAT = 24 (C=3,A=1,T=20 -> sum), then DOG = ?", ["26", "23", "22", "20"], 0, "D=4,O=15,G=7 -> 4+15+7 = 26."),
  p("accenture", "reasoning", "Classification", 2023, false, "easy", "Find the odd one out: Apple, Mango, Rose, Banana", ["Apple", "Mango", "Rose", "Banana"], 2, "Apple, Mango, Banana are fruits; Rose is a flower."),
  p("accenture", "quant", "Percentages", 2023, true, "easy", "What is 15% of 200?", ["25", "30", "35", "20"], 1, "0.15 x 200 = 30."),
  p("accenture", "quant", "Ratio", 2024, false, "easy", "If 3 pens cost Rs 45, then 7 pens cost:", ["Rs 90", "Rs 105", "Rs 120", "Rs 100"], 1, "One pen = Rs 15; 7 x 15 = Rs 105."),
  p("accenture", "cs-core", "Fundamentals", 2024, false, "easy", "Which data structure uses FIFO order?", ["Stack", "Queue", "Tree", "Graph"], 1, "A queue is First-In-First-Out (FIFO)."),
  p("accenture", "cs-core", "Data Structures", 2023, true, "medium", "Which of these is a non-linear data structure?", ["Array", "Stack", "Queue", "Tree"], 3, "A tree is non-linear; the others store data linearly."),

  // ===================== Zoho =====================
  p("zoho", "coding", "Logic", 2024, true, "hard", "What is printed? a=5; b=a++; print(a, b)", ["5 5", "6 5", "6 6", "5 6"], 1, "b takes the old value 5, then a increments to 6 -> prints 6 5."),
  p("zoho", "coding", "Arrays", 2023, true, "hard", "Minimum swaps to sort [4,3,2,1] (reverse) by swapping any two elements is:", ["1", "2", "3", "4"], 1, "Swap (4,1) -> [1,3,2,4], swap (3,2) -> [1,2,3,4]. 2 swaps."),
  p("zoho", "coding", "Strings", 2024, false, "medium", "Number of vowels in 'PLACEMENT' is:", ["2", "3", "4", "5"], 1, "A, E, E -> 3 vowels."),
  p("zoho", "coding", "C Output", 2024, true, "hard", "What prints? for(i=0;i<3;i++); printf(\"%d\", i)", ["2", "3", "0", "1"], 1, "The ';' makes the loop body empty; it runs until i=3, then prints 3."),
  p("zoho", "coding", "Logic", 2023, true, "medium", "The integer reversal of 1234 is:", ["4321", "1234", "3214", "4231"], 0, "Reverse the digits -> 4321."),
  p("zoho", "coding", "Loops", 2024, false, "medium", "Times 'Hi' is printed: for(i=0;i<5;i++) for(j=0;j<2;j++) print('Hi')", ["5", "7", "10", "2"], 2, "5 x 2 = 10 times."),

  // ===================== Cognizant =====================
  p("cognizant", "quant", "Ratio", 2024, true, "easy", "If a:b = 2:3 and b:c = 4:5, then a:c =", ["8:15", "2:5", "8:5", "4:5"], 0, "Make b common: a:b = 8:12, b:c = 12:15 -> a:c = 8:15."),
  p("cognizant", "quant", "Averages", 2023, false, "easy", "The average of the first 5 natural numbers (1-5) is:", ["2.5", "3", "3.5", "15"], 1, "(1+2+3+4+5)/5 = 15/5 = 3."),
  p("cognizant", "reasoning", "Direction", 2023, true, "medium", "Facing North, you turn right, then right again. You now face:", ["East", "West", "South", "North"], 2, "North -> right = East -> right = South."),
  p("cognizant", "verbal", "Spelling", 2024, true, "easy", "Choose the correctly spelt word:", ["Acommodation", "Accomodation", "Accommodation", "Accommadation"], 2, "'Accommodation' - double c and double m."),
  p("cognizant", "verbal", "Grammar", 2024, false, "easy", "Identify the error: 'He don't like coffee.'", ["He", "don't", "like", "coffee"], 1, "Third person singular needs 'doesn't', not 'don't'."),
  p("cognizant", "coding", "Data Structures", 2023, false, "medium", "FILO (First-In-Last-Out) order is followed by a:", ["Queue", "Stack", "Array", "Tree"], 1, "A stack is LIFO/FILO - the first element in is the last out."),

  // ===================== Core prep =====================
  p("general", "quant", "Percentages", 2024, true, "easy", "What is 50% of 80?", ["30", "40", "50", "160"], 1, "Half of 80 = 40."),
  p("general", "quant", "Basic Algebra", 2024, false, "easy", "If 2x = 10, then x =", ["5", "2", "20", "8"], 0, "x = 10 / 2 = 5."),
  p("general", "reasoning", "Series", 2024, true, "easy", "Find the next term: 1, 2, 3, 5, 8, ?", ["11", "13", "12", "10"], 1, "Fibonacci - each term is the sum of the previous two: 5 + 8 = 13."),
  p("general", "reasoning", "Direction", 2023, false, "easy", "Facing East, you turn left. You now face:", ["North", "South", "West", "East"], 0, "A left (anticlockwise) turn from East faces North."),
  p("general", "verbal", "Vocabulary", 2024, true, "easy", "Choose the synonym of 'Happy':", ["Sad", "Joyful", "Angry", "Tired"], 1, "'Happy' means feeling pleasure - joyful."),
  p("general", "coding", "Data Structures", 2024, true, "easy", "Which data structure follows FIFO order?", ["Stack", "Queue", "Tree", "Graph"], 1, "A queue is First-In-First-Out."),
  p("general", "coding", "Number Systems", 2023, false, "medium", "The binary representation of 5 is:", ["100", "101", "110", "111"], 1, "5 = 4 + 1 = 101 in binary."),
  p("general", "cs-core", "Fundamentals", 2024, false, "easy", "RAM is best described as:", ["Permanent storage", "Volatile memory", "A hard disk", "A network device"], 1, "RAM is volatile - its contents are lost when power is off."),

  // ===================== Additional set =====================
  // TCS
  p("tcs", "quant", "Trains", 2024, false, "medium", "A 100 m train crosses a 150 m platform in 10 s. Its speed is:", ["72 km/h", "90 km/h", "25 km/h", "100 km/h"], 1, "Distance = 250 m in 10 s = 25 m/s = 25 x 18/5 = 90 km/h."),
  p("tcs", "reasoning", "Classification", 2023, false, "easy", "Find the odd one out: 11, 13, 15, 17", ["11", "13", "15", "17"], 2, "11, 13, 17 are prime; 15 = 3 x 5 is composite."),
  p("tcs", "verbal", "Antonyms", 2024, false, "easy", "Choose the antonym of 'Victory':", ["Win", "Defeat", "Success", "Triumph"], 1, "'Victory' is the opposite of 'defeat'."),
  // Infosys
  p("infosys", "quant", "Simple Interest", 2024, false, "medium", "At simple interest, a sum doubles in 5 years. The annual rate is:", ["10%", "20%", "15%", "25%"], 1, "Interest equals the principal in 5 years -> R x 5/100 = 1 -> R = 20%."),
  p("infosys", "coding", "Pseudocode", 2024, false, "easy", "x = 4; x = x * x; print(x). Output:", ["8", "16", "4", "12"], 1, "4 x 4 = 16."),
  // Wipro
  p("wipro", "reasoning", "Series", 2024, false, "easy", "Find the next term: 7, 14, 28, 56, ?", ["98", "112", "84", "110"], 1, "Each term doubles -> 56 x 2 = 112."),
  p("wipro", "verbal", "Synonyms", 2024, false, "easy", "Choose the synonym of 'Rapid':", ["Slow", "Quick", "Late", "Calm"], 1, "'Rapid' means fast - quick."),
  // Accenture
  p("accenture", "quant", "Averages", 2024, false, "easy", "The average of 10, 20, 30, 40 and 50 is:", ["25", "30", "35", "40"], 1, "(10+20+30+40+50)/5 = 150/5 = 30."),
  p("accenture", "cs-core", "DBMS", 2024, false, "medium", "A primary key must be:", ["Allowed to be null", "Unique and not null", "Always text", "Duplicated"], 1, "A primary key uniquely identifies a row and cannot be null."),
  // Zoho
  p("zoho", "coding", "Logic", 2024, false, "easy", "i = 10; print(i++). What is printed?", ["10", "11", "9", "0"], 0, "Post-increment prints the old value 10, then i becomes 11."),
  p("zoho", "coding", "Math", 2023, false, "easy", "What is 2 to the power 3?", ["6", "8", "9", "5"], 1, "2 x 2 x 2 = 8."),
  // Cognizant
  p("cognizant", "quant", "Time & Work", 2024, false, "medium", "If 5 workers build a wall in 8 days, 10 workers (same rate) take:", ["16 days", "4 days", "8 days", "2 days"], 1, "Work = 40 worker-days; 40 / 10 = 4 days."),
  p("cognizant", "reasoning", "Series", 2024, false, "medium", "Find the next term: Z, X, V, T, ?", ["S", "R", "Q", "U"], 1, "Letters drop by 2: Z, X, V, T, R."),
  // General
  p("general", "quant", "Percentages", 2024, false, "easy", "What is 10% of 250?", ["25", "20", "30", "2.5"], 0, "10% of 250 = 25."),
  p("general", "reasoning", "Classification", 2024, false, "easy", "Find the odd one out: Dog, Cat, Lion, Rose", ["Dog", "Cat", "Lion", "Rose"], 3, "Dog, Cat and Lion are animals; Rose is a flower."),

  // ===================== Expanded bank (set 3) =====================
  // TCS
  p("tcs", "quant", "Ratio", 2024, false, "easy", "Two numbers are in the ratio 3:4 and their sum is 70. The larger number is:", ["30", "40", "35", "42"], 1, "Larger = 4/7 x 70 = 40."),
  p("tcs", "quant", "Percentages", 2023, true, "medium", "A price rises from Rs 80 to Rs 100. The percentage increase is:", ["20%", "25%", "18%", "22%"], 1, "Increase = (100 - 80)/80 x 100 = 25%."),
  p("tcs", "quant", "HCF-LCM", 2024, false, "easy", "The LCM of 6 and 8 is:", ["12", "24", "48", "16"], 1, "6 = 2 x 3, 8 = 2^3 -> LCM = 2^3 x 3 = 24."),
  p("tcs", "quant", "Profit & Loss", 2023, true, "medium", "An item costs Rs 250 and sells for Rs 300. The profit percentage is:", ["10%", "20%", "25%", "15%"], 1, "Profit = 50 on CP 250 -> 50/250 x 100 = 20%."),
  p("tcs", "reasoning", "Series", 2024, false, "easy", "Find the next term: 5, 10, 20, 40, ?", ["60", "80", "100", "50"], 1, "Each term doubles -> 40 x 2 = 80."),
  p("tcs", "reasoning", "Analogy", 2023, false, "easy", "Cat : Kitten :: Dog : ?", ["Cub", "Puppy", "Calf", "Foal"], 1, "A young dog is a puppy."),
  p("tcs", "verbal", "Synonyms", 2024, false, "easy", "Choose the synonym of 'Eager':", ["Reluctant", "Keen", "Bored", "Tired"], 1, "'Eager' means keen and enthusiastic."),
  p("tcs", "verbal", "Antonyms", 2023, false, "easy", "Choose the antonym of 'Expand':", ["Grow", "Contract", "Stretch", "Widen"], 1, "'Expand' (grow larger) is the opposite of 'contract'."),
  p("tcs", "coding", "C Output", 2024, true, "medium", "In C, what is printf(\"%d\", 10 % 3)?", ["1", "3", "0", "10"], 0, "10 modulo 3 leaves remainder 1."),
  p("tcs", "coding", "C Basics", 2023, false, "easy", "In C, sizeof(char) is:", ["1", "2", "4", "8"], 0, "A char is 1 byte by definition in C."),

  // Infosys
  p("infosys", "quant", "Percentages", 2024, false, "medium", "30% of 30% of 1000 is:", ["90", "100", "300", "9"], 0, "0.3 x 0.3 x 1000 = 90."),
  p("infosys", "quant", "Time & Work", 2023, true, "medium", "A finishes a job in 6 days, B in 12 days. Together they finish in:", ["3 days", "4 days", "8 days", "9 days"], 1, "1/6 + 1/12 = 1/4 per day -> 4 days."),
  p("infosys", "quant", "Averages", 2024, false, "easy", "The average of 2, 4, 6, 8 and 10 is:", ["5", "6", "7", "30"], 1, "Sum 30 / 5 = 6."),
  p("infosys", "reasoning", "Syllogism", 2024, true, "medium", "All A are B. All B are C. Conclusion: All A are C?", ["Follows", "Does not follow", "Cannot say", "Partially"], 0, "A  is a subset of  B  is a subset of  C, so all A are C - it follows."),
  p("infosys", "reasoning", "Series", 2023, false, "easy", "Find the next term: 1, 4, 9, 16, 25, ?", ["30", "36", "49", "35"], 1, "Perfect squares; next is 6^2 = 36."),
  p("infosys", "verbal", "Grammar", 2024, true, "easy", "Choose the correct form: 'Each student ___ a book.'", ["have", "has", "have had", "are"], 1, "'Each' is singular and takes 'has'."),
  p("infosys", "coding", "Pseudocode", 2024, true, "medium", "x = 5; while (x > 0) { x = x - 2 } - the final value of x is:", ["0", "-1", "1", "5"], 1, "5 -> 3 -> 1 -> -1, then the loop stops. Final x = -1."),
  p("infosys", "coding", "Pseudocode", 2023, false, "easy", "sum = 0; for i in 1..5: sum = sum + i. Final sum:", ["10", "15", "12", "20"], 1, "1+2+3+4+5 = 15."),

  // Wipro
  p("wipro", "quant", "Simple Interest", 2024, false, "medium", "SI on Rs 1000 at 10% per annum for 2 years is:", ["Rs 100", "Rs 200", "Rs 210", "Rs 150"], 1, "SI = 1000 x 10 x 2 / 100 = Rs 200."),
  p("wipro", "quant", "Averages", 2023, false, "easy", "The average of the first 5 even numbers (2,4,6,8,10) is:", ["5", "6", "7", "30"], 1, "Sum 30 / 5 = 6."),
  p("wipro", "verbal", "Synonyms", 2024, false, "easy", "Choose the synonym of 'Brave':", ["Cowardly", "Courageous", "Weak", "Timid"], 1, "'Brave' means courageous."),
  p("wipro", "verbal", "Spelling", 2023, true, "easy", "Choose the correctly spelt word:", ["Neccessary", "Necessary", "Necesary", "Neccesary"], 1, "'Necessary' - one c, two s."),
  p("wipro", "reasoning", "Direction", 2024, false, "easy", "Facing South, you turn left. You now face:", ["East", "West", "North", "South"], 0, "Facing south, your left side is east; turning left faces East."),
  p("wipro", "coding", "Loops", 2023, false, "easy", "How many times does this print? for(i=0;i<5;i++) print(i)", ["4", "5", "6", "10"], 1, "i = 0,1,2,3,4 -> 5 times."),

  // Accenture
  p("accenture", "quant", "Percentages", 2024, false, "easy", "25% of 80 is:", ["15", "20", "25", "40"], 1, "0.25 x 80 = 20."),
  p("accenture", "reasoning", "Coding-Decoding", 2023, false, "easy", "If A=1 ... Z=26, the value of 'AB' (A+B) is:", ["2", "3", "4", "5"], 1, "A=1, B=2 -> 1 + 2 = 3."),
  p("accenture", "cs-core", "Data Structures", 2024, false, "easy", "Which of these is a linear data structure?", ["Tree", "Graph", "Array", "Heap"], 2, "An array stores elements linearly; trees, graphs and heaps are non-linear."),
  p("accenture", "cs-core", "SQL", 2023, true, "easy", "Which SQL command retrieves data from a table?", ["INSERT", "SELECT", "UPDATE", "DELETE"], 1, "SELECT reads/retrieves rows."),
  p("accenture", "verbal", "Antonyms", 2024, false, "easy", "Choose the antonym of 'Increase':", ["Rise", "Decrease", "Grow", "Expand"], 1, "'Increase' is the opposite of 'decrease'."),
  p("accenture", "coding", "Pseudocode", 2023, false, "easy", "sum = 0; for i in 1..3: sum = sum + i. Output:", ["3", "6", "9", "1"], 1, "1 + 2 + 3 = 6."),

  // Zoho
  p("zoho", "coding", "C Output", 2024, true, "easy", "What is 7 / 2 using integer division?", ["3", "3.5", "4", "2"], 0, "Integer division truncates the decimal -> 3."),
  p("zoho", "coding", "Strings", 2023, false, "easy", "The reverse of the string 'abcd' is:", ["abcd", "dcba", "bcda", "dacb"], 1, "Read it backwards -> 'dcba'."),
  p("zoho", "coding", "Bit Manipulation", 2024, true, "medium", "The number of set bits (1s) in the binary of 7 is:", ["1", "2", "3", "4"], 2, "7 = 111 in binary -> three 1s."),
  p("zoho", "coding", "Logic", 2023, false, "easy", "The factorial of 4 is:", ["12", "16", "24", "20"], 2, "4 x 3 x 2 x 1 = 24."),
  p("zoho", "coding", "Arrays", 2024, true, "easy", "The largest element in [3, 7, 2, 8, 5] is:", ["7", "8", "5", "3"], 1, "8 is the maximum."),
  p("zoho", "coding", "Logic", 2023, false, "medium", "The sum of the digits of 1234 is:", ["9", "10", "11", "8"], 1, "1 + 2 + 3 + 4 = 10."),

  // Cognizant
  p("cognizant", "quant", "Ratio", 2024, true, "medium", "If a:b = 1:2 and b:c = 3:4, then a:c =", ["1:2", "3:8", "3:4", "1:4"], 1, "Make b common: a:b = 3:6, b:c = 6:8 -> a:c = 3:8."),
  p("cognizant", "reasoning", "Series", 2023, true, "medium", "Find the next term: 2, 5, 10, 17, 26, ?", ["35", "37", "36", "40"], 1, "Differences 3, 5, 7, 9; next is 11 -> 26 + 11 = 37."),
  p("cognizant", "verbal", "Grammar", 2024, false, "easy", "Choose the correct sentence:", ["He go to school.", "He goes to school.", "He going to school.", "He gone to school."], 1, "Third person singular needs 'goes'."),
  p("cognizant", "coding", "Automata Fix", 2024, true, "medium", "A loop 'for(i=0;i<=n;i++)' over an array of size n causes:", ["Correct output", "An out-of-bounds access", "An infinite loop", "A syntax error"], 1, "Valid indices are 0..n-1; i = n is out of bounds (off-by-one)."),
  p("cognizant", "cs-core", "Data Structures", 2023, false, "easy", "FIFO order is followed by a:", ["Stack", "Queue", "Tree", "Graph"], 1, "A queue is First-In-First-Out."),

  // Core prep
  p("general", "quant", "Percentages", 2024, false, "easy", "20% of 50 is:", ["5", "10", "15", "20"], 1, "0.2 x 50 = 10."),
  p("general", "quant", "Fractions", 2023, false, "easy", "Half of 1/2 is:", ["1/2", "1/4", "1", "2"], 1, "1/2 x 1/2 = 1/4."),
  p("general", "reasoning", "Series", 2024, false, "easy", "Find the next term: 3, 6, 9, 12, ?", ["14", "15", "16", "18"], 1, "Add 3 each time -> 12 + 3 = 15."),
  p("general", "reasoning", "Classification", 2023, false, "easy", "Find the odd one out: 2, 4, 6, 9", ["2", "4", "6", "9"], 3, "2, 4, 6 are even; 9 is odd."),
  p("general", "verbal", "Antonyms", 2024, false, "easy", "Choose the antonym of 'Big':", ["Large", "Small", "Huge", "Tall"], 1, "'Big' is the opposite of 'small'."),
  p("general", "verbal", "Grammar", 2023, false, "easy", "The plural of 'child' is:", ["childs", "children", "childes", "child"], 1, "'Child' has the irregular plural 'children'."),
  p("general", "coding", "Number Systems", 2024, false, "easy", "The binary representation of 4 is:", ["100", "101", "110", "10"], 0, "4 = 100 in binary."),
  p("general", "cs-core", "Fundamentals", 2023, false, "easy", "CPU stands for:", ["Central Process Unit", "Central Processing Unit", "Computer Personal Unit", "Central Processor United"], 1, "CPU = Central Processing Unit."),

  // ===================== Expanded bank (set 4) =====================
  // TCS - aptitude + programming logic + C
  p("tcs", "quant", "Number System", 2024, true, "medium", "The unit digit of 3^24 is:", ["1", "3", "7", "9"], 0, "Cycle of 3 is 3,9,7,1 (period 4). 24 mod 4 = 0 -> last term = 1."),
  p("tcs", "quant", "Percentages", 2023, false, "easy", "If 40% of a number is 80, the number is:", ["120", "160", "200", "240"], 2, "Number = 80 / 0.40 = 200."),
  p("tcs", "quant", "Ratio", 2024, false, "easy", "If 5 books cost Rs 250, then 8 books cost:", ["Rs 350", "Rs 400", "Rs 450", "Rs 420"], 1, "One book = Rs 50; 8 x 50 = Rs 400."),
  p("tcs", "quant", "Trains", 2023, true, "medium", "A 150 m train at 54 km/h crosses a pole in:", ["10 s", "12 s", "15 s", "9 s"], 0, "54 km/h = 15 m/s; 150 / 15 = 10 s."),
  p("tcs", "quant", "Profit & Loss", 2024, false, "medium", "Selling at Rs 120 gives a 20% gain. The cost price is:", ["Rs 96", "Rs 100", "Rs 110", "Rs 105"], 1, "CP = 120 / 1.20 = Rs 100."),
  p("tcs", "reasoning", "Coding-Decoding", 2024, true, "medium", "If 'RED' is coded as 'SFE' (each letter +1), then 'BLUE' is:", ["CMVF", "CMWF", "CNVF", "DMVF"], 0, "B->C, L->M, U->V, E->F -> CMVF."),
  p("tcs", "reasoning", "Classification", 2023, false, "easy", "Find the odd one out: 4, 8, 12, 18", ["4", "8", "12", "18"], 3, "4, 8, 12 are multiples of 4; 18 is not."),
  p("tcs", "verbal", "Synonyms", 2024, false, "medium", "Choose the synonym of 'Tedious':", ["Exciting", "Boring", "Quick", "Easy"], 1, "'Tedious' means dull and tiresome - boring."),
  p("tcs", "verbal", "Grammar", 2023, false, "medium", "Fill in the blank: 'He is senior ___ me.'", ["to", "than", "from", "of"], 0, "The correct idiom is 'senior to'."),
  p("tcs", "coding", "C Output", 2024, true, "easy", "What does printf(\"%d\", 2 + 3 * 4) print?", ["20", "14", "24", "11"], 1, "Multiplication first: 3*4 = 12, then 2 + 12 = 14."),
  p("tcs", "coding", "C Output", 2023, false, "easy", "int x = 7; x %= 3; the value of x is:", ["1", "2", "3", "0"], 0, "7 mod 3 = 1."),

  // Infosys - quant + reasoning + pseudocode
  p("infosys", "quant", "Time & Work", 2024, true, "hard", "A is twice as efficient as B. Together they finish a job in 12 days. A alone takes:", ["18 days", "24 days", "36 days", "9 days"], 0, "Rates A:B = 2:1, together 3 units/day -> total 36 units; A alone 36/2 = 18 days."),
  p("infosys", "quant", "Percentages", 2023, true, "medium", "A's salary is 25% more than B's. B's salary is what percent less than A's?", ["20%", "25%", "16.67%", "33.3%"], 0, "B = A/1.25 = 0.8A -> 20% less."),
  p("infosys", "quant", "Averages", 2024, false, "medium", "The average of 5 numbers is 18. If 8 is removed, the average of the rest is:", ["20", "20.5", "21", "19"], 1, "Sum = 90; remove 8 -> 82 / 4 = 20.5."),
  p("infosys", "reasoning", "Syllogism", 2024, true, "medium", "All mangoes are fruits. Some fruits are sweet. Conclusion: Some mangoes are sweet?", ["Follows", "Does not follow", "Always true", "Certain"], 1, "Nothing ties mangoes to 'sweet', so it does not follow."),
  p("infosys", "reasoning", "Series", 2023, false, "medium", "Find the next term: 2, 6, 12, 20, 30, 42, ?", ["54", "56", "52", "58"], 1, "Differences 4,6,8,10,12; next is 14 -> 42 + 14 = 56."),
  p("infosys", "verbal", "Spelling", 2024, false, "easy", "Choose the correctly spelt word:", ["Definitly", "Definately", "Definitely", "Defenitely"], 2, "'Definitely' is the correct spelling."),
  p("infosys", "coding", "Pseudocode", 2024, true, "medium", "a=10; b=20; a=a+b; b=a-b; a=a-b; print(a, b). Output:", ["10 20", "20 10", "30 20", "10 10"], 1, "This is the classic swap -> a=20, b=10."),
  p("infosys", "coding", "Pseudocode", 2023, false, "easy", "count=0; for i in 1..10: if i is even: count++. Final count:", ["4", "5", "6", "10"], 1, "Evens 2,4,6,8,10 -> 5."),
  p("infosys", "coding", "Pseudocode", 2024, false, "easy", "x = 5; y = (x > 3) ? 1 : 0; print(y). Output:", ["0", "1", "5", "3"], 1, "5 > 3 is true -> y = 1."),

  // Wipro - quant + verbal + coding
  p("wipro", "quant", "Simple Interest", 2024, true, "medium", "In how many years will Rs 500 amount to Rs 600 at 5% simple interest?", ["3", "4", "5", "2"], 1, "SI = 100 = 500 x 5 x T / 100 = 25T -> T = 4."),
  p("wipro", "quant", "Ratio", 2023, false, "easy", "Divide 90 in the ratio 4 : 5. The smaller part is:", ["40", "50", "45", "36"], 0, "Smaller = 4/9 x 90 = 40."),
  p("wipro", "quant", "Percentages", 2024, false, "easy", "What percent of 200 is 50?", ["20%", "25%", "30%", "40%"], 1, "50 / 200 x 100 = 25%."),
  p("wipro", "verbal", "Synonyms", 2023, false, "easy", "Choose the synonym of 'Generous':", ["Stingy", "Liberal", "Mean", "Selfish"], 1, "'Generous' means giving freely - liberal."),
  p("wipro", "verbal", "Sentence completion", 2024, false, "easy", "Fill in the blank: 'I have been waiting ___ two hours.'", ["since", "for", "from", "at"], 1, "'For' is used with a duration (two hours)."),
  p("wipro", "coding", "Loops", 2023, false, "easy", "for(i=0;i<3;i++) for(j=0;j<3;j++) print('*'). Total stars:", ["6", "9", "3", "12"], 1, "3 x 3 = 9."),
  p("wipro", "coding", "Operators", 2024, false, "easy", "What is 2 raised to the power 3 (2**3)?", ["6", "8", "9", "5"], 1, "2 x 2 x 2 = 8."),

  // Accenture - cognitive + technical MCQ + coding
  p("accenture", "quant", "Percentages", 2024, false, "easy", "30% of 150 is:", ["30", "45", "50", "60"], 1, "0.30 x 150 = 45."),
  p("accenture", "reasoning", "Classification", 2023, false, "easy", "Find the odd one out: Triangle, Square, Circle, Rectangle", ["Triangle", "Square", "Circle", "Rectangle"], 2, "Triangle, Square and Rectangle have straight sides; a circle does not."),
  p("accenture", "cs-core", "Networks", 2024, true, "medium", "Which protocol is used to send email?", ["HTTP", "SMTP", "FTP", "DNS"], 1, "SMTP (Simple Mail Transfer Protocol) sends email."),
  p("accenture", "cs-core", "DBMS", 2023, false, "medium", "Which key is allowed to contain NULL values?", ["Primary key", "Foreign key", "Both", "Neither"], 1, "A foreign key may be null; a primary key cannot."),
  p("accenture", "cs-core", "OS", 2024, true, "medium", "Which CPU scheduling policy can cause starvation?", ["FCFS", "Priority", "Round Robin", "None"], 1, "Low-priority processes may wait indefinitely under priority scheduling."),
  p("accenture", "cs-core", "Pseudocode", 2023, false, "easy", "For arr = {10, 20, 30, 40} (0-indexed), PRINT arr[2] outputs:", ["10", "20", "30", "40"], 2, "Index 2 is the third element -> 30."),
  p("accenture", "cs-core", "Fundamentals", 2024, false, "easy", "Which of these is a cloud service model?", ["SaaS", "HTML", "TCP", "RAM"], 0, "SaaS (Software as a Service) is a cloud model."),
  p("accenture", "coding", "Output", 2023, false, "easy", "x = 8; x = x / 2; x = x / 2; print(x). Output:", ["4", "2", "1", "8"], 1, "8 -> 4 -> 2."),

  // Zoho - coding heavy
  p("zoho", "coding", "Output", 2024, true, "medium", "int a = 10; printf(\"%d\", a > 5 && a < 20). Output:", ["0", "1", "10", "20"], 1, "Both conditions true -> 1."),
  p("zoho", "coding", "Patterns", 2023, true, "easy", "A right triangle pattern of 4 rows (1,2,3,4 stars) has how many stars?", ["6", "10", "16", "8"], 1, "1 + 2 + 3 + 4 = 10."),
  p("zoho", "coding", "Recursion", 2024, true, "medium", "f(0)=0, f(n)=f(n-1)+n. What is f(4)?", ["6", "10", "12", "8"], 1, "0 + 1 + 2 + 3 + 4 = 10."),
  p("zoho", "coding", "Arrays", 2023, false, "easy", "The sum of the array [2, 4, 6, 8] is:", ["18", "20", "24", "16"], 1, "2 + 4 + 6 + 8 = 20."),
  p("zoho", "coding", "Number Logic", 2024, false, "easy", "Is 17 a prime number?", ["Yes", "No", "Only sometimes", "Cannot say"], 0, "17 has no divisors other than 1 and itself, so it is prime."),
  p("zoho", "coding", "Output", 2023, true, "hard", "for(i=5;i>0;i--) ; printf(\"%d\", i). What prints?", ["5", "0", "1", "4"], 1, "The ';' makes an empty body; the loop runs until i=0, then prints 0."),
  p("zoho", "coding", "Bit Manipulation", 2024, true, "medium", "The result of 5 | 2 (bitwise OR) is:", ["7", "0", "5", "2"], 0, "101 | 010 = 111 = 7."),
  p("zoho", "coding", "Debugging", 2023, true, "medium", "A loop computes sum += arr[i] but the result is wrong. The most likely bug is:", ["The loop bound", "sum was not initialized to 0", "A wrong array name", "Nothing"], 1, "An uninitialized accumulator gives garbage; initialize sum = 0."),
  p("zoho", "coding", "Matrix", 2024, false, "easy", "A 3 x 3 matrix has how many elements?", ["6", "9", "3", "12"], 1, "3 rows x 3 columns = 9."),

  // Cognizant - aptitude + technical + automata
  p("cognizant", "quant", "Ratio", 2024, false, "easy", "If a : b = 3 : 5 and b = 20, then a =", ["10", "12", "15", "8"], 1, "a = (3/5) x 20 = 12."),
  p("cognizant", "reasoning", "Series", 2023, true, "medium", "Find the next term: 1, 3, 6, 10, 15, ?", ["18", "21", "20", "24"], 1, "Triangular numbers; differences 2,3,4,5; next +6 -> 21."),
  p("cognizant", "verbal", "Grammar", 2024, false, "medium", "Fill in the blank: 'Neither of them ___ coming.'", ["are", "is", "were", "have"], 1, "'Neither' is singular -> 'is'."),
  p("cognizant", "cs-core", "Sorting", 2024, true, "medium", "Which sorting algorithm is fastest on average?", ["Bubble Sort", "Quick Sort", "Selection Sort", "Insertion Sort"], 1, "Quick Sort averages O(n log n); the others are O(n^2)."),
  p("cognizant", "coding", "Automata Fix", 2024, true, "medium", "A function returns the wrong value because it has no 'return' statement. This bug is:", ["A syntax error", "A missing return", "An infinite loop", "Correct code"], 1, "Without a return, the function does not give back the computed value."),
  p("cognizant", "coding", "Output", 2023, false, "easy", "x = 4; if (x > 5) print('A'); else print('B'). Output:", ["A", "B", "AB", "Nothing"], 1, "4 > 5 is false -> prints B."),

  // Core prep
  p("general", "quant", "BODMAS", 2024, true, "easy", "What is 5 + 5 x 0?", ["0", "5", "10", "25"], 1, "Multiplication first: 5 x 0 = 0, then 5 + 0 = 5."),
  p("general", "quant", "Percentages", 2023, false, "easy", "25% of 200 is:", ["25", "50", "75", "100"], 1, "0.25 x 200 = 50."),
  p("general", "reasoning", "Series", 2024, false, "easy", "Find the next term: 100, 90, 80, 70, ?", ["50", "60", "65", "75"], 1, "Subtract 10 each time -> 70 - 10 = 60."),
  p("general", "reasoning", "Classification", 2023, false, "easy", "Find the odd one out: Monday, Tuesday, January, Friday", ["Monday", "Tuesday", "January", "Friday"], 2, "Monday, Tuesday and Friday are days; January is a month."),
  p("general", "verbal", "Antonyms", 2024, false, "easy", "Choose the antonym of 'Begin':", ["Start", "End", "Open", "Run"], 1, "'Begin' is the opposite of 'end'."),
  p("general", "verbal", "Grammar", 2023, false, "easy", "The past tense of 'go' is:", ["goed", "went", "gone", "going"], 1, "'Go' is irregular; its past tense is 'went'."),
  p("general", "coding", "Number Systems", 2024, false, "easy", "The binary representation of 8 is:", ["1000", "1010", "1100", "100"], 0, "8 = 1000 in binary."),
  p("general", "cs-core", "Fundamentals", 2023, false, "easy", "1 KB equals how many bytes?", ["1000", "1024", "100", "512"], 1, "1 KB = 1024 bytes."),
]

const COMPANY_PYQ_PLAN: Record<CompanyId, Partial<Record<SectionId, number>>> = {
  tcs: { quant: 50, reasoning: 45, verbal: 40, coding: 45, "cs-core": 35, "comm-interview": 45 },
  infosys: { quant: 50, reasoning: 45, verbal: 40, coding: 50, "cs-core": 35, "comm-interview": 45 },
  wipro: { quant: 50, reasoning: 40, verbal: 50, coding: 40, "cs-core": 30, "comm-interview": 55 },
  accenture: { quant: 45, reasoning: 45, verbal: 40, coding: 35, "cs-core": 55, "comm-interview": 55 },
  zoho: { coding: 180, "cs-core": 40, "comm-interview": 40 },
  cognizant: { quant: 45, reasoning: 45, verbal: 40, coding: 45, "cs-core": 40, "comm-interview": 50 },
  general: { quant: 50, reasoning: 50, verbal: 45, coding: 55, "cs-core": 50, "comm-interview": 60 },
}

const COMPANY_SOURCE: Record<CompanyId, string> = {
  tcs: "tcs-nqt-official",
  infosys: "infosys-careers",
  wipro: "wipro-careers",
  accenture: "accenture-careers",
  zoho: "zoho-careers",
  cognizant: "cognizant-careers",
  general: "studybench-curriculum",
}

function sectionSeed(company: CompanyId, section: SectionId): number {
  const key = `${company}:${section}:expanded-pyq`
  let hash = 5381
  for (let i = 0; i < key.length; i++) hash = (hash * 33) ^ key.charCodeAt(i)
  return Math.abs(hash)
}

const COMMUNICATION_PYQ_TEMPLATES = [
  {
    topic: "Self Introduction",
    prompt: "Which opening is strongest for a fresher interview self-introduction?",
    options: [
      "I was born in my hometown and then studied many subjects.",
      "I am a final-year student with a project in web development and strong interest in problem solving.",
      "Everything is already written in my resume.",
      "I do not know what to say about myself.",
    ],
    answer: 1,
    explanation: "A strong opening is concise, role-relevant and points the panel toward skills or projects worth discussing.",
  },
  {
    topic: "HR Answering",
    prompt: "When asked about a weakness, which response is most professional?",
    options: [
      "I have no weakness.",
      "I am weak in time management, so I now plan tasks with deadlines and weekly review.",
      "My weakness is that I work too hard.",
      "I cannot answer personal questions.",
    ],
    answer: 1,
    explanation: "A credible weakness plus a concrete improvement action shows self-awareness and maturity.",
  },
  {
    topic: "Email Writing",
    prompt: "A professional interview follow-up email should mainly include:",
    options: [
      "Slang and repeated reminders.",
      "Thanks, role reference, one specific point discussed, and a polite closing.",
      "A demand for immediate selection.",
      "Only emojis and no subject line.",
    ],
    answer: 1,
    explanation: "Follow-up mail should be brief, specific, polite and easy for the recruiter to place.",
  },
  {
    topic: "Group Discussion",
    prompt: "In a group discussion, the best way to disagree is to:",
    options: [
      "Interrupt loudly so your point is heard.",
      "Say the other person is wrong without explanation.",
      "Acknowledge the point, add evidence, and present your view calmly.",
      "Stay silent for the whole discussion.",
    ],
    answer: 2,
    explanation: "GD evaluation rewards clarity, listening, evidence and professional tone, not domination.",
  },
  {
    topic: "Project Explanation",
    prompt: "Which project explanation order is most interview-friendly?",
    options: [
      "Technology names first, then random details.",
      "Problem, users, your role, architecture, challenge solved, result.",
      "Only screenshots and no explanation.",
      "Team members' work first, your work last.",
    ],
    answer: 1,
    explanation: "This structure helps the interviewer see context, ownership, technical depth and impact.",
  },
  {
    topic: "Managerial Round",
    prompt: "If you are blocked on a task during training, the best response is to:",
    options: [
      "Wait silently until someone notices.",
      "Try briefly, document what you tried, then ask a specific question.",
      "Blame the tool or teammate immediately.",
      "Delete the task from your plan.",
    ],
    answer: 1,
    explanation: "Recruiters look for ownership: independent effort, clear communication and timely escalation.",
  },
  {
    topic: "Communication Assessment",
    prompt: "Which sentence is best for a spoken communication test?",
    options: [
      "Actually basically I am saying like maybe.",
      "My main point is that clear planning reduces rework.",
      "Umm... I don't know... maybe yes.",
      "This topic is boring, so I will stop.",
    ],
    answer: 1,
    explanation: "Clear, direct sentences with one idea per line score better than filler-heavy speech.",
  },
  {
    topic: "Recruiter Fit",
    prompt: "When asked why you want a service-company role, the best answer should emphasize:",
    options: [
      "Only salary.",
      "Client exposure, structured learning, willingness to adapt and relevant skills.",
      "That you will leave after training.",
      "That any company is fine.",
    ],
    answer: 1,
    explanation: "Service recruiters value learning agility, communication and readiness for client/project environments.",
  },
] as const

function communicationPyqsFor(company: CompanyId, count: number): (PYQ & { company: CompanyId })[] {
  return Array.from({ length: count }, (_, i) => {
    const template = COMMUNICATION_PYQ_TEMPLATES[i % COMMUNICATION_PYQ_TEMPLATES.length]
    return {
      id: `pyq-${company}-comm-interview-${i + 1}`,
      company,
      section: "comm-interview",
      topic: template.topic,
      year: i % 2 === 0 ? 2026 : 2025,
      frequentlyAsked: i % 2 === 0,
      difficulty: i % 5 === 0 ? "medium" : "easy",
      prompt: `${template.prompt} (${company === "general" ? "core" : company.toUpperCase()} pattern practice ${Math.floor(i / COMMUNICATION_PYQ_TEMPLATES.length) + 1})`,
      options: [...template.options],
      answer: template.answer,
      explanation: template.explanation,
      sourceId: "studybench-curriculum",
      patternSourceId: COMPANY_SOURCE[company],
    }
  })
}

function generatedPyqsFor(company: CompanyId): (PYQ & { company: CompanyId })[] {
  const plan = COMPANY_PYQ_PLAN[company]
  return Object.entries(plan).flatMap(([section, count]) => {
    const sectionId = section as SectionId
    if (sectionId === "comm-interview") {
      return communicationPyqsFor(company, count ?? 0)
    }
    return generateDrills(sectionId, count ?? 0, sectionSeed(company, sectionId)).map(
      (question, i) => ({
        ...question,
        id: `pyq-${company}-${sectionId}-${i + 1}`,
        company,
        section: sectionId,
        year: i % 2 === 0 ? 2026 : 2025,
        frequentlyAsked: i % 3 === 0,
        // Original StudyBench content; the official ID is only the PATTERN basis.
        sourceId: "studybench-curriculum",
        patternSourceId: COMPANY_SOURCE[company],
      }),
    )
  })
}

export const EXPANDED_PYQS: (PYQ & { company: CompanyId })[] = [
  ...generatedPyqsFor("tcs"),
  ...generatedPyqsFor("infosys"),
  ...generatedPyqsFor("wipro"),
  ...generatedPyqsFor("accenture"),
  ...generatedPyqsFor("zoho"),
  ...generatedPyqsFor("cognizant"),
  ...generatedPyqsFor("general"),
]

export const ALL_PYQS: (PYQ & { company: CompanyId })[] = [...PYQS, ...EXPANDED_PYQS]

const PYQS_BY_COMPANY = ALL_PYQS.reduce(
  (acc, question) => {
    acc[question.company].push(question)
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
  } as Record<CompanyId, (PYQ & { company: CompanyId })[]>,
)

const PYQS_BY_SECTION = ALL_PYQS.reduce(
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
  } as Record<SectionId, (PYQ & { company: CompanyId })[]>,
)

export function pyqsForCompany(companyId: CompanyId): (PYQ & { company: CompanyId })[] {
  return PYQS_BY_COMPANY[companyId]
}

const DAILY_CHALLENGE_SIZE = 5

function dailySeedFor(dateKey: string, category: "general" | "aptitude" | "coding"): number {
  const key = `${dateKey}:${category}:daily-challenge`
  let hash = 2166136261
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash)
}

function seededSample(pool: Question[], count: number, seed: number): Question[] {
  const copy = [...pool]
  let state = seed || 1
  function next() {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, count)
}

function languageCodingDailyQuestions(seed: number): Question[] {
  const sets = [
    {
      language: "C",
      questions: [
        {
          prompt: "C output: int x = 5; printf(\"%d\", x++); What is printed?",
          options: ["5", "6", "0", "Compilation error"],
          answer: 0,
          explanation: "Post-increment prints the current value first, then increments x.",
        },
        {
          prompt: "C output: printf(\"%d\", 17 % 5); What is printed?",
          options: ["2", "3", "5", "17"],
          answer: 0,
          explanation: "17 modulo 5 leaves remainder 2.",
        },
        {
          prompt: "C concept: Which loop runs at least once even if the condition is false?",
          options: ["do-while", "for", "while", "foreach"],
          answer: 0,
          explanation: "A do-while loop checks the condition after executing the body once.",
        },
      ],
    },
    {
      language: "C++",
      questions: [
        {
          prompt: "C++ STL: Which container follows LIFO order?",
          options: ["stack", "queue", "vector", "map"],
          answer: 0,
          explanation: "std::stack is last-in-first-out.",
        },
        {
          prompt: "C++ concept: What does pass-by-reference avoid for large objects?",
          options: ["Copying the object", "Compilation", "Function calls", "Variable names"],
          answer: 0,
          explanation: "References allow the function to use the same object instead of copying it.",
        },
        {
          prompt: "C++ output idea: vector indexes start from:",
          options: ["0", "1", "-1", "The vector size"],
          answer: 0,
          explanation: "Like arrays, vector indexing is zero-based.",
        },
      ],
    },
    {
      language: "Java",
      questions: [
        {
          prompt: "Java concept: Which keyword creates an object?",
          options: ["new", "class", "this", "extends"],
          answer: 0,
          explanation: "The new keyword allocates and constructs a new object.",
        },
        {
          prompt: "Java output: \"code\".length() returns:",
          options: ["4", "3", "5", "Compilation error"],
          answer: 0,
          explanation: "The string code has four characters.",
        },
        {
          prompt: "Java OOP: Which keyword is used for inheritance?",
          options: ["extends", "implements", "inherits", "superclass"],
          answer: 0,
          explanation: "A class extends another class in Java inheritance.",
        },
      ],
    },
    {
      language: "Python",
      questions: [
        {
          prompt: "Python output: len([1, 2, 3]) returns:",
          options: ["3", "2", "4", "1"],
          answer: 0,
          explanation: "The list contains three elements.",
        },
        {
          prompt: "Python output: 7 // 2 returns:",
          options: ["3", "3.5", "4", "2"],
          answer: 0,
          explanation: "// performs floor integer division.",
        },
        {
          prompt: "Python concept: Which type stores key-value pairs?",
          options: ["dict", "list", "tuple", "set"],
          answer: 0,
          explanation: "A dictionary stores mappings from keys to values.",
        },
      ],
    },
    {
      language: "JavaScript",
      questions: [
        {
          prompt: "JavaScript output: [1, 2, 3].length is:",
          options: ["3", "2", "4", "undefined"],
          answer: 0,
          explanation: "The array contains three elements.",
        },
        {
          prompt: "JavaScript concept: Which declaration can be reassigned?",
          options: ["let", "const", "class", "import"],
          answer: 0,
          explanation: "let variables can be reassigned; const bindings cannot.",
        },
        {
          prompt: "JavaScript output: typeof \"hello\" returns:",
          options: ["string", "text", "char", "object"],
          answer: 0,
          explanation: "typeof returns string for string values.",
        },
      ],
    },
  ] as const

  return sets.map((set, i) => {
    const item = set.questions[(seed + i) % set.questions.length]
    return {
      id: `daily-coding-${set.language.toLowerCase().replace(/\W+/g, "")}-${seed}-${i}`,
      topic: `${set.language} Programming`,
      difficulty: i % 2 === 0 ? "easy" : "medium",
      prompt: item.prompt,
      options: [...item.options],
      answer: item.answer,
      explanation: item.explanation,
      sourceId: set.language === "Python" ? "python-docs-data-structures" : "studybench-curriculum",
    }
  })
}

/**
 * Pool used to generate the Daily Challenge by category. Combines the curated
 * PYQ bank with fresh practice questions (seeded by the day so
 * a given day's set is stable) - giving students a deep, varied daily set.
 */
export function dailyPool(category: "general" | "aptitude" | "coding"): Question[] {
  const seed = todaySeed()
  if (category === "coding") {
    return [
      ...languageCodingDailyQuestions(seed),
      ...PYQS_BY_SECTION.coding,
      ...generateDrills("coding", 40, seed),
    ]
  }
  if (category === "aptitude") {
    return [
      ...PYQS_BY_SECTION.quant,
      ...PYQS_BY_SECTION.reasoning,
      ...generateDrills("quant", 25, seed),
      ...generateDrills("reasoning", 25, seed + 1),
    ]
  }
  return [...ALL_PYQS, ...generateDrills("mixed", 40, seed + 2)] // general = mixed
}

export function dailyChallengeQuestions(
  category: "general" | "aptitude" | "coding",
  dateKey = new Date().toISOString().slice(0, 10),
): Question[] {
  const seed = dailySeedFor(dateKey, category)
  if (category === "coding") {
    return languageCodingDailyQuestions(seed)
  }
  return seededSample(dailyPool(category), DAILY_CHALLENGE_SIZE, seed)
}



