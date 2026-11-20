'use client';

import { useState } from 'react';
import { Clock } from 'lucide-react';
import { HOURLY_RATE } from '@/constants';
import { CardContent, CardCta, FEATURE_CARD_CLASS } from './LinkCard';
import { ContactModal } from './ContactModal';

/**
 * Pay-as-you-go pricing card. Same layout as LinkCard, but the whole card is a
 * button that opens the shared "Talk to an Advisor" contact pop-up.
 */
export function PayAsYouGoCard({
  course,
  color,
  tint,
}: {
  /** Pre-fills the "Course / Subject" field in the contact form. */
  course?: string;
  color?: string;
  tint?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* A button can't contain headings, so the CTA button is stretched over the whole card instead. */}
      <div className={`${FEATURE_CARD_CLASS} relative`}>
        <CardContent
          icon={Clock}
          title="Pay-As-You-Go Tutoring"
          badge={`$${HOURLY_RATE}/hour · No monthly commitment`}
          description="Book a live 1:1 session with an expert tutor only when you need help, on your schedule."
          color={color}
          tint={tint}
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="self-start cursor-pointer after:absolute after:inset-0 after:rounded-[inherit] after:content-['']"
        >
          <CardCta label="Contact us" color={color} />
        </button>
      </div>
      {open && <ContactModal defaultCourse={course} onClose={() => setOpen(false)} />}
    </>
  );
}
