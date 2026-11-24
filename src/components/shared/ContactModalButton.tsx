'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ContactModal, type ContactPreset } from './ContactModal';

type ContactModalButtonProps = Omit<React.ComponentProps<typeof Button>, 'onClick'> & {
  preset?: ContactPreset;
  /** Pre-fills the course / role field in the pop-up. */
  defaultCourse?: string;
};

/**
 * A button that opens the shared contact pop-up. Lets server components
 * (e.g. the careers page) use the pop-up without becoming client components.
 */
export function ContactModalButton({ preset, defaultCourse, children, ...buttonProps }: ContactModalButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="button" {...buttonProps} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <ContactModal open={open} onOpenChange={setOpen} preset={preset} defaultCourse={defaultCourse} />
    </>
  );
}
