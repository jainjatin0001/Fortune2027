export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'EduReach';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
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
    { label: 'Python', href: '/coding/python' },
    { label: 'Machine Learning', href: '/coding/machine-learning' },
    { label: 'Data Science', href: '/coding/data-science' },
    { label: 'Web Development', href: '/coding/web-development' },
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
      'I improved my SAT score by 240 points after 3 months on EduReach. The adaptive practice system knew exactly where I was weak and focused my prep there.',
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
      "My ACT composite jumped from 28 to 34. EduReach's mock tests were nearly identical to the real thing — I felt completely prepared on test day.",
    score: '34 Composite',
    improvement: '+6 points',
    rating: 5,
  },
];

export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    billingPeriod: 'monthly' as const,
    features: [
      '3 practice tests per month',
      'Access to free courses',
      'Basic progress tracking',
      'Community forum access',
    ],
    ctaLabel: 'Get Started Free',
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 19.99,
    billingPeriod: 'monthly' as const,
    isPopular: true,
    features: [
      'Unlimited practice tests',
      'All SAT, ACT & AP content',
      'Advanced analytics',
      'Personalized study plan',
      'Progress reports',
      'Email support',
    ],
    ctaLabel: 'Start Plus Plan',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 39.99,
    billingPeriod: 'monthly' as const,
    features: [
      'Everything in Plus',
      'All coding courses',
      'Live Q&A sessions',
      'Certificate of completion',
      'Parent dashboard',
      'Priority support',
      'Offline access',
    ],
    ctaLabel: 'Start Pro Plan',
  },
];

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
