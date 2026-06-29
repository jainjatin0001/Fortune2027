import { AP_CALCULUS_AB } from './ap_calculus_ab';
import { AP_CALCULUS_BC } from './ap_calculus_bc';
import { AP_CHEMISTRY } from './ap_chemistry';
import { AP_BIOLOGY } from './ap_biology';
import { AP_US_HISTORY } from './ap_us_history';
import { AP_PHYSICS_1 } from './ap_physics_1';
import { AP_ENGLISH_LITERATURE } from './ap_english_literature';
import type { DemoQuestion } from '@/types';

export interface APSubject {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  questions: DemoQuestion[];
  timeLimit: number; // seconds
  badge: string; // color hex
  icon: string; // emoji
  topics: string[];
}

export const AP_SUBJECTS: APSubject[] = [
  {
    id: 'ap-calculus-ab',
    title: 'AP Calculus AB',
    shortTitle: 'Calc AB',
    description: 'Limits, derivatives, integrals, and the Fundamental Theorem of Calculus',
    questions: AP_CALCULUS_AB,
    timeLimit: 1800,
    badge: '#7c3aed',
    icon: '∫',
    topics: ['Limits', 'Derivatives', 'Integrals', 'Applications', 'Theorems'],
  },
  {
    id: 'ap-calculus-bc',
    title: 'AP Calculus BC',
    shortTitle: 'Calc BC',
    description: 'All of Calc AB plus series, parametric equations, polar coordinates, and more',
    questions: AP_CALCULUS_BC,
    timeLimit: 1800,
    badge: '#5b21b6',
    icon: 'Σ',
    topics: ['Series', 'Integration by Parts', 'Parametric', 'Taylor Series', 'Polar'],
  },
  {
    id: 'ap-chemistry',
    title: 'AP Chemistry',
    shortTitle: 'Chemistry',
    description: 'Atomic structure, bonding, thermodynamics, kinetics, and equilibrium',
    questions: AP_CHEMISTRY,
    timeLimit: 1800,
    badge: '#0891b2',
    icon: '⚗',
    topics: ['Atomic Structure', 'Bonding', 'Thermodynamics', 'Kinetics', 'Equilibrium'],
  },
  {
    id: 'ap-biology',
    title: 'AP Biology',
    shortTitle: 'Biology',
    description: 'Cells, genetics, evolution, ecology, and biological systems',
    questions: AP_BIOLOGY,
    timeLimit: 1800,
    badge: '#059669',
    icon: '🧬',
    topics: ['Cell Biology', 'Genetics', 'Evolution', 'Ecology', 'Physiology'],
  },
  {
    id: 'ap-physics-1',
    title: 'AP Physics 1',
    shortTitle: 'Physics 1',
    description: 'Kinematics, forces, energy, momentum, waves, and electricity basics',
    questions: AP_PHYSICS_1,
    timeLimit: 1800,
    badge: '#d97706',
    icon: '⚡',
    topics: ['Kinematics', "Newton's Laws", 'Energy', 'Momentum', 'Waves', 'Circuits'],
  },
  {
    id: 'ap-us-history',
    title: 'AP US History',
    shortTitle: 'APUSH',
    description: 'American history from colonial era through the modern period',
    questions: AP_US_HISTORY,
    timeLimit: 1800,
    badge: '#dc2626',
    icon: '🇺🇸',
    topics: ['Colonial Era', 'Revolution', 'Civil War', 'Progressive Era', 'Cold War'],
  },
  {
    id: 'ap-english-literature',
    title: 'AP English Literature',
    shortTitle: 'Eng Lit',
    description: 'Close reading, literary analysis, poetry, drama, and prose fiction',
    questions: AP_ENGLISH_LITERATURE,
    timeLimit: 1800,
    badge: '#b45309',
    icon: '📖',
    topics: ['Poetry', 'Prose Fiction', 'Drama', 'Figurative Language', 'Tone & Style'],
  },
];

export function getAPSubject(id: string): APSubject | undefined {
  return AP_SUBJECTS.find((s) => s.id === id);
}

export const ALL_AP_QUESTIONS: DemoQuestion[] = AP_SUBJECTS.flatMap((s) => s.questions);

export {
  AP_CALCULUS_AB,
  AP_CALCULUS_BC,
  AP_CHEMISTRY,
  AP_BIOLOGY,
  AP_PHYSICS_1,
  AP_US_HISTORY,
  AP_ENGLISH_LITERATURE,
};
