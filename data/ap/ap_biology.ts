import type { DemoQuestion } from '@/types';

export const AP_BIOLOGY: DemoQuestion[] = [
  {
    id: 'ap-bio-01',
    subject: 'AP Biology',
    topic: 'Macromolecules — Proteins',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      "Which level of protein structure describes the specific sequence of amino acids in a polypeptide chain?",
    options: [
      { id: 'a', content: 'Primary structure' },
      { id: 'b', content: 'Secondary structure' },
      { id: 'c', content: 'Tertiary structure' },
      { id: 'd', content: 'Quaternary structure' },
    ],
    correctAnswerId: 'a',
    explanation:
      'Primary structure is the linear sequence of amino acids, held together by peptide bonds. Secondary structure involves alpha-helices and beta-sheets (H-bonds). Tertiary is the 3D shape of a single polypeptide. Quaternary involves multiple polypeptide subunits.',
    points: 1,
    tags: ['proteins', 'protein-structure', 'macromolecules', 'ap-biology'],
  },
  {
    id: 'ap-bio-02',
    subject: 'AP Biology',
    topic: 'Photosynthesis — Light Reactions',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'In the light-dependent reactions of photosynthesis, water molecules are split. What is the correct description of this process?',
    options: [
      { id: 'a', content: 'Oxidation of water releases CO₂, which enters the Calvin cycle' },
      { id: 'b', content: 'Photolysis of water at Photosystem II releases O₂, electrons, and H⁺' },
      { id: 'c', content: 'Water is split at Photosystem I to produce ATP' },
      { id: 'd', content: 'Water molecules donate electrons to NADP⁺ directly' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Water photolysis occurs at Photosystem II: 2H₂O → 4H⁺ + 4e⁻ + O₂. The released O₂ is a byproduct. Electrons replace those lost by excited chlorophyll P680. H⁺ ions contribute to the proton gradient that drives ATP synthase.',
    points: 2,
    tags: ['photosynthesis', 'light-reactions', 'photosystem-II', 'ap-biology'],
  },
  {
    id: 'ap-bio-03',
    subject: 'AP Biology',
    topic: 'Cell Division — Mitosis',
    category: 'AP_EXAM',
    difficulty: 'EASY',
    question:
      'During which phase of mitosis do chromosomes line up along the metaphase plate?',
    options: [
      { id: 'a', content: 'Prophase' },
      { id: 'b', content: 'Metaphase' },
      { id: 'c', content: 'Anaphase' },
      { id: 'd', content: 'Telophase' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Metaphase: chromosomes align along the cell equator (metaphase plate), attached to spindle fibers from opposite poles. Prophase: chromatin condenses. Anaphase: sister chromatids separate. Telophase: nuclear envelopes reform.',
    points: 1,
    tags: ['mitosis', 'cell-division', 'metaphase', 'ap-biology'],
  },
  {
    id: 'ap-bio-04',
    subject: 'AP Biology',
    topic: 'Genetics — Mendelian Inheritance',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'In a cross between two heterozygous parents (Aa × Aa), what fraction of the offspring will be homozygous dominant (AA)?',
    options: [
      { id: 'a', content: '1/4' },
      { id: 'b', content: '1/2' },
      { id: 'c', content: '3/4' },
      { id: 'd', content: '0' },
    ],
    correctAnswerId: 'a',
    explanation:
      'Punnett square for Aa × Aa: AA (1/4), Aa (2/4), aa (1/4). Phenotypic ratio = 3:1. Genotypic ratio = 1:2:1. Only 1/4 of offspring are homozygous dominant (AA).',
    points: 1,
    tags: ['mendelian-genetics', 'punnett-square', 'inheritance', 'ap-biology'],
  },
  {
    id: 'ap-bio-05',
    subject: 'AP Biology',
    topic: 'Cell Membrane — Osmosis',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'A cell is placed in a hypotonic solution. What will happen to the cell?',
    options: [
      { id: 'a', content: 'Water will leave the cell; the cell will shrink (crenate)' },
      { id: 'b', content: 'Water will enter the cell; the cell may swell or burst (lyse)' },
      { id: 'c', content: 'No net movement of water will occur' },
      { id: 'd', content: 'Solutes will enter the cell to equalize concentration' },
    ],
    correctAnswerId: 'b',
    explanation:
      'In a hypotonic solution (lower solute concentration outside than inside), water moves by osmosis from outside into the cell. Animal cells swell and may lyse. Plant cells swell but are protected by the cell wall, becoming turgid. A hypertonic solution causes shrinkage.',
    points: 1,
    tags: ['osmosis', 'cell-membrane', 'tonicity', 'ap-biology'],
  },
  {
    id: 'ap-bio-06',
    subject: 'AP Biology',
    topic: 'Ecology — Trophic Levels',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'Only about 10% of energy is transferred from one trophic level to the next. This is known as:',
    options: [
      { id: 'a', content: 'Carrying capacity' },
      { id: 'b', content: 'The 10% rule (ecological efficiency)' },
      { id: 'c', content: 'Biomagnification' },
      { id: 'd', content: 'The competitive exclusion principle' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The 10% rule states that approximately 10% of energy at one trophic level is available to the next. Most energy is lost as heat (respiration) or remains in indigestible material. This limits food chain length and explains why biomass pyramids narrow sharply.',
    points: 1,
    tags: ['ecology', 'trophic-levels', 'energy-transfer', 'ap-biology'],
  },
  {
    id: 'ap-bio-07',
    subject: 'AP Biology',
    topic: 'Molecular Biology — DNA Replication',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'Why is one strand of DNA synthesized continuously (the leading strand) while the other is synthesized in fragments (the lagging strand)?',
    options: [
      { id: 'a', content: 'The two template strands have different base compositions' },
      { id: 'b', content: 'DNA polymerase can only add nucleotides in the 5\'→3\' direction, but the template strands run antiparallel' },
      { id: 'c', content: 'The lagging strand lacks the enzyme primase' },
      { id: 'd', content: 'The replication fork moves too quickly for continuous synthesis on both strands' },
    ],
    correctAnswerId: 'b',
    explanation:
      "DNA polymerase synthesizes in the 5'→3' direction only. Since both template strands are antiparallel, one strand (leading) runs 3'→5' allowing continuous synthesis. The other (lagging) runs 5'→3' at the fork — synthesis must occur backward in Okazaki fragments, each initiated by a new primer.",
    points: 2,
    tags: ['dna-replication', 'okazaki-fragments', 'leading-lagging', 'ap-biology'],
  },
  {
    id: 'ap-bio-08',
    subject: 'AP Biology',
    topic: 'Nervous System — Action Potential',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question:
      'During an action potential, what causes the rapid depolarization phase?',
    options: [
      { id: 'a', content: 'Rapid efflux of K⁺ ions out of the neuron' },
      { id: 'b', content: 'Rapid influx of Na⁺ ions into the neuron' },
      { id: 'c', content: 'Cl⁻ ions entering the neuron' },
      { id: 'd', content: 'Na⁺/K⁺ ATPase pump activity' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Depolarization: voltage-gated Na⁺ channels open → Na⁺ rushes in (high outside concentration + negative membrane potential). Membrane potential shifts from −70 mV toward +30 mV. Repolarization follows when K⁺ channels open and K⁺ flows out.',
    points: 2,
    tags: ['action-potential', 'nervous-system', 'sodium-channels', 'ap-biology'],
  },
  {
    id: 'ap-bio-09',
    subject: 'AP Biology',
    topic: 'Evolution — Hardy-Weinberg',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question:
      'In a Hardy-Weinberg equilibrium population, if the frequency of the recessive allele (q) is 0.3, what is the frequency of homozygous dominant individuals (p²)?',
    options: [
      { id: 'a', content: '0.09' },
      { id: 'b', content: '0.42' },
      { id: 'c', content: '0.49' },
      { id: 'd', content: '0.70' },
    ],
    correctAnswerId: 'c',
    explanation:
      'p + q = 1, so p = 1 − 0.3 = 0.7. Frequency of homozygous dominant (AA) = p² = 0.7² = 0.49. Frequency of homozygous recessive (aa) = q² = 0.09. Heterozygote frequency = 2pq = 2(0.7)(0.3) = 0.42.',
    points: 2,
    tags: ['hardy-weinberg', 'population-genetics', 'evolution', 'ap-biology'],
  },
  {
    id: 'ap-bio-10',
    subject: 'AP Biology',
    topic: 'Cellular Respiration — ATP Production',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'Which stage of cellular respiration produces the most ATP per glucose molecule?',
    options: [
      { id: 'a', content: 'Glycolysis' },
      { id: 'b', content: 'Pyruvate oxidation' },
      { id: 'c', content: 'Krebs cycle (citric acid cycle)' },
      { id: 'd', content: 'Oxidative phosphorylation (electron transport chain + chemiosmosis)' },
    ],
    correctAnswerId: 'd',
    explanation:
      'Glycolysis: 2 ATP net. Krebs cycle: 2 ATP directly. Oxidative phosphorylation via the ETC: ~32 ATP (using NADH and FADH₂ as electron donors). The ETC/chemiosmosis accounts for ~90% of ATP from aerobic respiration.',
    points: 1,
    tags: ['cellular-respiration', 'ATP', 'electron-transport-chain', 'ap-biology'],
  },
];
