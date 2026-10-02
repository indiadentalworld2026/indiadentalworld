/**
 * components/panels/ReviewsPanel.tsx
 * IDW-verified + Google reviews with platform toggle.
 * "Verified patient" badge requires appointment record match in your DB.
 */
'use client';
import { useState } from 'react';
import type { ClinicProfile } from '@/lib/clinic-data';

export default function ReviewsPanel({ clinic }: { clinic: ClinicProfile }) {
  const [platform, setPlatform] = useState<'idw' | 'google'>('idw');

  const shown = clinic.reviews.filter((r) => r.platform === platform);

  return (
    <section className="panel panel--reviews" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="panel__heading">
        Patient Reviews
        <span className="rating-badge">★ {clinic.rating} · {clinic.reviewCount} reviews</span>
      </h2>

      <div className="platform-toggle" role="group" aria-label="Review source">
        {(['idw', 'google'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            aria-pressed={platform === p}
            className={`ptgl-btn${platform === p ? ' ptgl-btn--active' : ''}`}
          >
            {p === 'idw' ? 'IDW Verified' : 'Google'}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="panel__empty">Reviews coming soon.</p>
      ) : (
        <ul className="reviews-list" role="list">
          {shown.map((r) => (
            <li key={r.id} className="review-card">
              <div className="review-card__header">
                <span className="review-card__name">{r.patientName}</span>
                {r.verifiedPatient && (
                  <span className="verified-badge">✓ Verified patient</span>
                )}
                <span className="review-card__stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              </div>
              <p className="review-card__body">{r.body}</p>
              {r.treatmentTag && (
                <span className="chip chip--sm">{r.treatmentTag}</span>
              )}
              <time className="review-card__date" dateTime={r.date}>
                {new Date(r.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
