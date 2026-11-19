import type { Metadata } from 'next';
import { SignUp } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Sign Up',
  robots: { index: false, follow: true },
};

export default function SignUpPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center py-16"
      style={{ background: 'var(--color-background-alt)' }}
    >
      <SignUp />
    </div>
  );
}
