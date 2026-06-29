/**
 * Demo Quiz 3 — Critical reasoning, history & language arts
 * 10 questions testing analytical reading, historical thinking, and argumentation.
 */
import type { DemoQuestion } from '@/types';

export const DEMO_QUIZ_3: DemoQuestion[] = [
  {
    id: 'dq3-01',
    subject: 'AP US History',
    topic: 'Civil War Era',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'The Emancipation Proclamation (1863) was significant primarily because it:',
    options: [
      { id: 'a', content: 'Immediately freed all enslaved people throughout the United States' },
      { id: 'b', content: 'Redefined the Civil War as a war for human freedom, altering its political and diplomatic character' },
      { id: 'c', content: 'Granted full citizenship rights to formerly enslaved people' },
      { id: 'd', content: 'Was the constitutional amendment that abolished slavery' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The Emancipation Proclamation only freed enslaved people in Confederate states — not border states or Union-controlled areas. Its greatest significance was ideological: it transformed the war into an explicit fight against slavery, discouraging European powers from supporting the Confederacy and enabling Black men to enlist in the Union Army.',
    points: 2,
    tags: ['emancipation', 'civil-war', 'ap-ush'],
  },
  {
    id: 'dq3-02',
    subject: 'SAT Reading & Writing',
    topic: 'Rhetorical Analysis',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      'From a speech by an environmental activist:\n\n"We call it \'natural disaster\' when the levee breaks — but who built the levee short? We call it \'wildfire season\' — but who cleared the forest management budget? There is nothing natural about preventable catastrophe."\n\nWhich rhetorical device is most prominently used here?',
    options: [
      { id: 'a', content: 'Hyperbole — extreme exaggeration to make a point' },
      { id: 'b', content: 'Anaphora — repetition of a phrase at the start of successive clauses to build emphasis' },
      { id: 'c', content: 'Understatement — describing serious events as less significant than they are' },
      { id: 'd', content: 'Allusion — reference to a historical event' },
    ],
    correctAnswerId: 'b',
    explanation:
      '"We call it" is repeated at the beginning of successive rhetorical questions — this is anaphora. Anaphora builds rhythm and emphasis. The passage does not use hyperbole (no extreme exaggeration), understatement (the tone is alarmed, not understated), or allusion (no historical reference).',
    points: 2,
    tags: ['rhetoric', 'anaphora', 'literary-devices', 'sat-rw'],
  },
  {
    id: 'dq3-03',
    subject: 'AP US History',
    topic: 'Progressive Era',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'Which of the following BEST describes the primary goal of muckrakers in the early 20th century?',
    options: [
      { id: 'a', content: 'To promote US expansion into new territories' },
      { id: 'b', content: 'To investigate and expose corruption, unsafe conditions, and social injustice through journalism' },
      { id: 'c', content: 'To lobby Congress for protective tariffs on imported goods' },
      { id: 'd', content: 'To advocate for the gold standard and sound monetary policy' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Muckrakers (e.g., Upton Sinclair, Ida Tarbell, Lincoln Steffens) used investigative journalism to expose corporate corruption, labor abuses, and political graft during the Progressive Era. Their work helped drive regulatory reforms like the Pure Food and Drug Act.',
    points: 1,
    tags: ['muckrakers', 'progressive-era', 'ap-ush'],
  },
  {
    id: 'dq3-04',
    subject: 'SAT Reading & Writing',
    topic: 'Argument Evaluation',
    category: 'SAT_PREP',
    difficulty: 'HARD',
    question:
      '"Students who attend private schools score higher on standardized tests than public school students. Therefore, private schools provide a better education."\n\nWhich statement identifies the most significant flaw in this argument?',
    options: [
      { id: 'a', content: 'Standardized tests are not a valid measure of educational quality.' },
      { id: 'b', content: 'The argument does not account for selection bias — private school students may come from more affluent families with more resources at home.' },
      { id: 'c', content: 'The sample of private school students may be too small.' },
      { id: 'd', content: 'The argument should also compare teacher qualifications between the two school types.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The argument confounds school type with socioeconomic status — private school students tend to come from wealthier families who can afford tutoring and other supports. Selection bias (not controlled for) means higher test scores may reflect student background, not school quality. This is the argument\'s central logical flaw.',
    points: 2,
    tags: ['argument-evaluation', 'selection-bias', 'critical-reasoning', 'sat-rw'],
  },
  {
    id: 'dq3-05',
    subject: 'AP US History',
    topic: 'Cold War',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'The Marshall Plan (1948) was primarily designed to:',
    options: [
      { id: 'a', content: 'Fund military operations in Korea' },
      { id: 'b', content: 'Provide economic aid to rebuild Western Europe and limit the spread of communism' },
      { id: 'c', content: 'Establish NATO as a military alliance' },
      { id: 'd', content: 'Create the United Nations' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The Marshall Plan provided ~$13 billion in US economic aid to rebuild war-devastated Western European economies. A key strategic goal was preventing the economic instability that could make communist movements more appealing. NATO (1949) and the UN (1945) were separate initiatives.',
    points: 1,
    tags: ['cold-war', 'marshall-plan', 'ap-ush'],
  },
  {
    id: 'dq3-06',
    subject: 'SAT Reading & Writing',
    topic: 'Inference',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'From a poem:\n\n"She kept the letters in a cedar box\nbeneath the winter clothes she never wore —\nthe ones she\'d bought for somewhere cold and far,\na trip she\'d planned, then didn\'t plan anymore."\n\nWhat can be most reasonably inferred from these lines?',
    options: [
      { id: 'a', content: 'The subject dislikes winter weather.' },
      { id: 'b', content: 'The subject had plans that were abandoned, and keeps mementos of a past relationship or aspiration hidden away.' },
      { id: 'c', content: 'The subject has too many clothes and not enough storage space.' },
      { id: 'd', content: 'The poem is set in a tropical climate.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The cedar box with letters hidden beneath clothes bought for a trip "she didn\'t plan anymore" strongly implies abandoned plans — possibly a relationship or journey that didn\'t happen. The letters and unused clothes are preserved together, suggesting emotional rather than practical storage.',
    points: 1,
    tags: ['inference', 'poetry', 'literary-analysis', 'sat-rw'],
  },
  {
    id: 'dq3-07',
    subject: 'AP US History',
    topic: 'Civil Rights',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'The Supreme Court case Brown v. Board of Education (1954) was significant primarily because it:',
    options: [
      { id: 'a', content: 'Desegregated the US military' },
      { id: 'b', content: 'Ruled that racially segregated public schools were inherently unequal, overturning Plessy v. Ferguson' },
      { id: 'c', content: 'Granted voting rights to African Americans in the South' },
      { id: 'd', content: 'Outlawed poll taxes and literacy tests' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Brown v. Board held that "separate but equal" public schools were constitutionally unequal under the 14th Amendment, directly overturning the 1896 Plessy v. Ferguson precedent. Military desegregation was achieved by Executive Order 9981 (1948). Voting rights protections came with the 1965 Voting Rights Act.',
    points: 2,
    tags: ['civil-rights', 'brown-v-board', 'supreme-court', 'ap-ush'],
  },
  {
    id: 'dq3-08',
    subject: 'SAT Reading & Writing',
    topic: 'Grammar — Active vs. Passive Voice',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      'Which version uses active voice most effectively?\n\n"The committee\'s proposal was rejected by the board of directors."',
    options: [
      { id: 'a', content: 'The committee\'s proposal was rejected by the board of directors.' },
      { id: 'b', content: 'Rejection of the committee\'s proposal was carried out by the board.' },
      { id: 'c', content: 'The board of directors rejected the committee\'s proposal.' },
      { id: 'd', content: 'The proposal of the committee was a thing the board rejected.' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Active voice places the actor (the board) as the grammatical subject performing the action (rejected). Option C directly achieves this. Options A and B use passive voice ("was rejected by"). Option D is awkward and verbose.',
    points: 1,
    tags: ['active-passive-voice', 'grammar', 'style', 'sat-rw'],
  },
  {
    id: 'dq3-09',
    subject: 'AP US History',
    topic: 'Industrialization',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'Which best describes the primary economic significance of the transcontinental railroad\'s completion in 1869?',
    options: [
      { id: 'a', content: 'It ended the economic depression of the 1860s' },
      { id: 'b', content: 'It created a national market by linking eastern industries with western resources and markets' },
      { id: 'c', content: 'It was primarily used to transport troops during conflicts with Native Americans' },
      { id: 'd', content: 'It led directly to the creation of Standard Oil and the petroleum industry' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The transcontinental railroad integrated the national economy — moving manufactured goods west and agricultural products east, enabling the rise of national corporations and markets. While it had military uses and contributed to Native displacement, its primary economic significance was market integration.',
    points: 1,
    tags: ['industrialization', 'railroads', 'ap-ush'],
  },
  {
    id: 'dq3-10',
    subject: 'SAT Reading & Writing',
    topic: 'Tone',
    category: 'SAT_PREP',
    difficulty: 'MEDIUM',
    question:
      '"The committee has now spent three years and $4.2 million studying how to improve school lunch nutritional value. Three years. Four point two million dollars. The conclusion: vegetables are good for children."\n\nThe tone of this excerpt is best described as:',
    options: [
      { id: 'a', content: 'sympathetic and appreciative' },
      { id: 'b', content: 'sarcastic and incredulous' },
      { id: 'c', content: 'objective and neutral' },
      { id: 'd', content: 'anxious and uncertain' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The fragment "Three years. Four point two million dollars." followed by "The conclusion: vegetables are good for children" — an absurdly obvious finding — signals sarcasm. The writer is mocking what they perceive as a wasteful and unnecessary study. The repetition for emphasis and the bathetic conclusion confirm sarcasm and incredulity.',
    points: 1,
    tags: ['tone', 'sarcasm', 'rhetoric', 'sat-rw'],
  },
];
