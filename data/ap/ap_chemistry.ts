import type { DemoQuestion } from '@/types';

export const AP_CHEMISTRY: DemoQuestion[] = [
  {
    id: 'ap-chem-01',
    subject: 'AP Chemistry',
    topic: 'Atomic Structure — Electron Configuration',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      "Which is the correct ground-state electron configuration for Fe (iron, atomic number 26)?",
    options: [
      { id: 'a', content: '[Ar] 3d⁶ 4s²' },
      { id: 'b', content: '[Ar] 4s² 3d⁶' },
      { id: 'c', content: '[Ar] 4s² 4d⁶' },
      { id: 'd', content: '[Ne] 3s² 3p⁶ 3d⁶ 4s²' },
    ],
    correctAnswerId: 'a',
    explanation:
      '[Ar] represents the argon core (18 electrons). Fe fills: 4s² (2e) + 3d⁶ (6e) = 26 total. Options A and B are equivalent in meaning; A uses the standard orbital energy filling order. Option C incorrectly uses 4d instead of 3d.',
    points: 2,
    tags: ['electron-configuration', 'atomic-structure', 'ap-chemistry'],
  },
  {
    id: 'ap-chem-02',
    subject: 'AP Chemistry',
    topic: 'Chemical Bonding — Lewis Structures',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'How many lone pairs of electrons are on the central nitrogen atom in NH₃?',
    options: [
      { id: 'a', content: '0' },
      { id: 'b', content: '1' },
      { id: 'c', content: '2' },
      { id: 'd', content: '3' },
    ],
    correctAnswerId: 'b',
    explanation:
      'N has 5 valence electrons. Three are used to bond with 3 H atoms (one bond each, sharing 1 e from N per bond). Remaining: 5 − 3 = 2 electrons = 1 lone pair on N.',
    points: 1,
    tags: ['lewis-structures', 'lone-pairs', 'bonding', 'ap-chemistry'],
  },
  {
    id: 'ap-chem-03',
    subject: 'AP Chemistry',
    topic: 'Thermodynamics — Gibbs Free Energy',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question:
      'A reaction has ΔH = −80 kJ/mol and ΔS = −200 J/(mol·K). At what temperature (in Kelvin) does the reaction transition from spontaneous to non-spontaneous?',
    options: [
      { id: 'a', content: '100 K' },
      { id: 'b', content: '200 K' },
      { id: 'c', content: '400 K' },
      { id: 'd', content: '600 K' },
    ],
    correctAnswerId: 'c',
    explanation:
      'ΔG = ΔH − TΔS = 0 at transition. T = ΔH/ΔS = (−80,000 J/mol) / (−200 J/(mol·K)) = 400 K. Below 400 K: ΔG < 0 (spontaneous); above 400 K: ΔG > 0 (non-spontaneous).',
    points: 2,
    tags: ['gibbs-free-energy', 'thermodynamics', 'spontaneity', 'ap-chemistry'],
  },
  {
    id: 'ap-chem-04',
    subject: 'AP Chemistry',
    topic: 'Kinetics — Rate Laws',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question:
      'For the reaction 2A + B → products, doubling [A] quadruples the rate, while doubling [B] doubles the rate. What is the overall reaction order?',
    options: [
      { id: 'a', content: '2nd order' },
      { id: 'b', content: '3rd order' },
      { id: 'c', content: '4th order' },
      { id: 'd', content: '1st order' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Doubling [A] quadruples the rate: rate ∝ [A]², so order in A = 2. Doubling [B] doubles the rate: rate ∝ [B]¹, so order in B = 1. Rate = k[A]²[B]. Overall order = 2 + 1 = 3.',
    points: 2,
    tags: ['rate-laws', 'kinetics', 'reaction-order', 'ap-chemistry'],
  },
  {
    id: 'ap-chem-05',
    subject: 'AP Chemistry',
    topic: 'Acid-Base Equilibrium — pH',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'What is the pH of a 0.01 M HCl solution? (Assume complete dissociation.)',
    options: [
      { id: 'a', content: '1' },
      { id: 'b', content: '2' },
      { id: 'c', content: '12' },
      { id: 'd', content: '0.01' },
    ],
    correctAnswerId: 'b',
    explanation:
      'HCl is a strong acid that dissociates completely: [H⁺] = 0.01 M = 1×10⁻². pH = −log[H⁺] = −log(10⁻²) = 2.',
    points: 1,
    tags: ['pH', 'acid-base', 'strong-acids', 'ap-chemistry'],
  },
  {
    id: 'ap-chem-06',
    subject: 'AP Chemistry',
    topic: 'Electrochemistry',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question:
      'In a galvanic cell, where does oxidation occur?',
    options: [
      { id: 'a', content: 'At the cathode' },
      { id: 'b', content: 'At the anode' },
      { id: 'c', content: 'In the salt bridge' },
      { id: 'd', content: 'At both electrodes simultaneously' },
    ],
    correctAnswerId: 'b',
    explanation:
      'In any electrochemical cell (galvanic or electrolytic): oxidation occurs at the anode, reduction at the cathode. Mnemonic: "An Ox, Red Cat" (Anode = Oxidation, Cathode = Reduction).',
    points: 1,
    tags: ['electrochemistry', 'galvanic-cell', 'redox', 'ap-chemistry'],
  },
  {
    id: 'ap-chem-07',
    subject: 'AP Chemistry',
    topic: 'Intermolecular Forces',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'Which substance has the highest boiling point, primarily due to hydrogen bonding?',
    options: [
      { id: 'a', content: 'CH₄ (methane)' },
      { id: 'b', content: 'HF (hydrogen fluoride)' },
      { id: 'c', content: 'Ne (neon)' },
      { id: 'd', content: 'Cl₂ (chlorine gas)' },
    ],
    correctAnswerId: 'b',
    explanation:
      'HF has hydrogen bonding (H bonded to highly electronegative F), which is the strongest intermolecular force among these options. CH₄ and Ne have only dispersion forces. Cl₂ has dispersion forces (stronger than Ne due to more electrons, but no H-bonding). HF\'s H-bonding gives it the highest boiling point.',
    points: 2,
    tags: ['intermolecular-forces', 'hydrogen-bonding', 'boiling-point', 'ap-chemistry'],
  },
  {
    id: 'ap-chem-08',
    subject: 'AP Chemistry',
    topic: 'Equilibrium — Le Chatelier\'s Principle',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'For the exothermic reaction N₂(g) + 3H₂(g) ⇌ 2NH₃(g), increasing the temperature will:',
    options: [
      { id: 'a', content: 'Shift equilibrium toward products, increasing [NH₃]' },
      { id: 'b', content: 'Shift equilibrium toward reactants, decreasing [NH₃]' },
      { id: 'c', content: 'Have no effect on the equilibrium position' },
      { id: 'd', content: 'Increase the rate of the forward reaction only' },
    ],
    correctAnswerId: 'b',
    explanation:
      "For exothermic reactions, heat is a product. Increasing temperature adds a stress that the system resists by shifting left (toward reactants), consuming heat. This decreases [NH₃] and increases Kc's denominator — Kc decreases with increasing T for exothermic reactions.",
    points: 2,
    tags: ["le-chatelier", 'equilibrium', 'temperature-effects', 'ap-chemistry'],
  },
  {
    id: 'ap-chem-09',
    subject: 'AP Chemistry',
    topic: 'Periodic Trends — Ionization Energy',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'Which element has the highest first ionization energy?',
    options: [
      { id: 'a', content: 'Na (sodium)' },
      { id: 'b', content: 'Mg (magnesium)' },
      { id: 'c', content: 'Cl (chlorine)' },
      { id: 'd', content: 'Ne (neon)' },
    ],
    correctAnswerId: 'd',
    explanation:
      'First ionization energy increases across a period (left to right) and decreases down a group. Noble gases have the highest ionization energies in their period because they have complete, stable electron configurations. Ne (period 2 noble gas) has the highest first ionization energy among these options.',
    points: 1,
    tags: ['ionization-energy', 'periodic-trends', 'ap-chemistry'],
  },
  {
    id: 'ap-chem-10',
    subject: 'AP Chemistry',
    topic: 'Stoichiometry — Limiting Reagent',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question:
      'In the reaction 2H₂ + O₂ → 2H₂O, if 6 moles of H₂ and 2 moles of O₂ are available, which is the limiting reagent and how many moles of water are produced?',
    options: [
      { id: 'a', content: 'H₂ is limiting; 6 moles H₂O' },
      { id: 'b', content: 'O₂ is limiting; 4 moles H₂O' },
      { id: 'c', content: 'O₂ is limiting; 6 moles H₂O' },
      { id: 'd', content: 'H₂ is limiting; 4 moles H₂O' },
    ],
    correctAnswerId: 'b',
    explanation:
      '2 mol O₂ requires 4 mol H₂ (ratio 2:1). We have 6 mol H₂ — more than enough. O₂ is the limiting reagent. Moles of H₂O = 2 × moles O₂ = 2 × 2 = 4 moles.',
    points: 2,
    tags: ['limiting-reagent', 'stoichiometry', 'ap-chemistry'],
  },
];
