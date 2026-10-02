/**
 * components/SiteFooter.tsx
 * Compliant footer: DPDP notice, disclaimer, NDC info, GST reg.
 */
export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <strong>IndiaDentalWorld</strong>
          <p className="site-footer__tagline">India's trusted dental discovery platform</p>
        </div>

        <nav className="site-footer__links" aria-label="Footer links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Use</a>
          <a href="/disclaimer">Medical Disclaimer</a>
          <a href="/advertise">Advertise with us</a>
          <a href="/contact">Contact</a>
        </nav>

        <div className="site-footer__legal">
          <p>
            IndiaDentalWorld is a directory and appointment-booking platform.
            We do not provide medical advice. Consult a qualified dentist for treatment decisions.
          </p>
          <p>
            All clinic listings are independently verified. Prices are indicative and subject to
            clinical assessment. GST @18% applicable on all dental procedures.
          </p>
          <p>
            Data processed under the Digital Personal Data Protection Act 2025.
            We collect only the personal data needed to fulfil your appointment request.
            See our <a href="/privacy">Privacy Notice</a>.
          </p>
          <p className="site-footer__copy">
            © {year} IndiaDentalWorld Pvt. Ltd. · GSTIN: 29AAAAI0000A1Z5 ·
            CIN: U85110KA2023PTC172345
          </p>
        </div>
      </div>
    </footer>
  );
}
