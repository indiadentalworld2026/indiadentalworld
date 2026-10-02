/**
 * lib/jsonld.ts
 *
 * Generates JSON-LD structured data for each clinic section.
 * Injected via <script type="application/ld+json"> in generateMetadata() or layout.
 *
 * Compliant with:
 *  - Schema.org Dentist + FAQPage + BreadcrumbList
 *  - Google Rich Results guidelines
 *  - NDC (National Dental Commission) licence display requirement
 */

import type { ClinicProfile, Section, DayHours } from './clinic-data';

type DayKey = keyof ClinicProfile['openingHours'];

const SCHEMA_DAY: Record<DayKey, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
};

/**
 * Builds Schema.org OpeningHoursSpecification array.
 * Split sessions produce two entries for the same dayOfWeek — valid per spec.
 */
function buildOpeningHoursSpec(hours: ClinicProfile['openingHours']) {
  const specs: object[] = [];
  (Object.entries(hours) as [DayKey, DayHours][]).forEach(([dayKey, day]) => {
    if (!day) return; // closed
    day.slots.forEach((slot) => {
      specs.push({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: SCHEMA_DAY[dayKey],
        opens: slot.open,
        closes: slot.close,
      });
    });
  });
  return specs;
}

const BASE = 'https://indiadentalworld.com';

export function clinicJsonLd(clinic: ClinicProfile, section: Section) {
  const clinicUrl = `${BASE}/clinics/${clinic.slug}`;
  const sectionUrl = section === 'overview' ? clinicUrl : `${clinicUrl}/${section}`;

  const graphs: object[] = [
    // ── Dentist ────────────────────────────────────────────────────────────
    {
      '@type': 'Dentist',
      '@id': `${clinicUrl}#clinic`,
      name: clinic.name,
      description: `Multi-speciality dental clinic in ${clinic.locality}, ${clinic.city} offering ${clinic.specialties.join(', ')}.`,
      url: clinicUrl,
      telephone: clinic.phone,
      email: clinic.email,
      priceRange: clinic.priceRange,
      address: {
        '@type': 'PostalAddress',
        streetAddress: clinic.address,
        addressLocality: clinic.city,
        addressRegion: clinic.state,
        postalCode: clinic.pin,
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: clinic.lat,
        longitude: clinic.lng,
      },
      // Schema.org supports multiple OpeningHoursSpecification entries per day
      // for split/double sessions — one entry per slot.
      openingHoursSpecification: buildOpeningHoursSpec(clinic.openingHours),
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: clinic.rating.toString(),
        reviewCount: clinic.reviewCount.toString(),
        bestRating: '5',
      },
      medicalSpecialty: 'Dentistry',
      availableService: clinic.specialties.map((s) => ({
        '@type': 'MedicalProcedure',
        name: s,
      })),
      // NDC licence as identifier (National Dental Commission replaced DCI, Mar 2026)
      identifier: {
        '@type': 'PropertyValue',
        name: 'NDC Establishment Licence',
        value: clinic.ndcLicence,
      },
    },

    // ── BreadcrumbList ─────────────────────────────────────────────────────
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
        { '@type': 'ListItem', position: 2, name: clinic.city, item: `${BASE}/${clinic.city.toLowerCase()}` },
        { '@type': 'ListItem', position: 3, name: clinic.locality, item: `${BASE}/${clinic.city.toLowerCase()}/${clinic.locality.toLowerCase()}` },
        { '@type': 'ListItem', position: 4, name: clinic.name, item: clinicUrl },
        ...(section !== 'overview'
          ? [{ '@type': 'ListItem', position: 5, name: section.charAt(0).toUpperCase() + section.slice(1), item: sectionUrl }]
          : []),
      ],
    },
  ];

  // ── FAQPage (info section only) ───────────────────────────────────────────
  if (section === 'info' && clinic.faqs.length > 0) {
    graphs.push({
      '@type': 'FAQPage',
      mainEntity: clinic.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    });
  }

  // ── Team (Person entities) ────────────────────────────────────────────────
  if (section === 'team') {
    clinic.doctors.forEach((doc) => {
      graphs.push({
        '@type': 'Person',
        '@id': `${clinicUrl}/team#${doc.id}`,
        name: doc.name,
        jobTitle: doc.specialty,
        description: doc.bio,
        worksFor: { '@id': `${clinicUrl}#clinic` },
        identifier: {
          '@type': 'PropertyValue',
          name: 'NDC Registration',
          value: doc.ndcReg,
        },
      });
    });
  }

  return { '@context': 'https://schema.org', '@graph': graphs };
}
