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
  {
    id: 'sat1-rw1-11',
    subject: 'SAT Reading & Writing',
    topic: 'Central Ideas and Details',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'Marine biologists studying the Great Barrier Reef have found that coral polyps, when stressed by rising ocean temperatures, expel the symbiotic algae living in their tissues. Without these algae, which provide both color and nutrients, the coral turns white and becomes vulnerable to disease. Prolonged bleaching events, researchers note, can cause reef ecosystems to collapse entirely, threatening the thousands of species that depend on them.\n\nWhich choice best states the main idea of the text?',
    options: [
      { id: 'a', content: 'Coral polyps are colorful organisms that live in symbiotic relationships with algae.' },
      { id: 'b', content: 'Ocean temperature increases cause coral to expel algae, a process that can ultimately devastate entire reef ecosystems.' },
      { id: 'c', content: 'The Great Barrier Reef is home to thousands of species that rely on coral for survival.' },
      { id: 'd', content: 'Marine biologists have developed new methods for studying coral bleaching events.' },
    ],
    correctAnswerId: 'b',
    explanation:
      "Choice B captures the text's full causal chain: rising temperatures cause coral to expel algae, which in turn can lead to ecosystem collapse — this is the point the entire passage builds toward. Choice A is only a supporting detail about the coral-algae relationship, not the main point. Choice C mentions a detail from the final sentence but omits the central cause-and-effect relationship. Choice D is not discussed anywhere in the text.",
    points: 1,
    tags: ['information-and-ideas', 'central-ideas-and-details', 'science-passage', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-12',
    subject: 'SAT Reading & Writing',
    topic: 'Inference',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'In her letters from 1834, composer Fanny Hensel repeatedly downplayed her own musical output, referring to her symphonies as mere "exercises" unworthy of public performance. Yet her private diaries from the same period reveal meticulous, multi-year revisions to these same works, revisions of a thoroughness she reserved only for pieces she considered significant.\n\nBased on the text, what can most reasonably be inferred about Hensel\'s private view of her own symphonies?',
    options: [
      { id: 'a', content: 'She believed the symphonies were unworthy of the extensive time she spent revising them.' },
      { id: 'b', content: 'She privately regarded the symphonies as important, despite publicly calling them mere exercises.' },
      { id: 'c', content: 'She revised the symphonies only because critics demanded improvements.' },
      { id: 'd', content: 'She considered her letters a more accurate record of her artistic values than her diaries.' },
    ],
    correctAnswerId: 'b',
    explanation:
      "Choice B is correct because the text contrasts Hensel's public dismissal of the symphonies with her private, thorough revisions — a level of care reserved for works she considered significant, implying she privately valued them highly. Choice A contradicts the passage's logic. Choice C introduces critics, never mentioned in the text. Choice D reverses the passage's implication.",
    points: 1,
    tags: ['information-and-ideas', 'inference', 'biography', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-13',
    subject: 'SAT Reading & Writing',
    topic: 'Command of Evidence — Quantitative',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      "A researcher claims that commute length has little effect on job satisfaction. She surveyed employees at four companies and recorded average commute time and self-reported job satisfaction on a 10-point scale:\n\nCompany A: 15 minutes, satisfaction 7.8\nCompany B: 32 minutes, satisfaction 7.5\nCompany C: 48 minutes, satisfaction 7.9\nCompany D: 61 minutes, satisfaction 7.6\n\nWhich choice best supports the researcher's claim?",
    options: [
      { id: 'a', content: 'Company A, with the shortest commute, had the highest satisfaction score of the four companies.' },
      { id: 'b', content: 'Satisfaction scores across all four companies remained within a narrow range despite commute times varying by nearly 46 minutes.' },
      { id: 'c', content: 'Company D employees had longer commutes than Company B employees but similar satisfaction scores.' },
      { id: 'd', content: 'Company C employees reported the highest satisfaction despite having the second-longest commute.' },
    ],
    correctAnswerId: 'b',
    explanation:
      "Choice B addresses the full dataset: even though commute times range from 15 to 61 minutes, satisfaction stays clustered between 7.5 and 7.9, directly supporting the claim. Choice A is factually inaccurate (Company C's score is higher). Choices C and D cite only a partial two-company comparison rather than the overall trend.",
    points: 2,
    tags: ['information-and-ideas', 'command-of-evidence', 'quantitative-evidence', 'social-science', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-14',
    subject: 'SAT Reading & Writing',
    topic: 'Words in Context',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'During the interview, the retired diplomat was surprisingly candid about the negotiations, offering blunt assessments of colleagues she had once publicly praised.\n\nAs used in the text, "candid" most nearly means',
    options: [
      { id: 'a', content: 'hesitant' },
      { id: 'b', content: 'honest' },
      { id: 'c', content: 'formal' },
      { id: 'd', content: 'forgetful' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The text describes the diplomat offering "blunt assessments" of people she had previously praised, consistent with being frank rather than guarded. Choice A is the opposite of the behavior described. Choice C doesn\'t fit, since blunt personal assessments are informal. Choice D is unsupported.',
    points: 1,
    tags: ['craft-and-structure', 'words-in-context', 'vocabulary', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-15',
    subject: 'SAT Reading & Writing',
    topic: 'Words in Context',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      "The mayor's promise to review the budget did little to assuage residents' fears that the new tax would strain household finances.\n\nAs used in the text, \"assuage\" most nearly means",
    options: [
      { id: 'a', content: 'confirm' },
      { id: 'b', content: 'ease' },
      { id: 'c', content: 'explain' },
      { id: 'd', content: 'postpone' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The sentence states the promise did "little to assuage" the fears, implying an attempt to calm those fears that largely failed. Choice A reverses the meaning. Choice C is unsupported, since the text concerns emotional effect, not clarification. Choice D misreads the sentence as being about delay.',
    points: 1,
    tags: ['craft-and-structure', 'words-in-context', 'vocabulary', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-16',
    subject: 'SAT Reading & Writing',
    topic: 'Text Structure and Purpose',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Herbal remedies have long been dismissed by mainstream medicine as ineffective folklore. In the 1990s, however, researchers isolated artemisinin, a compound derived from a plant used in traditional Chinese medicine for over a thousand years, and found it remarkably effective against malaria. This discovery, which eventually earned a Nobel Prize, forced many scientists to reconsider assumptions about traditional remedies.\n\nWhich choice best describes the function of the second sentence in the text as a whole?',
    options: [
      { id: 'a', content: 'It presents a specific historical example that challenges a view introduced in the first sentence.' },
      { id: 'b', content: 'It summarizes the overall argument the text will go on to refute.' },
      { id: 'c', content: 'It introduces a counterargument to the claim made in the final sentence.' },
      { id: 'd', content: 'It offers a broad generalization that the rest of the text will illustrate with examples.' },
    ],
    correctAnswerId: 'a',
    explanation:
      "Choice A is correct because the first sentence states that mainstream medicine dismissed herbal remedies, and the second provides a concrete case that pushes back against that dismissal. Choice B is wrong because the text builds on, rather than refutes, the second sentence. Choice C reverses the logical order. Choice D mischaracterizes the sentence as a generalization rather than a specific example.",
    points: 1,
    tags: ['craft-and-structure', 'text-structure-and-purpose', 'science-passage', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-17',
    subject: 'SAT Reading & Writing',
    topic: 'Text Structure and Purpose',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Many critics initially derided Impressionist painters for their loose, seemingly unfinished brushwork. Claude Monet and his peers, however, were not attempting photographic precision. Their goal, rather, was to capture the fleeting, subjective experience of light and atmosphere at a single moment.\n\nIn the text, what is the main function of the final sentence?',
    options: [
      { id: 'a', content: 'It provides evidence that critics were correct to criticize Impressionist technique.' },
      { id: 'b', content: 'It explains the artistic intention behind a technique that was previously criticized.' },
      { id: 'c', content: 'It contradicts the claim made in the sentence before it.' },
      { id: 'd', content: 'It introduces a new argument unrelated to Impressionist painting.' },
    ],
    correctAnswerId: 'b',
    explanation:
      "Choice B is correct because the final sentence clarifies the purpose behind the loose brushwork — capturing fleeting light and atmosphere — reframing what critics saw as a flaw as a deliberate choice. Choice A is incorrect because the sentence undermines the critics' judgment. Choice C is wrong because the sentence builds on and agrees with the sentence before it. Choice D is incorrect since the sentence stays focused on Impressionist technique.",
    points: 2,
    tags: ['craft-and-structure', 'text-structure-and-purpose', 'arts-passage', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-18',
    subject: 'SAT Reading & Writing',
    topic: 'Cross-Text Connections',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'Text 1: Historian A argues that the decline of small family farms in the twentieth century was driven primarily by government policy, which favored large-scale agribusiness through subsidies and tax incentives that small farmers could rarely access.\n\nText 2: Historian B contends that technological change, not policy, was the decisive factor: mechanization and chemical fertilizers dramatically increased the efficiency of large farms, making it nearly impossible for small farms to compete on price regardless of subsidies.\n\nBased on the texts, how would Historian B most likely respond to Historian A\'s claim?',
    options: [
      { id: 'a', content: 'By agreeing that subsidies were the primary cause but arguing they were necessary for progress.' },
      { id: 'b', content: 'By arguing that even without favorable government policy, technological advances alone would have driven small farms out of the market.' },
      { id: 'c', content: 'By dismissing the idea that small farms declined at all during this period.' },
      { id: 'd', content: 'By claiming that Historian A overstates the role of mechanization in agricultural change.' },
    ],
    correctAnswerId: 'b',
    explanation:
      "Choice B is correct because Historian B's claim that mechanization made small farms uncompetitive \"regardless of subsidies\" implies technology alone would have caused the decline even without policy favoritism, directly countering Historian A. Choice A has Historian B agreeing with Historian A's cause, contradicting Text 2. Choice C is unsupported. Choice D misattributes a claim to Historian A, who never mentions mechanization.",
    points: 2,
    tags: ['craft-and-structure', 'cross-text-connections', 'history-passage', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-19',
    subject: 'SAT Reading & Writing',
    topic: 'Rhetorical Synthesis',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'A student has gathered the following information: \n• The city of Curitiba, Brazil, introduced a bus rapid transit (BRT) system in 1974.\n• The BRT system uses dedicated lanes to avoid car traffic.\n• Other cities, including Bogotá and Los Angeles, later adopted similar BRT systems.\n• Curitiba\'s system is often cited as the first large-scale BRT network in the world.\n\nThe student wants to emphasize Curitiba\'s historical significance as a model for other cities\' transit systems. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    options: [
      { id: 'a', content: 'Curitiba introduced a bus rapid transit system in 1974 that used dedicated lanes to avoid traffic congestion.' },
      { id: 'b', content: 'Bogotá and Los Angeles are two cities that later adopted bus rapid transit systems.' },
      { id: 'c', content: "Widely regarded as the first large-scale bus rapid transit network, Curitiba's 1974 system became a model that cities like Bogotá and Los Angeles later followed." },
      { id: 'd', content: 'Bus rapid transit systems use dedicated lanes to help buses avoid car traffic.' },
    ],
    correctAnswerId: 'c',
    explanation:
      "Choice C combines Curitiba's status as the first large-scale BRT system with the fact that other cities later followed its example, directly establishing its significance as a model. Choice A omits any reference to influence. Choice B omits Curitiba entirely. Choice D is a general definition with no specific reference to Curitiba.",
    points: 1,
    tags: ['expression-of-ideas', 'rhetorical-synthesis', 'urban-planning', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-20',
    subject: 'SAT Reading & Writing',
    topic: 'Rhetorical Synthesis',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A student has gathered the following information: \n• Chemist Marie Maynard Daly was the first African American woman to earn a PhD in chemistry, in 1947.\n• Daly\'s research focused on how diet affects cholesterol and heart disease.\n• Her findings helped establish the link between high cholesterol and clogged arteries.\n• Daly also studied the effects of cigarette smoke on lung tissue.\n\nThe student wants to highlight the connection between Daly\'s personal achievement and the impact of her research. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    options: [
      { id: 'a', content: 'Daly studied both cholesterol\'s effect on arteries and the effects of cigarette smoke on lungs.' },
      { id: 'b', content: 'Marie Maynard Daly, the first African American woman to earn a PhD in chemistry, went on to conduct research that helped establish the link between high cholesterol and clogged arteries.' },
      { id: 'c', content: "Cigarette smoke's effects on lung tissue were one focus of Daly's broader research career." },
      { id: 'd', content: 'In 1947, a milestone was reached when an African American woman earned a PhD in chemistry for the first time.' },
    ],
    correctAnswerId: 'b',
    explanation:
      "Choice B links Daly's personal achievement to a specific, impactful research finding, fulfilling both parts of the goal. Choice A discusses only her research topics. Choice C also omits the achievement. Choice D describes the achievement alone without connecting it to any research impact.",
    points: 1,
    tags: ['expression-of-ideas', 'rhetorical-synthesis', 'biography', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-21',
    subject: 'SAT Reading & Writing',
    topic: 'Rhetorical Synthesis',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      "A student has gathered the following information: \n• The Mariana Trench is the deepest known point in Earth's oceans.\n• Its deepest point, the Challenger Deep, reaches approximately 10,935 meters below sea level.\n• Pressure at that depth is over 1,000 times greater than at sea level.\n• Only a handful of manned expeditions have reached the Challenger Deep.\n\nThe student wants to illustrate just how extreme conditions are at the bottom of the Challenger Deep using a specific figure. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
    options: [
      { id: 'a', content: "The Mariana Trench is the deepest known point in Earth's oceans." },
      { id: 'b', content: 'Very few manned expeditions have ever reached the bottom of the Challenger Deep.' },
      { id: 'c', content: 'At the Challenger Deep, pressure exceeds 1,000 times what it is at sea level.' },
      { id: 'd', content: 'The Challenger Deep is located within the Mariana Trench.' },
    ],
    correctAnswerId: 'c',
    explanation:
      "Choice C uses the specific numerical figure that most vividly conveys the extremity of conditions, directly fulfilling the goal. Choice A is a general ranking fact with no specific figure. Choice B describes exploration frequency, not physical conditions. Choice D states a geographic relationship with no figure at all.",
    points: 1,
    tags: ['expression-of-ideas', 'rhetorical-synthesis', 'science-passage', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-22',
    subject: 'SAT Reading & Writing',
    topic: 'Transitions',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'Urban beekeeping has grown increasingly popular in recent years, with hobbyists installing hives on rooftops across many major cities. ____, some city governments have raised concerns about the practice, citing worries over public safety and allergic reactions.\n\nWhich choice completes the text with the most logical transition?',
    options: [
      { id: 'a', content: 'For example,' },
      { id: 'b', content: 'However,' },
      { id: 'c', content: 'Similarly,' },
      { id: 'd', content: 'As a result,' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Choice B is correct because the second sentence presents a contrast: while beekeeping has grown popular, some governments are concerned about it. Choice A is wrong because the second sentence is not an example of the first. Choice C incorrectly suggests the sentences are comparable. Choice D incorrectly implies causation.',
    points: 1,
    tags: ['expression-of-ideas', 'transitions', 'social-science', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-23',
    subject: 'SAT Reading & Writing',
    topic: 'Transitions',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'The ancient Library of Alexandria is believed to have housed hundreds of thousands of scrolls, drawing scholars from across the Mediterranean world. ____, historians still debate exactly how and when the library was destroyed, with theories ranging from accidental fire to deliberate conquest.\n\nWhich choice completes the text with the most logical transition?',
    options: [
      { id: 'a', content: 'Nevertheless,' },
      { id: 'b', content: 'Consequently,' },
      { id: 'c', content: 'For instance,' },
      { id: 'd', content: 'In addition,' },
    ],
    correctAnswerId: 'a',
    explanation:
      'Choice A is correct because the text moves from describing the library\'s renown to noting that its ultimate fate is still uncertain — a contrast. Choice B incorrectly implies causation. Choice C is wrong because the second sentence is not an example. Choice D incorrectly frames the sentence as merely adding a similar point.',
    points: 1,
    tags: ['expression-of-ideas', 'transitions', 'history-passage', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-24',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Comma Splices and Run-ons',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'The orchestra rehearsed for six hours straight ___ the conductor refused to let anyone leave early.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    options: [
      { id: 'a', content: 'straight, the conductor refused' },
      { id: 'b', content: 'straight; the conductor refused' },
      { id: 'c', content: 'straight the conductor refused' },
      { id: 'd', content: 'straight, but the conductor refusing' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Choice B is correct because the sentence contains two independent clauses, and a semicolon correctly joins them without a coordinating conjunction. Choice A creates a comma splice. Choice C creates a run-on with no punctuation. Choice D is grammatically broken because "refusing" is not a finite verb.',
    points: 2,
    tags: ['standard-english-conventions', 'comma-splices', 'run-ons', 'grammar', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-25',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Subject-Verb Agreement',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      "A collection of rare manuscripts, some dating back to the twelfth century, ___ housed in the university's climate-controlled archive.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?",
    options: [
      { id: 'a', content: 'is' },
      { id: 'b', content: 'are' },
      { id: 'c', content: 'were' },
      { id: 'd', content: 'has been' },
    ],
    correctAnswerId: 'a',
    explanation:
      'Choice A is correct because the grammatical subject is the singular noun "collection," not the plural "manuscripts" inside the modifying phrase, requiring the singular verb "is." Choice B incorrectly agrees with "manuscripts." Choice C is plural and in the wrong tense. Choice D introduces an unsupported tense shift.',
    points: 1,
    tags: ['standard-english-conventions', 'subject-verb-agreement', 'grammar', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-26',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Pronoun Agreement and Clarity',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'When the biologist handed the lab notebook to her research assistant, she immediately noticed a critical error in the data.\n\nWhich choice best revises the text to eliminate the ambiguous pronoun reference?',
    options: [
      { id: 'a', content: 'When the biologist handed the lab notebook to her research assistant, she immediately noticed a critical error in the data.' },
      { id: 'b', content: 'When the biologist handed the lab notebook to her research assistant, the assistant immediately noticed a critical error in the data.' },
      { id: 'c', content: 'When the biologist handed the lab notebook to her research assistant, they immediately noticed a critical error in the data.' },
      { id: 'd', content: 'When the biologist handed the lab notebook to her research assistant, it immediately noticed a critical error in the data.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Choice B is correct because replacing "she" with "the assistant" removes the ambiguity between the biologist and the assistant. Choice A retains the ambiguous pronoun. Choice C replaces it with "they," which is mismatched with the singular antecedents. Choice D uses "it," inappropriate for a person.',
    points: 2,
    tags: ['standard-english-conventions', 'pronoun-agreement', 'pronoun-clarity', 'grammar', 'sat-rw'],
  },
  {
    id: 'sat1-rw1-27',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Verb Tense Consistency',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'Every morning before dawn, the fishermen rowed out past the breakwater, cast their nets into the current, and ___ before the market opens.\n\nWhich choice completes the text so that the verb tenses are consistent?',
    options: [
      { id: 'a', content: 'returns' },
      { id: 'b', content: 'return' },
      { id: 'c', content: 'returned' },
      { id: 'd', content: 'will return' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Choice C is correct because the sentence establishes a past-tense narrative with "rowed" and "cast," so the final verb must match. Choice A shifts to present tense and fails to agree with the plural subject. Choice B breaks the past-tense sequence. Choice D shifts into future tense, inconsistent with the rest of the sentence.',
    points: 2,
    tags: ['standard-english-conventions', 'verb-tense-consistency', 'grammar', 'sat-rw'],
  },
];

// ── Reading & Writing — Module 2 (27 q / 32 min) ───────────────────────────
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
  {
    id: 'sat1-rw2-11',
    subject: 'SAT Reading & Writing',
    topic: 'Information and Ideas — Central Ideas and Details (History)',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'In the mid-fifteenth century, the introduction of movable-type printing in Europe dramatically reduced the cost of producing books. Where a single hand-copied manuscript might once have taken a scribe months to complete, a printing press could produce hundreds of identical copies in the same span of time. As book prices fell, literacy—once the province of clergy and nobility—began to spread among merchants, tradespeople, and eventually the broader public.\n\nWhich choice best states the main idea of the text?',
    options: [
      { id: 'a', content: 'Movable-type printing was invented in the mid-fifteenth century by European scribes.' },
      { id: 'b', content: 'By making books cheaper and faster to produce, the printing press helped literacy extend beyond the elite classes.' },
      { id: 'c', content: 'Hand-copied manuscripts were more accurate than printed books because scribes worked carefully.' },
      { id: 'd', content: 'Merchants and tradespeople were the primary readers of books before the printing press was invented.' },
    ],
    correctAnswerId: 'b',
    explanation:
      "Choice B captures the passage's central claim: cheaper, faster book production caused literacy to spread beyond clergy and nobility. Choice A misstates a supporting detail and wrongly credits scribes with inventing the press. Choice C is not discussed. Choice D reverses the timeline the text describes.",
    points: 1,
    tags: ['central-ideas', 'history', 'reading-comprehension', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-12',
    subject: 'SAT Reading & Writing',
    topic: 'Information and Ideas — Inference (Social Science)',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Researchers studying decision fatigue observed that shoppers who compared many similar products before choosing one reported feeling less satisfied with their final purchase than shoppers who considered only a few options. The former group also took, on average, twice as long to decide. Notably, both groups spent roughly the same amount of money.\n\nWhich choice is the most logical inference based on the text?',
    options: [
      { id: 'a', content: "Spending more money on a product tends to increase a shopper's satisfaction with that product." },
      { id: 'b', content: 'Shoppers who consider fewer options may end up just as financially committed as those who consider many, despite feeling more satisfied.' },
      { id: 'c', content: 'Shoppers who take longer to decide always end up regretting their purchases.' },
      { id: 'd', content: 'Comparing many products is the most effective way to find the best possible item.' },
    ],
    correctAnswerId: 'b',
    explanation:
      "Choice B logically connects the two facts given: spending was equal across groups, yet satisfaction differed based on how many options were considered. Choice A is unsupported. Choice C overstates the finding with 'always.' Choice D contradicts the passage's implication that more comparison correlated with lower satisfaction.",
    points: 1,
    tags: ['inference', 'social-science', 'psychology', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-13',
    subject: 'SAT Reading & Writing',
    topic: 'Information and Ideas — Command of Evidence, Textual (Biology)',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'Marine biologist Elena Ruiz argues that bioluminescence in deep-sea anglerfish serves primarily a predatory function rather than a defensive one.\n\nWhich finding, if true, would provide the strongest support for Ruiz\'s claim?',
    options: [
      { id: 'a', content: 'Anglerfish that lost their light-producing organ still successfully evaded predators using camouflage.' },
      { id: 'b', content: "The light organ is located on a modified fin that dangles directly in front of the fish's mouth, and researchers observed the light attracting small fish moments before the anglerfish struck." },
      { id: 'c', content: 'Anglerfish are more commonly found in the deepest, darkest parts of the ocean than in shallower waters.' },
      { id: 'd', content: 'Many other deep-sea creatures also emit light for the purpose of communicating with potential mates.' },
    ],
    correctAnswerId: 'b',
    explanation:
      "Choice B directly links the light organ's position and behavior to prey capture, exactly what a predatory-function claim requires. Choice A concerns evasion via camouflage, unrelated to the light organ. Choice C only describes habitat. Choice D describes an unrelated purpose in other species.",
    points: 2,
    tags: ['command-of-evidence', 'biology', 'science', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-14',
    subject: 'SAT Reading & Writing',
    topic: 'Information and Ideas — Command of Evidence, Quantitative (Urban Studies)',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      "A city transportation department tracked average commute times before and after installing a new light-rail line:\n\nYear | Avg. Commute (min)\n2018 | 42\n2019 | 41\n2020 (rail opens) | 38\n2021 | 33\n2022 | 31\n\nA transit advocate claims that the new light-rail line caused a steady, ongoing decline in commute times.\n\nWhich choice best supports the advocate's claim?",
    options: [
      { id: 'a', content: 'Commute times were already falling slightly before the light-rail line opened in 2020.' },
      { id: 'b', content: "Commute times fell only slightly between 2018 and 2019, but declined more sharply and continuously in each year following the rail line's 2020 opening." },
      { id: 'c', content: "The city's population grew every year between 2018 and 2022." },
      { id: 'd', content: 'Commute times were higher in 2018 than in any other year shown in the table.' },
    ],
    correctAnswerId: 'b',
    explanation:
      "Choice B highlights the contrast between the modest pre-rail decline and the sharper, continuous decline after 2020, the pattern needed to support a causal claim. Choice A actually undercuts the claim. Choice C is irrelevant. Choice D is a true but general observation that doesn't establish a continuous, rail-caused decline.",
    points: 2,
    tags: ['command-of-evidence', 'data-analysis', 'quantitative', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-15',
    subject: 'SAT Reading & Writing',
    topic: 'Craft and Structure — Words in Context (Arts)',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      "The museum's new curator was known for being meticulous, spending hours adjusting the lighting on each painting until the colors appeared exactly as the artist had intended.\n\nAs used in the text, 'meticulous' most nearly means",
    options: [
      { id: 'a', content: 'careless' },
      { id: 'b', content: 'extremely careful and precise' },
      { id: 'c', content: 'impatient' },
      { id: 'd', content: 'inexperienced' },
    ],
    correctAnswerId: 'b',
    explanation:
      "The description of spending hours adjusting lighting 'until the colors appeared exactly' right signals extreme care and precision. Choice A is the opposite. Choices C and D are unsupported, since the lengthy, careful process suggests the opposite of impatience or inexperience.",
    points: 1,
    tags: ['words-in-context', 'vocabulary', 'arts', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-16',
    subject: 'SAT Reading & Writing',
    topic: 'Craft and Structure — Words in Context (Architecture)',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      "Unlike the ornate cathedrals of the period, the chapel's austere interior contained no gold leaf, no elaborate carvings, and no stained glass—only bare stone walls and a single wooden cross.\n\nAs used in the text, 'austere' most nearly means",
    options: [
      { id: 'a', content: 'severely simple and unadorned' },
      { id: 'b', content: 'brightly colorful' },
      { id: 'c', content: 'recently constructed' },
      { id: 'd', content: 'spiritually significant' },
    ],
    correctAnswerId: 'a',
    explanation:
      "The list of absent decorative elements paired with 'only bare stone walls' supports 'severely simple and unadorned.' Choice B directly contradicts the described lack of color. Choice C is not addressed. Choice D may be true of chapels generally, but isn't what 'austere' describes here.",
    points: 1,
    tags: ['words-in-context', 'vocabulary', 'arts', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-17',
    subject: 'SAT Reading & Writing',
    topic: 'Craft and Structure — Text Structure and Purpose (Geology)',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      "For decades, geologists assumed that the canyon had formed gradually over millions of years, carved slowly by the river's steady flow. Recent dating of rock layers, however, revealed that much of the canyon's depth appeared within a geologically brief window of only a few thousand years. This discovery has forced researchers to reconsider what conditions might cause erosion to accelerate so dramatically.\n\nWhich choice best describes the function of the second sentence in the text?",
    options: [
      { id: 'a', content: "It introduces a new theory that directly contradicts the passage's opening claim, prompting further inquiry." },
      { id: 'b', content: 'It summarizes the overall argument that the text goes on to make.' },
      { id: 'c', content: 'It provides an example that supports the traditional view mentioned in the first sentence.' },
      { id: 'd', content: "It offers a minor detail unrelated to the discussion of the canyon's formation." },
    ],
    correctAnswerId: 'a',
    explanation:
      "The second sentence, signaled by 'however,' presents new evidence contradicting the traditional assumption, and the third sentence confirms researchers reconsidered their views. Choice B is incorrect since the sentence presents contradictory evidence, not a summary. Choice C is wrong because the sentence undermines the traditional view. Choice D is incorrect since the sentence is central to the passage's point.",
    points: 1,
    tags: ['text-structure', 'science', 'geology', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-18',
    subject: 'SAT Reading & Writing',
    topic: 'Craft and Structure — Text Structure and Purpose (Biography)',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'The young violinist practiced for six hours each day, often skipping meals and social gatherings to perfect a single passage. Her teacher worried that such intensity would lead to burnout. Yet at her debut recital, the depth of feeling in her performance suggested that the hours of isolation had given her something rare: an intimate understanding of the music itself.\n\nWhich choice best describes the function of the last sentence in the text?',
    options: [
      { id: 'a', content: "It reinforces the teacher's concern that the violinist's practice habits were unsustainable." },
      { id: 'b', content: "It reframes the violinist's intense practice as having produced a meaningful artistic benefit, complicating the teacher's earlier worry." },
      { id: 'c', content: 'It contradicts the claim that the violinist practiced for long hours each day.' },
      { id: 'd', content: "It introduces a new concern about the violinist's health that had not been mentioned before." },
    ],
    correctAnswerId: 'b',
    explanation:
      "The word 'Yet' signals a shift: despite the teacher's worry, the isolated practice produced a valuable artistic outcome. Choice A is the opposite of what happens. Choice C is incorrect since the sentence does not dispute the amount of practice. Choice D is unsupported.",
    points: 1,
    tags: ['text-structure', 'literature', 'biography', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-19',
    subject: 'SAT Reading & Writing',
    topic: 'Craft and Structure — Cross-Text Connections (Economics)',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'Text 1: Economist Mara Voss contends that the shift to remote work has increased overall productivity, citing surveys in which employees report fewer interruptions and more focused work time when working from home.\n\nText 2: Economist Daniel Frey argues that apparent productivity gains from remote work are illusory, noting that many companies have seen a rise in hours logged without a corresponding rise in completed projects, suggesting employees are simply working longer, not smarter.\n\nBased on the texts, how would Frey most likely respond to Voss\'s claim?',
    options: [
      { id: 'a', content: 'By agreeing that fewer interruptions naturally lead to higher-quality work.' },
      { id: 'b', content: 'By suggesting that self-reported focus does not necessarily translate into greater output, since increased hours without proportional results indicate reduced efficiency rather than gains.' },
      { id: 'c', content: 'By arguing that remote work should be banned entirely because it harms company culture.' },
      { id: 'd', content: "By pointing out that Voss's survey data was collected from an insufficient number of employees." },
    ],
    correctAnswerId: 'b',
    explanation:
      "Frey's evidence — longer hours without proportionally more completed work — directly challenges Voss's claim by reframing self-reported focus as an unreliable measure of output. Choice A contradicts Frey's skeptical position. Choice C proposes an extreme stance neither text supports. Choice D introduces a critique never mentioned in either text.",
    points: 2,
    tags: ['cross-text-connections', 'economics', 'social-science', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-20',
    subject: 'SAT Reading & Writing',
    topic: 'Expression of Ideas — Rhetorical Synthesis (Sleep Science)',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A student has gathered the following information about napping and memory:\n• A 2021 study found that participants who took a 30-minute nap after learning a list of words recalled 10% more words than participants who stayed awake.\n• Nap length under 20 minutes showed no significant effect on recall in the same study.\n• Researchers hypothesize that a specific stage of sleep, present only in naps of at least 30 minutes, helps consolidate new memories.\n• The study did not test naps longer than 60 minutes.\n\nThe student wants to explain why nap duration matters for memory consolidation. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    options: [
      { id: 'a', content: 'A 2021 study found that people who napped recalled more words than people who did not nap at all.' },
      { id: 'b', content: 'Naps of at least 30 minutes appear to aid memory consolidation because they allow entry into a sleep stage that shorter naps do not reach, while naps beyond 60 minutes remain untested.' },
      { id: 'c', content: 'Researchers are still studying many aspects of sleep and its relationship to human memory.' },
      { id: 'd', content: 'Participants in the study were asked to memorize a list of words before napping or staying awake.' },
    ],
    correctAnswerId: 'b',
    explanation:
      "Choice B synthesizes the duration threshold, the proposed mechanism, and the study's limitation — directly explaining why duration matters. Choice A only reports an outcome comparison. Choice C is too vague. Choice D describes a procedural detail that doesn't address duration.",
    points: 1,
    tags: ['rhetorical-synthesis', 'science', 'sleep-research', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-21',
    subject: 'SAT Reading & Writing',
    topic: 'Expression of Ideas — Rhetorical Synthesis (World History)',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A student has gathered the following information about the Silk Road:\n• The Silk Road was a network of trade routes connecting China to the Mediterranean world, active from roughly 200 BCE to 1400 CE.\n• Merchants carried not only silk and spices but also religious texts, artistic styles, and musical instruments along these routes.\n• Buddhism spread from India into China partly through monks traveling alongside merchant caravans.\n• Chinese papermaking techniques reached the Islamic world and eventually Europe via the same routes.\n\nThe student wants to emphasize that the Silk Road\'s significance extended beyond commerce alone. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    options: [
      { id: 'a', content: 'The Silk Road was a network of trade routes that operated for over a thousand years, connecting China to the Mediterranean world.' },
      { id: 'b', content: 'Merchants along the Silk Road carried silk, spices, and other valuable goods across long distances.' },
      { id: 'c', content: "Beyond enabling the exchange of goods, the Silk Road facilitated the spread of religious traditions like Buddhism and technologies like papermaking across vast regions." },
      { id: 'd', content: 'The Silk Road connected China to the Mediterranean world for trade purposes from roughly 200 BCE to 1400 CE.' },
    ],
    correctAnswerId: 'c',
    explanation:
      "Choice C explicitly frames the spread of Buddhism and papermaking as evidence the Silk Road's importance went beyond trade. Choice A states duration and geography without addressing cultural exchange. Choice B emphasizes goods exclusively — the opposite of the goal. Choice D restates dates and trade purpose without any non-commercial significance.",
    points: 2,
    tags: ['rhetorical-synthesis', 'history', 'world-history', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-22',
    subject: 'SAT Reading & Writing',
    topic: 'Expression of Ideas — Transitions (Literature)',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'The play received harsh reviews from critics when it premiered in 1962. ______, audiences kept filling theater seats for the following three years, making it one of the most commercially successful productions of the decade.\n\nWhich choice completes the text with the most logical transition?',
    options: [
      { id: 'a', content: 'Consequently' },
      { id: 'b', content: 'Nevertheless' },
      { id: 'c', content: 'For example' },
      { id: 'd', content: 'In other words' },
    ],
    correctAnswerId: 'b',
    explanation:
      "'Nevertheless' correctly signals the contrast between harsh reviews and continued commercial success. 'Consequently' would illogically suggest harsh reviews caused the success. 'For example' is wrong since the second sentence isn't an instance of the first. 'In other words' is wrong because the second sentence doesn't restate the first.",
    points: 1,
    tags: ['transitions', 'grammar', 'literature', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-23',
    subject: 'SAT Reading & Writing',
    topic: 'Expression of Ideas — Transitions (Marine Science)',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'The coral reef ecosystem depends on a delicate balance of temperature and light. Rising ocean temperatures, ______, have caused many coral species to expel the algae they rely on for nutrients, a process known as bleaching.\n\nWhich choice completes the text with the most logical transition?',
    options: [
      { id: 'a', content: 'for instance' },
      { id: 'b', content: 'in contrast' },
      { id: 'c', content: 'on the other hand' },
      { id: 'd', content: 'similarly' },
    ],
    correctAnswerId: 'a',
    explanation:
      "'For instance' correctly presents rising temperatures as a specific example of the disrupted balance mentioned first. 'In contrast' and 'on the other hand' both signal opposition, but the second sentence elaborates on, rather than opposes, the first. 'Similarly' would require a prior comparable example, which isn't present.",
    points: 1,
    tags: ['transitions', 'grammar', 'science', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-24',
    subject: 'SAT Reading & Writing',
    topic: 'Expression of Ideas — Transitions (Technology)',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Many early computer scientists believed that machines would never be able to translate natural language accurately, given its reliance on context and idiom. ______, modern translation software—trained on billions of real sentences—now produces translations that are often indistinguishable from human work.\n\nWhich choice completes the text with the most logical transition?',
    options: [
      { id: 'a', content: 'Similarly' },
      { id: 'b', content: 'However' },
      { id: 'c', content: 'Therefore' },
      { id: 'd', content: 'For example' },
    ],
    correctAnswerId: 'b',
    explanation:
      "'However' correctly signals the contrast between early skepticism and modern success. 'Similarly' incorrectly implies resemblance rather than opposition. 'Therefore' incorrectly implies causation. 'For example' is wrong because the second sentence contradicts, rather than illustrates, the first claim.",
    points: 1,
    tags: ['transitions', 'grammar', 'technology', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-25',
    subject: 'SAT Reading & Writing',
    topic: 'Standard English Conventions — Modifiers',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      '______, the recipe has been passed down through five generations of the Alvarez family.\n\nWhich choice completes the sentence so that it conforms to conventional standard English modifier placement?',
    options: [
      { id: 'a', content: 'Written by hand in a worn leather notebook,' },
      { id: 'b', content: 'Writing it by hand in a worn leather notebook,' },
      { id: 'c', content: 'Having written it by hand in a worn leather notebook,' },
      { id: 'd', content: 'To write it by hand in a worn leather notebook,' },
    ],
    correctAnswerId: 'a',
    explanation:
      "Choice A's passive modifier logically describes 'the recipe,' which was itself written by hand. Choices B and C use active constructions implying a person doing the writing, but the sentence's subject is the recipe itself, creating a dangling modifier. Choice D's infinitive similarly implies an unstated human agent.",
    points: 1,
    tags: ['modifiers', 'grammar', 'standard-english-conventions', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-26',
    subject: 'SAT Reading & Writing',
    topic: 'Standard English Conventions — Parallelism',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      "The city council's new proposal aims to reduce traffic congestion, ______, and improve air quality in the downtown corridor.\n\nWhich choice completes the sentence so that it conforms to conventional rules of standard English grammar, usage, and punctuation?",
    options: [
      { id: 'a', content: 'expanding public transit options' },
      { id: 'b', content: 'expand public transit options' },
      { id: 'c', content: 'the expansion of public transit options' },
      { id: 'd', content: 'to have expanded public transit options' },
    ],
    correctAnswerId: 'b',
    explanation:
      "The sentence establishes a parallel series of infinitives following 'aims to': 'reduce,' '___,' and 'improve.' Only choice B, 'expand,' matches this form. Choice A uses a gerund, breaking parallelism. Choice C substitutes a noun phrase. Choice D uses a perfect infinitive, both non-parallel and illogical in tense.",
    points: 2,
    tags: ['parallelism', 'grammar', 'standard-english-conventions', 'sat-rw'],
  },
  {
    id: 'sat1-rw2-27',
    subject: 'SAT Reading & Writing',
    topic: 'Standard English Conventions — Verb Tense Consistency',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'Every summer, migratory swallows return to the same barn, where they build intricate mud nests and ______ them from predators.\n\nWhich choice completes the sentence so that it conforms to conventional standard English verb tense usage?',
    options: [
      { id: 'a', content: 'protected' },
      { id: 'b', content: 'will protect' },
      { id: 'c', content: 'protect' },
      { id: 'd', content: 'had protected' },
    ],
    correctAnswerId: 'c',
    explanation:
      "Choice C, 'protect,' maintains the present tense established by 'return' and 'build,' correctly describing a habitual action. Choice A shifts inconsistently to past tense. Choice B shifts to future tense. Choice D uses the past perfect, illogical for an ongoing, present-tense routine.",
    points: 1,
    tags: ['verb-tense', 'grammar', 'standard-english-conventions', 'sat-rw'],
  },
];

// ── Math — Module 1 (22 q / 35 min, calculator allowed) ────────────────────
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
  {
    id: 'sat1-m1-11',
    subject: 'SAT Math',
    topic: 'Systems of Equations',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A movie theater sells adult tickets for $12 and child tickets for $8. One evening, the theater sold 150 tickets total and collected $1,560. How many adult tickets were sold?',
    options: [
      { id: 'a', content: '90' },
      { id: 'b', content: '60' },
      { id: 'c', content: '75' },
      { id: 'd', content: '105' },
    ],
    correctAnswerId: 'a',
    explanation:
      'Let a = adult tickets, c = child tickets. a + c = 150, so c = 150 − a. Substitute into 12a + 8c = 1560: 12a + 8(150 − a) = 1560 → 4a = 360 → a = 90.',
    points: 1,
    tags: ['systems-of-equations', 'word-problem', 'algebra', 'sat-math'],
  },
  {
    id: 'sat1-m1-12',
    subject: 'SAT Math',
    topic: 'Absolute Value Equations',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question: 'What is the sum of all solutions to the equation |2x - 5| = 9?',
    options: [
      { id: 'a', content: '7' },
      { id: 'b', content: '5' },
      { id: 'c', content: '-2' },
      { id: 'd', content: '14' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Case 1: 2x − 5 = 9 → x = 7. Case 2: 2x − 5 = −9 → x = −2. Sum = 7 + (−2) = 5.',
    points: 1,
    tags: ['absolute-value', 'equations', 'algebra', 'sat-math'],
  },
  {
    id: 'sat1-m1-13',
    subject: 'SAT Math',
    topic: 'Compound Inequalities',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question: 'For how many integer values of x is -3 < 2x + 1 ≤ 7 true?',
    options: [
      { id: 'a', content: '6' },
      { id: 'b', content: '7' },
      { id: 'c', content: '5' },
      { id: 'd', content: '4' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Subtract 1: −4 < 2x ≤ 6. Divide by 2: −2 < x ≤ 3. Integers strictly greater than −2 and up to 3: −1, 0, 1, 2, 3 — 5 integers.',
    points: 1,
    tags: ['compound-inequalities', 'algebra', 'sat-math'],
  },
  {
    id: 'sat1-m1-14',
    subject: 'SAT Math',
    topic: 'Literal Equations',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'The formula for the perimeter of a rectangle is P = 2l + 2w, where l is the length and w is the width. Which equation correctly solves for w in terms of P and l?',
    options: [
      { id: 'a', content: 'w = (P + 2l) / 2' },
      { id: 'b', content: 'w = P - 2l' },
      { id: 'c', content: 'w = 2(P - l)' },
      { id: 'd', content: 'w = (P - 2l) / 2' },
    ],
    correctAnswerId: 'd',
    explanation:
      'P = 2l + 2w → P − 2l = 2w → w = (P − 2l) / 2.',
    points: 1,
    tags: ['literal-equations', 'algebra', 'sat-math'],
  },
  {
    id: 'sat1-m1-15',
    subject: 'SAT Math',
    topic: 'Quadratic Equations',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question: 'What are the solutions to x² - 5x - 24 = 0?',
    options: [
      { id: 'a', content: 'x = 8 and x = -3' },
      { id: 'b', content: 'x = -8 and x = 3' },
      { id: 'c', content: 'x = 6 and x = -4' },
      { id: 'd', content: 'x = 4 and x = -6' },
    ],
    correctAnswerId: 'a',
    explanation:
      'Find two numbers that multiply to −24 and add to −5: −8 and 3. Factor: (x − 8)(x + 3) = 0 → x = 8 or x = −3.',
    points: 1,
    tags: ['quadratic-equations', 'factoring', 'advanced-math', 'sat-math'],
  },
  {
    id: 'sat1-m1-16',
    subject: 'SAT Math',
    topic: 'Polynomial Operations',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question: 'If (2x + 3)(x - 4) = ax² + bx + c for all x, what is the value of b?',
    options: [
      { id: 'a', content: '-12' },
      { id: 'b', content: '-5' },
      { id: 'c', content: '5' },
      { id: 'd', content: '-8' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Expand: 2x² − 8x + 3x − 12 = 2x² − 5x − 12. So a = 2, b = −5, c = −12.',
    points: 1,
    tags: ['polynomials', 'factoring', 'advanced-math', 'sat-math'],
  },
  {
    id: 'sat1-m1-17',
    subject: 'SAT Math',
    topic: 'Exponential Growth',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A colony of bacteria doubles in size every 3 hours. If the colony starts with 500 bacteria, how many bacteria will there be after 9 hours?',
    options: [
      { id: 'a', content: '4,500' },
      { id: 'b', content: '1,500' },
      { id: 'c', content: '4,000' },
      { id: 'd', content: '8,000' },
    ],
    correctAnswerId: 'c',
    explanation:
      '9 ÷ 3 = 3 doubling periods. Population = 500 × 2³ = 500 × 8 = 4,000.',
    points: 2,
    tags: ['exponential-growth', 'functions', 'advanced-math', 'sat-math'],
  },
  {
    id: 'sat1-m1-18',
    subject: 'SAT Math',
    topic: 'Function Composition',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question: 'If f(x) = x² - 3x + 2 and g(x) = x + 1, what is f(g(x))?',
    options: [
      { id: 'a', content: 'x² + x' },
      { id: 'b', content: 'x² - x + 4' },
      { id: 'c', content: 'x² - 5x + 3' },
      { id: 'd', content: 'x² - x' },
    ],
    correctAnswerId: 'd',
    explanation:
      'f(g(x)) = (x + 1)² − 3(x + 1) + 2 = x² + 2x + 1 − 3x − 3 + 2 = x² − x.',
    points: 2,
    tags: ['function-composition', 'advanced-math', 'sat-math'],
  },
  {
    id: 'sat1-m1-19',
    subject: 'SAT Math',
    topic: 'Nonlinear Systems of Equations',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question: 'What is the sum of the y-coordinates of all solutions to the system y = x² - 2x - 3 and y = 2x - 3?',
    options: [
      { id: 'a', content: '2' },
      { id: 'b', content: '4' },
      { id: 'c', content: '8' },
      { id: 'd', content: '-3' },
    ],
    correctAnswerId: 'a',
    explanation:
      'x² − 2x − 3 = 2x − 3 → x² − 4x = 0 → x = 0 or 4. At x = 0, y = −3; at x = 4, y = 5. Sum = −3 + 5 = 2.',
    points: 2,
    tags: ['nonlinear-systems', 'quadratics', 'advanced-math', 'sat-math'],
  },
  {
    id: 'sat1-m1-20',
    subject: 'SAT Math',
    topic: 'Circles',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question: 'A circle has a circumference of 18π. What is the area of the circle?',
    options: [
      { id: 'a', content: '18π' },
      { id: 'b', content: '81π' },
      { id: 'c', content: '9π' },
      { id: 'd', content: '162π' },
    ],
    correctAnswerId: 'b',
    explanation:
      '18π = 2πr → r = 9. Area = πr² = 81π.',
    points: 1,
    tags: ['circles', 'circumference', 'geometry', 'sat-math'],
  },
  {
    id: 'sat1-m1-21',
    subject: 'SAT Math',
    topic: 'Volume of Solids',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'A cylindrical water tank has a radius of 4 feet and a height of 10 feet. A second cylindrical tank has the same height but twice the radius. How many times greater is the volume of the second tank than the volume of the first?',
    options: [
      { id: 'a', content: '2' },
      { id: 'b', content: '8' },
      { id: 'c', content: '4' },
      { id: 'd', content: '16' },
    ],
    correctAnswerId: 'c',
    explanation:
      'V₁ = π(4)²(10) = 160π. V₂ = π(8)²(10) = 640π. Ratio = 640π/160π = 4.',
    points: 2,
    tags: ['volume', 'cylinders', 'geometry', 'sat-math'],
  },
  {
    id: 'sat1-m1-22',
    subject: 'SAT Math',
    topic: 'Right Triangle Trigonometry',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'In right triangle ABC, angle C is the right angle, angle A measures 30°, and the hypotenuse AB has length 12. What is the length of side BC, the side opposite angle A?',
    options: [
      { id: 'a', content: '6√3' },
      { id: 'b', content: '12' },
      { id: 'c', content: '4' },
      { id: 'd', content: '6' },
    ],
    correctAnswerId: 'd',
    explanation:
      'BC = AB · sin(30°) = 12 × (1/2) = 6, matching the 30-60-90 rule that the side opposite the 30° angle is half the hypotenuse.',
    points: 2,
    tags: ['right-triangles', 'trigonometry', 'geometry', 'sat-math'],
  },
];

// ── Math — Module 2 (22 q / 35 min, calculator allowed) ────────────────────
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
  {
    id: 'sat1-m2-11',
    subject: 'SAT Math',
    topic: 'Linear Equations',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'A taxi service charges a flat fee of $4.00 plus $2.00 per mile traveled. If a particular ride cost a total of $20.00, how many miles was the ride?',
    options: [
      { id: 'a', content: '8' },
      { id: 'b', content: '10' },
      { id: 'c', content: '6' },
      { id: 'd', content: '12' },
    ],
    correctAnswerId: 'a',
    explanation:
      '4 + 2m = 20 → 2m = 16 → m = 8 miles.',
    points: 1,
    tags: ['linear-equations', 'word-problem', 'sat-math'],
  },
  {
    id: 'sat1-m2-12',
    subject: 'SAT Math',
    topic: 'Systems of Linear Equations',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'At a bakery, 3 muffins and 2 croissants cost $10.50 in total, while 5 muffins and 1 croissant cost $14.00 in total. What is the price of one muffin, in dollars?',
    options: [
      { id: 'a', content: '$1.50' },
      { id: 'b', content: '$2.50' },
      { id: 'c', content: '$2.00' },
      { id: 'd', content: '$3.00' },
    ],
    correctAnswerId: 'b',
    explanation:
      'From 5m + c = 14: c = 14 − 5m. Substitute into 3m + 2c = 10.50: 3m + 2(14 − 5m) = 10.50 → −7m = −17.5 → m = 2.50.',
    points: 1,
    tags: ['systems-of-equations', 'linear-equations', 'sat-math'],
  },
  {
    id: 'sat1-m2-13',
    subject: 'SAT Math',
    topic: 'Absolute Value Equations',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question: 'What is the sum of all values of x that satisfy the equation |2x - 5| = 11?',
    options: [
      { id: 'a', content: '-3' },
      { id: 'b', content: '8' },
      { id: 'c', content: '5' },
      { id: 'd', content: '16' },
    ],
    correctAnswerId: 'c',
    explanation:
      '2x − 5 = 11 → x = 8. 2x − 5 = −11 → x = −3. Sum = 8 + (−3) = 5.',
    points: 1,
    tags: ['absolute-value', 'equations', 'sat-math'],
  },
  {
    id: 'sat1-m2-14',
    subject: 'SAT Math',
    topic: 'Literal Equations',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'The perimeter of a rectangle is given by the formula P = 2l + 2w, where l is the length and w is the width. Which of the following correctly expresses w in terms of P and l?',
    options: [
      { id: 'a', content: 'w = (P - l)/2' },
      { id: 'b', content: 'w = 2P - l' },
      { id: 'c', content: 'w = P - 2l' },
      { id: 'd', content: 'w = (P - 2l)/2' },
    ],
    correctAnswerId: 'd',
    explanation:
      'P = 2l + 2w → P − 2l = 2w → w = (P − 2l)/2.',
    points: 1,
    tags: ['literal-equations', 'algebra', 'sat-math'],
  },
  {
    id: 'sat1-m2-15',
    subject: 'SAT Math',
    topic: 'Linear Functions',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      "A phone plan charges a fixed monthly base rate plus a fee for each gigabyte of data used beyond the plan's limit. In a month when Maria used 12 GB over her limit, her total bill was $58. In a month when she used 20 GB over her limit, her total bill was $82. Assuming the relationship is linear, what is the overage fee per gigabyte, in dollars?",
    options: [
      { id: 'a', content: '$3.00' },
      { id: 'b', content: '$2.00' },
      { id: 'c', content: '$6.00' },
      { id: 'd', content: '$22.00' },
    ],
    correctAnswerId: 'a',
    explanation:
      'b + 12f = 58 and b + 20f = 82. Subtracting: 8f = 24 → f = 3.',
    points: 1,
    tags: ['linear-equations', 'word-problem', 'rates', 'sat-math'],
  },
  {
    id: 'sat1-m2-16',
    subject: 'SAT Math',
    topic: 'Linear Inequalities',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'A student earns a fixed weekly stipend of $40 from a scholarship plus $15 per hour tutoring. She wants her total weekly earnings to be at least $190, but school policy prevents her from tutoring more than 15 hours per week. What is the minimum whole number of hours she must tutor to reach her earnings goal?',
    options: [
      { id: 'a', content: '9' },
      { id: 'b', content: '10' },
      { id: 'c', content: '12' },
      { id: 'd', content: '13' },
    ],
    correctAnswerId: 'b',
    explanation:
      '40 + 15h ≥ 190 → 15h ≥ 150 → h ≥ 10. Minimum whole number of hours is 10.',
    points: 2,
    tags: ['inequalities', 'word-problem', 'sat-math'],
  },
  {
    id: 'sat1-m2-17',
    subject: 'SAT Math',
    topic: 'Quadratic Functions',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question: 'The function f(x) = 2x² - 8x + 3 can be written in the form f(x) = a(x - h)² + k. What is the value of k?',
    options: [
      { id: 'a', content: '-8' },
      { id: 'b', content: '-1' },
      { id: 'c', content: '-5' },
      { id: 'd', content: '-11' },
    ],
    correctAnswerId: 'c',
    explanation:
      'f(x) = 2(x² − 4x) + 3 = 2[(x − 2)² − 4] + 3 = 2(x − 2)² − 5. So k = −5.',
    points: 2,
    tags: ['quadratics', 'completing-the-square', 'sat-math'],
  },
  {
    id: 'sat1-m2-18',
    subject: 'SAT Math',
    topic: 'Rational Expressions',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question: 'For x ≠ -3 and x ≠ 4, the expression (x² - 9)/(x² - x - 12) is equivalent to which of the following?',
    options: [
      { id: 'a', content: '(x + 3)/(x - 4)' },
      { id: 'b', content: '(x - 3)/(x + 4)' },
      { id: 'c', content: '(x + 3)/(x + 4)' },
      { id: 'd', content: '(x - 3)/(x - 4)' },
    ],
    correctAnswerId: 'd',
    explanation:
      'x² − 9 = (x − 3)(x + 3). x² − x − 12 = (x − 4)(x + 3). Cancel (x + 3): (x − 3)/(x − 4).',
    points: 2,
    tags: ['rational-expressions', 'factoring', 'sat-math'],
  },
  {
    id: 'sat1-m2-19',
    subject: 'SAT Math',
    topic: 'Statistics',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'The number of overtime hours worked by 7 employees last week were 2, 3, 3, 5, 6, 8, and 9. Suppose the value 9 is replaced by 16 and the other six values stay the same. Which statement must be true about the new data set compared to the original?',
    options: [
      { id: 'a', content: 'The mean increases and the median stays the same' },
      { id: 'b', content: 'The mean stays the same and the median increases' },
      { id: 'c', content: 'Both the mean and the median increase' },
      { id: 'd', content: 'Both the mean and the median stay the same' },
    ],
    correctAnswerId: 'a',
    explanation:
      'Sorted, the median (4th of 7 values) stays 5 either way, since 16 is still the largest value. The mean rises from 36/7 to 43/7.',
    points: 1,
    tags: ['statistics', 'mean-median', 'sat-math'],
  },
  {
    id: 'sat1-m2-20',
    subject: 'SAT Math',
    topic: 'Rates and Ratios',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question: 'A machine fills boxes at a constant rate of 3 boxes every 4 minutes. At this rate, how many boxes can the machine fill in 2 hours?',
    options: [
      { id: 'a', content: '45' },
      { id: 'b', content: '90' },
      { id: 'c', content: '96' },
      { id: 'd', content: '120' },
    ],
    correctAnswerId: 'b',
    explanation:
      '2 hours = 120 minutes = 30 four-minute intervals. 30 × 3 = 90 boxes.',
    points: 1,
    tags: ['ratios-and-rates', 'unit-conversion', 'sat-math'],
  },
  {
    id: 'sat1-m2-21',
    subject: 'SAT Math',
    topic: 'Volume',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'A cylindrical water tank has a radius of 3 feet and a height of 10 feet. A second cylindrical tank has the same height but a radius twice as large. The volume of the second tank is how many times the volume of the first tank?',
    options: [
      { id: 'a', content: '2' },
      { id: 'b', content: '8' },
      { id: 'c', content: '4' },
      { id: 'd', content: '6' },
    ],
    correctAnswerId: 'c',
    explanation:
      'V = πr²h; since height is unchanged and radius doubles, volume scales by (2r)²/r² = 4.',
    points: 2,
    tags: ['volume', '3d-geometry', 'sat-math'],
  },
  {
    id: 'sat1-m2-22',
    subject: 'SAT Math',
    topic: 'Coordinate Geometry',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'In the coordinate plane, point A is located at (-2, 5) and point B is located at (6, -1). Point M is the midpoint of segment AB. What is the distance from point M to the origin?',
    options: [
      { id: 'a', content: '4' },
      { id: 'b', content: '10' },
      { id: 'c', content: '4√2' },
      { id: 'd', content: '2√2' },
    ],
    correctAnswerId: 'd',
    explanation:
      'M = ((−2+6)/2, (5−1)/2) = (2, 2). Distance to origin = √(2² + 2²) = √8 = 2√2.',
    points: 2,
    tags: ['coordinate-geometry', 'midpoint-distance', 'sat-math'],
  },
];

// ── Exported sections ────────────────────────────────────────────────────────
export const SAT_MOCK_TEST_1_SECTIONS: ExamSection[] = [
  {
    name: 'Reading & Writing — Module 1',
    shortName: 'RW-1',
    questions: rwModule1,
    timeLimit: 1920,
    hasCalculator: false,
  },
  {
    name: 'Reading & Writing — Module 2',
    shortName: 'RW-2',
    questions: rwModule2,
    timeLimit: 1920,
    hasCalculator: false,
  },
  {
    name: 'Math — Module 1',
    shortName: 'M-1',
    questions: mathModule1,
    timeLimit: 2100,
    hasCalculator: true,
  },
  {
    name: 'Math — Module 2',
    shortName: 'M-2',
    questions: mathModule2,
    timeLimit: 2100,
    hasCalculator: true,
  },
];
