import { redirect } from 'next/navigation';
import { demoProgramSlugFor } from '@/lib/mock-test/demo';
import { MOCK_TESTS_PATH } from '@/lib/mock-test/paths';

// The SAT practice page was folded into the Mock Test page. Old links (marketing
// pages, bookmarks) land there with the SAT program pre-selected.
export default async function SATExamPage() {
  const slug = await demoProgramSlugFor('SAT');
  redirect(slug ? `${MOCK_TESTS_PATH}?program=${encodeURIComponent(slug)}` : MOCK_TESTS_PATH);
}
