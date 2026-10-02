/**
 * components/panels/InfoPanel.tsx
 * Hours, directions, insurance, parking, FAQs.
 *
 * Supports both single-session and split/double-session hours per day.
 * FAQPage JSON-LD injected by parent [section]/page.tsx → Google Rich Result.
 */
import type { ClinicProfile, DayHours } from '@/lib/clinic-data';
import { formatHours } from '@/lib/clinic-data';

type DayKey = keyof ClinicProfile['openingHours'];

const DAY_ROWS: { label: string; keys: DayKey[] }[] = [
  // Group Mon–Fri only if they're identical — otherwise show individually
  { label: 'Monday',    keys: ['monday'] },
  { label: 'Tuesday',   keys: ['tuesday'] },
  { label: 'Wednesday', keys: ['wednesday'] },
  { label: 'Thursday',  keys: ['thursday'] },
  { label: 'Friday',    keys: ['friday'] },
  { label: 'Saturday',  keys: ['saturday'] },
  { label: 'Sunday',    keys: ['sunday'] },
];

/**
 * Collapses consecutive days with identical hours into one row.
 * e.g. Mon–Fri all split 9–1 / 5–9 → single "Monday – Friday" row.
 */
function collapseHours(hours: ClinicProfile['openingHours']) {
  const days = DAY_ROWS.map(({ label, keys }) => ({
    label,
    hours: hours[keys[0]],
    key: keys[0],
  }));

  const rows: { label: string; hours: DayHours }[] = [];
  let i = 0;
  while (i < days.length) {
    const cur = days[i];
    let j = i + 1;
    // Extend run while next day has same hours string
    while (j < days.length && formatHours(days[j].hours) === formatHours(cur.hours)) j++;
    const runLabel =
      j - i > 1
        ? `${days[i].label} – ${days[j - 1].label}`
        : days[i].label;
    rows.push({ label: runLabel, hours: cur.hours });
    i = j;
  }
  return rows;
}

export default function InfoPanel({ clinic }: { clinic: ClinicProfile }) {
  const hoursRows = collapseHours(clinic.openingHours);

  return (
    <section className="panel panel--info" aria-labelledby="info-heading">
      <h2 id="info-heading" className="panel__heading">Info & FAQs</h2>

      <div className="info-grid">

        {/* ── Opening hours ──────────────────────────────────────────────── */}
        <div className="info-card">
          <h3 className="info-card__title">Opening hours</h3>
          <dl className="hours-list">
            {hoursRows.map(({ label, hours }) => (
              <div key={label} className="hours-row">
                <dt className="hours-row__day">{label}</dt>
                <dd className="hours-row__time">
                  {hours === null ? (
                    <span className="hours-closed">Closed</span>
                  ) : hours.slots.length === 2 ? (
                    // Split session — show both slots stacked
                    <span className="hours-split">
                      <span>{formatSlot(hours.slots[0])}</span>
                      <span className="hours-split__sep">·</span>
                      <span>{formatSlot(hours.slots[1])}</span>
                    </span>
                  ) : (
                    // Single session
                    <span>{formatSlot(hours.slots[0])}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <p className="info-note info-note--sm">
            Split timings: lunch break between sessions. Walk-ins welcome during open hours.
          </p>
        </div>

        {/* ── Address & Directions ───────────────────────────────────────── */}
        <div className="info-card">
          <h3 className="info-card__title">Address</h3>
          <address className="info-address">{clinic.address}</address>
          <a
            href={`https://maps.google.com/?q=${clinic.lat},${clinic.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary btn-sm"
          >
            Open in Google Maps ↗
          </a>
          <p className="info-note">Parking: {clinic.parkingNotes}</p>
        </div>

        {/* ── Insurance ─────────────────────────────────────────────────── */}
        <div className="info-card">
          <h3 className="info-card__title">Insurance accepted</h3>
          <ul className="insurance-list" role="list">
            {clinic.insurance.map((ins) => (
              <li key={ins} className="chip">{ins}</li>
            ))}
          </ul>
        </div>

      </div>

      {/* ── FAQs — server-rendered for Google Rich Results ────────────────── */}
      <div className="faq-section">
        <h3 className="faq-section__title">Frequently asked questions</h3>
        <dl className="faq-list">
          {clinic.faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <dt className="faq-q">{faq.q}</dt>
              <dd className="faq-a">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatSlot(slot: { open: string; close: string }): string {
  return `${toAmPm(slot.open)} – ${toAmPm(slot.close)}`;
}

function toAmPm(t: string): string {
  const [hStr, mStr = '00'] = t.split(':');
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return mStr === '00' ? `${h} ${ampm}` : `${h}:${mStr} ${ampm}`;
}
