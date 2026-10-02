/**
 * components/panels/LifePanel.tsx
 * Clinic ambience, equipment, social media previews.
 */
import type { ClinicProfile } from '@/lib/clinic-data';

export default function LifePanel({ clinic }: { clinic: ClinicProfile }) {
  return (
    <section className="panel panel--life" aria-labelledby="life-heading">
      <h2 id="life-heading" className="panel__heading">Clinic Life</h2>
      <p className="panel__sub">
        A look inside {clinic.name} — our space, equipment, and the people who care for you.
      </p>

      {/* Photo gallery — replace src with real clinic photos */}
      <ul className="life-grid" role="list" aria-label="Clinic photos">
        {clinic.heroPhotos.map((photo, i) => (
          <li key={i} className="life-grid__item">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt={`${clinic.name} — photo ${i + 1}`} loading="lazy" />
          </li>
        ))}
      </ul>

      <div className="life-social">
        <p className="life-social__cta">
          Follow us for before/afters, tips, and behind-the-scenes.
        </p>
        <div className="life-social__links">
          <a href={`https://instagram.com/indiadentalworld`} target="_blank" rel="noopener noreferrer" className="social-chip social-chip--insta">
            Instagram
          </a>
          <a href={`https://youtube.com/@indiadentalworld`} target="_blank" rel="noopener noreferrer" className="social-chip social-chip--yt">
            YouTube
          </a>
        </div>
      </div>
    </section>
  );
}
