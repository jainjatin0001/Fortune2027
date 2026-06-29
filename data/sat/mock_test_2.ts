import type { DemoQuestion } from '@/types';
import type { ExamSection } from '@/components/shared/ExamInterface';

// ── Reading & Writing — Module 1 (10 q / 16 min) ───────────────────────────
const rwModule1: DemoQuestion[] = [
  {
    id: 'sat2-rw1-01',
    subject: 'SAT Reading & Writing',
    topic: 'Main Idea',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'The following text is from an essay on behavioral economics:\n\n"Traditional economic models assume individuals make rational decisions that maximize their own utility. Behavioral economists, drawing on psychology, have documented systematic deviations from this model. People consistently prefer avoiding losses to acquiring equivalent gains—a bias called loss aversion. They are also susceptible to framing effects: the same choice presented differently leads to different decisions."\n\nWhat is the main argument of this passage?',
    options: [
      { id: 'a', content: 'Traditional economic models are fundamentally flawed and should be discarded.' },
      { id: 'b', content: 'Behavioral economics shows that real human decision-making systematically departs from pure rationality.' },
      { id: 'c', content: 'Loss aversion and framing are the only biases that behavioral economists study.' },
      { id: 'd', content: 'Psychology is more scientific than traditional economics.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The passage argues that real human behavior systematically departs from the rational actor model, citing loss aversion and framing effects as examples. Option B captures this accurately. Option A is too extreme ("discarded"). Options C and D make unsupported absolute claims.',
    points: 1,
    tags: ['main-idea', 'economics-passage', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-02',
    subject: 'SAT Reading & Writing',
    topic: 'Words in Context',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'From a science article:\n\n"The enzyme\'s catalytic activity was found to be highly labile under elevated temperature conditions, losing function rapidly above 40°C."\n\nAs used here, "labile" most nearly means:',
    options: [
      { id: 'a', content: 'stable and predictable' },
      { id: 'b', content: 'easily altered or unstable' },
      { id: 'c', content: 'highly active and efficient' },
      { id: 'd', content: 'resistant to external changes' },
    ],
    correctAnswerId: 'b',
    explanation:
      '"Labile" describes something that is readily undergoes change or is unstable — losing function at elevated temperature confirms instability. In biochemistry specifically, "labile" means easily broken down or changed. This is the opposite of A (stable) and D (resistant).',
    points: 1,
    tags: ['vocabulary', 'science-passage', 'words-in-context', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-03',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Verb Tense',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Choose the version that correctly uses verb tense:\n\n"By the time the rescue team arrived, the hikers _____ in the cave for over sixteen hours."',
    options: [
      { id: 'a', content: 'sheltered' },
      { id: 'b', content: 'have sheltered' },
      { id: 'c', content: 'had been sheltering' },
      { id: 'd', content: 'were sheltering' },
    ],
    correctAnswerId: 'c',
    explanation:
      'The past perfect progressive ("had been sheltering") is used to describe an ongoing action that was in progress before another past event ("arrived"). The phrase "by the time…arrived" signals that the sheltering preceded and continued up to the rescue team\'s arrival. Simple past (A) and present perfect (B) don\'t convey this relationship; "were sheltering" (D) lacks the perfect aspect needed.',
    points: 2,
    tags: ['verb-tense', 'past-perfect', 'grammar', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-04',
    subject: 'SAT Reading & Writing',
    topic: 'Command of Evidence',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'A student claims: "The primary motivation for the construction of the Transcontinental Railroad was to improve mail delivery speed across the United States."\n\nWhich evidence would most WEAKEN this claim?',
    options: [
      { id: 'a', content: 'Railroad companies employed thousands of Chinese and Irish immigrant workers.' },
      { id: 'b', content: 'Congressional legislation authorizing the railroad focused on national unity, commerce, and military supply routes—not postal service.' },
      { id: 'c', content: 'The Pony Express mail service ended shortly after the railroad\'s completion.' },
      { id: 'd', content: 'The first transcontinental railroad was completed in 1869 at Promontory Summit, Utah.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'To weaken the claim that mail delivery was the primary motivation, we need evidence showing a different primary motivation. Option B directly does this by citing the actual legislative goals: unity, commerce, and military supply—not postal service. Options A (labor), C (a consequence, not a motivation), and D (a date) do not address motivation.',
    points: 2,
    tags: ['evidence', 'argumentation', 'history-passage', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-05',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Transitions',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      '"The medication showed promising results in early trials. _____, a large-scale clinical study found no statistically significant benefit over placebo."\n\nWhich transition best connects these sentences?',
    options: [
      { id: 'a', content: 'Consequently' },
      { id: 'b', content: 'For instance' },
      { id: 'c', content: 'Nonetheless' },
      { id: 'd', content: 'Similarly' },
    ],
    correctAnswerId: 'c',
    explanation:
      '"Nonetheless" (meaning "despite that") signals a contrast — early promise is undermined by later evidence. "Consequently" implies causation; "For instance" introduces an example; "Similarly" signals likeness — none fit this contradictory relationship.',
    points: 1,
    tags: ['transitions', 'contrast', 'grammar', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-06',
    subject: 'SAT Reading & Writing',
    topic: 'Inference',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'From a biography of Marie Curie:\n\n"Curie conducted her research at a time when most European universities refused to admit women, yet she became the first person to win Nobel Prizes in two different sciences. Her laboratory notebooks remain radioactive to this day and are stored in lead-lined boxes accessible only to researchers wearing protective gear."\n\nWhat can most reasonably be inferred from this passage?',
    options: [
      { id: 'a', content: 'Curie was unaware of the dangers of radioactivity during her research.' },
      { id: 'b', content: 'Curie\'s long-term exposure to radioactive materials was substantial enough to contaminate her personal materials for decades.' },
      { id: 'c', content: 'Curie disregarded all safety precautions throughout her career.' },
      { id: 'd', content: 'The Nobel Committee awarded Curie both prizes simultaneously.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The detail that notebooks are still radioactive a century later, stored in lead-lined boxes, supports the inference that Curie was exposed to significant radioactive contamination. Option A is not stated (she may have been aware). Option C over-claims from the text. Option D is not stated.',
    points: 1,
    tags: ['inference', 'biography-passage', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-07',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Conciseness',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Which option most concisely and correctly expresses the meaning without redundancy?\n\n"Due to the fact that the bridge was in a state of disrepair, it was deemed necessary that it be closed by city officials."',
    options: [
      { id: 'a', content: 'Due to the fact that the bridge was in a state of disrepair, it was deemed necessary that it be closed by city officials.' },
      { id: 'b', content: 'Because the bridge was in a state of disrepair, it was necessary for it to be closed by city officials.' },
      { id: 'c', content: 'Because the bridge was in disrepair, city officials deemed it necessary to close it.' },
      { id: 'd', content: 'The bridge being in a state of disrepair meant that the necessity of its closure was deemed by city officials.' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Option C eliminates the wordy "due to the fact that" (→ "because"), "state of disrepair" (→ "in disrepair"), and passive "it was necessary that it be closed by city officials" (→ "city officials deemed it necessary to close it"). Option D introduces new awkwardness; B improves only slightly.',
    points: 1,
    tags: ['conciseness', 'grammar', 'style', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-08',
    subject: 'SAT Reading & Writing',
    topic: 'Rhetorical Purpose',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'From a scientific article:\n\n"While the correlation between sleep deprivation and reduced cognitive performance is well established, the precise mechanisms remain under investigation. Proposed pathways include impaired synaptic plasticity, reduced glymphatic clearance of metabolic waste, and disruption of acetylcholine signaling. However, no single mechanism has yet been shown to account for the full spectrum of cognitive deficits observed."\n\nThe author\'s primary purpose in this passage is to:',
    options: [
      { id: 'a', content: 'Argue that sleep deprivation causes irreversible cognitive damage' },
      { id: 'b', content: 'Summarize established findings while acknowledging remaining uncertainty about mechanisms' },
      { id: 'c', content: 'Propose a new theory about the relationship between sleep and cognition' },
      { id: 'd', content: 'Recommend that people get more sleep to improve academic performance' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The passage confirms the established correlation (sleep deprivation → cognitive deficits), describes proposed mechanisms, then qualifies that no single mechanism fully explains the observations. This is a classic scientific summary + acknowledgment of uncertainty. No new theory is proposed (C), no recommendation is made (D), and no irreversibility claim is stated (A).',
    points: 1,
    tags: ['rhetorical-purpose', 'science-passage', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-09',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Sentence Completion',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Which option correctly completes the sentence while maintaining proper grammar?\n\n"The committee\'s decision, along with its detailed rationale, _____ published in the official record."',
    options: [
      { id: 'a', content: 'were' },
      { id: 'b', content: 'was' },
      { id: 'c', content: 'are' },
      { id: 'd', content: 'have been' },
    ],
    correctAnswerId: 'b',
    explanation:
      '"Along with its detailed rationale" is a prepositional phrase that does not change the grammatical subject. The true subject is "The committee\'s decision" (singular), so the verb must be singular: "was." If "and" were used instead of "along with," the subject would become compound and plural, requiring "were."',
    points: 1,
    tags: ['subject-verb-agreement', 'prepositional-phrase', 'grammar', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-10',
    subject: 'SAT Reading & Writing',
    topic: 'Data Analysis',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'A researcher studied two groups of plants. Group A received standard fertilizer; Group B received a new organic formula. After 8 weeks:\n• Group A: average height 34 cm, average yield 18 g\n• Group B: average height 38 cm, average yield 16 g\n\nThe researcher concludes: "The organic formula is superior because it produces taller plants."\n\nWhich critique BEST identifies a flaw in this conclusion?',
    options: [
      { id: 'a', content: 'The study should have lasted longer than 8 weeks.' },
      { id: 'b', content: 'The conclusion ignores yield data, which shows the organic formula actually produced less fruit than the standard fertilizer.' },
      { id: 'c', content: 'The standard fertilizer group should have been given a placebo.' },
      { id: 'd', content: 'Plant height is impossible to measure accurately.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The conclusion focuses only on height while ignoring the yield data. Group B was taller but produced less yield (16 g vs. 18 g). Claiming overall superiority based on only one metric (height) while ignoring another (yield) is the core logical flaw. Option A is a possible limitation but does not address the specific claim about superiority.',
    points: 2,
    tags: ['data-analysis', 'logical-flaw', 'selective-evidence', 'sat-rw'],
  },
];

// ── Reading & Writing — Module 2 (10 q / 16 min) ───────────────────────────
const rwModule2: DemoQuestion[] = [
  {
    id: 'sat2-rw2-01',
    subject: 'SAT Reading & Writing',
    topic: 'Main Idea',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'From a humanities essay:\n\n"The printing press did not simply accelerate the spread of information; it fundamentally altered its nature. When manuscripts were hand-copied, scribes introduced interpretive changes and errors that accumulated across generations. The press enforced standardization — identical texts could now be distributed simultaneously across entire regions. This uniformity made textual comparison, and therefore scholarship, newly possible."\n\nWhat is the central claim?',
    options: [
      { id: 'a', content: 'Scribes were careless copyists who damaged the accuracy of historical texts.' },
      { id: 'b', content: 'The printing press transformed not just the speed but the character of information, enabling new forms of scholarship.' },
      { id: 'c', content: 'The printing press was invented primarily to support academic research.' },
      { id: 'd', content: 'Standardization of texts made scribes obsolete in European society.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The passage argues that the press changed not only speed but also the nature of information (standardization), which enabled textual comparison and scholarship. Option B captures this two-part argument. Option A mischaracterizes scribes; C invents an unstated purpose; D overstates what the passage says.',
    points: 1,
    tags: ['main-idea', 'history-passage', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-02',
    subject: 'SAT Reading & Writing',
    topic: 'Words in Context',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'From a review of a legal case:\n\n"The defense counsel\'s argument was largely specious: it appeared logically sound on the surface but contained a fundamental error that the prosecution quickly exposed."\n\nAs used here, "specious" most nearly means:',
    options: [
      { id: 'a', content: 'detailed and well-researched' },
      { id: 'b', content: 'superficially plausible but actually flawed' },
      { id: 'c', content: 'aggressively confrontational' },
      { id: 'd', content: 'deliberately deceptive and dishonest' },
    ],
    correctAnswerId: 'b',
    explanation:
      '"Specious" means having an attractive or plausible appearance while being actually false or misleading. The context ("appeared logically sound on the surface but contained a fundamental error") perfectly reflects this definition. It is not merely "deceptive" (D) — which implies intent; specious reasoning can be unintentionally flawed.',
    points: 1,
    tags: ['vocabulary', 'words-in-context', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-03',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Relative Clauses',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Choose the grammatically correct option:\n\n"The scientist _____ published the groundbreaking paper received the award."',
    options: [
      { id: 'a', content: 'who' },
      { id: 'b', content: 'which' },
      { id: 'c', content: 'whom' },
      { id: 'd', content: 'whose' },
    ],
    correctAnswerId: 'a',
    explanation:
      '"Who" is used as the subject of the relative clause (the scientist is the one who published). "Which" refers to non-human objects. "Whom" is used when the pronoun is an object (e.g., "the scientist whom we recognized"). "Whose" indicates possession. Here, "who" is the subject performing the action.',
    points: 1,
    tags: ['relative-clauses', 'who-whom', 'grammar', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-04',
    subject: 'SAT Reading & Writing',
    topic: 'Inference — Science',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'From a neuroscience article:\n\n"Mirror neurons, discovered in macaque monkeys, fire both when an animal performs an action and when it observes the same action in another individual. Subsequent research has found analogous neural circuits in humans associated with empathy and social understanding. However, the direct behavioral implications of human mirror neuron activity remain a subject of ongoing debate."\n\nWhich inference is best supported by this passage?',
    options: [
      { id: 'a', content: 'Mirror neurons definitively explain how human empathy works at the neural level.' },
      { id: 'b', content: 'The discovery of mirror neurons in humans proves that observation and action share identical neural pathways.' },
      { id: 'c', content: 'While analogous systems have been found in humans, the full behavioral significance of human mirror neurons is not yet established.' },
      { id: 'd', content: 'Mirror neurons are unique to primates and have no parallel in other species.' },
    ],
    correctAnswerId: 'c',
    explanation:
      'The passage says researchers found "analogous circuits" in humans but that behavioral implications "remain a subject of ongoing debate." Option C accurately reflects this qualified, uncertain status. Option A overclaims ("definitively explain"); B misrepresents the finding as "identical"; D is not stated in the text.',
    points: 2,
    tags: ['inference', 'neuroscience-passage', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-05',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Comma Usage',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'Which option is correctly punctuated?\n\nSelect the correct version of: "The results however were inconclusive."',
    options: [
      { id: 'a', content: 'The results however, were inconclusive.' },
      { id: 'b', content: 'The results, however, were inconclusive.' },
      { id: 'c', content: 'The results however were, inconclusive.' },
      { id: 'd', content: 'The results; however, were inconclusive.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'When "however" is used as an interrupter (parenthetical adverb) in the middle of a sentence, it must be set off by commas on both sides: "The results, however, were inconclusive." Option D uses a semicolon before "however" which is only correct when "however" joins two independent clauses.',
    points: 1,
    tags: ['comma', 'interrupters', 'however', 'grammar', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-06',
    subject: 'SAT Reading & Writing',
    topic: 'Rhetorical Synthesis',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'A student wants to write a sentence emphasizing that both regular exercise AND adequate sleep independently contribute to better academic performance. Which option best accomplishes this goal?',
    options: [
      { id: 'a', content: 'Students who exercise regularly and sleep adequately often perform better academically, and the two habits may reinforce each other.' },
      { id: 'b', content: 'Both regular exercise and adequate sleep have been independently shown to improve academic performance, though the effects may be greater in combination.' },
      { id: 'c', content: 'Regular exercise is more important than sleep for academic performance.' },
      { id: 'd', content: 'Students should prioritize sleep over exercise when time is limited.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The task asks for emphasis on both habits contributing INDEPENDENTLY. Option B says both have been "independently shown" to improve performance — directly matching the requirement. Option A says they "may reinforce each other" without confirming independent effects. Options C and D compare or prioritize them, contradicting the goal.',
    points: 2,
    tags: ['rhetorical-synthesis', 'argumentation', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-07',
    subject: 'SAT Reading & Writing',
    topic: 'Words in Context',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'From an art history essay:\n\n"The Baroque period was characterized by an effusive use of ornament — gilded surfaces, dramatic light contrasts, and elaborate sculptural programs overwhelmed the senses in a deliberate attempt to inspire awe and convey the power of the Church."\n\nAs used here, "effusive" most nearly means:',
    options: [
      { id: 'a', content: 'restrained and minimal' },
      { id: 'b', content: 'overflowing and excessively expressive' },
      { id: 'c', content: 'intellectually complex and nuanced' },
      { id: 'd', content: 'carefully structured and precise' },
    ],
    correctAnswerId: 'b',
    explanation:
      '"Effusive" means expressing feelings or ideas in an unrestrained, overflowing manner. In context, the Baroque style is described as overwhelming the senses with gilding, drama, and elaborate programs — clearly an excess of ornament. This is the opposite of A (restrained/minimal) and D (carefully structured).',
    points: 1,
    tags: ['vocabulary', 'art-history', 'words-in-context', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-08',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Semicolons',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Which option correctly uses a semicolon?\n\n(Original) "The conference was scheduled for March however the venue canceled at the last minute."',
    options: [
      { id: 'a', content: 'The conference was scheduled for March, however the venue canceled at the last minute.' },
      { id: 'b', content: 'The conference was scheduled for March; however, the venue canceled at the last minute.' },
      { id: 'c', content: 'The conference was scheduled for March; however the venue canceled at the last minute.' },
      { id: 'd', content: 'The conference was scheduled for March, however, the venue canceled at the last minute.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'When "however" joins two independent clauses as a conjunctive adverb, it requires a semicolon BEFORE it and a comma AFTER it: "...March; however, the venue..." Option A is a comma splice. Option C lacks the comma after "however." Option D is also a comma splice (two commas around "however" without the semicolon).',
    points: 2,
    tags: ['semicolons', 'however', 'conjunctive-adverbs', 'grammar', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-09',
    subject: 'SAT Reading & Writing',
    topic: 'Inference — Literature',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'From a literary critic\'s review:\n\n"In the novel\'s third chapter, the protagonist\'s lengthy internal monologue about her childhood home is interrupted seven times by the sound of the phone ringing — a phone she never answers. The calls stop only when she finally speaks aloud for the first time in the narrative."\n\nWhat can most reasonably be inferred about the author\'s technique?',
    options: [
      { id: 'a', content: 'The author uses the phone to symbolize the protagonist\'s unresolved connection to her present life, which she addresses only when she begins to speak.' },
      { id: 'b', content: 'The protagonist is deaf and cannot hear the phone.' },
      { id: 'c', content: 'The author is making an argument about the dangers of ignoring telephone calls.' },
      { id: 'd', content: 'The repeated phone ringing is an error the author should have corrected.' },
    ],
    correctAnswerId: 'a',
    explanation:
      'The deliberate parallel — interruptions stop when the protagonist speaks — suggests symbolic intent: the phone represents the outside world or present life calling to her, which she only acknowledges when she breaks her silence. Options B, C, and D either contradict the literary context or are implausible interpretations.',
    points: 1,
    tags: ['inference', 'literary-technique', 'symbolism', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-10',
    subject: 'SAT Reading & Writing',
    topic: 'Data Analysis',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A graph shows: City A has a population of 500,000 and an average commute of 28 minutes. City B has a population of 900,000 and an average commute of 42 minutes. City C has a population of 200,000 and an average commute of 22 minutes.\n\nA researcher claims: "Larger city populations cause longer average commutes."\n\nThe data best supports which conclusion?',
    options: [
      { id: 'a', content: 'There is a positive correlation between population size and commute time in this data, though causation is not established.' },
      { id: 'b', content: 'Population size directly causes longer commutes in all cities.' },
      { id: 'c', content: 'City C is an outlier and should be excluded from analysis.' },
      { id: 'd', content: 'City B residents should move to City C to reduce their commute.' },
    ],
    correctAnswerId: 'a',
    explanation:
      'The data shows larger populations tend to correlate with longer commutes (C: 200K/22min, A: 500K/28min, B: 900K/42min). Option A correctly identifies this as a correlation — not proven causation. Option B overclaims causation from observational data. Option C and D are not supported by the data.',
    points: 1,
    tags: ['data-analysis', 'correlation', 'sat-rw'],
  },
];

// ── Math — Module 1 (10 q / 20 min, calculator allowed) ────────────────────
const mathModule1: DemoQuestion[] = [
  {
    id: 'sat2-m1-01',
    subject: 'SAT Math',
    topic: 'Linear Equations',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question: 'If 5y + 3 = 3y + 11, what is the value of y?',
    options: [
      { id: 'a', content: '2' },
      { id: 'b', content: '4' },
      { id: 'c', content: '6' },
      { id: 'd', content: '7' },
    ],
    correctAnswerId: 'b',
    explanation:
      '5y + 3 = 3y + 11 → 2y = 8 → y = 4.',
    points: 1,
    tags: ['linear-equations', 'algebra', 'sat-math'],
  },
  {
    id: 'sat2-m1-02',
    subject: 'SAT Math',
    topic: 'Systems of Equations',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'In the system below, what is the value of y?\n\n3x + 2y = 16\nx − y = 2',
    options: [
      { id: 'a', content: '1' },
      { id: 'b', content: '2' },
      { id: 'c', content: '3' },
      { id: 'd', content: '4' },
    ],
    correctAnswerId: 'b',
    explanation:
      'From x − y = 2: x = y + 2. Substitute into first equation: 3(y + 2) + 2y = 16 → 3y + 6 + 2y = 16 → 5y = 10 → y = 2.',
    points: 1,
    tags: ['systems-of-equations', 'substitution', 'sat-math'],
  },
  {
    id: 'sat2-m1-03',
    subject: 'SAT Math',
    topic: 'Geometry — Triangles',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'In triangle ABC, angle A = 48° and angle B = 67°. What is the measure of angle C?',
    options: [
      { id: 'a', content: '55°' },
      { id: 'b', content: '60°' },
      { id: 'c', content: '65°' },
      { id: 'd', content: '70°' },
    ],
    correctAnswerId: 'c',
    explanation:
      'The angles of a triangle sum to 180°. Angle C = 180° − 48° − 67° = 65°.',
    points: 1,
    tags: ['geometry', 'triangles', 'angle-sum', 'sat-math'],
  },
  {
    id: 'sat2-m1-04',
    subject: 'SAT Math',
    topic: 'Proportional Reasoning',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A car travels 180 miles in 3 hours. At the same rate, how far will it travel in 5 hours?',
    options: [
      { id: 'a', content: '240 miles' },
      { id: 'b', content: '270 miles' },
      { id: 'c', content: '300 miles' },
      { id: 'd', content: '360 miles' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Rate = 180/3 = 60 mph. Distance in 5 hours = 60 × 5 = 300 miles.',
    points: 1,
    tags: ['proportions', 'rate', 'sat-math'],
  },
  {
    id: 'sat2-m1-05',
    subject: 'SAT Math',
    topic: 'Statistics — Median',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'The data set {3, 7, 9, 2, 14, 6, 11} is arranged in ascending order. What is the median?',
    options: [
      { id: 'a', content: '6' },
      { id: 'b', content: '7' },
      { id: 'c', content: '9' },
      { id: 'd', content: '11' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Sorted: {2, 3, 6, 7, 9, 11, 14}. With 7 values, the median is the 4th value = 7.',
    points: 1,
    tags: ['statistics', 'median', 'sat-math'],
  },
  {
    id: 'sat2-m1-06',
    subject: 'SAT Math',
    topic: 'Functions — Domain',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Which value is NOT in the domain of f(x) = √(x − 4)?',
    options: [
      { id: 'a', content: 'x = 4' },
      { id: 'b', content: 'x = 5' },
      { id: 'c', content: 'x = 0' },
      { id: 'd', content: 'x = 10' },
    ],
    correctAnswerId: 'c',
    explanation:
      'For √(x − 4) to be real, we need x − 4 ≥ 0, so x ≥ 4. x = 0 gives √(0 − 4) = √(−4), which is not a real number, so x = 0 is NOT in the domain. All other options satisfy x ≥ 4.',
    points: 2,
    tags: ['functions', 'domain', 'radicals', 'sat-math'],
  },
  {
    id: 'sat2-m1-07',
    subject: 'SAT Math',
    topic: 'Word Problem — Mixtures',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'A chemist has a 20% acid solution and a 50% acid solution. How many liters of the 20% solution must be mixed with 6 liters of the 50% solution to obtain a 30% acid solution?',
    options: [
      { id: 'a', content: '10 liters' },
      { id: 'b', content: '12 liters' },
      { id: 'c', content: '15 liters' },
      { id: 'd', content: '18 liters' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Let x = liters of 20% solution. Acid equation: 0.20x + 0.50(6) = 0.30(x + 6). → 0.20x + 3 = 0.30x + 1.8 → 1.2 = 0.10x → x = 12 liters.',
    points: 2,
    tags: ['mixtures', 'word-problem', 'algebra', 'sat-math'],
  },
  {
    id: 'sat2-m1-08',
    subject: 'SAT Math',
    topic: 'Exponents',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'If 2^x = 32, what is the value of 4^x?',
    options: [
      { id: 'a', content: '64' },
      { id: 'b', content: '512' },
      { id: 'c', content: '1024' },
      { id: 'd', content: '2048' },
    ],
    correctAnswerId: 'c',
    explanation:
      '2^x = 32 = 2^5, so x = 5. Then 4^5 = (2^2)^5 = 2^10 = 1024.',
    points: 2,
    tags: ['exponents', 'algebra', 'sat-math'],
  },
  {
    id: 'sat2-m1-09',
    subject: 'SAT Math',
    topic: 'Percent Change',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'A stock\'s price fell from $80 to $60. What is the percent decrease?',
    options: [
      { id: 'a', content: '20%' },
      { id: 'b', content: '25%' },
      { id: 'c', content: '33%' },
      { id: 'd', content: '40%' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Percent decrease = (change / original) × 100 = (80 − 60) / 80 × 100 = 20/80 × 100 = 25%.',
    points: 1,
    tags: ['percent-change', 'sat-math'],
  },
  {
    id: 'sat2-m1-10',
    subject: 'SAT Math',
    topic: 'Linear Models',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A cell phone plan charges a flat monthly fee of $25 plus $0.10 per text message. Which equation gives the total monthly cost C for sending t text messages?',
    options: [
      { id: 'a', content: 'C = 0.10t' },
      { id: 'b', content: 'C = 25t + 0.10' },
      { id: 'c', content: 'C = 25 + 0.10t' },
      { id: 'd', content: 'C = 0.10(25 + t)' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Total cost = flat fee + (rate per text × number of texts) = 25 + 0.10t. This is a linear model with y-intercept 25 and slope 0.10.',
    points: 1,
    tags: ['linear-models', 'word-problem', 'sat-math'],
  },
];

// ── Math — Module 2 (10 q / 20 min, calculator allowed) ────────────────────
const mathModule2: DemoQuestion[] = [
  {
    id: 'sat2-m2-01',
    subject: 'SAT Math',
    topic: 'Quadratic Equations',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Which of the following is a solution to 2x² − x − 6 = 0?',
    options: [
      { id: 'a', content: 'x = −2' },
      { id: 'b', content: 'x = −3/2' },
      { id: 'c', content: 'x = 2' },
      { id: 'd', content: 'x = 3' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Factor: 2x² − x − 6 = (2x + 3)(x − 2) = 0. Solutions: x = −3/2 or x = 2. Option C (x = 2) is one solution.',
    points: 2,
    tags: ['quadratics', 'factoring', 'sat-math'],
  },
  {
    id: 'sat2-m2-02',
    subject: 'SAT Math',
    topic: 'Geometry — Volume',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A cylindrical water tank has a radius of 5 meters and a height of 12 meters. What is the volume of the tank? (Use π ≈ 3.14)',
    options: [
      { id: 'a', content: '942 m³' },
      { id: 'b', content: '1,570 m³' },
      { id: 'c', content: '1,884 m³' },
      { id: 'd', content: '2,355 m³' },
    ],
    correctAnswerId: 'a',
    explanation:
      'V = πr²h = 3.14 × 5² × 12 = 3.14 × 25 × 12 = 3.14 × 300 = 942 m³.',
    points: 2,
    tags: ['geometry', 'volume', 'cylinder', 'sat-math'],
  },
  {
    id: 'sat2-m2-03',
    subject: 'SAT Math',
    topic: 'Scatterplots',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A scatterplot shows hours of sunlight (x) versus crop yield in bushels (y). The line of best fit is y = 8.5x − 12. What does the slope of this line represent?',
    options: [
      { id: 'a', content: 'The minimum crop yield regardless of sunlight' },
      { id: 'b', content: 'The average number of hours of sunlight in the dataset' },
      { id: 'c', content: 'The predicted change in crop yield for each additional hour of sunlight' },
      { id: 'd', content: 'The total crop yield when no sunlight is present' },
    ],
    correctAnswerId: 'c',
    explanation:
      'In a linear model y = mx + b, the slope (m = 8.5) represents the rate of change: for each 1-unit increase in x (hours of sunlight), y (crop yield) increases by 8.5 bushels. The y-intercept (−12) is the predicted yield at zero sunlight — not the slope.',
    points: 1,
    tags: ['scatterplots', 'slope', 'linear-models', 'sat-math'],
  },
  {
    id: 'sat2-m2-04',
    subject: 'SAT Math',
    topic: 'Trigonometry',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'In a right triangle, sin(θ) = 3/5. What is cos(θ)?',
    options: [
      { id: 'a', content: '3/4' },
      { id: 'b', content: '4/5' },
      { id: 'c', content: '5/3' },
      { id: 'd', content: '3/5' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Using the Pythagorean identity: sin²θ + cos²θ = 1. (3/5)² + cos²θ = 1 → 9/25 + cos²θ = 1 → cos²θ = 16/25 → cosθ = 4/5 (positive in a right triangle where θ is acute).',
    points: 2,
    tags: ['trigonometry', 'pythagorean-identity', 'sat-math'],
  },
  {
    id: 'sat2-m2-05',
    subject: 'SAT Math',
    topic: 'Exponential Decay',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'A radioactive substance has a half-life of 5 years. If the initial mass is 80 grams, what will the mass be after 20 years?',
    options: [
      { id: 'a', content: '2.5 g' },
      { id: 'b', content: '5 g' },
      { id: 'c', content: '10 g' },
      { id: 'd', content: '20 g' },
    ],
    correctAnswerId: 'b',
    explanation:
      'After 20 years: 20/5 = 4 half-lives. Mass = 80 × (1/2)⁴ = 80/16 = 5 grams.',
    points: 2,
    tags: ['exponential-decay', 'half-life', 'sat-math'],
  },
  {
    id: 'sat2-m2-06',
    subject: 'SAT Math',
    topic: 'Coordinate Geometry',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'The midpoint of segment AB is M(3, −1). If A has coordinates (1, 5), what are the coordinates of B?',
    options: [
      { id: 'a', content: '(2, 2)' },
      { id: 'b', content: '(5, −7)' },
      { id: 'c', content: '(4, −4)' },
      { id: 'd', content: '(7, −3)' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Midpoint formula: M = ((x₁+x₂)/2, (y₁+y₂)/2). So (1+x₂)/2 = 3 → x₂ = 5. And (5+y₂)/2 = −1 → 5+y₂ = −2 → y₂ = −7. B = (5, −7).',
    points: 2,
    tags: ['coordinate-geometry', 'midpoint', 'sat-math'],
  },
  {
    id: 'sat2-m2-07',
    subject: 'SAT Math',
    topic: 'Polynomial Operations',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'What is the product of (2x − 3)(x + 4)?',
    options: [
      { id: 'a', content: '2x² + 5x − 12' },
      { id: 'b', content: '2x² + 11x − 12' },
      { id: 'c', content: '2x² − 5x − 12' },
      { id: 'd', content: '2x² + 5x + 12' },
    ],
    correctAnswerId: 'a',
    explanation:
      'FOIL: (2x)(x) + (2x)(4) + (−3)(x) + (−3)(4) = 2x² + 8x − 3x − 12 = 2x² + 5x − 12.',
    points: 1,
    tags: ['polynomials', 'FOIL', 'sat-math'],
  },
  {
    id: 'sat2-m2-08',
    subject: 'SAT Math',
    topic: 'Statistics — Standard Deviation',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Set A = {2, 4, 6, 8, 10} and Set B = {4, 5, 6, 7, 8}. Both sets have the same mean (6). Which of the following is true about their standard deviations?',
    options: [
      { id: 'a', content: 'Set A and Set B have the same standard deviation.' },
      { id: 'b', content: 'Set A has a larger standard deviation than Set B.' },
      { id: 'c', content: 'Set B has a larger standard deviation than Set A.' },
      { id: 'd', content: 'Standard deviation cannot be compared between sets of equal mean.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Standard deviation measures spread from the mean. Set A\'s values (2–10) are further from the mean of 6 than Set B\'s values (4–8). Greater spread = larger standard deviation. Set A has σ ≈ 2.83; Set B has σ ≈ 1.41. So Set A has the larger standard deviation.',
    points: 2,
    tags: ['statistics', 'standard-deviation', 'spread', 'sat-math'],
  },
  {
    id: 'sat2-m2-09',
    subject: 'SAT Math',
    topic: 'Rational Equations',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'If (x + 2) / (x − 3) = 5, what is the value of x?',
    options: [
      { id: 'a', content: '17/4' },
      { id: 'b', content: '13/4' },
      { id: 'c', content: '4' },
      { id: 'd', content: '7/2' },
    ],
    correctAnswerId: 'a',
    explanation:
      'Cross-multiply: x + 2 = 5(x − 3) → x + 2 = 5x − 15 → 17 = 4x → x = 17/4.',
    points: 2,
    tags: ['rational-equations', 'algebra', 'sat-math'],
  },
  {
    id: 'sat2-m2-10',
    subject: 'SAT Math',
    topic: 'Geometry — Similar Triangles',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'Triangle ABC is similar to triangle DEF. The sides of triangle ABC are 6, 8, and 10. If the longest side of triangle DEF is 25, what is the perimeter of triangle DEF?',
    options: [
      { id: 'a', content: '45' },
      { id: 'b', content: '50' },
      { id: 'c', content: '55' },
      { id: 'd', content: '60' },
    ],
    correctAnswerId: 'd',
    explanation:
      'Scale factor: 25/10 = 2.5. Sides of DEF: 6×2.5=15, 8×2.5=20, 10×2.5=25. Perimeter = 15+20+25 = 60.',
    points: 2,
    tags: ['geometry', 'similar-triangles', 'scale-factor', 'sat-math'],
  },
];

export const SAT_MOCK_TEST_2_SECTIONS: ExamSection[] = [
  {
    name: 'Reading & Writing — Module 1',
    shortName: 'RW-1',
    questions: rwModule1,
    timeLimit: 960,
    hasCalculator: false,
  },
  {
    name: 'Reading & Writing — Module 2',
    shortName: 'RW-2',
    questions: rwModule2,
    timeLimit: 960,
    hasCalculator: false,
  },
  {
    name: 'Math — Module 1',
    shortName: 'M-1',
    questions: mathModule1,
    timeLimit: 1200,
    hasCalculator: true,
  },
  {
    name: 'Math — Module 2',
    shortName: 'M-2',
    questions: mathModule2,
    timeLimit: 1200,
    hasCalculator: true,
  },
];
