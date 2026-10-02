/**
 * components/panels/TeamPanel.tsx
 *
 * Renders the /clinics/:slug/team section.
 * Server component — no client JS needed.
 *
 * SEO value: Google indexes each doctor's name, specialty, NDC reg, and bio.
 * Schema.org Person entities are injected by the parent [section]/page.tsx.
 */

import Image from 'next/image';
import type { ClinicProfile } from '@/lib/clinic-data';

export default function TeamPanel({ clinic }: { clinic: ClinicProfile }) {
  return (
    <section className="panel panel--team" aria-labelledby="team-heading">
      <h2 id="team-heading" className="panel__heading">Our Dental Team</h2>
      <p className="panel__sub">
        Every doctor at {clinic.name} is registered with the National Dental Commission (NDC).
      </p>

      <ul className="doctor-grid" role="list">
        {clinic.doctors.map((doc) => (
          <li key={doc.id} className="doctor-card">
            <div className="doctor-card__photo">
              <Image
                src={doc.photoUrl}
                alt={`${doc.name}, ${doc.specialty}`}
                width={180}
                height={180}
                className="doctor-card__img"
              />
            </div>
            <div className="doctor-card__body">
              <h3 className="doctor-card__name">{doc.name}</h3>
              <p className="doctor-card__degree">{doc.degree}</p>
              <p className="doctor-card__specialty">{doc.specialty}</p>
              <p className="doctor-card__bio">{doc.bio}</p>
              <dl className="doctor-card__meta">
                <div>
                  <dt>Experience</dt>
                  <dd>{doc.yearsExp} years</dd>
                </div>
                <div>
                  <dt>NDC Reg.</dt>
                  <dd className="mono">{doc.ndcReg}</dd>
                </div>
              </dl>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
