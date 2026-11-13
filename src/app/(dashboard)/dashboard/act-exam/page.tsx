import { redirect } from 'next/navigation';
import { demoProgramSlugFor } from '@/lib/mock-test/demo';
import { MOCK_TESTS_PATH } from '@/lib/mock-test/paths';

// The ACT practice page was folded into the Mock Test page. Old links (marketing
// pages, bookmarks) land there with the ACT program pre-selected.
export default async function ACTExamPage() {
  const slug = await demoProgramSlugFor('ACT');
  redirect(slug ? `${MOCK_TESTS_PATH}?program=${encodeURIComponent(slug)}` : MOCK_TESTS_PATH);
}
