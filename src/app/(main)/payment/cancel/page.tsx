import type { Metadata } from 'next';
import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Payment Cancelled — Delta Tutors',
};

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div
        className="card-base max-w-md w-full p-10 text-center"
        style={{ background: 'var(--color-background)' }}
      >
        <div className="flex justify-center mb-6">
          <XCircle
            className="h-16 w-16"
            style={{ color: 'var(--color-muted-foreground)', opacity: 0.5 }}
          />
        </div>

        <h1
          className="text-2xl font-bold mb-3"
          style={{ color: 'var(--color-foreground)' }}
        >
          Payment cancelled
        </h1>

        <p className="text-sm mb-8" style={{ color: 'var(--color-muted-foreground)' }}>
          No charges were made. You can return to the pricing page and try again whenever you&apos;re ready.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            className="font-semibold"
            style={{ background: 'var(--gradient-primary)', color: '#fff' }}
          >
            <Link href="/pricing">View Plans</Link>
          </Button>
          <Button asChild variant="outline" className="font-semibold">
            <Link href="/contact">Talk to Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
