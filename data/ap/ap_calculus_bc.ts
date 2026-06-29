import type { DemoQuestion } from '@/types';

export const AP_CALCULUS_BC: DemoQuestion[] = [
  {
    id: 'ap-calc-bc-01',
    subject: 'AP Calculus BC',
    topic: 'Series — Convergence',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question:
      'Which test would BEST determine whether the series Σ(1/n²) from n=1 to ∞ converges?',
    options: [
      { id: 'a', content: 'Ratio Test' },
      { id: 'b', content: 'p-Series Test' },
      { id: 'c', content: 'Alternating Series Test' },
      { id: 'd', content: 'Divergence Test' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Σ(1/nᵖ) is a p-series. It converges when p > 1. Here p = 2 > 1, so the series converges. The p-series test is the most direct approach.',
    points: 2,
    tags: ['series', 'p-series', 'convergence', 'ap-calc-bc'],
  },
  {
    id: 'ap-calc-bc-02',
    subject: 'AP Calculus BC',
    topic: 'Integration — By Parts',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question: 'Evaluate ∫ x · eˣ dx.',
    options: [
      { id: 'a', content: 'xeˣ + eˣ + C' },
      { id: 'b', content: 'xeˣ − eˣ + C' },
      { id: 'c', content: 'x²eˣ/2 + C' },
      { id: 'd', content: 'eˣ + C' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Integration by parts: ∫u dv = uv − ∫v du. Let u = x, dv = eˣ dx. Then du = dx, v = eˣ. Result: xeˣ − ∫eˣ dx = xeˣ − eˣ + C.',
    points: 2,
    tags: ['integration-by-parts', 'integrals', 'ap-calc-bc'],
  },
  {
    id: 'ap-calc-bc-03',
    subject: 'AP Calculus BC',
    topic: 'Parametric Equations',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question:
      'A curve is defined parametrically by x = t² and y = t³. What is dy/dx in terms of t?',
    options: [
      { id: 'a', content: '3t/2' },
      { id: 'b', content: '3t²/2t' },
      { id: 'c', content: '2t/3t²' },
      { id: 'd', content: '3t²' },
    ],
    correctAnswerId: 'a',
    explanation:
      'For parametric curves: dy/dx = (dy/dt)/(dx/dt). dx/dt = 2t, dy/dt = 3t². So dy/dx = 3t²/2t = 3t/2.',
    points: 2,
    tags: ['parametric', 'derivatives', 'ap-calc-bc'],
  },
  {
    id: 'ap-calc-bc-04',
    subject: 'AP Calculus BC',
    topic: 'Taylor Series',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question:
      'Which is the correct Taylor series expansion for eˣ centered at x = 0?',
    options: [
      { id: 'a', content: '1 + x + x²/2 + x³/6 + ...' },
      { id: 'b', content: '1 + x + x² + x³ + ...' },
      { id: 'c', content: 'x − x³/6 + x⁵/120 − ...' },
      { id: 'd', content: '1 − x²/2 + x⁴/24 − ...' },
    ],
    correctAnswerId: 'a',
    explanation:
      'The Maclaurin series (Taylor at 0) for eˣ is Σ(xⁿ/n!) = 1 + x + x²/2! + x³/3! + ... = 1 + x + x²/2 + x³/6 + ... Option C is sin(x) and D is cos(x).',
    points: 2,
    tags: ['taylor-series', 'maclaurin', 'series', 'ap-calc-bc'],
  },
  {
    id: 'ap-calc-bc-05',
    subject: 'AP Calculus BC',
    topic: 'Polar Coordinates',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question:
      'What is the area enclosed by one petal of the polar rose r = 2sin(2θ)?',
    options: [
      { id: 'a', content: 'π/2' },
      { id: 'b', content: 'π' },
      { id: 'c', content: '2π' },
      { id: 'd', content: 'π/4' },
    ],
    correctAnswerId: 'a',
    explanation:
      'Area = ½∫r² dθ. One petal of r = 2sin(2θ) spans θ from 0 to π/2. A = ½∫₀^(π/2) 4sin²(2θ) dθ = 2∫₀^(π/2) (1 − cos(4θ))/2 dθ = ∫₀^(π/2) (1 − cos(4θ))/1 dθ ... = π/2.',
    points: 2,
    tags: ['polar-coordinates', 'area', 'integration', 'ap-calc-bc'],
  },
  {
    id: 'ap-calc-bc-06',
    subject: 'AP Calculus BC',
    topic: "L'Hôpital's Rule",
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question: "Use L'Hôpital's Rule to evaluate lim(x→0) of (sin x)/x.",
    options: [
      { id: 'a', content: '0' },
      { id: 'b', content: '∞' },
      { id: 'c', content: '1' },
      { id: 'd', content: 'Undefined' },
    ],
    correctAnswerId: 'c',
    explanation:
      "Direct substitution gives 0/0 (indeterminate form). Apply L'Hôpital's: differentiate numerator and denominator. lim(x→0) cos(x)/1 = cos(0) = 1.",
    points: 2,
    tags: ["l'hopital", 'limits', 'ap-calc-bc'],
  },
  {
    id: 'ap-calc-bc-07',
    subject: 'AP Calculus BC',
    topic: 'Euler\'s Method',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question:
      "Using Euler's Method with step size h = 0.1, starting at y(0) = 1 with dy/dx = y, what is the approximation for y(0.1)?",
    options: [
      { id: 'a', content: '1.05' },
      { id: 'b', content: '1.10' },
      { id: 'c', content: '1.01' },
      { id: 'd', content: '1.20' },
    ],
    correctAnswerId: 'b',
    explanation:
      "Euler's method: y₁ = y₀ + h·f(x₀, y₀). Here f(x, y) = y, y₀ = 1, h = 0.1. y(0.1) ≈ 1 + 0.1·(1) = 1.1. (The exact value is e^0.1 ≈ 1.105, confirming the approximation.)",
    points: 2,
    tags: ["euler's-method", 'differential-equations', 'ap-calc-bc'],
  },
  {
    id: 'ap-calc-bc-08',
    subject: 'AP Calculus BC',
    topic: 'Arc Length',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question:
      'The formula for arc length of y = f(x) from x = a to x = b is:',
    options: [
      { id: 'a', content: '∫ₐᵇ √(1 + [f\'(x)]²) dx' },
      { id: 'b', content: '∫ₐᵇ [f\'(x)]² dx' },
      { id: 'c', content: '∫ₐᵇ f(x) dx' },
      { id: 'd', content: '∫ₐᵇ |f\'(x)| dx' },
    ],
    correctAnswerId: 'a',
    explanation:
      'Arc length formula: L = ∫ₐᵇ √(1 + [f\'(x)]²) dx. This derives from the Pythagorean theorem applied to infinitesimal segments ds = √(dx² + dy²).',
    points: 2,
    tags: ['arc-length', 'integration-applications', 'ap-calc-bc'],
  },
  {
    id: 'ap-calc-bc-09',
    subject: 'AP Calculus BC',
    topic: 'Logistic Growth',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'In a logistic growth model dP/dt = rP(1 − P/K), as P approaches the carrying capacity K, dP/dt:',
    options: [
      { id: 'a', content: 'Increases without bound' },
      { id: 'b', content: 'Approaches r' },
      { id: 'c', content: 'Approaches 0' },
      { id: 'd', content: 'Becomes negative' },
    ],
    correctAnswerId: 'c',
    explanation:
      'When P → K: dP/dt = rK(1 − K/K) = rK(0) = 0. The population growth rate slows to zero as it reaches the carrying capacity. Growth rate is maximum at P = K/2.',
    points: 2,
    tags: ['logistic-growth', 'differential-equations', 'ap-calc-bc'],
  },
  {
    id: 'ap-calc-bc-10',
    subject: 'AP Calculus BC',
    topic: 'Ratio Test',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question:
      'Using the Ratio Test on the series Σ(n!/3ⁿ), which conclusion follows?',
    options: [
      { id: 'a', content: 'Converges — the ratio limit is 0' },
      { id: 'b', content: 'Diverges — the ratio limit exceeds 1' },
      { id: 'c', content: 'Converges — the ratio limit is 1/3' },
      { id: 'd', content: 'Inconclusive — ratio limit equals 1' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Ratio test: L = lim |aₙ₊₁/aₙ|. aₙ₊₁/aₙ = [(n+1)!/3ⁿ⁺¹] / [n!/3ⁿ] = (n+1)/3 → ∞ as n → ∞. Since L > 1, the series diverges.',
    points: 2,
    tags: ['ratio-test', 'series', 'convergence', 'ap-calc-bc'],
  },
];
