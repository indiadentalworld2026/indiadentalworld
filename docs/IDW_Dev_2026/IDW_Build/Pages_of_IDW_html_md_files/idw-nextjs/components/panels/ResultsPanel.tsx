/**
 * components/panels/ResultsPanel.tsx
 *
 * Before/after cases with a lightbox for enlarged images.
 * DPDP 2025: only publishes cases where consentBadge === true.
 *
 * Lightbox is client-side (no library). Click any image → overlay.
 * Click overlay / × button / Esc key → close.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { ClinicProfile, BeforeAfterCase } from '@/lib/clinic-data';

interface LightboxState {
  src: string;
  alt: string;
}

export default function ResultsPanel({ clinic }: { clinic: ClinicProfile }) {
  const publishable = clinic.cases.filter((c) => c.consentBadge);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const open = useCallback((src: string, alt: string) => {
    setLightbox({ src, alt });
    document.body.style.overflow = 'hidden';
  }, []);

  const close = useCallback(() => {
    setLightbox(null);
    document.body.style.overflow = '';
  }, []);

  // Close on Esc
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, close]);

  return (
    <section className="panel panel--results" aria-labelledby="results-heading">
      <h2 id="results-heading" className="panel__heading">Patient Results</h2>
      <p className="panel__sub">
        All cases published with written patient consent (DPDP 2025 §&nbsp;6).
        Tap any photo to enlarge.
      </p>

      {publishable.length === 0 ? (
        <p className="panel__empty">Cases coming soon.</p>
      ) : (
        <ul className="cases-grid" role="list">
          {publishable.map((c) => (
            <CaseCard key={c.id} cas={c} onOpen={open} />
          ))}
        </ul>
      )}

      {/* ── Lightbox overlay ────────────────────────────────────────────── */}
      {lightbox && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          onClick={close}
        >
          {/* Stop propagation so clicking the image itself doesn't close */}
          <div className="lightbox__inner" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox__close"
              onClick={close}
              aria-label="Close enlarged image"
            >
              ×
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="lightbox__img"
            />
            <p className="lightbox__caption">{lightbox.alt}</p>
          </div>
        </div>
      )}
    </section>
  );
}

// ── Sub-component: one before/after case card ─────────────────────────────────

function CaseCard({
  cas,
  onOpen,
}: {
  cas: BeforeAfterCase;
  onOpen: (src: string, alt: string) => void;
}) {
  return (
    <li className="case-card">
      <div className="case-card__images">
        <CasePhoto
          src={cas.beforeUrl}
          alt={`Before — ${cas.treatment}`}
          label="Before"
          onOpen={onOpen}
        />
        <CasePhoto
          src={cas.afterUrl}
          alt={`After — ${cas.treatment}`}
          label="After"
          onOpen={onOpen}
        />
      </div>

      <div className="case-card__footer">
        <p className="case-card__label">
          {cas.treatment}
          <span className="case-card__duration">{cas.durationWeeks} weeks</span>
        </p>
        <span className="consent-badge" aria-label="Patient consent on file">
          ✓ Consent on file
        </span>
      </div>
    </li>
  );
}

function CasePhoto({
  src,
  alt,
  label,
  onOpen,
}: {
  src: string;
  alt: string;
  label: string;
  onOpen: (src: string, alt: string) => void;
}) {
  return (
    <figure className="case-photo">
      <button
        className="case-photo__btn"
        onClick={() => onOpen(src, alt)}
        aria-label={`Enlarge: ${alt}`}
        type="button"
      >
        <Image
          src={src}
          alt={alt}
          width={280}
          height={210}
          className="case-photo__img"
        />
        <span className="case-photo__zoom" aria-hidden="true">⤢</span>
      </button>
      <figcaption className="case-photo__label">{label}</figcaption>
    </figure>
  );
}
