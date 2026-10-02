/**
 * components/GlobalNav.tsx
 * Site-wide navigation bar. Server component.
 */
import Link from 'next/link';

export default function GlobalNav() {
  return (
    <header className="global-nav" role="banner">
      <Link href="/" className="global-nav__logo" aria-label="IndiaDentalWorld home">
        <span className="global-nav__logo-idw">IDW</span>
        <span className="global-nav__logo-full">IndiaDentalWorld</span>
      </Link>
      <nav className="global-nav__links" aria-label="Site navigation">
        <Link href="/find">Find a Dentist</Link>
        <Link href="/treatments">Treatments</Link>
        <Link href="/about">About</Link>
      </nav>
      <div className="global-nav__actions">
        <Link href="/login" className="btn-ghost">Log in</Link>
        <Link href="/register-clinic" className="btn-primary">List your clinic</Link>
      </div>
    </header>
  );
}
