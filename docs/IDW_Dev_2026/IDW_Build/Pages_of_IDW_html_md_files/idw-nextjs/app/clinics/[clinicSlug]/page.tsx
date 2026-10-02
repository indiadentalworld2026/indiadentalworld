/**
 * app/clinics/[clinicSlug]/page.tsx
 *
 * Overview section — the default route for a clinic profile.
 * URL: /clinics/koramangala-dental-clinic
 *
 * Rendered server-side (RSC). Exports generateMetadata() and generateStaticParams()
 * so Next.js pre-renders all clinic overview pages at build time.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { fetchClinic, fetchAllSlugs, SECTION_META } from '@/lib/clinic-data';
import { clinicJsonLd } from '@/lib/jsonld';
import OverviewPanel from '@/components/panels/OverviewPanel';

interface Props {
  params: { clinicSlug: string };
}

// ── Static generation ─────────────────────────────────────────────────────────
export async function generateStaticParams() {
  const slugs = await fetchAllSlugs();
  return slugs.map((clinicSlug) => ({ clinicSlug }));
}

// ── Per-page SEO metadata ─────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const clinic = await fetchClinic(params.clinicSlug);
  if (!clinic) return {};

  const meta = SECTION_META.overview;
  const title = `${clinic.name} | IndiaDentalWorld`;
  const description = meta.description(clinic);
  const url = `https://indiadentalworld.com/clinics/${clinic.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
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
export default async function ClinicOverviewPage({ params }: Props) {
  const clinic = await fetchClinic(params.clinicSlug);
  if (!clinic) notFound();

  const jsonLd = clinicJsonLd(clinic, 'overview');

  return (
    <>
      <Script
        id="clinic-overview-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OverviewPanel clinic={clinic} />
    </>
  );
}
