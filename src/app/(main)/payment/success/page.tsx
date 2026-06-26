import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Payment Successful — Delta Tutors',
};

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div
        className="card-base max-w-md w-full p-10 text-center"
        style={{ background: 'var(--color-background)' }}
      >
        <div className="flex justify-center mb-6">
          <CheckCircle
            className="h-16 w-16"
            style={{ color: 'var(--color-success)' }}
          />
        </div>

        <h1
          className="text-2xl font-bold mb-3"
          style={{ color: 'var(--color-foreground)' }}
        >
          You&apos;re all set!
        </h1>

        <p className="text-sm mb-2" style={{ color: 'var(--color-muted-foreground)' }}>
          Your subscription is now active. You&apos;ll receive a confirmation email shortly.
        </p>
        <p className="text-sm mb-8" style={{ color: 'var(--color-muted-foreground)' }}>
          Head to your dashboard to get started or reach out if you have any questions.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            className="font-semibold"
            style={{ background: 'var(--gradient-primary)', color: '#fff' }}
          >
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="font-semibold">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
