import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center py-16"
      style={{ background: 'var(--color-background-alt)' }}
    >
      <SignIn />
    </div>
  );
}
