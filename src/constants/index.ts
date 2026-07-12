export const APP_NAME = 'Delta Tutors';

// Resolve the canonical site URL. Prefer an explicit env var; on Vercel fall
// back to the auto-provided production domain so localhost never leaks into
// production metadata / sitemap / robots. Only default to localhost in dev.
const PRODUCTION_URL = 'https://www.deltatutors.us';

function resolveAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_ENV === 'production') return PRODUCTION_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.NEXT_PUBLIC_VERCEL_URL)
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  return 'http://localhost:3000';
}

export const APP_URL = resolveAppUrl();
export const APP_DESCRIPTION =
  'Premium SAT, ACT, AP, and Coding prep platform for students in the United States and Canada.';

export const NAV_LINKS = [
  {
    label: 'Courses',
    href: '/courses',
    children: [
      { label: 'All Courses', href: '/courses' },
      { label: 'SAT Preparation', href: '/sat-prep' },
      { label: 'ACT Preparation', href: '/act-prep' },
      { label: 'AP Exams', href: '/ap-prep' },
      { label: 'High School', href: '/subjects' },
      { label: 'Coding', href: '/coding' },
    ],
  },
  { label: 'SAT Prep', href: '/sat-prep' },
  { label: 'ACT Prep', href: '/act-prep' },
  { label: 'AP Exams', href: '/ap-prep' },
  { label: 'Coding', href: '/coding' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
] as const;

export const FOOTER_LINKS = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  testPrep: [
    { label: 'SAT Preparation', href: '/sat-prep' },
    { label: 'ACT Preparation', href: '/act-prep' },
    { label: 'AP Exams', href: '/ap-prep' },
    { label: 'Practice Tests', href: '/practice' },
  ],
  coding: [
    { label: 'Python', href: '/coding' },
    { label: 'Machine Learning', href: '/coding' },
    { label: 'Data Science', href: '/coding' },
    { label: 'Web Development', href: '/coding' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Accessibility', href: '/accessibility' },
  ],
};

export const STATS = [
  { value: '250,000+', label: 'Students Enrolled' },
  { value: '98%', label: 'Score Improvement' },
  { value: '500+', label: 'Practice Tests' },
  { value: '4.9/5', label: 'Average Rating' },
];

export const TESTIMONIALS = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'SAT Student',
    school: 'Westfield High School, NJ',
    avatarUrl: '/images/instructors/avatar-1.jpg',
    content:
      'I improved my SAT score by 240 points after 3 months on Delta Tutors. The adaptive practice system knew exactly where I was weak and focused my prep there.',
    score: '1580',
    improvement: '+240',
    rating: 5,
  },
  {
    id: '2',
    name: 'Marcus Thompson',
    role: 'AP Student',
    school: 'Riverside Academy, CA',
    avatarUrl: '/images/instructors/avatar-2.jpg',
    content:
      'Passed 4 AP exams with 5s this year. The structured curriculum and detailed explanations made complex topics click for me.',
    score: '5 on 4 APs',
    improvement: '5s across the board',
    rating: 5,
  },
  {
    id: '3',
    name: 'Priya Patel',
    role: 'Coding Student',
    school: 'Toronto District School Board, ON',
    avatarUrl: '/images/instructors/avatar-3.jpg',
    content:
      'Started with zero coding experience and landed my first internship after the Python + Data Science track. The projects were real-world and the feedback was excellent.',
    score: 'First Internship',
    improvement: 'Zero to hired',
    rating: 5,
  },
  {
    id: '4',
    name: 'James Okoye',
    role: 'ACT Student',
    school: 'Lincoln Prep, TX',
    avatarUrl: '/images/instructors/avatar-4.jpg',
    content:
      "My ACT composite jumped from 28 to 34. Delta Tutors' mock tests were nearly identical to the real thing — I felt completely prepared on test day.",
    score: '34 Composite',
    improvement: '+6 points',
    rating: 5,
  },
];

export const PRICING_PLANS = [
  {
    id: 'foundation',
    name: 'Foundation',
    price: Number(process.env.NEXT_PUBLIC_PRICE_FOUNDATION ?? 249),
    description: 'For students just starting their prep journey',
    billingPeriod: 'monthly' as const,
    features: [
      { text: '4 live 1:1 sessions/month (1 hr each)', included: true },
      { text: 'Email doubt solving (48 hr response)', included: true },
      { text: 'Monthly progress snapshot', included: true },
      { text: 'Access to study resource library', included: true },
      { text: '1 free diagnostic session to start', included: true },
      { text: 'Priority scheduling', included: false },
      { text: 'Mock tests included', included: false },
      { text: 'Score guarantee', included: false },
    ],
  },
  {
    id: 'scholar',
    name: 'Scholar',
    price: Number(process.env.NEXT_PUBLIC_PRICE_SCHOLAR ?? 449),
    description: 'The complete prep experience for serious students',
    billingPeriod: 'monthly' as const,
    isPopular: true,
    features: [
      { text: '8 live 1:1 sessions/month (1 hr each)', included: true },
      { text: 'Priority scheduling (48 hr guarantee)', included: true },
      { text: 'WhatsApp doubt solving (24 hr response)', included: true },
      { text: 'Weekly progress report + parent update', included: true },
      { text: '1 full mock test per month', included: true },
      { text: 'Custom practice sets after every session', included: true },
      { text: 'Access to study resource library', included: true },
      { text: 'Score guarantee', included: false },
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: Number(process.env.NEXT_PUBLIC_PRICE_ELITE ?? 649),
    description: 'Maximum support for top-score targets & Ivy goals',
    billingPeriod: 'monthly' as const,
    features: [
      { text: '12 live 1:1 sessions/month (1 hr each)', included: true },
      { text: 'Easy scheduling — confirmed within 24 hrs', included: true },
      { text: 'Instant doubt solving — anytime via WhatsApp', included: true, highlight: true },
      { text: 'Weekly detailed progress report', included: true },
      { text: '2 full mock tests per month + review', included: true },
      { text: 'Custom study roadmap (updated monthly)', included: true },
      { text: 'College application test strategy call', included: true },
      { text: 'Score improvement guarantee', included: true, bold: true },
    ],
  },
];

export const HOURLY_RATE = Number(process.env.NEXT_PUBLIC_PRICE_HOURLY ?? 80);

export const SUBJECT_COLORS: Record<string, string> = {
  SAT_PREP: 'var(--color-sat)',
  ACT_PREP: 'var(--color-act)',
  AP_EXAM: 'var(--color-ap)',
  CODING: 'var(--color-coding)',
  HIGH_SCHOOL: 'var(--color-highschool)',
};

export const ROUTES = {
  home: '/',
  courses: '/courses',
  satPrep: '/sat-prep',
  actPrep: '/act-prep',
  apPrep: '/ap-prep',
  coding: '/coding',
  subjects: '/subjects',
  blog: '/blog',
  about: '/about',
  contact: '/contact',
  pricing: '/pricing',
  signIn: '/sign-in',
  signUp: '/sign-up',
  dashboard: '/dashboard',
  profile: '/profile',
  settings: '/settings',
  admin: '/admin',
} as const;
