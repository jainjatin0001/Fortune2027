import type { DemoQuestion } from '@/types';
import type { ExamSection } from '@/components/shared/ExamInterface';

// ── English (8 q / 10 min) ──────────────────────────────────────────────────
const english: DemoQuestion[] = [
  {
    id: 'act2-eng-01',
    subject: 'ACT English',
    topic: 'Grammar — Misplaced Modifiers',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Choose the version that correctly places the modifier:\n\n"Driving down the highway, the mountains came into view."',
    options: [
      { id: 'a', content: 'Driving down the highway, the mountains came into view.' },
      { id: 'b', content: 'The mountains came into view driving down the highway.' },
      { id: 'c', content: 'Driving down the highway, we saw the mountains come into view.' },
      { id: 'd', content: 'The mountains, driving down the highway, came into view.' },
    ],
    correctAnswerId: 'c',
    explanation:
      'The participial phrase "Driving down the highway" must modify the grammatical subject of the sentence. In A and B, the subject is "the mountains," which cannot drive. Option C correctly uses "we" as the subject performing the driving. Option D is also incorrect for the same reason as B.',
    points: 1,
    tags: ['modifiers', 'misplaced-modifier', 'grammar', 'act-english'],
  },
  {
    id: 'act2-eng-02',
    subject: 'ACT English',
    topic: 'Punctuation — Colons and Dashes',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Which option correctly punctuates the following sentence?\n\n"The researchers discovered something remarkable _____ the bacteria could repair their own DNA within minutes of radiation exposure."',
    options: [
      { id: 'a', content: 'remarkable, the bacteria' },
      { id: 'b', content: 'remarkable; the bacteria' },
      { id: 'c', content: 'remarkable: the bacteria' },
      { id: 'd', content: 'remarkable and the bacteria' },
    ],
    correctAnswerId: 'c',
    explanation:
      'A colon is used after an independent clause to introduce a direct elaboration or explanation of what was just stated. "The researchers discovered something remarkable" is a complete clause, and what follows explains the remarkable finding — a perfect use for a colon. Option B (semicolon) joins two equal clauses without the explanatory emphasis.',
    points: 1,
    tags: ['colon', 'punctuation', 'act-english'],
  },
  {
    id: 'act2-eng-03',
    subject: 'ACT English',
    topic: 'Grammar — Commas in Series',
    category: 'ACT_PREP',
    difficulty: 'EASY',
    question:
      'Which option uses the Oxford comma correctly?\n\n"She studied chemistry, biology and physics in her final year."',
    options: [
      { id: 'a', content: 'She studied chemistry, biology and physics in her final year.' },
      { id: 'b', content: 'She studied chemistry, biology, and physics in her final year.' },
      { id: 'c', content: 'She studied chemistry biology, and physics in her final year.' },
      { id: 'd', content: 'She studied chemistry; biology; and physics in her final year.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The Oxford (serial) comma is placed before the final "and" in a list of three or more items: "chemistry, biology, and physics." While the ACT does not strictly require the Oxford comma, it is the most grammatically unambiguous version. Option D incorrectly uses semicolons between items that are not complex phrases.',
    points: 1,
    tags: ['oxford-comma', 'series', 'grammar', 'act-english'],
  },
  {
    id: 'act2-eng-04',
    subject: 'ACT English',
    topic: 'Style — Wordiness',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Which revision of the underlined portion is most clear and concise?\n\n"In light of the fact that the budget had been reduced, the project was cancelled."',
    options: [
      { id: 'a', content: 'In light of the fact that the budget had been reduced' },
      { id: 'b', content: 'Due to the reduction in the budget that had occurred' },
      { id: 'c', content: 'Because the budget was reduced' },
      { id: 'd', content: 'Given that a reduction in the budget took place' },
    ],
    correctAnswerId: 'c',
    explanation:
      '"In light of the fact that" is a verbose way to say "because." Option C replaces the six-word construction with the single word "because" and simplifies the passive "had been reduced" to "was reduced." All other options are equally or more wordy than the original.',
    points: 1,
    tags: ['wordiness', 'conciseness', 'style', 'act-english'],
  },
  {
    id: 'act2-eng-05',
    subject: 'ACT English',
    topic: 'Grammar — Who vs. Whom',
    category: 'ACT_PREP',
    difficulty: 'HARD',
    question:
      'Choose the correct pronoun:\n\n"The scientist _____ the committee selected for the award had published over 50 papers."',
    options: [
      { id: 'a', content: 'who' },
      { id: 'b', content: 'whom' },
      { id: 'c', content: 'which' },
      { id: 'd', content: 'whoever' },
    ],
    correctAnswerId: 'b',
    explanation:
      'To determine who vs. whom: substitute "he/she" or "him/her." Rearrange the relative clause: "the committee selected him/her." Since "him" (object form) works, use "whom" (also object form). "Who" is a subject pronoun. "Which" refers to non-persons. "Whoever" would change the meaning.',
    points: 2,
    tags: ['who-whom', 'relative-pronoun', 'grammar', 'act-english'],
  },
  {
    id: 'act2-eng-06',
    subject: 'ACT English',
    topic: 'Sentence Structure — Run-ons',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Which option corrects the run-on sentence?\n\n"The presentation ran over its time limit the audience was still deeply engaged."',
    options: [
      { id: 'a', content: 'The presentation ran over its time limit, the audience was still deeply engaged.' },
      { id: 'b', content: 'The presentation ran over its time limit, yet the audience was still deeply engaged.' },
      { id: 'c', content: 'The presentation ran over its time limit the audience, was still deeply engaged.' },
      { id: 'd', content: 'The presentation ran over its time limit; and the audience was still deeply engaged.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The sentence has two independent clauses that need to be joined correctly. Option B uses a comma + coordinating conjunction "yet" to show contrast — the grammatically sound solution. Option A is still a comma splice (comma alone is not enough). Option D incorrectly uses a semicolon before "and" (when using a coordinating conjunction, use a comma, not a semicolon).',
    points: 2,
    tags: ['run-on', 'sentence-structure', 'grammar', 'act-english'],
  },
  {
    id: 'act2-eng-07',
    subject: 'ACT English',
    topic: 'Rhetorical Skills — Organization',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A writer organizes an essay about the benefits of reading fiction with these three topic sentences:\n1. Fiction builds empathy by placing readers in others\' perspectives.\n2. Reading fiction reduces cortisol levels and lowers stress.\n3. Narrative immersion activates more areas of the brain than factual reading.\n\nWhich organizational principle do these topic sentences follow?',
    options: [
      { id: 'a', content: 'Chronological order — describing effects from least to most recent' },
      { id: 'b', content: 'Least to most complex — moving from psychological to biological to neurological' },
      { id: 'c', content: 'A random order with no discernible logic' },
      { id: 'd', content: 'Problem–solution — each paragraph addresses a different problem' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The three topics move from a humanistic/social effect (empathy), to a physiological/wellness effect (stress), to a neurological/scientific effect (brain activation). This is a progression from more intuitive/accessible to more scientifically specific — effectively a least-to-most-complex pattern. Options A, C, and D mischaracterize the structure.',
    points: 1,
    tags: ['organization', 'rhetorical-skills', 'act-english'],
  },
  {
    id: 'act2-eng-08',
    subject: 'ACT English',
    topic: 'Grammar — Tense Consistency',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Which version maintains consistent verb tense?\n\n"Yesterday, the manager reviewed the report, revised the conclusion, and _____ it to the client."',
    options: [
      { id: 'a', content: 'sends' },
      { id: 'b', content: 'has sent' },
      { id: 'c', content: 'will send' },
      { id: 'd', content: 'sent' },
    ],
    correctAnswerId: 'd',
    explanation:
      'The sentence is in past tense ("reviewed," "revised") and refers to "yesterday." The third verb in the series must also be past tense: "sent." Present tense "sends" (A), present perfect "has sent" (B), and future "will send" (C) all break tense consistency.',
    points: 1,
    tags: ['tense-consistency', 'grammar', 'act-english'],
  },
];

// ── Mathematics (8 q / 12 min, calculator allowed) ──────────────────────────
const mathematics: DemoQuestion[] = [
  {
    id: 'act2-math-01',
    subject: 'ACT Math',
    topic: 'Algebra — Factoring',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question: 'What are the solutions to x² − 3x − 10 = 0?',
    options: [
      { id: 'a', content: 'x = 2 and x = −5' },
      { id: 'b', content: 'x = 5 and x = −2' },
      { id: 'c', content: 'x = 5 and x = 2' },
      { id: 'd', content: 'x = −5 and x = −2' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Factor: x² − 3x − 10 = (x − 5)(x + 2) = 0. Solutions: x = 5 or x = −2.',
    points: 1,
    tags: ['factoring', 'quadratics', 'act-math'],
  },
  {
    id: 'act2-math-02',
    subject: 'ACT Math',
    topic: 'Geometry — Circles',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A circle has a diameter of 14 cm. What is the circumference? (Use π ≈ 3.14)',
    options: [
      { id: 'a', content: '21.98 cm' },
      { id: 'b', content: '43.96 cm' },
      { id: 'c', content: '153.86 cm' },
      { id: 'd', content: '615.44 cm' },
    ],
    correctAnswerId: 'b',
    explanation:
      'C = πd = 3.14 × 14 = 43.96 cm. (Or C = 2πr = 2 × 3.14 × 7 = 43.96 cm.)',
    points: 1,
    tags: ['geometry', 'circles', 'circumference', 'act-math'],
  },
  {
    id: 'act2-math-03',
    subject: 'ACT Math',
    topic: 'Pre-Algebra — Integers',
    category: 'ACT_PREP',
    difficulty: 'EASY',
    question:
      'If x and y are positive integers and x + y = 20 with x > y, what is the greatest possible value of x − y?',
    options: [
      { id: 'a', content: '16' },
      { id: 'b', content: '17' },
      { id: 'c', content: '18' },
      { id: 'd', content: '19' },
    ],
    correctAnswerId: 'c',
    explanation:
      'To maximize x − y with x + y = 20 and both positive integers, maximize x and minimize y. Since y ≥ 1 (positive integer), the minimum is y = 1, giving x = 19. But x must be strictly greater than y: 19 > 1. Then x − y = 19 − 1 = 18.',
    points: 2,
    tags: ['integers', 'optimization', 'act-math'],
  },
  {
    id: 'act2-math-04',
    subject: 'ACT Math',
    topic: 'Algebra — Functions',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'If g(x) = 3x − 7, what is g(g(2))?',
    options: [
      { id: 'a', content: '−10' },
      { id: 'b', content: '−8' },
      { id: 'c', content: '−4' },
      { id: 'd', content: '2' },
    ],
    correctAnswerId: 'a',
    explanation:
      'First: g(2) = 3(2) − 7 = 6 − 7 = −1. Then: g(g(2)) = g(−1) = 3(−1) − 7 = −3 − 7 = −10.',
    points: 2,
    tags: ['functions', 'composition', 'act-math'],
  },
  {
    id: 'act2-math-05',
    subject: 'ACT Math',
    topic: 'Trigonometry — Unit Circle',
    category: 'ACT_PREP',
    difficulty: 'HARD',
    question:
      'What is the exact value of cos(60°)?',
    options: [
      { id: 'a', content: '√3/2' },
      { id: 'b', content: '1/2' },
      { id: 'c', content: '√2/2' },
      { id: 'd', content: '1' },
    ],
    correctAnswerId: 'b',
    explanation:
      'From the unit circle (or 30-60-90 triangle): cos(60°) = 1/2. In a 30-60-90 triangle with hypotenuse 2: the side adjacent to 60° is 1, so cos(60°) = adjacent/hypotenuse = 1/2. Note: sin(60°) = √3/2, not cos(60°).',
    points: 1,
    tags: ['trigonometry', 'unit-circle', 'special-angles', 'act-math'],
  },
  {
    id: 'act2-math-06',
    subject: 'ACT Math',
    topic: 'Statistics — Average',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Maria scores 78, 85, and 91 on her first three exams. What score must she earn on the fourth exam to have an average of exactly 85?',
    options: [
      { id: 'a', content: '84' },
      { id: 'b', content: '85' },
      { id: 'c', content: '86' },
      { id: 'd', content: '88' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Required total = 85 × 4 = 340. Current total = 78 + 85 + 91 = 254. Fourth score needed = 340 − 254 = 86.',
    points: 1,
    tags: ['statistics', 'mean', 'act-math'],
  },
  {
    id: 'act2-math-07',
    subject: 'ACT Math',
    topic: 'Algebra — Absolute Value Equations',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'How many solutions does the equation |3x − 6| = 9 have?',
    options: [
      { id: 'a', content: '0' },
      { id: 'b', content: '1' },
      { id: 'c', content: '2' },
      { id: 'd', content: '3' },
    ],
    correctAnswerId: 'c',
    explanation:
      '|3x − 6| = 9 gives two cases: 3x − 6 = 9 → 3x = 15 → x = 5, and 3x − 6 = −9 → 3x = −3 → x = −1. Two distinct solutions.',
    points: 1,
    tags: ['absolute-value', 'equations', 'act-math'],
  },
  {
    id: 'act2-math-08',
    subject: 'ACT Math',
    topic: 'Coordinate Geometry — Lines',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A line passes through (0, 4) and has a slope of −2. Which equation represents this line?',
    options: [
      { id: 'a', content: 'y = 2x + 4' },
      { id: 'b', content: 'y = −2x − 4' },
      { id: 'c', content: 'y = −2x + 4' },
      { id: 'd', content: 'y = 2x − 4' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Slope-intercept form: y = mx + b. Slope m = −2, y-intercept b = 4 (since the line passes through (0, 4)). Equation: y = −2x + 4.',
    points: 1,
    tags: ['coordinate-geometry', 'slope-intercept', 'act-math'],
  },
];

// ── Reading (8 q / 10 min) ──────────────────────────────────────────────────
const reading: DemoQuestion[] = [
  {
    id: 'act2-read-01',
    subject: 'ACT Reading',
    topic: 'Main Idea — Humanities',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'From a passage about jazz:\n\n"Jazz emerged at the intersection of African rhythmic traditions and European harmonic structures, creating a distinctly American art form. Its defining feature — improvisation — means that no two performances of the same piece are identical. Jazz musicians respond to one another in real time, making each concert a unique conversation. Critics who dismissed early jazz as noise failed to recognize that its apparent chaos was deeply structured, operating by sophisticated rules invisible to the untrained ear."\n\nWhich sentence best states the main idea of this passage?',
    options: [
      { id: 'a', content: 'Jazz was unfairly criticized by audiences who could not understand it.' },
      { id: 'b', content: 'Jazz is a uniquely American musical form shaped by improvisation and sophisticated hidden structure.' },
      { id: 'c', content: 'Jazz is inferior to classical music because it lacks written scores.' },
      { id: 'd', content: 'African rhythmic traditions are more influential than European harmonics in jazz.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The passage covers jazz\'s origins, its improvisational character, and its underlying sophistication. Option B integrates all three key ideas — uniquely American, improvisational, and structurally sophisticated. Option A focuses only on critics. Options C and D introduce comparisons or hierarchies not present in the passage.',
    points: 1,
    tags: ['main-idea', 'humanities-passage', 'act-reading'],
  },
  {
    id: 'act2-read-02',
    subject: 'ACT Reading',
    topic: 'Inference',
    category: 'ACT_PREP',
    difficulty: 'HARD',
    question:
      'Continuing from the jazz passage: "Critics who dismissed early jazz as noise failed to recognize that its apparent chaos was deeply structured, operating by sophisticated rules invisible to the untrained ear."\n\nWhat can be inferred about the author\'s view of these critics?',
    options: [
      { id: 'a', content: 'The author believes critics were correct and that jazz truly is chaotic.' },
      { id: 'b', content: 'The author thinks the critics\' dismissal revealed their musical ignorance rather than jazz\'s deficiencies.' },
      { id: 'c', content: 'The author agrees that improvisation-based music cannot be considered sophisticated.' },
      { id: 'd', content: 'The author believes jazz should be taught in schools to train the ear.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The author frames the critics\' failure as a failure of perception — they couldn\'t recognize structure that was "invisible to the untrained ear." This implies the deficiency was in the critics, not in jazz. Option B accurately captures this implied critique. Options A and C contradict the passage; D introduces a recommendation not in the text.',
    points: 2,
    tags: ['inference', 'author-perspective', 'humanities-passage', 'act-reading'],
  },
  {
    id: 'act2-read-03',
    subject: 'ACT Reading',
    topic: 'Vocabulary in Context',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'From a social science passage:\n\n"The sociologist\'s findings were largely corroborated by an independent study conducted five years later, lending credibility to the original research."\n\nAs used here, "corroborated" most nearly means:',
    options: [
      { id: 'a', content: 'contradicted and disproved' },
      { id: 'b', content: 'confirmed and supported' },
      { id: 'c', content: 'expanded and enhanced' },
      { id: 'd', content: 'published and distributed' },
    ],
    correctAnswerId: 'b',
    explanation:
      '"Corroborate" means to confirm or support with additional evidence. The context — "lending credibility" — confirms that the new study supported the original findings rather than challenging them.',
    points: 1,
    tags: ['vocabulary', 'words-in-context', 'act-reading'],
  },
  {
    id: 'act2-read-04',
    subject: 'ACT Reading',
    topic: 'Detail — Natural Science',
    category: 'ACT_PREP',
    difficulty: 'EASY',
    question:
      'From a passage about photosynthesis:\n\n"In the light-dependent reactions of photosynthesis, chlorophyll molecules in the thylakoid membranes absorb sunlight and use that energy to split water molecules, releasing oxygen as a byproduct. The energy captured is stored in ATP and NADPH, which power the subsequent Calvin cycle."\n\nAccording to the passage, what is the direct source of the oxygen released during photosynthesis?',
    options: [
      { id: 'a', content: 'Carbon dioxide' },
      { id: 'b', content: 'ATP molecules' },
      { id: 'c', content: 'Water molecules' },
      { id: 'd', content: 'Chlorophyll' },
    ],
    correctAnswerId: 'c',
    explanation:
      'The passage explicitly states: "use that energy to split water molecules, releasing oxygen as a byproduct." Oxygen comes directly from the splitting of water, not from CO₂ or chlorophyll.',
    points: 1,
    tags: ['detail', 'biology', 'photosynthesis', 'act-reading'],
  },
  {
    id: 'act2-read-05',
    subject: 'ACT Reading',
    topic: 'Author\'s Purpose',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'From a literary essay:\n\n"Many readers approach Moby Dick as a novel about obsession, and they are not wrong. But to read it only as Ahab\'s story is to miss the ocean that Ishmael navigates — and Ishmael navigates everything: faith, doubt, commerce, death, the whale itself, and the overwhelming indifference of nature to human aspiration."\n\nWhat is the author\'s main purpose in this passage?',
    options: [
      { id: 'a', content: 'To argue that Ahab is not the main character of Moby Dick' },
      { id: 'b', content: 'To suggest that Moby Dick\'s themes extend far beyond Ahab\'s obsession' },
      { id: 'c', content: 'To provide a plot summary of Moby Dick for unfamiliar readers' },
      { id: 'd', content: 'To compare Ishmael\'s perspective unfavorably to Ahab\'s' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The author acknowledges the obsession reading ("they are not wrong") but argues the novel contains much more — a full inventory of themes Ishmael engages with. The purpose is to expand the reader\'s conception of the novel\'s thematic scope. Option A overstates ("Ahab is not the main character"). Options C and D are not supported.',
    points: 1,
    tags: ['author-purpose', 'literary-passage', 'act-reading'],
  },
  {
    id: 'act2-read-06',
    subject: 'ACT Reading',
    topic: 'Comparative — Science Texts',
    category: 'ACT_PREP',
    difficulty: 'HARD',
    question:
      'Passage 1: "The human appendix has no known function and represents a vestigial evolutionary remnant."\n\nPassage 2: "Recent research suggests the appendix may serve as a reservoir for beneficial gut bacteria, repopulating the digestive system after illness-induced depletion."\n\nThe primary difference between the two passages is:',
    options: [
      { id: 'a', content: 'Passage 1 is opinion; Passage 2 is fact.' },
      { id: 'b', content: 'Passage 1 represents an older scientific consensus; Passage 2 reflects more recent findings that challenge it.' },
      { id: 'c', content: 'Passage 1 discusses human evolution; Passage 2 discusses digestion.' },
      { id: 'd', content: 'Both passages agree that the appendix serves no important function.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Passage 1 presents the traditional view (vestigial organ). Passage 2 introduces newer research suggesting a function. The key difference is temporal: older consensus vs. newer challenge to that consensus. Option C partially applies but misses the central relationship. Option D directly contradicts Passage 2.',
    points: 2,
    tags: ['comparative-passages', 'science', 'act-reading'],
  },
  {
    id: 'act2-read-07',
    subject: 'ACT Reading',
    topic: 'Tone',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'From a historical essay:\n\n"The Versailles Treaty, which was supposed to end wars forever, instead planted the seeds of the next one. Its architects, blinded by national pride and a desire for punishment, failed to see that humiliation rarely leads to peace."\n\nThe tone of this passage is best described as:',
    options: [
      { id: 'a', content: 'celebratory and admiring' },
      { id: 'b', content: 'critical and reflective' },
      { id: 'c', content: 'impartial and journalistic' },
      { id: 'd', content: 'confused and uncertain' },
    ],
    correctAnswerId: 'b',
    explanation:
      '"Blinded by national pride," "desire for punishment," and "humiliation rarely leads to peace" all signal a critical assessment of the treaty\'s architects. The author is evaluating and criticizing a historical decision — a reflective critique. The tone is clearly not celebratory (A), neutral (C), or uncertain (D).',
    points: 1,
    tags: ['tone', 'historical-passage', 'act-reading'],
  },
  {
    id: 'act2-read-08',
    subject: 'ACT Reading',
    topic: 'Function of a Sentence',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'From a science passage about climate feedback loops:\n\n"Arctic permafrost stores an estimated 1.5 trillion tons of organic carbon accumulated over thousands of years. [Sentence X] As permafrost thaws, this carbon decomposes and is released as CO₂ and methane, further warming the planet and accelerating thaw." \n\nSentence X reads: "This carbon has remained frozen and inert for millennia."\n\nWhat function does Sentence X serve in the passage?',
    options: [
      { id: 'a', content: 'It introduces a counterargument to the passage\'s main claim.' },
      { id: 'b', content: 'It provides context that makes the subsequent release of carbon more consequential.' },
      { id: 'c', content: 'It provides the main evidence for the passage\'s conclusion.' },
      { id: 'd', content: 'It transitions to a discussion of industrial carbon emissions.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Sentence X explains that the carbon has been frozen and inactive for thousands of years. This context makes the subsequent thaw and release more alarming — it\'s not fresh carbon but a massive ancient reservoir now becoming active. The sentence sets up the severity of the feedback loop described next.',
    points: 2,
    tags: ['function-of-sentence', 'science-passage', 'act-reading'],
  },
];

// ── Science (8 q / 10 min) ──────────────────────────────────────────────────
const science: DemoQuestion[] = [
  {
    id: 'act2-sci-01',
    subject: 'ACT Science',
    topic: 'Data Interpretation',
    category: 'ACT_PREP',
    difficulty: 'EASY',
    question:
      'A study measures plant growth under four light wavelengths over 2 weeks:\n\nWavelength | Avg Growth (cm)\nRed        | 9.2\nBlue       | 8.7\nGreen      | 2.1\nWhite      | 10.4\n\nWhich wavelength produced the LEAST plant growth?',
    options: [
      { id: 'a', content: 'Red' },
      { id: 'b', content: 'Blue' },
      { id: 'c', content: 'Green' },
      { id: 'd', content: 'White' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Green light produced the least average growth at 2.1 cm — significantly lower than all other wavelengths. This is consistent with the fact that chlorophyll reflects green light rather than absorbing it, making it the least effective for photosynthesis.',
    points: 1,
    tags: ['data-interpretation', 'plants', 'photosynthesis', 'act-science'],
  },
  {
    id: 'act2-sci-02',
    subject: 'ACT Science',
    topic: 'Scientific Reasoning',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A scientist hypothesizes that increased caffeine intake raises blood pressure. She measures the resting blood pressure of 100 participants before and after consuming 200 mg of caffeine.\n\nWhich change to the study would BEST improve its validity?',
    options: [
      { id: 'a', content: 'Increase the caffeine dose to 400 mg.' },
      { id: 'b', content: 'Add a control group that receives a placebo instead of caffeine.' },
      { id: 'c', content: 'Measure only the systolic (not diastolic) blood pressure.' },
      { id: 'd', content: 'Conduct the study in a laboratory instead of participants\' homes.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'A control group receiving a placebo (inactive substance) allows researchers to separate the effect of caffeine from other variables — such as the act of drinking a beverage or expectation effects. Without a control group, observed changes in blood pressure might be due to factors other than caffeine.',
    points: 2,
    tags: ['experimental-design', 'control-group', 'validity', 'act-science'],
  },
  {
    id: 'act2-sci-03',
    subject: 'ACT Science',
    topic: 'Graphs — Interpreting Trends',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A graph shows global average temperature anomaly (°C above pre-industrial baseline) from 1880 to 2020. The line is relatively flat until 1970, then rises steeply, reaching +1.2°C by 2020.\n\nWhich conclusion is most directly supported by this graph?',
    options: [
      { id: 'a', content: 'Global temperatures were stable from 1880 to 2020.' },
      { id: 'b', content: 'The rate of warming accelerated significantly after 1970.' },
      { id: 'c', content: 'Human greenhouse gas emissions began in 1970.' },
      { id: 'd', content: 'Temperatures will continue rising at the same rate after 2020.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The graph shows a relatively flat trend until 1970 and then a steep increase — directly supporting that the rate of warming increased after 1970. Option A is wrong (temperatures did change). Option C draws a causal conclusion from correlation that the graph alone cannot establish. Option D is a prediction beyond the data shown.',
    points: 1,
    tags: ['graphs', 'climate', 'trends', 'act-science'],
  },
  {
    id: 'act2-sci-04',
    subject: 'ACT Science',
    topic: 'Physics — Kinematics',
    category: 'ACT_PREP',
    difficulty: 'HARD',
    question:
      'A ball is dropped from rest and falls freely under gravity (g = 10 m/s²). How far will it fall in 4 seconds? (Use d = ½gt²)',
    options: [
      { id: 'a', content: '40 m' },
      { id: 'b', content: '80 m' },
      { id: 'c', content: '160 m' },
      { id: 'd', content: '200 m' },
    ],
    correctAnswerId: 'b',
    explanation:
      'd = ½ × 10 × 4² = ½ × 10 × 16 = 80 m.',
    points: 2,
    tags: ['kinematics', 'physics', 'free-fall', 'act-science'],
  },
  {
    id: 'act2-sci-05',
    subject: 'ACT Science',
    topic: 'Chemistry — Periodic Trends',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Which correctly describes a general trend in the periodic table?',
    options: [
      { id: 'a', content: 'Atomic radius increases from left to right across a period.' },
      { id: 'b', content: 'Electronegativity increases from bottom to top within a group.' },
      { id: 'c', content: 'Ionization energy decreases from left to right across a period.' },
      { id: 'd', content: 'Metallic character increases from left to right across a period.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Electronegativity increases going up a group (elements closer to fluorine are more electronegative). Atomic radius DECREASES left to right (increasing nuclear charge pulls electrons closer). Ionization energy INCREASES left to right. Metallic character DECREASES left to right.',
    points: 2,
    tags: ['periodic-trends', 'chemistry', 'act-science'],
  },
  {
    id: 'act2-sci-06',
    subject: 'ACT Science',
    topic: 'Conflicting Viewpoints',
    category: 'ACT_PREP',
    difficulty: 'HARD',
    question:
      'Scientist A: "Language acquisition in humans is primarily driven by a genetically pre-programmed Language Acquisition Device (LAD) that enables children to learn grammar intuitively."\n\nScientist B: "Language acquisition results from behavioral reinforcement — children are rewarded for correct utterances and corrected for errors, gradually building linguistic competence."\n\nWhich observation would support Scientist A\'s position over Scientist B\'s?',
    options: [
      { id: 'a', content: 'Children whose parents speak to them more frequently develop larger vocabularies.' },
      { id: 'b', content: 'Children learn language faster when errors are systematically corrected by parents.' },
      { id: 'c', content: 'Children acquire complex grammatical rules without explicit instruction, and even creatively apply rules to words they have never heard before.' },
      { id: 'd', content: 'Children exposed to multiple languages early in life become bilingual more easily.' },
    ],
    correctAnswerId: 'c',
    explanation:
      'A key prediction of the LAD theory is that children can generalize grammatical rules without being taught them (e.g., "I goed" instead of "went" — overgeneralizing the past tense rule). This is called "creative rule application." Options A and B support the behavioral reinforcement model. Option D supports bilingualism but neither theory specifically.',
    points: 2,
    tags: ['conflicting-viewpoints', 'linguistics', 'act-science'],
  },
  {
    id: 'act2-sci-07',
    subject: 'ACT Science',
    topic: 'Biology — Ecology',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'In a given ecosystem, the following population data was collected over three years:\n\nYear 1: Rabbits = 500, Foxes = 40\nYear 2: Rabbits = 300, Foxes = 60\nYear 3: Rabbits = 180, Foxes = 45\n\nWhich conclusion is most consistent with predator-prey dynamics?',
    options: [
      { id: 'a', content: 'Fox populations are not affected by rabbit population size.' },
      { id: 'b', content: 'As rabbit populations declined, fox populations eventually declined as well due to reduced food supply.' },
      { id: 'c', content: 'Foxes increased the rabbit population by reducing competition.' },
      { id: 'd', content: 'The data shows no relationship between rabbits and foxes.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Classic predator-prey dynamics: fox population rose as rabbits were abundant (Year 1→2), but as rabbits declined sharply, foxes lost food supply and declined too (Year 2→3). Option B describes this lag-cycle pattern. Option A is directly contradicted by the data. Options C and D are unsupported.',
    points: 1,
    tags: ['ecology', 'predator-prey', 'population-dynamics', 'act-science'],
  },
  {
    id: 'act2-sci-08',
    subject: 'ACT Science',
    topic: 'Chemistry — Acid-Base',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A student tests four solutions with pH paper:\n\nSolution | pH\nA        | 2\nB        | 7\nC        | 9\nD        | 13\n\nWhich solution is the strongest acid?',
    options: [
      { id: 'a', content: 'Solution A (pH 2)' },
      { id: 'b', content: 'Solution B (pH 7)' },
      { id: 'c', content: 'Solution C (pH 9)' },
      { id: 'd', content: 'Solution D (pH 13)' },
    ],
    correctAnswerId: 'a',
    explanation:
      'The pH scale runs from 0 (most acidic) to 14 (most basic). Solution A with pH 2 is the most acidic of the four. Solution B (pH 7) is neutral; C and D are alkaline (basic).',
    points: 1,
    tags: ['chemistry', 'acid-base', 'pH', 'act-science'],
  },
];

export const ACT_MOCK_TEST_2_SECTIONS: ExamSection[] = [
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
