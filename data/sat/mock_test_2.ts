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
  {
    id: 'sat2-rw1-11',
    subject: 'SAT Reading & Writing',
    topic: 'Central Ideas and Details',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'From an article on urban planning:\n\n"Urban planners have increasingly incorporated \'green roofs\'—rooftops covered with vegetation—into building codes in major cities. Beyond their aesthetic appeal, green roofs absorb stormwater runoff, reduce a building\'s cooling costs by providing insulation, and mitigate the urban heat island effect by replacing heat-absorbing surfaces with cooling plant life. Cities that have mandated green roofs on new construction report measurable decreases in average summer rooftop temperatures."\n\nWhich choice best states the central idea of the text?',
    options: [
      { id: 'a', content: 'Green roofs are primarily valued for making buildings more visually appealing.' },
      { id: 'b', content: 'Green roofs offer multiple practical benefits, including reduced runoff, energy savings, and urban cooling, that go beyond appearance.' },
      { id: 'c', content: 'All major cities have now mandated green roofs on new buildings.' },
      { id: 'd', content: 'Green roofs are more expensive to install than traditional roofing.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The passage explicitly states the benefits go "beyond their aesthetic appeal" to include runoff absorption, reduced cooling costs, and heat island mitigation. Choice A contradicts the text. Choice C overstates the claim ("increasingly," not "all"). Choice D is never mentioned.',
    points: 1,
    tags: ['central-ideas', 'urban-planning-passage', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-12',
    subject: 'SAT Reading & Writing',
    topic: 'Inference',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'From a short story:\n\n"When the letter finally arrived, Elena set it unopened on the kitchen table for three days. Each morning she moved it half an inch to the left, as if giving it room to breathe, before leaving for work without a glance in its direction."\n\nWhich choice best describes what can reasonably be inferred about Elena?',
    options: [
      { id: 'a', content: 'Elena has forgotten that she received the letter.' },
      { id: 'b', content: 'Elena is anxious about the letter\'s contents and is delaying confronting them.' },
      { id: 'c', content: 'Elena plans to mail the letter back unopened.' },
      { id: 'd', content: 'Elena did not know who had sent the letter.' },
    ],
    correctAnswerId: 'b',
    explanation:
      "Elena's deliberate daily ritual — repositioning the letter while avoiding looking at it — suggests heightened, anxious awareness rather than forgetfulness. Choice A is contradicted by her daily attention. Choices C and D are unsupported.",
    points: 1,
    tags: ['inference', 'literature-passage', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-13',
    subject: 'SAT Reading & Writing',
    topic: 'Command of Evidence — Quantitative',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'A workplace study measured average daily commute time and self-reported job satisfaction (on a 100-point scale) across four company branches:\n• Branch 1: 15 min commute, satisfaction 82\n• Branch 2: 30 min commute, satisfaction 79\n• Branch 3: 45 min commute, satisfaction 61\n• Branch 4: 60 min commute, satisfaction 58\n\nA researcher claims: "Job satisfaction declines steadily and substantially as commute time increases, at every increment."\n\nWhich choice best describes how the data support or undermine this claim?',
    options: [
      { id: 'a', content: 'The data fully support the claim, since every branch with a longer commute has lower satisfaction than every branch with a shorter one.' },
      { id: 'b', content: 'The data partially support the claim: satisfaction does trend downward overall, but the drop from Branch 1 to Branch 2 is far smaller than the drop from Branch 2 to Branch 3, so the decline is not steady at every increment.' },
      { id: 'c', content: 'The data contradict the claim entirely, because satisfaction increases between Branch 3 and Branch 4.' },
      { id: 'd', content: 'The data are irrelevant to the claim, because commute time and satisfaction were measured on different scales.' },
    ],
    correctAnswerId: 'b',
    explanation:
      "Satisfaction falls as commute rises (82→79→61→58), but the drops vary sharply (3 points, then 18 points), contradicting a claim of steady decline at every increment even though the overall direction is downward. Choice A ignores the uneven magnitude. Choice C is factually wrong — satisfaction keeps falling, not rising. Choice D wrongly assumes different units prevent comparison.",
    points: 2,
    tags: ['command-of-evidence', 'quantitative-data', 'data-analysis', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-14',
    subject: 'SAT Reading & Writing',
    topic: 'Words in Context',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'From an article on archival methods:\n\n"The archivist\'s meticulous cataloging system, which cross-referenced every document by date, author, and subject, allowed researchers to locate obscure records within minutes rather than days."\n\nAs used in the text, "meticulous" most nearly means:',
    options: [
      { id: 'a', content: 'careless and disorganized' },
      { id: 'b', content: 'extremely careful and precise' },
      { id: 'c', content: 'fast and impulsive' },
      { id: 'd', content: 'outdated and inefficient' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The system cross-references documents by three criteria and enables rapid, precise retrieval — evidence of extreme care. This is the opposite of A, and unrelated to C or D.',
    points: 1,
    tags: ['vocabulary', 'words-in-context', 'history-passage', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-15',
    subject: 'SAT Reading & Writing',
    topic: 'Words in Context',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'From a news article on environmental policy:\n\n"Despite years of public pressure, the company\'s leadership remained obdurate, refusing to adjust its manufacturing process even after independent studies linked the process to significant water contamination."\n\nAs used in the text, "obdurate" most nearly means:',
    options: [
      { id: 'a', content: 'stubbornly resistant to persuasion' },
      { id: 'b', content: 'easily convinced by new evidence' },
      { id: 'c', content: 'uncertain and hesitant' },
      { id: 'd', content: 'generous and accommodating' },
    ],
    correctAnswerId: 'a',
    explanation:
      'The leadership refusing to change course even after contrary evidence demonstrates unyielding stubbornness. Choice B is the direct opposite; C and D contradict the flat refusal described.',
    points: 1,
    tags: ['vocabulary', 'words-in-context', 'science-passage', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-16',
    subject: 'SAT Reading & Writing',
    topic: 'Text Structure and Purpose',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'From a science article:\n\n"Coral reefs are often called the \'rainforests of the sea\' because of their extraordinary biodiversity. A single reef system can host thousands of species of fish, mollusks, and crustaceans, many of which exist nowhere else on Earth. Yet this abundance masks a fragility: even a two-degree Celsius rise in ocean temperature can trigger mass coral bleaching, collapsing the ecosystem that depends on the coral\'s living tissue."\n\nWhich choice best describes the function of the final sentence in the text?',
    options: [
      { id: 'a', content: 'It refutes the claim made in the first sentence about coral reef biodiversity.' },
      { id: 'b', content: "It introduces a contrasting point, showing that the reefs' impressive diversity coexists with extreme vulnerability." },
      { id: 'c', content: 'It provides a specific example of a species found only in coral reefs.' },
      { id: 'd', content: 'It restates the main idea of the passage without adding new information.' },
    ],
    correctAnswerId: 'b',
    explanation:
      '"Yet" signals a turn from celebrating biodiversity to exposing fragility — new information that contrasts with, rather than refutes, the earlier claim. Choice A mischaracterizes it as contradiction. Choice C is inaccurate — no species is named. Choice D is wrong since new content is added.',
    points: 1,
    tags: ['text-structure', 'science-passage', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-17',
    subject: 'SAT Reading & Writing',
    topic: 'Text Structure and Purpose',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'From an essay on art history:\n\n"Many people assume the Impressionist painters were dismissed by critics simply because their brushwork looked unfinished. In truth, the more radical offense was thematic: Impressionists painted contemporary, often unglamorous, urban and rural life—train stations, laundresses, weekend picnickers—subjects that academic painting had long considered beneath serious art."\n\nWhich choice best describes the function of the first sentence in relation to the rest of the text?',
    options: [
      { id: 'a', content: 'It presents a common misconception that the rest of the passage goes on to correct.' },
      { id: 'b', content: "It summarizes the passage's main argument before providing supporting evidence." },
      { id: 'c', content: 'It introduces an example that will be analyzed in detail later in the passage.' },
      { id: 'd', content: 'It states a fact that the rest of the passage merely elaborates without adding new information.' },
    ],
    correctAnswerId: 'a',
    explanation:
      '"Many people assume" flags a popular but incomplete explanation, and "In truth" signals a correction (thematic offense rather than brushwork). Choice B is wrong since the first sentence states the misconception being rejected. Choice C mischaracterizes the sentence. Choice D is wrong because the second sentence contradicts, not merely elaborates on, the first.',
    points: 2,
    tags: ['text-structure', 'arts-passage', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-18',
    subject: 'SAT Reading & Writing',
    topic: 'Cross-Text Connections',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'Text 1 (Economist A): "Universal basic income would reduce poverty most effectively by giving unconditional cash directly to individuals, allowing recipients to allocate funds according to their own most pressing needs, without the overhead and paternalism of means-tested programs."\n\nText 2 (Economist B): "Targeted welfare programs, though administratively costly, ensure that limited public funds reach those with the most acute needs—the disabled, the chronically ill, and children in poverty—rather than being distributed evenly to people across the income spectrum, many of whom do not need assistance."\n\nBased on the texts, how would Economist B most likely respond to Economist A\'s claim that means-tested programs involve unnecessary "paternalism"?',
    options: [
      { id: 'a', content: 'By agreeing that paternalism is a serious problem that outweighs the benefits of targeting.' },
      { id: 'b', content: 'By arguing that directing funds toward the neediest recipients justifies the added administrative oversight, even if this requires more scrutiny than a universal payment.' },
      { id: 'c', content: 'By conceding that universal basic income is a more efficient use of public funds.' },
      { id: 'd', content: 'By claiming that paternalism is not a real consideration in economic policy.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Economist B acknowledges targeted programs are "administratively costly" yet defends them because they reach the neediest — implying the oversight is a worthwhile trade-off. Choice A contradicts B\'s defense. Choice C directly contradicts B\'s argument. Choice D is unsupported.',
    points: 2,
    tags: ['cross-text-connections', 'economics-passage', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-19',
    subject: 'SAT Reading & Writing',
    topic: 'Rhetorical Synthesis',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'A student has gathered the following information:\n• The Wright brothers\' first powered flight occurred on December 17, 1903, near Kitty Hawk, North Carolina.\n• The flight lasted only 12 seconds and covered about 120 feet.\n• Orville Wright piloted the aircraft while Wilbur ran alongside.\n• The brothers had spent over four years testing gliders before attempting powered flight.\n\nThe student wants to emphasize how brief the historic flight was compared to the years of preparation behind it. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    options: [
      { id: 'a', content: 'On December 17, 1903, the Wright brothers achieved the first powered flight near Kitty Hawk, North Carolina.' },
      { id: 'b', content: 'Orville Wright piloted the aircraft during the historic flight, while his brother Wilbur ran alongside.' },
      { id: 'c', content: 'Although the Wright brothers spent over four years testing gliders, their first powered flight lasted just 12 seconds.' },
      { id: 'd', content: 'The Wright brothers tested gliders for years before their famous flight near Kitty Hawk.' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Choice C directly juxtaposes the four years of testing with the 12-second flight, accomplishing the goal. Choice A gives date/location with no comparison. Choice B describes piloting roles. Choice D omits any comparison to the flight duration.',
    points: 1,
    tags: ['rhetorical-synthesis', 'history-passage', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-20',
    subject: 'SAT Reading & Writing',
    topic: 'Rhetorical Synthesis',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A student has gathered the following information:\n• Octopuses have three hearts and blue, copper-based blood.\n• Octopuses can change both the color and texture of their skin within a fraction of a second.\n• Their skin contains specialized cells called chromatophores that expand and contract to alter pigmentation.\n• Octopuses lack a rigid skeleton, letting them squeeze through gaps barely wider than their eye.\n\nThe student wants to explain the biological mechanism behind octopuses\' rapid color-changing ability. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    options: [
      { id: 'a', content: 'Octopuses are remarkable creatures with three hearts and blood that is blue rather than red.' },
      { id: 'b', content: 'Because they lack a rigid skeleton, octopuses can squeeze through impressively narrow gaps.' },
      { id: 'c', content: 'Octopuses can change color within a fraction of a second because specialized skin cells called chromatophores rapidly expand and contract to alter pigmentation.' },
      { id: 'd', content: 'Octopuses are known for their ability to change both the color and texture of their skin almost instantly.' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Choice C names the cause (chromatophores) for the effect (color change) — the "mechanism" the goal requires. Choice A discusses hearts/blood, unrelated. Choice B explains squeezing through gaps, not color change. Choice D restates the ability without explaining the mechanism.',
    points: 2,
    tags: ['rhetorical-synthesis', 'science-passage', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-21',
    subject: 'SAT Reading & Writing',
    topic: 'Rhetorical Synthesis',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'A student has gathered the following information:\n• The city library\'s summer reading program enrolled 1,200 children in its first year.\n• Enrollment grew to 3,400 children by the fifth year of the program.\n• A 2019 survey found that participating children read on average 6 more books over the summer than non-participants.\n• The program\'s budget increased from $40,000 to $95,000 over the same five years.\n\nThe student wants to highlight the relationship between the program\'s growth in enrollment and its increased funding. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    options: [
      { id: 'a', content: 'A 2019 survey found that children in the program read an average of six more books over the summer than those who did not participate.' },
      { id: 'b', content: "The summer reading program's enrollment grew from 1,200 to 3,400 children over five years, a period during which its budget rose from $40,000 to $95,000." },
      { id: 'c', content: 'The city library\'s summer reading program has been running for over five years and continues to serve thousands of children each summer.' },
      { id: 'd', content: 'By its fifth year, the program had grown to serve 3,400 children, more than double the original enrollment of 1,200.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Only choice B pairs both figures — enrollment and budget growth — within the same timeframe, showing the relationship. Choice A discusses reading outcomes, unrelated to funding. Choice C is vague with no figures. Choice D covers enrollment alone, omitting the budget.',
    points: 2,
    tags: ['rhetorical-synthesis', 'social-science-passage', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-22',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Transitions',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      '"The new vaccine reduced hospitalization rates by 60 percent in clinical trials. _____, it triggered no serious adverse effects in any participant."\n\nWhich transition best connects these sentences?',
    options: [
      { id: 'a', content: 'However' },
      { id: 'b', content: 'Moreover' },
      { id: 'c', content: 'Otherwise' },
      { id: 'd', content: 'In contrast' },
    ],
    correctAnswerId: 'b',
    explanation:
      '"Moreover" adds a second, complementary point (reduced hospitalizations AND no adverse effects). "However" (A) and "In contrast" (D) both signal contradiction, which doesn\'t fit two aligned positive findings. "Otherwise" (C) is irrelevant here.',
    points: 1,
    tags: ['transitions', 'addition', 'grammar', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-23',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Transitions',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      '"The factory\'s aging equipment broke down twice during the busiest production month. _____, management approved funding for a full equipment overhaul the following quarter."\n\nWhich transition best connects these sentences?',
    options: [
      { id: 'a', content: 'For example' },
      { id: 'b', content: 'In other words' },
      { id: 'c', content: 'Therefore' },
      { id: 'd', content: 'On the other hand' },
    ],
    correctAnswerId: 'c',
    explanation:
      'The breakdowns led directly to the funding decision — a cause-effect relationship signaled by "Therefore." "For example" (A) introduces an illustration. "In other words" (B) signals restatement. "On the other hand" (D) signals contrast, absent here.',
    points: 1,
    tags: ['transitions', 'cause-effect', 'grammar', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-24',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Modifiers',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Choose the option that correctly avoids a dangling modifier:\n\n"Having studied the fossil record for over a decade, _____."',
    options: [
      { id: 'a', content: 'the extinction event was determined by the paleontologist to have occurred rapidly.' },
      { id: 'b', content: 'it was determined that the extinction event occurred rapidly.' },
      { id: 'c', content: 'the paleontologist determined that the extinction event had occurred rapidly.' },
      { id: 'd', content: "the extinction event's rapid occurrence was determined." },
    ],
    correctAnswerId: 'c',
    explanation:
      'The introductory phrase must modify the person who did the studying — only C immediately supplies "the paleontologist." Options A, B, and D each place the extinction event (or impersonal "it") as the subject, illogically implying it studied the fossil record.',
    points: 1,
    tags: ['modifiers', 'dangling-modifier', 'grammar', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-25',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Parallelism',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Choose the option that maintains parallel structure:\n\n"The internship taught her to manage a budget, delegating tasks effectively, and how to resolve conflicts diplomatically."',
    options: [
      { id: 'a', content: 'to manage a budget, delegating tasks effectively, and how to resolve conflicts diplomatically' },
      { id: 'b', content: 'to manage a budget, to delegate tasks effectively, and to resolve conflicts diplomatically' },
      { id: 'c', content: 'managing a budget, to delegate tasks effectively, and resolving conflicts diplomatically' },
      { id: 'd', content: 'how to manage a budget, delegating tasks effectively, and resolving conflicts diplomatically' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Parallel structure requires items in a series to share the same form. Option B consistently uses "to + verb" for all three items. Options A, C, and D each mix infinitives, gerunds, and "how to" phrases inconsistently.',
    points: 1,
    tags: ['parallelism', 'grammar', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-26',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Pronoun Clarity',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'Identify the option that corrects the vague pronoun reference:\n\n"When the museum relocated its collection of ancient pottery to the new wing, they had to redesign the climate-control system to protect them from humidity."',
    options: [
      { id: 'a', content: 'When the museum relocated its collection of ancient pottery to the new wing, they had to redesign the climate-control system to protect it from humidity.' },
      { id: 'b', content: 'When the museum relocated its collection of ancient pottery to the new wing, curators had to redesign the climate-control system to protect the pottery from humidity.' },
      { id: 'c', content: 'When the museum relocated their collection of ancient pottery to the new wing, they had to redesign the climate-control system to protect them from humidity.' },
      { id: 'd', content: 'When the museum relocated its collection of ancient pottery to the new wing, it had to redesign the climate-control system to protect them from humidity.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'In the original, "they" and "them" have no clear antecedent. Option B eliminates ambiguity by naming "curators" and "the pottery." Option A fixes "them" but keeps vague "they." Option C introduces a new error while keeping both vague pronouns. Option D fixes "they" but leaves "them" unclear.',
    points: 2,
    tags: ['pronoun-agreement', 'pronoun-clarity', 'grammar', 'sat-rw'],
  },
  {
    id: 'sat2-rw1-27',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Apostrophes and Possessives',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Choose the option with correct use of apostrophes:\n\n"The three witnesses testimonies contradicted each other, casting doubt on the officers original report."',
    options: [
      { id: 'a', content: "The three witnesses' testimonies contradicted each other, casting doubt on the officer's original report." },
      { id: 'b', content: "The three witness's testimonies contradicted each other, casting doubt on the officers' original report." },
      { id: 'c', content: "The three witnesses testimonies' contradicted each other, casting doubt on the officers original report." },
      { id: 'd', content: "The three witnesses' testimonies contradicted each other, casting doubt on the officers' original report." },
    ],
    correctAnswerId: 'a',
    explanation:
      '"Witnesses\'" is correct plural possessive for a plural noun already ending in -s. "Officer\'s" is correct singular possessive for one officer. Option B wrongly treats "witness" as singular and "officers" as plural. Option C misplaces the apostrophe on a plain plural. Option D incorrectly pluralizes "officers\'" with no support for multiple officers.',
    points: 1,
    tags: ['apostrophes', 'possessives', 'grammar', 'sat-rw'],
  },
];

// ── Reading & Writing — Module 2 (27 q / 32 min) ───────────────────────────
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
  {
    id: 'sat2-rw2-11',
    subject: 'SAT Reading & Writing',
    topic: 'Central Ideas and Details',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'In the early seventeenth century, the astronomer Johannes Kepler challenged the long-held assumption that planets moved in perfect circles around the sun. By carefully analyzing decades of observational data collected by his mentor Tycho Brahe, Kepler determined that planetary orbits are actually elliptical. This discovery, though initially met with skepticism, laid the mathematical groundwork that later allowed Isaac Newton to formulate his theory of universal gravitation.\n\nWhich choice best states the main idea of the text?',
    options: [
      { id: 'a', content: "Tycho Brahe's observational data was more accurate than any data collected before the seventeenth century." },
      { id: 'b', content: "Kepler's determination that orbits are elliptical rather than circular overturned prior assumptions and influenced later scientific advances." },
      { id: 'c', content: "Newton's theory of universal gravitation was the direct result of Tycho Brahe's astronomical observations." },
      { id: 'd', content: 'Scientists in the seventeenth century were generally skeptical of any theory that contradicted ancient assumptions.' },
    ],
    correctAnswerId: 'b',
    explanation:
      "Choice B captures the central idea: Kepler's elliptical-orbit discovery contradicted established assumptions and provided a foundation for Newton's later work. Choice A focuses on a supporting detail with an unsupported comparative claim. Choice C misattributes the discovery to Brahe alone. Choice D overgeneralizes into a sweeping claim the text doesn't support.",
    points: 1,
    tags: ['central-ideas-and-details', 'history-of-science', 'information-and-ideas', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-12',
    subject: 'SAT Reading & Writing',
    topic: 'Inference — Social Science',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A recent study tracked participation in a neighborhood community garden over three growing seasons. Researchers found that although the number of registered plot-holders remained steady each year, the average number of hours volunteers spent maintaining shared common areas—paths, compost bins, and tool sheds—increased substantially. The researchers noted no corresponding increase in formal volunteer recruitment efforts during this period, suggesting that ______\n\nWhich choice most logically completes the text?',
    options: [
      { id: 'a', content: "plot-holders' overall satisfaction with the garden program declined steadily over the three seasons." },
      { id: 'b', content: 'existing volunteers likely took on greater responsibility for shared spaces without being formally recruited to do so.' },
      { id: 'c', content: "the neighborhood's population grew significantly during the three growing seasons studied." },
      { id: 'd', content: 'compost bins and tool sheds required far more maintenance than garden plots did.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Since plot-holder count and recruitment efforts stayed constant while volunteer hours rose, the additional labor most plausibly came from existing volunteers. Choice A introduces an unaddressed claim about satisfaction. Choice C assumes population growth, which would conflict with the steady plot-holder count. Choice D compares maintenance demands the text never distinguishes.',
    points: 1,
    tags: ['inference', 'social-science', 'information-and-ideas', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-13',
    subject: 'SAT Reading & Writing',
    topic: 'Command of Evidence — Quantitative',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'A biologist studying monarch butterfly migration recorded the average distance traveled by tagged butterflies released from four sites at different latitudes before reaching their overwintering grounds in Mexico: Site A, in Wisconsin, averaged 2,800 miles; Site B, in Texas, averaged 1,950 miles; Site C, in Ontario, averaged 3,100 miles; and Site D, in Missouri, averaged 2,400 miles. The biologist hypothesizes that butterflies released farther north travel greater total distances to reach Mexico than butterflies released farther south.\n\nWhich choice best describes how the data support the biologist\'s hypothesis?',
    options: [
      { id: 'a', content: 'Site C (Ontario), the northernmost location, produced the greatest average migration distance, while Site B (Texas), the southernmost location, produced the shortest—an order consistent with the hypothesis.' },
      { id: 'b', content: 'Site A (Wisconsin) and Site D (Missouri) produced average distances that differ by 400 miles, despite being located at similar latitudes.' },
      { id: 'c', content: 'All four sites produced average migration distances within 500 miles of one another, indicating that latitude has little effect on distance traveled.' },
      { id: 'd', content: 'Site B (Texas) produced a longer average migration distance than Site D (Missouri), even though Texas is located farther south.' },
    ],
    correctAnswerId: 'a',
    explanation:
      'Choice A identifies the pattern supporting the hypothesis: distances decrease in the same order as latitude, from Ontario (3,100 mi) down to Texas (1,950 mi). Choice B is true but doesn\'t isolate the north-south relationship. Choice C is factually wrong (the range is 1,150 miles, not under 500) and contradicts the hypothesis. Choice D misstates the data — Texas produced a shorter distance than Missouri, not longer.',
    points: 2,
    tags: ['command-of-evidence', 'quantitative-evidence', 'information-and-ideas', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-14',
    subject: 'SAT Reading & Writing',
    topic: 'Words in Context',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'The Swiss watchmaker Elena Roth was known throughout the village for her meticulous approach to her craft; she inspected every gear and spring under a magnifying lens multiple times before allowing a single timepiece to leave her workshop.\n\nAs used in the text, "meticulous" most nearly means:',
    options: [
      { id: 'a', content: 'careless' },
      { id: 'b', content: 'painstakingly careful' },
      { id: 'c', content: 'hurried' },
      { id: 'd', content: 'indifferent' },
    ],
    correctAnswerId: 'b',
    explanation:
      '"Meticulous" describes extreme care, matching Roth inspecting every gear multiple times under magnification before release. Choices A, C, and D all describe a lack of care, the opposite of the diligence described.',
    points: 1,
    tags: ['words-in-context', 'vocabulary', 'craft-and-structure', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-15',
    subject: 'SAT Reading & Writing',
    topic: 'Words in Context',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'When offered the promotion that would require her to leave her hometown, Clara felt ambivalent: she was thrilled by the professional opportunity yet dreaded severing ties with the community that had shaped her entire life.\n\nAs used in the text, "ambivalent" most nearly means:',
    options: [
      { id: 'a', content: 'enthusiastic' },
      { id: 'b', content: 'uncertain, having conflicting feelings' },
      { id: 'c', content: 'indifferent, feeling nothing at all' },
      { id: 'd', content: 'resentful' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The sentence describes Clara experiencing two opposing emotions at once — excitement and dread — precisely matching "ambivalent." Choice A captures only the positive half; C wrongly suggests she feels nothing; D introduces bitterness never mentioned.',
    points: 1,
    tags: ['words-in-context', 'vocabulary', 'craft-and-structure', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-16',
    subject: 'SAT Reading & Writing',
    topic: 'Text Structure and Purpose',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      '(1) Coral reefs are often called the "rainforests of the sea" because of the staggering biodiversity they support. (2) A single reef can host thousands of species, from tiny crustaceans to large predatory fish, all interacting within a delicate ecological web. (3) However, rising ocean temperatures have caused mass coral bleaching events in recent decades, threatening this biodiversity. (4) Marine biologists are now racing to develop heat-resistant coral strains that might survive in warmer waters.\n\nWhich choice best describes the function of sentence 3 in the text as a whole?',
    options: [
      { id: 'a', content: 'It introduces a threat that complicates the positive picture of reef biodiversity described earlier, setting up the scientific response discussed in the final sentence.' },
      { id: 'b', content: 'It provides a specific example of the biodiversity described in the first two sentences.' },
      { id: 'c', content: 'It refutes the claim that coral reefs support a wide variety of species.' },
      { id: 'd', content: 'It summarizes the overall argument of the text before introducing a new topic unrelated to coral reefs.' },
    ],
    correctAnswerId: 'a',
    explanation:
      'Sentence 3 pivots to a threat facing reef biodiversity, motivating the final sentence about scientists developing heat-resistant coral. Choice B is wrong since sentence 3 introduces danger, not an example. Choice C is incorrect since the sentence doesn\'t dispute biodiversity, only threatens it. Choice D is wrong since the topic stays connected throughout.',
    points: 1,
    tags: ['text-structure-and-purpose', 'science', 'craft-and-structure', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-17',
    subject: 'SAT Reading & Writing',
    topic: 'Text Structure and Purpose',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      '(1) Many historians credit the invention of the telegraph with transforming how nations conducted diplomacy in the nineteenth century, since messages that once took weeks to cross oceans could now arrive within hours. (2) Some scholars, however, caution against overstating this shift, pointing out that formal treaties and binding agreements still required physical documents bearing official seals and signatures, meaning that the telegraph accelerated communication without immediately altering the fundamental legal procedures of diplomacy.\n\nWhich choice best describes the function of sentence 2 in relation to the claim made in sentence 1?',
    options: [
      { id: 'a', content: 'It offers a qualification that limits the scope of the claim made in sentence 1.' },
      { id: 'b', content: 'It provides statistical evidence that confirms the claim made in sentence 1.' },
      { id: 'c', content: 'It introduces a completely unrelated claim about legal procedures that contradicts the passage\'s overall topic.' },
      { id: 'd', content: 'It restates the claim made in sentence 1 using different vocabulary.' },
    ],
    correctAnswerId: 'a',
    explanation:
      'Sentence 2 narrows the first claim by noting legal procedures remained unchanged — a qualification, not a denial. Choice B is wrong since no statistics are given. Choice C wrongly calls the claim unrelated when it is a directly relevant caveat. Choice D is wrong since new information (physical documents, legal procedure) is added.',
    points: 2,
    tags: ['text-structure-and-purpose', 'history', 'craft-and-structure', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-18',
    subject: 'SAT Reading & Writing',
    topic: 'Cross-Text Connections',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'Text 1: Advocates argue that dedicated bike lanes reduce traffic congestion by encouraging commuters to switch from cars to bicycles, and cities that have expanded their bike-lane networks have generally seen measurable drops in downtown vehicle traffic during peak hours.\n\nText 2: Critics contend that new bike lanes often occupy space previously used for vehicle travel or parking, and that this reallocation can create bottlenecks that increase, rather than decrease, congestion on the remaining roadway, particularly in cities where bicycle ridership remains low.\n\nBased on the texts, how would the author of Text 2 most likely respond to the claim in Text 1 that expanding bike-lane networks reduces downtown traffic congestion?',
    options: [
      { id: 'a', content: 'By agreeing entirely, since both texts assume that any reduction in road space for cars will necessarily reduce congestion.' },
      { id: 'b', content: 'By arguing that the reduction in congestion described in Text 1 may not occur in cities where bicycle ridership is too low to offset the loss of road space allocated to cars.' },
      { id: 'c', content: 'By insisting that bike lanes should be removed entirely regardless of their effect on traffic patterns.' },
      { id: 'd', content: 'By conceding that bike lanes always increase congestion but arguing that this trade-off is acceptable for environmental reasons.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Text 2\'s argument hinges on low ridership failing to offset lost road space, directly conditioning its disagreement with Text 1. Choice A is wrong since Text 2 challenges, not shares, Text 1\'s assumption. Choice C overstates Text 2\'s position. Choice D is wrong since Text 2 never concedes bike lanes "always" increase congestion.',
    points: 2,
    tags: ['cross-text-connections', 'urban-planning', 'craft-and-structure', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-19',
    subject: 'SAT Reading & Writing',
    topic: 'Rhetorical Synthesis',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A student has gathered the following information:\n• Researcher A found that neonicotinoid pesticide exposure impaired bees\' navigational memory in controlled laboratory settings using indoor mazes.\n• Researcher B found no significant navigational impairment in bees exposed to the same pesticide concentration under field conditions, tracking bees in open outdoor apiaries.\n• Both researchers used the same concentration of the pesticide in their studies.\n• Bees are important pollinators whose navigational abilities are essential to hive survival.\n\nThe student wants to highlight a key methodological difference that might explain why the two researchers reached different conclusions. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    options: [
      { id: 'a', content: "Researcher A found that neonicotinoid exposure impaired bees' navigational memory, while Researcher B found no such impairment." },
      { id: 'b', content: 'Researcher A studied bees using controlled indoor mazes, whereas Researcher B tracked bees in open outdoor apiaries, a methodological difference that may account for their differing findings on navigational impairment.' },
      { id: 'c', content: 'Both researchers used the same concentration of neonicotinoid pesticide in their studies of bee behavior.' },
      { id: 'd', content: "Bees are important pollinators whose navigational abilities are essential to hive survival." },
    ],
    correctAnswerId: 'b',
    explanation:
      'Choice B identifies the methodological contrast — indoor mazes versus outdoor apiaries — and links it to the differing findings, fully accomplishing the goal. Choice A reports the outcomes without the methodological cause. Choice C notes a similarity, not the difference. Choice D offers background unrelated to methodology.',
    points: 1,
    tags: ['rhetorical-synthesis', 'science', 'expression-of-ideas', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-20',
    subject: 'SAT Reading & Writing',
    topic: 'Rhetorical Synthesis',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A student has gathered the following information:\n• The Erie Canal opened in 1825, connecting the Hudson River to Lake Erie.\n• Before the canal opened, shipping goods from Buffalo to New York City by wagon took about two weeks and was expensive.\n• After the canal opened, the same trip took about eight days by barge.\n• Shipping costs for goods transported along the canal\'s route dropped by roughly 90 percent compared to overland routes.\n\nThe student wants to emphasize the magnitude of the canal\'s economic impact on shipping costs. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    options: [
      { id: 'a', content: 'The Erie Canal opened in 1825 and connected the Hudson River to Lake Erie.' },
      { id: 'b', content: 'Before the canal opened, shipping goods from Buffalo to New York City by wagon took about two weeks.' },
      { id: 'c', content: "After the Erie Canal opened, shipping costs for goods transported along its route dropped by roughly 90 percent compared to overland routes." },
      { id: 'd', content: 'The trip from Buffalo to New York City took about eight days by barge after the canal opened.' },
    ],
    correctAnswerId: 'c',
    explanation:
      "Choice C states the specific percentage drop in shipping costs, the concrete figure needed to emphasize economic impact. Choice A gives background with no cost data. Choices B and D describe travel time, not cost.",
    points: 2,
    tags: ['rhetorical-synthesis', 'history', 'expression-of-ideas', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-21',
    subject: 'SAT Reading & Writing',
    topic: 'Transitions',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'The novelist spent nearly a decade researching medieval trade routes before beginning to write her latest book. ______, she originally intended the project to take only a year.\n\nWhich choice completes the text with the most logical transition?',
    options: [
      { id: 'a', content: 'Similarly' },
      { id: 'b', content: 'Consequently' },
      { id: 'c', content: 'Nevertheless' },
      { id: 'd', content: 'For example' },
    ],
    correctAnswerId: 'c',
    explanation:
      'The second sentence contrasts the decade actually spent with the year originally planned, requiring "Nevertheless." "Similarly" (A) wrongly signals agreement. "Consequently" (B) wrongly implies causation. "For example" (D) wrongly frames the sentence as an illustration.',
    points: 1,
    tags: ['transitions', 'literature', 'expression-of-ideas', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-22',
    subject: 'SAT Reading & Writing',
    topic: 'Transitions',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      "The city's new recycling program reduced landfill waste by twenty percent in its first year. ______, participation rates continued to climb as more residents learned about the curbside pickup schedule.\n\nWhich choice completes the text with the most logical transition?",
    options: [
      { id: 'a', content: 'Moreover' },
      { id: 'b', content: 'Otherwise' },
      { id: 'c', content: 'In contrast' },
      { id: 'd', content: 'Instead' },
    ],
    correctAnswerId: 'a',
    explanation:
      'The second sentence adds another positive development, requiring an additive transition. "Otherwise" (B) implies an alternative condition. "In contrast" (C) is wrong since the ideas are complementary, not opposing. "Instead" (D) wrongly suggests substitution.',
    points: 1,
    tags: ['transitions', 'social-science', 'expression-of-ideas', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-23',
    subject: 'SAT Reading & Writing',
    topic: 'Transitions',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Proponents of the new bridge design argue that its lightweight cables will reduce construction costs significantly. ______, engineers caution that the design has not yet been tested under extreme wind conditions.\n\nWhich choice completes the text with the most logical transition?',
    options: [
      { id: 'a', content: 'Similarly' },
      { id: 'b', content: 'Nonetheless' },
      { id: 'c', content: 'Therefore' },
      { id: 'd', content: 'Specifically' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The second sentence introduces a caution pushing back against the optimism of the first, requiring "Nonetheless." "Similarly" (A) wrongly suggests agreement. "Therefore" (C) wrongly implies the caution results from the claim. "Specifically" (D) wrongly implies elaboration rather than a separate concern.',
    points: 1,
    tags: ['transitions', 'engineering', 'expression-of-ideas', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-24',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Subject-Verb Agreement',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question:
      'The collection of rare manuscripts, housed in a climate-controlled vault beneath the library, ______ carefully monitored by a team of conservators.\n\nWhich choice completes the sentence so that it conforms to the conventions of Standard English?',
    options: [
      { id: 'a', content: 'are' },
      { id: 'b', content: 'is' },
      { id: 'c', content: 'were' },
      { id: 'd', content: 'being' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The subject is the singular "collection"; "of rare manuscripts" is a modifying prepositional phrase, so the verb must be singular. "Are" (A) and "were" (C) incorrectly agree with "manuscripts." "Being" (D) is not a finite verb.',
    points: 1,
    tags: ['subject-verb-agreement', 'standard-english-conventions', 'grammar', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-25',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Pronoun Clarity',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'After the museum director consulted with the lead archivist about the mislabeled artifacts, ______ decided to revise the cataloging system entirely.\n\nWhich choice completes the sentence so that it conforms to the conventions of Standard English?',
    options: [
      { id: 'a', content: 'she' },
      { id: 'b', content: 'they' },
      { id: 'c', content: 'the archivist' },
      { id: 'd', content: 'her' },
    ],
    correctAnswerId: 'c',
    explanation:
      'With two people mentioned, a pronoun here would be ambiguous. Choice C resolves this by naming "the archivist" directly. Choices A and B are both ambiguous. Choice D is both ambiguous and grammatically wrong as a subject pronoun.',
    points: 1,
    tags: ['pronoun-clarity', 'pronoun-agreement', 'standard-english-conventions', 'grammar', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-26',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Modifiers',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Having spent three years painstakingly restoring the faded fresco, ______\n\nWhich choice most logically and grammatically completes the sentence?',
    options: [
      { id: 'a', content: "the fresco was finally put on public display by the museum's conservators." },
      { id: 'b', content: "the museum's conservators finally put the restored fresco on public display." },
      { id: 'c', content: 'the public was finally able to view the restored fresco in the museum.' },
      { id: 'd', content: 'it was finally possible to display the fresco to the public.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The introductory phrase must modify whoever did the restoring — only "the museum\'s conservators" logically did that. Choice A illogically implies the fresco restored itself. Choice C illogically implies the public did the restoring. Choice D attaches the modifier to impersonal "it."',
    points: 1,
    tags: ['modifiers', 'dangling-modifiers', 'standard-english-conventions', 'grammar', 'sat-rw'],
  },
  {
    id: 'sat2-rw2-27',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Parallelism',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      "The chef's new menu emphasizes using locally sourced ingredients, reducing food waste, and ______.\n\nWhich choice completes the sentence so that it conforms to the conventions of Standard English?",
    options: [
      { id: 'a', content: 'she supports small farms' },
      { id: 'b', content: 'supporting small farms' },
      { id: 'c', content: 'to support small farms' },
      { id: 'd', content: 'the support of small farms' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The first two listed items are gerund phrases ("using...," "reducing..."), so the third must match. Choice A breaks parallelism with an independent clause. Choice C shifts to an infinitive. Choice D shifts to a noun phrase.',
    points: 2,
    tags: ['parallelism', 'standard-english-conventions', 'grammar', 'sat-rw'],
  },
];

// ── Math — Module 1 (22 q / 35 min, calculator allowed) ────────────────────
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
  {
    id: 'sat2-m1-11',
    subject: 'SAT Math',
    topic: 'Algebra — Systems of Equations (Word Problem)',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'At a school fundraiser, adult tickets cost $12 and child tickets cost $8. The event sold 150 tickets total and collected $1,560 in revenue. How many adult tickets were sold?',
    options: [
      { id: 'a', content: '60' },
      { id: 'b', content: '90' },
      { id: 'c', content: '75' },
      { id: 'd', content: '105' },
    ],
    correctAnswerId: 'b',
    explanation:
      'a + c = 150 → c = 150 − a. Substitute into 12a + 8c = 1560: 12a + 8(150 − a) = 1560 → 4a = 360 → a = 90.',
    points: 1,
    tags: ['systems-of-equations', 'word-problem', 'algebra', 'sat-math'],
  },
  {
    id: 'sat2-m1-12',
    subject: 'SAT Math',
    topic: 'Algebra — Absolute Value Equations',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question: 'What is the sum of all values of x that satisfy the equation |3x - 6| = 15?',
    options: [
      { id: 'a', content: '12' },
      { id: 'b', content: '10' },
      { id: 'c', content: '4' },
      { id: 'd', content: '7' },
    ],
    correctAnswerId: 'c',
    explanation:
      '3x − 6 = 15 → x = 7. 3x − 6 = −15 → x = −3. Sum = 7 + (−3) = 4.',
    points: 1,
    tags: ['absolute-value', 'equations', 'sat-math'],
  },
  {
    id: 'sat2-m1-13',
    subject: 'SAT Math',
    topic: 'Algebra — Inequalities (Word Problem)',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      "A moving company's van can carry at most 2,000 pounds. The driver has already loaded 4 identical crates that each weigh 150 pounds. If each additional box weighs 35 pounds, what is the maximum number of boxes the driver can load without exceeding the van's weight limit?",
    options: [
      { id: 'a', content: '40' },
      { id: 'b', content: '57' },
      { id: 'c', content: '52' },
      { id: 'd', content: '74' },
    ],
    correctAnswerId: 'a',
    explanation:
      '35b + 4(150) ≤ 2000 → 35b + 600 ≤ 2000 → 35b ≤ 1400 → b ≤ 40.',
    points: 1,
    tags: ['inequalities', 'word-problem', 'algebra', 'sat-math'],
  },
  {
    id: 'sat2-m1-14',
    subject: 'SAT Math',
    topic: 'Advanced Math — Quadratic Equations (Factoring)',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question: 'If x^2 - 5x - 24 = 0 and x > 0, what is the value of x?',
    options: [
      { id: 'a', content: '3' },
      { id: 'b', content: '-3' },
      { id: 'c', content: '24' },
      { id: 'd', content: '8' },
    ],
    correctAnswerId: 'd',
    explanation:
      'Factor: (x − 8)(x + 3) = 0, so x = 8 or x = −3. Since x > 0, x = 8.',
    points: 1,
    tags: ['quadratics', 'factoring', 'sat-math'],
  },
  {
    id: 'sat2-m1-15',
    subject: 'SAT Math',
    topic: 'Advanced Math — Polynomial Operations',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question: 'Which of the following is equivalent to (2x - 3)(x + 4) - (x - 1)^2?',
    options: [
      { id: 'a', content: 'x^2 + 3x - 13' },
      { id: 'b', content: 'x^2 + 7x - 13' },
      { id: 'c', content: 'x^2 + 5x - 11' },
      { id: 'd', content: 'x^2 + 7x - 11' },
    ],
    correctAnswerId: 'b',
    explanation:
      '(2x − 3)(x + 4) = 2x² + 5x − 12. (x − 1)² = x² − 2x + 1. Subtract: (2x² + 5x − 12) − (x² − 2x + 1) = x² + 7x − 13.',
    points: 1,
    tags: ['polynomials', 'factoring', 'algebra', 'sat-math'],
  },
  {
    id: 'sat2-m1-16',
    subject: 'SAT Math',
    topic: 'Advanced Math — Exponential Growth Functions',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'The number of bacteria in a culture is modeled by P(t) = 200(3)^(t/4), where P(t) is the population t hours after the culture was started. Based on this model, after how many hours will the population first reach 5,400?',
    options: [
      { id: 'a', content: '12' },
      { id: 'b', content: '8' },
      { id: 'c', content: '16' },
      { id: 'd', content: '27' },
    ],
    correctAnswerId: 'a',
    explanation:
      '200(3)^(t/4) = 5400 → 3^(t/4) = 27 = 3³ → t/4 = 3 → t = 12.',
    points: 2,
    tags: ['exponential-functions', 'growth-models', 'sat-math'],
  },
  {
    id: 'sat2-m1-17',
    subject: 'SAT Math',
    topic: 'Advanced Math — Function Evaluation and Composition',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question: 'If f(x) = 2x^2 - 3 and g(x) = x + 4, what is the value of f(g(-2))?',
    options: [
      { id: 'a', content: '9' },
      { id: 'b', content: '1' },
      { id: 'c', content: '5' },
      { id: 'd', content: '13' },
    ],
    correctAnswerId: 'c',
    explanation:
      'g(−2) = −2 + 4 = 2. f(2) = 2(2)² − 3 = 8 − 3 = 5.',
    points: 2,
    tags: ['functions', 'composition', 'sat-math'],
  },
  {
    id: 'sat2-m1-18',
    subject: 'SAT Math',
    topic: 'Advanced Math — Nonlinear Systems of Equations',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'In the xy-plane, the graphs of y = x^2 - 4 and y = 2x + 1 intersect at two points. What is the sum of the x-coordinates of these two points?',
    options: [
      { id: 'a', content: '4' },
      { id: 'b', content: '-2' },
      { id: 'c', content: '5' },
      { id: 'd', content: '2' },
    ],
    correctAnswerId: 'd',
    explanation:
      'x² − 4 = 2x + 1 → x² − 2x − 5 = 0. Sum of roots = −b/a = 2.',
    points: 2,
    tags: ['nonlinear-systems', 'quadratics', 'sat-math'],
  },
  {
    id: 'sat2-m1-19',
    subject: 'SAT Math',
    topic: 'Problem-Solving and Data Analysis — Probability',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A bag contains 5 red marbles, 3 blue marbles, and 4 green marbles. If two marbles are drawn at random without replacement, what is the probability that both marbles drawn are red?',
    options: [
      { id: 'a', content: '5/33' },
      { id: 'b', content: '25/144' },
      { id: 'c', content: '5/36' },
      { id: 'd', content: '5/12' },
    ],
    correctAnswerId: 'a',
    explanation:
      'P(first red) = 5/12. After removing one red, P(second red) = 4/11. P(both red) = (5/12)(4/11) = 20/132 = 5/33.',
    points: 1,
    tags: ['probability', 'data-analysis', 'sat-math'],
  },
  {
    id: 'sat2-m1-20',
    subject: 'SAT Math',
    topic: 'Geometry and Trigonometry — Circles (Equation of a Circle)',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question: 'A circle in the xy-plane is defined by the equation x^2 + y^2 - 6x + 8y = 0. What is the radius of the circle?',
    options: [
      { id: 'a', content: '25' },
      { id: 'b', content: '7' },
      { id: 'c', content: '5' },
      { id: 'd', content: '3' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Complete the square: (x − 3)² − 9 + (y + 4)² − 16 = 0 → (x − 3)² + (y + 4)² = 25. r² = 25, so r = 5.',
    points: 2,
    tags: ['circles', 'coordinate-geometry', 'sat-math'],
  },
  {
    id: 'sat2-m1-21',
    subject: 'SAT Math',
    topic: 'Geometry and Trigonometry — Right Triangle Trigonometry',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'In right triangle ABC, angle C is a right angle, the measure of angle A is 32°, and the side opposite angle A has length 10. What is the length of the hypotenuse, rounded to the nearest tenth?',
    options: [
      { id: 'a', content: '11.8' },
      { id: 'b', content: '18.9' },
      { id: 'c', content: '16.0' },
      { id: 'd', content: '5.3' },
    ],
    correctAnswerId: 'b',
    explanation:
      'sin(32°) = 10/hypotenuse → hypotenuse = 10/sin(32°) ≈ 10/0.5299 ≈ 18.9.',
    points: 2,
    tags: ['trigonometry', 'right-triangles', 'sat-math'],
  },
  {
    id: 'sat2-m1-22',
    subject: 'SAT Math',
    topic: 'Geometry and Trigonometry — Coordinate Geometry (Distance Formula)',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question: 'In the xy-plane, point A is located at (-2, 5) and point B is located at (4, -3). What is the distance between points A and B?',
    options: [
      { id: 'a', content: '14' },
      { id: 'b', content: 'sqrt(28)' },
      { id: 'c', content: '8' },
      { id: 'd', content: '10' },
    ],
    correctAnswerId: 'd',
    explanation:
      'Distance = √[(4−(−2))² + (−3−5)²] = √[36 + 64] = √100 = 10.',
    points: 1,
    tags: ['coordinate-geometry', 'distance-formula', 'sat-math'],
  },
];

// ── Math — Module 2 (22 q / 35 min, calculator allowed) ────────────────────
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
  {
    id: 'sat2-m2-11',
    subject: 'SAT Math',
    topic: 'Linear Equations (one variable)',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question: 'What value of x satisfies the equation 3(x - 4) + 5 = 2x + 7?',
    options: [
      { id: 'a', content: '14' },
      { id: 'b', content: '19' },
      { id: 'c', content: '-10' },
      { id: 'd', content: '0' },
    ],
    correctAnswerId: 'a',
    explanation:
      '3x − 12 + 5 = 2x + 7 → 3x − 7 = 2x + 7 → x − 7 = 7 → x = 14.',
    points: 1,
    tags: ['algebra', 'linear-equations', 'one-variable', 'sat-math'],
  },
  {
    id: 'sat2-m2-12',
    subject: 'SAT Math',
    topic: 'Systems of Linear Equations',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question: 'If 2x + y = 11 and x - y = 1, what is the value of x?',
    options: [
      { id: 'a', content: '3' },
      { id: 'b', content: '4' },
      { id: 'c', content: '5' },
      { id: 'd', content: '7' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Adding the equations: (2x + y) + (x − y) = 12 → 3x = 12 → x = 4.',
    points: 1,
    tags: ['algebra', 'systems-of-equations', 'sat-math'],
  },
  {
    id: 'sat2-m2-13',
    subject: 'SAT Math',
    topic: 'Linear Inequalities',
    category: 'SAT_PREP',
    difficulty: 'EASY',
    question: 'Which of the following is equivalent to -3x + 6 > 15?',
    options: [
      { id: 'a', content: 'x < -3' },
      { id: 'b', content: 'x > -3' },
      { id: 'c', content: 'x < 3' },
      { id: 'd', content: 'x > 3' },
    ],
    correctAnswerId: 'a',
    explanation:
      '−3x > 9 → dividing by −3 flips the inequality: x < −3.',
    points: 1,
    tags: ['algebra', 'linear-inequalities', 'sat-math'],
  },
  {
    id: 'sat2-m2-14',
    subject: 'SAT Math',
    topic: 'Absolute Value Equations',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question: 'What is the sum of all solutions to |2x - 5| = 9?',
    options: [
      { id: 'a', content: '5' },
      { id: 'b', content: '7' },
      { id: 'c', content: '10' },
      { id: 'd', content: '-2' },
    ],
    correctAnswerId: 'a',
    explanation:
      '2x − 5 = 9 → x = 7. 2x − 5 = −9 → x = −2. Sum = 7 + (−2) = 5.',
    points: 1,
    tags: ['algebra', 'absolute-value', 'equations', 'sat-math'],
  },
  {
    id: 'sat2-m2-15',
    subject: 'SAT Math',
    topic: 'Literal Equations (solve for a variable)',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question: 'The volume of a cone is given by V = (1/3)πr²h. Which equation correctly solves for h in terms of V and r?',
    options: [
      { id: 'a', content: 'h = 3V / (πr²)' },
      { id: 'b', content: 'h = V / (3πr²)' },
      { id: 'c', content: 'h = 3V / (πr)' },
      { id: 'd', content: 'h = πr² / (3V)' },
    ],
    correctAnswerId: 'a',
    explanation:
      '3V = πr²h → h = 3V / (πr²).',
    points: 1,
    tags: ['algebra', 'literal-equations', 'solve-for-variable', 'sat-math'],
  },
  {
    id: 'sat2-m2-16',
    subject: 'SAT Math',
    topic: 'Linear Word Problem',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      "A rental car company charges a flat fee of $35 plus $0.20 per mile driven. If Maria's total bill was $83, how many miles did she drive?",
    options: [
      { id: 'a', content: '240' },
      { id: 'b', content: '415' },
      { id: 'c', content: '480' },
      { id: 'd', content: '48' },
    ],
    correctAnswerId: 'a',
    explanation:
      '35 + 0.20m = 83 → 0.20m = 48 → m = 240 miles.',
    points: 2,
    tags: ['algebra', 'word-problem', 'linear-models', 'sat-math'],
  },
  {
    id: 'sat2-m2-17',
    subject: 'SAT Math',
    topic: 'Compound Inequalities',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question: 'What is the solution set of -2 ≤ 3x + 4 < 13?',
    options: [
      { id: 'a', content: '-2 ≤ x < 3' },
      { id: 'b', content: '-2 < x ≤ 3' },
      { id: 'c', content: '-6 ≤ x < 9' },
      { id: 'd', content: '-6 ≤ x < 3' },
    ],
    correctAnswerId: 'a',
    explanation:
      'Subtract 4: −6 ≤ 3x < 9. Divide by 3: −2 ≤ x < 3.',
    points: 2,
    tags: ['algebra', 'compound-inequalities', 'sat-math'],
  },
  {
    id: 'sat2-m2-18',
    subject: 'SAT Math',
    topic: 'Quadratic Equations (discriminant)',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question: 'For what value of k does the equation x² + 6x + k = 0 have exactly one real solution?',
    options: [
      { id: 'a', content: '9' },
      { id: 'b', content: '6' },
      { id: 'c', content: '-9' },
      { id: 'd', content: '3' },
    ],
    correctAnswerId: 'a',
    explanation:
      'One real solution requires discriminant = 0: 6² − 4(1)(k) = 0 → 36 − 4k = 0 → k = 9.',
    points: 2,
    tags: ['advanced-math', 'quadratics', 'discriminant', 'sat-math'],
  },
  {
    id: 'sat2-m2-19',
    subject: 'SAT Math',
    topic: 'Function Composition',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question: 'If f(x) = 2x² - 3 and g(x) = x + 4, what is the value of f(g(1))?',
    options: [
      { id: 'a', content: '47' },
      { id: 'b', content: '7' },
      { id: 'c', content: '3' },
      { id: 'd', content: '53' },
    ],
    correctAnswerId: 'a',
    explanation:
      'g(1) = 5. f(5) = 2(5)² − 3 = 50 − 3 = 47.',
    points: 1,
    tags: ['advanced-math', 'functions', 'composition', 'sat-math'],
  },
  {
    id: 'sat2-m2-20',
    subject: 'SAT Math',
    topic: 'Exponential Growth',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'A population of bacteria starts at 500 and triples every 4 hours. Which function models the population P(t), where t is the number of hours since the population was first measured?',
    options: [
      { id: 'a', content: 'P(t) = 500(3)^(t/4)' },
      { id: 'b', content: 'P(t) = 500(3)^(4t)' },
      { id: 'c', content: 'P(t) = 500(4)^(t/3)' },
      { id: 'd', content: 'P(t) = 500(3)(t/4)' },
    ],
    correctAnswerId: 'a',
    explanation:
      'A quantity tripling every 4 hours grows as base 3 with exponent t/4. Checking t = 4: P(4) = 500(3)¹ = 1500, triple the initial 500.',
    points: 2,
    tags: ['advanced-math', 'exponential-growth', 'modeling', 'sat-math'],
  },
  {
    id: 'sat2-m2-21',
    subject: 'SAT Math',
    topic: 'Probability',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question: 'A bag contains 5 red marbles, 3 blue marbles, and 4 green marbles. If one marble is drawn at random, what is the probability that it is NOT blue?',
    options: [
      { id: 'a', content: '3/4' },
      { id: 'b', content: '1/4' },
      { id: 'c', content: '5/12' },
      { id: 'd', content: '1/3' },
    ],
    correctAnswerId: 'a',
    explanation:
      'Total = 12 marbles. Not blue = 5 + 4 = 9. P(not blue) = 9/12 = 3/4.',
    points: 1,
    tags: ['problem-solving-data-analysis', 'probability', 'sat-math'],
  },
  {
    id: 'sat2-m2-22',
    subject: 'SAT Math',
    topic: 'Ratios and Percentages',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'In a survey, the ratio of students who prefer online classes to those who prefer in-person classes is 5:3. If 240 students prefer in-person classes, and each surveyed student prefers exactly one of the two options, what percentage of all surveyed students prefer online classes?',
    options: [
      { id: 'a', content: '62.5%' },
      { id: 'b', content: '37.5%' },
      { id: 'c', content: '60%' },
      { id: 'd', content: '41.7%' },
    ],
    correctAnswerId: 'a',
    explanation:
      'In-person = 3 parts = 240 → 1 part = 80. Online = 5 parts = 400. Total = 640. Online % = 400/640 = 62.5%.',
    points: 2,
    tags: ['problem-solving-data-analysis', 'ratios', 'percentages', 'sat-math'],
  },
];

export const SAT_MOCK_TEST_2_SECTIONS: ExamSection[] = [
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
