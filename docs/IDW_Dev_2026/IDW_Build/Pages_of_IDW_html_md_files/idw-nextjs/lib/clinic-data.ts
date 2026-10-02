/**
 * lib/clinic-data.ts
 *
 * Data layer for clinic profiles.
 * In production: replace fetchClinic() with a call to your Postgres/Supabase/Firebase DB.
 * The shape defined here is the contract between the DB and the UI.
 */

export type Section = 'overview' | 'team' | 'results' | 'reviews' | 'life' | 'info';

export const SECTIONS: Section[] = ['overview', 'team', 'results', 'reviews', 'life', 'info'];

export const SECTION_LABELS: Record<Section, string> = {
  overview: 'Overview',
  team: 'Team',
  results: 'Results',
  reviews: 'Reviews',
  life: 'Clinic Life',
  info: 'Info & FAQs',
};

// ── Canonical section descriptions for SEO meta ──────────────────────────────
export const SECTION_META: Record<Section, { titleSuffix: string; description: (clinic: ClinicProfile) => string }> = {
  overview: {
    titleSuffix: '',
    description: (c) =>
      `${c.name} in ${c.locality}, ${c.city} — ${c.specialties.slice(0, 3).join(', ')} and more. Book online in 60 seconds.`,
  },
  team: {
    titleSuffix: '· Our Dentists',
    description: (c) =>
      `Meet the dental team at ${c.name}. ${c.doctors.length} qualified dentists in ${c.locality}, ${c.city}. NDC-registered specialists.`,
  },
  results: {
    titleSuffix: '· Patient Results',
    description: (c) =>
      `Before & after cases from ${c.name}. Implants, aligners, veneers, and smile makeovers in ${c.city}.`,
  },
  reviews: {
    titleSuffix: '· Patient Reviews',
    description: (c) =>
      `${c.rating} ★ from ${c.reviewCount} verified patients at ${c.name}, ${c.locality}. Read Google and IDW reviews.`,
  },
  life: {
    titleSuffix: '· Clinic Life',
    description: (c) =>
      `A look inside ${c.name} — equipment, ambience, and the team behind your care in ${c.locality}.`,
  },
  info: {
    titleSuffix: '· Info & FAQs',
    description: (c) =>
      `Directions, parking, insurance, hours, and FAQs for ${c.name} in ${c.locality}, ${c.city}.`,
  },
};

// ── Type definitions ──────────────────────────────────────────────────────────

export interface Doctor {
  id: string;
  name: string;
  degree: string;
  specialty: string;
  ndcReg: string;
  photoUrl: string;
  yearsExp: number;
  bio: string;
}

export interface BeforeAfterCase {
  id: string;
  treatment: string;
  beforeUrl: string;
  afterUrl: string;
  durationWeeks: number;
  consentBadge: boolean; // DPDP 2025 — must be true before publishing
}

export interface Review {
  id: string;
  platform: 'idw' | 'google';
  patientName: string;
  rating: number;
  date: string; // ISO
  body: string;
  treatmentTag?: string;
  verifiedPatient: boolean;
}

export interface FAQ {
  q: string;
  a: string;
}

/**
 * A single continuous time slot, e.g. { open: '09:00', close: '13:00' }
 */
export interface TimeSlot {
  open: string;  // HH:MM (24h)
  close: string; // HH:MM (24h)
}

/**
 * DayHours supports both patterns clinics use in India:
 *
 * Single session (most clinics):
 *   { slots: [{ open: '09:00', close: '20:00' }] }
 *
 * Split / double session (morning + evening — very common):
 *   { slots: [{ open: '09:00', close: '13:00' }, { open: '17:00', close: '21:00' }] }
 *
 * Closed:
 *   null
 */
export type DayHours = { slots: [TimeSlot] | [TimeSlot, TimeSlot] } | null;

/**
 * Helper: format DayHours into a display string.
 * e.g. "9:00 AM – 1:00 PM, 5:00 PM – 9:00 PM"
 */
export function formatHours(day: DayHours): string {
  if (!day) return 'Closed';
  return day.slots
    .map((s) => `${fmt(s.open)} – ${fmt(s.close)}`)
    .join(',  ');
}

function fmt(t: string): string {
  const [hStr, mStr] = t.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr ?? '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return m === '00' ? `${h} ${ampm}` : `${h}:${m} ${ampm}`;
}

export interface ClinicProfile {
  slug: string;
  name: string;
  tagline: string;
  locality: string;
  city: string;
  state: string;
  pin: string;
  address: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  specialties: string[];
  priceRange: '₹' | '₹₹' | '₹₹–₹₹₹' | '₹₹₹';
  heroPhotos: string[]; // exactly 5 — [main, tr, br, bl-top, bl-bottom]
  doctors: Doctor[];
  cases: BeforeAfterCase[];
  reviews: Review[];
  faqs: FAQ[];
  openingHours: {
    monday:    DayHours;
    tuesday:   DayHours;
    wednesday: DayHours;
    thursday:  DayHours;
    friday:    DayHours;
    saturday:  DayHours;
    sunday:    DayHours;
  };
  insurance: string[];
  parkingNotes: string;
  establishedYear: number;
  ndcLicence: string;
}

// ── Mock data (replace with real DB call) ────────────────────────────────────

const MOCK_CLINIC: ClinicProfile = {
  slug: 'koramangala-dental-clinic',
  name: 'Koramangala Dental Clinic',
  tagline: 'Where precision meets warmth',
  locality: 'Koramangala',
  city: 'Bengaluru',
  state: 'KA',
  pin: '560095',
  address: '42, 5th Cross, Koramangala 5th Block, Bengaluru 560095',
  phone: '+91-80-4112-3456',
  email: 'hello@kdcbengaluru.in',
  lat: 12.9352,
  lng: 77.6245,
  rating: 4.7,
  reviewCount: 65,
  specialties: ['Dental Implants', 'Invisible Aligners', 'Veneers', 'Root Canal', 'Paediatric Dentistry'],
  priceRange: '₹₹–₹₹₹',
  heroPhotos: [
    '/assets/clinics/koramangala/hero-main.jpg',
    '/assets/clinics/koramangala/hero-tr.jpg',
    '/assets/clinics/koramangala/hero-br.jpg',
    '/assets/clinics/koramangala/hero-bl1.jpg',
    '/assets/clinics/koramangala/hero-bl2.jpg',
  ],
  doctors: [
    {
      id: 'dr-sharma',
      name: 'Dr. Priya Sharma',
      degree: 'MDS (Prosthodontics)',
      specialty: 'Implants & Prosthetics',
      ndcReg: 'NDC-KA-2018-04821',
      photoUrl: '/assets/doctors/priya-sharma.jpg',
      yearsExp: 12,
      bio: 'Trained at MAHE Manipal. Placed 1,400+ implants. Fellow, International Team for Implantology (ITI).',
    },
    {
      id: 'dr-krishna',
      name: 'Dr. Arjun Krishna',
      degree: 'MDS (Orthodontics)',
      specialty: 'Clear Aligners & Braces',
      ndcReg: 'NDC-KA-2020-09134',
      photoUrl: '/assets/doctors/arjun-krishna.jpg',
      yearsExp: 7,
      bio: 'Certified Invisalign Go and Full provider. Handles 60+ active aligner cases at any time.',
    },
  ],
  cases: [],
  reviews: [],
  faqs: [
    { q: 'Do you accept cashless insurance?', a: 'Yes — CGHS, ECHS, and all major TPAs. Bring your card and photo ID.' },
    { q: 'Is parking available?', a: 'Covered basement parking for 12 vehicles, free for patients.' },
    { q: 'How long does a dental implant take?', a: 'Placement: 45–60 min per implant. Final crown: 3–4 months later after osseointegration.' },
  ],
  openingHours: {
    // Split session example — morning + evening
    monday:    { slots: [{ open: '09:00', close: '13:00' }, { open: '17:00', close: '21:00' }] },
    tuesday:   { slots: [{ open: '09:00', close: '13:00' }, { open: '17:00', close: '21:00' }] },
    wednesday: { slots: [{ open: '09:00', close: '13:00' }, { open: '17:00', close: '21:00' }] },
    thursday:  { slots: [{ open: '09:00', close: '13:00' }, { open: '17:00', close: '21:00' }] },
    friday:    { slots: [{ open: '09:00', close: '13:00' }, { open: '17:00', close: '21:00' }] },
    // Single session example — Saturday continuous
    saturday:  { slots: [{ open: '09:00', close: '18:00' }] },
    // Closed Sunday
    sunday:    null,
  },
  insurance: ['CGHS', 'ECHS', 'Star Health', 'HDFC ERGO', 'Niva Bupa'],
  parkingNotes: 'Covered basement, 12 bays, free for patients.',
  establishedYear: 2011,
  ndcLicence: 'NDC-KA-CE-2024-00412',
};

// ── Public API ────────────────────────────────────────────────────────────────

/** In production: hit your DB / edge cache here */
export async function fetchClinic(slug: string): Promise<ClinicProfile | null> {
  // TODO: replace with: const res = await fetch(`${process.env.API_BASE}/clinics/${slug}`)
  if (slug === MOCK_CLINIC.slug) return MOCK_CLINIC;
  return null;
}

export async function fetchAllSlugs(): Promise<string[]> {
  // TODO: replace with DB query of all active clinic slugs (for generateStaticParams)
  return [MOCK_CLINIC.slug];
}
