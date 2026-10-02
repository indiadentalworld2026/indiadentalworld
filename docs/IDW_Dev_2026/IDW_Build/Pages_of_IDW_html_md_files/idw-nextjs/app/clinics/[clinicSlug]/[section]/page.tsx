/**
 * app/clinics/[clinicSlug]/[section]/page.tsx
 *
 * Handles all 5 non-overview section routes:
 *   /clinics/:slug/team
 *   /clinics/:slug/results
 *   /clinics/:slug/reviews
 *   /clinics/:slug/life
 *   /clinics/:slug/info
 *
 * Each gets its own <title>, <meta description>, canonical URL, and JSON-LD.
 * Google crawls and indexes each URL independently → 6× the indexed pages per clinic.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import {
  fetchClinic,
  fetchAllSlugs,
  SECTIONS,
  SECTION_META,
  type Section,
} from '@/lib/clinic-data';
import { clinicJsonLd } from '@/lib/jsonld';

// ── Section panel components ──────────────────────────────────────────────────
import TeamPanel from '@/components/panels/TeamPanel';
import ResultsPanel from '@/components/panels/ResultsPanel';
import ReviewsPanel from '@/components/panels/ReviewsPanel';
import LifePanel from '@/components/panels/LifePanel';
import InfoPanel from '@/components/panels/InfoPanel';

const PANEL_MAP: Record<string, React.ComponentType<{ clinic: Awaited<ReturnType<typeof fetchClinic>> }>> = {
  team: TeamPanel as any,
  results: ResultsPanel as any,
  reviews: ReviewsPanel as any,
  life: LifePanel as any,
  info: InfoPanel as any,
};

interface Props {
  params: { clinicSlug: string; section: string };
}

// ── Static generation ─────────────────────────────────────────────────────────
export async function generateStaticParams() {
  const slugs = await fetchAllSlugs();
  const sectionList = SECTIONS.filter((s) => s !== 'overview');
  return slugs.flatMap((clinicSlug) =>
    sectionList.map((section) => ({ clinicSlug, section }))
  );
  // For 10,000 clinics × 5 sections = 50,000 static pages.
  // Use ISR (revalidate: 3600) instead of full static if build time is a concern.
}

// ── Per-page SEO metadata ─────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { clinicSlug, section } = params;

  // 404 invalid sections before hitting the DB
  if (!SECTIONS.includes(section as Section) || section === 'overview') return {};

  const clinic = await fetchClinic(clinicSlug);
  if (!clinic) return {};

  const meta = SECTION_META[section as Section];
  const title = `${clinic.name} ${meta.titleSuffix} | IndiaDentalWorld`;
  const description = meta.description(clinic);
  const url = `https://indiadentalworld.com/clinics/${clinicSlug}/${section}`;
  const canonical = `https://indiadentalworld.com/clinics/${clinicSlug}/${section}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [{ url: clinic.heroPhotos[0], width: 1200, height: 630, alt: clinic.name }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [clinic.heroPhotos[0]] },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function ClinicSectionPage({ params }: Props) {
  const { clinicSlug, section } = params;

  // Guard invalid section slugs
  if (!SECTIONS.includes(section as Section) || section === 'overview') notFound();

  const clinic = await fetchClinic(clinicSlug);
  if (!clinic) notFound();

  const Panel = PANEL_MAP[section];
  if (!Panel) notFound();

  const jsonLd = clinicJsonLd(clinic, section as Section);

  return (
    <>
      <Script
        id={`clinic-${section}-jsonld`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Panel clinic={clinic} />
    </>
  );
}
