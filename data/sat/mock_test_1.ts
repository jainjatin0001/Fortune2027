import type { DemoQuestion } from '@/types';
import type { ExamSection } from '@/components/shared/ExamInterface';

// ── Reading & Writing — Module 1 (10 q / 16 min) ───────────────────────────
const rwModule1: DemoQuestion[] = [
  {
    id: 'sat1-rw1-01',
    subject: 'SAT Reading & Writing',
    topic: 'Main Idea',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'The following text is from a 2023 scientific article on ocean acidification:\n\n"As atmospheric carbon dioxide concentrations rise, more CO₂ dissolves into seawater, forming carbonic acid. This acidification threatens marine organisms that depend on calcium carbonate for shells and skeletons. Studies show that at current emission rates, ocean pH could drop by 0.4 units by 2100—a level not seen in 20 million years."\n\nWhat is the central claim of this passage?',
    options: [
      { id: 'a', content: 'Ocean acidification will cause all marine life to go extinct by 2100.' },
      { id: 'b', content: 'Rising CO₂ emissions are lowering ocean pH to historically unprecedented levels, threatening calcifying marine organisms.' },
      { id: 'c', content: 'Calcium carbonate is the primary building material used by all ocean creatures.' },
      { id: 'd', content: 'Scientists have been unable to measure the impact of carbon dioxide on ocean chemistry.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The passage claims rising CO₂ causes acidification threatening calcium-carbonate-dependent organisms, and the projected pH drop is historically unprecedented. Option B captures both claims accurately without overstating ("all marine life") or misrepresenting the evidence.',
    points: 1,
    tags: ['main-idea', 'science-passage', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-02',
    subject: 'SAT Reading & Writing',
    topic: 'Words in Context',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'The following sentence is from a political biography:\n\n"The senator\'s ostensibly conciliatory remarks masked a deeper ambivalence about the terms of the treaty."\n\nAs used in this sentence, "conciliatory" most nearly means:',
    options: [
      { id: 'a', content: 'intended to provoke conflict' },
      { id: 'b', content: 'aimed at bringing about goodwill or agreement' },
      { id: 'c', content: 'deliberately misleading in nature' },
      { id: 'd', content: 'highly technical and legal in language' },
    ],
    correctAnswerId: 'b',
    explanation:
      '"Conciliatory" describes speech or actions meant to reduce hostility and achieve reconciliation. In context, the remarks appeared to aim at goodwill ("ostensibly" signals the appearance may be deceptive), while deeper ambivalence existed underneath.',
    points: 1,
    tags: ['vocabulary', 'words-in-context', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-03',
    subject: 'SAT Reading & Writing',
    topic: 'Inference',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'The following text is from a historical essay on media:\n\n"By 1850, the telegraph had connected cities across thousands of miles, allowing news that once took weeks to arrive in hours. Newspapers that previously printed local affairs almost exclusively began publishing dispatches from distant regions. Editors found themselves selecting from far more stories than they could print."\n\nWhich inference about newspaper editors in 1850 is best supported by the passage?',
    options: [
      { id: 'a', content: 'They resented the telegraph because it increased their workload significantly.' },
      { id: 'b', content: 'They faced new editorial decisions about which distant news to include.' },
      { id: 'c', content: 'They preferred covering local events over national and international ones.' },
      { id: 'd', content: 'They collaborated directly with telegraph operators to choose stories.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The passage states editors received more stories than they could print due to telegraph-transmitted dispatches. This directly supports option B — they had to make new selection decisions. Option A introduces resentment not in the text; C and D are not supported by any evidence in the passage.',
    points: 1,
    tags: ['inference', 'historical-passage', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-04',
    subject: 'SAT Reading & Writing',
    topic: 'Command of Evidence — Dual Text',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'Text 1:\n"Researchers found that students who took handwritten notes retained information significantly better in long-term recall tests than those who typed their notes."\n\nText 2:\n"A follow-up study challenged these results, noting that typing speed varied considerably across subjects. Slower typists may have been disadvantaged, while fast typists showed retention comparable to handwriters."\n\nBased on these texts, how would the author of Text 2 most likely respond to the claim in Text 1?',
    options: [
      { id: 'a', content: 'By arguing that handwriting is always superior to typing for every student' },
      { id: 'b', content: 'By questioning whether typing speed was adequately controlled in Text 1\'s study' },
      { id: 'c', content: 'By agreeing that long-term retention is the best metric for measuring learning' },
      { id: 'd', content: 'By suggesting the study should be repeated with a larger sample size' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Text 2 specifically identifies typing speed as a confounding variable that may have skewed Text 1\'s results. This is a direct methodological critique — the variable was not controlled for, undermining the conclusion. Option B best captures this targeted response.',
    points: 2,
    tags: ['dual-text', 'evidence', 'critical-reasoning', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-05',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Punctuation',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'Choose the option that correctly completes the sentence:\n\n"The architect designed three distinct spaces _____ a sunlit atrium, a quiet reading room, and a collaborative workspace."',
    options: [
      { id: 'a', content: ';' },
      { id: 'b', content: ':' },
      { id: 'c', content: ',' },
      { id: 'd', content: '.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'A colon is used after an independent clause to introduce a list or elaboration. The phrase before the blank is a complete sentence, making a colon correct. A semicolon joins two independent clauses — it cannot introduce a list. A comma and a period would not appropriately introduce the items.',
    points: 1,
    tags: ['punctuation', 'colon', 'grammar', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-06',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Transitions',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Choose the best word to complete the sentence:\n\n"The new policy promised significant cost savings. _____, the first audit revealed that implementation expenses exceeded projected savings."',
    options: [
      { id: 'a', content: 'Therefore' },
      { id: 'b', content: 'In addition' },
      { id: 'c', content: 'However' },
      { id: 'd', content: 'Similarly' },
    ],
    correctAnswerId: 'c',
    explanation:
      '"However" signals a contrast between two ideas. The second sentence contradicts the first (promised savings vs. actual costs exceeding savings). "Therefore" signals conclusion; "In addition" adds information; "Similarly" signals likeness — none fit the contradictory relationship here.',
    points: 1,
    tags: ['transitions', 'logical-flow', 'grammar', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-07',
    subject: 'SAT Reading & Writing',
    topic: 'Rhetorical Purpose',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Read the following excerpt from a conservationist\'s speech:\n\n"We have not inherited this land from our parents — we have borrowed it from our children. Every acre of forest cleared, every river dammed, these are debts we impose on those who cannot yet speak for themselves."\n\nWhat is the primary rhetorical strategy used in this excerpt?',
    options: [
      { id: 'a', content: 'Appeal to authority by citing scientific research on deforestation' },
      { id: 'b', content: 'Use of metaphor to frame environmental responsibility in generational terms' },
      { id: 'c', content: 'Presentation of statistical evidence to quantify environmental damage' },
      { id: 'd', content: 'Logical argument demonstrating the economic benefits of forest conservation' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The speaker uses a metaphor — "borrowed from our children" — to reframe stewardship as a generational debt. No statistics or authorities are cited (ruling out A and C), and no economic argument is made (ruling out D). The central device is figurative language shaping the ethical frame.',
    points: 1,
    tags: ['rhetoric', 'metaphor', 'literary-devices', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-08',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Modifiers',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Identify the version that correctly fixes the dangling modifier:\n\n(Original) "Having finished the experiment, the results were recorded in the lab notebook."',
    options: [
      { id: 'a', content: 'Having finished the experiment, the results were recorded in the lab notebook.' },
      { id: 'b', content: 'After having finished the experiment, the results were recorded by the scientist.' },
      { id: 'c', content: 'Having finished the experiment, the scientist recorded the results in the lab notebook.' },
      { id: 'd', content: 'The results, having finished the experiment, were recorded in the lab notebook.' },
    ],
    correctAnswerId: 'c',
    explanation:
      'The original has a dangling modifier — "Having finished the experiment" implies the subject performed the finishing, but "the results" cannot finish an experiment. Option C correctly makes "the scientist" the grammatical subject who finished the experiment and recorded results.',
    points: 2,
    tags: ['modifiers', 'dangling-modifier', 'grammar', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-09',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Parallelism',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Choose the version that correctly maintains parallel structure:\n\n"The new CEO vowed to cut costs, improving efficiency, and to increase staff morale."',
    options: [
      { id: 'a', content: 'The new CEO vowed to cut costs, improving efficiency, and to increase staff morale.' },
      { id: 'b', content: 'The new CEO vowed to cut costs, to improve efficiency, and to increase staff morale.' },
      { id: 'c', content: 'The new CEO vowed cutting costs, to improve efficiency, and increasing staff morale.' },
      { id: 'd', content: 'The new CEO vowed to cut costs, improve efficiency, and the increase of staff morale.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Parallel structure requires items in a series to use the same grammatical form. Since the series follows "vowed to," each item should use the infinitive: "to cut," "to improve," "to increase." Option B is the only choice with three parallel infinitives.',
    points: 1,
    tags: ['parallelism', 'grammar', 'style', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-10',
    subject: 'SAT Reading & Writing',
    topic: 'Data Analysis',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'A survey of 200 high schoolers on weekly study habits found:\n• 1–2 hrs/week → average exam score: 72%\n• 3–4 hrs/week → average exam score: 81%\n• 5+ hrs/week → average exam score: 88%\n\nA student concludes: "More study time directly causes higher exam scores."\n\nWhich statement best identifies the flaw in this conclusion?',
    options: [
      { id: 'a', content: 'The sample of 200 is too small to draw any conclusions from.' },
      { id: 'b', content: 'The data shows correlation but does not prove causation — other factors may explain both study time and scores.' },
      { id: 'c', content: 'The study should have included college students to be valid.' },
      { id: 'd', content: 'Exam scores are not a reliable measure of academic learning.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The core flaw is confusing correlation with causation. A third variable (e.g., motivation, prior knowledge) could independently drive both more study time and higher scores. The conclusion that study time "causes" higher scores goes beyond what observational data can establish.',
    points: 2,
    tags: ['data-analysis', 'causation-correlation', 'critical-reasoning', 'sat-rw'],
  },
];

// ── Reading & Writing — Module 2 (10 q / 16 min) ───────────────────────────
const rwModule2: DemoQuestion[] = [
  {
    id: 'sat1-rw2-01',
    subject: 'SAT Reading & Writing',
    topic: 'Main Idea',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'The following text is from an urban planning essay:\n\n"For decades, city planners assumed wider roads would reduce traffic congestion. However, studies since the 1990s have documented \'induced demand\': expanding road capacity increases the number of drivers, ultimately restoring or worsening the original congestion. The most effective approaches to urban mobility involve reducing the need to drive, not merely accommodating it."\n\nWhich best states the main idea?',
    options: [
      { id: 'a', content: 'Traffic congestion is an unsolvable problem in modern cities.' },
      { id: 'b', content: 'Wider roads are more expensive than public transit alternatives.' },
      { id: 'c', content: 'Expanding road capacity counterproductively increases traffic due to induced demand, so better solutions reduce driving needs.' },
      { id: 'd', content: 'City planners have consistently ignored research findings in infrastructure decisions.' },
    ],
    correctAnswerId: 'c',
    explanation:
      'The passage introduces induced demand as evidence that wider roads fail, then concludes that reducing driving need is more effective. Option C accurately captures the key evidence and conclusion. The other options overstate (A, D) or introduce a comparison not in the text (B).',
    points: 1,
    tags: ['main-idea', 'urban-planning', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-02',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Pronoun Agreement',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'Choose the option that correctly completes the sentence:\n\n"Each of the researchers submitted _____ final report before the deadline."',
    options: [
      { id: 'a', content: 'their' },
      { id: 'b', content: 'his or her' },
      { id: 'c', content: 'its' },
      { id: 'd', content: 'our' },
    ],
    correctAnswerId: 'b',
    explanation:
      '"Each" is a singular indefinite pronoun and requires a singular pronoun. On the SAT, "his or her" is the standard singular gender-neutral choice when offered. "Its" applies to non-human referents; "our" changes the subject; "their" with singular "each" is increasingly accepted but SAT convention prefers "his or her."',
    points: 1,
    tags: ['pronouns', 'agreement', 'grammar', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-03',
    subject: 'SAT Reading & Writing',
    topic: 'Words in Context',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'The following sentence is from a political science text:\n\n"The senator\'s equivocal response left both supporters and opponents uncertain about his actual position on tariffs."\n\nAs used in this sentence, "equivocal" most nearly means:',
    options: [
      { id: 'a', content: 'direct and unambiguous' },
      { id: 'b', content: 'deliberately vague or open to multiple interpretations' },
      { id: 'c', content: 'strongly argued and persuasive' },
      { id: 'd', content: 'factually inaccurate or false' },
    ],
    correctAnswerId: 'b',
    explanation:
      '"Equivocal" describes language that is ambiguous or open to multiple interpretations, often to avoid commitment. The context — "left both supporters and opponents uncertain" — confirms the response was unclear. This is the opposite of A (direct/unambiguous), unrelated to C or D.',
    points: 1,
    tags: ['vocabulary', 'words-in-context', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-04',
    subject: 'SAT Reading & Writing',
    topic: 'Inference',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Text from an economics article:\n\n"When the price of a substitute good falls, consumers typically shift demand away from the original good. This principle was observed when streaming services dropped prices: theater attendance declined in cities where streaming penetration was highest."\n\nWhich conclusion is most directly supported?',
    options: [
      { id: 'a', content: 'Movie theaters will become obsolete within a decade.' },
      { id: 'b', content: 'Streaming services are inherently more enjoyable than movie theaters.' },
      { id: 'c', content: 'Lower streaming prices appear to have reduced demand for movie theaters in high-streaming cities.' },
      { id: 'd', content: 'Movie studios now prefer streaming over theatrical releases.' },
    ],
    correctAnswerId: 'c',
    explanation:
      'The passage directly presents the observation: in cities with high streaming adoption, theater attendance fell when streaming prices dropped. Option C accurately reflects this without overstating. Options A, B, and D introduce claims, preferences, or timelines not present in the text.',
    points: 1,
    tags: ['inference', 'economics-passage', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-05',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Apostrophes',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'Choose the option that correctly uses apostrophes in the blank:\n\n"The three _____ lab equipment was shared among the research team."',
    options: [
      { id: 'a', content: 'scientist\'s' },
      { id: 'b', content: 'scientists\'' },
      { id: 'c', content: 'scientists' },
      { id: 'd', content: 'scientist\'s\'' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The sentence refers to equipment belonging to three (plural) scientists. For plural nouns ending in -s, the possessive adds only an apostrophe after the s: "scientists\'." Option A ("scientist\'s") shows singular possession. Option C is the plain plural, not possessive. Option D is non-standard.',
    points: 1,
    tags: ['apostrophe', 'possessives', 'grammar', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-06',
    subject: 'SAT Reading & Writing',
    topic: 'Rhetorical Synthesis',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'A student is writing a research paper arguing that renewable energy adoption in rural areas faces unique obstacles. Which evidence would BEST support this argument?',
    options: [
      { id: 'a', content: 'A statistic showing that global investment in solar energy reached a record high last year' },
      { id: 'b', content: 'A case study finding that rural counties in three states lack the transmission infrastructure needed to connect new wind farms to the grid' },
      { id: 'c', content: 'A quote from an urban mayor praising the installation of rooftop solar panels in his city' },
      { id: 'd', content: 'A graph showing that renewable energy costs have declined 70% in the past decade globally' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The paper argues rural areas face unique obstacles to renewable adoption. Option B directly supports this by identifying a specific infrastructure obstacle unique to rural areas. Option A discusses global investment generally; C focuses on an urban context; D shows cost declines that would actually help, not hinder, adoption.',
    points: 2,
    tags: ['evidence-selection', 'argumentation', 'rhetoric', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-07',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Sentence Boundaries',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Which option correctly punctuates the following to avoid a run-on sentence?\n\n"The experiment yielded surprising results _____ the team decided to replicate it three more times."',
    options: [
      { id: 'a', content: 'results, therefore the team' },
      { id: 'b', content: 'results; therefore, the team' },
      { id: 'c', content: 'results therefore, the team' },
      { id: 'd', content: 'results. Therefore the team' },
    ],
    correctAnswerId: 'b',
    explanation:
      'When a conjunctive adverb ("therefore") joins two independent clauses, it requires a semicolon before it and a comma after it: "results; therefore, the team." Option A lacks the semicolon (run-on). Option C is a comma splice. Option D (period) creates a grammar fragment because "Therefore the team" needs the comma: "Therefore, the team."',
    points: 1,
    tags: ['punctuation', 'run-on', 'conjunctive-adverbs', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-08',
    subject: 'SAT Reading & Writing',
    topic: 'Words in Context',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'From a literary essay:\n\n"The novel\'s denouement is deliberately anticlimactic, leaving the reader with profound, unresolved tension rather than the cathartic release the narrative seemed to promise."\n\nAs used here, "denouement" most nearly means:',
    options: [
      { id: 'a', content: 'the opening chapter that establishes the main conflict' },
      { id: 'b', content: 'the climactic moment of highest dramatic tension in the story' },
      { id: 'c', content: 'the concluding resolution or unfolding of a story\'s complications' },
      { id: 'd', content: 'a literary technique that creates sustained irony throughout' },
    ],
    correctAnswerId: 'c',
    explanation:
      '"Denouement" (from French "to untie") refers to the concluding portion of a narrative where plot complications are resolved or concluded. Contrasting it with "cathartic release" signals it is the ending/resolution stage — not the opening (A), climax (B), or a technique (D).',
    points: 2,
    tags: ['vocabulary', 'literary-terms', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-09',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Subject-Verb Agreement',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Choose the correct verb form:\n\n"Neither the students nor the teacher _____ prepared for the unexpected power outage."',
    options: [
      { id: 'a', content: 'were' },
      { id: 'b', content: 'was' },
      { id: 'c', content: 'have been' },
      { id: 'd', content: 'are' },
    ],
    correctAnswerId: 'b',
    explanation:
      'With "neither...nor," the verb agrees with the subject closest to it ("the teacher," singular). Therefore "was" (singular past) is correct. If the order were reversed — "Neither the teacher nor the students" — the plural "were" would be required.',
    points: 1,
    tags: ['subject-verb-agreement', 'neither-nor', 'grammar', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-10',
    subject: 'SAT Reading & Writing',
    topic: 'Main Idea — Biology',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Text from a biology article:\n\n"The axolotl, a salamander native to Mexico, retains its juvenile features — including external gills and a finned tail — throughout its adult life, a phenomenon called neoteny. Unlike most amphibians, the axolotl achieves sexual maturity without completing metamorphosis. Researchers study the axolotl\'s remarkable regenerative abilities: it can regrow entire limbs, its spinal cord, and even parts of its heart."\n\nWhich sentence best states the author\'s main purpose?',
    options: [
      { id: 'a', content: 'To argue that the axolotl should receive more conservation funding' },
      { id: 'b', content: 'To describe the axolotl\'s biological uniqueness, including neoteny and regenerative capabilities' },
      { id: 'c', content: 'To compare the axolotl only to other salamander species' },
      { id: 'd', content: 'To explain why researchers have not yet understood axolotl genetics' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The passage describes two distinctive traits: neoteny and regeneration. Option B captures both aspects of the descriptive purpose. Conservation funding (A) is not mentioned. Option C is too narrow. Option D misrepresents the text — researchers do study the axolotl; the passage doesn\'t say they are confused.',
    points: 1,
    tags: ['main-idea', 'biology-passage', 'sat-rw'],
  },
];

// ── Math — Module 1 (10 q / 20 min, calculator allowed) ────────────────────
const mathModule1: DemoQuestion[] = [
  {
    id: 'sat1-m1-01',
    subject: 'SAT Math',
    topic: 'Linear Equations',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question: 'If 4x − 9 = 3, what is the value of 8x + 5?',
    options: [
      { id: 'a', content: '17' },
      { id: 'b', content: '21' },
      { id: 'c', content: '29' },
      { id: 'd', content: '37' },
    ],
    correctAnswerId: 'c',
    explanation:
      'From 4x − 9 = 3: 4x = 12, so x = 3. Then 8x + 5 = 8(3) + 5 = 24 + 5 = 29.',
    points: 1,
    tags: ['linear-equations', 'algebra', 'sat-math'],
  },
  {
    id: 'sat1-m1-02',
    subject: 'SAT Math',
    topic: 'Systems of Equations',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'In the system below, what is the value of x + y?\n\n2x + y = 11\nx − y = 1',
    options: [
      { id: 'a', content: '3' },
      { id: 'b', content: '5' },
      { id: 'c', content: '7' },
      { id: 'd', content: '9' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Adding the equations: (2x + y) + (x − y) = 11 + 1 → 3x = 12 → x = 4. Substituting: 4 − y = 1 → y = 3. Therefore x + y = 4 + 3 = 7.',
    points: 1,
    tags: ['systems-of-equations', 'algebra', 'sat-math'],
  },
  {
    id: 'sat1-m1-03',
    subject: 'SAT Math',
    topic: 'Ratios and Proportions',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'A recipe requires a ratio of 3 cups of flour to 2 cups of sugar. If a baker uses 12 cups of flour, how many cups of sugar are needed?',
    options: [
      { id: 'a', content: '6' },
      { id: 'b', content: '7' },
      { id: 'c', content: '8' },
      { id: 'd', content: '9' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Set up the proportion: 3/2 = 12/s. Cross-multiply: 3s = 24, so s = 8 cups of sugar.',
    points: 1,
    tags: ['ratios', 'proportions', 'sat-math'],
  },
  {
    id: 'sat1-m1-04',
    subject: 'SAT Math',
    topic: 'Percentages',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A store marks up a jacket by 40% to set the retail price. During a sale, the jacket is discounted 25% from the retail price. By what percent does the final sale price exceed the original cost?',
    options: [
      { id: 'a', content: '5%' },
      { id: 'b', content: '10%' },
      { id: 'c', content: '15%' },
      { id: 'd', content: '20%' },
    ],
    correctAnswerId: 'a',
    explanation:
      'Let the original cost = $100. After 40% markup: retail = $140. After 25% discount: sale price = 140 × 0.75 = $105. The sale price is $5 more than the $100 cost, so it exceeds by 5%.',
    points: 2,
    tags: ['percentages', 'markup-discount', 'sat-math'],
  },
  {
    id: 'sat1-m1-05',
    subject: 'SAT Math',
    topic: 'Statistics — Mean',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'The average (mean) of five numbers is 18. If four of the numbers are 12, 15, 22, and 20, what is the fifth number?',
    options: [
      { id: 'a', content: '19' },
      { id: 'b', content: '21' },
      { id: 'c', content: '23' },
      { id: 'd', content: '25' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Total sum = 5 × 18 = 90. Sum of four known numbers = 12 + 15 + 22 + 20 = 69. Fifth number = 90 − 69 = 21.',
    points: 1,
    tags: ['statistics', 'mean', 'sat-math'],
  },
  {
    id: 'sat1-m1-06',
    subject: 'SAT Math',
    topic: 'Functions',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'The function f is defined by f(x) = 2x² − 3x + 1. What is the value of f(−2)?',
    options: [
      { id: 'a', content: '3' },
      { id: 'b', content: '9' },
      { id: 'c', content: '15' },
      { id: 'd', content: '18' },
    ],
    correctAnswerId: 'c',
    explanation:
      'f(−2) = 2(−2)² − 3(−2) + 1 = 2(4) + 6 + 1 = 8 + 6 + 1 = 15.',
    points: 1,
    tags: ['functions', 'evaluation', 'sat-math'],
  },
  {
    id: 'sat1-m1-07',
    subject: 'SAT Math',
    topic: 'Geometry — Area',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A rectangle has a length that is 3 more than twice its width. If the perimeter of the rectangle is 48, what is its area?',
    options: [
      { id: 'a', content: '108' },
      { id: 'b', content: '115' },
      { id: 'c', content: '119' },
      { id: 'd', content: '126' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Let width = w; length = 2w + 3. Perimeter: 2(w + 2w + 3) = 48 → 2(3w + 3) = 48 → 6w + 6 = 48 → 6w = 42 → w = 7. Length = 2(7) + 3 = 17. Area = 7 × 17 = 119.',
    points: 2,
    tags: ['geometry', 'area', 'perimeter', 'sat-math'],
  },
  {
    id: 'sat1-m1-08',
    subject: 'SAT Math',
    topic: 'Exponents and Roots',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question: 'What is the value of (27)^(2/3)?',
    options: [
      { id: 'a', content: '3' },
      { id: 'b', content: '6' },
      { id: 'c', content: '9' },
      { id: 'd', content: '18' },
    ],
    correctAnswerId: 'c',
    explanation:
      '(27)^(2/3) = (27^(1/3))² = (∛27)² = 3² = 9. The fractional exponent m/n means "take the nth root, then raise to the mth power."',
    points: 2,
    tags: ['exponents', 'fractional-exponents', 'sat-math'],
  },
  {
    id: 'sat1-m1-09',
    subject: 'SAT Math',
    topic: 'Linear Inequalities',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Which value of x satisfies the inequality 3(x − 4) > 2x + 1?',
    options: [
      { id: 'a', content: 'x = 10' },
      { id: 'b', content: 'x = 12' },
      { id: 'c', content: 'x = 13' },
      { id: 'd', content: 'x = 14' },
    ],
    correctAnswerId: 'd',
    explanation:
      '3(x − 4) > 2x + 1 → 3x − 12 > 2x + 1 → x > 13. Among the options, only x = 14 satisfies the strict inequality x > 13.',
    points: 1,
    tags: ['inequalities', 'algebra', 'sat-math'],
  },
  {
    id: 'sat1-m1-10',
    subject: 'SAT Math',
    topic: 'Rate Problems',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'A train travels from City A to City B at 60 mph. It returns along the same route at 40 mph. What is the average speed for the entire round trip?',
    options: [
      { id: 'a', content: '46 mph' },
      { id: 'b', content: '48 mph' },
      { id: 'c', content: '50 mph' },
      { id: 'd', content: '52 mph' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Average speed = Total distance / Total time. Let d = one-way distance. Total distance = 2d. Time A→B = d/60; Time B→A = d/40. Total time = d/60 + d/40 = 2d/120 + 3d/120 = 5d/120 = d/24. Average speed = 2d ÷ (d/24) = 2d × (24/d) = 48 mph. Note: average speed ≠ arithmetic mean of speeds.',
    points: 2,
    tags: ['rate', 'average-speed', 'word-problem', 'sat-math'],
  },
];

// ── Math — Module 2 (10 q / 20 min, calculator allowed) ────────────────────
const mathModule2: DemoQuestion[] = [
  {
    id: 'sat1-m2-01',
    subject: 'SAT Math',
    topic: 'Quadratic Equations',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'The equation x² − 5x − 14 = 0 has two solutions. What is the product of the two solutions?',
    options: [
      { id: 'a', content: '−14' },
      { id: 'b', content: '5' },
      { id: 'c', content: '14' },
      { id: 'd', content: '−5' },
    ],
    correctAnswerId: 'a',
    explanation:
      "By Vieta's formulas, for x² + bx + c = 0, the product of roots = c/a = −14/1 = −14. Alternatively: factor as (x − 7)(x + 2) = 0 → roots 7 and −2, product = 7 × (−2) = −14.",
    points: 1,
    tags: ['quadratics', 'vieta', 'sat-math'],
  },
  {
    id: 'sat1-m2-02',
    subject: 'SAT Math',
    topic: 'Exponential Functions',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A population of bacteria doubles every 3 hours. If there are initially 500 bacteria, how many will there be after 12 hours?',
    options: [
      { id: 'a', content: '4,000' },
      { id: 'b', content: '6,000' },
      { id: 'c', content: '8,000' },
      { id: 'd', content: '10,000' },
    ],
    correctAnswerId: 'c',
    explanation:
      'After 12 hours, there have been 12/3 = 4 doubling periods. Population = 500 × 2⁴ = 500 × 16 = 8,000.',
    points: 2,
    tags: ['exponential-growth', 'functions', 'sat-math'],
  },
  {
    id: 'sat1-m2-03',
    subject: 'SAT Math',
    topic: 'Probability',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A bag contains 5 red, 3 blue, and 2 green marbles. If one marble is drawn at random, what is the probability that it is NOT red?',
    options: [
      { id: 'a', content: '1/2' },
      { id: 'b', content: '3/10' },
      { id: 'c', content: '2/5' },
      { id: 'd', content: '5/10' },
    ],
    correctAnswerId: 'a',
    explanation:
      'Total marbles = 5 + 3 + 2 = 10. Non-red = 3 + 2 = 5. P(not red) = 5/10 = 1/2.',
    points: 1,
    tags: ['probability', 'complementary-events', 'sat-math'],
  },
  {
    id: 'sat1-m2-04',
    subject: 'SAT Math',
    topic: 'Circles',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'A circle has equation (x − 3)² + (y + 2)² = 25. What is the area of the circle?',
    options: [
      { id: 'a', content: '5π' },
      { id: 'b', content: '10π' },
      { id: 'c', content: '25π' },
      { id: 'd', content: '50π' },
    ],
    correctAnswerId: 'c',
    explanation:
      'The standard form (x − h)² + (y − k)² = r² shows center (3, −2) and r² = 25, so r = 5. Area = πr² = 25π.',
    points: 2,
    tags: ['circles', 'geometry', 'standard-form', 'sat-math'],
  },
  {
    id: 'sat1-m2-05',
    subject: 'SAT Math',
    topic: 'Trigonometry',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'In a right triangle, the leg adjacent to angle θ has length 7 and the hypotenuse has length 25. What is sin(θ)?',
    options: [
      { id: 'a', content: '7/25' },
      { id: 'b', content: '24/25' },
      { id: 'c', content: '7/24' },
      { id: 'd', content: '25/24' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Using the Pythagorean theorem: opposite = √(25² − 7²) = √(625 − 49) = √576 = 24. sin(θ) = opposite/hypotenuse = 24/25.',
    points: 2,
    tags: ['trigonometry', 'right-triangles', 'sat-math'],
  },
  {
    id: 'sat1-m2-06',
    subject: 'SAT Math',
    topic: 'Data Analysis — Scatterplot',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A scatterplot shows the relationship between hours studied per week (x) and test score (y) for a class of students. The line of best fit has equation y = 4.5x + 52. According to the model, what score would be predicted for a student who studies 8 hours per week?',
    options: [
      { id: 'a', content: '82' },
      { id: 'b', content: '86' },
      { id: 'c', content: '88' },
      { id: 'd', content: '92' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Substitute x = 8: y = 4.5(8) + 52 = 36 + 52 = 88.',
    points: 1,
    tags: ['data-analysis', 'scatterplot', 'linear-model', 'sat-math'],
  },
  {
    id: 'sat1-m2-07',
    subject: 'SAT Math',
    topic: 'Polynomials',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'If (x − 1) is a factor of f(x) = x³ + kx² + 2x − 8, what is the value of k?',
    options: [
      { id: 'a', content: '3' },
      { id: 'b', content: '4' },
      { id: 'c', content: '5' },
      { id: 'd', content: '6' },
    ],
    correctAnswerId: 'c',
    explanation:
      'By the factor theorem, if (x − 1) is a factor then f(1) = 0: 1³ + k(1²) + 2(1) − 8 = 0 → 1 + k + 2 − 8 = 0 → k − 5 = 0 → k = 5.',
    points: 2,
    tags: ['polynomials', 'factor-theorem', 'sat-math'],
  },
  {
    id: 'sat1-m2-08',
    subject: 'SAT Math',
    topic: 'Absolute Value',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'How many integer values of x satisfy |2x − 3| < 7?',
    options: [
      { id: 'a', content: '5' },
      { id: 'b', content: '6' },
      { id: 'c', content: '7' },
      { id: 'd', content: '8' },
    ],
    correctAnswerId: 'b',
    explanation:
      '|2x − 3| < 7 means −7 < 2x − 3 < 7. Adding 3: −4 < 2x < 10. Dividing by 2: −2 < x < 5. The integers strictly between −2 and 5 are: −1, 0, 1, 2, 3, 4 — that is 6 values.',
    points: 2,
    tags: ['absolute-value', 'inequalities', 'sat-math'],
  },
  {
    id: 'sat1-m2-09',
    subject: 'SAT Math',
    topic: 'Linear and Exponential Models',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'An investment account starts with $2,000 and grows at a rate of 6% per year compounded annually. Which equation gives the value V of the account after t years?',
    options: [
      { id: 'a', content: 'V = 2000 + 0.06t' },
      { id: 'b', content: 'V = 2000(1.06)ᵗ' },
      { id: 'c', content: 'V = 2000(0.06)ᵗ' },
      { id: 'd', content: 'V = 2000 × 1.06t' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Compound interest formula: V = P(1 + r)ᵗ where P = 2000 and r = 0.06. So V = 2000(1.06)ᵗ. Option A is linear (simple interest). Option C uses the rate as the base rather than (1 + rate). Option D multiplies linearly rather than exponentially.',
    points: 2,
    tags: ['exponential-models', 'compound-interest', 'sat-math'],
  },
  {
    id: 'sat1-m2-10',
    subject: 'SAT Math',
    topic: 'Systems with Quadratics',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'At how many points do the graphs of y = x² − 4 and y = 2x − 1 intersect?',
    options: [
      { id: 'a', content: '0' },
      { id: 'b', content: '1' },
      { id: 'c', content: '2' },
      { id: 'd', content: '3' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Set equal: x² − 4 = 2x − 1 → x² − 2x − 3 = 0 → (x − 3)(x + 1) = 0 → x = 3 or x = −1. The discriminant b² − 4ac = 4 + 12 = 16 > 0, confirming two distinct real intersections.',
    points: 2,
    tags: ['systems', 'quadratics', 'intersection', 'sat-math'],
  },
];

// ── Exported sections ────────────────────────────────────────────────────────
export const SAT_MOCK_TEST_1_SECTIONS: ExamSection[] = [
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
