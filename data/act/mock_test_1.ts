import type { DemoQuestion } from '@/types';
import type { ExamSection } from '@/components/shared/ExamInterface';

// ── English (8 q / 10 min) ──────────────────────────────────────────────────
const english: DemoQuestion[] = [
  {
    id: 'act1-eng-01',
    subject: 'ACT English',
    topic: 'Punctuation — Commas',
    category: 'ACT_PREP',
    difficulty: 'EASY',
    question:
      'Choose the best punctuation for the underlined portion:\n\n"The team worked tirelessly[,] hoping to finish the project before the deadline."',
    options: [
      { id: 'a', content: 'tirelessly, hoping' },
      { id: 'b', content: 'tirelessly; hoping' },
      { id: 'c', content: 'tirelessly: hoping' },
      { id: 'd', content: 'tirelessly hoping' },
    ],
    correctAnswerId: 'a',
    explanation:
      '"Hoping to finish the project before the deadline" is a participial phrase modifying "the team." Such trailing participial phrases are set off from the main clause by a comma. A semicolon (B) joins two independent clauses; a colon (C) introduces a list or explanation; no punctuation (D) makes the sentence harder to parse.',
    points: 1,
    tags: ['punctuation', 'participial-phrase', 'comma', 'act-english'],
  },
  {
    id: 'act1-eng-02',
    subject: 'ACT English',
    topic: 'Grammar — Pronoun Case',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Choose the best version of the underlined portion:\n\n"Between you and [I/me], the project was poorly managed from the start."',
    options: [
      { id: 'a', content: 'I' },
      { id: 'b', content: 'me' },
      { id: 'c', content: 'myself' },
      { id: 'd', content: 'we' },
    ],
    correctAnswerId: 'b',
    explanation:
      '"Between" is a preposition, so it requires an object pronoun — "me," not the subject pronoun "I." Test: would you say "between I" or "between me"? "Myself" is a reflexive/emphatic pronoun and should not be used as a standalone object. "Between we" is also incorrect.',
    points: 1,
    tags: ['pronoun-case', 'object-pronoun', 'grammar', 'act-english'],
  },
  {
    id: 'act1-eng-03',
    subject: 'ACT English',
    topic: 'Sentence Structure — Fragments',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Which version is a complete sentence (not a fragment)?',
    options: [
      { id: 'a', content: 'Running through the park in the early morning.' },
      { id: 'b', content: 'Because the meeting had been postponed twice already.' },
      { id: 'c', content: 'The director announced the changes at the all-hands meeting.' },
      { id: 'd', content: 'Having considered all the available options for the project.' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Option C has a complete subject ("The director"), a complete predicate ("announced"), and expresses a complete thought. Options A and D are participial phrases (no main verb). Option B is a dependent clause beginning with "Because" — it cannot stand alone as a sentence.',
    points: 1,
    tags: ['sentence-structure', 'fragments', 'act-english'],
  },
  {
    id: 'act1-eng-04',
    subject: 'ACT English',
    topic: 'Rhetorical Skills — Transitions',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      '"Solar energy installation costs have dropped 90% over the past two decades. _____, many households in lower-income areas still cannot afford upfront installation fees."\n\nWhich transition is most logical?',
    options: [
      { id: 'a', content: 'As a result' },
      { id: 'b', content: 'For example' },
      { id: 'c', content: 'Similarly' },
      { id: 'd', content: 'Despite this' },
    ],
    correctAnswerId: 'd',
    explanation:
      '"Despite this" correctly signals a contrast: costs fell dramatically, yet affordability barriers remain. "As a result" (A) implies causation — the opposite relationship. "For example" (B) introduces an illustration. "Similarly" (C) signals likeness. None fits the adversative relationship except "Despite this."',
    points: 1,
    tags: ['transitions', 'rhetoric', 'act-english'],
  },
  {
    id: 'act1-eng-05',
    subject: 'ACT English',
    topic: 'Grammar — Verb Agreement',
    category: 'ACT_PREP',
    difficulty: 'EASY',
    question:
      'Choose the grammatically correct version:\n\n"The number of applications _____ increased significantly since last year."',
    options: [
      { id: 'a', content: 'have' },
      { id: 'b', content: 'has' },
      { id: 'c', content: 'are' },
      { id: 'd', content: 'were' },
    ],
    correctAnswerId: 'b',
    explanation:
      '"The number of" takes a singular verb ("has"). Contrast with "A number of applications" which takes a plural verb ("have"). Here, "the number" is the subject — singular — so "has increased" is correct.',
    points: 1,
    tags: ['subject-verb-agreement', 'number-of', 'grammar', 'act-english'],
  },
  {
    id: 'act1-eng-06',
    subject: 'ACT English',
    topic: 'Style — Redundancy',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Which option BEST eliminates redundancy?\n\n"The free gift was given at no charge to every customer who purchased a qualifying item."',
    options: [
      { id: 'a', content: 'The free gift was given at no charge to every customer who purchased a qualifying item.' },
      { id: 'b', content: 'The gift was given free of charge to every qualifying customer.' },
      { id: 'c', content: 'Every customer received a free gift for free when purchasing a qualifying item.' },
      { id: 'd', content: 'The free gift, given without cost, was provided to qualifying purchasers.' },
    ],
    correctAnswerId: 'b',
    explanation:
      '"Free gift" and "at no charge" are redundant — a gift is by definition free. Option B says "given free of charge" (one expression), removes "free" from "gift," and simplifies the clause. Options A and C both use "free" twice; D says "free" and "without cost."',
    points: 1,
    tags: ['style', 'redundancy', 'conciseness', 'act-english'],
  },
  {
    id: 'act1-eng-07',
    subject: 'ACT English',
    topic: 'Grammar — Apostrophes',
    category: 'ACT_PREP',
    difficulty: 'EASY',
    question:
      'Choose the correct version:\n\n"The [companys / company\'s / companies\' / companies] new policy took effect immediately."',
    options: [
      { id: 'a', content: 'companys' },
      { id: 'b', content: "company's" },
      { id: 'c', content: "companies'" },
      { id: 'd', content: 'companies' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The sentence refers to a policy belonging to one company (singular possessive). For singular nouns, form the possessive by adding \'s: "company\'s." "Companys" (A) is not a word. "Companies\'" (C) is plural possessive. "Companies" (D) is just the plural with no possessive.',
    points: 1,
    tags: ['apostrophe', 'possessives', 'act-english'],
  },
  {
    id: 'act1-eng-08',
    subject: 'ACT English',
    topic: 'Rhetorical Skills — Purpose',
    category: 'ACT_PREP',
    difficulty: 'HARD',
    question:
      'A writer adds the following sentence to a paragraph about technological unemployment: "Historical economic transitions, such as the Industrial Revolution, ultimately created more jobs than they eliminated."\n\nWhat is the most likely purpose of this addition?',
    options: [
      { id: 'a', content: 'To prove that automation will have no negative effects on employment' },
      { id: 'b', content: 'To suggest that long-run job creation may offset short-term automation-related job losses' },
      { id: 'c', content: 'To argue that governments should prevent the adoption of automation technology' },
      { id: 'd', content: 'To demonstrate that economists have fully predicted the future of the labor market' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The historical analogy (Industrial Revolution) is used as evidence that past disruptions created net positive employment outcomes — implying the same may be true for automation. Option B accurately captures this qualified optimistic argument. A overclaims; C and D introduce conclusions not supported by the sentence.',
    points: 2,
    tags: ['rhetorical-skills', 'purpose', 'argumentation', 'act-english'],
  },
];

// ── Mathematics (8 q / 12 min, calculator allowed) ──────────────────────────
const mathematics: DemoQuestion[] = [
  {
    id: 'act1-math-01',
    subject: 'ACT Math',
    topic: 'Pre-Algebra — Fractions',
    category: 'ACT_PREP',
    difficulty: 'EASY',
    question: 'What is the value of (3/4) ÷ (9/16)?',
    options: [
      { id: 'a', content: '1/3' },
      { id: 'b', content: '4/3' },
      { id: 'c', content: '27/64' },
      { id: 'd', content: '3/4' },
    ],
    correctAnswerId: 'b',
    explanation:
      'To divide fractions, multiply by the reciprocal: (3/4) × (16/9) = 48/36 = 4/3.',
    points: 1,
    tags: ['fractions', 'division', 'pre-algebra', 'act-math'],
  },
  {
    id: 'act1-math-02',
    subject: 'ACT Math',
    topic: 'Algebra — Linear Equations',
    category: 'ACT_PREP',
    difficulty: 'EASY',
    question:
      'If 7 − 2x = 3, what is the value of x?',
    options: [
      { id: 'a', content: '−2' },
      { id: 'b', content: '2' },
      { id: 'c', content: '5' },
      { id: 'd', content: '−5' },
    ],
    correctAnswerId: 'b',
    explanation:
      '7 − 2x = 3 → −2x = −4 → x = 2.',
    points: 1,
    tags: ['linear-equations', 'algebra', 'act-math'],
  },
  {
    id: 'act1-math-03',
    subject: 'ACT Math',
    topic: 'Geometry — Angles',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Two parallel lines are cut by a transversal. One of the co-interior (same-side interior) angles measures 112°. What is the measure of its co-interior angle partner?',
    options: [
      { id: 'a', content: '68°' },
      { id: 'b', content: '112°' },
      { id: 'c', content: '48°' },
      { id: 'd', content: '90°' },
    ],
    correctAnswerId: 'a',
    explanation:
      'Co-interior angles (also called consecutive interior or same-side interior angles) formed by parallel lines and a transversal are supplementary — they add to 180°. 180° − 112° = 68°.',
    points: 1,
    tags: ['geometry', 'parallel-lines', 'angles', 'act-math'],
  },
  {
    id: 'act1-math-04',
    subject: 'ACT Math',
    topic: 'Trigonometry',
    category: 'ACT_PREP',
    difficulty: 'HARD',
    question:
      'In right triangle PQR, angle Q = 90°, PQ = 12, and QR = 5. What is tan(P)?',
    options: [
      { id: 'a', content: '5/13' },
      { id: 'b', content: '12/13' },
      { id: 'c', content: '5/12' },
      { id: 'd', content: '12/5' },
    ],
    correctAnswerId: 'c',
    explanation:
      'In triangle PQR with Q = 90°: hypotenuse PR = √(12² + 5²) = √(144 + 25) = √169 = 13. For angle P: opposite = QR = 5, adjacent = PQ = 12. tan(P) = opposite/adjacent = 5/12.',
    points: 2,
    tags: ['trigonometry', 'right-triangle', 'act-math'],
  },
  {
    id: 'act1-math-05',
    subject: 'ACT Math',
    topic: 'Algebra — Inequalities',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Which set of values satisfies −3 < 2x + 1 ≤ 9?',
    options: [
      { id: 'a', content: '−2 < x ≤ 4' },
      { id: 'b', content: '−1 < x ≤ 4' },
      { id: 'c', content: '−2 < x < 4' },
      { id: 'd', content: '−2 ≤ x ≤ 4' },
    ],
    correctAnswerId: 'a',
    explanation:
      'Subtract 1 throughout: −4 < 2x ≤ 8. Divide by 2: −2 < x ≤ 4. The left inequality is strict (< not ≤), and the right is inclusive (≤). Option A is correct.',
    points: 2,
    tags: ['inequalities', 'compound-inequality', 'act-math'],
  },
  {
    id: 'act1-math-06',
    subject: 'ACT Math',
    topic: 'Statistics',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A data set is: {5, 8, 3, 12, 7, 9, 3, 6}. What is the mode?',
    options: [
      { id: 'a', content: '3' },
      { id: 'b', content: '5' },
      { id: 'c', content: '6' },
      { id: 'd', content: '7' },
    ],
    correctAnswerId: 'a',
    explanation:
      'The mode is the most frequently occurring value. In {3, 3, 5, 6, 7, 8, 9, 12}, the value 3 appears twice while all others appear once. Mode = 3.',
    points: 1,
    tags: ['statistics', 'mode', 'act-math'],
  },
  {
    id: 'act1-math-07',
    subject: 'ACT Math',
    topic: 'Coordinate Geometry',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'What is the slope of the line passing through the points (2, −1) and (6, 7)?',
    options: [
      { id: 'a', content: '1/2' },
      { id: 'b', content: '2' },
      { id: 'c', content: '−2' },
      { id: 'd', content: '3/4' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Slope = (y₂ − y₁)/(x₂ − x₁) = (7 − (−1))/(6 − 2) = 8/4 = 2.',
    points: 1,
    tags: ['coordinate-geometry', 'slope', 'act-math'],
  },
  {
    id: 'act1-math-08',
    subject: 'ACT Math',
    topic: 'Quadratics',
    category: 'ACT_PREP',
    difficulty: 'HARD',
    question:
      'The vertex of the parabola y = 2(x − 3)² + 5 is at which point?',
    options: [
      { id: 'a', content: '(3, 5)' },
      { id: 'b', content: '(−3, 5)' },
      { id: 'c', content: '(3, −5)' },
      { id: 'd', content: '(−3, −5)' },
    ],
    correctAnswerId: 'a',
    explanation:
      'In vertex form y = a(x − h)² + k, the vertex is at (h, k). Here h = 3 and k = 5, so vertex = (3, 5). Note: the formula uses (x − h), so the sign of h is the opposite of what appears — x − 3 means h = +3.',
    points: 2,
    tags: ['quadratics', 'vertex-form', 'act-math'],
  },
];

// ── Reading (8 q / 10 min) ──────────────────────────────────────────────────
const reading: DemoQuestion[] = [
  {
    id: 'act1-read-01',
    subject: 'ACT Reading',
    topic: 'Main Idea',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'From a passage about climate migration:\n\n"By 2050, climate researchers project that 200 million people may be displaced by rising sea levels, drought, and extreme weather events. Unlike traditional refugee crises — driven by conflict or persecution — climate migration has no legal framework under international law. The 1951 Refugee Convention does not recognize environmental displacement as grounds for asylum, leaving climate migrants in a legal grey zone."\n\nThe primary purpose of this passage is to:',
    options: [
      { id: 'a', content: 'Argue that the number 200 million is an exaggeration by climate researchers' },
      { id: 'b', content: 'Describe the scale of projected climate displacement and the inadequacy of existing legal protections' },
      { id: 'c', content: 'Propose a new international treaty to replace the 1951 Refugee Convention' },
      { id: 'd', content: 'Compare historical refugee crises to future climate events' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The passage presents the scale of the problem (200M displaced) and then identifies the legal gap (no framework, 1951 convention inapplicable). The purpose is descriptive and expository — presenting scale + inadequacy of protections. No new treaty is proposed (C), no doubt is cast on the 200M figure (A), and comparison is a means not a purpose (D).',
    points: 1,
    tags: ['main-idea', 'social-science-passage', 'act-reading'],
  },
  {
    id: 'act1-read-02',
    subject: 'ACT Reading',
    topic: 'Detail',
    category: 'ACT_PREP',
    difficulty: 'EASY',
    question:
      'Based on the climate migration passage above, under which law is environmental displacement NOT currently recognized as grounds for asylum?',
    options: [
      { id: 'a', content: 'The Paris Climate Agreement' },
      { id: 'b', content: 'The 1951 Refugee Convention' },
      { id: 'c', content: 'The Geneva Conventions' },
      { id: 'd', content: 'The Kyoto Protocol' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The passage explicitly states: "The 1951 Refugee Convention does not recognize environmental displacement as grounds for asylum." This is a direct detail question.',
    points: 1,
    tags: ['detail', 'social-science-passage', 'act-reading'],
  },
  {
    id: 'act1-read-03',
    subject: 'ACT Reading',
    topic: 'Inference',
    category: 'ACT_PREP',
    difficulty: 'HARD',
    question:
      'A passage describes a fictional character:\n\n"Margaret had spent thirty years cataloguing every artifact in the museum — each piece documented in her handwriting, cross-referenced by era, material, and provenance. When the new director proposed digitizing everything in six months, she smiled politely and said nothing. That evening she drafted her resignation letter."\n\nWhich inference about Margaret is most strongly supported?',
    options: [
      { id: 'a', content: 'Margaret is enthusiastic about the digitization project.' },
      { id: 'b', content: 'Margaret disagreed with the director\'s plan but chose not to confront him directly.' },
      { id: 'c', content: 'Margaret is planning to sabotage the digitization project.' },
      { id: 'd', content: 'Margaret was planning to resign before the director\'s announcement.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Margaret\'s polite silence during the meeting followed by a private resignation letter strongly implies she disagreed but did not express it directly. Option A is contradicted by her resignation. Option C is speculation not supported by the text. Option D is not supported — her resignation follows the announcement, suggesting it caused her decision.',
    points: 2,
    tags: ['inference', 'fiction-passage', 'character-motivation', 'act-reading'],
  },
  {
    id: 'act1-read-04',
    subject: 'ACT Reading',
    topic: 'Vocabulary in Context',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'From a literary passage:\n\n"The new governor\'s tenure was marked by an almost quixotic idealism — he proposed sweeping reforms that, while noble in aspiration, had little chance of surviving the political machinery they would need to dismantle."\n\nAs used here, "quixotic" most nearly means:',
    options: [
      { id: 'a', content: 'practical and well-researched' },
      { id: 'b', content: 'visionary but unrealistically idealistic' },
      { id: 'c', content: 'deliberately deceptive' },
      { id: 'd', content: 'violently confrontational' },
    ],
    correctAnswerId: 'b',
    explanation:
      '"Quixotic" (from Don Quixote) describes idealistic or chivalrous aspirations that are impractical or naive. The context — "noble in aspiration, had little chance of surviving" — confirms this meaning. It is not deceptive (C) or confrontational (D).',
    points: 1,
    tags: ['vocabulary', 'words-in-context', 'act-reading'],
  },
  {
    id: 'act1-read-05',
    subject: 'ACT Reading',
    topic: 'Author\'s Purpose',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'From a science passage:\n\n"Contrary to popular belief, goldfish do not have a three-second memory. Studies have demonstrated that goldfish can remember information for months, can be trained using operant conditioning, and can navigate mazes they learned weeks earlier. The myth likely persists because it flatters our sense that we are cognitively superior to fish."\n\nWhy does the author include the final sentence?',
    options: [
      { id: 'a', content: 'To provide a scientific explanation for goldfish cognition' },
      { id: 'b', content: 'To suggest that the myth\'s persistence may reflect human psychology rather than goldfish ability' },
      { id: 'c', content: 'To argue that humans are actually less intelligent than goldfish' },
      { id: 'd', content: 'To introduce a new study about human memory biases' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The final sentence offers a speculative explanation for why a disproven myth persists — it serves our ego. This is a commentary on human psychology, not a scientific claim about goldfish. Option C misreads the tone; D is too literal; A describes the passage\'s earlier purpose, not the final sentence specifically.',
    points: 1,
    tags: ['author-purpose', 'science-passage', 'act-reading'],
  },
  {
    id: 'act1-read-06',
    subject: 'ACT Reading',
    topic: 'Comparative Passages',
    category: 'ACT_PREP',
    difficulty: 'HARD',
    question:
      'Passage 1 argues: "Artificial intelligence will eliminate far more jobs than it creates, accelerating inequality."\n\nPassage 2 argues: "New technologies historically create new industries and new types of employment. AI will generate occupations we cannot yet imagine."\n\nWhich statement best describes how the two passages differ in their reasoning?',
    options: [
      { id: 'a', content: 'Passage 1 relies on current evidence; Passage 2 uses historical analogies to project future outcomes.' },
      { id: 'b', content: 'Passage 1 discusses technology policy; Passage 2 discusses social inequality.' },
      { id: 'c', content: 'Passage 1 focuses on manufacturing jobs; Passage 2 focuses on white-collar employment.' },
      { id: 'd', content: 'Both passages reach the same conclusion through different methods.' },
    ],
    correctAnswerId: 'a',
    explanation:
      'Passage 1 takes a present-tense analytical approach (AI "will eliminate"). Passage 2 uses the historical pattern of new technologies creating new industries as the basis for its optimism. Option A correctly identifies this difference in reasoning strategies. Options B, C, and D mischaracterize both passages.',
    points: 2,
    tags: ['comparative-passages', 'reasoning', 'act-reading'],
  },
  {
    id: 'act1-read-07',
    subject: 'ACT Reading',
    topic: 'Detail — Natural Science',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'From a natural science passage:\n\n"The Mariana Trench, the deepest point on Earth at roughly 11,000 meters, harbors life forms uniquely adapted to extreme pressure, near-freezing temperatures, and complete darkness. Among its inhabitants are hadal amphipods — small crustaceans that thrive at pressures exceeding 1,000 atmospheres. Remarkably, these animals have been found to contain microplastics in their digestive systems, suggesting that human pollution has reached even the most remote oceanic environments."\n\nWhat evidence in the passage indicates that human activity has affected the Mariana Trench?',
    options: [
      { id: 'a', content: 'The presence of hadal amphipods in the trench' },
      { id: 'b', content: 'The extreme pressure conditions exceeding 1,000 atmospheres' },
      { id: 'c', content: 'The discovery of microplastics in the digestive systems of deep-sea animals' },
      { id: 'd', content: 'The near-freezing temperatures at 11,000 meters depth' },
    ],
    correctAnswerId: 'c',
    explanation:
      'The passage explicitly states microplastics in amphipod digestive systems as evidence of human pollution reaching the trench. Options A, B, and D are natural characteristics of the trench environment, not indicators of human activity.',
    points: 1,
    tags: ['detail', 'natural-science', 'act-reading'],
  },
  {
    id: 'act1-read-08',
    subject: 'ACT Reading',
    topic: 'Tone',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Which word best describes the tone of the following passage?\n\n"Three billion years of evolutionary tinkering produced the human brain — and we propose to redesign it in a generation. The hubris of the venture is matched only by the breathtaking inadequacy of our current understanding of neural architecture."',
    options: [
      { id: 'a', content: 'enthusiastic and optimistic' },
      { id: 'b', content: 'cautionary and skeptical' },
      { id: 'c', content: 'neutral and informative' },
      { id: 'd', content: 'dismissive and contemptuous' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Words like "hubris" (arrogance) and "breathtaking inadequacy" signal the author\'s concern about overreach — a cautionary stance. The contrast between the timescale of evolution and one generation implies skepticism about the enterprise. The tone is clearly critical, but not dismissive of the effort entirely.',
    points: 1,
    tags: ['tone', 'humanities-passage', 'act-reading'],
  },
];

// ── Science (8 q / 10 min) ──────────────────────────────────────────────────
const science: DemoQuestion[] = [
  {
    id: 'act1-sci-01',
    subject: 'ACT Science',
    topic: 'Data Interpretation — Tables',
    category: 'ACT_PREP',
    difficulty: 'EASY',
    question:
      'A table shows the following reaction rates at different temperatures:\n\nTemp (°C) | Rate (mol/L·s)\n20°C      | 0.002\n30°C      | 0.005\n40°C      | 0.013\n50°C      | 0.034\n\nBased on the data, what is the general relationship between temperature and reaction rate?',
    options: [
      { id: 'a', content: 'Reaction rate decreases as temperature increases.' },
      { id: 'b', content: 'There is no relationship between temperature and reaction rate.' },
      { id: 'c', content: 'Reaction rate increases as temperature increases.' },
      { id: 'd', content: 'Reaction rate increases only between 20°C and 30°C.' },
    ],
    correctAnswerId: 'c',
    explanation:
      'The data shows a consistent increase in reaction rate (0.002 → 0.005 → 0.013 → 0.034) as temperature increases (20°C → 50°C). This is a direct positive relationship — increasing temperature increases reaction rate.',
    points: 1,
    tags: ['data-interpretation', 'tables', 'chemistry', 'act-science'],
  },
  {
    id: 'act1-sci-02',
    subject: 'ACT Science',
    topic: 'Scientific Reasoning',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A researcher is testing whether a new fertilizer increases crop yield. She randomly assigns 50 plots to receive the new fertilizer and 50 to receive the standard fertilizer, then measures yield after 90 days.\n\nWhich factor is the CONTROLLED VARIABLE in this experiment?',
    options: [
      { id: 'a', content: 'The type of fertilizer used' },
      { id: 'b', content: 'The crop yield after 90 days' },
      { id: 'c', content: 'The length of the growing period (90 days)' },
      { id: 'd', content: 'The random assignment of plots' },
    ],
    correctAnswerId: 'c',
    explanation:
      'A controlled variable is held constant to prevent it from affecting results. The 90-day growing period is kept the same for all plots. The fertilizer type (A) is the independent variable. Crop yield (B) is the dependent variable. Random assignment (D) is a methodological procedure, not a variable.',
    points: 2,
    tags: ['experimental-design', 'controlled-variable', 'act-science'],
  },
  {
    id: 'act1-sci-03',
    subject: 'ACT Science',
    topic: 'Data Interpretation — Graphs',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A graph shows enzyme activity (y-axis) vs. pH (x-axis) for Enzyme A. Activity rises from pH 2 to a maximum at pH 7, then falls to near zero at pH 11.\n\nWhat conclusion about Enzyme A is most directly supported by the graph?',
    options: [
      { id: 'a', content: 'Enzyme A is most active in strongly acidic conditions.' },
      { id: 'b', content: 'Enzyme A has an optimal pH of 7 and loses activity at extreme pH values.' },
      { id: 'c', content: 'Enzyme A ceases all activity permanently above pH 9.' },
      { id: 'd', content: 'Enzyme A is identical to pepsin, which also functions at neutral pH.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The graph shows maximum activity at pH 7 (optimal) with declining activity at both lower and higher pH values. Option B accurately describes this bell-shaped activity curve. Option A is wrong (maximum is at 7, not acidic). Option C overstates ("permanently") — the data only shows behavior at specific pH values tested. Option D introduces a specific enzyme not in the data.',
    points: 1,
    tags: ['graphs', 'enzyme-activity', 'biology', 'act-science'],
  },
  {
    id: 'act1-sci-04',
    subject: 'ACT Science',
    topic: 'Conflicting Viewpoints',
    category: 'ACT_PREP',
    difficulty: 'HARD',
    question:
      'Scientist 1: "The observed mass extinctions in the fossil record were caused by asteroid impacts, as supported by iridium deposits at extinction boundaries."\n\nScientist 2: "Volcanism, specifically the Deccan Traps eruptions, was the primary driver of the end-Cretaceous extinction. Iridium can also be produced by volcanic activity."\n\nWhich finding would MOST support Scientist 2\'s position?',
    options: [
      { id: 'a', content: 'Discovery of a large crater dating to exactly 66 million years ago' },
      { id: 'b', content: 'New analysis showing the Deccan Traps eruptions intensified significantly in the 300,000 years before the extinction boundary' },
      { id: 'c', content: 'Evidence that the asteroid impact released dust that blocked sunlight globally' },
      { id: 'd', content: 'A study confirming iridium is rare in Earth\'s crust relative to meteorites' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Scientist 2 argues volcanism was the primary driver. Evidence that Deccan Traps eruptions intensified before the extinction event would directly support a volcanic cause. Options A, C, and D all support Scientist 1\'s asteroid hypothesis.',
    points: 2,
    tags: ['conflicting-viewpoints', 'paleontology', 'act-science'],
  },
  {
    id: 'act1-sci-05',
    subject: 'ACT Science',
    topic: 'Data Interpretation',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Four species of bacteria were grown at different oxygen concentrations:\n• Species W: grew only where O₂ = 0%\n• Species X: grew best where O₂ = 21%\n• Species Y: grew at all O₂ levels\n• Species Z: grew only where O₂ = 2–5%\n\nWhich species is MOST likely an obligate anaerobe?',
    options: [
      { id: 'a', content: 'Species W' },
      { id: 'b', content: 'Species X' },
      { id: 'c', content: 'Species Y' },
      { id: 'd', content: 'Species Z' },
    ],
    correctAnswerId: 'a',
    explanation:
      'An obligate anaerobe grows ONLY in the absence of oxygen and cannot tolerate O₂. Species W grows only where O₂ = 0%, exactly matching this definition. Species X is likely an obligate aerobe (requires O₂). Species Y is a facultative anaerobe (tolerates all conditions). Species Z is a microaerophile (needs low O₂).',
    points: 1,
    tags: ['data-interpretation', 'microbiology', 'anaerobes', 'act-science'],
  },
  {
    id: 'act1-sci-06',
    subject: 'ACT Science',
    topic: 'Experimental Design',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A physicist measures the acceleration of a 2 kg block as various forces are applied to it on a frictionless surface. The results:\n\nForce (N) | Acceleration (m/s²)\n4         | 2.0\n8         | 4.0\n12        | 6.0\n16        | 8.0\n\nIf a force of 20 N is applied, what acceleration would be predicted?',
    options: [
      { id: 'a', content: '8 m/s²' },
      { id: 'b', content: '9 m/s²' },
      { id: 'c', content: '10 m/s²' },
      { id: 'd', content: '12 m/s²' },
    ],
    correctAnswerId: 'c',
    explanation:
      'The data shows a = F/m = F/2. For F = 20 N: a = 20/2 = 10 m/s². This is consistent with Newton\'s Second Law (F = ma → a = F/m).',
    points: 1,
    tags: ['physics', 'newtons-laws', 'data-extrapolation', 'act-science'],
  },
  {
    id: 'act1-sci-07',
    subject: 'ACT Science',
    topic: 'Biology — Genetics',
    category: 'ACT_PREP',
    difficulty: 'HARD',
    question:
      'A monohybrid cross between two heterozygous tall pea plants (Tt × Tt) was performed. If the tall allele (T) is completely dominant over the short allele (t), what proportion of offspring will be tall?',
    options: [
      { id: 'a', content: '1/4' },
      { id: 'b', content: '1/2' },
      { id: 'c', content: '3/4' },
      { id: 'd', content: '1' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Tt × Tt Punnett square: TT (tall), Tt (tall), Tt (tall), tt (short). Ratio: 3 tall : 1 short. So 3/4 of offspring will be tall (genotypes TT and Tt, both expressing the dominant phenotype).',
    points: 2,
    tags: ['genetics', 'mendelian', 'punnett-square', 'act-science'],
  },
  {
    id: 'act1-sci-08',
    subject: 'ACT Science',
    topic: 'Physics — Electricity',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A simple circuit has a 12V battery and a resistor. Using Ohm\'s Law (V = IR), if the current through the circuit is 3A, what is the resistance?',
    options: [
      { id: 'a', content: '2 Ω' },
      { id: 'b', content: '4 Ω' },
      { id: 'c', content: '9 Ω' },
      { id: 'd', content: '36 Ω' },
    ],
    correctAnswerId: 'b',
    explanation:
      'V = IR → R = V/I = 12/3 = 4 Ω.',
    points: 1,
    tags: ['physics', 'ohms-law', 'electricity', 'act-science'],
  },
];

export const ACT_MOCK_TEST_1_SECTIONS: ExamSection[] = [
  {
    name: 'English',
    shortName: 'ENG',
    questions: english,
    timeLimit: 600,
    hasCalculator: false,
  },
  {
    name: 'Mathematics',
    shortName: 'MATH',
    questions: mathematics,
    timeLimit: 720,
    hasCalculator: true,
  },
  {
    name: 'Reading',
    shortName: 'READ',
    questions: reading,
    timeLimit: 600,
    hasCalculator: false,
  },
  {
    name: 'Science',
    shortName: 'SCI',
    questions: science,
    timeLimit: 600,
    hasCalculator: false,
  },
];
