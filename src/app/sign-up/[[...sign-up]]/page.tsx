import { SignUp } from '@clerk/nextjs';

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
