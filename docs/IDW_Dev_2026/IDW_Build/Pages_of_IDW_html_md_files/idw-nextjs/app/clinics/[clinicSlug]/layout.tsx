/**
 * app/clinics/[clinicSlug]/layout.tsx
 *
 * Shared layout for ALL clinic subpages:
 *   /clinics/koramangala-dental-clinic          → overview
 *   /clinics/koramangala-dental-clinic/team
 *   /clinics/koramangala-dental-clinic/results
 *   /clinics/koramangala-dental-clinic/reviews
 *   /clinics/koramangala-dental-clinic/life
 *   /clinics/koramangala-dental-clinic/info
 *
 * Renders:
 *  - IDW global nav
 *  - Clinic hero (photo masonry + booking card)
 *  - Section tab bar (real <a> links → real URLs → Google indexes each)
 *  - {children} = the active section panel
 *  - Footer
 *
 * Client navigation uses Next.js <Link prefetch> so tabs switch instantly
 * without a full page reload.
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchClinic, SECTIONS, SECTION_LABELS, type Section } from '@/lib/clinic-data';
import BookingCard from '@/components/BookingCard';
import ClinicHeroGallery from '@/components/ClinicHeroGallery';
import GlobalNav from '@/components/GlobalNav';
import SiteFooter from '@/components/SiteFooter';

interface Props {
  children: React.ReactNode;
  params: { clinicSlug: string };
}

export default async function ClinicLayout({ children, params }: Props) {
  const clinic = await fetchClinic(params.clinicSlug);
  if (!clinic) notFound();

  return (
    <>
      <GlobalNav />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="clinic-hero" aria-label="Clinic hero">
        <ClinicHeroGallery photos={clinic.heroPhotos} altBase={clinic.name} />
        <BookingCard clinic={clinic} />
      </section>

      {/* ── Tab bar ─────────────────────────────────────────────────────── */}
      {/* Each tab is a real <a> link — Google crawls and indexes each URL  */}
      <nav className="tab-bar" aria-label="Clinic sections">
        <ul role="tablist">
          {SECTIONS.map((section) => {
            const href =
              section === 'overview'
                ? `/clinics/${clinic.slug}`
                : `/clinics/${clinic.slug}/${section}`;
            return (
              <li key={section} role="presentation">
                <Link
                  href={href}
                  role="tab"
                  className="tab-link"
                  // active state is applied via CSS :global(.tab-link[aria-current="page"])
                  // Next.js does not auto-set aria-current; use a client wrapper if needed
                  prefetch={true}
                >
                  {SECTION_LABELS[section as Section]}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Section content (injected by each subpage) ──────────────────── */}
      <main className="section-content" id="main-content">
        {children}
      </main>

      <SiteFooter />
    </>
  );
}
