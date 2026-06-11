import type { CompanyId, InterviewCategory, InterviewQuestion } from "@/lib/types"

/**
 * Interview question bank - for the 6 companies only (NOT general; general is a
 * communication-only track). Each entry is an ORIGINAL question with senior-
 * trainer guidance on HOW to answer (approach, not a memorised script), and a
 * sourceId for provenance.
 */

export const INTERVIEW_CATEGORIES: { id: InterviewCategory; label: string; icon: string }[] = [
  { id: "technical", label: "Technical", icon: "Cpu" },
  { id: "coding", label: "Coding", icon: "Code2" },
  { id: "domain", label: "Company / Domain", icon: "Building2" },
  { id: "hr", label: "HR", icon: "MessagesSquare" },
  { id: "managerial", label: "Managerial", icon: "Briefcase" },
]

let ic = 0
function iq(
  company: CompanyId,
  category: InterviewCategory,
  question: string,
  guidance: string,
  difficulty: InterviewQuestion["difficulty"],
  tags: string[],
  sourceId: string,
): InterviewQuestion {
  ic += 1
  return { id: `iq${ic}`, company, category, question, guidance, difficulty, tags, sourceId }
}

const BASE_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // ===================== TCS =====================
  iq("tcs", "hr", "Tell me about yourself.",
    "Use a 60-second arc: name -> college/branch -> 2 strengths or projects relevant to an IT services role -> why TCS -> close on enthusiasm. Don't recite your resume; pick highlights that lead the panel toward what you want to discuss.",
    "easy", ["self-intro", "communication"], "studybench-curriculum"),
  iq("tcs", "technical", "What is the difference between a primary key and a unique key?",
    "A primary key is unique, NOT NULL, and there's one per table. A unique key enforces uniqueness but allows one NULL and you can have several per table. Mentioning that the primary key often becomes the clustered index earns bonus points.",
    "easy", ["DBMS"], "gfg-cs-core"),
  iq("tcs", "technical", "Explain the four pillars of OOP with a one-line example each.",
    "Encapsulation (private fields + getters), Abstraction (interface hides implementation), Inheritance (a Car extends Vehicle), Polymorphism (one draw() behaves per shape). Give a relatable example for each rather than just definitions.",
    "medium", ["OOP"], "gfg-cs-core"),
  iq("tcs", "coding", "How would you check whether a number is prime?",
    "Handle n < 2 as not prime, then test divisibility from 2 up to sqrtn. State the complexity (O(sqrtn)) and why you stop at the square root - factors pair up around it.",
    "medium", ["math", "loops"], "gfg-dsa"),
  iq("tcs", "technical", "What happens when you type a URL and press Enter?",
    "Walk the layers: DNS resolves the domain to an IP, a TCP (and TLS for HTTPS) connection is set up, the browser sends an HTTP request, the server responds, and the browser renders the page. Even a high-level version shows systems thinking.",
    "medium", ["networks"], "gfg-cs-core"),
  iq("tcs", "domain", "Why do you want to join TCS?",
    "Tie specifics to your goals: scale and exposure (India's largest IT recruiter), structured training (TCS iON / Ignite), and breadth of domains. Avoid generic 'good company' - name what genuinely attracts you.",
    "easy", ["why-company"], "tcs-nqt-official"),
  iq("tcs", "managerial", "Are you willing to relocate and work in any shift?",
    "TCS deploys across India and global clients. If you're flexible, say so clearly and positively. If you have a real constraint, state it honestly but show willingness to adapt - evasiveness reads worse than an honest boundary.",
    "easy", ["flexibility"], "studybench-curriculum"),
  iq("tcs", "hr", "Do you have any questions for us?",
    "Always ask one. Good options: what the first 6 months of training look like, which technologies a fresher typically starts on, or how performance is reviewed. It signals genuine interest.",
    "easy", ["closing"], "studybench-curriculum"),

  // ===================== Infosys =====================
  iq("infosys", "technical", "What is the difference between a stack and a queue?",
    "Stack is LIFO (push/pop one end) - used for undo, recursion, expression evaluation. Queue is FIFO (enqueue rear, dequeue front) - used for scheduling and BFS. Mention a real use case for each.",
    "easy", ["DSA"], "gfg-dsa"),
  iq("infosys", "technical", "What is normalization and why do we aim for 3NF?",
    "Normalization organises tables to remove redundancy and update anomalies: 1NF (atomic), 2NF (no partial dependency), 3NF (no transitive dependency). 3NF balances integrity with reasonable query complexity for most apps.",
    "medium", ["DBMS"], "gfg-cs-core"),
  iq("infosys", "coding", "How would you reverse a singly linked list?",
    "Iterate with three pointers (prev, curr, next), flipping each node's link, returning prev at the end - O(n) time, O(1) space. Be ready to compare with the recursive version and its stack cost.",
    "medium", ["linked-list"], "gfg-dsa"),
  iq("infosys", "technical", "Abstraction vs encapsulation - what's the difference?",
    "Abstraction hides complexity and exposes only WHAT something does (design level - interfaces, abstract classes). Encapsulation bundles data with methods and restricts access to HOW it works (implementation level - private fields). They complement each other.",
    "medium", ["OOP"], "gfg-cs-core"),
  iq("infosys", "domain", "What do you know about Infosys and InfyTQ?",
    "Infosys is a global IT services and consulting firm; InfyTQ is its learning/certification platform many freshers use. Mention its focus on digital transformation and that you've engaged with its learning content if true.",
    "easy", ["why-company"], "infosys-careers"),
  iq("infosys", "hr", "What are your strengths and weaknesses?",
    "Give one strength with a quick proof (a project or result) and one genuine weakness with the concrete action you're taking to improve. Avoid the cliche 'I'm a perfectionist' - panels hear it constantly.",
    "easy", ["self-awareness"], "studybench-curriculum"),
  iq("infosys", "managerial", "How do you keep your technical skills up to date?",
    "Name your actual routine: courses, hands-on projects, InfyTQ/competitive coding, following docs. Concrete habits beat vague 'I love learning'.",
    "easy", ["learning"], "studybench-curriculum"),
  iq("infosys", "hr", "Where do you see yourself in five years?",
    "Show realistic growth and commitment: become strong in a stack, take ownership of modules, grow toward a lead/specialist path - aligned with what the role can offer. Avoid naming an unrelated career.",
    "easy", ["goals"], "studybench-curriculum"),

  // ===================== Wipro =====================
  iq("wipro", "technical", "Explain INNER JOIN vs LEFT JOIN with an example.",
    "INNER JOIN returns only matching rows in both tables; LEFT JOIN returns all left-table rows plus matches (NULLs where none). Sketch two small tables (Students, Marks) and show how an unmatched student appears in LEFT but not INNER.",
    "medium", ["DBMS", "SQL"], "gfg-cs-core"),
  iq("wipro", "coding", "Recursion vs iteration for factorial/Fibonacci - which and why?",
    "Both work; recursion is cleaner but uses the call stack (risk of overflow / repeated work for naive Fibonacci). Iteration (or memoised recursion) is more efficient. Always state the base case first.",
    "medium", ["recursion"], "gfg-dsa"),
  iq("wipro", "technical", "What is a database index and its trade-off?",
    "An index speeds up reads/lookups (like a book's index) but costs extra storage and slows writes, since the index must be updated. You index columns used often in WHERE/JOIN, not every column.",
    "medium", ["DBMS"], "gfg-cs-core"),
  iq("wipro", "domain", "Why Wipro, and what does the 'Spirit of Wipro' mean to you?",
    "Connect to its values-led culture and sustainability focus, plus the scale of client exposure. Personalise it - one specific value or program that resonates beats a memorised slogan.",
    "easy", ["why-company"], "wipro-careers"),
  iq("wipro", "hr", "How do you handle criticism or negative feedback?",
    "Frame it as fuel: listen without defending, clarify, act on it. Give a short STAR example where feedback changed your approach and improved the outcome.",
    "easy", ["behavioural"], "studybench-curriculum"),
  iq("wipro", "hr", "Describe a conflict in a team and how you resolved it.",
    "Use STAR (Situation, Task, Action, Result). Focus on what YOU did to de-escalate and find common ground, and end with the positive result - not on blaming a teammate.",
    "medium", ["teamwork"], "studybench-curriculum"),
  iq("wipro", "managerial", "Are you comfortable signing a service agreement/bond?",
    "Answer with maturity: if you're committed to growing at the company, say so calmly and ask clarifying questions about terms rather than reacting negatively. Honesty plus professionalism is what's assessed.",
    "easy", ["commitment"], "wipro-careers"),

  // ===================== Accenture =====================
  iq("accenture", "technical", "TCP vs UDP - when would you use each?",
    "TCP is connection-oriented and reliable (web, email, file transfer); UDP is connectionless and fast but lossy (live video, gaming, DNS queries). Pick based on whether you need reliability or low latency.",
    "easy", ["networks"], "gfg-cs-core"),
  iq("accenture", "technical", "Explain IaaS, PaaS and SaaS.",
    "Cloud service tiers by how much you manage: IaaS (you manage OS/apps on rented infra - e.g., EC2), PaaS (you deploy code, platform handles infra - e.g., App Engine), SaaS (you just use the app - e.g., Gmail). Relevant since Accenture is consulting + cloud heavy.",
    "medium", ["cloud"], "gfg-cs-core"),
  iq("accenture", "coding", "Swap two numbers without using a temporary variable.",
    "Show the arithmetic trick (a=a+b; b=a-b; a=a-b) or XOR swap, then note the safer real-world choice is usually a temp variable or language tuple-swap. Mentioning overflow risk on the arithmetic version is a plus.",
    "easy", ["logic"], "gfg-dsa"),
  iq("accenture", "domain", "What does Accenture do, and why Accenture?",
    "Accenture spans Strategy & Consulting, Technology, Operations and Song across many industries. Mention the breadth of projects and learning, and connect to a track you're excited about (e.g., cloud or data).",
    "easy", ["why-company"], "accenture-careers"),
  iq("accenture", "hr", "Tell me about a time you led or took initiative.",
    "STAR format. Pick a real example (a project, fest, club) where you drove something. Emphasise the action you owned and a measurable result.",
    "medium", ["leadership"], "studybench-curriculum"),
  iq("accenture", "managerial", "Are you open to learning a completely new technology stack?",
    "A clear yes, backed by evidence: a time you picked up something unfamiliar quickly. Consulting means shifting between client stacks, so adaptability is exactly what they want to hear.",
    "easy", ["adaptability"], "studybench-curriculum"),

  // ===================== Zoho =====================
  iq("zoho", "coding", "Find the second largest element in an array in one pass.",
    "Track the largest and second-largest as you scan once (O(n), O(1)). Handle duplicates and arrays with fewer than two distinct values. Avoid the lazy 'sort then pick' - Zoho rewards efficiency.",
    "medium", ["arrays"], "gfg-dsa"),
  iq("zoho", "coding", "Detect a loop (cycle) in a linked list.",
    "Floyd's cycle detection: slow and fast pointers; if they meet, there's a loop - O(n) time, O(1) space. Be ready to extend to finding the loop's starting node.",
    "hard", ["linked-list"], "gfg-dsa"),
  iq("zoho", "coding", "Reverse the words in a sentence (\"I love code\" -> \"code love I\").",
    "Split on spaces, reverse the word order, rejoin - or do it in place for bonus. Talk through edge cases: multiple spaces, leading/trailing spaces, empty string.",
    "medium", ["strings"], "gfg-dsa"),
  iq("zoho", "coding", "Check whether two strings are anagrams.",
    "Either sort both and compare (O(n log n)) or count character frequencies (O(n)). Mention case/space handling. Lead with the frequency-count approach to show you think about complexity.",
    "easy", ["strings", "hashing"], "gfg-dsa"),
  iq("zoho", "coding", "Print a matrix in spiral order.",
    "Maintain four boundaries (top, bottom, left, right) and shrink them as you traverse each layer. Dry-run a 3x3 to prove correctness before coding - this is a classic Zoho machine-round problem.",
    "hard", ["matrix"], "gfg-dsa"),
  iq("zoho", "technical", "What is the time and space complexity of your solution? Can you optimise it?",
    "Zoho interviewers always probe complexity. State Big-O for time and space up front, then discuss a trade-off (hashing for speed at memory cost, two-pointer to drop a loop). Showing you can optimise matters more than the first answer.",
    "medium", ["complexity"], "gfg-dsa"),
  iq("zoho", "domain", "Why Zoho, and not a services company?",
    "Speak to product engineering: ownership of real features, depth over breadth, strong engineering culture and long-term growth. Genuine enthusiasm for building products lands well here.",
    "medium", ["why-company"], "zoho-careers"),
  iq("zoho", "managerial", "How do you debug when you're completely stuck?",
    "Reproduce the issue, isolate it (print/log, comment out, binary-search the code), form a hypothesis, test it, and check edge cases. Calm, systematic debugging is a core Zoho signal.",
    "medium", ["debugging"], "studybench-curriculum"),

  // ===================== Cognizant =====================
  iq("cognizant", "technical", "What is a deadlock and what conditions cause it?",
    "A deadlock is when processes wait on each other forever. It needs four conditions together: mutual exclusion, hold-and-wait, no preemption, circular wait. Breaking any one prevents it.",
    "medium", ["OS"], "gfg-cs-core"),
  iq("cognizant", "coding", "Automata-Fix style: a loop summing an array returns a wrong total - how do you find the bug?",
    "Check the loop bounds first (i <= n overruns a size-n array), then the accumulator initialisation (sum must start at 0) and that the function returns sum. Reproduce with a small input and trace one iteration.",
    "medium", ["debugging"], "gfg-dsa"),
  iq("cognizant", "technical", "Difference between GET and POST.",
    "GET appends data to the URL, is cacheable and for retrieval; POST sends data in the body, isn't cached, and is for creating/changing data. Mention GET has length limits and shouldn't carry sensitive data.",
    "easy", ["web", "networks"], "gfg-cs-core"),
  iq("cognizant", "domain", "Why Cognizant, and what do you know about the GenC program?",
    "Cognizant is strong in healthcare and BFSI domains; GenC is its entry-level engineering track with structured training. Connect your interest in a domain or in becoming a full-stack/engineering associate.",
    "easy", ["why-company"], "cognizant-careers"),
  iq("cognizant", "hr", "Walk me through your final-year project.",
    "Structure it: the problem, why it mattered, your specific role, the tech stack and a key challenge you solved, and the result. Keep it crisp and be ready for 'what would you improve?'.",
    "easy", ["project"], "studybench-curriculum"),
  iq("cognizant", "managerial", "Can you work night shifts or align to client time zones?",
    "Many Cognizant roles support global clients. If you're flexible, say so positively. If not, be honest but emphasise commitment and willingness to adjust where you can.",
    "easy", ["flexibility"], "cognizant-careers"),
  iq("cognizant", "hr", "How do you handle tight deadlines and pressure?",
    "Show a method: break work down, prioritise the critical path, communicate early if something's at risk. A short real example (exam + project clash you managed) makes it credible.",
    "medium", ["behavioural"], "studybench-curriculum"),
]

/** Interview questions for one company (general has none - it's communication-only). */
const COMPANY_RECRUITER_SIGNALS: Record<CompanyId, {
  process: string
  stack: string[]
  values: string[]
  sourceId: string
}> = {
  general: {
    process: "aptitude assessment, coding practice, CS fundamentals, communication and HR readiness",
    stack: ["aptitude basics", "DSA basics", "DBMS and OS basics", "project explanation", "communication"],
    values: ["placement readiness", "clear thinking", "consistent practice", "interview confidence"],
    sourceId: "studybench-curriculum",
  },
  tcs: {
    process: "NQT, programming logic, technical interview and HR/managerial discussion",
    stack: ["C basics", "OOP", "DBMS", "Java fundamentals", "service delivery"],
    values: ["learning agility", "relocation flexibility", "client communication", "process discipline"],
    sourceId: "tcs-nqt-official",
  },
  infosys: {
    process: "aptitude, pseudocode, hands-on coding, technical interview and HR",
    stack: ["pseudocode", "Python or Java", "DBMS", "OOP", "problem solving"],
    values: ["structured learning", "trainability", "project clarity", "communication"],
    sourceId: "infosys-careers",
  },
  wipro: {
    process: "aptitude, essay or written communication, coding, technical and HR rounds",
    stack: ["SQL", "OOP", "Java basics", "loops", "written English"],
    values: ["adaptability", "professional communication", "feedback maturity", "commitment"],
    sourceId: "wipro-careers",
  },
  accenture: {
    process: "cognitive assessment, technical fundamentals, coding and communication assessment",
    stack: ["cloud basics", "networks", "pseudocode", "SQL", "consulting scenarios"],
    values: ["client orientation", "fast learning", "team collaboration", "clear communication"],
    sourceId: "accenture-careers",
  },
  zoho: {
    process: "programming rounds, advanced coding, machine round, technical interview and HR",
    stack: ["arrays", "strings", "recursion", "matrix problems", "debugging"],
    values: ["deep problem solving", "product thinking", "code ownership", "debugging patience"],
    sourceId: "zoho-careers",
  },
  cognizant: {
    process: "GenC aptitude, automata-style coding, technical interview and HR",
    stack: ["automata fix", "DBMS", "OS basics", "web basics", "project explanation"],
    values: ["client readiness", "deadline handling", "communication", "learning mindset"],
    sourceId: "cognizant-careers",
  },
}

const TECHNICAL_PROMPTS = [
  ["Explain one project module you built end to end.", "project", "studybench-curriculum"],
  ["Explain the difference between compile-time and runtime errors.", "fundamentals", "gfg-cs-core"],
  ["How would you choose between an array and a linked list?", "data-structures", "gfg-dsa"],
  ["What is the difference between WHERE and HAVING in SQL?", "sql", "gfg-cs-core"],
  ["Explain HTTP request and response in simple terms.", "web", "gfg-cs-core"],
  ["What is exception handling and why is it useful?", "programming", "gfg-cs-core"],
  ["How do you test a function before submitting it?", "testing", "studybench-curriculum"],
  ["What is the difference between class and object?", "oop", "gfg-cs-core"],
] as const

const CODING_PROMPTS = [
  ["Walk through your approach before coding a string frequency problem.", "strings"],
  ["How would you dry-run a two-pointer solution?", "two-pointer"],
  ["How do you handle edge cases in array problems?", "arrays"],
  ["What will you do if your code passes samples but fails hidden tests?", "debugging"],
  ["Explain time complexity to a non-technical interviewer.", "complexity"],
  ["How would you optimize a nested loop solution?", "optimization"],
] as const

const HR_PROMPTS = [
  ["Tell me about yourself for this company and role.", "self-intro"],
  ["Describe a time you worked with a difficult teammate.", "teamwork"],
  ["What is one weakness you are actively improving?", "self-awareness"],
  ["Why should we hire you over another fresher?", "fit"],
  ["How do you handle pressure during assessments?", "pressure"],
  ["What would you do if assigned a technology you have never used?", "adaptability"],
] as const

const MANAGERIAL_PROMPTS = [
  ["How would you plan your first 30 days after joining?", "joining-readiness"],
  ["How do you decide priorities when two tasks are urgent?", "prioritization"],
  ["How will you communicate if you are blocked on a task?", "ownership"],
  ["Tell me about a decision you took without waiting for instructions.", "initiative"],
] as const

const COMPANY_CATEGORY_PROMPTS: Record<CompanyId, Record<InterviewCategory, string[]>> = {
  general: {
    technical: [
      "Explain the strongest technical project on your resume from problem to result.",
      "What is the difference between OOP, DBMS, OS and CN preparation for interviews?",
      "Explain one concept you recently learned and how you practised it.",
      "How do you revise CS core subjects before a campus interview?",
      "What should a fresher know about APIs, databases and deployment?",
      "How would you answer if the interviewer asks a topic you have not prepared?",
    ],
    coding: [
      "How do you approach an unknown coding question in the first five minutes?",
      "Explain how you find edge cases for arrays, strings and number-logic problems.",
      "How do you convert a brute-force idea into an optimized solution?",
      "How do you dry-run code so hidden test cases are less likely to fail?",
      "What is your plan when you get stuck during live coding?",
      "Explain time and space complexity using one solved example.",
    ],
    domain: [
      "Why should a fresher build core skills before company-specific preparation?",
      "How does aptitude, coding, CS core and communication combine in placements?",
      "What is your current placement preparation strategy?",
      "Which section is your weakest and what are you doing about it?",
      "How will you choose your target companies after strengthening your basics?",
      "How do you measure whether you are interview-ready?",
    ],
    hr: [
      "Tell me about yourself for a fresher software role.",
      "What are your strengths and weaknesses as a candidate?",
      "Describe a time you learned something difficult without external pressure.",
      "How do you handle rejection or a failed mock test?",
      "Why should we hire you as a fresher?",
      "What are your short-term and long-term career goals?",
    ],
    managerial: [
      "How would you plan 30 days of self-training before a placement drive?",
      "How do you prioritize aptitude, coding and interview practice?",
      "How will you communicate when you are blocked in a team project?",
      "Tell me about a time you took ownership without being asked.",
      "How do you track progress honestly instead of only collecting resources?",
      "How would you recover after performing poorly in one interview round?",
    ],
  },
  tcs: {
    technical: [
      "Explain OOP pillars with examples from your project.",
      "What is normalization and why is it useful in a service project database?",
      "Explain deadlock and how it can be prevented.",
      "What happens when a browser sends an HTTPS request?",
      "Explain exception handling in Java or Python.",
      "Walk through one resume project and the exact module you owned.",
    ],
    coding: [
      "How would you solve a digit-sum or number-logic problem in TCS NQT style?",
      "Explain a program to check prime numbers and its complexity.",
      "How do you debug a C/Java output question with loops and operators?",
      "How would you handle two coding questions under a fixed assessment timer?",
      "Explain how you test boundary cases for strings and arrays.",
      "How do you improve from NQT programming logic to hands-on coding?",
    ],
    domain: [
      "Why TCS, and how does your preparation match NQT plus interview rounds?",
      "What do you know about TCS iON and the NQT route?",
      "How would you prepare differently for Ninja, Digital or Prime-style expectations?",
      "Why are adaptability and client communication important at TCS?",
      "Which TCS business area or technology theme interests you?",
      "How will you contribute as a fresher in a large delivery team?",
    ],
    hr: [
      "Are you willing to relocate and work with client time zones?",
      "Tell me about yourself in a way relevant to TCS.",
      "Why should TCS hire you as a fresher?",
      "What are your strengths and weaknesses?",
      "How do you handle routine work while still learning?",
      "Do you have any questions for the interviewer?",
    ],
    managerial: [
      "How would you handle being assigned to a technology outside your preference?",
      "How do you manage deadlines in a client project?",
      "Tell me about a time you led a small team.",
      "How would you respond if a client changes requirements late?",
      "How do you show accountability when your code breaks a workflow?",
      "What would your first 90 days at TCS look like?",
    ],
  },
  infosys: {
    technical: [
      "Explain stack vs queue and where each is used.",
      "What is 3NF and why does database design matter?",
      "Explain abstraction vs encapsulation with a Java or Python example.",
      "What is SDLC and where does testing fit?",
      "Explain joins in SQL with one practical example.",
      "Walk through your project architecture and data flow.",
    ],
    coding: [
      "How do you solve pseudocode questions accurately?",
      "Explain reversing a linked list step by step.",
      "How would you count character frequency in a string?",
      "How do you convert pseudocode into working Java or Python?",
      "Explain how you handle hidden cases in InfyTQ-style coding.",
      "How do you dry-run nested loops without losing track?",
    ],
    domain: [
      "What do you know about Infosys and its graduate hiring path?",
      "How does InfyTQ-style learning help a fresher?",
      "Why Infosys for your first software role?",
      "How will you use structured training to become productive?",
      "Which digital technology area at Infosys interests you?",
      "How does your project show trainability?",
    ],
    hr: [
      "Tell me about yourself for Infosys.",
      "Where do you see yourself in five years?",
      "What are your strengths and weaknesses?",
      "How do you keep your technical skills updated?",
      "Describe a time you accepted feedback.",
      "Why should Infosys select you?",
    ],
    managerial: [
      "How would you learn a new stack during training?",
      "How do you plan work when requirements are not clear?",
      "Tell me about a time you handled a team conflict.",
      "How do you balance quality and speed?",
      "What would you do if your assigned module is delayed?",
      "How would you communicate status to a mentor or lead?",
    ],
  },
  wipro: {
    technical: [
      "Explain INNER JOIN vs LEFT JOIN with a small example.",
      "Explain OOP concepts used in your project.",
      "What is an index in DBMS and what is the trade-off?",
      "Explain OS process vs thread.",
      "What are arrays and strings, and where do beginners make mistakes?",
      "Walk through your project and the testing you performed.",
    ],
    coding: [
      "How would you solve a basic array or string problem in Wipro Elite NTH style?",
      "Explain recursion vs iteration using factorial or Fibonacci.",
      "How do you write clean logic for loops and functions?",
      "How do you handle two coding questions with different difficulty levels?",
      "What is your debugging checklist for off-by-one errors?",
      "How do you practise coding after the written communication section?",
    ],
    domain: [
      "Why Wipro, and what does its culture mean to you?",
      "What do you know about Wipro's early-career opportunities?",
      "How do you connect written communication to client work?",
      "Why are adaptability and continuous learning important at Wipro?",
      "How will you handle a service agreement or commitment discussion?",
      "Which Wipro value or work area connects with your goals?",
    ],
    hr: [
      "Tell me about yourself for Wipro.",
      "Are you comfortable with relocation or work location changes?",
      "How do you handle criticism?",
      "Describe a conflict in a team and how you resolved it.",
      "What are your salary or role expectations as a fresher?",
      "Why should Wipro hire you?",
    ],
    managerial: [
      "How would you improve after negative feedback from a lead?",
      "How do you communicate when you miss a deadline?",
      "Tell me about a time you showed commitment.",
      "How would you handle repetitive but important project work?",
      "How do you plan training and project learning together?",
      "What would make you a dependable fresher in a client team?",
    ],
  },
  accenture: {
    technical: [
      "Explain IaaS, PaaS and SaaS with examples.",
      "What is TCP vs UDP and when would you use each?",
      "Explain SQL joins and a simple query from your project.",
      "What are APIs and how do frontend and backend communicate?",
      "Explain one cloud or data concept at a fresher level.",
      "Walk through your project from client problem to technical solution.",
    ],
    coding: [
      "How do you solve pseudocode questions in an Accenture technical assessment?",
      "Explain swapping two numbers and the safer real-world approach.",
      "How would you debug a simple loop or conditional program?",
      "How do you handle array, string and sorting basics under time pressure?",
      "How would you explain your code to a non-technical evaluator?",
      "How do you prepare after clearing cognitive and technical MCQs?",
    ],
    domain: [
      "What does Accenture do, and why do you want to join?",
      "How do consulting, technology and operations work together?",
      "Why is communication important after the assessment round?",
      "Which Accenture technology area interests you: cloud, data, web engineering or security?",
      "How would you work with changing client requirements?",
      "How does your preparation match Accenture's assessment and interview flow?",
    ],
    hr: [
      "Tell me about yourself for Accenture.",
      "Tell me about a time you took initiative.",
      "How do you work in a team with different opinions?",
      "Are you open to learning a completely new technology stack?",
      "What does client value mean to you?",
      "Why should Accenture select you?",
    ],
    managerial: [
      "How would you handle a client-facing task as a fresher?",
      "How do you prioritize learning when a project moves fast?",
      "Tell me about a time you adapted quickly.",
      "How would you report risk early to a manager?",
      "How do you keep communication concise in a distributed team?",
      "What would your first project behavior at Accenture look like?",
    ],
  },
  zoho: {
    technical: [
      "Explain time and space complexity for a solution you wrote.",
      "How do arrays, strings and hash maps solve common Zoho problems?",
      "Explain recursion with a base case and dry run.",
      "What is the difference between stack and recursion stack?",
      "Explain how you designed or improved one project feature.",
      "How do you debug a program when output is partly correct?",
    ],
    coding: [
      "Find the second largest element in one pass.",
      "How would you print a matrix in spiral order?",
      "How do you check anagrams using frequency counts?",
      "How would you solve a pattern-printing problem cleanly?",
      "Explain cycle detection in a linked list.",
      "How do you approach Zoho machine-round style problems?",
    ],
    domain: [
      "Why Zoho, and why product engineering?",
      "What does product ownership mean for a fresher?",
      "How do you think about customer impact while coding?",
      "Which Zoho product or engineering idea interests you?",
      "Why does Zoho value debugging and depth over memorized answers?",
      "How does your project show that you can build usable software?",
    ],
    hr: [
      "Tell me about yourself for Zoho.",
      "Why do you want a product role instead of only a generic IT role?",
      "How do you handle being stuck on a hard coding problem?",
      "Tell me about a time you built something independently.",
      "What do you do when your first solution is inefficient?",
      "Why should Zoho select you?",
    ],
    managerial: [
      "How would you debug a production-like issue step by step?",
      "How do you balance feature completeness and clean code?",
      "Tell me about a time you improved a project after feedback.",
      "How would you explain a technical trade-off to a non-technical user?",
      "How do you plan a machine-round problem before coding?",
      "What would make you valuable in a product team?",
    ],
  },
  cognizant: {
    technical: [
      "Explain deadlock and its four conditions.",
      "What is GET vs POST and when would you use each?",
      "Explain SQL joins and one query you can write confidently.",
      "What is OOP and how did you use it in a project?",
      "Explain OS process, thread and scheduling at a fresher level.",
      "Walk through your final-year project with your exact contribution.",
    ],
    coding: [
      "How do you approach Automata Fix-style debugging?",
      "How would you find and fix an off-by-one loop bug?",
      "Explain summing positives or filtering values in an array.",
      "How do you test SQL, Java or web basics before an interview?",
      "How do you handle simple coding plus communication expectations?",
      "What is your strategy for hidden test cases in debugging rounds?",
    ],
    domain: [
      "What do you know about Cognizant GenC?",
      "How does your preparation match communication, aptitude and technical assessment?",
      "Why Cognizant for your first role?",
      "Which domain such as healthcare, BFSI or digital engineering interests you?",
      "How do you prepare for technical plus HR-style panel questions?",
      "How will you contribute during training and early project work?",
    ],
    hr: [
      "Tell me about yourself for Cognizant.",
      "Can you work with client time zones or shifting priorities?",
      "How do you handle tight deadlines?",
      "Describe your final-year project clearly.",
      "What are your career aspirations?",
      "Why should Cognizant select you?",
    ],
    managerial: [
      "How would you communicate if a task is blocked?",
      "How do you handle pressure during onboarding or training?",
      "Tell me about a time you learned a tool quickly.",
      "How would you manage quality when deadlines are tight?",
      "How do you keep track of mistakes and improve?",
      "What would your first 60 days in GenC look like?",
    ],
  },
}

function generatedInterviewQuestion(
  company: CompanyId,
  index: number,
): InterviewQuestion {
  const signal = COMPANY_RECRUITER_SIGNALS[company]
  const bucket = index % 5

  if (bucket === 0) {
    const [fallbackPrompt, tag, sourceId] = TECHNICAL_PROMPTS[index % TECHNICAL_PROMPTS.length]
    const prompt = interviewPromptVariant(
      COMPANY_CATEGORY_PROMPTS[company].technical[index % COMPANY_CATEGORY_PROMPTS[company].technical.length] ?? fallbackPrompt,
      company,
      "technical",
      index,
    )
    const stackItem = signal.stack[index % signal.stack.length]
    return iq(
      company,
      "technical",
      prompt,
      `I would answer this in three parts. First, I would give the core idea in simple words. Then I would connect it to one project or lab example I have actually done. Finally, I would mention one limitation or trade-off, because that shows I understand it beyond the definition.`,
      index % 3 === 0 ? "medium" : "easy",
      [tag, stackItem.toLowerCase().replace(/\s+/g, "-")],
      sourceId,
    )
  }

  if (bucket === 1) {
    const [fallbackPrompt, tag] = CODING_PROMPTS[index % CODING_PROMPTS.length]
    const prompt = interviewPromptVariant(
      COMPANY_CATEGORY_PROMPTS[company].coding[index % COMPANY_CATEGORY_PROMPTS[company].coding.length] ?? fallbackPrompt,
      company,
      "coding",
      index,
    )
    return iq(
      company,
      "coding",
      prompt,
      "I would not jump directly into code. I would first read the input format, ask about limits if they are not clear, and write down cases like empty input, one element, duplicates, negative values and very large values. Then I would explain the simple brute-force idea, improve it, and dry-run one sample so the interviewer can see how I think.",
      index % 4 === 0 ? "hard" : "medium",
      [tag, "problem-solving"],
      "gfg-dsa",
    )
  }

  if (bucket === 2) {
    const prompt = interviewPromptVariant(
      COMPANY_CATEGORY_PROMPTS[company].domain[index % COMPANY_CATEGORY_PROMPTS[company].domain.length],
      company,
      "domain",
      index,
    )
    return iq(
      company,
      "domain",
      prompt,
      `I would keep this honest and specific. I would say that I know the process includes ${signal.process}, and my preparation matches it through ${signal.values[0]} and ${signal.values[1]}. Then I would add one personal reason, such as the kind of work I want to learn or the way this company fits my first-job goals.`,
      "easy",
      ["why-company", "process-awareness"],
      signal.sourceId,
    )
  }

  if (bucket === 3) {
    const [fallbackPrompt, tag] = HR_PROMPTS[index % HR_PROMPTS.length]
    const prompt = interviewPromptVariant(
      COMPANY_CATEGORY_PROMPTS[company].hr[index % COMPANY_CATEGORY_PROMPTS[company].hr.length] ?? fallbackPrompt,
      company,
      "hr",
      index,
    )
    return iq(
      company,
      "hr",
      prompt,
      `I would use one real incident, not a polished story. I would briefly say what happened, what my responsibility was, what I personally did, and what changed after that. Since this checks ${signal.values[index % signal.values.length]}, I would make sure my answer shows that quality through an actual action.`,
      "easy",
      [tag, "communication"],
      "studybench-curriculum",
    )
  }

  const [fallbackPrompt, tag] = MANAGERIAL_PROMPTS[index % MANAGERIAL_PROMPTS.length]
  const prompt = interviewPromptVariant(
    COMPANY_CATEGORY_PROMPTS[company].managerial[index % COMPANY_CATEGORY_PROMPTS[company].managerial.length] ?? fallbackPrompt,
    company,
    "managerial",
    index,
  )
  return iq(
    company,
    "managerial",
    prompt,
    "I would answer calmly, like someone who can be trusted with work. I would say that I first clarify the goal, break the task into smaller parts, update the lead early if I am blocked, and take responsibility for the result. I would avoid big claims and give one small example where I followed this approach.",
    index % 2 === 0 ? "medium" : "easy",
    [tag, "ownership"],
    "studybench-curriculum",
  )
}

export const GENERATED_INTERVIEW_QUESTIONS: InterviewQuestion[] = (Object.keys(
  COMPANY_RECRUITER_SIGNALS,
) as CompanyId[]).flatMap((company) =>
  Array.from({ length: company === "zoho" || company === "general" ? 110 : 90 }, (_, index) =>
    generatedInterviewQuestion(company, index),
  ),
)

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  ...BASE_INTERVIEW_QUESTIONS,
  ...GENERATED_INTERVIEW_QUESTIONS,
].map(withHumanGuidance)

const INTERVIEW_BY_COMPANY = INTERVIEW_QUESTIONS.reduce(
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
  } as Record<CompanyId, InterviewQuestion[]>,
)

export function interviewForCompany(companyId: CompanyId): InterviewQuestion[] {
  return INTERVIEW_BY_COMPANY[companyId]
}

export function interviewCount(companyId: CompanyId): number {
  return interviewForCompany(companyId).length
}

function withHumanGuidance(question: InterviewQuestion): InterviewQuestion {
  return {
    ...question,
    guidance: humanTrainerGuidance(question),
  }
}

function interviewPromptVariant(prompt: string, company: CompanyId, category: InterviewCategory, index: number) {
  const focusByCategory: Record<InterviewCategory, string[]> = {
    technical: [
      "definition and one project example",
      "trade-off and common mistake",
      "interview follow-up explanation",
      "real-world use case",
      "short answer first, then depth",
      "freshers-level clarity",
    ],
    coding: [
      "brute force to optimized approach",
      "edge cases and hidden tests",
      "time complexity explanation",
      "dry run on sample input",
      "debugging thought process",
      "clean code structure",
    ],
    domain: [
      "company process awareness",
      "first-role learning mindset",
      "service or product fit",
      "training readiness",
      "client or user impact",
      "personal preparation link",
    ],
    hr: [
      "honest example",
      "measurable improvement",
      "teamwork evidence",
      "pressure handling",
      "learning from failure",
      "career clarity",
    ],
    managerial: [
      "ownership under ambiguity",
      "status communication",
      "quality under deadline",
      "conflict handling",
      "prioritization",
      "first 60 days",
    ],
  }
  const focus = focusByCategory[category][Math.floor(index / 5) % focusByCategory[category].length]
  const cycle = Math.floor(index / (5 * focusByCategory[category].length)) + 1
  const companyLabel = company === "general" ? "core placement" : company.toUpperCase()
  return `${prompt} Focus on ${focus}. (${companyLabel} set ${cycle})`
}

function humanTrainerGuidance(q: InterviewQuestion): string {
  const company = COMPANY_RECRUITER_SIGNALS[q.company]
  const companyName = q.company === "general" ? "this role" : q.company.toUpperCase()
  const prompt = q.question.toLowerCase()

  if (prompt.includes("tell me about yourself")) {
    return "I would keep it natural and around one minute. I would start with my name, branch and current focus, then mention one project or skill that fits the role, and close with why I am interested in this company. I would not repeat every resume line. I would speak like I am introducing myself to a senior, not reading a script."
  }

  if (prompt.includes("edge case")) {
    return "I would say that I look for edge cases before coding, because many wrong answers fail on small details. For arrays, I check empty input, one element, duplicates, sorted or reverse order, negative numbers and very large values. For strings, I check empty string, spaces, case sensitivity and repeated characters. For number problems, I check 0, 1, negative values, overflow and boundary limits. After that I dry-run one normal case and one tricky case."
  }

  if (prompt.includes("why") && (prompt.includes("join") || prompt.includes(q.company) || prompt.includes("company"))) {
    return `I would avoid saying only "it is a good company." I would mention one concrete thing I know about ${companyName}, connect it to my preparation, and say what I hope to learn in my first role. A strong answer should feel personal: the interviewer should hear that I have thought about the company, not memorised two lines from the internet.`
  }

  if (prompt.includes("project")) {
    return "I would explain my project in a simple flow: what problem it solved, who would use it, what my exact contribution was, and one difficulty I faced. I would also be ready to explain the database, APIs, logic and testing because interviewers usually ask follow-up questions from the project."
  }

  if (q.category === "coding") {
    return "I would first slow down and understand the input, output and constraints. Then I would say the brute-force approach out loud, because it shows I know the basic logic. After that I would improve it using a better data structure or pattern if needed. While coding, I would keep talking through my choices and dry-run with a small example so the interviewer can follow my thinking."
  }

  if (q.category === "technical") {
    return "I would answer with a clear definition first, then one small example from a project, lab work or daily software use. If there is a trade-off, I would mention it briefly. My goal would be to show that I understand the concept well enough to use it, not just remember textbook wording."
  }

  if (q.category === "domain") {
    return `I would show that I know the company process, not just the company name. For this track, the preparation connects to ${company.process}. I would mention one strength I am building, like ${company.values[0]}, and one area I am still improving. That sounds more believable than pretending I know everything.`
  }

  if (q.category === "hr") {
    return "I would keep the answer honest and specific. I would choose one real incident, say what happened, what I did, and what I learned from it. HR answers should not sound perfect. A little self-awareness is good, as long as I also show that I am improving."
  }

  return "I would answer like a fresher who is dependable. First I would clarify what needs to be done, then break it into steps, communicate early if I am stuck, and take ownership until the task is closed. I would support it with one real example from a project, internship, club work or college assignment."
}

