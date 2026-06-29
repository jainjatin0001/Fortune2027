import type { DemoQuestion } from '@/types';

export const AP_PHYSICS_1: DemoQuestion[] = [
  {
    id: 'ap-phys1-01',
    subject: 'AP Physics 1',
    topic: 'Kinematics — Projectile Motion',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'A ball is launched horizontally from a cliff at 20 m/s. Using g = 10 m/s², if it takes 3 seconds to hit the ground, how far horizontally does it travel?',
    options: [
      { id: 'a', content: '30 m' },
      { id: 'b', content: '45 m' },
      { id: 'c', content: '60 m' },
      { id: 'd', content: '90 m' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Horizontal motion is uniform (no air resistance). x = v₀ₓ · t = 20 m/s × 3 s = 60 m. Vertical: h = ½gt² = ½(10)(9) = 45 m (the cliff height, consistent).',
    points: 2,
    tags: ['kinematics', 'projectile-motion', 'horizontal-motion', 'ap-physics'],
  },
  {
    id: 'ap-phys1-02',
    subject: 'AP Physics 1',
    topic: "Newton's Laws — Friction",
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'A 10 kg box is pushed across a horizontal surface with an applied force of 50 N. The coefficient of kinetic friction is 0.3. Using g = 10 m/s², what is the net force on the box?',
    options: [
      { id: 'a', content: '20 N' },
      { id: 'b', content: '30 N' },
      { id: 'c', content: '50 N' },
      { id: 'd', content: '80 N' },
    ],
    correctAnswerId: 'a',
    explanation:
      'Normal force N = mg = 10 × 10 = 100 N. Friction force f = μₖN = 0.3 × 100 = 30 N. Net force = F_applied − f = 50 − 30 = 20 N.',
    points: 2,
    tags: ['friction', 'newtons-laws', 'net-force', 'ap-physics'],
  },
  {
    id: 'ap-phys1-03',
    subject: 'AP Physics 1',
    topic: 'Conservation of Energy',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'A 5 kg ball is dropped from a height of 8 m. Using g = 10 m/s², what is its speed just before hitting the ground? (Ignore air resistance.)',
    options: [
      { id: 'a', content: '8 m/s' },
      { id: 'b', content: '12 m/s' },
      { id: 'c', content: '16 m/s' },
      { id: 'd', content: '20 m/s' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Conservation of energy: mgh = ½mv². Solving: v = √(2gh) = √(2 × 10 × 8) = √160 ≈ 12.6 m/s ≈ 12 m/s (closest answer is 12 m/s).',
    points: 2,
    tags: ['conservation-of-energy', 'kinematics', 'ap-physics'],
  },
  {
    id: 'ap-phys1-04',
    subject: 'AP Physics 1',
    topic: 'Momentum — Conservation',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'A 4 kg cart moving at 6 m/s collides with a stationary 2 kg cart and they stick together. What is their combined velocity after the collision?',
    options: [
      { id: 'a', content: '2 m/s' },
      { id: 'b', content: '3 m/s' },
      { id: 'c', content: '4 m/s' },
      { id: 'd', content: '6 m/s' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Conservation of momentum: m₁v₁ + m₂v₂ = (m₁ + m₂)v_f. (4)(6) + (2)(0) = (6)v_f. 24 = 6v_f. v_f = 4 m/s.',
    points: 2,
    tags: ['momentum', 'inelastic-collision', 'conservation', 'ap-physics'],
  },
  {
    id: 'ap-phys1-05',
    subject: 'AP Physics 1',
    topic: 'Rotational Motion — Torque',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'A force of 40 N is applied perpendicularly to a wrench at a distance of 0.5 m from the pivot. What is the torque?',
    options: [
      { id: 'a', content: '10 N·m' },
      { id: 'b', content: '20 N·m' },
      { id: 'c', content: '40 N·m' },
      { id: 'd', content: '80 N·m' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Torque τ = r × F × sin(θ). When force is perpendicular (θ = 90°), sin(90°) = 1. τ = 0.5 × 40 = 20 N·m.',
    points: 1,
    tags: ['torque', 'rotational-motion', 'ap-physics'],
  },
  {
    id: 'ap-phys1-06',
    subject: 'AP Physics 1',
    topic: 'Simple Harmonic Motion',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'A mass-spring system has a period of 2 seconds. If the mass is quadrupled (while the spring constant remains the same), what is the new period?',
    options: [
      { id: 'a', content: '1 second' },
      { id: 'b', content: '2 seconds' },
      { id: 'c', content: '4 seconds' },
      { id: 'd', content: '8 seconds' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Period T = 2π√(m/k). If mass is quadrupled: T_new = 2π√(4m/k) = 2 × 2π√(m/k) = 2T = 2 × 2 = 4 seconds. Period is proportional to √m.',
    points: 2,
    tags: ['simple-harmonic-motion', 'spring', 'period', 'ap-physics'],
  },
  {
    id: 'ap-phys1-07',
    subject: 'AP Physics 1',
    topic: 'Electric Charge & Coulomb\'s Law',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question:
      'Two point charges Q₁ and Q₂ are separated by distance r. If the distance between them is tripled (3r), how does the electrostatic force change?',
    options: [
      { id: 'a', content: 'Decreases by a factor of 3' },
      { id: 'b', content: 'Decreases by a factor of 9' },
      { id: 'c', content: 'Increases by a factor of 3' },
      { id: 'd', content: 'Increases by a factor of 9' },
    ],
    correctAnswerId: 'b',
    explanation:
      "Coulomb's Law: F = kQ₁Q₂/r². If distance becomes 3r: F_new = kQ₁Q₂/(3r)² = kQ₁Q₂/9r² = F/9. The force decreases by a factor of 9 (inverse square law).",
    points: 2,
    tags: ["coulomb's-law", 'electrostatics', 'inverse-square', 'ap-physics'],
  },
  {
    id: 'ap-phys1-08',
    subject: 'AP Physics 1',
    topic: 'Circuits — Ohm\'s Law & Series/Parallel',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'Two resistors of 6 Ω and 12 Ω are connected in parallel. What is the equivalent resistance?',
    options: [
      { id: 'a', content: '2 Ω' },
      { id: 'b', content: '4 Ω' },
      { id: 'c', content: '6 Ω' },
      { id: 'd', content: '18 Ω' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Parallel: 1/R_eq = 1/R₁ + 1/R₂ = 1/6 + 1/12 = 2/12 + 1/12 = 3/12 = 1/4. Therefore R_eq = 4 Ω.',
    points: 2,
    tags: ['circuits', 'parallel-resistors', "ohm's-law", 'ap-physics'],
  },
  {
    id: 'ap-phys1-09',
    subject: 'AP Physics 1',
    topic: 'Waves — Wave Properties',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'Two waves interfere such that they are perfectly out of phase (180° phase difference) and have equal amplitudes. The result is:',
    options: [
      { id: 'a', content: 'Constructive interference — amplitude doubles' },
      { id: 'b', content: 'Destructive interference — net amplitude is zero' },
      { id: 'c', content: 'Standing wave formation' },
      { id: 'd', content: 'Wave refraction' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Destructive interference occurs when two waves are 180° out of phase. Equal amplitudes completely cancel: net displacement = A − A = 0. Constructive interference occurs when waves are in phase (0°) and amplitudes add.',
    points: 1,
    tags: ['wave-interference', 'destructive-interference', 'waves', 'ap-physics'],
  },
  {
    id: 'ap-phys1-10',
    subject: 'AP Physics 1',
    topic: 'Gravity — Universal Gravitation',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question:
      "According to Newton's Law of Universal Gravitation, if the mass of one object doubles and the distance between the two objects also doubles, the gravitational force:",
    options: [
      { id: 'a', content: 'Doubles' },
      { id: 'b', content: 'Halves' },
      { id: 'c', content: 'Stays the same' },
      { id: 'd', content: 'Quadruples' },
    ],
    correctAnswerId: 'b',
    explanation:
      'F = Gm₁m₂/r². If m₁ doubles and r doubles: F_new = G(2m₁)m₂/(2r)² = 2Gm₁m₂/4r² = Gm₁m₂/2r² = F/2. The force is halved.',
    points: 2,
    tags: ['universal-gravitation', 'gravity', 'ap-physics'],
  },
];
