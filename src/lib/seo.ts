import type { Metadata } from 'next';
import { APP_NAME, APP_URL, APP_DESCRIPTION } from '@/constants';

/**
 * Central SEO helpers for public (marketing) pages.
 *
 * Why a helper: Next.js merges `metadata` shallowly, so a page that sets
 * `openGraph` replaces the parent's whole `openGraph` object. Building it in
 * one place guarantees every page gets its own canonical URL, og:url,
 * og:title and og:description instead of inheriting the homepage's.
 */

export const SITE_TAGLINE = 'Online SAT, ACT, AP & Coding Tutoring for US & Canadian Students';

/** Official social profiles (no tracking params). Used for Organization `sameAs`. */
export const SOCIAL_PROFILES = [
  'https://www.instagram.com/delta._tutors/',
  'https://www.linkedin.com/company/deltatutors/',
];

export const LOGO_PATH = '/images/logos/logo_5.png';

/** Served by src/app/opengraph-image.tsx. */
const DEFAULT_OG_IMAGE = '/opengraph-image';

export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path;
  const base = APP_URL.replace(/\/+$/, '');
  if (path === '/' || path === '') return base;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Strip HTML + collapse whitespace, then trim to a sentence-friendly length. */
export function toPlainText(input: string | null | undefined, maxLength = 160): string {
  if (!input) return '';
  const text = input
    .split('---META---')[0]
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|div|li|h[1-6])>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.–—-]+$/, '')}…`;
}

type PageMetaInput = {
  /** Page title WITHOUT the brand; the root layout template appends "| Delta Tutors". */
  title: string;
  description?: string;
  /** Path of the page, e.g. "/sat-prep". Used for canonical + og:url. */
  path: string;
  /** Use the title verbatim (no "| Delta Tutors" suffix). For the homepage. */
  absoluteTitle?: boolean;
  type?: 'website' | 'article';
  /** Explicit OG image(s). Omit to use the site-wide /opengraph-image. */
  images?: string[];
  /** Set when the route has its own opengraph-image.tsx; any explicit image would override it. */
  hasRouteOgImage?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  noIndex?: boolean;
};

export function pageMetadata({
  title,
  description = APP_DESCRIPTION,
  path,
  absoluteTitle = false,
  type = 'website',
  images,
  hasRouteOgImage = false,
  publishedTime,
  modifiedTime,
  authors,
  tags,
  noIndex = false,
}: PageMetaInput): Metadata {
  const socialTitle = absoluteTitle ? title : `${title} | ${APP_NAME}`;
  // Next replaces (not merges) a parent's openGraph object, so a page that sets
  // openGraph loses the root opengraph-image. Fall back to it explicitly; routes
  // with their own opengraph-image file (courses, blog posts) pass hasRouteOgImage
  // so the file convention can supply the image instead.
  const ogImages = images?.length ? images : hasRouteOgImage ? undefined : [DEFAULT_OG_IMAGE];

  const openGraph: NonNullable<Metadata['openGraph']> =
    type === 'article'
      ? {
          type: 'article',
          url: path,
          siteName: APP_NAME,
          locale: 'en_US',
          alternateLocale: ['en_CA'],
          title: socialTitle,
          description,
          publishedTime,
          modifiedTime,
          authors,
          tags,
          ...(ogImages ? { images: ogImages } : {}),
        }
      : {
          type: 'website',
          url: path,
          siteName: APP_NAME,
          locale: 'en_US',
          alternateLocale: ['en_CA'],
          title: socialTitle,
          description,
          ...(ogImages ? { images: ogImages } : {}),
        };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      ...(ogImages ? { images: ogImages } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** Metadata for pages that must never appear in search (dashboard, admin, auth, payment). */
export const NO_INDEX_METADATA: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

// ─── JSON-LD builders ────────────────────────────────────────────────────────

const ORG_ID = `${absoluteUrl('/')}#organization`;
const WEBSITE_ID = `${absoluteUrl('/')}#website`;

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': ORG_ID,
    name: APP_NAME,
    alternateName: ['DeltaTutors', 'Delta Tutors Online'],
    url: absoluteUrl('/'),
    logo: absoluteUrl(LOGO_PATH),
    description: APP_DESCRIPTION,
    sameAs: SOCIAL_PROFILES,
    areaServed: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'Canada' },
    ],
    knowsAbout: [
      'SAT preparation', 'Digital SAT', 'ACT preparation', 'AP exam preparation',
      'Python programming for teens', 'Online tutoring',
    ],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: APP_NAME,
    alternateName: 'DeltaTutors',
    url: absoluteUrl('/'),
    inLanguage: 'en-US',
    publisher: { '@id': ORG_ID },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function courseJsonLd(course: {
  title: string;
  slug: string;
  description: string;
  price: number;
  isFree: boolean;
  instructorName?: string | null;
}) {
  const url = absoluteUrl(`/courses/${course.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${url}#course`,
    name: course.title,
    description: course.description,
    url,
    inLanguage: 'en',
    provider: { '@type': 'Organization', '@id': ORG_ID, name: APP_NAME, sameAs: absoluteUrl('/') },
    offers: [
      {
        '@type': 'Offer',
        category: course.isFree || course.price === 0 ? 'Free' : 'Paid',
        price: course.isFree ? 0 : course.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url,
      },
    ],
    hasCourseInstance: [
      {
        '@type': 'CourseInstance',
        courseMode: 'Online',
        ...(course.instructorName
          ? { instructor: [{ '@type': 'Person', name: course.instructorName }] }
          : {}),
      },
    ],
  };
}

export function articleJsonLd(post: {
  title: string;
  slug: string;
  description: string;
  image?: string | null;
  authorName: string;
  datePublished: Date;
  dateModified: Date;
  tags?: string[];
}) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title.slice(0, 110),
    description: post.description,
    url,
    mainEntityOfPage: url,
    image: absoluteUrl(post.image || DEFAULT_OG_IMAGE),
    datePublished: post.datePublished.toISOString(),
    dateModified: post.dateModified.toISOString(),
    author: { '@type': 'Person', name: post.authorName },
    publisher: { '@id': ORG_ID, '@type': 'Organization', name: APP_NAME, logo: absoluteUrl(LOGO_PATH) },
    inLanguage: 'en-US',
    ...(post.tags?.length ? { keywords: post.tags.join(', ') } : {}),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
