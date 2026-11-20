import { CalendarDays, Calculator, type LucideIcon } from 'lucide-react';
import type { ExamToolLink } from '@/constants';

/** Icon for each kind of exam tool; shared by the tool cards and the home hub. */
export const TOOL_ICONS: Record<ExamToolLink['kind'], LucideIcon> = {
  dates: CalendarDays,
  calculator: Calculator,
};
