/**
 * components/panels/OverviewPanel.tsx
 * Treatments, prices, highlights — the default landing panel.
 */
import type { ClinicProfile } from '@/lib/clinic-data';

const TREATMENTS = [
  { name: 'Dental Implant (single)', from: 25000, note: 'titanium, 10-yr warranty' },
  { name: 'Invisible Aligners', from: 60000, note: 'full case, retainers included' },
  { name: 'Veneer (per tooth)', from: 8000, note: 'zirconia, shade-matched' },
  { name: 'Root Canal + Crown', from: 7500, note: 'single sitting available' },
  { name: 'Teeth Whitening', from: 4500, note: 'in-clinic Zoom' },
  { name: 'Full Mouth Rehab', from: 90000, note: 'custom plan after exam' },
];

export default function OverviewPanel({ clinic }: { clinic: ClinicProfile }) {
  return (
    <section className="panel panel--overview" aria-labelledby="overview-heading">
      <h2 id="overview-heading" className="panel__heading">Treatments & Prices</h2>
      <p className="panel__disclaimer">
        Prices are indicative, subject to clinical assessment. GST @18% applicable.
      </p>

      <table className="price-table" aria-label="Treatment pricing">
        <thead>
          <tr>
            <th scope="col">Treatment</th>
            <th scope="col" className="num">Starting from</th>
            <th scope="col">Note</th>
          </tr>
        </thead>
        <tbody>
          {TREATMENTS.map((t) => (
            <tr key={t.name}>
              <td>{t.name}</td>
              <td className="num mono">₹{t.from.toLocaleString('en-IN')}</td>
              <td className="muted">{t.note}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Highlights */}
      <ul className="highlight-chips" aria-label="Clinic highlights">
        {clinic.specialties.map((s) => (
          <li key={s} className="chip">{s}</li>
        ))}
      </ul>

      <p className="panel__established">
        Established {clinic.establishedYear} · NDC Lic. <span className="mono">{clinic.ndcLicence}</span>
      </p>
    </section>
  );
}
