/**
 * components/BookingCard.tsx
 *
 * The booking widget that lives in the hero's right column.
 * Client component — handles form state and submission.
 *
 * Compliance:
 *  - Phone validated as Indian mobile (6–9 prefix, 10 digits)
 *  - DPDP 2025: explicit consent checkbox before submission
 *  - ASCI: prices labelled "subject to clinical assessment" + GST @18%
 *  - No form action to external URL — submission goes to /api/bookings (your backend)
 */

'use client';

import { useState, useRef } from 'react';
import type { ClinicProfile } from '@/lib/clinic-data';

const TREATMENTS = [
  'Dental Implant (single)',
  'Dental Implant (full arch)',
  'Invisible Aligners',
  'Veneer (per tooth)',
  'Root Canal Treatment',
  'Teeth Whitening',
  'Crown (zirconia)',
  'Consultation',
];

interface Props {
  clinic: ClinicProfile;
}

export default function BookingCard({ clinic }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const data = new FormData(e.currentTarget);
    const phone = (data.get('phone') as string).trim();

    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      setError('Enter a valid 10-digit Indian mobile number.');
      return;
    }

    const consent = data.get('consent');
    if (!consent) {
      setError('Please accept the data consent to proceed.');
      return;
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicSlug: clinic.slug,
          name: data.get('name'),
          phone,
          treatment: data.get('treatment'),
          doctor: data.get('doctor'),
          date: data.get('date'),
          time: data.get('time'),
          consentGiven: true,
          consentTs: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error('Server error');
      setSubmitted(true);
      formRef.current?.reset();
    } catch {
      setError('Something went wrong. Please call us directly.');
    }
  };

  // Default date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = new Date().toISOString().split('T')[0];
  const defaultDate = tomorrow.toISOString().split('T')[0];

  return (
    <aside className="booking-card" aria-label="Book appointment">
      <div className="booking-card__header">
        <span className="booking-card__rating">★ {clinic.rating}</span>
        <span className="booking-card__reviews">({clinic.reviewCount} reviews)</span>
      </div>

      {submitted ? (
        <div className="booking-card__success" role="alert">
          <p>✓ Appointment requested.</p>
          <p>We'll confirm via SMS within 10 minutes.</p>
          <button onClick={() => setSubmitted(false)} className="btn-secondary">
            Book another
          </button>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="booking-form" noValidate>
          <label className="form-label">
            Your name
            <input name="name" type="text" placeholder="Full name" required className="form-input" />
          </label>

          <label className="form-label">
            Mobile number *
            <input name="phone" type="tel" placeholder="10-digit mobile" required className="form-input" />
          </label>

          <label className="form-label">
            Treatment
            <select name="treatment" required className="form-select">
              <option value="">Select treatment</option>
              {TREATMENTS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>

          <label className="form-label">
            Preferred doctor
            <select name="doctor" className="form-select">
              <option value="">Any available</option>
              {clinic.doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </label>

          <div className="form-row">
            <label className="form-label">
              Date *
              <input name="date" type="date" min={minDate} defaultValue={defaultDate} required className="form-input" />
            </label>
            <label className="form-label">
              Time *
              <select name="time" required className="form-select">
                <option value="">Select slot</option>
                {['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00','18:00','19:00'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>

          {/* DPDP 2025 consent — mandatory */}
          <label className="form-consent">
            <input name="consent" type="checkbox" required />
            <span>
              I consent to {clinic.name} contacting me via SMS/WhatsApp for this appointment.{' '}
              <a href="/privacy" target="_blank" rel="noopener">Privacy notice</a>
            </span>
          </label>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button type="submit" className="btn-primary btn-full">
            Request appointment →
          </button>

          <p className="form-disclaimer">
            Prices subject to clinical assessment. GST @18% applicable.
          </p>
        </form>
      )}
    </aside>
  );
}
