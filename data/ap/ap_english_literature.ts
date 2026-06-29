import type { DemoQuestion } from '@/types';

export const AP_ENGLISH_LITERATURE: DemoQuestion[] = [
  {
    id: 'ap-eng-lit-01',
    subject: 'AP English Literature',
    topic: 'Poetry Analysis — Figurative Language',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'In Shakespeare\'s Sonnet 18: "Shall I compare thee to a summer\'s day? / Thou art more lovely and more temperate."\n\nThe opening comparison is an example of:',
    options: [
      { id: 'a', content: 'Personification — giving human qualities to summer' },
      { id: 'b', content: 'Simile — comparing the beloved to a summer\'s day using an implied comparison' },
      { id: 'c', content: 'Metaphor — directly equating the beloved with a summer\'s day' },
      { id: 'd', content: 'Apostrophe — addressing an absent or abstract subject' },
    ],
    correctAnswerId: 'b',
    explanation:
      '"Shall I compare thee to a summer\'s day?" uses "compare to" which signals a simile (explicit comparison). However, note that by the second line, the comparison is already undermined — the beloved surpasses the summer\'s day, setting up the sonnet\'s argument about immortality through verse.',
    points: 2,
    tags: ['simile', 'figurative-language', 'shakespeare', 'poetry', 'ap-eng-lit'],
  },
  {
    id: 'ap-eng-lit-02',
    subject: 'AP English Literature',
    topic: 'Narrative Point of View',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'A narrator who reveals the thoughts and feelings of only one character while referring to all characters in the third person is using:',
    options: [
      { id: 'a', content: 'First-person limited perspective' },
      { id: 'b', content: 'Third-person omniscient perspective' },
      { id: 'c', content: 'Third-person limited perspective' },
      { id: 'd', content: 'Second-person perspective' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Third-person limited: uses he/she/they (third person) but has access only to one character\'s inner world. Third-person omniscient has access to ALL characters\' thoughts. First-person uses "I." Examples of third-person limited: Jane Austen\'s Free Indirect Discourse, much of Harry Potter.',
    points: 1,
    tags: ['point-of-view', 'narrative-perspective', 'fiction', 'ap-eng-lit'],
  },
  {
    id: 'ap-eng-lit-03',
    subject: 'AP English Literature',
    topic: 'Drama — Hamlet',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question:
      '"To be, or not to be, that is the question."\n\nIn Hamlet\'s soliloquy, this opening line serves primarily to:',
    options: [
      { id: 'a', content: 'Announce Hamlet\'s plan to kill Claudius' },
      { id: 'b', content: 'Frame a meditation on existence, suffering, and whether enduring life\'s burdens is preferable to death' },
      { id: 'c', content: 'Establish Hamlet\'s madness to deceive Polonius' },
      { id: 'd', content: 'Reveal that Hamlet has discovered Claudius\'s guilt' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The soliloquy (Act III, Scene 1) is a philosophical contemplation: is it nobler to endure life\'s suffering or to end it? Hamlet weighs "the slings and arrows of outrageous fortune" against the fear of the unknown afterlife ("the undiscovered country"). It reflects his paralysis and intellectual nature.',
    points: 2,
    tags: ['hamlet', 'soliloquy', 'drama', 'shakespeare', 'ap-eng-lit'],
  },
  {
    id: 'ap-eng-lit-04',
    subject: 'AP English Literature',
    topic: 'Novel — Great Gatsby',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question:
      'In The Great Gatsby, the green light at the end of Daisy\'s dock most powerfully symbolizes:',
    options: [
      { id: 'a', content: 'Daisy\'s jealousy and possessiveness' },
      { id: 'b', content: 'The unattainable nature of the American Dream — desire for a past that can never be recovered' },
      { id: 'c', content: 'Tom\'s control over Daisy and her property' },
      { id: 'd', content: 'Environmental decline in the industrial age' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The green light represents Gatsby\'s longing for Daisy — and more broadly, the American Dream\'s promise. Fitzgerald uses it to critique the Dream as perpetually deferred: "So we beat on, boats against the current, borne back ceaselessly into the past." Gatsby can\'t repeat the past; his dream collapses on contact with reality.',
    points: 2,
    tags: ['great-gatsby', 'symbolism', 'american-dream', 'fitzgerald', 'ap-eng-lit'],
  },
  {
    id: 'ap-eng-lit-05',
    subject: 'AP English Literature',
    topic: 'Poetry — Form and Structure',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'A poem with 14 lines in iambic pentameter and a rhyme scheme of ABAB CDCD EFEF GG is most likely:',
    options: [
      { id: 'a', content: 'A Petrarchan (Italian) sonnet' },
      { id: 'b', content: 'A Shakespearean (English) sonnet' },
      { id: 'c', content: 'A villanelle' },
      { id: 'd', content: 'A terza rima' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The Shakespearean sonnet: 14 lines of iambic pentameter, rhyme scheme ABAB CDCD EFEF GG (three quatrains + a couplet). The Petrarchan sonnet uses ABBAABBA CDECDE (or similar sestet variation) and divides into an octave and sestet at a volta.',
    points: 1,
    tags: ['sonnet', 'form', 'structure', 'iambic-pentameter', 'ap-eng-lit'],
  },
  {
    id: 'ap-eng-lit-06',
    subject: 'AP English Literature',
    topic: 'Irony',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'In dramatic irony, the audience knows something that:',
    options: [
      { id: 'a', content: 'The author deliberately concealed from all readers' },
      { id: 'b', content: 'A character or characters in the story do not know' },
      { id: 'c', content: 'Is the opposite of what the narrator says' },
      { id: 'd', content: 'Contradicts the setting of the story' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Dramatic irony: the audience possesses information a character lacks, creating tension or pathos. Classic example: in Romeo and Juliet, the audience knows Juliet is merely drugged — Romeo does not. Verbal irony is saying the opposite of what you mean (sarcasm). Situational irony is an outcome opposite to what was expected.',
    points: 1,
    tags: ['irony', 'dramatic-irony', 'literary-terms', 'ap-eng-lit'],
  },
  {
    id: 'ap-eng-lit-07',
    subject: 'AP English Literature',
    topic: 'Novel — 1984',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question:
      'In Orwell\'s 1984, "doublethink" refers to:',
    options: [
      { id: 'a', content: 'The Party\'s use of two separate propaganda agencies' },
      { id: 'b', content: 'The ability to hold two contradictory beliefs simultaneously, accepting both as true' },
      { id: 'c', content: 'Winston\'s habit of keeping two diaries — one for the Party and one secret' },
      { id: 'd', content: 'A two-step thought process used to detect Thought Crimes' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Doublethink is the psychological mechanism by which Party members accept contradictions (e.g., "War is Peace, Freedom is Slavery, Ignorance is Strength"). It enables the Party to rewrite history while people consciously accept the falsification. Orwell presents it as the ultimate corruption of the rational mind under totalitarianism.',
    points: 2,
    tags: ['1984', 'orwell', 'doublethink', 'dystopian', 'ap-eng-lit'],
  },
  {
    id: 'ap-eng-lit-08',
    subject: 'AP English Literature',
    topic: 'Close Reading — Tone',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'From a short story:\n\n"Her mother arranged the flowers with the precise, habitual care of a surgeon — or of someone who has given up expecting praise."\n\nThe tone of this sentence is best described as:',
    options: [
      { id: 'a', content: 'Celebratory and admiring' },
      { id: 'b', content: 'Wistful and subtly melancholic' },
      { id: 'c', content: 'Angry and accusatory' },
      { id: 'd', content: 'Detached and clinical' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The surgical precision implies skill and care, but the second half of the simile — "someone who has given up expecting praise" — introduces unspoken sadness. The mother\'s care is habitual, perhaps joyless. The tone blends admiration for the act with melancholy about the emotional context. Wistful and subtly melancholic best captures this.',
    points: 2,
    tags: ['tone', 'close-reading', 'fiction', 'ap-eng-lit'],
  },
  {
    id: 'ap-eng-lit-09',
    subject: 'AP English Literature',
    topic: 'Theme — Tragic Hero',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'In Aristotelian tragedy, hamartia refers to:',
    options: [
      { id: 'a', content: 'The moment of recognition when the hero understands their fate' },
      { id: 'b', content: 'The tragic flaw or error in judgment that leads to the hero\'s downfall' },
      { id: 'c', content: 'The audience\'s emotional purging of fear and pity' },
      { id: 'd', content: 'The reversal of fortune from good to bad' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Hamartia is the tragic flaw — often a character weakness (Macbeth\'s ambition, Othello\'s jealousy) or an error in judgment — that leads to the hero\'s downfall. Anagnorisis is the moment of recognition/discovery. Catharsis is the audience\'s emotional purging. Peripeteia is the reversal of fortune.',
    points: 1,
    tags: ['hamartia', 'tragic-hero', 'aristotle', 'tragedy', 'ap-eng-lit'],
  },
  {
    id: 'ap-eng-lit-10',
    subject: 'AP English Literature',
    topic: 'Prose Style — Syntax',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question:
      'A sentence that builds through several subordinate clauses before reaching the main clause at the end is called:',
    options: [
      { id: 'a', content: 'A loose sentence (cumulative sentence)' },
      { id: 'b', content: 'A periodic sentence' },
      { id: 'c', content: 'An asyndeton' },
      { id: 'd', content: 'A polysyndeton' },
    ],
    correctAnswerId: 'b',
    explanation:
      'A periodic sentence delays the main clause until the end, building suspense and subordination before the resolution. A loose (cumulative) sentence states the main clause first, then adds modifying elements. Asyndeton omits conjunctions ("I came, I saw, I conquered"); polysyndeton uses many conjunctions ("and...and...and").',
    points: 2,
    tags: ['syntax', 'periodic-sentence', 'prose-style', 'rhetoric', 'ap-eng-lit'],
  },
];
