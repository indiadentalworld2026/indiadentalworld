/**
 * components/TabBar.tsx
 *
 * Client component that renders the section tab bar.
 * Uses Next.js usePathname() to highlight the active tab.
 *
 * Each tab is a real <Link> → real URL → Google indexes each section.
 * Active state is derived from the current URL, not JS state.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SECTIONS, SECTION_LABELS, type Section } from '@/lib/clinic-data';

interface Props {
  clinicSlug: string;
}

export default function TabBar({ clinicSlug }: Props) {
  const pathname = usePathname();

  function hrefFor(section: Section) {
    return section === 'overview'
      ? `/clinics/${clinicSlug}`
      : `/clinics/${clinicSlug}/${section}`;
  }

  function isActive(section: Section) {
    const href = hrefFor(section);
    // Overview is active when path is exactly /clinics/slug
    if (section === 'overview') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  }

  return (
    <nav className="tab-bar" aria-label="Clinic sections">
      <ul role="tablist" className="tab-bar__list">
        {SECTIONS.map((section) => {
          const active = isActive(section as Section);
          return (
            <li key={section} role="presentation">
              <Link
                href={hrefFor(section as Section)}
                role="tab"
                aria-selected={active}
                aria-current={active ? 'page' : undefined}
                className={`tab-link${active ? ' tab-link--active' : ''}`}
                prefetch={true}
              >
                {SECTION_LABELS[section as Section]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
