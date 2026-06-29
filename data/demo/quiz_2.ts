/**
 * Demo Quiz 2 — Sciences & AP fundamentals
 * 10 questions spanning biology, chemistry, physics, and AP-level topics.
 */
import type { DemoQuestion } from '@/types';

export const DEMO_QUIZ_2: DemoQuestion[] = [
  {
    id: 'dq2-01',
    subject: 'AP Biology',
    topic: 'Cell Biology',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'During which phase of the cell cycle is DNA replicated?',
    options: [
      { id: 'a', content: 'G1 phase' },
      { id: 'b', content: 'S phase' },
      { id: 'c', content: 'G2 phase' },
      { id: 'd', content: 'M phase' },
    ],
    correctAnswerId: 'b',
    explanation:
      'DNA replication occurs during the Synthesis (S) phase of interphase. G1 is for cell growth and preparation. G2 is for final preparation before mitosis. M phase (mitotic phase) is when cell division occurs.',
    points: 1,
    tags: ['cell-cycle', 'DNA-replication', 'ap-biology'],
  },
  {
    id: 'dq2-02',
    subject: 'AP Chemistry',
    topic: 'Stoichiometry',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'In the reaction: 2H₂ + O₂ → 2H₂O\n\nHow many moles of water are produced when 4 moles of H₂ react completely?',
    options: [
      { id: 'a', content: '2 moles' },
      { id: 'b', content: '4 moles' },
      { id: 'c', content: '6 moles' },
      { id: 'd', content: '8 moles' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The molar ratio of H₂ to H₂O is 2:2 (or 1:1). If 4 moles of H₂ react, 4 moles of H₂O are produced.',
    points: 2,
    tags: ['stoichiometry', 'molar-ratios', 'ap-chemistry'],
  },
  {
    id: 'dq2-03',
    subject: 'AP Physics 1',
    topic: 'Newton\'s Laws',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'A net force of 30 N acts on an object with a mass of 6 kg. What is the acceleration of the object?',
    options: [
      { id: 'a', content: '3 m/s²' },
      { id: 'b', content: '4 m/s²' },
      { id: 'c', content: '5 m/s²' },
      { id: 'd', content: '180 m/s²' },
    ],
    correctAnswerId: 'c',
    explanation:
      "Newton's Second Law: F = ma → a = F/m = 30/6 = 5 m/s².",
    points: 1,
    tags: ['newtons-laws', 'force-mass-acceleration', 'ap-physics'],
  },
  {
    id: 'dq2-04',
    subject: 'AP Biology',
    topic: 'Genetics',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question:
      'Which process explains how a single gene can produce multiple protein variants?',
    options: [
      { id: 'a', content: 'DNA methylation' },
      { id: 'b', content: 'Alternative splicing of pre-mRNA' },
      { id: 'c', content: 'Transcription factor binding' },
      { id: 'd', content: 'Chromatin remodeling' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Alternative splicing allows different combinations of exons to be joined during mRNA processing, producing multiple distinct mRNAs (and therefore multiple protein variants) from a single gene. This is a key mechanism of eukaryotic gene regulation.',
    points: 2,
    tags: ['genetics', 'alternative-splicing', 'gene-expression', 'ap-biology'],
  },
  {
    id: 'dq2-05',
    subject: 'AP Chemistry',
    topic: 'Atomic Structure',
    category: 'AP_EXAM',
    difficulty: 'EASY',
    question:
      'An atom of carbon-14 has 6 protons. How many neutrons does it have?',
    options: [
      { id: 'a', content: '6' },
      { id: 'b', content: '7' },
      { id: 'c', content: '8' },
      { id: 'd', content: '14' },
    ],
    correctAnswerId: 'c',
    explanation:
      'The mass number (14) = protons + neutrons. Neutrons = 14 − 6 = 8.',
    points: 1,
    tags: ['atomic-structure', 'isotopes', 'neutrons', 'ap-chemistry'],
  },
  {
    id: 'dq2-06',
    subject: 'ACT Science',
    topic: 'Data Interpretation',
    category: 'ACT_PREP',
    difficulty: 'MEDIUM',
    question:
      'A researcher measures the rate of photosynthesis at various light intensities:\n\n200 lux → 4 μmol O₂/min\n400 lux → 7 μmol O₂/min\n600 lux → 9 μmol O₂/min\n800 lux → 9.5 μmol O₂/min\n\nAt high light intensities, what factor most likely limits photosynthesis?',
    options: [
      { id: 'a', content: 'Light availability' },
      { id: 'b', content: 'CO₂ concentration or enzyme capacity' },
      { id: 'c', content: 'Water temperature' },
      { id: 'd', content: 'Oxygen toxicity' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The rate plateaus near 800 lux — the system is no longer light-limited. Another factor has become limiting. In the Calvin cycle, CO₂ fixation by RuBisCO (an enzyme) can become the bottleneck when light is abundant. CO₂ concentration or enzyme capacity is the most likely limiting factor.',
    points: 2,
    tags: ['photosynthesis', 'limiting-factors', 'data-interpretation', 'act-science'],
  },
  {
    id: 'dq2-07',
    subject: 'AP Physics 1',
    topic: 'Energy',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'A 2 kg ball is held at rest at a height of 5 meters above the ground. Using g = 10 m/s², what is its gravitational potential energy?',
    options: [
      { id: 'a', content: '10 J' },
      { id: 'b', content: '50 J' },
      { id: 'c', content: '100 J' },
      { id: 'd', content: '200 J' },
    ],
    correctAnswerId: 'c',
    explanation:
      'PE = mgh = 2 × 10 × 5 = 100 J.',
    points: 1,
    tags: ['energy', 'gravitational-PE', 'ap-physics'],
  },
  {
    id: 'dq2-08',
    subject: 'AP Biology',
    topic: 'Evolution',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'Which statement best describes natural selection?',
    options: [
      { id: 'a', content: 'Organisms consciously develop traits they need to survive.' },
      { id: 'b', content: 'Individuals with heritable traits that improve survival and reproduction pass those traits to more offspring.' },
      { id: 'c', content: 'All members of a species evolve at the same rate.' },
      { id: 'd', content: 'Evolution only occurs through random genetic mutations with no environmental influence.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Natural selection acts on heritable variation: individuals with traits that improve fitness (survival + reproduction) produce more offspring, passing those traits to future generations. Option A incorrectly describes Lamarckian evolution. Options C and D mischaracterize the mechanism.',
    points: 1,
    tags: ['natural-selection', 'evolution', 'ap-biology'],
  },
  {
    id: 'dq2-09',
    subject: 'AP Chemistry',
    topic: 'Chemical Equilibrium',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question:
      'For the equilibrium reaction A + B ⇌ C + D, the reaction quotient Q is less than the equilibrium constant K. In which direction will the reaction shift?',
    options: [
      { id: 'a', content: 'To the left (toward reactants)' },
      { id: 'b', content: 'No shift — the system is already at equilibrium' },
      { id: 'c', content: 'To the right (toward products)' },
      { id: 'd', content: 'The direction cannot be determined without knowing concentrations' },
    ],
    correctAnswerId: 'c',
    explanation:
      'When Q < K, the ratio of products to reactants is less than at equilibrium — the reaction must produce more products. The reaction shifts to the right (forward direction) to reach equilibrium. When Q > K, it shifts left; when Q = K, no shift occurs.',
    points: 2,
    tags: ['equilibrium', 'reaction-quotient', 'ap-chemistry'],
  },
  {
    id: 'dq2-10',
    subject: 'AP Physics 1',
    topic: 'Waves',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'A wave has a frequency of 50 Hz and a wavelength of 4 meters. What is the wave speed?',
    options: [
      { id: 'a', content: '12.5 m/s' },
      { id: 'b', content: '46 m/s' },
      { id: 'c', content: '200 m/s' },
      { id: 'd', content: '54 m/s' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Wave speed v = frequency × wavelength = 50 Hz × 4 m = 200 m/s.',
    points: 1,
    tags: ['waves', 'wave-speed', 'ap-physics'],
  },
];
